import { UserManager } from './components/UserManager';
import { HabitManager } from './components/HabitManager';

function App() {
  return (
    <div>
      <h1>Mini Dashboard</h1>
      <UserManager />
      <HabitManager />
    </div>
  );
}

export default App;