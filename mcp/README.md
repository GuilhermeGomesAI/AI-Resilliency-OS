# AI Resilience OS MCP Server

Servidor MCP demonstrativo para conectar um host LLM ao AI Resilience OS.

Esta versao usa apenas dados mockados e expoe quatro ferramentas:

- `analyze_company_health`
- `list_realtime_signals`
- `generate_executive_report`
- `get_mcp_architecture`

## Rodar via stdio

```bash
npm run mcp:stdio
```

## Rodar via HTTP

```bash
npm run mcp:http
```

Endpoint:

```text
POST http://localhost:3333/mcp
GET  http://localhost:3333/health
```

## Exemplo de chamada

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "analyze_company_health",
    "arguments": {
      "companyName": "Empresa demonstrativa",
      "companySize": "Empresa media",
      "sector": "Tecnologia",
      "window": "24H",
      "declaredPain": "falhas recorrentes em sistemas criticos"
    }
  }
}
```

## Regras

- Nao usa dados reais.
- Nao conecta em sistemas reais.
- Nao executa scan, scraping, pentest ou auditoria real.
- Toda saida critica permanece mockada e dependente de validacao humana.
