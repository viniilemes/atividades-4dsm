import React, { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface UserFormProps {
  onSubmit: (name: string, age: string) => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; age?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!age.trim()) {
      newErrors.age = 'Idade é obrigatória';
    } else if (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 150) {
      newErrors.age = 'Idade deve ser um número válido entre 0 e 150';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(name, age);
    setName('');
    setAge('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Adicionar Novo Usuário</h2>

      <div className="space-y-4">
        <Input
          id="name"
          label="Nome"
          type="text"
          placeholder="Digite o nome completo"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
          required
          disabled={isLoading}
        />

        <Input
          id="age"
          label="Idade"
          type="number"
          placeholder="Digite a idade"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);
            if (errors.age) setErrors({ ...errors, age: undefined });
          }}
          error={errors.age}
          required
          min="0"
          max="150"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Adicionar Usuário'}
        </Button>
      </div>
    </form>
  );
};
