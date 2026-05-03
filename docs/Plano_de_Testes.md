# Plano de Testes
**Projeto:** Gestão de Biblioteca Pessoal
**Data:** Maio / 2026

## 1. Introdução
Este Plano de Testes (Test Plan) descreve o escopo, a abordagem e os recursos necessários para realizar os testes de software no projeto **Gestão de Biblioteca**. O objetivo principal é garantir a qualidade da API (Backend) e da aplicação Web (Frontend), priorizando o esforço de testes conforme o risco das funcionalidades.

## 2. Escopo dos Testes
**O que será testado:**
- Funcionalidades de Autenticação (Login, Registro, validação de JWT).
- Gestão de Livros (Criação, edição, listagem e exclusão).
- Perfil de Usuário.
- Lista de Desejos (Wishlist).
- Performance sob carga (k6).
- End-to-End da interface web (Cypress).

**O que NÃO será testado neste momento:**
- Integrações com sistemas externos ou APIs de terceiros (não implementados).
- Segurança de infraestrutura (servidores, redes).

---

## 3. Análise de Riscos (Abordagem PRISMA)
A estratégia de priorização de testes utilizará a abordagem **PRISMA** (*Product RISk MAnagement*). O esforço de teste será direcionado às áreas do software que representam o maior risco para o negócio.

### 3.1 Matriz de Risco PRISMA
| Funcionalidade / Módulo | Impacto no Negócio (1-3) | Probabilidade de Falha (1-3) | Nível de Risco | Quadrante PRISMA |
| :--- | :---: | :---: | :---: | :--- |
| **Autenticação (Login e JWT)** | 3 (Alto) | 2 (Médio) | **6 (ALTO)** | **Prioridade Máxima** |
| **Criação/Edição de Livros** | 3 (Alto) | 3 (Alto) | **9 (CRÍTICO)** | **Prioridade Máxima** |
| **Listagem e Busca de Livros** | 2 (Médio) | 2 (Médio) | **4 (MÉDIO)** | Prioridade Normal |
| **Lista de Desejos (Wishlist)** | 1 (Baixo) | 2 (Médio) | **2 (BAIXO)** | Baixa Prioridade |
| **Gestão do Perfil de Usuário** | 2 (Médio) | 1 (Baixo) | **2 (BAIXO)** | Baixa Prioridade |
| **Performance sob Carga (k6)** | 3 (Alto) | 2 (Médio) | **6 (ALTO)** | **Prioridade Máxima** |

### 3.2 Estratégia Baseada na Matriz
- **🔴 Crítico / Alto (Nota 6 a 9):** Foco de 70% do tempo. Testes de API exaustivos para todas as validações (título, autor, campos). Testes E2E simulando todos os cenários de erro do usuário.
- **🟡 Médio (Nota 3 a 4):** Foco de 20% do tempo. Testes focados no "Caminho Feliz" (Happy Path) e testes de integração principais.
- **🟢 Baixo (Nota 1 a 2):** Foco de 10% do tempo. Testes exploratórios pontuais e testes unitários básicos.

---

## 4. Ambientes de Teste
- **Desenvolvimento Local:** Execução de testes unitários e de API localmente pelos desenvolvedores antes do PR.
- **Ambiente E2E (Cypress):** Interface Web apontando para a base de dados de teste (Backend-for-Frontend mockado ou ambiente local isolado).
- **Ambiente de Performance:** Servidor isolado executando scripts do k6 (Load, Stress e Soak tests).

## 5. Critérios de Conclusão (Exit Criteria)
- 100% dos cenários classificados como "Críticos/Altos" na matriz PRISMA testados e aprovados.
- Relatórios de Performance (k6) gerados e dentro dos *thresholds* definidos.
- Nenhuma falha de quebra de segurança no fluxo de Autenticação.
