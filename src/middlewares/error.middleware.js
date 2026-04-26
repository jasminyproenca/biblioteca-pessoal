'use strict';

const { AppError } = require('../utils/errors');
const { error: apiError } = require('../utils/api-response');

/**
 * Middleware global de tratamento de erros.
 *
 * Captura qualquer erro lançado em rotas e serviços.
 * Se o erro for uma instância de AppError (ou subclasse), usa seu statusCode e code.
 * Caso contrário, responde com 500 INTERNAL_ERROR.
 *
 * DEVE ser registrado APÓS todas as rotas no app.js.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return apiError(res, {
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
      details: err.details || [],
    });
  }

  // Erro inesperado — não exponha detalhes internos em produção
  console.error('[Erro não tratado]', err);
  return apiError(res, {
    statusCode: 500,
    message: 'Erro interno do servidor.',
    code: 'INTERNAL_ERROR',
  });
}

module.exports = errorMiddleware;
