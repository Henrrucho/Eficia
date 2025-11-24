import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://10.0.2.2:5116/auth/login', {
        email,
        password
      });

      // Guardar el token en AsyncStorage o contexto
      const token = response.data.token;
      console.log('Login exitoso, token:', token);
      
      Alert.alert("Éxito", "Inicio de sesión exitoso");
      
      // Navegar al home después del login
      router.replace("/");
      
    } catch (error: any) {
      console.error('Error en login:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert("Error", "Credenciales incorrectas");
      } else if (error.response?.status === 400) {
        Alert.alert("Error", "Datos de entrada inválidos");
      } else {
        Alert.alert("Error", "Error en el servidor. Intenta más tarde.");
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
        <LoginContainer>
          <LoginTitle>Iniciar Sesión</LoginTitle>
          
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
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </InputContainer>

          <LoginButton onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <LoginButtonText>Entrar</LoginButtonText>
            )}
          </LoginButton>

          <RegisterContainer>
            <RegisterText>¿No tienes una cuenta? </RegisterText>
            <RegisterLink onPress={() => !loading && router.push("/registro")}>
              <RegisterLinkText>Registrarse</RegisterLinkText>
            </RegisterLink>
          </RegisterContainer>
        </LoginContainer>
      </Container>
    </SafeAreaView>
  );
}

// Styled Components (los mismos que antes)
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

const LoginContainer = styled.View`
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

const LoginTitle = styled.Text`
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

const LoginButton = styled.TouchableOpacity`
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

const LoginButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const RegisterContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const RegisterText = styled.Text`
  color: rgba(110, 110, 110, 1);
  font-size: 16px;
`;

const RegisterLink = styled.TouchableOpacity`
  margin-left: 5px;
`;

const RegisterLinkText = styled.Text`
  color: rgb(100, 149, 237);
  font-size: 16px;
  font-weight: bold;
  text-decoration-line: underline;
`;