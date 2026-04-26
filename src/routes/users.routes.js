'use strict';

const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// PUT /api/users/me — rota protegida
router.put('/me', authMiddleware, usersController.updateMe);

module.exports = router;
