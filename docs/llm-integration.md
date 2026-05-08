# Integracao LLM

Esta camada conecta o AI Resilience OS ao LLM sem expor chaves no frontend.

## Arquitetura

```text
Frontend demo.html
  ->
Backend Orquestrador /api/diagnose
  ->
LLM Provider (OpenAI ou Gemini)
  ->
MCP Server /mcp
  ->
Tools mockadas: saude, logs, relatorio, evidencias
```

## Seguranca

- A chave do provedor fica somente no backend.
- O frontend chama apenas `/api/diagnose` ou `/api/report`.
- O backend nunca retorna a chave.
- `.env` e `backend/.env` ficam no `.gitignore`.
- Dados reais continuam fora do escopo da demo.
- Toda analise critica exige validacao humana e autorizacao formal.

## Importante

Se uma chave foi compartilhada em chat, print, GitHub, video ou qualquer ambiente nao controlado, trate como comprometida:

1. revogue a chave;
2. gere uma chave nova;
3. coloque a nova apenas em `backend/.env` ou em variavel segura do provedor cloud.

## Configuracao local

Crie `backend/.env` com um dos modos abaixo.

### Gemini

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
MCP_URL=http://localhost:3333/mcp
PORT=3001
ALLOW_ORIGIN=http://127.0.0.1:5173
```

### OpenAI

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.2
MCP_URL=http://localhost:3333/mcp
PORT=3001
ALLOW_ORIGIN=http://127.0.0.1:5173
```

## Rodar localmente

Terminal 1:

```bash
npm run mcp:http
```

Terminal 2:

```bash
npm run backend
```

Terminal 3:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

## Teste

Health:

```bash
curl http://localhost:3001/api/health
```

Diagnostico:

```bash
curl -X POST http://localhost:3001/api/diagnose \
  -H "content-type: application/json" \
  -d "{\"companyName\":\"Empresa Demo\",\"companySize\":\"Empresa media\",\"sector\":\"Tecnologia\",\"window\":\"24H\",\"declaredPain\":\"falhas recorrentes\"}"
```
