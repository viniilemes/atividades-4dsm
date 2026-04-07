# Mini Dashboard - React + Redux Toolkit

Este projeto foi desenvolvido como parte das atividades da disciplina de Laboratório de Desenvolvimento Web (Fatec), com o objetivo de praticar o gerenciamento de estado global utilizando **React** e **Redux Toolkit**.

A aplicação consiste em um Mini Dashboard com duas funcionalidades principais: gerenciamento de usuários e gerenciamento de hábitos diários.

## 🚀 Funcionalidades

### 1. Gerenciar Usuários
* Adicionar novos usuários.
* Listar usuários cadastrados.
* Remover usuários.
* **Destaque:** Utiliza um Hook personalizado (`useUsers`) para encapsular a lógica do Redux.

### 2. Gerenciar Hábitos
* Cadastrar novos hábitos com nome e categoria (Saúde, Estudo, Lazer).
* Listar hábitos cadastrados.
* Remover hábitos.
* Filtrar a lista de hábitos exibidos por categoria.

## 🛠️ Tecnologias Utilizadas

* **React** (Biblioteca para construção de interfaces)
* **TypeScript** (Tipagem estática para JavaScript)
* **Vite** (Ferramenta de build rápida)
* **Redux Toolkit** (Gerenciamento de estado global)
* **React-Redux** (Integração do Redux com o React)

## 📂 Estrutura Principal do Projeto

O projeto foi organizado da seguinte forma:

```text
src/
 ┣ components/
 ┃ ┣ HabitManager.tsx      # Componente de gerenciamento de hábitos
 ┃ ┗ UserManager.tsx       # Componente de gerenciamento de usuários
 ┣ hooks/
 ┃ ┗ useUsers.ts           # Hook customizado para ações de usuários
 ┣ store/
 ┃ ┣ habitSlice.ts         # Slice do Redux para hábitos
 ┃ ┣ store.ts              # Configuração central da Store
 ┃ ┗ userSlice.ts          # Slice do Redux para usuários
 ┣ App.tsx                 # Componente principal (Dashboard)
 ┗ main.tsx                # Ponto de entrada e configuração do Provider