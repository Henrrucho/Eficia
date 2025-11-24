import {
    PlaywriteCZ_100Thin,
    PlaywriteCZ_200ExtraLight,
    PlaywriteCZ_300Light,
    PlaywriteCZ_400Regular
} from '@expo-google-fonts/playwrite-cz';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styled from 'styled-components/native';

export default function Screen1() {

    const [modalVisible, setModalVisible] = useState(false);

    const [fontsLoaded] = useFonts({
        PlaywriteCZ_100Thin,
        PlaywriteCZ_200ExtraLight,
        PlaywriteCZ_300Light,
        PlaywriteCZ_400Regular
    });

    if (!fontsLoaded) {
        return (null);
    };

    const router = useRouter();
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <Header>
                <HeaderTitle>Eficia</HeaderTitle>
                <User> <FontAwesome name="user" size={35} /></User>


            </Header>
            <Container>
                <ContainerBox>

                    <ContainerTitleTask>Mis Pendientes</ContainerTitleTask>

                    <ContainerBoxTask>

                        <ScrollView style={{ width: '100%' }}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            showsVerticalScrollIndicator={true}>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 245, 180,195)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb(245,180,195)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>



                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb(245,180,195)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 255, 170,130)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb( 255, 170,130)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>

                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb( 255, 170,130)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 255, 170,130)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb( 255, 170,130)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>

                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb( 255, 170,130)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 255, 170,130)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb( 255, 170,130)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>

                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb( 255, 170,130)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 155, 175,200)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb(  155, 175,200)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>

                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb(  155, 175,200)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 155, 175,200)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb(  155, 175,200)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>

                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb(  155, 175,200)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                            <ContainerTask onPress={() => setModalVisible(true)} style={{ borderColor: 'rgb( 155, 175,200)', borderBottomWidth: 2 }}>
                                <ContainerTaskLeft>
                                    <ContainerTaskLeftLeft>
                                        <TextTaskLeftLeft > <FontAwesome name="clock-o" size={24} color={'rgb(  155, 175,200)'} /></TextTaskLeftLeft>
                                    </ContainerTaskLeftLeft>
                                    <ContainerTaskLeftRight>
                                        <NameTask>Proyecto U3</NameTask>
                                        <DateAssignmentTask>Asignado: 12/06/2024</DateAssignmentTask>
                                        <DateDueTask>Vence: 15/06/2024</DateDueTask>
                                    </ContainerTaskLeftRight>

                                </ContainerTaskLeft>
                                <ContainerTaskRight>
                                    <ButtonOptionTask >
                                        <ButtonOptionText>
                                            <FontAwesome color={'rgb(  155, 175,200)'} name="ellipsis-v" size={40} />
                                        </ButtonOptionText>
                                    </ButtonOptionTask>
                                </ContainerTaskRight>


                            </ContainerTask>
                        </ScrollView>
                    </ContainerBoxTask>


                    {/* <ImageHome source={require('../assets/images/ImagenInicio.png')} resizeMode="contain" />
                    <ContainerTitle>No tienes pendientes, relajate un poco...</ContainerTitle> */}
                </ContainerBox>

            </Container>
            <Footer>
                <FooterContainer>
                    <FooterItemActive onPress={() => router.push('/')}> <FontAwesome name="home" size={35} /></FooterItemActive>
                </FooterContainer>
                <FooterContainer>
                    <FooterItem onPress={() => router.push('/')}> <FontAwesome name="users" size={35} /></FooterItem>
                </FooterContainer>
                <FooterContainer>
                    <FooterItem onPress={() => router.push('/')}> <FontAwesome name="bell" size={35} /></FooterItem>
                </FooterContainer>
                <FooterContainer>
                    <FooterItem onPress={() => router.push('/')}> <FontAwesome name="list" size={35} /></FooterItem>
                </FooterContainer>

            </Footer>


            <ModalTask animationType='fade' visible={modalVisible} transparent={true} >

                <ModalContainer >

                    <ModalContent>
                        <ModalContentBackground>
                            <ModalTitle>Proyecto U3</ModalTitle>
                            <ModalDateAssignment>Asignado: 12/06/2024</ModalDateAssignment>
                            <ModalDateDue>Vence: 15/06/2024</ModalDateDue>
                            <ModalDescription>Descripción del proyecto: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</ModalDescription>
                            <TaskCompletedButton>
                                <TaskCompletedButtonText>Marcar como completado</TaskCompletedButtonText>
                            </TaskCompletedButton>
                            <ModalCloseButton onPress={() => setModalVisible(false)} >
                                <ModalCloseButtonText>Cerrar</ModalCloseButtonText>
                            </ModalCloseButton>
                        </ModalContentBackground>

                    </ModalContent>

                </ModalContainer>

            </ModalTask>
        </SafeAreaView >
    )
};



const Header = styled.View`
width: 100%;
height: 60px;
display: flex;
flex-wrap: nowrap;
flex-direction: row;
`;
const HeaderTitle = styled.Text`
width: 80%;
font-size: 30px;
font-family: 'PlaywriteCZ_400Regular';
font-weight: bold;
text-align: left;
color: rgb(173,203,255);
`;

const User = styled.Text`
font-size: 18px;
color: rgb(173,203,255);
width: 20%;
border-radius: 50px;
font-weight: bold;
padding-top: 15px;
text-align: center;
padding-right: 10px;

`;

const Container = styled.View`
flex: 1;
justify-content: center;
align-items: center;
background-color: rgba(255, 255, 255, 1);

`;


const ContainerBox = styled.View`
width: 90%;
height: 90%;
border-radius: 20px;
display: flex;
flex-direction: column;
padding-bottom: 20px;
align-items: center;
margin-bottom: 20px;

`;



const ContainerTitleTask = styled.Text`
font-size: 22px;
font-weight: bold;
color: rgba(110, 110, 110, 1);
margin-bottom: 10px;
text-align: center;
`;

const ContainerBoxTask = styled.View`
width: 100%;
height: 100%;

border-radius: 20px;
padding: 10px;
margin-bottom: 20px;
overflow-y: auto;
scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  display: flex;
flex-direction: column;
position: relative;

`;


const ContainerTask = styled.TouchableOpacity`

width: 100%;
height: 100px;
border: 1px solid gray;
border-radius: 10px;
margin-bottom: 10px;
padding: 10px;

display: flex;
flex-direction: row;

`;

const ModalTask = styled.Modal`

flex: 1;
justify-content: center;
align-items:center;
`;

const ModalContainer = styled.View`
flex: 1;

`;

const ModalContent = styled.View`
width: 100%;
height: 100%;
padding: 20px;
border-radius: 10px;
display: flex;
flex-direction: column;
justify-content: center;
align-items:center; 
 background-color: rgba(255, 255, 255, 0.19); /* Fondo semitransparente */
  backdrop-filter: blur(10px);
`;

const ModalContentBackground = styled.View`
display: flex;
flex-direction: column;
justify-content: center;
align-items:center; 
width: 100%;
height: 70%;
background-color: white;

`;
const ModalTitle = styled.Text`
font-size: 40px;
font-weight: bold;
margin-bottom: 10px;
color: rgb( 255, 170,130);
`;

const ModalDateAssignment = styled.Text`
font-size: 14px;
margin-bottom: 5px;
`;
const ModalDateDue = styled.Text`
font-size: 14px;
margin-bottom: 15px;
color: red;
`;



const ModalDescription = styled.Text`
font-size: 20px;
margin-bottom: 20px;
text-align:center;
`;

const TaskCompletedButton = styled.TouchableOpacity`
background-color: rgba(98, 202, 49, 1);
padding: 10px;
border-radius: 5px;
align-items: center;
margin-bottom: 10px;
`;
const TaskCompletedButtonText = styled.Text`
color: white;
font-size: 16px;
font-weight: bold;
`;

const ModalCloseButton = styled.TouchableOpacity`
align-self: flex-end;
padding: 10px;
border: 1px solid rgb(133,14,53); 
border-radius: 10px;
margin-top:20px;
`;
const ModalCloseButtonText = styled.Text`
font-size: 20px;
color: rgb(133,14,53); 
font-weight: bold;
`;

const ContainerTaskLeft = styled.View`
width: 80%;
display: flex;
flex-direction: row;

`;

const ContainerTaskLeftLeft = styled.View`
display: flex;
width: 20%;

justify-content: center;
align-items: center;
`;

const TextTaskLeftLeft = styled.Text`

color: rgba(155,175,200,1);
`;



const ContainerTaskLeftRight = styled.View`
display: flex;
flex-direction: column;
width: 80%;

`;

const ContainerTaskRight = styled.View`
display: flex;
width: 20%;

justify-content: center;
align-items: flex-end;

`;

const NameTask = styled.Text`
font-size: 24px;
font-weight: bold;
color: rgba(110, 110, 110, 1);
margin-left: 10px;
`;

const DateAssignmentTask = styled.Text`
font-size: 12px;
color: rgba(150, 150, 150, 1);
margin-left: 10px;
margin-top: 5px;
`;

const DateDueTask = styled.Text`
font-size: 12px;
color: rgba(200, 50, 50, 1);
margin-left: 10px;
margin-top: 5px;
`;

const ButtonOptionTask = styled.TouchableOpacity`
padding-right: 10px;
`;

const ButtonOptionText = styled.Text`
font-size: 18px;

`;



const ImageHome = styled.Image`
width: 200px;   
margin-bottom: 20px;
height : 80%;
`;



const ContainerTitle = styled.Text`
font-size: 18px;
font-weight: bold;
color: rgba(110, 110, 110, 1);
margin-bottom: 10px;
text-align: center;
`;


const Footer = styled.View`
display: flex;
wrap: nowrap;
flex-direction: row;
justify-content: center;
width: 100%;    
height: 60px;

`;

const FooterContainer = styled.View`
height: 100%;
width: 24.5%;
display: flex;      
justify-content: center;
align-items: center;

`;


const FooterItem = styled.Text`
width: 100%;
height: 100%;
color: rgb(173,203,255);
text-align: center;
padding-top: 10px;
`;
const FooterItemActive = styled.Text`
width: 100%;
height: 100%;
padding-top: 10px;
font-weight: bold;
color: rgb(255,255,255);
text-align: center;
background-color: rgb(155,175,200);
`;