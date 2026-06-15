import {
  getBoletimRepository,
  addGradeRepository,
  getDisciplinasByProfessorEmailRepository,
  getAlunosByDisciplinaForProfessorRepository,
  addGradeForProfessorRepository
} from './repository.js';
import { calculateSituation } from '../../shared/utils/validators.js';

export async function getBoletimService(matricula) {
  const boletim = await getBoletimRepository(matricula);

  if (!boletim || boletim.length === 0) {
    return null;
  }

  // Agrupar por aluno e preparar resposta estruturada
  const alunoData = boletim[0];

  const disciplinas = boletim.map(item => {
    // Converter notas para números
    const nota1 = parseFloat(item.nota1) || 0;
    const nota2 = parseFloat(item.nota2) || 0;
    const media = (nota1 + nota2) / 2;
    const situation = calculateSituation(media);

    return {
      id: item.disciplina_id,
      nome: item.disciplina_nome,
      codigo: item.disciplina_codigo,
      nota1: nota1,
      nota2: nota2,
      media: parseFloat(media.toFixed(2)),
      situation
    };
  });

  const mediaGeral = disciplinas.reduce((acc, d) => acc + d.media, 0) / disciplinas.length;

  return {
    aluno: {
      id: alunoData.aluno_id,
      nome: alunoData.aluno_nome,
      matricula: alunoData.matricula
    },
    disciplinas,
    mediaGeral: parseFloat(mediaGeral.toFixed(2)),
    situacaoGeral: calculateSituation(mediaGeral)
  };
}

export async function addGradeService(data) {
  return await addGradeRepository(data);
}

export async function getProfessorDisciplinasService(professorEmail) {
  return await getDisciplinasByProfessorEmailRepository(professorEmail);
}

export async function getProfessorDisciplinaAlunosService(disciplinaId, professorEmail) {
  const alunos = await getAlunosByDisciplinaForProfessorRepository(disciplinaId, professorEmail);

  if (!alunos || alunos.length === 0) {
    return null;
  }

  const disciplinaData = alunos[0];

  return {
    disciplina: {
      id: disciplinaData.disciplina_id,
      nome: disciplinaData.disciplina_nome,
      codigo: disciplinaData.disciplina_codigo
    },
    alunos: alunos.filter((item) => item.aluno_id).map((item) => {
      const nota1 = item.nota1 === null || item.nota1 === undefined ? null : parseFloat(item.nota1);
      const nota2 = item.nota2 === null || item.nota2 === undefined ? null : parseFloat(item.nota2);
      const hasNotas = nota1 !== null && nota2 !== null;
      const media = hasNotas ? (nota1 + nota2) / 2 : null;

      return {
        id: item.aluno_id,
        nome: item.aluno_nome,
        matricula: item.matricula,
        email: item.email,
        grade_id: item.grade_id,
        nota1,
        nota2,
        media: media === null ? null : parseFloat(media.toFixed(2)),
        situation: media === null ? 'Pendente' : calculateSituation(media)
      };
    })
  };
}

export async function addGradeForProfessorService(data, professorEmail) {
  const result = await addGradeForProfessorRepository(data, professorEmail);

  if (!result) {
    throw new Error('Disciplina não encontrada para este professor ou aluno não vinculado');
  }

  return result;
}
