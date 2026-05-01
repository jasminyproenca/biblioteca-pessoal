'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Model de Usuário.
 *
 * Responsável apenas por criar o objeto canônico de um usuário.
 * A validação e a lógica de negócio ficam na camada de service.
 *
 * Campos:
 *   id           — UUID único gerado automaticamente
 *   name         — nome completo do usuário
 *   username     — identificador único (sem espaços, lowercase)
 *   email        — e-mail único e válido
 *   passwordHash — hash bcrypt da senha (NUNCA retornar em responses)
 *   createdAt    — data/hora de criação (ISO 8601)
 *   updatedAt    — data/hora da última atualização (ISO 8601)
 */
function createUser({ name, username, email, passwordHash }) {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name,
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Retorna uma representação pública do usuário (sem passwordHash).
 * @param {object} user
 */
function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = { createUser, toPublicUser };
