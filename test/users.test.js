'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const resetMemoryDb = require('../src/utils/reset-memory-db');
const { validUser, anotherUser } = require('./fixtures/user.fixture');

// Helper: registra e faz login, retorna token
async function registerAndLogin(userData = validUser) {
  await request(app).post('/api/auth/register').send(userData);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ login: userData.email, password: userData.password });
  return res.body.data.token;
}

describe('Users', () => {
  beforeEach(() => {
    resetMemoryDb();
  });

  describe('PUT /api/users/me', () => {
    it('deve atualizar o nome do usuário autenticado', async () => {
      // Arrange
      const token = await registerAndLogin();

      // Act
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Novo Nome' });

      // Assert
      expect(res.status).to.equal(200);
      expect(res.body.data.user.name).to.equal('Novo Nome');
    });

    it('deve retornar 409 ao tentar username já em uso por outro usuário', async () => {
      // Arrange
      await registerAndLogin();
      const token2 = await registerAndLogin(anotherUser);

      // Act — tenta usar o username do primeiro usuário
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token2}`)
        .send({ username: validUser.username });

      expect(res.status).to.equal(409);
    });

    it('deve retornar 422 ao enviar e-mail inválido', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalido' });

      expect(res.status).to.equal(422);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .put('/api/users/me')
        .send({ name: 'Qualquer' });

      expect(res.status).to.equal(401);
    });
  });
});
