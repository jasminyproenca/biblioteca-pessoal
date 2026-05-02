describe('Perfil do Usuário', () => {
  beforeEach(() => {
    cy.login() // Loga com usuário padrão
    cy.visit('http://localhost:5173/profile')
  })

  it('Deve atualizar os dados do perfil com sucesso', () => {
    // Altera o nome
    cy.get('[name="name"]').clear().type('Novo Nome do Teste')
    
    // Altera o e-mail
    cy.get('[name="email"]').clear().type('novoemail@teste.com')
    
    cy.contains('button', 'Salvar Alterações').click()

    // Verifica a mensagem de sucesso
    cy.contains('.alert-success', 'Perfil atualizado com sucesso!').should('be.visible')
    
    // Verifica se o nome atualizou no cabeçalho/avatar interno do perfil
    cy.contains('.profile-name', 'Novo Nome do Teste').should('be.visible')
    cy.contains('.profile-meta', 'novoemail@teste.com').should('be.visible')

    // Verifica se refletiu na sidebar (temos a classe sidebar-user-name)
    cy.contains('.sidebar-user-name', 'Novo Nome do Teste').should('be.visible')
  })
})
