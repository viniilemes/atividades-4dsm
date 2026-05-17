import { getBoletimRepository, addGradeRepository } from './repository.js';
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
