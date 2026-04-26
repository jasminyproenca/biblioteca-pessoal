# Gestão de Biblioteca Pessoal — Web

Interface web para o sistema de gerenciamento de biblioteca pessoal, desenvolvida em React + Vite como frontend da [API REST gestao-biblioteca](../gestao-biblioteca).

---

## Descrição

SPA (Single Page Application) que consome a API REST de biblioteca pessoal, permitindo ao usuário criar conta, fazer login, gerenciar seus livros e lista de desejos com uma interface moderna e responsiva.

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 19 | Framework de UI baseado em componentes |
| Vite | Bundler e dev server com HMR instantâneo |
| React Router v7 | Roteamento SPA com rotas protegidas |
| Zustand | Gerenciamento de estado global (auth + dados) |
| Axios | HTTP client com interceptors JWT automáticos |
| React Hook Form | Validação e controle de formulários |
| Lucide React | Biblioteca de ícones SVG |

---

## Funcionalidades

- **Autenticação** — Cadastro, login (e-mail ou username), logout e sessão persistida via `localStorage`
- **Dashboard** — Cards de resumo (total de livros, lidos, lendo, wishlist) e livros recentes
- **Meus Livros** — Grid de cards com filtros por status, adicionar, editar e remover livros
- **Detalhe do Livro** — Página com informações completas, resenha, avaliação e histórico
- **Lista de Desejos** — Gerenciamento de livros desejados
- **Perfil** — Visualização e edição de dados da conta
- **Rotas protegidas** — Redireciona para `/login` se não autenticado ou com token expirado

---

## Estrutura de Pastas

```
src/
├── api/                  # Chamadas HTTP organizadas por recurso
│   ├── axios.js          # Instância Axios + interceptors JWT + redirect 401
│   ├── auth.js
│   ├── books.js
│   ├── wishlist.js
│   └── users.js
├── components/
│   ├── Layout/           # Sidebar, Layout wrapper
│   ├── ui/               # Primitivos: Badge, Modal, Spinner, EmptyState, StarRating
│   └── books/            # BookCard, BookForm, BookFilters
├── pages/                # Uma página por rota
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── BooksPage.jsx
│   ├── BookDetailPage.jsx
│   ├── WishlistPage.jsx
│   └── ProfilePage.jsx
├── routes/
│   ├── AppRouter.jsx     # Configuração de rotas
│   └── PrivateRoute.jsx  # Guard de autenticação
├── store/                # Stores Zustand
│   ├── useAuthStore.js   # Estado de autenticação (hidratação síncrona)
│   ├── useBooksStore.js
│   └── useWishlistStore.js
├── App.jsx
├── main.jsx
└── index.css             # Design system completo (dark mode, variáveis, animações)
```

---

## Pré-requisitos

- Node.js 18+
- API `gestao-biblioteca` rodando em `http://localhost:3000`

---

## Instalação

```bash
# 1. Acesse o diretório do projeto
cd gestao-biblioteca-web

# 2. Instale as dependências
npm install
```

---

## Execução

```bash
# Desenvolvimento (com HMR)
npm run dev
```

A aplicação sobe em `http://localhost:5173` por padrão.

> ⚠️ A API deve estar rodando em `http://localhost:3000` antes de iniciar o frontend.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz (há valor padrão para desenvolvimento):

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Rodar o Projeto Completo

```bash
# Terminal 1 — API
cd gestao-biblioteca
npm run dev        # http://localhost:3000

# Terminal 2 — Frontend
cd gestao-biblioteca-web
npm run dev        # http://localhost:5173
```

---

## Autenticação JWT

O frontend gerencia o token JWT de forma transparente:

1. Após login/cadastro, o token é salvo no `localStorage`
2. Todo request HTTP inclui automaticamente `Authorization: Bearer <token>` via interceptor do Axios
3. Respostas `401` da API removem o token e redirecionam para `/login`
4. O estado de autenticação é hidratado de forma **síncrona** no carregamento da store (evita flash de redirect indevido)

---

## Design

- **Dark mode** como padrão, com paleta indigo/violet
- Fonte **Inter** via Google Fonts
- Cards com efeito **glassmorphism**
- Micro-animações em hover, modais e transições de rota
- Totalmente responsivo

---

## Limitações

- Os dados dependem da API em memória — reiniciar o servidor da API apaga todos os dados cadastrados
- Não há paginação (a API não implementa paginação)
- Sem suporte a upload de imagem de capa de livro
