# 📊 Testes de Performance com k6

Este diretório contém todos os testes de performance para a API de Gerenciamento de Biblioteca Pessoal.

## 🏗️ Estrutura

```
performance/
├── k6.config.js              # Configurações globais
├── common/                    # Utilitários compartilhados
│   ├── helpers.js             # Funções auxiliares (requisições, validações, etc)
│   ├── thresholds.js          # Limites de performance (SLOs)
│   └── fixtures.js            # Dados de teste reutilizáveis
├── scenarios/                 # Fluxos de teste por módulo
│   ├── auth.scenario.js       # Testes de autenticação
│   ├── books.scenario.js      # Testes de livros
│   ├── users.scenario.js      # Testes de usuários
│   └── wishlist.scenario.js   # Testes de wishlist
├── load-tests/                # Testes de carga específicos
│   ├── smoke-test.js          # Validação rápida (2 VUs, 30s)
│   ├── load-test.js           # Carga normal (ramp-up/down, 9m)
│   ├── stress-test.js         # Stress test (até encontrar limite)
│   └── soak-test.js           # Soak test (longa duração)
└── reports/                   # Relatórios gerados (gitignore)
```

## 🚀 Como Executar

### ⚡ Smoke Test (Validação rápida)
Verifica se a API está respondendo corretamente. Ideal para CI/CD.

```bash
npm run perf:smoke
```

**Perfil:** 2 VUs × 30 segundos

---

### 📈 Load Test (Carga normal)
Simula a carga típica esperada em produção.

```bash
npm run perf:load
```

**Perfil:**
- Ramp-up: 0 → 50 VUs em 2 min
- Sustentação: 50 VUs por 5 min
- Ramp-down: 50 → 0 VUs em 2 min
- **Duração total:** ~9 minutos

---

### 💥 Stress Test (Teste de limite)
Encontra o ponto de falha do sistema, aumentando gradualmente a carga.

```bash
npm run perf:stress
```

**Perfil:**
- Ramp-up: 0 → 100 VUs em 2 min
- Ramp-up: 100 → 200 VUs em 3 min
- Sustentação: 200 VUs por 2 min
- Ramp-down: 200 → 0 VUs em 2 min
- **Duração total:** ~9 minutos

---

### 🔄 Soak Test (Teste de longa duração)
Detecta memory leaks e problemas que aparecem após tempo prolongado.

```bash
npm run perf:soak
```

**Perfil (padrão):**
- Ramp-up: 0 → 30 VUs em 1 min
- Sustentação: 30 VUs por 10 min
- Ramp-down: 30 → 0 VUs em 1 min
- **Duração total:** ~12 minutos

**Aumentar duração:**
```bash
k6 run performance/load-tests/soak-test.js --duration 1h
```

---

## 📋 Critérios de Sucesso (Thresholds)

| Métrica | Padrão | Stress | Soak |
|---------|--------|--------|------|
| Taxa de erro | < 1% | < 5% | < 1% |
| P95 latência | < 500ms | < 2s | < 500ms |
| P99 latência | < 1s | - | - |

---

## 🔧 Variáveis de Ambiente

```bash
# Alterar URL base
k6 run performance/load-tests/load-test.js --vus 10 --duration 30s

# Aumentar número de VUs
k6 run performance/load-tests/load-test.js --vus 100 --duration 5m

# Mudar intervalo de sleep entre requisições
SLEEP_DURATION=2 k6 run performance/load-tests/load-test.js
```

---

## 📊 Interpretar Resultados

### ✅ Teste Passou
- Taxa de erro: 0% - 1%
- P95 latência: Dentro do threshold
- HTTP requests: Sucesso
- Iterações: Completadas

### ⚠️ Teste com Aviso
- Taxa de erro: 1% - 5%
- Latência: Acima do esperado
- Alguns timeouts
- Investigar causa raiz

### ❌ Teste Falhou
- Taxa de erro: > 5%
- Latência: Muito acima do threshold
- Muitos timeouts
- Investigar infraestrutura/código

---

## 💡 Exemplos Práticos

### Teste rápido local
```bash
npm run perf:smoke
```

### Teste de carga antes de deploy
```bash
npm run perf:load
```

### Teste de limite em staging
```bash
npm run perf:stress
```

### Monitorar estabilidade (overnight)
```bash
k6 run performance/load-tests/soak-test.js --duration 8h
```

### Teste customizado (50 VUs por 10 min)
```bash
k6 run performance/load-tests/load-test.js --vus 50 --duration 10m
```

---

## 📚 Referências

- [k6 Documentation](https://k6.io/docs/)
- [Best Practices](https://k6.io/docs/using-k6/best-practices/)
- [HTTP API](https://k6.io/docs/javascript-api/k6-http/)

---

## 🐛 Troubleshooting

### "Connection refused"
- Certifique-se que o servidor está rodando: `npm run dev`
- Verifique se está na porta 3000

### "Permission denied"
- Se rodar com Docker: `docker run -v \`pwd\`:/scripts grafana/k6 run /scripts/performance/load-tests/smoke-test.js`

### Memory leak no teste
- Execute soak-test por mais tempo para confirmar
- Analise logs do servidor durante soak-test

