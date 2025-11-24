import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import {
    PlaywriteCZ_100Thin,
    PlaywriteCZ_200ExtraLight,
    PlaywriteCZ_300Light,
    PlaywriteCZ_400Regular,
} from '@expo-google-fonts/playwrite-cz';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export default function task() {
    const [fontsLoaded] = useFonts({
        PlaywriteCZ_100Thin,
        PlaywriteCZ_200ExtraLight,
        PlaywriteCZ_300Light,
        PlaywriteCZ_400Regular,
        Montserrat_400Regular
    });
    if (!fontsLoaded) {
        return (null);
    }

    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Header>
                <HeaderTitle>Eficia</HeaderTitle>
            </Header>
            <Container>
                <ContainerBox>
                    <ContainerTitle>Nueva Tarea</ContainerTitle>
                </ContainerBox>

                <Text>Titulo de la tarea:</Text>
                <TextInput placeholder="Escribir titulo..." numberOfLines={1} />


                <Text>Fecha y hora</Text> {/*Agregar picker de fecha y hora */}
                <DatePickerButton>
                    <Text>Seleccionar fecha y hora</Text>
                </DatePickerButton>

                <Text>Prioridad</Text>  {/* Agregar opciones de prioridad por colores */}
                <PriorityOptions>
                    <DatePickerButton style={{ width: '30%', alignItems: 'center' }}>
                        <Text>Baja</Text>
                    </DatePickerButton>
                    <DatePickerButton style={{ width: '30%', alignItems: 'center' }}>
                        <Text>Media</Text>
                    </DatePickerButton>
                    <DatePickerButton style={{ width: '30%', alignItems: 'center' }}>
                        <Text>Alta</Text>
                    </DatePickerButton>
                </PriorityOptions>

                <Text>Descripción de la tarea:</Text>
                <TextInput placeholder="Agregar descripción..." multiline={true} numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} />


                <ButtonsContainer>
                    <CancelButton onPress={() => router.push('/')}>
                        <CancelButtonText>Cancelar</CancelButtonText>
                    </CancelButton>

                    <SubmitButton onPress={() => router.push('/')}> {/*Implementar guardado de tarea*/}
                        <ButtonText>Guardar Tarea</ButtonText>
                    </SubmitButton>
                </ButtonsContainer>


            </Container>
        </SafeAreaView>
    );
}


const Header = styled.View`
width: 100%;
height: 60px;
display: flex;
wrap: nowrap;
flex-direction: row;
padding-left: 20px;
justify-content: flex-start;
align-items: center;
`;

const HeaderTitle = styled.Text`
width: 80%;
font-size: 30px;
font-family: 'PlaywriteCZ_400Regular';
font-weight: bold;
text-align: left;
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
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-bottom: 16px;
margin-top: 16px;
background-color: rgba(255, 255, 255, 1);
border: 1px solid rgba(110, 110, 110, 1);
`;

const ContainerTitle = styled.Text`
font-size: 18px;
font-weight: bold;
color: rgba(110, 110, 110, 1);
text-align: center;
font-family: 'Montserrat_400Regular';
`;


const Text = styled.Text`
font-size: 16px;
margin-top: 10px;
textAlign: left;
color: rgba(110, 110, 110, 1);
font-family: 'Montserrat_400Regular';
`;

const TextInput = styled.TextInput`
    width: 90%;
    height: 40px;
    border: 1px solid rgba(110, 110, 110, 1);
    border-radius: 8px;
    padding: 10px;
    background-color: white;
    font-family: 'Montserrat_400Regular';
`;

const DatePickerButton = styled.TouchableOpacity`
    width: 90%;
    height: 50px;
    border: 1px solid rgba(110, 110, 110, 1);
    border-radius: 8px;
    padding: 10px;
    background-color: white;
    justify-content: center;
`;

const PriorityOptions = styled.View`
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;

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
