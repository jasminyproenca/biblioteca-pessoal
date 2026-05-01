# Gestão de Biblioteca Pessoal

Monorepo contendo a API e o frontend da aplicação de gestão de biblioteca pessoal.

## Estrutura

```
gestao-biblioteca/
├── gestao-biblioteca-api/   → API REST (Node.js + Express + JWT)
└── gestao-biblioteca-web/   → Frontend (React + Vite)
```

## Como rodar

### API
```bash
cd gestao-biblioteca-api
npm install
npm run dev        # http://localhost:3000
```

### Frontend
```bash
cd gestao-biblioteca-web
npm install
npm run dev        # http://localhost:5173
```

## Documentação

- Swagger UI: http://localhost:3000/api/docs
- A API deve estar rodando para o frontend funcionar corretamente.
