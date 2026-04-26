# Gestão de Biblioteca Pessoal — API REST

API REST para gerenciamento de biblioteca pessoal, desenvolvida como projeto de conclusão de mentoria de backend com Node.js, Express e JWT.

---

## Descrição

Permite que um usuário crie conta, faça login e gerencie seus próprios livros e lista de desejos. Dados armazenados **em memória** (sem banco de dados) para fins didáticos.

---

## Objetivo

Demonstrar boas práticas de desenvolvimento backend:
- Arquitetura em camadas (routes → controllers → services → models)
- Autenticação JWT com Bearer Token
- Respostas padronizadas em envelope JSON
- Testes de integração com Mocha + Supertest + Chai
- Documentação OpenAPI 3.0 com Swagger UI

---

## Stack

| Tecnologia | Uso |
|---|---|
| Node.js | Runtime JavaScript |
| Express | Framework HTTP |
| JWT (jsonwebtoken) | Autenticação stateless |
| bcryptjs | Hash de senhas |
| uuid | Geração de IDs únicos |
| swagger-ui-express | Renderização do Swagger |
| Mocha | Runner de testes |
| Supertest | Testes de integração HTTP |
| Chai | Assertions expressivas |
| assert (nativo) | Assertions em testes unitários |

---

## Estrutura de Pastas

```
src/
├── app.js                        # Configuração central do Express
├── server.js                     # Entry point (listen)
├── config/
│   └── env.js                    # Variáveis de ambiente
├── controllers/
│   ├── auth.controller.js
│   ├── users.controller.js
│   ├── books.controller.js
│   └── wishlist.controller.js
├── middlewares/
│   ├── auth.middleware.js         # Validação JWT
│   └── error.middleware.js        # Handler global de erros
├── models/
│   ├── user.model.js
│   ├── book.model.js
│   └── wishlist-item.model.js
├── resources/
│   └── swagger/
│       └── openapi.json           # Especificação OpenAPI 3.0
├── routes/
│   ├── index.js                   # Agregador de rotas + Swagger UI
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── books.routes.js
│   └── wishlist.routes.js
├── services/
│   ├── auth.service.js
│   ├── users.service.js
│   ├── books.service.js
│   └── wishlist.service.js
└── utils/
    ├── api-response.js            # Envelope padronizado de respostas
    ├── errors.js                  # Classes de erro de domínio
    ├── in-memory-db.js            # Banco de dados em memória
    └── reset-memory-db.js         # Reset para isolamento de testes

test/
├── fixtures/
│   ├── user.fixture.js
│   ├── book.fixture.js
│   └── wishlist.fixture.js
├── auth.test.js
├── users.test.js
├── books.test.js
└── wishlist.test.js
```

---

## Instalação

```bash
# 1. Clone ou acesse o diretório do projeto
cd gestao-biblioteca

# 2. Instale as dependências
npm install
```

---

## Execução

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor sobe em `http://localhost:3000` por padrão.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz (opcional — há valores padrão para desenvolvimento):

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRES_IN=1d
```

> ⚠️ Em produção, defina sempre um `JWT_SECRET` forte e único.

---

## Execução dos Testes

### Modo terminal (desenvolvimento)

```bash
npm test
```

Exibe o resultado diretamente no terminal. Ideal para o dia a dia.

### Modo relatório HTML (mochawesome)

```bash
npm run test:report
```

Gera um relatório visual em HTML após a execução. O arquivo é salvo em:

```
mochawesome-report/relatorio.html
```

Abra o arquivo no navegador para visualizar o relatório completo com status de cada teste, duração e agrupamentos.

Os testes usam **Mocha + Supertest + Chai**. O estado em memória é resetado antes de cada cenário via `beforeEach`, garantindo isolamento total entre os testes.

---

## Acesso à Documentação Swagger

Com o servidor rodando:

| Recurso | URL |
|---|---|
| Swagger UI | http://localhost:3000/api/docs |
| OpenAPI JSON | http://localhost:3000/api/docs/openapi.json |

---

## Endpoints

### Auth
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | Não | Cadastrar usuário |
| POST | `/api/auth/login` | Não | Login e token JWT |
| GET | `/api/auth/me` | Sim | Perfil autenticado |

### Users
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| PUT | `/api/users/me` | Sim | Atualizar perfil |

### Books
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/books` | Sim | Cadastrar livro |
| GET | `/api/books` | Sim | Listar meus livros |
| GET | `/api/books/:id` | Sim | Buscar livro por ID |
| PUT | `/api/books/:id` | Sim | Atualizar livro |
| DELETE | `/api/books/:id` | Sim | Remover livro |

### Wishlist
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/wishlist` | Sim | Adicionar item |
| GET | `/api/wishlist` | Sim | Listar wishlist |
| DELETE | `/api/wishlist/:id` | Sim | Remover item |

---

## Descrição dos Endpoints

### 🔐 Auth

---

#### `POST /api/auth/register` — Cadastrar usuário

Cria uma nova conta. Não exige autenticação.

**Body (JSON):**
```json
{
  "name": "Maria Silva",
  "username": "mariasilva",
  "email": "maria@email.com",
  "password": "Senha123"
}
```

**Regras:**
- Todos os campos são obrigatórios.
- `username` deve ser único no sistema.
- `email` deve ser válido e único.
- `password` deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 número.
- A senha **nunca** é retornada em respostas.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 201 | — | Usuário criado com sucesso |
| 409 | `CONFLICT` | Username ou e-mail já em uso |
| 422 | `VALIDATION_ERROR` | Campo inválido ou ausente |

---

#### `POST /api/auth/login` — Fazer login

Autentica o usuário e retorna um token JWT para uso nas demais rotas.

**Body (JSON):**
```json
{
  "login": "mariasilva",
  "password": "Senha123"
}
```

> O campo `login` aceita **e-mail ou username** — o sistema identifica automaticamente.

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "uuid-aqui",
      "name": "Maria Silva",
      "username": "mariasilva",
      "email": "maria@email.com"
    }
  }
}
```

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Login realizado, token gerado |
| 401 | `INVALID_CREDENTIALS` | Usuário não encontrado ou senha errada |
| 422 | `VALIDATION_ERROR` | Campos `login` ou `password` ausentes |

---

#### `GET /api/auth/me` — Obter perfil do usuário logado

Retorna os dados do usuário **dono do token** enviado no header. Nenhum ID precisa ser informado na URL — a identidade é extraída automaticamente do token JWT.

**Header obrigatório:**
```
Authorization: Bearer <token>
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Perfil obtido com sucesso.",
  "data": {
    "user": {
      "id": "uuid-aqui",
      "name": "Maria Silva",
      "username": "mariasilva",
      "email": "maria@email.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Perfil retornado |
| 401 | `TOKEN_MISSING` | Header `Authorization` ausente |
| 401 | `TOKEN_INVALID` | Token malformado ou assinatura inválida |
| 401 | `TOKEN_EXPIRED` | Token expirado |

---

### 👤 Users

---

#### `PUT /api/users/me` — Atualizar perfil

Atualiza os dados do usuário autenticado. Apenas os campos enviados no body são modificados — campos ausentes permanecem inalterados.

**Header obrigatório:**
```
Authorization: Bearer <token>
```

**Body (JSON) — todos os campos são opcionais:**
```json
{
  "name": "Maria Souza",
  "username": "mariasouza",
  "email": "marianova@email.com",
  "password": "NovaSenha1"
}
```

**Regras:**
- Um usuário só pode alterar os próprios dados.
- `username` e `email` devem continuar únicos (verificados contra os outros usuários).
- Se `password` for enviada, passa pela mesma validação do registro.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Perfil atualizado com sucesso |
| 401 | `TOKEN_MISSING` | Não autenticado |
| 409 | `CONFLICT` | Username ou e-mail já em uso por outro usuário |
| 422 | `VALIDATION_ERROR` | Campo com valor inválido |

---

### 📚 Books

Todos os endpoints de livros exigem autenticação. Um usuário só acessa e manipula **seus próprios livros**.

---

#### `POST /api/books` — Cadastrar livro

Adiciona um livro à biblioteca pessoal do usuário autenticado.

**Body (JSON):**
```json
{
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "status": "lido",
  "rating": 5,
  "isFavorite": true,
  "review": "Obra-prima da literatura brasileira."
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | string | ✅ | Título do livro |
| `author` | string | ✅ | Nome do autor |
| `status` | string | ❌ | Padrão: `"quero ler"` |
| `rating` | integer (1–5) | ❌ | Nota de 1 a 5 |
| `isFavorite` | boolean | ❌ | Padrão: `false` |
| `review` | string (máx. 1000 chars) | ❌ | Resenha curta |

**Valores aceitos para `status`:** `lido` · `lendo` · `abandonado` · `emprestado` · `quero ler`

**Regra de duplicidade:** mesmo `title` + `author` (sem distinção de maiúsculas/minúsculas) para o mesmo usuário é considerado duplicata.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 201 | — | Livro criado |
| 401 | `TOKEN_MISSING` | Não autenticado |
| 409 | `CONFLICT` | Livro duplicado |
| 422 | `VALIDATION_ERROR` | Campo inválido ou ausente |

---

#### `GET /api/books` — Listar livros

Retorna todos os livros cadastrados pelo usuário autenticado. Livros de outros usuários nunca aparecem na lista.

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Livros listados com sucesso.",
  "data": {
    "books": [ { "id": "...", "title": "Dom Casmurro", "..." : "..." } ],
    "total": 1
  }
}
```

---

#### `GET /api/books/:id` — Buscar livro por ID

Retorna os dados de um livro específico. O livro deve pertencer ao usuário autenticado.

**Parâmetro de rota:** `:id` — UUID do livro.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Livro encontrado |
| 403 | `FORBIDDEN` | Livro pertence a outro usuário |
| 404 | `NOT_FOUND` | ID não existe |

---

#### `PUT /api/books/:id` — Atualizar livro

Atualiza um ou mais campos de um livro. Apenas os campos enviados são modificados.

**Body (JSON) — todos opcionais:**
```json
{
  "status": "lido",
  "rating": 4,
  "isFavorite": false,
  "review": "Releitura: ainda excelente."
}
```

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Livro atualizado |
| 403 | `FORBIDDEN` | Livro pertence a outro usuário |
| 404 | `NOT_FOUND` | ID não existe |
| 409 | `CONFLICT` | Novo título+autor já existe na biblioteca |
| 422 | `VALIDATION_ERROR` | Campo com valor inválido |

---

#### `DELETE /api/books/:id` — Remover livro

Remove permanentemente um livro da biblioteca. A operação não pode ser desfeita.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Livro removido com sucesso |
| 403 | `FORBIDDEN` | Livro pertence a outro usuário |
| 404 | `NOT_FOUND` | ID não existe |

---

### 🛒 Wishlist

Lista de livros que o usuário deseja comprar/adquirir. É uma coleção **independente** da biblioteca pessoal — um livro pode estar na wishlist e também na biblioteca ao mesmo tempo, sem conflito.

---

#### `POST /api/wishlist` — Adicionar item

Adiciona um livro à lista de desejos do usuário autenticado.

**Body (JSON):**
```json
{
  "title": "O Senhor dos Anéis",
  "author": "J.R.R. Tolkien"
}
```

**Regra de duplicidade:** mesmo `title` + `author` (case-insensitive) para o mesmo usuário não pode ser adicionado duas vezes.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 201 | — | Item adicionado |
| 409 | `CONFLICT` | Item já está na wishlist |
| 422 | `VALIDATION_ERROR` | Campo ausente ou inválido |

---

#### `GET /api/wishlist` — Listar wishlist

Retorna todos os itens da lista de desejos do usuário autenticado.

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Lista de desejos obtida com sucesso.",
  "data": {
    "items": [ { "id": "...", "title": "O Senhor dos Anéis", "author": "J.R.R. Tolkien" } ],
    "total": 1
  }
}
```

---

#### `DELETE /api/wishlist/:id` — Remover item

Remove um item da lista de desejos. O item deve pertencer ao usuário autenticado.

**Respostas:**
| Status | Código | Situação |
|---|---|---|
| 200 | — | Item removido |
| 403 | `FORBIDDEN` | Item pertence a outro usuário |
| 404 | `NOT_FOUND` | ID não existe |

---

### Formato padrão de erro

Todos os erros seguem o mesmo envelope:

```json
{
  "success": false,
  "message": "Descrição do erro.",
  "error": {
    "code": "CODIGO_DO_ERRO",
    "details": []
  }
}
```

O campo `details` é populado nos erros de validação (`422`) com os campos específicos que falharam:

```json
{
  "success": false,
  "message": "Dados do livro inválidos.",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "rating", "message": "Rating deve ser um inteiro entre 1 e 5." }
    ]
  }
}
```

---

## Decisões Técnicas

### Regra de Duplicidade
- **Livros**: mesmo `title` + `author` (case-insensitive) para o mesmo usuário = duplicata.
- **Wishlist**: mesma regra.
- **Justificativa**: título e autor identificam uma obra de forma inequívoca para o contexto pessoal.

### Status de Leitura
Valores aceitos: `lido`, `lendo`, `abandonado`, `emprestado`, `quero ler`.
Padrão na criação: `quero ler`.

### Rating
Inteiro de 1 a 5, opcional (null por padrão).

### Review
String com limite de **1000 caracteres**. Suficiente para resenha curta em sistema pessoal.

### Login
Aceita e-mail **ou** username no campo `login`.

### Senha
Mínimo 8 caracteres, 1 maiúscula e 1 número. Armazenada como hash bcrypt (salt rounds: 10).

### Resposta sem `passwordHash`
Nunca exposto em nenhum endpoint. Removido via desestruturação em `toPublicUser()`.

---

## Limitações da Persistência em Memória

- **Os dados são perdidos** ao reiniciar o servidor.
- Não há concorrência real: duas requisições simultâneas podem gerar inconsistências em alta carga (fora do escopo didático).
- Não há persistência em disco, arquivo ou banco de dados externo.
- Adequado apenas para desenvolvimento, prototipação e testes automatizados.
