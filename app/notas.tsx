import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

const SAMPLE_IMAGE_PATH = '/mnt/data/a2e16ea3-c9ad-459a-a4ea-8f93ad56769f.jpg';

export default function NotasScreen() {
  const router = useRouter();
  const editorRef = useRef<RichEditor | null>(null);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>('System');
  const [textColor, setTextColor] = useState<string>('#111111');
  const [contenidoHtml, setContenidoHtml] = useState<string>('');


  const saveNote = async () => {
    try {
      const html = await editorRef.current?.getContentHtml();

      const plainText = contenidoHtml
        .replace(/<[^>]*>/g, '') 
        .slice(0, 120); 

      const note = {
  id: `${Date.now()}`,
  titulo: titulo || 'Sin título',
  contenido: plainText || 'Sin contenido',
  contenidoHtml: html ?? '',
  categoria: categoria || 'General',
  fecha: new Date().toISOString(), 
  color: '#EDEDED',
  border: '#D3D3D3',
  meta: {
    fontSize,
    fontFamily,
    textColor,
  },
};


      const raw = await AsyncStorage.getItem('NOTES');
      const arr = raw ? JSON.parse(raw) : [];

      arr.unshift(note);

      await AsyncStorage.setItem('NOTES', JSON.stringify(arr));

      router.push('/historial'); 

    } catch (e) {
      Alert.alert('Error', 'No fue posible guardar la nota.');
      console.error(e);
    }
  };

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
      Alert.alert('Error', 'No se pudo convertir la imagen.');
      return;
    }

    const base64Img = `data:image/jpeg;base64,${asset.base64}`;

    editorRef.current?.insertImage(base64Img);
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'No se pudo seleccionar la imagen.');
  }
};


  const insertSampleImage = () => {
    editorRef.current?.insertImage(SAMPLE_IMAGE_PATH);
  };

  const applyColorToSelection = (color: string) => {
    editorRef.current?.commandDOM(`document.execCommand("foreColor", false, "${color}")`);
    setTextColor(color);
  };

  const editorContentStyle = {
    backgroundColor: '#fff',
    color: textColor,
    cssText: `font-size: ${fontSize}px; font-family: ${fontFamily}; padding: 10px;`,
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
          <ThemedText type="title" style={styles.title}>Crear nota</ThemedText>

          <ThemedText>Título</ThemedText>
          <TextInput
            placeholder="Título..."
            value={titulo}
            onChangeText={setTitulo}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <ThemedText>Categoría (opcional)</ThemedText>
          <TextInput
            placeholder="Ej. Personal, Trabajo..."
            value={categoria}
            onChangeText={setCategoria}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <View style={styles.controlsRow}>
            <View style={styles.controlBlock}>
              <ThemedText style={{ marginBottom: 6 }}>Tamaño</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[14, 16, 18, 20, 24].map((s) => (
                  <TouchableOpacity
                    key={String(s)}
                    onPress={() => setFontSize(s)}
                    style={[styles.smallBtn, fontSize === s && styles.smallBtnActive]}
                  >
                    <ThemedText>{s}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.controlBlock}>
              <ThemedText style={{ marginBottom: 6 }}>Fuente</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['System', 'serif', 'monospace'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFontFamily(f)}
                    style={[styles.smallBtn, fontFamily === f && styles.smallBtnActive]}
                  >
                    <ThemedText>{f === 'System' ? 'Default' : f}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.controlsRow, { marginTop: 10 }]}>
            <View style={styles.controlBlock}>
              <ThemedText style={{ marginBottom: 6 }}>Color texto</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['#111111', '#7A1F1F', '#C76C6C', '#FFC0CB', '#6B6BFF'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => applyColorToSelection(c)}
                    style={[styles.colorDot, { backgroundColor: c, borderWidth: textColor === c ? 2 : 0 }]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.controlBlock}>
              <ThemedText style={{ marginBottom: 6 }}>Insertar imagen</ThemedText>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={pickImageAndInsert} style={styles.smallBtn}>
                  <ThemedText>Galería</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

         <View style={{ height: 400, marginTop: 12, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' }}>
  <RichEditor
    ref={editorRef}
    initialContentHTML={contenidoHtml}
    editorStyle={editorContentStyle as any}
    placeholder="Escribe tu nota..."
    onChange={(html) => setContenidoHtml(html)}
    style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}
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
              [actions.insertImage]: (props: any) => (
                <Ionicons name="image" size={22} color={props.tintColor} />
              ),
              [actions.heading1]: (props: any) => (
                <Text style={{ color: props.tintColor }}>H1</Text>
              ),
            }}
            style={{ backgroundColor: '#fafafa', borderRadius: 8, marginTop: 8 }}
            insertImage={(uri: string) => {
              const low = uri.toLowerCase();
              if (!(low.endsWith('.jpg') || low.endsWith('.jpeg') || low.endsWith('.png'))) {
                Alert.alert('Formato no válido', 'Solo se aceptan imágenes .jpg / .jpeg / .png');
                return;
              }
              editorRef.current?.insertImage(uri);
            }}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
            <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Guardar nota</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#FAFBFD' },
  title: { marginBottom: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  controlBlock: { flex: 1 },
  smallBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  smallBtnActive: {
    backgroundColor: '#F0E6EB',
    borderColor: '#C76C6C',
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: '#222',
  },
  editorWrap: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  saveBtn: {
    marginTop: 18,
    backgroundColor: '#7A1F1F',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
