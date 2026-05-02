describe('Gestão de Livros', () => {
  beforeEach(() => {
    cy.login() // Loga e insere dados falsos antes de cada teste
    cy.visit('http://localhost:5173/books')
  })

  it('Deve criar um novo livro com sucesso', () => {
    cy.get('#btn-add-book').click()
    
    // Preenche o formulário
    cy.get('[name="title"]').type('O Senhor dos Anéis')
    cy.get('[name="author"]').type('J.R.R. Tolkien')
    cy.get('[name="status"]').select('lendo')
    cy.get('[name="rating"]').select('5')
    cy.get('[name="review"]').type('Um clássico da fantasia!')
    cy.get('[name="isFavorite"]').check()
    
    cy.contains('button', 'Adicionar Livro').click()

    // Verifica se o modal fechou e o livro aparece na listagem
    cy.contains('.book-card-title', 'O Senhor dos Anéis').should('be.visible')
    cy.contains('.book-card-author', 'J.R.R. Tolkien').should('be.visible')
    // Verifica badge de status e coração de favorito
    cy.contains('.badge', 'Lendo').should('be.visible')
    cy.contains('.book-favorite', '♥').should('be.visible')
  })

  it('Deve validar campos obrigatórios ao tentar criar livro sem dados', () => {
    cy.get('#btn-add-book').click()
    
    // Tenta salvar sem preencher nada
    cy.contains('button', 'Adicionar Livro').click()

    // Verifica mensagens de erro do react-hook-form
    cy.contains('.form-error', 'Título obrigatório').should('be.visible')
    cy.contains('.form-error', 'Autor obrigatório').should('be.visible')
  })

  it('Deve editar um livro existente', () => {
    // 1. Cria um livro primeiro
    cy.get('#btn-add-book').click()
    cy.get('[name="title"]').type('Livro para Editar')
    cy.get('[name="author"]').type('Autor Teste')
    cy.contains('button', 'Adicionar Livro').click()
    cy.contains('.book-card-title', 'Livro para Editar').should('be.visible')

    // 2. Clica em editar
    cy.contains('.book-card-title', 'Livro para Editar')
      .parents('.book-card')
      .find('button[title="Editar"]')
      .click()

    // 3. Altera os dados
    cy.get('[name="title"]').clear().type('Livro Editado')
    cy.get('[name="status"]').select('lido')
    cy.contains('button', 'Salvar Alterações').click()

    // 4. Verifica as alterações
    cy.contains('.book-card-title', 'Livro Editado').should('be.visible')
    cy.contains('.badge', 'Lido').should('be.visible')
  })

  it('Deve excluir um livro', () => {
    // Cria um livro
    cy.get('#btn-add-book').click()
    cy.get('[name="title"]').type('Livro para Excluir')
    cy.get('[name="author"]').type('Autor Teste')
    cy.contains('button', 'Adicionar Livro').click()
    cy.contains('.book-card-title', 'Livro para Excluir').should('be.visible')

    // Clica em excluir
    cy.contains('.book-card-title', 'Livro para Excluir')
      .parents('.book-card')
      .find('button[title="Remover"]')
      .click()

    // Confirma exclusão (o cypress aceita window.confirm por padrão, mas podemos forçar)
    cy.on('window:confirm', () => true);

    // Verifica se sumiu
    cy.contains('.book-card-title', 'Livro para Excluir').should('not.exist')
  })
})
