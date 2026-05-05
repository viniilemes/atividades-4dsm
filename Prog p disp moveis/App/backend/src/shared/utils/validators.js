export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateMatricula(matricula) {
  return matricula && matricula.length >= 4;
}

export function validatePhoneNumber(phone) {
  const phoneRegex = /^\(?[0-9]{2}\)?9?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
}

export function calculateGPA(grades) {
  if (!grades || grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return (sum / grades.length).toFixed(2);
}

export function calculateSituation(grade) {
  return grade >= 6 ? 'Aprovado' : 'Reprovado';
}
