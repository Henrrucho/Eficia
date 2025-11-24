import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

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

  const editorRef = useRef<RichEditor>(null);

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    const loadNote = async () => {
      try {
        const stored = await AsyncStorage.getItem("NOTES");
        if (!stored) return;

        const notes: Note[] = JSON.parse(stored);
        const note = notes.find((n: Note) => n.id === id);

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
      const index = notes.findIndex((n: Note) => n.id === id);

      if (index !== -1) {
        notes[index].contenidoHtml = html;
        await AsyncStorage.setItem("NOTES", JSON.stringify(notes));
      }
    } catch (e) {
      console.log("Error guardando nota", e);
    }
  };

  const deleteNote = async () => {
    const stored = await AsyncStorage.getItem("NOTES");
    if (!stored) return;

    const list: Note[] = JSON.parse(stored);
    const filtered = list.filter((n: Note) => n.id !== id);

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
        style={{
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}
        iconTint="#333"
        selectedIconTint="#6497F1"
        actions={["bold", "italic", "underline", "orderedList", "unorderedList"]}
      />

     <RichEditor
  ref={editorRef}
  initialContentHTML={contenido}
  placeholder="Escribe aquí..."
  onChange={(html) => saveNote(html)}
  editorStyle={{
    backgroundColor: "#fff",
    placeholderColor: "#999",
    contentCSSText: "padding: 20px;", 
  }}
  style={{
    flex: 1,
    backgroundColor: "#fff",
  }}
/>

    </ThemedView>
  );
}
