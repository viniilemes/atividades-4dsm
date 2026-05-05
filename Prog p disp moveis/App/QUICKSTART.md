# ⚡ Quick Start

## 🚀 Rodar em 3 passos

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
✅ Rodando em http://localhost:3000

### 2. Banco de Dados
```bash
psql -U postgres -d app_scholar -f ../schema.sql
```
✅ Banco pronto com dados de teste

### 3. Mobile
```bash
cd mobile
npm install
expo start
```
✅ Escanear QR code

---

## 🔑 Login Rápido

```
Email: admin@email.com
Senha: 123456
```

---

## 📚 Documentação Completa

Ver [SETUP_GUIDE.md](SETUP_GUIDE.md)
Ver [README.md](README.md)

---

## 💡 Exemplo de Requisição

```bash
curl -X GET http://localhost:3000/api/health
```

Resultado esperado:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

## 🎯 Próximos Passos

1. Iniciar backend
2. Iniciar mobile
3. Fazer login
4. Testar funcionalidades
5. Consultar boletim (MAT001)

---

**Que comece a diversão! 🎉**
