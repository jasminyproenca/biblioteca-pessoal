/**
 * Stress Test - Encontra os limites do sistema
 * Objetivo: Identificar em qual ponto o sistema começa a falhar
 * 
 * Perfil:
 * - Ramp-up: 0 → 200 usuários em 5 minutos (aumenta gradualmente)
 * - Sustentação: 200 usuários por 2 minutos
 * - Ramp-down: 200 → 0 usuários em 2 minutos
 * 
 * Executar: k6 run performance/load-tests/stress-test.js
 */

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { group } from 'k6';
import { stressThresholds } from '../common/thresholds.js';
import { registerFlow, loginFlow } from '../scenarios/auth.scenario.js';
import { listBooksFlow, createBookFlow, updateBookFlow } from '../scenarios/books.scenario.js';
import { getProfileFlow, updateProfileFlow } from '../scenarios/users.scenario.js';
import { listWishlistFlow, addToWishlistFlow } from '../scenarios/wishlist.scenario.js';

export const options = {
  stages: [
    // Ramp-up: 0 → 100 usuários em 2 minutos
    { duration: '2m', target: 100 },
    // Ramp-up: 100 → 200 usuários em 3 minutos
    { duration: '3m', target: 200 },
    // Mantém 200 usuários por 2 minutos
    { duration: '2m', target: 200 },
    // Ramp-down: 200 → 0 usuários em 2 minutos
    { duration: '2m', target: 0 },
  ],
  thresholds: stressThresholds,
};

export default function () {
  group('Auth Operations', () => {
    registerFlow();
  });

  group('Book Operations', () => {
    const token = loginFlow();
    if (token) {
      listBooksFlow(token);
      const bookId = createBookFlow(token);
      if (bookId) {
        updateBookFlow(token, bookId);
      }
    }
  });

  group('User Operations', () => {
    const token = loginFlow();
    if (token) {
      getProfileFlow(token);
      updateProfileFlow(token);
    }
  });

  group('Wishlist Operations', () => {
    const token = loginFlow();
    if (token) {
      listWishlistFlow(token);
    }
  });
}

export function handleSummary(data) {
  return {
    "stress-test-report.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
