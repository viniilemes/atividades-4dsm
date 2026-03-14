import React from 'react';
import type { User } from '../redux/slices/userSlice';
import { Button } from './Button';

interface UserCardProps {
  user: User;
  onIncreaseAge: (id: number) => void;
  onRemove: (id: number) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onIncreaseAge,
  onRemove,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-sky-100 text-sky-800">
              {user.age} anos
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onIncreaseAge(user.id)}
          className="flex-1"
          title="Clique para incrementar idade"
        >
          Fazer aniversário
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(user.id)}
          title="Remover usuário"
        >
          Remover
        </Button>
      </div>
    </div>
  );
};
