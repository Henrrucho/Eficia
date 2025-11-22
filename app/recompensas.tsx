import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export default function RecompensasScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
            <Header>
                <HeaderTitle>Recompensas</HeaderTitle>
                <User>
                    <FontAwesome name="user" size={32} color="#adcBff" />
                </User>
            </Header>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                
                {/** ---------- BLOQUE 1: TEMAS ---------- */}
                <SectionContainer>
                    <SectionTitle>Temas</SectionTitle>

                    <FiltersRow>
                        <FilterButtonActive><FilterTextActive>Desbloqueados</FilterTextActive></FilterButtonActive>
                        <FilterButton><FilterText>Bloqueados</FilterText></FilterButton>
                    </FiltersRow>

                    <RewardsRow horizontal showsHorizontalScrollIndicator={false}>
                        <RewardCard />
                        <RewardCard />
                        <RewardCard />
                        <RewardCard />
                    </RewardsRow>
                </SectionContainer>


                {/** ---------- BLOQUE 2: FONDOS ---------- */}
                <SectionContainer>
                    <SectionTitle>Fondos</SectionTitle>

                    <FiltersRow>
                        <FilterButtonActive><FilterTextActive>Desbloqueados</FilterTextActive></FilterButtonActive>
                        <FilterButton><FilterText>Bloqueados</FilterText></FilterButton>
                    </FiltersRow>

                    <RewardsRow horizontal showsHorizontalScrollIndicator={false}>
                        <RewardCard />
                        <RewardCard />
                        <RewardCard />
                        <RewardCard />
                    </RewardsRow>
                </SectionContainer>


                {/** ---------- BLOQUE 3 SI LO NECESITAS ---------- */}
                <SectionContainer>
                    <SectionTitle>Avatares</SectionTitle>

                    <FiltersRow>
                        <FilterButtonActive><FilterTextActive>Desbloqueados</FilterTextActive></FilterButtonActive>
                        <FilterButton><FilterText>Bloqueados</FilterText></FilterButton>
                    </FiltersRow>

                    <RewardsRow horizontal showsHorizontalScrollIndicator={false}>
                        <RewardCard />
                        <RewardCard />
                        <RewardCard />
                        <RewardCard />
                    </RewardsRow>
                </SectionContainer>

            </ScrollView>
        </SafeAreaView>
    );
}


/* ----------------------------- ESTILOS ----------------------------- */

const Header = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: row;
    align-items: center;
    padding: 0 15px;
`;

const HeaderTitle = styled.Text`
    width: 80%;
    font-size: 28px;
    font-weight: bold;
    color: rgb(173,203,255);
`;

const User = styled.View`
    width: 20%;
    align-items: flex-end;
`;

const SectionContainer = styled.View`
    width: 100%;
    padding: 10px 20px;
    margin-top: 10px;
`;

const SectionTitle = styled.Text`
    font-size: 26px;
    font-weight: bold;
    color: #4b4b4b;
    margin-bottom: 5px;
`;

/* Filtros */
const FiltersRow = styled.View`
    flex-direction: row;
    margin-bottom: 10px;
`;

const FilterButton = styled(TouchableOpacity)`
    padding: 6px 14px;
    border-radius: 20px;
    background-color: #e6e6e6;
    margin-right: 10px;
`;

const FilterButtonActive = styled(TouchableOpacity)`
    padding: 6px 14px;
    border-radius: 20px;
    background-color: rgb(173,203,255);
    margin-right: 10px;
`;

const FilterText = styled.Text`
    color: #555;
    font-weight: bold;
`;

const FilterTextActive = styled.Text`
    color: white;
    font-weight: bold;
`;

/* Carrusel horizontal */
const RewardsRow = styled.ScrollView`
    flex-direction: row;
`;

const RewardCard = styled.View`
    width: 120px;
    height: 120px;
    background-color: #f8f8f8;
    border-radius: 15px;
    margin-right: 15px;
    border: 2px dashed #ccc;
`;
