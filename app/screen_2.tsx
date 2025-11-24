import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen2(){
    const router = useRouter();
    return(
         <SafeAreaView style={{ flex: 1 }}>
        <View>
            <Text>
                Pantalla 2
            </Text>
            <Button title='Ir a la pantalla 1' onPress={()=> router.back}></Button>
        </View>
        </SafeAreaView>
    )

}
