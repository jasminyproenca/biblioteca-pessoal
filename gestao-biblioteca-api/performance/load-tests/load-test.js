/**
 * Load Test - Simula carga normal esperada
 * Objetivo: Validar comportamento sob carga típica de produção
 * 
 * Perfil:
 * - Ramp-up: 0 → 50 usuários em 2 minutos
 * - Sustentação: 50 usuários por 5 minutos
 * - Ramp-down: 50 → 0 usuários em 2 minutos
 * 
 * Executar: k6 run performance/load-tests/load-test.js
 */

import { group } from 'k6';
import { defaultThresholds } from '../common/thresholds.js';
import { registerFlow, loginFlow } from '../scenarios/auth.scenario.js';
import { listBooksFlow, createBookFlow } from '../scenarios/books.scenario.js';
import { getProfileFlow } from '../scenarios/users.scenario.js';
import { listWishlistFlow } from '../scenarios/wishlist.scenario.js';

export const options = {
  stages: [
    // Ramp-up de 0 a 10 usuários em 1 minuto
    { duration: '1m', target: 10 },
    // Mantém 10 usuários por 2 minutos
    { duration: '2m', target: 10 },
    // Ramp-down de 10 a 0 usuários em 1 minuto
    { duration: '1m', target: 0 },
  ],
  thresholds: defaultThresholds,
};

export default function () {
  group('Auth Operations', () => {
    registerFlow();
  });

  group('Book Operations', () => {
    const token = loginFlow();
    if (token) {
      listBooksFlow(token);
      createBookFlow(token);
    }
  });

  group('User Operations', () => {
    const token = loginFlow();
    if (token) {
      getProfileFlow(token);
    }
  });

  group('Wishlist Operations', () => {
    const token = loginFlow();
    if (token) {
      listWishlistFlow(token);
    }
  });
}
