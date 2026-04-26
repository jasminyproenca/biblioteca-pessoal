'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Valores permitidos para o campo status.
 * Decisão: lista fechada para garantir consistência dos dados.
 */
const BOOK_STATUS = Object.freeze({
  LIDO: 'lido',
  LENDO: 'lendo',
  ABANDONADO: 'abandonado',
  EMPRESTADO: 'emprestado',
  QUERO_LER: 'quero ler',
});

const VALID_STATUSES = Object.values(BOOK_STATUS);

/**
 * Limite máximo de caracteres para review.
 * Decisão: 1000 caracteres — suficiente para uma resenha curta e objetivo
 * para um sistema pessoal, sem sobrecarregar a memória.
 */
const REVIEW_MAX_LENGTH = 1000;

/**
 * Model de Livro.
 *
 * Campos:
 *   id         — UUID único
 *   userId     — referência ao usuário dono do livro
 *   title      — título do livro (obrigatório)
 *   author     — autor do livro (obrigatório)
 *   status     — situação de leitura (enum BOOK_STATUS)
 *   rating     — nota de 1 a 5 (inteiro, opcional)
 *   isFavorite — boolean indicando livro favorito da vida
 *   review     — resenha curta (string, máx. REVIEW_MAX_LENGTH chars)
 *   createdAt  — data/hora de criação (ISO 8601)
 *   updatedAt  — data/hora da última atualização (ISO 8601)
 */
function createBook({ userId, title, author, status = BOOK_STATUS.QUERO_LER, rating = null, isFavorite = false, review = null }) {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    userId,
    title: title.trim(),
    author: author.trim(),
    status,
    rating,
    isFavorite,
    review,
    createdAt: now,
    updatedAt: now,
  };
}

module.exports = { createBook, BOOK_STATUS, VALID_STATUSES, REVIEW_MAX_LENGTH };
