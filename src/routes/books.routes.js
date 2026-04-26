'use strict';

const { Router } = require('express');
const booksController = require('../controllers/books.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Todas as rotas de livros exigem autenticação
router.use(authMiddleware);

// POST /api/books
router.post('/', booksController.create);

// GET /api/books
router.get('/', booksController.list);

// GET /api/books/:id
router.get('/:id', booksController.getById);

// PUT /api/books/:id
router.put('/:id', booksController.update);

// DELETE /api/books/:id
router.delete('/:id', booksController.remove);

module.exports = router;
