'use strict';

const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// CORS — permite requisições do frontend em desenvolvimento
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse de JSON no body das requisições
app.use(express.json());

// Todas as rotas sob /api
app.use('/api', routes);

// Rota raiz de health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gerenciamento de Biblioteca Pessoal está no ar.',
    docs: '/api/docs',
  });
});

// Middleware de erros — DEVE ser o último middleware registrado
app.use(errorMiddleware);

module.exports = app;
