'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, toPublicUser } = require('../models/user.model');
const memoryDb = require('../utils/in-memory-db');
const { ValidationError, ConflictError, UnauthorizedError } = require('../utils/errors');
const env = require('../config/env');

// Regex de validação básica de e-mail
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regra de senha:
 *   - mínimo 8 caracteres
 *   - pelo menos 1 letra maiúscula
 *   - pelo menos 1 número
 * Decisão: regra mínima o suficiente para demonstrar validação sem complexidade excessiva.
 */
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Valida os campos de registro e lança ValidationError caso algum falhe.
 */
function validateRegisterInput({ name, username, email, password }) {
  const details = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    details.push({ field: 'name', message: 'Nome é obrigatório.' });
  }
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    details.push({ field: 'username', message: 'Username é obrigatório.' });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    details.push({ field: 'email', message: 'E-mail inválido ou não informado.' });
  }
  if (!password || !PASSWORD_REGEX.test(password)) {
    details.push({
      field: 'password',
      message: 'Senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.',
    });
  }

  if (details.length > 0) {
    throw new ValidationError('Dados de registro inválidos.', details);
  }
}

/**
 * Registra um novo usuário.
 * Verifica unicidade de username e email antes de criar.
 */
async function register({ name, username, email, password }) {
  validateRegisterInput({ name, username, email, password });

  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  const usernameTaken = memoryDb.users.find((u) => u.username === normalizedUsername);
  if (usernameTaken) {
    throw new ConflictError('Username já está em uso.');
  }

  const emailTaken = memoryDb.users.find((u) => u.email === normalizedEmail);
  if (emailTaken) {
    throw new ConflictError('E-mail já está em uso.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ name, username, email, passwordHash });

  memoryDb.users.push(user);

  return toPublicUser(user);
}

/**
 * Autentica um usuário e retorna um token JWT.
 * Aceita login por e-mail ou username.
 */
async function login({ login: loginField, password }) {
  if (!loginField || !password) {
    throw new ValidationError('Login e senha são obrigatórios.', []);
  }

  const normalizedLogin = loginField.toLowerCase().trim();

  const user = memoryDb.users.find(
    (u) => u.email === normalizedLogin || u.username === normalizedLogin
  );

  if (!user) {
    throw new UnauthorizedError('Credenciais inválidas.', 'INVALID_CREDENTIALS');
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new UnauthorizedError('Credenciais inválidas.', 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    { sub: user.id, username: user.username },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return { token, user: toPublicUser(user) };
}

/**
 * Retorna o perfil público do usuário autenticado.
 */
function getMe(userId) {
  const user = memoryDb.users.find((u) => u.id === userId);
  if (!user) {
    throw new UnauthorizedError('Usuário não encontrado.', 'USER_NOT_FOUND');
  }
  return toPublicUser(user);
}

module.exports = { register, login, getMe };
