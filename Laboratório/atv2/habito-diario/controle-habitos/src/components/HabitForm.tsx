import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addHabit } from '../store/habitSlice';
import { Box, TextField, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const HabitForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('O nome do hábito é obrigatório');
      return;
    }

    if (name.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    dispatch(addHabit({
      id: crypto.randomUUID(),
      name: name.trim(),
      category: category.trim(),
      completed: false
    }));

    setName('');
    setCategory('');
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField 
          label="Nome do Hábito *" 
          variant="outlined" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth
          placeholder="Ex: Beber água"
        />
        <TextField 
          label="Categoria (Opcional)" 
          variant="outlined" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="Ex: Saúde"
        />
        <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
          Adicionar
        </Button>
      </Box>
    </Box>
  );
};