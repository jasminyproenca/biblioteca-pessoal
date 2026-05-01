/**
 * Cenário de Performance - Autenticação
 * Testa: Register, Login
 */

import { BASE_URL, makeRequest, validateResponse, extractToken, randomSleep } from '../common/helpers.js';
import { getRandomUser } from '../common/fixtures.js';

export function registerFlow() {
  const user = getRandomUser();
  
  const response = makeRequest('POST', `${BASE_URL}/auth/register`, {
    name: user.name,
    username: user.username,
    email: user.email,
    password: user.password,
  });

  // Register não retorna token, apenas valida a resposta
  validateResponse(response, 201, 'Register');
  randomSleep(0.5, 1.5);
}

export function loginFlow() {
  const user = getRandomUser(); // Usa usuário aleatório para evitar conflitos
  
  // Primeiro registra o usuário
  const registerResponse = makeRequest('POST', `${BASE_URL}/auth/register`, {
    name: user.name,
    username: user.username,
    email: user.email,
    password: user.password,
  });

  randomSleep(0.5, 1);

  // Depois faz login
  const loginResponse = makeRequest('POST', `${BASE_URL}/auth/login`, {
    login: user.email,
    password: user.password,
  });

  validateResponse(loginResponse, 200, 'Login');
  const token = extractToken(loginResponse);
  
  if (!token) {
    console.warn('⚠️  Falha ao obter token em loginFlow, a sessão pode estar comprometida');
  }
  
  return token;
}
