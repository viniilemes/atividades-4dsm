import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Habit {
  id: string;
  name: string;
  category: string;
}

interface HabitState {
  habits: Habit[];
  filteredCategory: string | null;
}

const initialState: HabitState = {
  habits: [],
  filteredCategory: null,
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
    },
    removeHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
    },
    filterHabits: (state, action: PayloadAction<string | null>) => {
      state.filteredCategory = action.payload === "Todos" ? null : action.payload;
    },
  },
});

export const { addHabit, removeHabit, filterHabits } = habitSlice.actions;
export default habitSlice.reducer;