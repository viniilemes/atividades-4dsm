# 📚 Guia Completo - App Scholar

## 🎯 Objetivo

Aplicação completa de gerenciamento acadêmico com:
- Backend robusto com autenticação JWT
- Mobile responsivo com React Native
- Arquitetura profissional e escalável

---

## 🏗️ Arquitetura do Projeto

### Backend - Padrão MVC + Repository

```
Controller → Service → Repository → Database
    ↓          ↓           ↓          ↓
   HTTP      Lógica      Query      Data
  Handler    Negócio    Building   Persistence
```

**Vantagens:**
- ✅ Separação clara de responsabilidades
- ✅ Código testável
- ✅ Fácil manutenção
- ✅ Escalabilidade

### Mobile - React Navigation + Context API

```
Navigation Stack
    ↓
Context (Estado Global)
    ↓
Screens (Componentes)
    ↓
Services (API Calls)
```

---

## 📋 Pré-requisitos

### Windows
- Node.js 16+ ([download](https://nodejs.org))
- PostgreSQL 12+ ([download](https://www.postgresql.org))
- Git ([download](https://git-scm.com))
- VS Code ([download](https://code.visualstudio.com))

### Verificar instalação
```bash
node --version
npm --version
psql --version
git --version
```

---

## 🚀 Setup Passo a Passo

### 1. Preparar Banco de Dados

#### Abrir Terminal (PowerShell/CMD)
```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Dentro do psql
CREATE DATABASE app_scholar;
\c app_scholar
```

#### Executar schema.sql
```powershell
psql -U postgres -d app_scholar -f schema.sql
```

#### Verificar tabelas criadas
```powershell
psql -U postgres -d app_scholar -c "\dt"
```

---

### 2. Setup Backend

#### Clonar/Navegar até pasta backend
```bash
cd backend
```

#### Instalar dependências
```bash
npm install
```

#### Configurar .env
```bash
# Copiar exemplo
copy .env.example .env

# Abrir e editar .env
notepad .env
```

**Conteúdo do .env:**
```env
DATABASE_URL=postgres://postgres:sua_senha@localhost:5432/app_scholar
JWT_SECRET=chave_super_secreta_aqui_mude_em_producao_123456
PORT=3000
NODE_ENV=development
```

#### Testar conexão
```bash
npm run dev
```

Você deve ver:
```
✅ Database connection successful
🚀 APP SCHOLAR BACKEND INICIADO
🌐 http://localhost:3000
```

---

### 3. Setup Mobile

#### Navegara pasta mobile
```bash
cd mobile
```

#### Instalar dependências
```bash
npm install
```

#### Instalar Expo CLI (global)
```bash
npm install -g expo-cli
```

#### Iniciar app
```bash
expo start
```

Você verá um QR code. Escanear com:
- **iOS**: Camera app
- **Android**: Expo Go app

---

## 🔑 Credenciais Padrão

### Admin
```
Email: admin@email.com
Senha: 123456
```

### Alunos Teste
```
Matrícula: MAT001
Matrícula: MAT002
```

---

## 📱 Fluxo do Usuário

### Aluno
1. Faz login com email/senha
2. Acessa Dashboard
3. Consulta Boletim por matrícula
4. Visualiza notas e média

### Admin
1. Faz login
2. Pode criar/editar alunos
3. Pode criar/editar disciplinas
4. Pode lançar notas

---

## 🧪 Testes Manuais

### Via Insomnia/Postman

#### 1. Login
```
POST http://localhost:3000/api/auth/login
Body: {
  "email": "admin@email.com",
  "password": "123456"
}
```

Copie o token da resposta.

#### 2. Consultar boletim
```
GET http://localhost:3000/api/boletim/MAT001
Header: Authorization: Bearer {token_aqui}
```

#### 3. Listar alunos
```
GET http://localhost:3000/api/alunos
Header: Authorization: Bearer {token_aqui}
```

---

## 🐛 Troubleshooting

### "Não consegui conectar ao banco"

**Solução 1:** Verificar PostgreSQL
```bash
# Windows
netstat -ano | findstr :5432
```

**Solução 2:** Reiniciar PostgreSQL
```bash
# Services (Windows)
# Pesquisar por "Services"
# Procurar "postgresql"
# Restart
```

### "ECONNREFUSED localhost:3000"

Significa o backend não está rodando.
```bash
cd backend
npm run dev
```

### "Cannot find module 'pg'"

Dependências não instaladas.
```bash
npm install
```

### Token expirado no mobile

Fazer login novamente.

---

## 📊 Banco de Dados - Diagrama

```
Users
├── id (PK)
├── email
├── password
└── role (admin/aluno/professor)

Alunos
├── id (PK)
├── nome
├── matricula (UNIQUE)
└── email

Disciplinas
├── id (PK)
├── nome
├── codigo (UNIQUE)
└── professor_id (FK)

Grades
├── id (PK)
├── aluno_id (FK)
├── disciplina_id (FK)
├── nota1
└── nota2
```

---

## 📝 Exemplo: Adicionar Novo Aluno

### Via API (Postman/Insomnia)

```bash
POST http://localhost:3000/api/alunos

Headers:
Authorization: Bearer <seu_token_admin>
Content-Type: application/json

Body:
{
  "nome": "Carlos Santos",
  "matricula": "MAT004",
  "email": "carlos@student.com",
  "data_nascimento": "2005-03-10"
}
```

### Via SQL (direto no banco)

```sql
INSERT INTO alunos (nome, matricula, email) 
VALUES ('Ana Silva', 'MAT005', 'ana@student.com');
```

---

## 🔐 Fluxo Seguro

```
1. User senha enviada HTTPS
   ↓
2. Backend recebe e faz hash (bcrypt)
   ↓
3. Compara com hash no banco
   ↓
4. Se OK → gera JWT
   ↓
5. Mobile salva JWT em AsyncStorage
   ↓
6. Toda requisição inclui JWT
   ↓
7. Backend valida JWT
   ↓
8. Se OK → processa requisição
```

---

## 📈 Performance

### Otimizações Implementadas

✅ **Índices no banco**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_alunos_matricula ON alunos(matricula);
```

✅ **Lazy Loading**
- Imagens carregam sob demanda
- Listas usam FlatList otimizado

✅ **Caching**
- AsyncStorage para auth
- Requisições agrupadas

---

## 🌐 Deploy (Próximo Nível)

### Backend - Heroku/Railway

```bash
npm install -g heroku-cli
heroku login
heroku create app-scholar-api
git push heroku main
```

### Mobile - EAS

```bash
eas build --platform android
eas build --platform ios
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Pull Request

---

## 📞 Suporte

Dúvidas? Abra uma issue ou entre em contato.

---

**Made with ❤️**
