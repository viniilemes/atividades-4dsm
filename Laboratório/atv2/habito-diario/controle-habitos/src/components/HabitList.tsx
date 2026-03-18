import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store'; // Certifique-se de ter exportado o RootState na sua store
import { setFilterCategory, clearCompletedHabits } from '../store/habitSlice';
import { HabitItem } from './HabitItem';
import { Box, Button, TextField, List, Typography } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export const HabitList = () => {
  const dispatch = useDispatch();
  const { habits, filterCategory } = useSelector((state: RootState) => state.habits);

  // Lógica do filtro com comparação case-insensitive
  const filteredHabits = filterCategory 
    ? habits.filter(h => h.category && h.category.toLowerCase().includes(filterCategory.toLowerCase()))
    : habits;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField 
          label="Filtrar por Categoria" 
          variant="standard"
          value={filterCategory}
          onChange={(e) => dispatch(setFilterCategory(e.target.value))}
        />
        <Button 
          variant="outlined" 
          color="warning" 
          startIcon={<ClearAllIcon />}
          onClick={() => dispatch(clearCompletedHabits())} // Limpar todos os concluídos [cite: 18, 31]
        >
          Limpar Concluídos
        </Button>
      </Box>

      {filteredHabits.length === 0 ? (
        <Typography color="text.secondary" align="center" mt={4}>
          Nenhum hábito encontrado.
        </Typography>
      ) : (
        <List>
          {filteredHabits.map(habit => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </List>
      )}
    </Box>
  );
};