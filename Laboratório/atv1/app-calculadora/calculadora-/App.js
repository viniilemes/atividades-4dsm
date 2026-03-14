import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";

const getImcCategory = (imc) => {
  // Retorna { label, color } conforme faixas da OMS
  if (imc < 18.5) return { label: "Abaixo do Peso", color: "#F1C40F" }; // amarelo claro
  if (imc >= 18.5 && imc <= 24.9) return { label: "Peso Normal", color: "#2ECC71" }; // verde
  if (imc >= 25 && imc <= 29.9) return { label: "Sobrepeso", color: "#F39C12" }; // amarelo escuro
  if (imc >= 30 && imc <= 34.9) return { label: "Obesidade Grau I", color: "#E67E22" }; // laranja
  if (imc >= 35 && imc <= 39.9) return { label: "Obesidade Grau II (Severa)", color: "#E74C3C" }; // vermelho
  return { label: "Obesidade Grau III (Mórbida)", color: "#C0392B" }; // vermelho escuro
};

export default function App() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState(null); // { imc, label, color }
  const [error, setError] = useState("");

  const limpar = () => {
    setPeso("");
    setAltura("");
    setResultado(null);
    setError("");
  };

  const calcularImc = () => {
    setError("");
    Keyboard.dismiss();

    // Validações básicas
    if (!peso || !altura) {
      setError("Preencha peso e altura antes de calcular.");
      return;
    }

    const pesoNum = parseFloat(peso.replace(",", "."));
    const alturaNum = parseFloat(altura.replace(",", "."));

    if (Number.isNaN(pesoNum) || Number.isNaN(alturaNum)) {
      setError("Insira valores numéricos válidos.");
      return;
    }
    if (pesoNum <= 0) {
      setError("Peso deve ser maior que zero.");
      return;
    }
    if (alturaNum <= 0) {
      setError("Altura deve ser maior que zero.");
      return;
    }

    const imc = pesoNum / (alturaNum * alturaNum);
    const imcRounded = Math.round(imc * 100) / 100; // duas casas decimais
    const category = getImcCategory(imcRounded);

    setResultado({
      imc: imcRounded.toFixed(2),
      label: category.label,
      color: category.color,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora de IMC</Text>

      <TextInput
        style={styles.input}
        placeholder="Peso (kg) - ex: 70.5"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
        returnKeyType="done"
      />

      <TextInput
        style={styles.input}
        placeholder="Altura (m) - ex: 1.75"
        keyboardType="numeric"
        value={altura}
        onChangeText={setAltura}
        returnKeyType="done"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonsRow}>
        <Button title="Calcular IMC" onPress={calcularImc} />
        <View style={{ width: 12 }} />
        <Button title="Limpar" color="#999" onPress={limpar} />
      </View>

      {resultado ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Seu IMC</Text>
          <Text style={styles.imcValue}>{resultado.imc}</Text>
          <Text style={[styles.categoryText, { color: resultado.color }]}>
            {resultado.label}
          </Text>
        </View>
      ) : (
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>Preencha os campos e toque em Calcular IMC</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>IMC = Peso / (Altura × Altura)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  errorText: {
    color: "#C0392B",
    textAlign: "center",
    marginBottom: 8,
  },
  resultBox: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
  },
  imcValue: {
    fontSize: 40,
    fontWeight: "700",
    marginTop: 6,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  hintBox: {
    padding: 18,
    alignItems: "center",
  },
  hintText: {
    color: "#666",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#999",
  },
});
