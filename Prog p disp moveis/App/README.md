# 📱 App Scholar

Aplicativo mobile profissional para gerenciamento acadêmico, permitindo cadastro, consulta de boletins e gerenciamento de alunos, professores e disciplinas.

---

## 🚀 Tecnologias

### Mobile (Frontend)
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Ferramenta de desenvolvimento
- **React Navigation** - Sistema de navegação
- **Axios** - Cliente HTTP
- **AsyncStorage** - Persistência local de dados
- **React Native Vector Icons** - Ícones

### Backend (API)
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Bcrypt** - Hash de senhas

---

## 📦 Funcionalidades

### ✅ Autenticação
- 🔐 Login com JWT
- 📝 Registro de novos usuários
- 🔒 Senhas criptografadas com bcrypt
- 💾 Persistência de token (AsyncStorage)

### 👨‍🎓 Gerenciamento de Alunos
- Listar alunos
- Buscar por nome ou matrícula
- Criar novo aluno
- Atualizar dados do aluno
- Deletar aluno

### 📚 Disciplinas
- Listar disciplinas
- Buscar disciplina
- Vincular professor à disciplina
- Definir carga horária

### 📊 Boletim
- Consultar boletim por matrícula
- Visualizar notas por disciplina
- Calcular média automática
- Determinar situação (Aprovado/Reprovado)
- Média geral do semestre

### 🎨 Interface
- Dashboard intuitivo
- Formulários validados
- Loading indicators
- Mensagens de erro/sucesso
- Design responsivo
- Bottom tab navigation

### 🔐 Segurança
- Autenticação baseada em JWT
- Middleware de verificação de token
- Controle de permissões (admin/aluno)
- Validação de dados
- Senhas com salt

---

## 📁 Estrutura do Projeto

```
app-scholar/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Configuração do banco
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── controller.js
│   │   │   │   ├── service.js
│   │   │   │   ├── repository.js
│   │   │   │   └── routes.js
│   │   │   ├── alunos/               # Mesmo padrão
│   │   │   ├── disciplinas/          # Mesmo padrão
│   │   │   ├── boletim/              # Mesmo padrão
│   │   │   └── professores/          # Mesmo padrão
│   │   ├── shared/
│   │   │   ├── middlewares/
│   │   │   │   └── auth.js           # JWT verification
│   │   │   └── utils/
│   │   │       ├── validators.js     # Validações
│   │   │       └── logger.js         # Logs estruturados
│   │   ├── app.js                    # Express app
│   │   └── server.js                 # Servidor
│   ├── .env                          # Variáveis de ambiente
│   ├── .env.example                  # Exemplo de .env
│   └── package.json
│
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── DashboardScreen.js
│   │   │   ├── BoletimScreen.js
│   │   │   ├── AlunosScreen.js
│   │   │   ├── DisciplinasScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── services/
│   │   │   └── api.js                # Chamadas HTTP
│   │   ├── context/
│   │   │   └── AuthContext.js        # Estado global
│   │   ├── routes/
│   │   │   ├── index.js              # Navegação principal
│   │   │   ├── AuthStack.js          # Rotas deslogado
│   │   │   └── AppStack.js           # Rotas logado
│   │   ├── components/               # Componentes reutilizáveis
│   │   ├── styles/                   # Estilos globais
│   │   └── utils/                    # Utilitários
│   ├── App.js                        # App principal
│   └── package.json
│
├── schema.sql                        # Banco de dados
└── README.md
```

---

## ⚙️ Instalação e Setup

### 1️⃣ Clonar o repositório
```bash
git clone <seu-repositorio>
cd app-scholar
```

### 2️⃣ Setup Backend

#### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+

#### Instalação
```bash
cd backend
npm install
```

#### Configurar banco de dados
```bash
# Criar banco de dados
createdb app_scholar

# Executar schema
psql app_scholar < ../schema.sql
```

#### Variáveis de ambiente (.env)
```env
DATABASE_URL=postgres://user:password@localhost:5432/app_scholar
JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao
PORT=3000
NODE_ENV=development
```

#### Iniciar servidor
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

---

### 3️⃣ Setup Mobile

#### Pré-requisitos
- Node.js 16+
- Expo CLI (`npm install -g expo-cli`)
- Smartphone ou emulador

#### Instalação
```bash
cd mobile
npm install
```

#### Iniciar aplicação
```bash
expo start
```

Escanear o QR Code com:
- **iOS**: Camera app
- **Android**: Expo app

---

## 🧪 Testes

### Backend - Endpoints principais

#### Autenticação
```bash
POST /api/auth/login
{
  "email": "admin@email.com",
  "password": "123456"
}
```

#### Listar Alunos
```bash
GET /api/alunos
Authorization: Bearer <token>
```

#### Consultar Boletim
```bash
GET /api/boletim/MAT001
Authorization: Bearer <token>
```

#### Adicionar Nota
```bash
POST /api/boletim/grades
Authorization: Bearer <token>
{
  "aluno_id": 1,
  "disciplina_id": 1,
  "nota1": 8.5,
  "nota2": 7.5
}
```

---

## 🔑 Variáveis de Ambiente

### Backend (.env)
```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/app_scholar

# JWT
JWT_SECRET=sua_chave_secreta_segura

# Server
PORT=3000
NODE_ENV=development
```

---

## 📊 Fluxo de Autenticação

```
1. Usuário insere email e senha
   ↓
2. Mobile envia para /api/auth/login
   ↓
3. Backend valida credenciais
   ↓
4. Backend retorna JWT token
   ↓
5. Mobile salva token em AsyncStorage
   ↓
6. Todas requisições incluem token no header
   ↓
7. Backend valida token via middleware
```

---

## 🧮 Cálculo de Média

```javascript
// Média simples
média = (nota1 + nota2) / 2

// Situação
situação = média >= 6.0 ? "Aprovado" : "Reprovado"

// Média Geral
mediaGeral = Σ(médias) / quantidade_disciplinas
```

---

## 🚦 Endpoints da API

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar

### Alunos
- `GET /api/alunos` - Listar todos
- `GET /api/alunos/:id` - Buscar por ID
- `GET /api/alunos/matricula/:matricula` - Buscar por matrícula
- `POST /api/alunos` - Criar (admin)
- `PUT /api/alunos/:id` - Atualizar (admin)
- `DELETE /api/alunos/:id` - Deletar (admin)

### Disciplinas
- `GET /api/disciplinas` - Listar
- `GET /api/disciplinas/:id` - Buscar por ID
- `POST /api/disciplinas` - Criar (admin)
- `PUT /api/disciplinas/:id` - Atualizar (admin)
- `DELETE /api/disciplinas/:id` - Deletar (admin)

### Boletim
- `GET /api/boletim/:matricula` - Consultar boletim
- `POST /api/boletim/grades` - Adicionar/atualizar nota (admin)

---

## 🎨 Design Patterns

### Backend
- **MVC Pattern** - Separação de Controller, Service, Repository
- **Middleware Pattern** - Autenticação e validação
- **Repository Pattern** - Abstração de dados

### Mobile
- **Context API** - Estado global
- **Stack Navigation** - Navegação entre telas
- **Axios Interceptors** - Gerenciamento de requisições

---

## 🔒 Segurança

✅ Senhas com bcrypt (10 rounds)
✅ JWT com expiração (24h)
✅ Validação de entrada em todas rotas
✅ Middleware de autenticação
✅ Controle de permissões (RBAC)
✅ CORS habilitado
✅ Variáveis sensíveis em .env

---

## 📈 Melhorias Futuras

- 📱 Notificações push
- 📊 Gráficos de desempenho
- 📅 Calendário acadêmico
- 💬 Chat entre alunos/professores
- 📁 Upload de documentos
- 🌙 Dark mode completo
- 📡 Sincronização offline
- 🔔 Lembretes de notas
- 📈 Histórico acadêmico
- 🎓 Certificados

---

## 🐛 Troubleshooting

### Erro: "Conexão recusada" no banco
```bash
# Verificar se PostgreSQL está rodando
pg_isready

# Reiniciar PostgreSQL
pg_ctl restart
```

### Erro: "Token inválido"
```bash
# Fazer login novamente
# Token expirou após 24h
```

### Erro: "CORS policy"
```javascript
// Verificar se CORS está habilitado em app.js
app.use(cors());
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Logs

O sistema registra:
- ✅ Login/Register bem-sucedido
- ✅ Criação/atualização de dados
- ✅ Erros de autenticação
- ✅ Erros de validação

```javascript
// Exemplo de log
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "action": "LOGIN_SUCCESS",
  "email": "user@email.com"
}
```

---

## 📄 Licença

MIT License - veja LICENSE para detalhes

---

## 👨‍💻 Autor

**Vinícius Lemes**

- GitHub: [@vinicius-lemes](https://github.com)
- Email: vinicius@email.com

---

## 🙏 Agradecimentos

- React Native & Expo team
- Express.js community
- PostgreSQL documentation

---

## 📞 Suporte

Para dúvidas ou bugs, abra uma issue no repositório.

---

**Made with ❤️ by Vinícius Lemes**
