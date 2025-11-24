// index.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CrearTaskScreen from './CreateTaskScreen'; // Ajusta la ruta si no está en la misma carpeta

export default function App() {
  return (
    <SafeAreaProvider>
      <CrearTaskScreen />
    </SafeAreaProvider>
  );
}
