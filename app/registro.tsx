import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Registro() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://10.0.2.2:5116/auth/register', {
        name,
        email,
        password
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      Alert.alert("Éxito", "Cuenta creada exitosamente");
      router.replace("/login");
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.response?.status === 404) {
        Alert.alert(
          "Error 404",
          "No se encontró el endpoint de registro. Verifica la URL del servidor."
        );
      } else if (error.response?.status === 400) {
        if (error.response.data?.includes("email") || error.response.data?.message?.includes("email")) {
          Alert.alert("Error", "El email ya está registrado");
        } else {
          Alert.alert("Error", "Datos de entrada inválidos");
        }
      } else if (error.response?.status === 500) {
        Alert.alert("Error", "Error interno del servidor");
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        Alert.alert("Error", "No se puede conectar al servidor. Verifica que esté ejecutándose.");
      } else {
        Alert.alert("Error", "No se pudo crear la cuenta. Verifica tu conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header>
        <HeaderTitle>Eficia</HeaderTitle>
      </Header>

      <Container>
        <RegisterContainer>
          <RegisterTitle>Crear Cuenta</RegisterTitle>
          
          <InputContainer>
            <Label>Nombre completo:</Label>
            <Input
              placeholder="Ingresa tu nombre completo"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </InputContainer>

          <InputContainer>
            <Label>Correo electrónico:</Label>
            <Input
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </InputContainer>

          <InputContainer>
            <Label>Contraseña:</Label>
            <Input
              placeholder="Crea una contraseña segura (mín. 6 caracteres)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </InputContainer>

          <RegisterButton onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <RegisterButtonText>Registrarse</RegisterButtonText>
            )}
          </RegisterButton>

          <LoginContainer>
            <LoginText>¿Ya tienes una cuenta? </LoginText>
            <LoginLink onPress={() => !loading && router.push("/login")}>
              <LoginLinkText>Iniciar Sesión</LoginLinkText>
            </LoginLink>
          </LoginContainer>
        </RegisterContainer>
      </Container>
    </SafeAreaView>
  );
}

const Header = styled.View`
  width: 100%;
  height: 60px;
  flex-direction: row;
  padding-left: 20px;
  align-items: center;
  background-color: rgba(201, 212, 240, 1);
`;

const HeaderTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: rgb(173, 203, 255);
`;

const Container = styled.View`
  flex: 1;
  background-color: rgba(201, 212, 240, 1);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const RegisterContainer = styled.View`
  width: 90%;
  background-color: white;
  border-radius: 16px;
  padding: 30px 25px;
  border: 1px solid rgba(110, 110, 110, 1);
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const RegisterTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: rgba(110, 110, 110, 1);
  text-align: center;
  margin-bottom: 30px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: rgba(110, 110, 110, 1);
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  border: 1px solid rgba(110, 110, 110, 1);
  border-radius: 8px;
  padding: 0 15px;
  background-color: white;
  font-size: 16px;
`;

const RegisterButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${props => props.disabled ? 'rgba(100, 149, 237, 0.6)' : 'rgb(100, 149, 237)'};
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  shadow-color: rgb(100, 149, 237);
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3.84px;
  elevation: 3;
`;

const RegisterButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const LoginText = styled.Text`
  color: rgba(110, 110, 110, 1);
  font-size: 16px;
`;

const LoginLink = styled.TouchableOpacity`
  margin-left: 5px;
`;

const LoginLinkText = styled.Text`
  color: rgb(100, 149, 237);
  font-size: 16px;
  font-weight: bold;
  text-decoration-line: underline;
`;