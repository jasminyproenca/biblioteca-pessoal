'use strict';

const request = require('supertest');
const { expect } = require('chai');
const assert = require('assert');
const app = require('../src/app');
const resetMemoryDb = require('../src/utils/reset-memory-db');
const wishlistService = require('../src/services/wishlist.service');
const { validUser, anotherUser } = require('./fixtures/user.fixture');
const {
  validWishlistItem,
  anotherWishlistItem,
  invalidWishlistNoTitle,
  invalidWishlistNoAuthor,
} = require('./fixtures/wishlist.fixture');

async function registerAndLogin(userData = validUser) {
  await request(app).post('/api/auth/register').send(userData);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ login: userData.email, password: userData.password });
  return res.body.data.token;
}

describe('Wishlist', () => {
  beforeEach(() => {
    resetMemoryDb();
  });

  // ─── Testes unitários do service ─────────────────────────────────────────────

  describe('[Unit] wishlistService.addWishlistItem', () => {
    it('deve lançar ValidationError quando title está ausente', () => {
      const { ValidationError } = require('../src/utils/errors');
      assert.throws(
        () => wishlistService.addWishlistItem('user-123', invalidWishlistNoTitle),
        (err) => {
          assert.ok(err instanceof ValidationError);
          return true;
        }
      );
    });

    it('deve lançar ValidationError quando author está ausente', () => {
      const { ValidationError } = require('../src/utils/errors');
      assert.throws(
        () => wishlistService.addWishlistItem('user-123', invalidWishlistNoAuthor),
        (err) => {
          assert.ok(err instanceof ValidationError);
          return true;
        }
      );
    });
  });

  // ─── Integração HTTP ──────────────────────────────────────────────────────────

  describe('POST /api/wishlist', () => {
    it('deve adicionar um item à wishlist com sucesso', async () => {
      // Arrange
      const token = await registerAndLogin();

      // Act
      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send(validWishlistItem);

      // Assert
      expect(res.status).to.equal(201);
      expect(res.body.data.item.title).to.equal(validWishlistItem.title);
      expect(res.body.data.item).to.have.property('id');
    });

    it('deve retornar 409 ao adicionar item duplicado', async () => {
      const token = await registerAndLogin();
      await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send(validWishlistItem);

      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send(validWishlistItem);

      expect(res.status).to.equal(409);
      expect(res.body.error.code).to.equal('CONFLICT');
    });

    it('deve retornar 422 quando title está ausente', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidWishlistNoTitle);

      expect(res.status).to.equal(422);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).post('/api/wishlist').send(validWishlistItem);
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/wishlist', () => {
    it('deve listar apenas os itens da wishlist do usuário autenticado', async () => {
      // Arrange — dois usuários adicionam itens
      const token1 = await registerAndLogin(validUser);
      const token2 = await registerAndLogin(anotherUser);

      await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token1}`)
        .send(validWishlistItem);

      await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token2}`)
        .send(anotherWishlistItem);

      // Act
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token1}`);

      // Assert — usuário 1 só vê seu item
      expect(res.status).to.equal(200);
      expect(res.body.data.items).to.have.length(1);
      expect(res.body.data.items[0].title).to.equal(validWishlistItem.title);
    });

    it('deve retornar lista vazia se a wishlist estiver vazia', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.items).to.have.length(0);
    });
  });

  describe('DELETE /api/wishlist/:id', () => {
    it('deve remover um item da wishlist com sucesso', async () => {
      // Arrange
      const token = await registerAndLogin();
      const addRes = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token}`)
        .send(validWishlistItem);

      const itemId = addRes.body.data.item.id;

      // Act
      const res = await request(app)
        .delete(`/api/wishlist/${itemId}`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(res.status).to.equal(200);

      const listRes = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token}`);
      expect(listRes.body.data.items).to.have.length(0);
    });

    it('deve retornar 404 ao remover item inexistente', async () => {
      const token = await registerAndLogin();
      const res = await request(app)
        .delete('/api/wishlist/id-que-nao-existe')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });

    it('deve retornar 403 ao remover item de outro usuário', async () => {
      // Arrange
      const token1 = await registerAndLogin(validUser);
      const token2 = await registerAndLogin(anotherUser);

      const addRes = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${token1}`)
        .send(validWishlistItem);

      const itemId = addRes.body.data.item.id;

      // Act
      const res = await request(app)
        .delete(`/api/wishlist/${itemId}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).to.equal(403);
    });
  });
});
