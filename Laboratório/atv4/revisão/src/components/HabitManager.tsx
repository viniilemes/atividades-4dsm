import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { addHabit, removeHabit, filterHabits } from '../store/abitSlice';

export const HabitManager = () => {
  const dispatch = useDispatch();
  const { habits, filteredCategory } = useSelector((state: RootState) => state.habits);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Saúde');

  const displayedHabits = filteredCategory 
    ? habits.filter((h: { category: string }) => h.category === filteredCategory) 
    : habits;

  const handleAdd = () => {
    if (name) {
      dispatch(addHabit({ id: Date.now().toString(), name, category }));
      setName('');
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <h2>Gerenciar Hábitos</h2>
      
      {/* Formulário de Cadastro */}
      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do hábito" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Saúde">Saúde</option>
          <option value="Estudo">Estudo</option>
          <option value="Lazer">Lazer</option>
        </select>
        <button onClick={handleAdd}>Adicionar Hábito</button>
      </div>

      {/* Filtro */}
      <div style={{ marginTop: '10px' }}>
        <label>Filtrar por: </label>
        <select onChange={(e) => dispatch(filterHabits(e.target.value))}>
          <option value="Todos">Todos</option>
          <option value="Saúde">Saúde</option>
          <option value="Estudo">Estudo</option>
          <option value="Lazer">Lazer</option>
        </select>
      </div>

      {/* Lista */}
      <ul>
        {displayedHabits.map((habit: { id: string; name: string; category: string }) => (
          <li key={habit.id}>
            {habit.name} ({habit.category}) <button onClick={() => dispatch(removeHabit(habit.id))}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};