'use strict';

const wishlistService = require('../services/wishlist.service');
const { success } = require('../utils/api-response');

/**
 * POST /api/wishlist
 * Adiciona um item à wishlist do usuário autenticado.
 */
function add(req, res, next) {
  try {
    const item = wishlistService.addWishlistItem(req.user.id, req.body);
    return success(res, {
      statusCode: 201,
      message: 'Item adicionado à lista de desejos.',
      data: { item },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/wishlist
 * Lista todos os itens da wishlist do usuário autenticado.
 */
function list(req, res, next) {
  try {
    const items = wishlistService.listWishlist(req.user.id);
    return success(res, {
      statusCode: 200,
      message: 'Lista de desejos obtida com sucesso.',
      data: { items, total: items.length },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/wishlist/:id
 * Remove um item da wishlist do usuário autenticado.
 */
function remove(req, res, next) {
  try {
    wishlistService.deleteWishlistItem(req.user.id, req.params.id);
    return success(res, {
      statusCode: 200,
      message: 'Item removido da lista de desejos.',
      data: null,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { add, list, remove };
