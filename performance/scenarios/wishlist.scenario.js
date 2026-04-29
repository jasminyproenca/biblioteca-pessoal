/**
 * Cenário de Performance - Wishlist
 * Testa: List wishlist items, Add to wishlist, Remove from wishlist
 */

import { BASE_URL, makeRequest, validateResponse, getAuthHeaders, randomSleep } from '../common/helpers.js';

export function listWishlistFlow(token) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('GET', `${BASE_URL}/wishlist`, null, {
    headers,
  });

  validateResponse(response, 200, 'List Wishlist');
  randomSleep(0.5, 1);
}

export function addToWishlistFlow(token, bookId) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('POST', `${BASE_URL}/wishlist`, {
    bookId,
  }, {
    headers,
  });

  validateResponse(response, 201, 'Add to Wishlist');
  randomSleep(0.5, 1);
}

export function removeFromWishlistFlow(token, itemId) {
  const headers = getAuthHeaders(token);
  
  const response = makeRequest('DELETE', `${BASE_URL}/wishlist/${itemId}`, null, {
    headers,
  });

  validateResponse(response, 200, 'Remove from Wishlist');
  randomSleep(0.5, 1);
}
