/**
 * Cenário de Performance - Livros
 * Testa: List books, Get book details, Create book, Update book
 */

import { BASE_URL, makeRequest, validateResponse, getAuthHeaders, randomSleep } from '../common/helpers.js';
import { testBooks, getRandomBook } from '../common/fixtures.js';

export function listBooksFlow(token) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('GET', `${BASE_URL}/books`, null, {
    headers,
  });

  validateResponse(response, 200, 'List Books');
  randomSleep(0.5, 1);
}

export function getBookDetailsFlow(token, bookId) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('GET', `${BASE_URL}/books/${bookId}`, null, {
    headers,
  });

  validateResponse(response, 200, 'Get Book Details');
  randomSleep(0.5, 1);
}

export function createBookFlow(token) {
  const headers = getAuthHeaders(token);
  const book = getRandomBook();
  
  const response = makeRequest('POST', `${BASE_URL}/books`, book, {
    headers,
  });

  validateResponse(response, 201, 'Create Book');
  randomSleep(0.5, 1);
  
  return response.json('data.book.id');
}

export function updateBookFlow(token, bookId) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('PUT', `${BASE_URL}/books/${bookId}`, {
    status: 'borrowed',
  }, {
    headers,
  });

  validateResponse(response, 200, 'Update Book');
  randomSleep(0.5, 1);
}
