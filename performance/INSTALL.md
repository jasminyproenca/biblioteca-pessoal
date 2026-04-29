# ⚙️ Instalação do k6

## Windows

### Opção 1: Chocolatey (recomendado)
```powershell
choco install k6
```

### Opção 2: Scoop
```powershell
scoop install k6
```

### Opção 3: Download direto
1. Acesse https://github.com/grafana/k6/releases
2. Baixe o instalador `.msi` para Windows
3. Execute o instalador

### Verificar instalação
```powershell
k6 --version
```

---

## macOS

### Opção 1: Homebrew
```bash
brew install k6
```

### Opção 2: Manual
```bash
curl https://dl.k6.io/releases/v0.47.0/k6-v0.47.0-macos-amd64.zip -O
unzip k6-v0.47.0-macos-amd64.zip
sudo mv k6 /usr/local/bin/
```

---

## Linux (Ubuntu/Debian)

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3232A
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

---

## Docker (Qualquer OS)

```bash
# Smoke Test
docker run -v $(pwd):/scripts grafana/k6 run /scripts/performance/load-tests/smoke-test.js

# Load Test
docker run -v $(pwd):/scripts grafana/k6 run /scripts/performance/load-tests/load-test.js

# Com output JSON
docker run -v $(pwd):/scripts grafana/k6 run /scripts/performance/load-tests/load-test.js -o json=reports/load-test.json
```

---

## Verificar Instalação

```bash
k6 --version
# Esperado: k6 v0.47.0 ou superior
```

Se receber "command not found", reinicie o terminal ou adicione k6 ao PATH manualmente.

---

## Próximos Passos

1. ✅ Instalar k6
2. ✅ Verificar instalação
3. ▶️ Executar: `npm run perf:smoke`
4. 📊 Analisar resultados
