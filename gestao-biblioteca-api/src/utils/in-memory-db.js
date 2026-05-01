'use strict';

/**
 * Banco de dados em memória.
 *
 * ATENÇÃO: todos os dados são perdidos ao reiniciar o servidor.
 * Este mecanismo é exclusivamente para fins didáticos e prototipação.
 *
 * Estrutura das coleções:
 *
 * users[]    — usuários cadastrados no sistema
 * books[]    — livros da biblioteca pessoal de cada usuário
 * wishlist[] — itens da lista de desejos de cada usuário
 *
 * Cada coleção é um array simples de objetos JavaScript.
 * As operações de busca, inserção e remoção são feitas via métodos nativos de array.
 */
const memoryDb = {
  users: [],
  books: [],
  wishlist: [],
};

module.exports = memoryDb;
