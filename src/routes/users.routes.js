'use strict';

const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// GET /api/users/me — rota protegida
router.get('/me', authMiddleware, usersController.getMe);

// PUT /api/users/me — rota protegida
router.put('/me', authMiddleware, usersController.updateMe);

module.exports = router;
