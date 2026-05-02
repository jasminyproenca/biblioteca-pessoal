# Testes Web - Gestão Biblioteca 📚

Este diretório contém a suíte de testes automatizados de interface (End-to-End) para o projeto web do **Gestão Biblioteca Pessoal**, desenvolvidos utilizando o framework [Cypress](https://www.cypress.io/).

## 🎯 Objetivo

O objetivo desta suíte é garantir que os principais fluxos de uso da aplicação web funcionem corretamente, simulando e validando as interações de um usuário real no navegador.

## 📋 Plano de Testes (Suítes E2E)

Os testes foram organizados de forma semântica em quatro áreas principais:

1. **Autenticação e Registro** (`cypress/e2e/auth.cy.js`)
   - Registro de novo usuário com redirecionamento ao painel.
   - Login com credenciais válidas.
   - Login com credenciais inválidas e validação de mensagem de erro.
   - Fluxo de Logout do sistema.

2. **Gestão de Livros** (`cypress/e2e/books.cy.js`)
   - Adicionar novo livro à biblioteca com status, nota e tags.
   - Validação de campos obrigatórios no formulário.
   - Editar um livro existente (alterando status de leitura).
   - Excluir livro da biblioteca.

3. **Lista de Desejos** (`cypress/e2e/wishlist.cy.js`)
   - Adicionar um livro desejado à lista.
   - Remover um livro da lista de desejos.

4. **Perfil do Usuário** (`cypress/e2e/profile.cy.js`)
   - Atualizar dados pessoais (como nome e e-mail).
   - Validação se o nome atualizado reflete imediatamente na barra lateral e na interface.

## ⚙️ Funcionalidades Customizadas

Para tornar os testes mais eficientes, foi criado um comando customizado `cy.login()` dentro de `cypress/support/commands.js`.

**Por que isso foi necessário?**
Como a API utilizada pelo sistema salva os dados **em memória**, as informações são perdidas sempre que o backend é reiniciado. Para resolver isso, o comando `cy.login()` faz chamadas diretas na API (`cy.request`) para registrar um usuário e forçar o login inserindo o token JWT no `localStorage`. Isso ignora a necessidade de passar pela tela de login no início de cada teste, deixando a execução muito mais limpa e veloz.

## 🚀 Como Executar

Para que os testes funcionem, é obrigatório que tanto a API (`gestao-biblioteca-api`) quanto a aplicação Web (`gestao-biblioteca-web`) estejam em execução.

1. Navegue até esta pasta de testes no seu terminal:
```bash
cd gestao-biblioteca-testes-web
```

2. Se ainda não instalou as dependências (caso tenha clonado o repositório agora):
```bash
npm install
```

3. Para abrir a interface gráfica e interativa do Cypress (modo visual, excelente para desenvolvimento):
```bash
npx cypress open
```

4. Para rodar todos os testes de forma automatizada pelo terminal (modo headless, excelente para CI/CD):
```bash
npx cypress run
```
