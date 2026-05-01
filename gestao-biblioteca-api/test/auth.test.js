'use strict';

const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const resetMemoryDb = require('../src/utils/reset-memory-db');
const { validUser, anotherUser, invalidUserNoName, invalidUserBadEmail, invalidUserWeakPassword } = require('./fixtures/user.fixture');

describe('Auth', () => {
  // Arrange — limpa o estado antes de cada teste
  beforeEach(() => {
    resetMemoryDb();
  });

  // ─── Registro ───────────────────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('deve cadastrar um usuário com dados válidos', async () => {
      // Act
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Assert
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.user).to.have.property('id');
      expect(res.body.data.user).to.not.have.property('passwordHash');
      expect(res.body.data.user.email).to.equal(validUser.email);
    });

    it('deve retornar 422 quando name está ausente', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUserNoName);

      expect(res.status).to.equal(422);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('deve retornar 422 quando e-mail é inválido', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUserBadEmail);

      expect(res.status).to.equal(422);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('deve retornar 422 quando senha não atende a política', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUserWeakPassword);

      expect(res.status).to.equal(422);
      expect(res.body.error.code).to.equal('VALIDATION_ERROR');
    });

    it('deve retornar 409 quando username já está em uso', async () => {
      // Arrange — primeiro cadastro
      await request(app).post('/api/auth/register').send(validUser);

      // Act — mesmo username
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'outro@email.com' });

      expect(res.status).to.equal(409);
      expect(res.body.error.code).to.equal('CONFLICT');
    });

    it('deve retornar 409 quando e-mail já está em uso', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, username: 'outrousername' });

      expect(res.status).to.equal(409);
      expect(res.body.error.code).to.equal('CONFLICT');
    });
  });

  // ─── Login ───────────────────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('deve fazer login com e-mail e senha corretos', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: validUser.email, password: validUser.password });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.token).to.be.a('string').and.not.empty;
    });

    it('deve fazer login com username e senha corretos', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: validUser.username, password: validUser.password });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('token');
    });

    it('deve retornar 401 com senha incorreta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: validUser.email, password: 'SenhaErrada1' });

      expect(res.status).to.equal(401);
      expect(res.body.error.code).to.equal('INVALID_CREDENTIALS');
    });

    it('deve retornar 401 com usuário inexistente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ login: 'naoexiste@email.com', password: 'Senha123' });

      expect(res.status).to.equal(401);
    });

    it('deve retornar 422 quando campos obrigatórios estão ausentes', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).to.equal(422);
    });
  });

  // ─── GET /me (rota protegida) ────────────────────────────────────────────────

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ login: validUser.email, password: validUser.password });
      token = loginRes.body.data.token;
    });

    it('deve retornar o perfil do usuário autenticado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.user.email).to.equal(validUser.email);
      expect(res.body.data.user).to.not.have.property('passwordHash');
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).to.equal(401);
      expect(res.body.error.code).to.equal('TOKEN_MISSING');
    });

    it('deve retornar 401 com token inválido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token.invalido.aqui');

      expect(res.status).to.equal(401);
      expect(res.body.error.code).to.equal('TOKEN_INVALID');
    });
  });
});
