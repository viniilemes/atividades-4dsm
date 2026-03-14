import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { addUser, incrementAge, removeUser } from "./redux/slices/userSlice";
import type { User } from "./redux/slices/userSlice";
import { useState } from "react";
import { Header } from "./components/Header";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";

export default function App() {
  const users = useSelector((state: RootState) => state.userObject.users);
  const [id, setId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const handleAddUser = (name: string, age: string) => {
    setIsLoading(true);
    
    // Simular delay de processamento para melhor UX
    setTimeout(() => {
      const user: User = {
        id,
        name: name.trim(),
        age: parseInt(age),
      };
      dispatch(addUser(user));
      setId((prev: number) => prev + 1);
      setIsLoading(false);
    }, 300);
  };

  const handleIncreaseAge = (userId: number) => {
    dispatch(incrementAge(userId));
  };

  const handleRemoveUser = (userId: number) => {
    dispatch(removeUser(userId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="min-h-screen flex items-center justify-center py-8 px-4 max-w-6xl mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário - lado esquerdo em telas grandes */}
          <div className="lg:col-span-1">
            <UserForm onSubmit={handleAddUser} isLoading={isLoading} />
          </div>

          {/* Lista de usuários - lado direito */}
          <div className="lg:col-span-2">
            <UserList
              users={users}
              onIncreaseAge={handleIncreaseAge}
              onRemove={handleRemoveUser}
              isEmpty={users.length === 0}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 text-center py-6 mt-12">
        <p>© 2026 Gerenciador de Usuários | Desenvolvido com React e Tailwind CSS</p>
      </footer>
    </div>
  );
}