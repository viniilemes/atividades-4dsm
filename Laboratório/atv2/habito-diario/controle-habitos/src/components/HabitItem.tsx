import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleHabitComplete, deleteHabit, editHabit, type Habit } from '../store/habitSlice';
import { ListItem, ListItemText, IconButton, Checkbox, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface HabitItemProps {
  habit: Habit;
}

export const HabitItem = ({ habit }: HabitItemProps) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editCategory, setEditCategory] = useState(habit.category);

  const handleEditOpen = () => {
    setEditName(habit.name);
    setEditCategory(habit.category);
    setOpenDialog(true);
  };

  const handleEditConfirm = () => {
    if (editName.trim()) {
      dispatch(editHabit({ id: habit.id, name: editName, category: editCategory }));
      setOpenDialog(false);
    }
  };

  const handleEditCancel = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            <IconButton edge="end" aria-label="edit" onClick={handleEditOpen} sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => dispatch(deleteHabit(habit.id))}>
              <DeleteIcon color="error" />
            </IconButton>
          </>
        }
        sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, boxShadow: 1 }}
      >
        <Checkbox 
          checked={habit.completed} 
          onChange={() => dispatch(toggleHabitComplete(habit.id))} 
        />
        <ListItemText 
          primary={habit.name} 
          // Indicação visual de quando um hábito está concluído 
          sx={{ textDecoration: habit.completed ? 'line-through' : 'none', opacity: habit.completed ? 0.6 : 1 }}
        />
        {habit.category && (
          <Chip label={habit.category} size="small" variant="outlined" sx={{ mr: 8 }} />
        )}
      </ListItem>

      {/* Dialog de edição */}
      <Dialog open={openDialog} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Hábito</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Nome do Hábito *" 
            variant="outlined" 
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
          />
          <TextField 
            label="Categoria" 
            variant="outlined" 
            fullWidth
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancelar</Button>
          <Button onClick={handleEditConfirm} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};