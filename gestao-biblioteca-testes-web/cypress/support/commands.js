Cypress.Commands.add('login', (
  username = 'testuser',
  password = 'testpassword',
  name = 'Test User',
  email = 'testuser@email.com'
) => {
  // 1. Cadastra o usuário na API (ignora erro se já existir)
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/auth/register',
    failOnStatusCode: false,
    body: { name, username, email, password }
  }).then(() => {
    // 2. Faz login na API para pegar o token
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      body: { login: username, password }
    }).then((response) => {
      // 3. Salva no localStorage para simular o estado de autenticado no Zustand
      window.localStorage.setItem('token', response.body.data.token);
      window.localStorage.setItem('user', JSON.stringify(response.body.data.user));
    });
  });
});