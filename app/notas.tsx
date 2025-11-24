import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* -------------------------
   Helpers: color / conversions
   ------------------------- */
const clamp = (v: number, a = 0, b = 255) => Math.min(b, Math.max(a, Math.round(v)));

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const s = x.toString(16);
        return s.length === 1 ? "0" + s : s;
      })
      .join("")
  ).toUpperCase();
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b };
  } else if (h.length === 6) {
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}
function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= hp && hp < 1) {
    r = c;
    g = x;
    b = 0;
  } else if (1 <= hp && hp < 2) {
    r = x;
    g = c;
    b = 0;
  } else if (2 <= hp && hp < 3) {
    r = 0;
    g = c;
    b = x;
  } else if (3 <= hp && hp < 4) {
    r = 0;
    g = x;
    b = c;
  } else if (4 <= hp && hp < 5) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const m = l - c / 2;
  r = clamp((r + m) * 255);
  g = clamp((g + m) * 255);
  b = clamp((b + m) * 255);
  return { r, g, b };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/* -------------------------
   Component
   ------------------------- */
export default function NotasScreen() {
  const router = useRouter();
  const editorRef = useRef<RichEditor | null>(null);

  // note fields
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contenidoHtml, setContenidoHtml] = useState("");

  // editor "active" styles (affect future typing)
  const [activeFontSize, setActiveFontSize] = useState<number>(16);
  const [activeFontFamily, setActiveFontFamily] = useState<string>("System");
  const [activeColor, setActiveColor] = useState<string>("#111111");

  // modals
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [fontModalVisible, setFontModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);

  // color inputs
  const [hexInput, setHexInput] = useState("#111111");
  const [rInput, setRInput] = useState("17");
  const [gInput, setGInput] = useState("17");
  const [bInput, setBInput] = useState("17");
  const [hInput, setHInput] = useState("0");
  const [sInput, setSInput] = useState("0");
  const [lInput, setLInput] = useState("7");

  // palettes + fonts + sizes
  const quickPalette = [
    { name: "Negro", hex: "#000000" },
    { name: "Negro intenso", hex: "#111111" },
    { name: "Maroon", hex: "#7A1F1F" },
    { name: "Rojo", hex: "#C76C6C" },
    { name: "Rosa", hex: "#FFC0CB" },
    { name: "Azul", hex: "#6B6BFF" },
    { name: "Verde", hex: "#2E8B57" },
    { name: "Amarillo", hex: "#FFD700" },
    { name: "Gris", hex: "#808080" },
    { name: "Blanco", hex: "#FFFFFF" },
  ];
  const defaultSizes = Array.from(new Set([12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96, 100]));
  const fonts = [
    { key: "System", label: "Default" },
    { key: "serif", label: "Serif" },
    { key: "sans-serif", label: "Sans-serif" },
    { key: "monospace", label: "Monospace" },
    { key: "Courier", label: "Courier" }, // ejemplo de font adicional
  ];

  /* -------------------------
     UTIL: aplicador de estilo
     - si hay selección -> envuelve la selección en <span style="...">...</span>
     - si NO hay selección -> inserta un span vacío con estilo y pone el cursor dentro
     Esto hace que lo nuevo que el usuario escriba herede ese estilo.
     ------------------------- */
  const applyStyleToSelectionOrCaret = (opts: { color?: string; fontSizePx?: number; fontFamily?: string }) => {
    const parts: string[] = [];
    if (opts.color) parts.push(`color: ${opts.color} !important`);
    if (opts.fontSizePx) parts.push(`font-size: ${opts.fontSizePx}px !important`);
    if (opts.fontFamily) parts.push(`font-family: ${opts.fontFamily} !important`);
    const styleString = parts.join("; ");

    // JS to run inside editor iframe
    const js = `
      (function(){
        try {
          var sel = window.getSelection();
          if (!sel) return;
          if (sel.rangeCount === 0) return;
          var range = sel.getRangeAt(0);
          var span = document.createElement('span');
          span.setAttribute('data-rn-styled', 'true');
          span.style.cssText = "${styleString}";
          if (range.collapsed) {
            // insert zero-width placeholder inside span so new typing inherits style
            span.appendChild(document.createTextNode('\\u200b'));
            range.insertNode(span);
            // put caret inside span after the zero-width char
            var newRange = document.createRange();
            newRange.setStart(span.firstChild, 1);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            // remove zero-width placeholder if user types? keep it for inheritance
          } else {
            // wrap selection
            span.appendChild(range.extractContents());
            range.insertNode(span);
            // place caret after inserted span
            sel.removeAllRanges();
            var after = document.createRange();
            after.setStartAfter(span);
            after.collapse(true);
            sel.addRange(after);
          }
        } catch(e) {
          console.error(e);
        }
      })();
    `;
    editorRef.current?.commandDOM(js);
  };

  // When user picks a font size (apply to selection or cursor, but also set active state for future typing)
  const onPickFontSize = (px: number) => {
    setActiveFontSize(px);
    // apply to selection / caret
    applyStyleToSelectionOrCaret({ fontSizePx: px });
    setSizeModalVisible(false);
  };
  // When user picks a font family
  const onPickFontFamily = (ff: string) => {
    setActiveFontFamily(ff);
    applyStyleToSelectionOrCaret({ fontFamily: ff });
    setFontModalVisible(false);
  };
  // When picks color
  const onPickColor = (hex: string) => {
    setHexInput(hex);
    const rgb = hexToRgb(hex);
    if (rgb) {
      const { r, g, b } = rgb;
      const hsl = rgbToHsl(r, g, b);
      setRInput(String(r));
      setGInput(String(g));
      setBInput(String(b));
      setHInput(String(hsl.h));
      setSInput(String(hsl.s));
      setLInput(String(hsl.l));
    }
    setActiveColor(hex);
    applyStyleToSelectionOrCaret({ color: hex });
    setColorModalVisible(false);
  };

  // Color modal application from inputs (HEX)
  const applyColorFromInputs = () => {
    const hex = hexInput.startsWith("#") ? hexInput : "#" + hexInput;
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
      Alert.alert("HEX inválido", "Ingresa un HEX válido (ej. #FF00AA).");
      return;
    }
    onPickColor(hex);
  };

  // helpers to sync rgb/hsl/hex inputs
  const onChangeRGB = (rStr: string, gStr: string, bStr: string) => {
    const r = clamp(Number(rStr || 0));
    const g = clamp(Number(gStr || 0));
    const b = clamp(Number(bStr || 0));
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    setHexInput(hex);
    setRInput(String(r));
    setGInput(String(g));
    setBInput(String(b));
    setHInput(String(hsl.h));
    setSInput(String(hsl.s));
    setLInput(String(hsl.l));
  };
  const onChangeHSL = (hStr: string, sStr: string, lStr: string) => {
    const h = Math.max(0, Math.min(360, Number(hStr || 0)));
    const s = Math.max(0, Math.min(100, Number(sStr || 0)));
    const l = Math.max(0, Math.min(100, Number(lStr || 0)));
    const { r, g, b } = hslToRgb(h, s, l);
    const hex = rgbToHex(r, g, b);
    setHexInput(hex);
    setRInput(String(r));
    setGInput(String(g));
    setBInput(String(b));
    setHInput(String(h));
    setSInput(String(s));
    setLInput(String(l));
  };
  const onChangeHEX = (hexRaw: string) => {
    const hex = hexRaw.replace(" ", "");
    setHexInput(hex);
    const rgb = hexToRgb(hex.startsWith("#") ? hex : "#" + hex);
    if (rgb) {
      const { r, g, b } = rgb;
      const hsl = rgbToHsl(r, g, b);
      setRInput(String(r));
      setGInput(String(g));
      setBInput(String(b));
      setHInput(String(hsl.h));
      setSInput(String(hsl.s));
      setLInput(String(hsl.l));
    }
  };

  /* -------------------------
     Save note (same logic you had)
     ------------------------- */
  const saveNote = async () => {
    try {
      const html = await editorRef.current?.getContentHtml();
      const plainText = (contenidoHtml || "").replace(/<[^>]*>/g, "").slice(0, 120);
      const note = {
        id: `${Date.now()}`,
        titulo: titulo || "Sin título",
        contenido: plainText || "Sin contenido",
        contenidoHtml: html ?? "",
        categoria: categoria || "General",
        fecha: new Date().toISOString(),
        color: "#EDEDED",
        border: "#D3D3D3",
        meta: { fontSize: activeFontSize, fontFamily: activeFontFamily, textColor: activeColor },
      };
      const raw = await AsyncStorage.getItem("NOTES");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(note);
      await AsyncStorage.setItem("NOTES", JSON.stringify(arr));
      router.push("/historial");
    } catch (e) {
      Alert.alert("Error", "No fue posible guardar la nota.");
      console.error(e);
    }
  };

  /* -------------------------
     Image picker (same)
     ------------------------- */
  const pickImageAndInsert = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });
      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (!asset) return;
      if (!asset.base64) {
        Alert.alert("Error", "No se pudo convertir la imagen.");
        return;
      }
      const base64Img = `data:image/jpeg;base64,${asset.base64}`;
      editorRef.current?.insertImage(base64Img);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  /* -------------------------
     Keep editorStyle updated so new typing also inherits global active style visually.
     Note: the applyStyleToSelectionOrCaret function handles caret insertion for precise inheritance.
     ------------------------- */
  const editorContentStyle = {
    backgroundColor: "#fff",
    color: activeColor,
    cssText: `font-size: ${activeFontSize}px; font-family: ${activeFontFamily}; padding: 10px;`,
  };

  // initialize hex/rgb/hsl from activeColor when modal opened
  useEffect(() => {
    const rgb = hexToRgb(activeColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHexInput(activeColor);
      setRInput(String(rgb.r));
      setGInput(String(rgb.g));
      setBInput(String(rgb.b));
      setHInput(String(hsl.h));
      setSInput(String(hsl.s));
      setLInput(String(hsl.l));
    }
  }, [colorModalVisible]);

  /* -------------------------
     Render
     ------------------------- */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
            <Text style={styles.title}>Crear nota</Text>

            <Text style={styles.label}>Título</Text>
            <TextInput placeholder="Título..." value={titulo} onChangeText={setTitulo} style={styles.input} placeholderTextColor="#888" />

            <Text style={styles.label}>Categoría (opcional)</Text>
            <TextInput placeholder="Ej. Personal, Trabajo..." value={categoria} onChangeText={setCategoria} style={styles.input} placeholderTextColor="#888" />

            {/* Controls row: show active values (size, font, color) */}
            <View style={styles.controlsRow}>
              <View style={styles.controlBlock}>
                <Text style={{ marginBottom: 6 }}>Tamaño</Text>
                <TouchableOpacity onPress={() => setSizeModalVisible(true)} style={[styles.smallBtn]}>
                  <Text>{activeFontSize}px ▾</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.controlBlock}>
                <Text style={{ marginBottom: 6 }}>Fuente</Text>
                <TouchableOpacity onPress={() => setFontModalVisible(true)} style={[styles.smallBtn]}>
                  <Text>{activeFontFamily === "System" ? "Default" : activeFontFamily} ▾</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.controlBlock}>
                <Text style={{ marginBottom: 6 }}>Color</Text>
                <TouchableOpacity onPress={() => setColorModalVisible(true)} style={[styles.smallBtn, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: activeColor, borderWidth: 1, borderColor: "#ccc" }} />
                    <Text>{/* show palette name if found else 'Color' */}{(quickPalette.find(p => p.hex.toUpperCase() === activeColor.toUpperCase()) || { name: 'Color' }).name}</Text>
                  </View>
                  <Text>▾</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.controlBlock, { justifyContent: "flex-end", alignItems: "flex-end" }]}>
                <Text style={{ marginBottom: 6 }}>Imagen</Text>
                <TouchableOpacity onPress={pickImageAndInsert} style={styles.smallBtn}>
                  <Text>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Editor area */}
            <View style={[styles.editorWrap, { height: 420 }]}>
              <RichEditor
                ref={editorRef}
                initialContentHTML={contenidoHtml}
                editorStyle={editorContentStyle as any}
                placeholder="Escribe tu nota..."
                onChange={(html) => setContenidoHtml(html)}
                style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}
              />
            </View>

            <RichToolbar
              editor={editorRef}
              selectedIconTint="#2095F2"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.heading1,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.insertImage,
              ]}
              iconMap={{
                [actions.insertImage]: (props: any) => <Ionicons name="image" size={22} color={props.tintColor} />,
                [actions.heading1]: (props: any) => <Text style={{ color: props.tintColor }}>H1</Text>,
              }}
              style={{ backgroundColor: "#fafafa", borderRadius: 8, marginTop: 8 }}
              insertImage={(uri: string) => {
                const low = uri.toLowerCase();
                if (!(low.endsWith(".jpg") || low.endsWith(".jpeg") || low.endsWith(".png"))) {
                  Alert.alert("Formato no válido", "Solo se aceptan imágenes .jpg / .jpeg / .png");
                  return;
                }
                editorRef.current?.insertImage(uri);
              }}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Guardar nota</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal: Font Sizes (lista estilo Word) */}
        <Modal visible={sizeModalVisible} animationType="slide" transparent>
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modal}>
              <Text style={modalStyles.modalTitle}>Tamaño de fuente</Text>
              <FlatList
                data={defaultSizes}
                keyExtractor={(i) => String(i)}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onPickFontSize(item)} style={modalStyles.row}>
                    <Text style={{ fontSize: item }}>{item}px</Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 300 }}
              />
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Text>Personalizado:</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="ej. 28"
                  style={{ borderWidth: 1, borderColor: "#ddd", padding: 8, borderRadius: 6, minWidth: 100 }}
                  onSubmitEditing={(e) => {
                    const val = Number(e.nativeEvent.text || 16);
                    if (!isNaN(val) && val > 0 && val <= 100) onPickFontSize(val);
                    else Alert.alert("Valor inválido", "Ingresa un número entre 1 y 100.");
                  }}
                />
              </View>

              <TouchableOpacity style={modalStyles.closeBtn} onPress={() => setSizeModalVisible(false)}>
                <Text style={{ color: "#fff" }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: Font Family */}
        <Modal visible={fontModalVisible} animationType="slide" transparent>
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modal}>
              <Text style={modalStyles.modalTitle}>Seleccionar fuente</Text>
              <FlatList
                data={fonts}
                keyExtractor={(f) => f.key}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onPickFontFamily(item.key)} style={modalStyles.row}>
                    <Text style={{ fontFamily: item.key as any }}>{item.label}</Text>
                    <Text style={{ color: "#888" }}>{item.key}</Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 300 }}
              />
              <TouchableOpacity style={modalStyles.closeBtn} onPress={() => setFontModalVisible(false)}>
                <Text style={{ color: "#fff" }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: Color Palette + Advanced inputs */}
        <Modal visible={colorModalVisible} animationType="slide" transparent>
          <View style={modalStyles.overlay}>
            <View style={[modalStyles.modal, { maxHeight: "85%" }]}>
              <Text style={modalStyles.modalTitle}>Selector de color</Text>

              <Text style={{ marginBottom: 6 }}>Paleta rápida</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {quickPalette.map((p) => (
                  <TouchableOpacity
                    key={p.hex}
                    onPress={() => onPickColor(p.hex)}
                    style={{ marginRight: 8, alignItems: "center" }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: p.hex, borderWidth: 1, borderColor: "#ccc" }} />
                    <Text style={{ fontSize: 11 }}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }} />

              <Text style={{ marginBottom: 6 }}>HEX</Text>
              <TextInput value={hexInput} onChangeText={onChangeHEX} placeholder="#RRGGBB" style={styles.input} />

              <Text style={{ marginTop: 6, marginBottom: 6 }}>RGB</Text>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <TextInput value={rInput} onChangeText={(v) => onChangeRGB(v, gInput, bInput)} keyboardType="numeric" style={modalStyles.smallNum} />
                <TextInput value={gInput} onChangeText={(v) => onChangeRGB(rInput, v, bInput)} keyboardType="numeric" style={modalStyles.smallNum} />
                <TextInput value={bInput} onChangeText={(v) => onChangeRGB(rInput, gInput, v)} keyboardType="numeric" style={modalStyles.smallNum} />
                <View style={{ marginLeft: 8 }}>
                  <Text>Preview</Text>
                  <View style={{ width: 36, height: 36, backgroundColor: hexInput, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 }} />
                </View>
              </View>

              <Text style={{ marginTop: 10, marginBottom: 6 }}>HSL</Text>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <TextInput value={hInput} onChangeText={(v) => onChangeHSL(v, sInput, lInput)} keyboardType="numeric" style={modalStyles.smallNum} />
                <TextInput value={sInput} onChangeText={(v) => onChangeHSL(hInput, v, lInput)} keyboardType="numeric" style={modalStyles.smallNum} />
                <TextInput value={lInput} onChangeText={(v) => onChangeHSL(hInput, sInput, v)} keyboardType="numeric" style={modalStyles.smallNum} />
                <Text style={{ marginLeft: 8 }}>Hue / Sat / Light</Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
                <TouchableOpacity onPress={applyColorFromInputs} style={[modalStyles.actionBtn, { backgroundColor: hexInput }]}>
                  <Text style={{ color: "#fff" }}>Aplicar color</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const rgb = hexToRgb(activeColor);
                    if (rgb) onChangeRGB(String(rgb.r), String(rgb.g), String(rgb.b));
                  }}
                  style={[modalStyles.actionBtn, { backgroundColor: "#eee" }]}
                >
                  <Text>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setColorModalVisible(false)} style={[modalStyles.actionBtn, { backgroundColor: "#ddd" }]}>
                  <Text>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------
   Styles
   ------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#FAFBFD" },
  title: { marginBottom: 12, fontSize: 20, fontWeight: "700" },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  controlBlock: { flex: 1 },
  smallBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editorWrap: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#fff",
  },
  saveBtn: {
    marginTop: 18,
    backgroundColor: "#7A1F1F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});

/* modal styles */
const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontWeight: "700", fontSize: 16, marginBottom: 12 },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  closeBtn: { marginTop: 12, backgroundColor: "#7A1F1F", padding: 12, borderRadius: 8, alignItems: "center" },
  actionBtn: { padding: 10, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  smallNum: { borderWidth: 1, borderColor: "#ddd", padding: 8, borderRadius: 6, minWidth: 68, textAlign: "center" },
});
