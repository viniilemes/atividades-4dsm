import React from 'react';
import type { User } from '../redux/slices/userSlice';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  onIncreaseAge: (id: number) => void;
  onRemove: (id: number) => void;
  isEmpty?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onIncreaseAge,
  onRemove,
  isEmpty = false,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {isEmpty ? 'Nenhum usuário cadastrado' : `Usuários Cadastrados (${users.length})`}
      </h2>

      {isEmpty ? (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200 text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z"
              />
            </svg>
          </div>
          <p className="text-slate-600 text-lg">
            Nenhum usuário cadastrado ainda.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Preencha o formulário acima para adicionar um novo usuário.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onIncreaseAge={onIncreaseAge}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
