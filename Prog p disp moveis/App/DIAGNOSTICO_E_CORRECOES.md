# 🔧 DIAGNÓSTICO E CORREÇÕES - App Scholar Mobile

## ✅ TESTES DE BACKEND - RESULTADO: TODOS PASSARAM

### Teste Executado em 25/05/2026 às 21:20
```
Backend: ✅ Funcional
Database: ✅ Conectada (PostgreSQL)
Auth Service: ✅ Login/Registro OK
JWT: ✅ Tokens gerados corretamente
Email Validation: ✅ Funcionando
```

---

## 🔴 PROBLEMA IDENTIFICADO: APP MÓVEL NÃO ESTÁ CONECTANDO

### Hipóteses e Verificações

#### 1️⃣ Timeout de Requisição - CORRIGIR
**Arquivo:** `mobile/src/services/api.js` (linha 13)
**Problema:** Timeout de 10 segundos pode ser insuficiente
**Solução:**
```javascript
// ANTES
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,  // ⚠️ Pode ser curto
});

// DEPOIS
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,  // ✅ 30 segundos
});
```

---

#### 2️⃣ Problema de CORS no Backend - MELHORAR
**Arquivo:** `backend/src/app.js` (linha 18)
**Problema:** CORS sem configuração explícita
**Solução:**
```javascript
// ANTES
app.use(cors());

// DEPOIS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
```

---

#### 3️⃣ Verificar Conectividade Android → Backend
**Configuração Atual:** `http://10.0.2.2:3000/api`
**Verificar:**
- [ ] Porta 3000 está aberta no firewall
- [ ] IP 10.0.2.2 é o gateway correto (específico do emulador/Expo Go no Android)
- [ ] Telefone físico consegue alcançar o computador na mesma rede WiFi

**Para dispositivo físico (NÃO emulador):**
Se estiver usando dispositivo físico no Expo Go, pode precisar usar IP da máquina ao invés de localhost:
```javascript
// Para descobrir IP local do computador (Windows):
// Abrir CMD e digitar: ipconfig
// Procurar por "IPv4 Address" (algo como 192.168.x.x)

const BASE_URL = Platform.select({
  android: 'http://192.168.x.x:3000/api',  // ⚠️ SUBSTITUIR com IP real
  ios: 'http://localhost:3000/api',
  default: 'http://localhost:3000/api',
});
```

---

#### 4️⃣ Problema de Interceptor de Request - VERIFICAR
**Arquivo:** `mobile/src/services/api.js` (linhas 17-32)

A estrutura está correta, mas há um **risco crítico** na resposta:
```javascript
// Linha 30-32: Se receber 401, remove token!
if (error.response?.status === 401) {
  AsyncStorage.removeItem('authToken');
}
```

**Isso NÃO afeta login (que não precisa de token), mas pode causar problemas depois.**

---

#### 5️⃣ Validação de Email Mismatch - VERIFIED ✅
Frontend regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
Backend regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
**Status:** ✅ Idênticos - OK

---

## 📋 AÇÕES RECOMENDADAS - ORDEM DE PRIORIDADE

### 🔴 CRÍTICA - Fazer Primeiro:
1. **Verificar conectividade de rede**
   - [ ] Abrir terminal e testar: `ping 10.0.2.2` (Android) ou `ping localhost` (iOS)
   - [ ] Se usando dispositivo físico: descobrir IP local e atualizar BASE_URL
   - [ ] Testar se consegue acessar http://IP:3000/health no navegador do dispositivo

2. **Aumentar timeout de requisição**
   - [ ] Mudar `timeout: 10000` para `timeout: 30000` em api.js
   - [ ] Testar login/registro novamente

### 🟡 IMPORTANTE - Depois:
3. **Melhorar configuração CORS**
   - [ ] Adicionar opções explícitas ao cors() em app.js
   - [ ] Reiniciar backend

4. **Verificar logs do app móvel**
   - [ ] Abrir developer tools do Expo
   - [ ] Ver exatamente qual erro está ocorrendo
   - [ ] Procurar por "Network Error", "Timeout", "CORS", etc.

### 🟢 OPCIONAL - Futuro:
5. **Adicionar retry logic**
   - [ ] Implementar sistema de retry automaticamente em caso de falha
   - [ ] Useful para conexões instáveis

---

## 🧪 TESTE PASSO A PASSO

### Se estiver usando EMULADOR (Expo Go automático):
1. Abrir app no Expo Go
2. Testar login com: `admin@email.com` / `123456`
3. Se falhar: verificar console do Expo Go

### Se estiver usando DISPOSITIVO FÍSICO:
1. Descobrir IP do computador: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Atualizar api.js com o IP real
3. Garantir que dispositivo e computador estão na mesma rede WiFi
4. Testar login

---

## 🔍 COMO DEBUGAR SE NÃO FUNCIONAR

### No Console do Expo Go:
```javascript
// Adicionar logs temporários em AuthContext.js:
try {
  const response = await authService.login(email.trim(), password);
  console.log('📱 Response:', response);
  console.log('📱 Token:', response.data.token);
  console.log('📱 User:', response.data.user);
} catch (error) {
  console.error('📱 Error Status:', error.response?.status);
  console.error('📱 Error Data:', error.response?.data);
  console.error('📱 Error Message:', error.message);
}
```

### No Backend (terminal rodando node src/server.js):
Ver logs de conexão e erros em tempo real

---

## 📝 RESUMO DO DIAGNÓSTICO

| Item | Status | Ação |
|------|--------|------|
| Backend APIs | ✅ OK | Nenhuma |
| Database | ✅ OK | Nenhuma |
| Auth Logic | ✅ OK | Nenhuma |
| Mobile → Backend Connection | ❌ PROBLEMA | Verificar IP/Port/Firewall |
| Timeout Setting | ⚠️ PODE SER | Aumentar para 30s |
| CORS Config | ⚠️ IMPLÍCITO | Deixar explícito |

---

**Próximo Passo:** Executar ações CRÍTICAS acima e verificar conectividade de rede.
Se continuar falhando, adicionar logs via console.error() e compartilhar exatas mensagens de erro.
