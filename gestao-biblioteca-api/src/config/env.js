'use strict';

/**
 * Configurações de ambiente da aplicação.
 * Em produção, utilize variáveis de ambiente reais.
 * Os valores padrão são apenas para desenvolvimento local.
 */
const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'biblioteca-pessoal-secret-dev-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};

module.exports = env;
