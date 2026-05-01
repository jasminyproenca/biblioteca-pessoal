/**
 * Soak Test - Detecta memory leaks e problemas de longa duração
 * Objetivo: Validar estabilidade da API em período prolongado
 * 
 * Perfil:
 * - Ramp-up: 0 → 30 usuários em 1 minuto
 * - Sustentação: 30 usuários por 30 minutos (ou tempo definido)
 * - Ramp-down: 30 → 0 usuários em 1 minuto
 * 
 * Executar: k6 run performance/load-tests/soak-test.js
 * Ou com duração customizada: k6 run performance/load-tests/soak-test.js --vus 30 --duration 1h
 * 
 * Nota: Este teste é pensado para executar por longos períodos (mínimo 10 minutos)
 */

import { group } from 'k6';
import { soakThresholds } from '../common/thresholds.js';
import { registerFlow, loginFlow } from '../scenarios/auth.scenario.js';
import { listBooksFlow } from '../scenarios/books.scenario.js';
import { getProfileFlow } from '../scenarios/users.scenario.js';
import { listWishlistFlow } from '../scenarios/wishlist.scenario.js';

export const options = {
  stages: [
    // Ramp-up: 0 → 30 usuários em 1 minuto
    { duration: '1m', target: 30 },
    // Sustentação: 30 usuários por 10 minutos (padrão, pode ser alterado)
    // Aumentar duration para testes mais rigorosos (ex: 30m, 1h)
    { duration: '10m', target: 30 },
    // Ramp-down: 30 → 0 usuários em 1 minuto
    { duration: '1m', target: 0 },
  ],
  thresholds: soakThresholds,
};

export default function () {
  group('Auth Flow - Soak', () => {
    loginFlow();
  });

  group('Books Flow - Soak', () => {
    const token = loginFlow();
    if (token) {
      listBooksFlow(token);
    }
  });

  group('Users Flow - Soak', () => {
    const token = loginFlow();
    if (token) {
      getProfileFlow(token);
    }
  });

  group('Wishlist Flow - Soak', () => {
    const token = loginFlow();
    if (token) {
      listWishlistFlow(token);
    }
  });
}
