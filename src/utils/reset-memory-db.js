'use strict';

const memoryDb = require('./in-memory-db');

/**
 * Reseta completamente o estado do banco de dados em memória.
 * Deve ser chamado no beforeEach dos testes para garantir isolamento total entre cenários.
 *
 * A técnica usada é limpar o array no lugar (splice) em vez de reatribuir a referência,
 * garantindo que qualquer módulo que já importou memoryDb continue apontando para o mesmo objeto.
 */
function resetMemoryDb() {
  memoryDb.users.splice(0, memoryDb.users.length);
  memoryDb.books.splice(0, memoryDb.books.length);
  memoryDb.wishlist.splice(0, memoryDb.wishlist.length);
}

module.exports = resetMemoryDb;
