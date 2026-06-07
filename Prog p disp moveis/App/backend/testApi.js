import http from 'http';
import https from 'https';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

function makeRequest(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const client = url.protocol === 'https:' ? https : http;
    const body = data ? JSON.stringify(data) : null;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: `${url.pathname}${url.search}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = client.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(responseData),
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  console.log(`Testing API at ${API_BASE_URL}`);

  const health = await makeRequest('/health', 'GET');
  console.log('GET /health:', health.status, health.body);

  const login = await makeRequest('/api/auth/login', 'POST', {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@email.com',
    password: process.env.TEST_ADMIN_PASSWORD || '123456',
  });
  console.log('POST /api/auth/login:', login.status, login.body);

  const token = login.body?.token;
  if (!token) {
    throw new Error('Login did not return a token. Protected route tests skipped.');
  }

  const routes = [
    ['/api/alunos', 'GET'],
    ['/api/professores', 'GET'],
    ['/api/disciplinas', 'GET'],
    ['/api/boletim/MAT001', 'GET'],
  ];

  for (const [path, method] of routes) {
    const response = await makeRequest(path, method, null, token);
    console.log(`${method} ${path}:`, response.status, response.body);
  }
}

runTests().catch((error) => {
  console.error('API test failed:', error.message);
  process.exitCode = 1;
});
