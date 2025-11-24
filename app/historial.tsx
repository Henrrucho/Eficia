import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';


type Nota = {
  id: string;
  titulo: string;
  contenidoHtml?: string;
  fecha: string;
  categoria?: string;
};

export default function HistorialScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Nota[]>([]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem("NOTES");
      if (stored) setNotes(JSON.parse(stored));
    } catch (e) {
      console.log("Error cargando notas", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const filteredNotes = notes.filter((note) => {
    const t = search.toLowerCase();
    return (
      note.titulo.toLowerCase().includes(t) ||
      note.contenidoHtml?.toLowerCase().includes(t)
    );
  });

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>


      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F0F0F0',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 15,
        }}
      >
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={{ flex: 1, marginLeft: 10 }}
          placeholder="Buscar nota..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredNotes.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Image
            source={require('../assets/images/gato.jpeg')}
            style={{ width: 200, height: 200, opacity: 0.9 }}
            resizeMode="contain"
          />
          <ThemedText type="subtitle" style={{ marginTop: 20, textAlign: 'center' }}>
            No tienes notas todavía.
          </ThemedText>
          <ThemedText style={{ opacity: 0.6, textAlign: 'center' }}>
            Presiona el botón + para agregar una nueva nota.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/notaDetalle?id=${item.id}`)}
              style={{
                backgroundColor: "#FFF",
                borderColor: "#DDD",
                borderWidth: 1,
                borderRadius: 16,
                padding: 15,
                marginBottom: 12,
              }}
            >

              <ThemedText type="subtitle" style={{ marginBottom: 4 }}>
                {item.titulo}
              </ThemedText>

              <ThemedText style={{ marginBottom: 8 }}>
                {item.contenidoHtml
                  ?.replace(/<[^>]*>?/gm, "")
                  .replace(/&[a-zA-Z0-9#]+;/g, " ")
                  .slice(0, 100)
                }
                ...
              </ThemedText>



              <ThemedText type="defaultSemiBold" style={{ opacity: 0.6 }}>
                {new Date(item.fecha).toLocaleDateString()} · {item.categoria || "Sin categoría"}
              </ThemedText>
            </TouchableOpacity>
          )}
        />
      )}


      <TouchableOpacity
        onPress={() => router.push('/notas')}
        style={{
          position: 'absolute',
          bottom: 25,
          right: 25,
          backgroundColor: '#6497F1',
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>

    </ThemedView>
  );
}
