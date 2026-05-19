import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByEmail, createUser, getUserById, updateUserById, changeUserPassword } from './repository.js';

export async function loginService(email, password) {
  const user = await getUserByEmail(email?.trim());

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Senha incorreta');
  }

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export async function registerService(email, password, name) {
  const normalizedEmail = email?.trim();
  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    email: normalizedEmail,
    password: hashedPassword,
    name,
    role: 'aluno'
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export async function updateProfileService(id, data) {
  return await updateUserById(id, data);
}

export async function changePasswordService(id, oldPassword, newPassword) {
  const user = await getUserById(id);
  if (!user) throw new Error('Usuário não encontrado');

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error('Senha atual incorreta');

  const hashed = await bcrypt.hash(newPassword, 10);
  return await changeUserPassword(id, hashed);
}
