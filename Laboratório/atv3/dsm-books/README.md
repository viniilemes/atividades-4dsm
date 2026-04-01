# DSM Books - Referências Bibliográficas

Este projeto foi desenvolvido como parte da Atividade 3 da disciplina de Laboratório de Desenvolvimento Web (Aula 06). É uma aplicação React com TypeScript focada em exibir e filtrar as referências bibliográficas do curso de DSM.

## 🎯 Objetivo da Atividade

1. Configurar uma aplicação React + TypeScript.
2. Utilizar a **Context API** para gerenciamento de estado global.
3. Consumir dados de um arquivo estático local (`books.json`) utilizando a biblioteca **Axios**.
4. Implementar rotas de navegação com **React Router**.
5. **(Tarefa Principal)**: Complementar o componente `CourseFilter.tsx` para realizar a filtragem dos livros por **Disciplina** e por **Semestre**.

## 🛠️ Tecnologias Utilizadas

* [React](https://reactjs.org/) (com Hooks e Context API)
* [TypeScript](https://www.typescriptlang.org/)
* [Material UI (MUI)](https://mui.com/) - Para padronização e construção da interface gráfica (Cards, Typography, Selects).
* [React Router Dom](https://reactrouter.com/) - Para o roteamento entre páginas (Início e Filtro).
* [Axios](https://axios-http.com/) - Para requisições HTTP locais.

## 📂 Arquitetura do Projeto

O projeto segue a estrutura de componentes funcionais sugerida em aula:

* `/public/data/books.json`: Mock de dados fornecido para a aplicação.
* `/src/context/`: Contém a lógica de estado global (`BooksContext.tsx`).
* `/src/components/`: Componentes reutilizáveis de interface (`BookList.tsx`, `CourseFilter.tsx`).
* `/src/pages/`: Componentes de visualização atrelados às rotas (`Home.tsx`, `Course.tsx`).
* `/src/types.d.ts`: Arquivo de tipagem TypeScript com a interface `Book`.

## 🚀 Como executar o projeto localmente

1. Faça o clone do repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd dsm-books
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

5. Acesse `http://localhost:3000` no seu navegador.
