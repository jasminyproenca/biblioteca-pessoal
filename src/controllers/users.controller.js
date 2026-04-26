'use strict';

const usersService = require('../services/users.service');
const { success } = require('../utils/api-response');

/**
 * PUT /api/users/me
 * Atualiza o perfil do usuário autenticado.
 * Apenas os campos enviados no body serão atualizados.
 */
async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateMe(req.user.id, req.body);
    return success(res, {
      statusCode: 200,
      message: 'Perfil atualizado com sucesso.',
      data: { user },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { updateMe };
