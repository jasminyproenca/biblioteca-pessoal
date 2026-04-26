'use strict';

/**
 * Fixture de wishlist para testes.
 */

const validWishlistItem = {
  title: 'O Senhor dos Anéis',
  author: 'J.R.R. Tolkien',
};

const anotherWishlistItem = {
  title: 'Duna',
  author: 'Frank Herbert',
};

const invalidWishlistNoTitle = {
  author: 'Autor Qualquer',
};

const invalidWishlistNoAuthor = {
  title: 'Título sem Autor',
};

module.exports = {
  validWishlistItem,
  anotherWishlistItem,
  invalidWishlistNoTitle,
  invalidWishlistNoAuthor,
};
