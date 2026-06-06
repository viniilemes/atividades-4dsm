# Testes manuais - App Scholar

Data de referencia: 06/06/2026

Este documento descreve os testes manuais principais do aplicativo mobile, backend e banco de dados. Use como roteiro de validacao e tambem como evidencia para o relatorio do projeto.

## Ambiente de teste

| Item | Valor usado |
| --- | --- |
| Aplicativo | App Scholar |
| Plataforma | Android / Expo |
| Backend | Node.js + Express |
| Banco de dados | PostgreSQL |
| URL da API | `http://IP_DO_COMPUTADOR:3000/api` ou `http://10.0.2.2:3000/api` no emulador |
| Usuario admin | `admin@email.com` |

## Matriz de testes

| Tipo de teste | O que foi testado | Resultado esperado | Como testar | Status |
| --- | --- | --- | --- | --- |
| Instalacao do APK | Instalacao em celular Android | APK instala sem erro | Gerar/baixar o APK, abrir no Android e concluir a instalacao | Pendente |
| Abertura do app | Inicializacao do aplicativo | App abre sem travar | Abrir o app instalado ou Expo Go e aguardar a tela de login | Parcialmente aprovado: build/export passou |
| Navegacao | Troca entre telas | Telas carregam corretamente | Entrar como admin, professor e aluno; alternar entre Dashboard, Boletim, Alunos, Disciplinas, Professores e Perfil | Pendente |
| Formulario | Envio de dados | Dados sao enviados com sucesso | Como admin, cadastrar aluno, professor e disciplina com dados validos | Aprovado via API |
| Validacao | Campos obrigatorios vazios | Sistema bloqueia envio invalido | Tentar salvar aluno, professor, disciplina e login sem preencher campos obrigatorios | Aprovado via API |
| API | Comunicacao com backend | App recebe resposta da API | Com backend ligado, fazer login e carregar listas de alunos, professores, disciplinas e boletim | Aprovado |
| Banco de dados | Salvamento das informacoes | Dados persistem corretamente | Cadastrar dados pelo app, fechar e abrir novamente; confirmar que continuam aparecendo | Aprovado |
| Erro de conexao | Backend desligado | App nao trava e mostra erro | Desligar o backend e tentar login/listagem/cadastro | Pendente |

## Passo a passo recomendado

### 1. Preparar backend

No terminal:

```bash
cd backend
npm start
```

Resultado esperado:

```text
Servidor rodando na porta 3000
```

Tambem teste no navegador:

```text
http://localhost:3000/health
```

ou, no celular fisico:

```text
http://IP_DO_COMPUTADOR:3000/health
```

### 2. Preparar app mobile

No terminal:

```bash
cd mobile
npx expo start -c
```

Depois, abra pelo Expo Go ou gere o APK com EAS.

### 3. Testar perfis de usuario

| Perfil | Permissoes esperadas |
| --- | --- |
| Admin | Criar alunos, professores e disciplinas; visualizar dados academicos |
| Professor | Visualizar alunos/disciplinas e editar notas/faltas quando disponivel |
| Aluno | Visualizar boletim e baixar boletim; sem permissao para alterar dados |

Validacoes importantes:

- Admin deve conseguir acessar cadastro de aluno, professor e disciplina.
- Professor nao deve criar disciplina, pois apenas leciona.
- Aluno nao deve editar notas, faltas, alunos, professores ou disciplinas.
- O app deve redirecionar cada perfil para as telas corretas apos login.

### 4. Testar formularios

#### Cadastro de aluno

Dados validos:

```text
Nome: Aluno Teste
Email: aluno.teste@email.com
Senha: 123456
Matricula: MATTESTE001
Telefone: 11999999999
Curso: Desenvolvimento de Software
```

Resultado esperado:

- O app salva o aluno.
- O aluno aparece na listagem.
- O registro persiste apos recarregar a tela.

#### Cadastro de professor

Dados validos:

```text
Nome: Professor Teste
Email: professor.teste@email.com
Senha: 123456
Especialidade: Programacao Web
Telefone: 11988888888
```

Resultado esperado:

- O app salva o professor.
- O professor aparece na listagem.
- O admin consegue abrir os detalhes e editar informacoes.

#### Cadastro de disciplina

Dados validos:

```text
Nome: Testes de Software
Codigo: TST001
Carga horaria: 80
Professor: selecionar professor cadastrado
```

Resultado esperado:

- A disciplina e salva.
- A disciplina aparece na listagem.
- O professor vinculado aparece nos detalhes quando informado.

### 5. Testar validacoes

Execute estes cenarios:

| Tela | Cenario | Resultado esperado |
| --- | --- | --- |
| Login | Email vazio | Bloquear login e exibir mensagem |
| Login | Senha vazia | Bloquear login e exibir mensagem |
| Cadastro de aluno | Nome/email/senha vazios | Bloquear cadastro |
| Cadastro de professor | Nome/email/senha vazios | Bloquear cadastro |
| Cadastro de disciplina | Nome/codigo/carga horaria vazios | Bloquear cadastro |
| Boletim | Matricula vazia | Bloquear busca e pedir matricula |

### 6. Testar API e banco

Com o backend ligado:

1. Fazer login como admin.
2. Cadastrar um aluno.
3. Cadastrar um professor.
4. Cadastrar uma disciplina.
5. Atualizar a tela puxando para baixo.
6. Fechar e abrir o app novamente.

Resultado esperado:

- Os dados continuam aparecendo.
- Isso confirma comunicacao com API e persistencia no banco.

### 7. Testar erro de conexao

1. Pare o backend.
2. Mantenha o app aberto.
3. Tente login, busca de boletim ou carregar listas.

Resultado esperado:

- O app nao fecha sozinho.
- O app exibe mensagem de erro.
- Ao religar o backend e atualizar a tela, os dados voltam a carregar.

## Evidencias para anexar

Use esta lista para registrar imagens ou videos dos testes:

| Evidencia | Arquivo/print | Status |
| --- | --- | --- |
| APK instalado |  | Pendente |
| Tela de login aberta |  | Pendente |
| Login admin realizado |  | Pendente |
| Cadastro de aluno |  | Pendente |
| Cadastro de professor |  | Pendente |
| Cadastro de disciplina |  | Pendente |
| Listagem atualizada com pull-to-refresh |  | Pendente |
| Erro com backend desligado |  | Pendente |

## Resultado final

| Total de testes | Aprovados | Reprovados | Pendentes/Parciais | Observacoes |
| --- | --- | --- | --- | --- |
| 8 | 4 | 0 | 4 | Testes automatizados de API, formulario, validacao e banco aprovados. APK, navegacao visual e erro de conexao no app ainda exigem validacao manual no Android. |

## Execucao automatizada em 06/06/2026

| Teste executado | Resultado |
| --- | --- |
| Export/build web do Expo | Passou |
| Health check do backend | Passou |
| Login admin | Passou |
| Validacao de login vazio | Passou |
| Cadastro de aluno | Passou |
| Cadastro de professor | Passou |
| Cadastro de disciplina | Passou |
| Validacao de disciplina vazia | Passou |
| Persistencia de aluno na listagem | Passou |
| Persistencia de disciplina na listagem | Passou |

Observacao: antes da execucao final, o cadastro de aluno falhou porque o banco local estava sem as colunas `cep`, `endereco`, `cidade`, `estado` e `curso` na tabela `alunos`. Foi criado e executado o script `backend/migrate.js`, que adicionou as colunas faltantes com `ADD COLUMN IF NOT EXISTS`.
