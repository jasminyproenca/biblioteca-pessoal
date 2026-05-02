describe('Testes de Autenticação e Registro', () => {
  it('Deve logar com sucesso', () => {
    // Cadastra usuário de teste primeiro usando o cy.request do comando customizado (sem login)
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/register',
      failOnStatusCode: false,
      body: {
        name: 'Jasminy',
        username: 'jasminyop',
        email: 'jasminy@email.com',
        password: 'Senha1234'
      }
    })

    cy.visit('http://localhost:5173/login')
    cy.get('[name="login"]').type('jasminyop')
    cy.get('[name="password"]').type('Senha1234')
    cy.get('#btn-login').click()
    cy.contains('p', 'Aqui está um resumo da sua biblioteca').should('be.visible')
  })

  it('Deve exibir erro ao logar com credenciais inválidas', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('[name="login"]').type('usuariodesconhecido')
    cy.get('[name="password"]').type('SenhaErrada123')
    cy.get('#btn-login').click()
    cy.contains('.alert-error', 'Credenciais inválidas.').should('be.visible')
  })

  it('Deve registrar um novo usuário com sucesso', () => {
    cy.visit('http://localhost:5173/register')
    cy.get('#name').type('Usuário Teste')
    cy.get('#username').type('usuarioteste')
    cy.get('#email').type('usuarioteste@email.com')
    cy.get('#reg-password').type('Senha1234')
    cy.get('#btn-register').click()

    // Verifica redirecionamento para o dashboard
    // cy.url().should('include', '/dashboard')
    cy.contains('p', 'Aqui está um resumo da sua biblioteca').should('be.visible')
  })

  it('Deve fazer logout com sucesso', () => {
    cy.login() // Usa o comando customizado para logar
    cy.visit('http://localhost:5173/dashboard')

    // Clica no botão de sair na sidebar
    cy.get('button.sidebar-link.btn-full').click()

    // Verifica se voltou para o login
    cy.url().should('include', '/login')
    cy.contains('h1', 'Bem-vindo de volta').should('be.visible')
  })
})
