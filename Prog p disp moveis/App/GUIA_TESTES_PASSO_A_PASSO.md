# 📱 GUIA PARA TESTAR O APP - Passo a Passo

## 🎯 OBJETIVO
Fazer o app móvel conectar corretamente no backend rodando no computador.

---

## 📍 PASSO 1: Descobrir o IP do Computador

### No Windows (Cmd):
```cmd
ipconfig
```
Procurar por: **IPv4 Address** (será algo como `192.168.x.x` ou `10.x.x.x`)

### Exemplo de Saída:
```
Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . : 255.255.255.0
```
**Neste exemplo, o IP é `192.168.1.100`**

---

## 🔗 PASSO 2: Atualizar o BASE_URL no App

### Se estiver usando EMULADOR (Expo Go automático):
**NÃO MUDA NADA** - Deixar como está:
```javascript
// Em mobile/src/services/api.js - KEEP AS IS
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',  // Para emulador Android
  ios: 'http://localhost:3000/api',      // Para iOS
  default: 'http://localhost:3000/api',
});
```

### Se estiver usando DISPOSITIVO FÍSICO conectado via WiFi:
**TROCAR** para o IP local do computador:
```javascript
// EXEMPLO: Se IP do computador é 192.168.1.100
const BASE_URL = Platform.select({
  android: 'http://192.168.1.100:3000/api',  // ⬅️ TROCAR AQUI
  ios: 'http://192.168.1.100:3000/api',      // ⬅️ E AQUI
  default: 'http://192.168.1.100:3000/api',
});
```

---

## ✅ PASSO 3: Testar Conectividade

### No Navegador do Dispositivo/Emulador:
Abrir browser e acessar:
```
http://10.0.2.2:3000/health  (emulador Android)
OU
http://192.168.1.100:3000/health  (device físico - TROCAR IP)
```

Se aparecer:
```json
{
  "status": "OK",
  "timestamp": "2026-05-26T00:25:30.123Z"
}
```
✅ **Conectividade OK!**

Se der erro:
- ❌ Firewall bloqueando porta 3000
- ❌ Backend não está rodando
- ❌ IP errado

---

## 🚀 PASSO 4: Testar App Mobile

### 1. Certificar que backend está rodando:
```bash
cd "C:\Users\Vinicius\Documents\Fatec\Semestre_04\Prog p disp moveis\App\backend"
node src/server.js
# Deve aparecer: 🚀 APP SCHOLAR BACKEND INICIADO
```

### 2. Certificar que metro está rodando (em outra terminal):
```bash
cd "C:\Users\Vinicius\Documents\Fatec\Semestre_04\Prog p disp moveis\App\mobile"
npx expo start -c
# Deve aparecer: QR code para escanear
```

### 3. No Expo Go, tentar login com:
- Email: `admin@email.com`
- Senha: `123456`

### 4. Se falhar, olhar no console do Expo Go:
Deve aparecer log com:
```
❌ Login Error: {
  status: XXX,
  error: "mensagem de erro",
  message: "full error",
  url: "http://..."
}
```

---

## 🔧 POSSÍVEIS ERROS E SOLUÇÕES

### ❌ Erro: "Network Error" ou "Timeout"
**Causa:** App não consegue alcançar backend
**Solução:** 
- Verificar IP do computador (ipconfig)
- Verificar se backend está rodando
- Testar no browser do device: `http://IP:3000/health`
- Aumentar timeout de 30s para 60s em api.js

### ❌ Erro: "Usuário não encontrado"
**Causa:** Email digitado errado ou case-sensitive
**Solução:**
- Tentar: `admin@email.com` (com lowercase)
- Verificar no banco: `SELECT email FROM users;`

### ❌ Erro: "Senha incorreta"
**Causa:** Senha errada ou admin não foi atualizado no banco
**Solução:**
- Verificar senha do admin no banco
- Rerun: `UPDATE users SET password = '$2b$10$bZx8V...' WHERE email = 'admin@email.com'`

### ❌ Erro: "Email já cadastrado"
**Causa:** Email já existe no banco
**Solução:**
- Usar outro email para registro: ex `usuario@example.com`
- Ou deletar user: `DELETE FROM users WHERE email = 'seu.email@example.com'`

### ✅ Sucesso: Receber token e ser logado
```
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@email.com",
    "role": "admin"
  }
}
```
Neste caso: **TUDO FUNCIONA!**

---

## 📋 CHECKLIST FINAL

- [ ] Backend rodando (`node src/server.js`)
- [ ] Metro rodando (`npx expo start`)
- [ ] IP do computador descoberto (ipconfig)
- [ ] BASE_URL atualizado (se device físico)
- [ ] Conectividade testada no browser (`http://IP:3000/health`)
- [ ] Login testado com `admin@email.com` / `123456`
- [ ] Console do Expo monitorado para logs de erro

---

## 📞 SE NADA FUNCIONAR:

Compartilhar estes dados:
1. Exato erro que aparece no console do app
2. Tipo de conexão (emulador vs device físico)
3. IP do computador (ipconfig)
4. Se backend está rodando e respondendo a requisições

**Arquivo com logs de erro será criado em tempo real durante testes.**
