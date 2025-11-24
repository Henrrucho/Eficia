import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import {
    PlaywriteCZ_100Thin,
    PlaywriteCZ_200ExtraLight,
    PlaywriteCZ_300Light,
    PlaywriteCZ_400Regular,
} from '@expo-google-fonts/playwrite-cz';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Platform, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

type AndroidMode = 'date' | 'time';

export default function Task() {
    const [fontsLoaded] = useFonts({
        PlaywriteCZ_100Thin,
        PlaywriteCZ_200ExtraLight,
        PlaywriteCZ_300Light,
        PlaywriteCZ_400Regular,
        Montserrat_400Regular
    });

    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [androidMode, setAndroidMode] = useState<AndroidMode>('date');

    if (!fontsLoaded) return null;

    const handleCreateTask = async () => {
        if (!title || !description || !dueDate) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await axios.post('http://10.0.2.2:5116/api/Tasks', {
                title,
                description,
                dueDate: dueDate.toISOString(),
                priority
            });

            Alert.alert('Éxito', 'Tarea creada correctamente');
            console.log('Tarea creada:', response.data);

            // Limpiar campos
            setTitle('');
            setDescription('');
            setDueDate(null);
            setPriority(0);

            setTimeout(() => {
                router.back();
            }, 1500);
            
        } catch (error: any) {
            console.error('Error completo:', error);
            Alert.alert('Error', 'No se pudo crear la tarea');
        }
    };

    // SOLUCIÓN PARA ANDROID: Enfoque separado por modo
    const handleAndroidDateChange = (_event: any, selectedDate?: Date) => {
        // Siempre cerrar el picker inmediatamente en Android
        setShowDatePicker(false);
        
        if (selectedDate) {
            const currentDate = dueDate || new Date();
            let newDate = new Date(selectedDate);
            
            if (androidMode === 'date') {
                // Si estamos en modo fecha, mantener la hora actual
                newDate.setHours(currentDate.getHours());
                newDate.setMinutes(currentDate.getMinutes());
                setDueDate(newDate);
                
                // Cambiar a modo tiempo después de seleccionar fecha
                setTimeout(() => {
                    setAndroidMode('time');
                    setShowDatePicker(true);
                }, 300);
            } else {
                // Si estamos en modo tiempo, mantener la fecha y actualizar hora
                newDate.setFullYear(currentDate.getFullYear());
                newDate.setMonth(currentDate.getMonth());
                newDate.setDate(currentDate.getDate());
                setDueDate(newDate);
                setAndroidMode('date'); // Resetear a modo fecha para la próxima vez
            }
        } else {
            setAndroidMode('date'); // Resetear si se cancela
        }
    };

    const handleShowDatePicker = () => {
        if (Platform.OS === 'android') {
            setAndroidMode('date');
            setShowDatePicker(true);
        } else {
            setShowDatePicker(true);
        }
    };

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            handleAndroidDateChange(_event, selectedDate);
            return;
        }
        
        // Para iOS: manejo normal
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const handleCancelDatePicker = () => {
        setShowDatePicker(false);
        if (Platform.OS === 'android') {
            setAndroidMode('date'); // Resetear modo
        }
    };

    const handleConfirmDate = () => {
        setShowDatePicker(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header>
                <HeaderTitle>Eficia</HeaderTitle>
            </Header>

            <Container>
                <ContainerBox>
                    <ContainerTitle>Nueva Tarea</ContainerTitle>
                </ContainerBox>

                <Label>Título de la tarea:</Label>
                <Input
                    placeholder="Escribir título..."
                    value={title}
                    onChangeText={setTitle}
                />

                <Label>Fecha y hora:</Label>
                <DatePickerButton onPress={handleShowDatePicker}>
                    <RNText>{dueDate ? dueDate.toLocaleString() : 'Seleccionar fecha y hora'}</RNText>
                </DatePickerButton>

                {/* PARA iOS */}
                {showDatePicker && Platform.OS === 'ios' && (
                    <Modal
                        visible={showDatePicker}
                        transparent={true}
                        animationType="slide"
                    >
                        <ModalOverlay>
                            <DateTimePickerModalIOS>
                                <DateTimePickerHeader>
                                    <CancelButtonIOS onPress={handleCancelDatePicker}>
                                        <CancelButtonText>Cancelar</CancelButtonText>
                                    </CancelButtonIOS>
                                    <ConfirmButtonIOS onPress={handleConfirmDate}>
                                        <ConfirmButtonText>Confirmar</ConfirmButtonText>
                                    </ConfirmButtonIOS>
                                </DateTimePickerHeader>
                                <DateTimePicker
                                    value={dueDate || new Date()}
                                    mode="datetime"
                                    display="spinner"
                                    onChange={handleDateChange}
                                />
                            </DateTimePickerModalIOS>
                        </ModalOverlay>
                    </Modal>
                )}

                {/* PARA ANDROID */}
                {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode={androidMode}
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Label>Prioridad:</Label>
                <PriorityOptions>
                    <PriorityButton
                        selected={priority === 0}
                        onPress={() => setPriority(0)}
                    >
                        <PriorityText selected={priority === 0}>Baja</PriorityText>
                    </PriorityButton>
                    <PriorityButton
                        selected={priority === 1}
                        onPress={() => setPriority(1)}
                    >
                        <PriorityText selected={priority === 1}>Media</PriorityText>
                    </PriorityButton>
                    <PriorityButton
                        selected={priority === 2}
                        onPress={() => setPriority(2)}
                    >
                        <PriorityText selected={priority === 2}>Alta</PriorityText>
                    </PriorityButton>
                </PriorityOptions>

                <Label>Descripción de la tarea:</Label>
                <DescriptionInput
                    placeholder="Agregar descripción..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />

                <ButtonsContainer>
                    <CancelButton onPress={() => router.back()}>
                        <CancelButtonText>Cancelar</CancelButtonText>
                    </CancelButton>

                    <SubmitButton onPress={handleCreateTask}>
                        <ButtonText>Guardar Tarea</ButtonText>
                    </SubmitButton>
                </ButtonsContainer>
            </Container>
        </SafeAreaView>
    );
}

// Styled Components

const Header = styled.View`
  width: 100%;
  height: 60px;
  flex-direction: row;
  padding-left: 20px;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 30px;
  font-family: 'PlaywriteCZ_400Regular';
  font-weight: bold;
  color: rgb(173,203,255);
`;

const Container = styled.View`
  flex: 1;
  background-color: rgba(201, 212, 240, 1);
  align-items: center;
  padding: 10px;
`;

const ContainerBox = styled.View`
  width: 90%;
  height: 60px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  margin-vertical: 16px;
  background-color: white;
  border: 1px solid rgba(110, 110, 110, 1);
`;

const ContainerTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: rgba(110, 110, 110, 1);
  text-align: center;
  font-family: 'Montserrat_400Regular';
`;

const Label = styled.Text`
  font-size: 16px;
  margin-top: 10px;
  color: rgba(110, 110, 110, 1);
  font-family: 'Montserrat_400Regular';
  align-self: flex-start;
  margin-left: 20px;
`;

const Input = styled.TextInput`
  width: 90%;
  height: 40px;
  border: 1px solid rgba(110, 110, 110, 1);
  border-radius: 8px;
  padding: 10px;
  background-color: white;
  font-family: 'Montserrat_400Regular';
  margin-bottom: 10px;
`;

const DescriptionInput = styled(Input)`
  height: 100px;
  text-align-vertical: top;
`;

const DatePickerButton = styled.TouchableOpacity`
  width: 90%;
  height: 50px;
  border: 1px solid rgba(110, 110, 110, 1);
  border-radius: 8px;
  padding: 10px;
  background-color: white;
  justify-content: center;
  margin-bottom: 10px;
`;

const PriorityOptions = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const PriorityButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 30%;
  height: 50px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background-color: ${({ selected }) => (selected ? 'rgb(100,149,237)' : 'white')};
  border: 1px solid rgba(110,110,110,1);
`;

const PriorityText = styled.Text<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? 'white' : 'rgba(110,110,110,1)')};
  font-family: 'Montserrat_400Regular';
  font-weight: bold;
`;

const ButtonsContainer = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 48%;
  height: 50px;
  background-color: rgb(100, 149, 237);
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

const CancelButton = styled.TouchableOpacity`
  width: 48%;
  height: 50px;
  background-color: rgba(110, 110, 110, 0.3);
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Montserrat_400Regular';
`;

const CancelButtonText = styled.Text`
  color: rgba(110, 110, 110, 1);
  font-size: 16px;
  font-weight: bold;
  font-family: 'Montserrat_400Regular';
`;

// Componentes para iOS Modal
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const DateTimePickerModalIOS = styled.View`
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  padding: 10px;
  width: 90%;
`;

const DateTimePickerHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const CancelButtonIOS = styled.TouchableOpacity`
  padding: 5px 10px;
`;

const ConfirmButtonIOS = styled.TouchableOpacity`
  padding: 5px 10px;
`;

const ConfirmButtonText = styled.Text`
  color: rgb(100,149,237);
  font-weight: bold;
  font-family: 'Montserrat_400Regular';
`;