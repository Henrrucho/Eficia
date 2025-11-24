import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Text,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

const COLORS = [
  "#000000",
  "#FF0000",
  "#00AEEF",
  "#FF69B4",
  "#008000",
  "#FFA500",
  "#800080",
  "#808080",
];

const REAL_FONT_SIZES = Array.from({ length: 90 }, (_, i) => i + 12);

type Note = {
  id: string;
  titulo: string;
  contenidoHtml: string;
  categoria: string;
  fecha: string;
};

export default function NotaDetalleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const editorRef = useRef<RichEditor | null>(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");


  const debounceTimer = useRef<number | null>(null);

  const [colorModal, setColorModal] = useState(false);
  const [fontModal, setFontModal] = useState(false);

  const [customHex, setCustomHex] = useState("");
  const [customRGB, setCustomRGB] = useState("");

  useEffect(() => {
    const loadNote = async () => {
      try {
        const stored = await AsyncStorage.getItem("NOTES");
        if (!stored) return;

        const notes: Note[] = JSON.parse(stored);
        const note = notes.find((n) => n.id === id);

        if (note) {
          setTitulo(note.titulo);
          setContenido(note.contenidoHtml);
        }
      } catch (e) {
        console.log("Error cargando nota", e);
      }
    };

    loadNote();
  }, [id]);

  const saveNote = async (html: string) => {
    try {
      const stored = await AsyncStorage.getItem("NOTES");
      if (!stored) return;

      const notes: Note[] = JSON.parse(stored);
      const index = notes.findIndex((n) => n.id === id);

      if (index !== -1) {
        notes[index].contenidoHtml = html;
        await AsyncStorage.setItem("NOTES", JSON.stringify(notes));
      }
    } catch (e) {
      console.log("Error guardando nota", e);
    }
  };

  const handleEditorChange = (html: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const t = setTimeout(() => {
      saveNote(html);
    }, 800);

    debounceTimer.current = t as unknown as number;
  };

  const insertImage = async () => {
 
    const pick: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });

    if (!pick) return;
    if (pick.canceled) return;

    const img = pick.assets?.[0];
    if (!img) return;

    if (img.base64) {
      const base64 = `data:image/jpeg;base64,${img.base64}`;
      editorRef.current?.insertImage(base64);
    } else if (img.uri) {
      editorRef.current?.insertImage(img.uri);
    }
  };

  const applyRealFontSize = (px: number) => {
    const script = `
      document.execCommand("fontSize", false, "7");
      var spans = document.getElementsByTagName("span");
      for (var i = 0; i < spans.length; i++) {
        if (spans[i].style.fontSize === "" || spans[i].style.fontSize == null) {
          spans[i].style.fontSize = "${px}px";
        } else {
          // si ya tiene tamaño explícito lo respetamos o lo reemplazamos según necesidad
          spans[i].style.fontSize = "${px}px";
        }
      }
    `;
    editorRef.current?.commandDOM(script as any);
  };

  const deleteNote = async () => {
    const stored = await AsyncStorage.getItem("NOTES");
    if (!stored) return;

    const list: Note[] = JSON.parse(stored);
    const filtered = list.filter((n) => n.id !== id);

    await AsyncStorage.setItem("NOTES", JSON.stringify(filtered));
    router.replace("/historial");
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 45,
          paddingBottom: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <ThemedText type="subtitle">{titulo}</ThemedText>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Eliminar nota", "¿Seguro?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Eliminar", style: "destructive", onPress: deleteNote },
            ])
          }
        >
          <Ionicons name="trash" size={24} color="#d9534f" />
        </TouchableOpacity>
      </View>

      <RichToolbar
        editor={editorRef}
        iconTint="#333"
        selectedIconTint="#6497F1"
        style={{
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.insertImage,
          "customColor",
          "customFontSize",
        ]}
        iconMap={{
          customColor: () => <Ionicons name="color-palette" size={22} color="#444" />,
          customFontSize: () => <Ionicons name="text" size={22} color="#444" />,
        }}
        onPressAddImage={insertImage}
        onPress={(action: string) => {
          if (action === "customColor") setColorModal(true);
          if (action === "customFontSize") setFontModal(true);
        }}
      />

      <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
        <RichEditor
  ref={editorRef}
  initialContentHTML={contenido}
  placeholder="Escribe aquí..."
  onChange={handleEditorChange}
  editorStyle={{
    backgroundColor: "#fff",
    placeholderColor: "#999",
    contentCSSText: "padding: 20px;",
  }}
  style={{ minHeight: 500 }}
/>

      </ScrollView>

      <Modal visible={colorModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Seleccionar color
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => {

                    editorRef.current?.commandDOM(`document.execCommand("foreColor", false, "${c}")` as any);
                    setColorModal(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: c,
                    borderRadius: 6,
                    margin: 5,
                  }}
                />
              ))}
            </View>

            <Text>HEX:</Text>
            <TextInput
              placeholder="#FF0000"
              value={customHex}
              onChangeText={setCustomHex}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            <Text>RGB:</Text>
            <TextInput
              placeholder="255,0,0"
              value={customRGB}
              onChangeText={setCustomRGB}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            <TouchableOpacity
              onPress={() => {
                if (customHex.startsWith("#")) {
                  editorRef.current?.commandDOM(`document.execCommand("foreColor", false, "${customHex}")` as any);
                } else if (customRGB.includes(",")) {
                  editorRef.current?.commandDOM(`document.execCommand("foreColor", false, "rgb(${customRGB})")` as any);
                }
                setColorModal(false);
              }}
              style={{
                backgroundColor: "#6497F1",
                padding: 12,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}>
                Aplicar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={fontModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000088",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Tamaño de fuente (px)
            </Text>

            <ScrollView style={{ maxHeight: 250 }}>
              {REAL_FONT_SIZES.map((px) => (
                <TouchableOpacity
                  key={px}
                  onPress={() => {
                    applyRealFontSize(px);
                    setFontModal(false);
                  }}
                  style={{ padding: 10 }}
                >
                  <Text style={{ fontSize: 16 }}>{px}px</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setFontModal(false)}
              style={{
                backgroundColor: "#ccc",
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ textAlign: "center" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}
