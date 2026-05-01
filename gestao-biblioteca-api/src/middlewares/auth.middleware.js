'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError } = require('../utils/errors');
const { error: apiError } = require('../utils/api-response');

/**
 * Middleware de autenticação JWT.
 *
 * Espera o header: Authorization: Bearer <token>
 *
 * Em caso de sucesso, popula req.user = { id, username }.
 *
 * Status e mensagens de erro:
 *   401 TOKEN_MISSING   — header Authorization ausente
 *   401 TOKEN_INVALID   — token malformado ou assinatura inválida
 *   401 TOKEN_EXPIRED   — token expirado
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return apiError(res, {
      statusCode: 401,
      message: 'Token de autenticação não fornecido.',
      code: 'TOKEN_MISSING',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: decoded.sub, username: decoded.username };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return apiError(res, {
        statusCode: 401,
        message: 'Token expirado. Faça login novamente.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return apiError(res, {
      statusCode: 401,
      message: 'Token inválido.',
      code: 'TOKEN_INVALID',
    });
  }
}

module.exports = authMiddleware;
