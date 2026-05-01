'use strict';

const { Router } = require('express');
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Todas as rotas da wishlist exigem autenticação
router.use(authMiddleware);

// POST /api/wishlist
router.post('/', wishlistController.add);

// GET /api/wishlist
router.get('/', wishlistController.list);

// DELETE /api/wishlist/:id
router.delete('/:id', wishlistController.remove);

module.exports = router;
