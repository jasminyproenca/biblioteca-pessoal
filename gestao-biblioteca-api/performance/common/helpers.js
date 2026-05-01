/**
 * Funções utilitárias para testes de performance com k6
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// URL base da API
export const BASE_URL = 'http://localhost:3000/api';

/**
 * Função auxiliar para fazer requisições com tratamento de erros
 */
export function makeRequest(method, url, payload = null, params = {}) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      ...params.headers,
    },
  };

  let response;
  
  switch (method.toUpperCase()) {
    case 'GET':
      response = http.get(url, options);
      break;
    case 'POST':
      response = http.post(url, payload ? JSON.stringify(payload) : null, options);
      break;
    case 'PUT':
      response = http.put(url, payload ? JSON.stringify(payload) : null, options);
      break;
    case 'PATCH':
      response = http.patch(url, payload ? JSON.stringify(payload) : null, options);
      break;
    case 'DELETE':
      response = http.del(url, options);
      break;
    default:
      throw new Error(`Método HTTP não suportado: ${method}`);
  }

  return response;
}

/**
 * Valida resposta e registra checks
 */
export function validateResponse(response, expectedStatus, testName) {
  const statusMatch = response.status === expectedStatus;
  
  // Log de erro se a resposta não for como esperado
  if (!statusMatch) {
    console.error(`❌ ${testName} - Erro de Status: esperado ${expectedStatus}, recebido ${response.status}`);
    try {
      console.error(`   Resposta: ${response.body}`);
    } catch (e) {
      console.error(`   Corpo da resposta indisponível`);
    }
  }

  const success = check(response, {
    [`${testName} - Status ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${testName} - Tempo de resposta`]: (r) => r.timings.duration < 500,
  });

  return success && response.status === expectedStatus;
}

/**
 * Aguarda um tempo aleatório (entre min e max ms)
 */
export function randomSleep(min = 1, max = 3) {
  sleep(__ENV.SLEEP_DURATION ? parseInt(__ENV.SLEEP_DURATION) : Math.random() * (max - min) + min);
}

/**
 * Extrai token JWT da resposta
 */
export function extractToken(response) {
  try {
    const token = response.json('data.token');
    if (!token) {
      console.error('⚠️  Token não encontrado na resposta:', response.body);
      return null;
    }
    return token;
  } catch (e) {
    console.error('❌ Erro ao extrair token:', e.message);
    console.error('   Corpo da resposta:', response.body);
    return null;
  }
}

/**
 * Retorna headers com autenticação
 */
export function getAuthHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
  };
}
