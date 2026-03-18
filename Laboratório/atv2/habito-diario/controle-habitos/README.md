# 📋 Controle de Hábitos Diários

Uma aplicação web moderna para gerenciar e acompanhar seus hábitos diários. Construída com React, TypeScript, Redux Toolkit e Material-UI.

## ✨ Funcionalidades

### ✅ Gerenciamento de Hábitos
- **Adicionar hábitos**: Crie novos hábitos com nome e categoria opcional
- **Editar hábitos**: Modifique nome e categoria através de um modal intuitivo
- **Deletar hábitos**: Remova hábitos que não deseja mais acompanhar
- **Marcar como concluído**: Marque hábitos como concluídos no dia
- **Indicação visual**: Hábitos concluídos aparecem com linha de corte e opacidade reduzida

### 🔍 Filtros e Organização
- **Filtrar por categoria**: Procure hábitos específicos por sua categoria
- **Comparação case-insensitive**: O filtro funciona independente de maiúsculas/minúsculas
- **Limpar concluídos**: Remova todos os hábitos marcados como concluídos com um clique

### ✔️ Validações
- Nome obrigatório (não aceita vazio)
- Mínimo de 3 caracteres para o nome
- Limpeza automática de espaços em branco (trim)
- Feedback visual com mensagens de erro

## 🏗️ Arquitetura

### Stack Tecnológico
```
Frontend:
├── React 19.2.4
├── TypeScript 5.6
├── Vite 8.0.0 (build tool)
├── Redux Toolkit 2.11.2
├── React-Redux 9.2.0
└── Material-UI 7.3.9

Styling:
├── @emotion/react 11.14.0
├── @emotion/styled 11.14.1
└── @mui/icons-material 7.3.9
```

### Estrutura de Pastas

```
controle-habitos/
├── src/
│   ├── components/
│   │   ├── HabitForm.tsx       # Formulário para adicionar novos hábitos
│   │   ├── HabitItem.tsx       # Componente individual de hábito com edição
│   │   └── HabitList.tsx       # Lista com filtro e botão limpar
│   ├── store/
│   │   ├── habitSlice.ts       # Redux slice com reducers (lógica de estado)
│   │   └── store.ts            # Configuração da store Redux
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Entry point da aplicação
│   └── App.css                 # Estilos globais
├── package.json                # Dependências e scripts
├── tsconfig.json               # Configuração TypeScript
├── vite.config.ts              # Configuração Vite
└── README.md                   # Este arquivo
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação

```bash
# Clone ou acesse o repositório
cd controle-habitos

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento com hot reload
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Compile e otimize para produção
npm run build

# Visualize a build localmente
npm run preview
```

### Linting

```bash
# Verifica erros de código
npm run lint
```

## 📖 Como Usar

### Adicionar um Hábito
1. Digite o **"Nome do Hábito"** (obrigatório, mínimo 3 caracteres)
2. Opcionalmente, adicione uma **"Categoria"** (ex: Saúde, Trabalho, etc)
3. Clique em **"Adicionar"** ou pressione Enter

### Marcar como Concluído
- Clique no **checkbox** ao lado do hábito para marcar/desmarcar como concluído
- Hábitos concluídos aparecem com lista vertical e transparência

### Editar um Hábito
1. Clique no **ícone de lápis** (Edit) na direita do hábito
2. Um modal aparecerá com os campos de edição
3. Modifique o nome e/ou categoria
4. Clique em **"Salvar"** para confirmar as mudanças

### Deletar um Hábito
1. Clique no **ícone de lixeira** (Delete) de cor vermelha
2. O hábito será permanentemente removido da lista

### Filtrar por Categoria
1. Use o campo **"Filtrar por Categoria"** no topo da lista
2. Digite uma categoria (ex: "Saúde")
3. A lista mostrará apenas hábitos que contenham essa categoria
4. Deixe em branco para ver todos os hábitos novamente

### Limpar Todos os Concluídos
1. Clique no botão **"Limpar Concluídos"** (cor amarela) no topo
2. Todos os hábitos marcados como concluídos serão removidos
3. Esta ação é irreversível

## 🔧 Detalhes Técnicos

### Redux Store Structure

```typescript
State: {
  habits: {
    habits: Habit[],           // Array de hábitos
    filterCategory: string     // Texto do filtro atual
  }
}

Habit Interface: {
  id: string                   // UUID único
  name: string                 // Nome do hábito
  category: string             // Categoria opcional
  completed: boolean           // Status de conclusão
}
```

### Actions Disponíveis

| Action | Descrição | Payload |
|--------|-----------|---------|
| `addHabit` | Adiciona novo hábito | `Habit` |
| `editHabit` | Edita nome/categoria | `{ id, name, category }` |
| `deleteHabit` | Remove um hábito | `id: string` |
| `toggleHabitComplete` | Marca/desmarca como concluído | `id: string` |
| `clearCompletedHabits` | Remove todos os concluídos | - |
| `setFilterCategory` | Atualiza filtro | `filterCategory: string` |

### Selector Disponível

```typescript
selectFilteredHabits(state: RootState)
// Retorna array de hábitos filtrados pela categoria
// com comparação case-insensitive
```

## 🐛 Melhorias Realizadas

### Correções de TypeScript
- ✅ Imports de tipos com `type` keyword (TypeScript strict mode)
- ✅ Exportação correta de interfaces
- ✅ Tipagem automática de RootState

### Melhorias de UX
- ✅ Substituição de `prompt()` por Modal MUI profissional
- ✅ Mensagens de erro com `Alert` visual
- ✅ Placeholders informativos nos campos
- ✅ Focus automático em campos de edição

### Validações Robustas
- ✅ Validação de nome obrigatório
- ✅ Validação de comprimento mínimo (3 caracteres)
- ✅ Limpeza de espaços em branco (trim)
- ✅ Validação null-safe em filtros

### Lógica Melhorada
- ✅ Filtro case-insensitive com `includes()`
- ✅ Estados separados para edição (não modifica dados originais)
- ✅ Dialog de edição com validação

## 📝 Exemplo de Uso

```typescript
// App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

// Wrap aplicação com Redux Provider
<Provider store={store}>
  <App />
</Provider>

// Componentes podem usar Redux assim:
import { useDispatch, useSelector } from 'react-redux';
import { addHabit } from './store/habitSlice';

const dispatch = useDispatch();
const { habits, filterCategory } = useSelector((state: RootState) => state.habits);
```

## 🎓 Desenvolvido Para

Laboratório de Engenharia de Software - FATEC - Semestre 04

## 📄 Licença

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
