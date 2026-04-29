/**
 * Limites de performance (thresholds) para os testes k6
 * Definem critérios de sucesso/falha para os testes
 */

export const defaultThresholds = {
  // Taxa de erro deve ser menor que 1%
  'http_req_failed': ['rate<0.01'],
  
  // P95 de latência deve ser menor que 500ms
  'http_req_duration': ['p(95)<500'],
  
  // P99 de latência deve ser menor que 1s
  'http_req_duration{staticAsset:yes}': ['p(99)<1000'],
};

export const stressThresholds = {
  'http_req_failed': ['rate<0.05'], // 5% sob stress é aceitável
  'http_req_duration': ['p(95)<2000'],
};

export const soakThresholds = {
  'http_req_failed': ['rate<0.01'],
  'http_req_duration': ['p(95)<500'],
};

export const thresholds = {
  default: defaultThresholds,
  stress: stressThresholds,
  soak: soakThresholds,
};
