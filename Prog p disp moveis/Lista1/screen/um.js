import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants'; // Para a altura da StatusBar [cite: 19]

export default function Um() {
  return (
    // Container pai com a folga da barra de status [cite: 27, 29]
    <View style={styles.container}>
      <View style={styles.topo} />
      
      <View style={styles.baixo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa a tela toda
    flexDirection: 'column', // Itens um abaixo do outro 
    paddingTop: Constants.statusBarHeight, // Desloca o início para não cobrir a StatusBar [cite: 29]
  },
  topo: {
    flex: 0.5, // 50% da tela 
    backgroundColor: 'crimson', // Cor requisitada [cite: 18]
  },
  baixo: {
    flex: 0.5, // 50% da tela 
    backgroundColor: 'salmon', // Cor requisitada [cite: 18]
  },
});