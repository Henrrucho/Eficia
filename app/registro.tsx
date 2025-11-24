import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Registro() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = () => {
  if (!name || !email || !password) {
    alert("Por favor completa todos los campos");
    return;
  }

  alert("Registro exitoso!");

  
  router.replace("/login");
};


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
        backgroundColor: "#f7f7f7",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 40 }}>
        Crear Cuenta
      </Text>

     
      <TextInput
        placeholder="Nombre completo"
        value={name}
        onChangeText={setName}
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
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 25,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: "#1e90ff",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Registrarse
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text
          style={{
            color: "#1e90ff",
            textAlign: "center",
            fontSize: 16,
            textDecorationLine: "underline",
          }}
        >
          Volver al inicio de sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
