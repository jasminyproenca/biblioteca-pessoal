'use strict';

const bcrypt = require('bcryptjs');
const { toPublicUser } = require('../models/user.model');
const memoryDb = require('../utils/in-memory-db');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Obtém o perfil do usuário autenticado.
 */
async function getMe(userId) {
  const user = memoryDb.users.find((u) => u.id === userId);
  if (!user) {
    throw new NotFoundError('Usuário não encontrado.');
  }

  return toPublicUser(user);
}

/**
 * Atualiza os dados do perfil do usuário autenticado.
 * Apenas os campos enviados são atualizados (PATCH semântico via PUT).
 *
 * Regras:
 *   - name, username, email e password são opcionais na atualização;
 *   - se enviados, passam pelas mesmas validações do registro;
 *   - username e email devem continuar únicos (exceto para o próprio usuário).
 */
async function updateMe(userId, updates) {
  const user = memoryDb.users.find((u) => u.id === userId);
  if (!user) {
    throw new NotFoundError('Usuário não encontrado.');
  }

  const details = [];

  if (updates.name !== undefined) {
    if (typeof updates.name !== 'string' || updates.name.trim().length === 0) {
      details.push({ field: 'name', message: 'Nome não pode ser vazio.' });
    }
  }

  if (updates.username !== undefined) {
    const normalizedUsername = updates.username.toLowerCase().trim();
    const taken = memoryDb.users.find(
      (u) => u.username === normalizedUsername && u.id !== userId
    );
    if (taken) {
      throw new ConflictError('Username já está em uso.');
    }
    updates.username = normalizedUsername;
  }

  if (updates.email !== undefined) {
    if (!EMAIL_REGEX.test(updates.email)) {
      details.push({ field: 'email', message: 'E-mail inválido.' });
    } else {
      const normalizedEmail = updates.email.toLowerCase().trim();
      const taken = memoryDb.users.find(
        (u) => u.email === normalizedEmail && u.id !== userId
      );
      if (taken) {
        throw new ConflictError('E-mail já está em uso.');
      }
      updates.email = normalizedEmail;
    }
  }

  if (updates.password !== undefined) {
    if (!PASSWORD_REGEX.test(updates.password)) {
      details.push({
        field: 'password',
        message: 'Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.',
      });
    }
  }

  if (details.length > 0) {
    throw new ValidationError('Dados de atualização inválidos.', details);
  }

  // Aplica as atualizações no objeto de memória
  if (updates.name) user.name = updates.name.trim();
  if (updates.username) user.username = updates.username;
  if (updates.email) user.email = updates.email;
  if (updates.password) user.passwordHash = await bcrypt.hash(updates.password, 10);

  user.updatedAt = new Date().toISOString();

  return toPublicUser(user);
}

module.exports = { getMe, updateMe };
