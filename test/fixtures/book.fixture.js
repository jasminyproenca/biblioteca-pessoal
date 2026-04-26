'use strict';

/**
 * Fixture de livro para testes.
 */

const validBook = {
  title: 'Dom Casmurro',
  author: 'Machado de Assis',
  status: 'lido',
  rating: 5,
  isFavorite: true,
  review: 'Obra-prima da literatura brasileira.',
};

const anotherBook = {
  title: 'O Cortiço',
  author: 'Aluísio Azevedo',
  status: 'quero ler',
};

const minimalBook = {
  title: 'Memórias Póstumas de Brás Cubas',
  author: 'Machado de Assis',
};

const invalidBookNoTitle = {
  author: 'Autor Qualquer',
  status: 'lido',
};

const invalidBookBadStatus = {
  title: 'Livro Inválido',
  author: 'Autor',
  status: 'status_inexistente',
};

const invalidBookBadRating = {
  title: 'Livro Rating',
  author: 'Autor',
  rating: 7,
};

module.exports = {
  validBook,
  anotherBook,
  minimalBook,
  invalidBookNoTitle,
  invalidBookBadStatus,
  invalidBookBadRating,
};
