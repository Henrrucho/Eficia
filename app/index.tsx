import {
    PlaywriteCZ_100Thin,
    PlaywriteCZ_200ExtraLight,
    PlaywriteCZ_300Light,
    PlaywriteCZ_400Regular
} from '@expo-google-fonts/playwrite-cz';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export default function Screen1() {

    const [fontsLoaded] = useFonts({
        PlaywriteCZ_100Thin,
        PlaywriteCZ_200ExtraLight,
        PlaywriteCZ_300Light,
        PlaywriteCZ_400Regular
    });

    if (!fontsLoaded) {
        return (null);
    }

    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header>
                <HeaderTitle>Eficia</HeaderTitle>
                <User> <FontAwesome name="user" size={35} /></User>


            </Header>
            <Container>
                <ContainerBox>
                    <ImageHome source={require('../assets/images/ImagenInicio.png')} resizeMode="contain" />
                    <ContainerTitle>No tienes pendientes, relajate un poco...</ContainerTitle>
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
                    <FooterItem onPress={() => router.push('/historial')}> <FontAwesome name="bell" size={35} /></FooterItem>
                </FooterContainer>
                <FooterContainer>
                    <FooterItem onPress={() => router.push('/')}> <FontAwesome name="list" size={35} /></FooterItem>
                </FooterContainer>

            </Footer>
        </SafeAreaView>
    )
}



const Header = styled.View`
width: 100%;
height: 60px;

display: flex;
wrap: nowrap;
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
height: 400px;

border-radius: 20px;
display: flex;
flex-direction: column;

justify-content: center;
align-items: center;
margin-bottom: 20px;
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


const Footer = styled.Text`
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






