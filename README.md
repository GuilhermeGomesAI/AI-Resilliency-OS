# AI Resilience OS Demo

Demo funcional do whitepaper **Resiliencia na Era da IA**, com visual executivo inspirado em ferramentas como Jira e Jira Service Management.

O app mostra como o AI Resilience OS transforma dores internas, cenarios macro e auditoria simulada em score de resiliencia, plano executavel, backlog, prompt Codex, log de auditoria, relatorio executivo e proposta de piloto.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Dados mockados
- Backend orquestrador opcional para OpenAI ou Gemini
- MCP Server demonstrativo para tools de diagnostico

## Como rodar

Manual completo de execucao local: `docs/manual-local.md`.

### Opção sem instalação

Abra `demo.html` diretamente no navegador. Essa versão standalone existe para apresentações quando o npm ou a rede estiverem indisponíveis.

### Opção React/Vite

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
```

Servidor MCP local via stdio:

```bash
npm run mcp:stdio
```

Servidor MCP local via HTTP:

```bash
npm run mcp:http
```

Backend orquestrador com OpenAI ou Gemini:

```bash
npm run backend
```

Endpoint HTTP:

```text
POST http://localhost:3333/mcp
GET  http://localhost:3333/health
POST http://localhost:3001/api/diagnose
POST http://localhost:3001/api/report
```

## Arquitetura MCP

A demo esta preparada para ir ao ar em duas camadas:

1. **Frontend estatico**: publicado em Vercel, Netlify, Cloudflare Pages, S3/CloudFront ou hosting equivalente.
2. **MCP Server**: servico Node.js separado, com tools mockadas para analise de saude, sinais 24/7, relatorio executivo e explicacao da arquitetura.

Documentacao completa: `docs/mcp-architecture.md`.

Tools disponiveis:

- `analyze_company_health`
- `list_realtime_signals`
- `generate_executive_report`
- `get_mcp_architecture`

Integracao LLM:

- Backend em `backend/server.mjs`.
- Variaveis em `backend/.env.example`.
- Documentacao em `docs/llm-integration.md`.
- A chave do provedor nunca deve ficar no frontend, GitHub, prints ou arquivos versionados.

Publicacao sugerida:

- Frontend: `npm run build` e publicar `dist`.
- MCP: `node mcp/server.mjs --http` em Render, Fly.io, Railway, Azure App Service ou container privado.

## Fluxo da demo

1. Home
2. Mapa de Dores
3. Resultado do Mapa de Dores
4. Stress Test Macro
5. Auditoria Simulada
6. Motor de Correlacao
7. Resilience Score
8. Plano Executavel
9. Backlog
10. Codex Execution Lab
11. Log de Auditoria
12. Relatorio Executivo
13. CTA de Piloto

## Roteiro de 5 minutos

Minuto 1: apresentar a tese e a Home.

Minuto 2: clicar em **Usar cenario demonstrativo Sankhya** e mostrar o Mapa de Dores.

Minuto 3: mostrar o Stress Test Macro e a Auditoria Simulada, reforcando que tudo e mockado.

Minuto 4: mostrar o Motor de Correlacao e o Resilience Score.

Minuto 5: mostrar Plano, Backlog, Codex Lab, Relatorio Executivo e CTA do piloto.


## Regras de seguranca

- Toda auditoria real depende de autorizacao formal.
- Toda recomendacao critica depende de validacao humana.
- Toda saida deve separar dor declarada, hipotese, cenario macro, achado simulado e recomendacao.
- Nenhuma vulnerabilidade deve ser afirmada como real sem evidencia validada.

## Estrutura

```text
src/components      componentes ficam embutidos em App.tsx nesta v1
src/data            dados mockados
src/lib             logica deterministica
src/types           tipos principais
docs                documentacao da demo
```
