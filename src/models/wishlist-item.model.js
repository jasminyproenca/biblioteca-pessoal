'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Model de Item da Lista de Desejos (Wishlist).
 *
 * Wishlist e Books são coleções independentes.
 * Um item na wishlist representa um livro que o usuário DESEJA comprar,
 * sem qualquer vínculo com os livros já cadastrados na biblioteca pessoal.
 *
 * Campos:
 *   id        — UUID único
 *   userId    — referência ao usuário dono do item
 *   title     — título do livro desejado (obrigatório)
 *   author    — autor do livro desejado (obrigatório)
 *   createdAt — data/hora de criação (ISO 8601)
 *   updatedAt — data/hora da última atualização (ISO 8601)
 */
function createWishlistItem({ userId, title, author }) {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    userId,
    title: title.trim(),
    author: author.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

module.exports = { createWishlistItem };
