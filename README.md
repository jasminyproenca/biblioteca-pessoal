<h1 align="center">📚 Gestão de Biblioteca Pessoal</h1>

<p align="center">
  <em>Sistema completo para gerenciar sua biblioteca pessoal — com API REST, interface web, testes automatizados e testes de performance.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Cypress-E2E-69D3A7?style=for-the-badge&logo=cypress&logoColor=white" />
  <img src="https://img.shields.io/badge/Mocha-Testes%20de%20API-8D6748?style=for-the-badge&logo=mocha&logoColor=white" />
  <img src="https://img.shields.io/badge/k6-Performance-7D64FF?style=for-the-badge&logo=k6&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/jasminyproenca/biblioteca-pessoal/ci.yml?style=for-the-badge&label=CI&logo=githubactions&logoColor=white" />
</p>

---

## 🗂️ Estrutura do Monorepo

Este repositório segue a arquitetura de **monorepo**, com quatro projetos independentes, cada um com seu próprio `package.json` e responsabilidade bem definida:

```
📁 biblioteca-pessoal/
│
├── 📦 gestao-biblioteca-api/              → API REST (Node.js + Express + JWT)
├── 🌐 gestao-biblioteca-web/              → Interface Web (React + Vite)
├── 🧪 gestao-biblioteca-testes-web/       → Testes E2E (Cypress)
└── 📊 gestao-biblioteca-api-performance/  → Testes de Performance (k6)
```

---

## ✨ Funcionalidades

- 🔐 **Autenticação** com JWT — registro, login e perfil autenticado
- 📚 **Gerenciamento de livros** — cadastro, atualização de status de leitura, avaliação (1-5 ⭐), resenha e marcação de favoritos
- 🛒 **Lista de desejos** — livros que o usuário deseja comprar
- 📖 **Documentação interativa** via Swagger UI
- 🧪 **Testes automatizados** de API (Mocha + Chai + Supertest)
- 🌐 **Testes E2E** do frontend (Cypress + Mochawesome)
- 📊 **Testes de performance** — smoke, load, stress e soak (k6)
- 🚀 **Pipeline CI/CD** com GitHub Actions

---

## 🏗️ Arquitetura da API

```
gestao-biblioteca-api/
├── src/
│   ├── config/         → Configurações de ambiente
│   ├── controllers/    → Recebem a requisição HTTP
│   ├── services/       → Regras de negócio
│   ├── models/         → Estrutura dos dados
│   ├── routes/         → Definição dos endpoints
│   ├── middlewares/    → Auth JWT + tratamento de erros
│   ├── utils/          → Helpers, erros e banco em memória
│   └── resources/
│       └── swagger/    → Especificação OpenAPI 3.0
└── test/               → Testes de integração e unitários
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Backend** | Node.js 18+, Express 4, JWT, bcryptjs, UUID |
| **Frontend** | React 19, Vite 8, React Router, Axios, Zustand |
| **Testes de API** | Mocha, Chai, Supertest, Mochawesome |
| **Testes E2E** | Cypress 15, cypress-mochawesome-reporter |
| **Testes de Performance** | k6 |
| **Documentação** | Swagger UI Express, OpenAPI 3.0 |
| **CI/CD** | GitHub Actions |

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm

### 1️⃣ API (Backend)
```bash
cd gestao-biblioteca-api
npm install
npm run dev
# Disponível em http://localhost:3000
# Swagger UI em http://localhost:3000/api/docs
```

### 2️⃣ Frontend (Web)
```bash
cd gestao-biblioteca-web
npm install
npm run dev
# Disponível em http://localhost:5173
```

> ⚠️ A API precisa estar rodando para o frontend funcionar corretamente.

---

## 🧪 Testes

### Testes de API (Mocha + Supertest)
```bash
cd gestao-biblioteca-api
npm test
```

### Testes E2E — Interface Web (Cypress)
Com a API e o Frontend rodando:
```bash
cd gestao-biblioteca-testes-web
npm run open-test    # Abre a interface interativa do Cypress
npm test             # Roda os testes em modo headless (terminal)
```

### Testes de Performance (k6)
```bash
cd gestao-biblioteca-api-performance
npm test             # Smoke test (verificação rápida)
npm run test:full    # Load test (teste de carga completo)
```

---

## 📊 Qualidade

| Métrica | Detalhe |
|---|---|
| **Cobertura de API** | 4 suítes de testes (auth, books, users, wishlist) |
| **Testes de API** | 46+ cenários automatizados |
| **Testes E2E** | Fluxos de autenticação e funcionalidades core |
| **Relatório de testes** | Mochawesome (HTML visual) |
| **Pipeline CI** | Executa automaticamente a cada push/PR na branch `master` |
| **Gestão de defeitos** | 7 bugs documentados como Issues no GitHub |

---

## 📋 Endpoints da API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Criar conta | ❌ |
| `POST` | `/api/auth/login` | Fazer login | ❌ |
| `GET` | `/api/auth/me` | Perfil do usuário logado | ✅ |
| `PATCH` | `/api/users/me` | Atualizar perfil | ✅ |
| `GET` | `/api/books` | Listar livros | ✅ |
| `POST` | `/api/books` | Cadastrar livro | ✅ |
| `GET` | `/api/books/:id` | Buscar livro | ✅ |
| `PATCH` | `/api/books/:id` | Atualizar livro | ✅ |
| `DELETE` | `/api/books/:id` | Remover livro | ✅ |
| `GET` | `/api/wishlist` | Listar wishlist | ✅ |
| `POST` | `/api/wishlist` | Adicionar à wishlist | ✅ |
| `DELETE` | `/api/wishlist/:id` | Remover da wishlist | ✅ |

> 📖 Documentação interativa completa: `http://localhost:3000/api/docs`

---

## 🔗 Documentação Adicional

Acesse a [Wiki do projeto](../../wiki) para encontrar:

- 📐 Arquitetura detalhada do sistema
- 📋 Plano de testes (ISO/IEC 29119)
- 🎯 Estratégia de testes com framework PRISMA
- 📝 Política de qualidade
- 👤 User Stories

---

<p align="center">
  Desenvolvido por <strong>Jasminy Proença</strong> · Projeto de conclusão de mentoria de QA
</p>
