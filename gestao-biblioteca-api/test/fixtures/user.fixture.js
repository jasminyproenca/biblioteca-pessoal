'use strict';

/**
 * Fixture de usuário para testes.
 * Fornece dados válidos prontos para uso nos cenários.
 */

const validUser = {
  name: 'Maria Silva',
  username: 'mariasilva',
  email: 'maria@email.com',
  password: 'Senha123',
};

const anotherUser = {
  name: 'João Souza',
  username: 'joaosouza',
  email: 'joao@email.com',
  password: 'Senha456',
};

const invalidUserNoName = {
  username: 'semname',
  email: 'semname@email.com',
  password: 'Senha123',
};

const invalidUserBadEmail = {
  name: 'Email Ruim',
  username: 'emailruim',
  email: 'nao-e-um-email',
  password: 'Senha123',
};

const invalidUserWeakPassword = {
  name: 'Senha Fraca',
  username: 'senhafraca',
  email: 'senhafraca@email.com',
  password: '1234',
};

module.exports = {
  validUser,
  anotherUser,
  invalidUserNoName,
  invalidUserBadEmail,
  invalidUserWeakPassword,
};
