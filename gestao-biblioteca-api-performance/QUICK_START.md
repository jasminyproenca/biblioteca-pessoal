# 🎯 Guia Rápido - Testes de Performance

## ✅ Estrutura Criada

```
performance/
├── README.md                 # 📖 Documentação completa
├── INSTALL.md               # 🔧 Guia de instalação do k6
├── .gitignore               # 🚫 Ignora relatórios gerados
├── k6.config.js             # ⚙️ Configurações globais
│
├── common/                  # 🔌 Código reutilizável
│   ├── helpers.js           # Funções auxiliares
│   ├── thresholds.js        # Limites (SLOs)
│   └── fixtures.js          # Dados de teste
│
├── scenarios/               # 📋 Fluxos de teste
│   ├── auth.scenario.js     # Autenticação
│   ├── books.scenario.js    # Livros
│   ├── users.scenario.js    # Usuários
│   └── wishlist.scenario.js # Wishlist
│
├── load-tests/              # 📊 Testes de carga
│   ├── smoke-test.js        # ⚡ 30s, 2 VUs
│   ├── load-test.js         # 📈 9min, ramp-up/down
│   ├── stress-test.js       # 💥 9min, até limite
│   └── soak-test.js         # 🔄 10-60+ min, longa duração
│
└── reports/                 # 📑 Relatórios (gerado)
```

## 🚀 Primeiros Passos

### 1. Instalar k6
```powershell
choco install k6           # Windows com Chocolatey
# ou
brew install k6            # macOS
```

Consulte [INSTALL.md](./INSTALL.md) para mais opções.

### 2. Verificar Instalação
```bash
k6 --version
```

### 3. Iniciar servidor
```bash
npm run dev    # em outro terminal
```

### 4. Executar primeiro teste
```bash
npm run perf:smoke    # Smoke test - validação rápida (30s)
```

## 📊 Tipos de Teste

| Teste | Uso | Duração | VUs | Comando |
|-------|-----|---------|-----|---------|
| **Smoke** | CI/CD, validação | 30s | 2 | `npm run perf:smoke` |
| **Load** | Antes de deploy | ~9min | 50 | `npm run perf:load` |
| **Stress** | Encontrar limites | ~9min | 200 | `npm run perf:stress` |
| **Soak** | Memory leaks | 10-60min | 30 | `npm run perf:soak` |

## 💡 Exemplos Rápidos

### Entender a estrutura
```bash
# Ver configuração de thresholds
cat performance/common/thresholds.js

# Ver um cenário
cat performance/scenarios/auth.scenario.js

# Ver um teste completo
cat performance/load-tests/smoke-test.js
```

### Customizar execução
```bash
# Aumentar VUs para load test
k6 run performance/load-tests/load-test.js --vus 100 --duration 5m

# Executar com output detalhado
k6 run performance/load-tests/smoke-test.js -v

# Salvar resultado em JSON
k6 run performance/load-tests/load-test.js -o json=performance/reports/load-test.json
```

## 📈 Interpretar Resultados

```
     ✓ [GET /api/books] - Success
     ✓ Response time OK (< 500ms)
     ✗ Auth failed [http_req_failed]
       
checks ........................: 95.23% ✓ 4010 ✗ 199
http_req_duration ..............: avg=245ms p(95)=412ms p(99)=623ms
http_req_failed ................: 4.77% ✓ 19 ✗ 380
iteration_duration .............: avg=5.2s
iterations ......................: 399 in 2m9s
```

**O que significa:**
- ✓ Checks: 95% dos validações passaram
- avg=245ms: Latência média de 245ms
- p(95)=412ms: 95% das requisições responderam em até 412ms
- http_req_failed: 4.77% de erro (acima de 1% é ruim)

## 🔗 Links Úteis

- [Documentação k6](https://k6.io/docs/)
- [Best Practices](https://k6.io/docs/using-k6/best-practices/)
- [Thresholds](https://k6.io/docs/using-k6/thresholds/)

## ❓ Dúvidas Comuns

**P: Preciso de credenciais para rodar os testes?**
R: Não! Os testes criam usuários e dados de teste automaticamente (fixtures).

**P: Posso rodar durante produção?**
R: Smoke test sim. Load/Stress/Soak não - use em staging.

**P: O servidor vai derrubar?**
R: Stress test pode. É propositalmente para encontrar limites. Use em ambiente de teste.

**P: Quanto tempo leva?**
- Smoke: 30s
- Load: 9 min
- Stress: 9 min
- Soak: mínimo 10 min (configure conforme necessário)

---

## 🎉 Tudo pronto!

Você agora tem uma estrutura profissional de testes de performance!

👉 **Próximo passo:** `npm run perf:smoke`
