# AI Resilience OS - Arquitetura MCP

Este projeto fica dividido em duas camadas publicaveis:

1. **Frontend estatico**
   - Entrega a experiencia visual da demo.
   - Pode ir para Vercel, Netlify, Cloudflare Pages, S3/CloudFront ou qualquer hosting estatico.
   - Continua sem acessar dados reais por padrao.

2. **MCP Server**
   - Exponibiliza ferramentas para um host LLM chamar de forma controlada.
   - Roda localmente via stdio ou publicado via HTTP em `POST /mcp`.
   - Nesta versao, todas as respostas sao mockadas e seguras para demonstracao.

## Ferramentas MCP

### `analyze_company_health`

Entrada:

- `companyName`
- `companySize`
- `sector`
- `window`: `1H`, `24H`, `7D` ou `30D`
- `declaredPain`

Saida:

- score de saude;
- dores por setor;
- evidencias simuladas;
- pontos de melhoria;
- recomendacao executiva;
- aviso de seguranca.

### `list_realtime_signals`

Lista sinais 24/7 simulados:

- SLA violado;
- erro 500 recorrente;
- relatorio inconsistente;
- acesso privilegiado fora do horario;
- fluxo manual recorrente;
- baixa rastreabilidade.

### `generate_executive_report`

Gera devolutiva executiva com:

- score;
- dor declarada;
- top dores;
- plano de acao;
- dependencias de validacao e autorizacao.

### `get_mcp_architecture`

Explica a arquitetura recomendada para o piloto.

## Como rodar localmente

Frontend:

```bash
npm install
npm run dev
```

MCP via stdio:

```bash
npm run mcp:stdio
```

MCP via HTTP:

```bash
npm run mcp:http
```

Health check:

```bash
curl http://localhost:3333/health
```

Chamada JSON-RPC:

```bash
curl -X POST http://localhost:3333/mcp \
  -H "content-type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}"
```

## Publicacao

### Frontend

Build:

```bash
npm run build
```

Publicar a pasta `dist`.

### MCP Server

Publicar como servico Node.js:

```bash
node mcp/server.mjs --http
```

Para Render, existe um exemplo em `render.mcp.yaml`.

Variaveis recomendadas:

- `PORT`: porta do servico.
- `MCP_TRANSPORT=http`: forca modo HTTP.
- `ALLOW_ORIGIN`: dominio do frontend quando sair de demo aberta.

## Proximo passo para dados reais

Antes de qualquer conector real:

1. autorizacao formal;
2. escopo;
3. fora de escopo;
4. responsaveis;
5. criterio de interrupcao;
6. politica de privacidade;
7. trilha de auditoria.

Conectores futuros devem entrar como adapters separados:

- `adapters/logs`
- `adapters/itsm`
- `adapters/siem`
- `adapters/cmdb`
- `adapters/erp`
- `adapters/crm`
- `adapters/documents`

Nenhum adapter deve executar scan, scraping, pentest ou auditoria real sem autorizacao formal.
