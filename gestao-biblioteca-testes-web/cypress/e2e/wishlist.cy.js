describe('Lista de Desejos (Wishlist)', () => {
  beforeEach(() => {
    cy.login() // Loga e insere dados falsos antes de cada teste
    cy.visit('http://localhost:5173/wishlist')
  })

  it('Deve adicionar um livro na lista de desejos', () => {
    cy.get('#btn-add-wish').click()
    
    // Preenche o formulário
    cy.get('[name="title"]').type('O Nome do Vento')
    cy.get('[name="author"]').type('Patrick Rothfuss')
    
    cy.contains('button', 'Adicionar').click()

    // Verifica se o modal fechou e o item aparece na listagem
    cy.contains('.wishlist-item-title', 'O Nome do Vento').should('be.visible')
    cy.contains('.wishlist-item-author', 'Patrick Rothfuss').should('be.visible')
  })

  it('Deve remover um livro da lista de desejos', () => {
    // 1. Cria um item primeiro
    cy.get('#btn-add-wish').click()
    cy.get('[name="title"]').type('Livro Desejado 123')
    cy.get('[name="author"]').type('Autor Teste')
    cy.contains('button', 'Adicionar').click()
    cy.contains('.wishlist-item-title', 'Livro Desejado 123').should('be.visible')

    // 2. Clica em remover
    cy.contains('.wishlist-item-title', 'Livro Desejado 123')
      .parents('.wishlist-item')
      .find('button[title="Remover"]')
      .click()

    // Confirma exclusão
    cy.on('window:confirm', () => true);

    // Verifica se sumiu
    cy.contains('.wishlist-item-title', 'Livro Desejado 123').should('not.exist')
  })
})
