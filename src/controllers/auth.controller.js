'use strict';

const authService = require('../services/auth.service');
const { success } = require('../utils/api-response');

/**
 * POST /api/auth/register
 * Cria uma nova conta de usuário.
 */
async function register(req, res, next) {
  try {
    const { name, username, email, password } = req.body;
    const user = await authService.register({ name, username, email, password });
    return success(res, {
      statusCode: 201,
      message: 'Usuário cadastrado com sucesso.',
      data: { user },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/login
 * Autentica o usuário e retorna token JWT.
 */
async function login(req, res, next) {
  try {
    const { login: loginField, password } = req.body;
    const result = await authService.login({ login: loginField, password });
    return success(res, {
      statusCode: 200,
      message: 'Login realizado com sucesso.',
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/auth/me
 * Retorna o perfil do usuário autenticado.
 * Requer middleware de autenticação aplicado na rota.
 */
function getMe(req, res, next) {
  try {
    const user = authService.getMe(req.user.id);
    return success(res, {
      statusCode: 200,
      message: 'Perfil obtido com sucesso.',
      data: { user },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, getMe };
