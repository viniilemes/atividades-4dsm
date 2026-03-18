import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Tipagem sugerida na atividade 
export interface Habit {
  id: string;
  name: string;
  category: string;
  completed: boolean;
}

// Tipagem do estado global
export interface HabitState {
  habits: Habit[];
  filterCategory: string; 
}

const initialState: HabitState = {
  habits: [],
  filterCategory: '', 
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    // Adicionar novos hábitos 
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
    },
    // Alterar informações de um hábito
    editHabit: (state, action: PayloadAction<{ id: string; name: string; category: string }>) => {
      const habit = state.habits.find(h => h.id === action.payload.id);
      if (habit) {
        habit.name = action.payload.name;
        habit.category = action.payload.category;
      }
    },
    // Excluir hábitos 
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
    },
    // Marcar hábitos como concluídos no dia 
    toggleHabitComplete: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h.id === action.payload);
      if (habit) {
        habit.completed = !habit.completed;
      }
    },
    // Limpar todos os hábitos concluídos 
    clearCompletedHabits: (state) => {
      state.habits = state.habits.filter(h => !h.completed);
    },
    // Filtrar hábitos por categoria 
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    }
  }
});

export const { 
  addHabit, 
  editHabit, 
  deleteHabit, 
  toggleHabitComplete, 
  clearCompletedHabits, 
  setFilterCategory 
} = habitSlice.actions;

export default habitSlice.reducer;