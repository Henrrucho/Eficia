import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

/* ----------------------------- Temas y colores ----------------------------- */

const temas = [
  { id: 1, name: "Cielo Azul", unlocked: true, gradient: ["#adcBff", "#8da4ff"] as const },
  { id: 2, name: "Atardecer", unlocked: true, gradient: ["#ff9a9e", "#fad0c4"] as const },
  { id: 3, name: "Bosque", unlocked: true, gradient: ["#a8e6cf", "#56c596"] as const },
  { id: 4, name: "Aurora", unlocked: true, gradient: ["#00c6ff", "#0072ff"] as const },
  { id: 5, name: "Hielo", unlocked: true, gradient: ["#e0f7fa", "#80deea"] as const },
  { id: 6, name: "Noche Estrellada", unlocked: true, gradient: ["#000428", "#004e92"] as const },
  { id: 7, name: "Neón Punk", unlocked: true, gradient: ["#ff0099", "#493240"] as const },
  { id: 8, name: "Lavanda Suave", unlocked: true, gradient: ["#e6e6fa", "#d8bfd8"] as const },
];

const fondos = [
  { id: 1, name: "Galaxy", unlocked: true, gradient: ["#2b5876", "#4e4376"] as const },
  { id: 2, name: "Montañas", unlocked: false, gradient: ["#cfd9df", "#e2ebf0"] as const },
];

const avatares = [
  { id: 1, name: "Robot", unlocked: true, gradient: ["#d9a7c7", "#fffcdc"] as const },
  { id: 2, name: "Guerrero", unlocked: false, gradient: ["#bdc3c7", "#2c3e50"] as const },
];

/* ----------------------------- tipos ----------------------------- */

type ThemeItem = {
  id: number;
  name: string;
  unlocked: boolean;
  gradient: readonly string[];
};

type BloqueProps = {
  title: string;
  filtro: "all" | "unlocked" | "locked";
  setFiltro: (f: "all" | "unlocked" | "locked") => void;
  data: ThemeItem[];
  seleccionado: number | null;
  setSeleccionado: (id: number | null) => void;
  setTemaActivo?: (item: ThemeItem | null) => void;
  temaActivo?: ThemeItem | null;
};

type RewardCardProps = {
  item: ThemeItem;
  selected?: boolean;
  onSelect: () => void;
};

/* ----------------------------- COMPONENTE ----------------------------- */

export default function RecompensasScreen({ navigation }) {
  const [temaFiltro, setTemaFiltro] = useState("unlocked");
  const [fondoFiltro, setFondoFiltro] = useState("unlocked");
  const [avatarFiltro, setAvatarFiltro] = useState("unlocked");

  const [temaSeleccionado, setTemaSeleccionado] = useState<number | null>(null);
  const [temaActivo, setTemaActivo] = useState<ThemeItem | null>(null);

  useEffect(() => {
    // Cargar tema guardado al iniciar
    const cargarTema = async () => {
      const saved = await AsyncStorage.getItem("temaActivo");
      if (saved) setTemaActivo(JSON.parse(saved));
    };
    cargarTema();
  }, []);

  const filtrar = (data: ThemeItem[], filtro: string) => {
    if (filtro === "all") return data;
    if (filtro === "unlocked") return data.filter((i) => i.unlocked);
    return data.filter((i) => !i.unlocked);
  };

  const resetear = async () => {
    setTemaFiltro("unlocked");
    setFondoFiltro("unlocked");
    setAvatarFiltro("unlocked");
    setTemaSeleccionado(null);
    setTemaActivo(null);
    await AsyncStorage.removeItem("temaActivo");
  };

  const guardarTemaFavorito = async () => {
    if (!temaActivo) return;
    await AsyncStorage.setItem("temaActivo", JSON.stringify(temaActivo));
    alert("Tema guardado localmente ✅");
  };

  return (
    <LinearGradient
      colors={Platform.OS !== "web" && temaActivo ? temaActivo.gradient : ["#FFFFFF", "#FFFFFF"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <Header>
          <HeaderTitle style={{ color: Platform.OS !== "web" && temaActivo ? "white" : "#adcBff" }}>
            Recompensas
          </HeaderTitle>
          <User>
            <FontAwesome
              name="user"
              size={32}
              color={Platform.OS !== "web" && temaActivo ? "white" : "#adcBff"}
            />
          </User>
        </Header>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <Bloque
            title="Temas"
            filtro={temaFiltro}
            setFiltro={setTemaFiltro}
            data={filtrar(temas, temaFiltro)}
            seleccionado={temaSeleccionado}
            setSeleccionado={setTemaSeleccionado}
            setTemaActivo={setTemaActivo}
            temaActivo={temaActivo}
          />

          <Bloque
            title="Fondos"
            filtro={fondoFiltro}
            setFiltro={setFondoFiltro}
            data={filtrar(fondos, fondoFiltro)}
            seleccionado={null}
            setSeleccionado={() => {}}
            temaActivo={temaActivo}
          />

          <Bloque
            title="Avatares"
            filtro={avatarFiltro}
            setFiltro={setAvatarFiltro}
            data={filtrar(avatares, avatarFiltro)}
            seleccionado={null}
            setSeleccionado={() => {}}
            temaActivo={temaActivo}
          />

          {/* BOTONES */}
          <ButtonsContainer>
            <ActionButton onPress={resetear}>
              <ActionText>Restablecer</ActionText>
            </ActionButton>
            <ActionButton onPress={guardarTemaFavorito}>
              <ActionText>Guardar tema favorito</ActionText>
            </ActionButton>
          </ButtonsContainer>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

/* ----------------------------- BLOQUE ----------------------------- */

function Bloque({
  title,
  filtro,
  setFiltro,
  data,
  seleccionado,
  setSeleccionado,
  setTemaActivo,
  temaActivo,
}: BloqueProps) {
  return (
    <SectionContainer>
      <SectionTitle style={{ color: Platform.OS !== "web" && temaActivo ? "white" : "#4b4b4b" }}>
        {title}
      </SectionTitle>

      <FiltersRow>
        <TabButton active={filtro === "unlocked"} onPress={() => setFiltro("unlocked")}>
          <TabText active={filtro === "unlocked"}>Desbloqueados</TabText>
        </TabButton>

        <TabButton active={filtro === "locked"} onPress={() => setFiltro("locked")}>
          <TabText active={filtro === "locked"}>Bloqueados</TabText>
        </TabButton>

        <TabButton active={filtro === "all"} onPress={() => setFiltro("all")}>
          <TabText active={filtro === "all"}>Todos</TabText>
        </TabButton>
      </FiltersRow>

      <RewardsRow horizontal showsHorizontalScrollIndicator={false}>
        {data.length === 0 ? (
          <EmptyText>No hay elementos aquí</EmptyText>
        ) : (
          data.map((item) => (
            <RewardCard
              key={item.id}
              item={item}
              selected={seleccionado === item.id}
              onSelect={() => {
                if (!item.unlocked) return;
                setSeleccionado(item.id);

                if (Platform.OS !== "web" && setTemaActivo) {
                  setTemaActivo(item); // solo en Android/iOS
                }
              }}
            />
          ))
        )}
      </RewardsRow>
    </SectionContainer>
  );
}

/* ----------------------------- Recompensas ----------------------------- */

function RewardCard({ item, selected, onSelect }: RewardCardProps) {
  const scale = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => onSelect());
  };

  return (
    <Animated.View style={{ transform: [{ scale }], marginRight: 15 }}>
      <TouchableOpacity activeOpacity={0.85} onPress={animatePress} disabled={!item.unlocked}>
        <Card style={{ borderWidth: selected ? 3 : 0, borderColor: "#8da4ff" }}>
          <LinearGradient
            colors={item.gradient}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              opacity: item.unlocked ? 1 : 0.3,
            }}
          >
            <CardLabel selected={selected} unlocked={item.unlocked}>
              {item.name}
            </CardLabel>
          </LinearGradient>

          {!item.unlocked && (
            <LockOverlay>
              <FontAwesome name="lock" size={30} color="white" />
            </LockOverlay>
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
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
`;

const User = styled.View`
  width: 20%;
  align-items: flex-end;
`;

const SectionContainer = styled.View`
  width: 100%;
  padding: 20px;
  margin-top: 5px;
`;

const SectionTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
`;

const FiltersRow = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const TabButton = styled(TouchableOpacity)`
  padding: 6px 14px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: ${(p) => (p.active ? "rgb(173,203,255)" : "#e6e6e6")};
`;

const TabText = styled.Text`
  color: ${(p) => (p.active ? "white" : "#555")};
  font-weight: bold;
`;

const RewardsRow = styled.ScrollView`
  flex-direction: row;
  padding-vertical: 10px;
`;

const Card = styled.View`
  width: 140px;
  height: 140px;
  border-radius: 15px;
  overflow: hidden;
  background-color: #f0f0f0;
`;

const CardLabel = styled.Text<{ selected?: boolean; unlocked?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
  color: ${(p) =>
    !p.unlocked ? "rgba(255,255,255,0.5)" : p.selected ? "#fff14d" : "white"};
  ${(p) =>
    p.selected &&
    `
    text-shadow: 0px 0px 8px rgba(255,255,0,1);
  `}
`;

const EmptyText = styled.Text`
  font-size: 18px;
  color: #777;
  padding: 20px;
  text-align: center;
`;

const LockOverlay = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: rgba(0,0,0,0.45);
  justify-content: center;
  align-items: center;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  padding: 25px;
  margin-top: 15px;
  justify-content: center;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #8da4ff;
  padding: 15px;
  border-radius: 14px;
  align-items: center;
  margin-bottom: 10px;
`;

const ActionText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;
