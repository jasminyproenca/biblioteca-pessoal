'use strict';

const app = require('./app');
const env = require('./config/env');

app.listen(env.PORT, () => {
  console.log(`\n🚀 Servidor iniciado em http://localhost:${env.PORT}`);
  console.log(`📚 Swagger UI:  http://localhost:${env.PORT}/api/docs`);
  console.log(`🌐 Ambiente:    ${env.NODE_ENV}\n`);
});
