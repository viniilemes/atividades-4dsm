import bcrypt from 'bcrypt';
import { getUserByEmail, createUser, getUserById, updateUserById, changeUserPassword } from './repository.js';
import jwt from 'jsonwebtoken';
import {
  createAlunoRepository,
  getAlunoByEmailRepository,
} from '../alunos/repository.js';
import {
  createProfessorRepository,
  getProfessorByEmailRepository,
} from '../professores/repository.js';

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

function generateMatricula() {
  return `MAT${Date.now()}`;
}

export async function registerService(name, email, password, role = 'aluno', profile = {}) {
  const normalizedEmail = email?.trim();
  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const allowedRoles = ['aluno', 'professor'];
  const normalizedRole = allowedRoles.includes(role) ? role : 'aluno';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: normalizedRole
  });

  if (normalizedRole === 'aluno') {
    const existingAluno = await getAlunoByEmailRepository(normalizedEmail);
    if (!existingAluno) {
      await createAlunoRepository({
        nome: name,
        matricula: profile.matricula || generateMatricula(),
        email: normalizedEmail,
        telefone: profile.telefone,
        cpf: profile.cpf,
        data_nascimento: profile.data_nascimento,
        cep: profile.cep,
        endereco: profile.endereco,
        cidade: profile.cidade,
        estado: profile.estado,
        curso: profile.curso,
      });
    }
  }

  if (normalizedRole === 'professor') {
    const existingProfessor = await getProfessorByEmailRepository(normalizedEmail);
    if (!existingProfessor) {
      await createProfessorRepository({
        nome: name,
        email: normalizedEmail,
        telefone: profile.telefone,
        especialidade: profile.especialidade,
      });
    }
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
