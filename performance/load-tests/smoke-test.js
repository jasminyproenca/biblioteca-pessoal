/**
 * Smoke Test - Validação rápida de sanidade
 * Objetivo: Verificar se a API está respondendo sem erros básicos
 * 
 * Executar: k6 run performance/load-tests/smoke-test.js
 */

import { group } from 'k6';
import { defaultThresholds } from '../common/thresholds.js';
import { registerFlow, loginFlow } from '../scenarios/auth.scenario.js';
import { listBooksFlow, createBookFlow } from '../scenarios/books.scenario.js';
import { getProfileFlow } from '../scenarios/users.scenario.js';
import { listWishlistFlow } from '../scenarios/wishlist.scenario.js';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: defaultThresholds,
};

export default function () {
  group('Auth Flow', () => {
    registerFlow();
  });

  group('Books Flow', () => {
    const token = loginFlow();
    if (token) {
      listBooksFlow(token);
      createBookFlow(token);
    }
  });

  group('Users Flow', () => {
    const token = loginFlow();
    if (token) {
      getProfileFlow(token);
    }
  });

  group('Wishlist Flow', () => {
    const token = loginFlow();
    if (token) {
      listWishlistFlow(token);
    }
  });
}
