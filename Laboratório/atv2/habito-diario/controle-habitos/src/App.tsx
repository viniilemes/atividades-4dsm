import { Container, Typography, Box } from '@mui/material';
import { HabitForm } from './components/HabitForm';
import { HabitList } from './components/HabitList';

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Controle de Hábitos Diários
        </Typography>
        
        <HabitForm />
        <HabitList />
        
      </Box>
    </Container>
  );
}

export default App;