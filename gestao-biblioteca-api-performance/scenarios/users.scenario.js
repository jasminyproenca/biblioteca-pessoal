/**
 * Cenário de Performance - Usuários
 * Testa: Get profile, Update profile
 */

import { BASE_URL, makeRequest, validateResponse, getAuthHeaders, randomSleep } from '../common/helpers.js';

export function getProfileFlow(token) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('GET', `${BASE_URL}/users/me`, null, {
    headers,
  });

  validateResponse(response, 200, 'Get Profile');
  randomSleep(0.5, 1);
}

export function updateProfileFlow(token) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('PATCH', `${BASE_URL}/users/me`, {
    name: `Updated User ${Date.now()}`,
  }, {
    headers,
  });

  validateResponse(response, 200, 'Update Profile');
  randomSleep(0.5, 1);
}
