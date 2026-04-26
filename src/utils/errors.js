'use strict';

/**
 * Erros de domínio da aplicação.
 *
 * Cada classe estende Error e carrega:
 *   - message   : texto legível
 *   - statusCode: HTTP status a ser devolvido
 *   - code      : identificador snake_upper_case usado no envelope de erro
 *   - details   : array de informações adicionais (campos inválidos, etc.)
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado', code = 'UNAUTHORIZED') {
    super(message, 401, code);
    this.name = 'UnauthorizedError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflito de dados') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
};
