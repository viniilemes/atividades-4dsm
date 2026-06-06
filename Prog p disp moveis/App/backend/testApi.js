import http from 'http';

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(responseData)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 INICIANDO TESTES DE API\n');

  // Teste 1: Health Check
  console.log('📌 Teste 1: Health Check');
  try {
    const health = await makeRequest('/health', 'GET', null);
    console.log(`Status: ${health.status}`);
    console.log(`Resposta:`, health.body);
  } catch (e) {
    console.log('❌ Erro:', e.message);
  }
  console.log('');

  // Teste 2: Login Admin
  console.log('📌 Teste 2: Login Admin (admin@email.com / 123456)');
  try {
    const login = await makeRequest('/auth/login', 'POST', {
      email: 'admin@email.com',
      password: '123456'
    });
    console.log(`Status: ${login.status}`);
    console.log(`Resposta:`, login.body);
  } catch (e) {
    console.log('❌ Erro:', e.message);
  }
  console.log('');

  // Teste 3: Registro Novo Usuário
  console.log('📌 Teste 3: Registro Novo Usuário');
  try {
    const register = await makeRequest('/auth/register', 'POST', {
      name: 'Maria Silva',
      email: 'maria.silva@example.com',
      password: 'senha123'
    });
    console.log(`Status: ${register.status}`);
    console.log(`Resposta:`, register.body);
  } catch (e) {
    console.log('❌ Erro:', e.message);
  }
  console.log('');

  // Teste 4: Login Novo Usuário
  console.log('📌 Teste 4: Login Novo Usuário');
  try {
    const login = await makeRequest('/auth/login', 'POST', {
      email: 'maria.silva@example.com',
      password: 'senha123'
    });
    console.log(`Status: ${login.status}`);
    console.log(`Resposta:`, login.body);
  } catch (e) {
    console.log('❌ Erro:', e.message);
  }
  console.log('');

  // Teste 5: Email Inválido
  console.log('📌 Teste 5: Email Inválido');
  try {
    const login = await makeRequest('/auth/login', 'POST', {
      email: 'email-invalido',
      password: '123456'
    });
    console.log(`Status: ${login.status}`);
    console.log(`Resposta:`, login.body);
  } catch (e) {
    console.log('❌ Erro:', e.message);
  }

  process.exit(0);
}

runTests();
