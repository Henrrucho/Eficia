import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
        backgroundColor: "#f7f7f7",
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 40 }}>
        Iniciar Sesión
      </Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#1e90ff",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 30,
        }}
        onPress={() => alert("Iniciando sesión...")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/registro")}>
        <Text
          style={{
            color: "#1e90ff",
            textAlign: "center",
            fontSize: 16,
            textDecorationLine: "underline",
          }}
        >
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
}
