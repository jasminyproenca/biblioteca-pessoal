'use strict';

const request = require('supertest');
const { expect } = require('chai');
const assert = require('assert');
const app = require('../src/app');
const resetMemoryDb = require('../src/utils/reset-memory-db');
const booksService = require('../src/services/books.service');
const { validUser, anotherUser } = require('./fixtures/user.fixture');
const {
  validBook,
  anotherBook,
  minimalBook,
  invalidBookNoTitle,
  invalidBookBadStatus,
  invalidBookBadRating,
} = require('./fixtures/book.fixture');

// Helper
async function registerAndLogin(userData = validUser) {
  await request(app).post('/api/auth/register').send(userData);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ login: userData.email, password: userData.password });
  return res.body.data.token;
}

describe('Books', () => {
  beforeEach(() => {
    resetMemoryDb();
  });

  // ─── Testes unitários do service ─────────────────────────────────────────────

  describe('[Unit] Livro — deve rejeitar dados inválidos', () => {
    it('deve lançar ValidationError quando título está ausente', () => {
      const { ValidationError } = require('../src/utils/errors');
      // Arrange
      const fakeUserId = 'user-123';

      // Assert via assert.throws
      assert.throws(
        () => booksService.createBookForUser(fakeUserId, invalidBookNoTitle),
        (err) => {
          assert.ok(err instanceof ValidationError);
          return true;
        }
      );
    });

    it('deve lançar ValidationError para status inválido', () => {
      const { ValidationError } = require('../src/utils/errors');
      assert.throws(
        () => booksService.createBookForUser('user-123', invalidBookBadStatus),
        (err) => {
          assert.ok(err instanceof ValidationError);
          return true;
        }
      );
    });

    it('deve lançar ValidationError para rating fora do intervalo', () => {
      const { ValidationError } = require('../src/utils/errors');
      assert.throws(
        () => booksService.createBookForUser('user-123', invalidBookBadRating),
        (err) => {
          assert.ok(err instanceof ValidationError);
          return true;
        }
      );
    });
  });

  // ─── Integração HTTP ──────────────────────────────────────────────────────────

  describe('POST /api/books', () => {
    it('deve criar um livro com dados completos', async () => {
      // Arrange
      const token = await registerAndLogin();

      // Act
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(validBook);

      // Assert
      expect(res.status).to.equal(201);
      expect(res.body.data.book.title).to.equal(validBook.title);
      expect(res.body.data.book.isFavorite).to.be.true;
      expect(res.body.data.book).to.have.property('id');
    });

    it('deve criar um livro apenas com campos obrigatórios (title e author)', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(minimalBook);

      expect(res.status).to.equal(201);
      expect(res.body.data.book.status).to.equal('quero ler'); // default
      expect(res.body.data.book.rating).to.be.null;
    });

    it('deve retornar 409 ao cadastrar livro duplicado (mesmo título e autor)', async () => {
      const token = await registerAndLogin();
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(validBook);

      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(validBook);

      expect(res.status).to.equal(409);
      expect(res.body.error.code).to.equal('CONFLICT');
    });

    it('deve retornar 422 para dados inválidos', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidBookNoTitle);

      expect(res.status).to.equal(422);
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).post('/api/books').send(validBook);
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/books', () => {
    it('deve listar apenas os livros do usuário autenticado', async () => {
      // Arrange — dois usuários, cada um cadastra um livro
      const token1 = await registerAndLogin(validUser);
      const token2 = await registerAndLogin(anotherUser);

      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token1}`)
        .send(validBook);

      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token2}`)
        .send(anotherBook);

      // Act
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token1}`);

      // Assert — usuário 1 vê apenas seu livro
      expect(res.status).to.equal(200);
      expect(res.body.data.books).to.have.length(1);
      expect(res.body.data.books[0].title).to.equal(validBook.title);
    });

    it('deve retornar lista vazia quando o usuário não tem livros', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.books).to.have.length(0);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('deve atualizar status e rating de um livro', async () => {
      // Arrange
      const token = await registerAndLogin();
      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(minimalBook);

      const bookId = createRes.body.data.book.id;

      // Act
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'lido', rating: 4, isFavorite: false });

      // Assert
      expect(res.status).to.equal(200);
      expect(res.body.data.book.status).to.equal('lido');
      expect(res.body.data.book.rating).to.equal(4);
    });

    it('deve retornar 404 para livro inexistente', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .put('/api/books/id-inexistente')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'lido' });

      expect(res.status).to.equal(404);
    });

    it('deve retornar 403 ao tentar editar livro de outro usuário', async () => {
      // Arrange
      const token1 = await registerAndLogin(validUser);
      const token2 = await registerAndLogin(anotherUser);

      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token1}`)
        .send(validBook);

      const bookId = createRes.body.data.book.id;

      // Act — usuário 2 tenta editar livro do usuário 1
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ status: 'lendo' });

      expect(res.status).to.equal(403);
    });

    it('deve retornar 422 para status inválido', async () => {
      const token = await registerAndLogin();
      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(minimalBook);

      const bookId = createRes.body.data.book.id;
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalido' });

      expect(res.status).to.equal(422);
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('deve remover um livro com sucesso', async () => {
      // Arrange
      const token = await registerAndLogin();
      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(validBook);

      const bookId = createRes.body.data.book.id;

      // Act
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(res.status).to.equal(200);

      // Verificar que não existe mais
      const listRes = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);
      expect(listRes.body.data.books).to.have.length(0);
    });

    it('deve retornar 404 ao remover livro inexistente', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .delete('/api/books/id-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });

    it('deve retornar 403 ao tentar remover livro de outro usuário', async () => {
      const token1 = await registerAndLogin(validUser);
      const token2 = await registerAndLogin(anotherUser);

      const createRes = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token1}`)
        .send(validBook);

      const bookId = createRes.body.data.book.id;

      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).to.equal(403);
    });
  });
});
