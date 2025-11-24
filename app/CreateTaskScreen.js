// CreateTaskScreen.js
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';

const CreateTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const createTask = async (taskData) => {
    if (!title || !description) {
      Alert.alert('Error', 'Completa título y descripción');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:5116/api/Tasks', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setSuccessMessage('✅ Task creada correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
        setTitle('');
        setDescription('');
      } else {
        Alert.alert('Error', 'No se pudo crear la task');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con la API');
      console.error('Error de conexión', error);
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <Title>Crea una nueva Task</Title>

        {successMessage ? <SuccessText>{successMessage}</SuccessText> : null}

        <Label>Título</Label>
        <Input
          placeholder="Escribe el título"
          value={title}
          onChangeText={setTitle}
        />

        <Label>Descripción</Label>
        <Input
          placeholder="Escribe la descripción"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <ButtonCreate
          onPress={() =>
            createTask({
              title,
              description,
              dueDate: '2025-11-24T08:59:00.149Z', // Fecha mínima
              priority: 0, // Prioridad mínima
            })
          }
        >
          <ButtonText>Crear Task</ButtonText>
        </ButtonCreate>
      </ScrollView>
    </Container>
  );
};

export default CreateTaskScreen;

// Styled Components
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f7f9fc;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 12px;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const ButtonCreate = styled.TouchableOpacity`
  background-color: #64c864;
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const SuccessText = styled.Text`
  color: green;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  font-size: 16px;
`;
