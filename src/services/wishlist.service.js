'use strict';

const { createWishlistItem } = require('../models/wishlist-item.model');
const memoryDb = require('../utils/in-memory-db');
const { ValidationError, NotFoundError, ConflictError, ForbiddenError } = require('../utils/errors');

/**
 * Regra de duplicidade da wishlist: título + autor (case-insensitive) para o mesmo usuário.
 * Mesma convenção adotada nos livros da biblioteca pessoal.
 */
function checkWishlistDuplicate(userId, title, author) {
  const exists = memoryDb.wishlist.find(
    (item) =>
      item.userId === userId &&
      item.title.toLowerCase() === title.toLowerCase().trim() &&
      item.author.toLowerCase() === author.toLowerCase().trim()
  );
  if (exists) {
    throw new ConflictError('Você já adicionou este item à sua lista de desejos.');
  }
}

/** Adiciona um item à wishlist do usuário autenticado. */
function addWishlistItem(userId, { title, author }) {
  const details = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    details.push({ field: 'title', message: 'Título é obrigatório.' });
  }
  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    details.push({ field: 'author', message: 'Autor é obrigatório.' });
  }
  if (details.length > 0) {
    throw new ValidationError('Dados do item inválidos.', details);
  }

  checkWishlistDuplicate(userId, title, author);

  const item = createWishlistItem({ userId, title, author });
  memoryDb.wishlist.push(item);
  return item;
}

/** Lista todos os itens da wishlist do usuário autenticado. */
function listWishlist(userId) {
  return memoryDb.wishlist.filter((item) => item.userId === userId);
}

/** Remove um item da wishlist do usuário. */
function deleteWishlistItem(userId, itemId) {
  const item = memoryDb.wishlist.find((i) => i.id === itemId);
  if (!item) {
    throw new NotFoundError('Item da wishlist não encontrado.');
  }
  if (item.userId !== userId) {
    throw new ForbiddenError('Você não tem permissão para remover este item.');
  }
  const index = memoryDb.wishlist.indexOf(item);
  memoryDb.wishlist.splice(index, 1);
}

module.exports = { addWishlistItem, listWishlist, deleteWishlistItem };
