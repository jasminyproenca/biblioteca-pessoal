'use strict';

const booksService = require('../services/books.service');
const { success } = require('../utils/api-response');

/**
 * POST /api/books
 * Cria um novo livro na biblioteca do usuário autenticado.
 */
function create(req, res, next) {
  try {
    const book = booksService.createBookForUser(req.user.id, req.body);
    return success(res, {
      statusCode: 201,
      message: 'Livro cadastrado com sucesso.',
      data: { book },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/books
 * Lista todos os livros do usuário autenticado.
 */
function list(req, res, next) {
  try {
    const books = booksService.listBooks(req.user.id);
    return success(res, {
      statusCode: 200,
      message: 'Livros listados com sucesso.',
      data: { books, total: books.length },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/books/:id
 * Busca um livro específico do usuário autenticado.
 */
function getById(req, res, next) {
  try {
    const book = booksService.getBookById(req.user.id, req.params.id);
    return success(res, {
      statusCode: 200,
      message: 'Livro encontrado.',
      data: { book },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * PUT /api/books/:id
 * Atualiza um livro do usuário autenticado.
 */
function update(req, res, next) {
  try {
    const book = booksService.updateBook(req.user.id, req.params.id, req.body);
    return success(res, {
      statusCode: 200,
      message: 'Livro atualizado com sucesso.',
      data: { book },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/books/:id
 * Remove um livro do usuário autenticado.
 */
function remove(req, res, next) {
  try {
    booksService.deleteBook(req.user.id, req.params.id);
    return success(res, {
      statusCode: 200,
      message: 'Livro removido com sucesso.',
      data: null,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, list, getById, update, remove };
