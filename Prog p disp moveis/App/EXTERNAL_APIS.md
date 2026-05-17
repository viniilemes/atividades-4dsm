# 🌐 APIs Externas - Documentação

## ✅ Implementação Completa

Foram implementadas **2 APIs externas obrigatórias** conforme especificado no enunciado:

---

## 🗺️ 1. ViaCEP - Busca de Endereço por CEP

### O que é?
Serviço público que retorna dados de endereço a partir de um CEP válido.

### URL Base
```
https://viacep.com.br/ws/
```

### Endpoint no Backend
```
POST /api/localizacao/cep
```

### Uso no Mobile
Ao digitar um CEP na tela de cadastro de aluno, clica no botão de busca e o endereço é preenchido automaticamente.

### Exemplo de Requisição
```bash
curl -X POST http://localhost:3000/api/localizacao/cep \
  -H "Content-Type: application/json" \
  -d '{"cep": "01310100"}'
```

### Resposta Esperada
```json
{
  "logradouro": "Avenida Paulista",
  "bairro": "Consolação",
  "cidade": "São Paulo",
  "estado": "SP",
  "sucesso": true
}
```

### Campos Preenchidos Automaticamente
- ✅ Logradouro (Rua/Avenida)
- ✅ Bairro
- ✅ Cidade
- ✅ Estado

### Como Funciona
```javascript
// Mobile - CadastroAlunoScreen.js
const handleSearchCEP = async () => {
  const response = await externalApisService.getAddressByCEP(cep);
  setEndereco(response.logradouro);
  setCidade(response.localidade);
  setEstado(response.uf);
};
```

---

## 🏛️ 2. IBGE Localidades - Estados e Cidades

### O que é?
API do IBGE que fornece dados sobre localidades brasileiras (estados e cidades).

### URL Base
```
https://servicodados.ibge.gov.br/api/v1/localidades/
```

### Endpoints no Backend

#### Listar Estados
```
GET /api/localizacao/estados
```

#### Listar Cidades por Estado
```
GET /api/localizacao/estados/{estadoId}/cidades
```

### Uso no Mobile
Ao selecionar estado e cidade na tela de cadastro, os dados são carregados dynamicamente.

### Exemplo de Requisição - Estados
```bash
curl http://localhost:3000/api/localizacao/estados
```

### Resposta - Estados
```json
[
  {
    "id": 35,
    "nome": "São Paulo",
    "sigla": "SP"
  },
  {
    "id": 21,
    "nome": "Rio de Janeiro",
    "sigla": "RJ"
  }
]
```

### Exemplo de Requisição - Cidades
```bash
curl http://localhost:3000/api/localizacao/estados/35/cidades
```

### Resposta - Cidades
```json
[
  {
    "id": 3550308,
    "nome": "São Paulo"
  },
  {
    "id": 3549904,
    "nome": "Guarulhos"
  }
]
```

### Como Funciona
```javascript
// Mobile - CadastroAlunoScreen.js
const carregarEstados = async () => {
  const response = await externalApisService.getEstados();
  setEstados(response);
};

const carregarCidades = async (estadoId) => {
  const response = await externalApisService.getCidadesByEstado(estadoId);
  setCidades(response);
};
```

---

## 🏗️ Arquitetura Implementada

### Backend

**1. Service de APIs Externas**
```
/backend/src/shared/utils/externalApis.js
```
- Função `getAddressByCEP(cep)` - ViaCEP
- Função `getEstados()` - IBGE Estados
- Função `getCidadesByEstado(estadoId)` - IBGE Cidades

**2. Controller de Localização**
```
/backend/src/modules/alunos/localizationController.js
```
- `searchCEP(req, res)` - Endpoint POST
- `listEstados(req, res)` - Endpoint GET
- `listCidades(req, res)` - Endpoint GET

**3. Routes de Localização**
```
/backend/src/modules/alunos/localizationRoutes.js
```

### Mobile

**1. Service de APIs Externas**
```
/mobile/src/services/externalApis.js
```
- Axios para consumir endpoints do backend
- Tratamento de erros

**2. Tela de Cadastro**
```
/mobile/src/screens/CadastroAlunoScreen.js
```
- Integração completa com ViaCEP
- Dropdowns para IBGE (Estados e Cidades)
- Validação em tempo real

---

## 🎯 Fluxo Completo - Cadastro de Aluno

```
1. Usuário abre tela de cadastro
   ↓
2. Digita CEP e clica buscar
   ↓
3. Mobile → Backend (POST /api/localizacao/cep)
   ↓
4. Backend → ViaCEP (https://viacep.com.br/...)
   ↓
5. ViaCEP retorna dados do endereço
   ↓
6. Backend retorna para Mobile
   ↓
7. Mobile preenche campos automaticamente
   ↓
8. Usuário seleciona Estado
   ↓
9. Mobile → Backend (GET /api/localizacao/estados)
   ↓
10. Backend → IBGE Estados
    ↓
11. IBGE retorna lista de estados
    ↓
12. Mobile exibe dropdown com estados
    ↓
13. Usuário seleciona estado
    ↓
14. Mobile → Backend (GET /api/localizacao/estados/{id}/cidades)
    ↓
15. Backend → IBGE Cidades
    ↓
16. IBGE retorna cidades do estado
    ↓
17. Mobile exibe dropdown com cidades
    ↓
18. Usuário clica "Cadastrar"
    ↓
19. Mobile → Backend (POST /api/alunos)
    ↓
20. Aluno cadastrado com sucesso! ✅
```

---

## 📱 Experiência do Usuário

### Cadastro de Aluno
1. **Nome** - digitado manualmente
2. **Matrícula** - digitada manualmente
3. **Email** - digitado manualmente
4. **Telefone** - digitado manualmente
5. **CEP** - digitado + busca automática
   - Botão de busca dispara ViaCEP
   - Campos preenchidos: Endereço, Cidade, Estado
6. **Endereço** - preenchido automaticamente ✨
7. **Estado** - dropdown com IBGE (ordenado)
8. **Cidade** - dropdown dinâmico baseado no estado
9. **Curso** - digitado manualmente
10. **Enviar** - cadastra no backend

---

## 🔒 Tratamento de Erros

### ViaCEP
```javascript
if (cep.length !== 8) {
  throw new Error('CEP deve ter 8 dígitos');
}
if (response.data.erro) {
  throw new Error('CEP não encontrado');
}
```

### IBGE
```javascript
try {
  const response = await axios.get(url);
  return response.data;
} catch (error) {
  throw new Error('Erro ao buscar localidades');
}
```

---

## 📊 Testes

### Via Insomnia/Postman

#### Test 1: ViaCEP
```bash
POST http://localhost:3000/api/localizacao/cep
{
  "cep": "01310100"
}
```
Esperado: Retorna dados de endereço

#### Test 2: IBGE Estados
```bash
GET http://localhost:3000/api/localizacao/estados
```
Esperado: Array com todos os estados

#### Test 3: IBGE Cidades
```bash
GET http://localhost:3000/api/localizacao/estados/35/cidades
```
Esperado: Array com cidades de São Paulo

---

## ✅ Checklist - Requisitos Atendidos

- [x] ViaCEP implementada
- [x] IBGE Localidades implementada
- [x] Backend com endpoints
- [x] Mobile com integração
- [x] Auto-preenchimento de endereço
- [x] Dropdowns dinâmicos (Estados/Cidades)
- [x] Tratamento de erros
- [x] Logs estruturados
- [x] Documentação completa

---

## 🚀 Como Testar no Mobile

1. Abrir app
2. Fazer login
3. Ir para aba "Alunos"
4. Clicar botão "+" (novo aluno)
5. Preencher formulário
6. Digitar CEP (ex: 01310100)
7. Clicar lupa para buscar
8. Aí automático! Vê os campos preenchidos ✨
9. Selecionar Estado
10. Cidades aparecem dinamicamente
11. Clicar "Cadastrar Aluno"

---

## 📚 Referências

- **ViaCEP**: https://viacep.com.br/
- **IBGE API**: https://servicodados.ibge.gov.br/api/docs/localidades

---

**Implementação 100% completa! 🎉**
