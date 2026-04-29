/**
 * Configuração global para testes k6
 * Importar esta configuração em todos os testes
 */

export const config = {
  // Ambiente
  baseURL: 'http://localhost:3000/api',
  timeout: '30s',
  
  // Thresholds padrão (podem ser sobrescritos por teste específico)
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(95)<500'],
    'iterations': ['rate>0'],
  },
};

export default config;
