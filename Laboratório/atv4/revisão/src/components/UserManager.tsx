import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

export const UserManager = () => {
  const { users, addUser, removeUser } = useUsers();
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name) {
      addUser(name);
      setName('');
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
      <h2>Gerenciar Usuários</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do usuário" />
      <button onClick={handleAdd}>Adicionar Usuário</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} <button onClick={() => removeUser(user.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};