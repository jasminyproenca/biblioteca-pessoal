'use strict';

const { createBook, VALID_STATUSES, REVIEW_MAX_LENGTH } = require('../models/book.model');
const memoryDb = require('../utils/in-memory-db');
const { ValidationError, NotFoundError, ConflictError, ForbiddenError } = require('../utils/errors');

/**
 * Valida os campos de criação/atualização de livro.
 * @param {object} data   — campos a validar
 * @param {boolean} isNew — true se for criação (campos obrigatórios), false se atualização
 */
function validateBookInput(data, isNew = true) {
  const details = [];

  if (isNew) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      details.push({ field: 'title', message: 'Título é obrigatório.' });
    }
    if (!data.author || typeof data.author !== 'string' || data.author.trim().length === 0) {
      details.push({ field: 'author', message: 'Autor é obrigatório.' });
    }
  }

  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    details.push({
      field: 'status',
      message: `Status inválido. Valores aceitos: ${VALID_STATUSES.join(', ')}.`,
    });
  }

  if (data.rating !== undefined && data.rating !== null) {
    const r = Number(data.rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      details.push({ field: 'rating', message: 'Rating deve ser um inteiro entre 1 e 5.' });
    }
  }

  if (data.isFavorite !== undefined && typeof data.isFavorite !== 'boolean') {
    details.push({ field: 'isFavorite', message: 'isFavorite deve ser um boolean.' });
  }

  if (data.review !== undefined && data.review !== null) {
    if (typeof data.review !== 'string') {
      details.push({ field: 'review', message: 'Review deve ser uma string.' });
    } else if (data.review.length > REVIEW_MAX_LENGTH) {
      details.push({
        field: 'review',
        message: `Review não pode ultrapassar ${REVIEW_MAX_LENGTH} caracteres.`,
      });
    }
  }

  if (details.length > 0) {
    throw new ValidationError('Dados do livro inválidos.', details);
  }
}

/**
 * Regra de duplicidade: título + autor (case-insensitive) para o mesmo usuário.
 * Decisão: dois livros com mesmo título e mesmo autor são considerados duplicatas,
 * independentemente dos outros campos, pois identificam a mesma obra.
 */
function checkDuplicate(userId, title, author, excludeId = null) {
  const exists = memoryDb.books.find(
    (b) =>
      b.userId === userId &&
      b.id !== excludeId &&
      b.title.toLowerCase() === title.toLowerCase().trim() &&
      b.author.toLowerCase() === author.toLowerCase().trim()
  );
  if (exists) {
    throw new ConflictError('Você já cadastrou um livro com este título e autor.');
  }
}

/** Cria um novo livro para o usuário autenticado. */
function createBookForUser(userId, data) {
  validateBookInput(data, true);
  checkDuplicate(userId, data.title, data.author);

  const book = createBook({ ...data, userId });
  memoryDb.books.push(book);
  return book;
}

/** Lista todos os livros do usuário autenticado. */
function listBooks(userId) {
  return memoryDb.books.filter((b) => b.userId === userId);
}

/** Busca um livro por ID, verificando que pertence ao usuário. */
function getBookById(userId, bookId) {
  const book = memoryDb.books.find((b) => b.id === bookId);
  if (!book) {
    throw new NotFoundError('Livro não encontrado.');
  }
  if (book.userId !== userId) {
    throw new ForbiddenError('Você não tem permissão para acessar este livro.');
  }
  return book;
}

/** Atualiza um livro existente do usuário. */
function updateBook(userId, bookId, updates) {
  const book = getBookById(userId, bookId);

  validateBookInput(updates, false);

  // Verifica duplicidade apenas se título ou autor foram alterados
  const newTitle = updates.title !== undefined ? updates.title : book.title;
  const newAuthor = updates.author !== undefined ? updates.author : book.author;

  if (updates.title !== undefined || updates.author !== undefined) {
    checkDuplicate(userId, newTitle, newAuthor, bookId);
  }

  if (updates.title !== undefined) book.title = updates.title.trim();
  if (updates.author !== undefined) book.author = updates.author.trim();
  if (updates.status !== undefined) book.status = updates.status;
  if (updates.rating !== undefined) book.rating = updates.rating !== null ? Number(updates.rating) : null;
  if (updates.isFavorite !== undefined) book.isFavorite = updates.isFavorite;
  if (updates.review !== undefined) book.review = updates.review;

  book.updatedAt = new Date().toISOString();

  return book;
}

/** Remove um livro do usuário. */
function deleteBook(userId, bookId) {
  const book = getBookById(userId, bookId);
  const index = memoryDb.books.indexOf(book);
  memoryDb.books.splice(index, 1);
}

module.exports = { createBookForUser, listBooks, getBookById, updateBook, deleteBook };
