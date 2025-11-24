import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

export default function Racha() {
  const today = new Date().toDateString(); 
  const [lastLoginDate, setLastLoginDate] = useState(today);

  const [streakCount, setStreakCount] = useState(1); 
  const [bestStreak, setBestStreak] = useState(1);   

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  
    Animated.timing(progressAnim, {
      toValue: streakCount / bestStreak,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [streakCount, bestStreak]);

  return (
    <Container>
      <Title>Racha de Estudio 🔥</Title>
      
      <StreakContainer>
        <Label>Racha Actual:</Label>
        <Count>{streakCount} día{streakCount > 1 ? 's' : ''}</Count>
      </StreakContainer>

      <StreakContainer>
        <Label>Mejor Racha:</Label>
        <Count>{bestStreak} día{bestStreak > 1 ? 's' : ''}</Count>
      </StreakContainer>

      <ProgressBackground>
        <Animated.View
          style={{
            height: 20,
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: '#4caf50',
            borderRadius: 10,
          }}
        />
      </ProgressBackground>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const StreakContainer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  align-items: center;
`;

const Label = styled.Text`
  font-size: 18px;
  margin-right: 10px;
`;

const Count = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ff5722;
`;

const ProgressBackground = styled.View`
  width: 80%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  margin-top: 20px;
  overflow: hidden;
`;
