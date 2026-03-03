# 🧮 Calculadora de IMC

Aplicação mobile desenvolvida com **React Native** e **Expo** para calcular o Índice de Massa Corporal (IMC) com classificação de acordo com os padrões da OMS.

## ✨ Funcionalidades

- **Cálculo de IMC**: Calcula o IMC automaticamente a partir de peso (kg) e altura (m)
- **Classificação**: Exibe a categoria de peso conforme padrões da OMS
  - Abaixo do Peso
  - Peso Normal
  - Sobrepeso
  - Obesidade (Grau I, II e III)
- **Código de cores**: Cada categoria possui uma cor distintiva para melhor visualização
- **Validação de entrada**: Verifica valores numéricos válidos e maiores que zero
- **Limpeza de campos**: Botão para resetar a calculadora

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install
```

### Executar a aplicação

```bash
# Iniciar o Expo
npm start

# Opções:
npm run android      # Emulador Android
npm run ios          # Emulador iOS
npm run web          # No navegador
```

## 📱 Como Usar

1. Insira seu **peso em kg** (ex: 70.5)
2. Insira sua **altura em metros** (ex: 1.75)
3. Clique no botão **"Calcular IMC"**
4. O resultado será exibido com a categoria e cor correspondente
5. Use **"Limpar"** para resetar a calculadora

## 🛠️ Tecnologias

- **React Native** 0.81.5
- **Expo** ~54.0.33
- **React** 19.1.0
- **React Native Paper** 4.9.2
- **Expo Vector Icons** 15.0.3

## 📁 Estrutura do Projeto

```
├── App.js              # Componente principal com lógica da calculadora
├── index.js            # Ponto de entrada
├── package.json        # Dependências do projeto
├── app.json            # Configuração da aplicação Expo
└── assets/             # Recursos (ícones, imagens)
```
