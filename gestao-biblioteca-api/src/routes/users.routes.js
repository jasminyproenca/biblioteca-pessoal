'use strict';

const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// GET /api/users/me — rota protegida
router.get('/me', authMiddleware, usersController.getMe);

// PATCH /api/users/me — rota protegida
router.patch('/me', authMiddleware, usersController.updateMe);

module.exports = router;
