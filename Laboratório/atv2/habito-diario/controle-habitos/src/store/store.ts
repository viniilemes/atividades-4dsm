import { configureStore } from '@reduxjs/toolkit';
import habitReducer from './habitSlice';

export const store = configureStore({
  reducer: {
    habits: habitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Exemplo de Selector para buscar os hábitos filtrados 
export const selectFilteredHabits = (state: RootState) => {
  const { habits, filterCategory } = state.habits;
  if (!filterCategory) return habits;
  return habits.filter(habit => habit.category.toLowerCase().includes(filterCategory.toLowerCase()));
};