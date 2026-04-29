/**
 * Dados de teste reutilizáveis para os testes de performance
 */

export const testUsers = [
  {
    username: 'user_perf_1',
    email: null, // Será gerado dinamicamente
    name: 'User Performance Test 1',
    password: 'SecurePassword@123',
  },
  {
    username: 'user_perf_2',
    email: null, // Será gerado dinamicamente
    name: 'User Performance Test 2',
    password: 'SecurePassword@123',
  },
  {
    username: 'user_perf_3',
    email: null, // Será gerado dinamicamente
    name: 'User Performance Test 3',
    password: 'SecurePassword@123',
  },
];

export const testBooks = [
  {
    title: 'Performance Testing with k6',
    author: 'Performance Team',
    status: 'quero ler',
    rating: 5,
  },
  {
    title: 'Load Testing Fundamentals',
    author: 'Test Author',
    status: 'lendo',
    rating: 4,
  },
  {
    title: 'API Testing Best Practices',
    author: 'API Team',
    status: 'lido',
    isFavorite: true,
  },
];

export function getRandomUser() {
  const userBase = testUsers[Math.floor(Math.random() * testUsers.length)];
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  
  // Gera username, email, e name únicos para evitar conflitos
  return {
    name: `${userBase.name} ${timestamp}`,
    username: `${userBase.username}_${timestamp}_${random}`.substring(0, 30), // Limita a 30 chars
    email: `${userBase.username}_${timestamp}_${random}@test.com`,
    password: userBase.password,
  };
}

export function getRandomBook() {
  return testBooks[Math.floor(Math.random() * testBooks.length)];
}
