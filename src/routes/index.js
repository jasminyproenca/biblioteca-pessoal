'use strict';

const { Router } = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('../resources/swagger/openapi.json');

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const booksRoutes = require('./books.routes');
const wishlistRoutes = require('./wishlist.routes');

const router = Router();

// Documentação Swagger
router.get('/docs/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(openApiSpec);
});

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Gestão de Biblioteca Pessoal — API Docs',
}));

// Rotas de domínio
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/books', booksRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;
