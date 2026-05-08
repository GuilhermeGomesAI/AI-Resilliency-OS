#!/usr/bin/env node

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

loadEnvFile(resolve(process.cwd(), ".env"));
loadEnvFile(resolve(process.cwd(), "backend/.env"));

const config = {
  port: Number(process.env.PORT || 3001),
  llmProvider: (process.env.LLM_PROVIDER || "openai").toLowerCase(),
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-5.2",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  mcpUrl: process.env.MCP_URL || "http://localhost:3333/mcp",
  allowOrigin: process.env.ALLOW_ORIGIN || "*",
};

const systemPrompt = `
Voce e o AI Resilience OS, uma inteligencia artificial de diagnostico empresarial, auditoria continua e saude operacional.

Regras obrigatorias:
- Nao afirme dados reais sem evidencia validada.
- Diferencie dado declarado, sinal simulado, evidencia, hipotese e recomendacao.
- Nao sugerir scan, scraping, pentest, acesso invasivo ou auditoria real sem autorizacao formal.
- Toda recomendacao deve conter origem, impacto, responsavel sugerido, criterio de aceite, status e dependencia.
- Seja extremamente executivo, curto, claro e acionavel.
- Evite texto longo, generico ou consultivo.
- Para diagnostico em tempo real, preencha urgente, importante, curtoPrazo, medioPrazo, longoPrazo e riscoAntecipado com uma frase curta cada.
- Responda sempre em JSON valido.
`;

const diagnosisFormat = {
  headline: "string curta",
  score: "number",
  setor: "string",
  janela: "string",
  diagnostico: "string curta",
  urgente: "string curta",
  importante: "string curta",
  curtoPrazo: "string curta",
  medioPrazo: "string curta",
  longoPrazo: "string curta",
  riscoAntecipado: "string curta",
  dores: [{ nome: "string", severidade: "string", evidencia: "string", impacto: "string", status: "simulado|mockado - requer validacao humana" }],
  melhorias: [{
    origem: "string",
    impacto: "string",
    artefato: "string",
    acao: "string",
    responsavelSugerido: "string",
    criterioAceite: "string",
    status: "string",
    dependencia: "string"
  }],
  plano: [{
    fase: "Agora|7D|30D|90D",
    acao: "string curta",
    origem: "string",
    impacto: "string",
    artefato: "string",
    responsavelSugerido: "string",
    criterioAceite: "string",
    status: "string",
    dependencia: "string"
  }],
  notaSeguranca: "string curta",
};

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
  }
}

function jsonResponse(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": config.allowOrigin,
    "access-control-allow-headers": "content-type, authorization",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  if (!body.trim()) return {};
  return JSON.parse(body);
}

function sanitizeRequest(payload = {}) {
  return {
    companyName: String(payload.companyName || "Empresa demonstrativa").slice(0, 120),
    companySize: String(payload.companySize || "Empresa media").slice(0, 80),
    sector: String(payload.sector || "Tecnologia").slice(0, 120),
    window: ["1H", "24H", "7D", "30D"].includes(payload.window) ? payload.window : "24H",
    declaredPain: String(payload.declaredPain || "").slice(0, 1200),
    expectedOutcome: String(payload.expectedOutcome || "").slice(0, 1200),
  };
}

async function callMcpTool(name, args) {
  const response = await fetch(config.mcpUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  if (!response.ok) throw new Error(`MCP respondeu HTTP ${response.status}`);
  const rpc = await response.json();
  if (rpc.error) throw new Error(rpc.error.message || "Erro MCP");
  const text = rpc.result?.content?.[0]?.text || "{}";
  return JSON.parse(text);
}

async function callOpenAI({ request, mcpAnalysis, mcpSignals, mode }) {
  if (!config.openaiApiKey) {
    throw new Error("OPENAI_API_KEY nao configurada no backend.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.openaiApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.openaiModel,
      instructions: systemPrompt,
      input: [
        {
          role: "user",
          content: JSON.stringify({
            tarefa: mode === "report" ? "Gerar relatorio executivo final" : "Gerar diagnostico executivo em tempo real",
            contextoCliente: request,
            mcpAnalysis,
            mcpSignals,
            formatoObrigatorio: diagnosisFormat,
          }),
        },
      ],
      max_output_tokens: 950,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI respondeu HTTP ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const result = await response.json();
  const text = extractResponseText(result);
  return parseModelJson(text);
}

async function callGemini({ request, mcpAnalysis, mcpSignals, mode }) {
  if (!config.geminiApiKey) {
    throw new Error("GEMINI_API_KEY nao configurada no backend.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.geminiModel)}:generateContent?key=${encodeURIComponent(config.geminiApiKey)}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: JSON.stringify({
                  tarefa: mode === "report" ? "Gerar relatorio executivo final" : "Gerar diagnostico executivo em tempo real",
                  contextoCliente: request,
                  mcpAnalysis,
                  mcpSignals,
                  formatoObrigatorio: diagnosisFormat,
                }),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini respondeu HTTP ${response.status}: ${errorBody.slice(0, 500)}`);
  }

  const result = await response.json();
  const text = extractGeminiText(result);
  return parseModelJson(text);
}

function extractResponseText(result) {
  if (typeof result.output_text === "string") return result.output_text;
  const parts = [];
  for (const item of result.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) parts.push(content.text);
      if (content.type === "text" && content.text) parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function extractGeminiText(result) {
  const parts = result?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part.text || "").join("\n").trim();
}

function parseModelJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return {
      headline: "Diagnostico gerado",
      diagnostico: text,
      dores: [],
      melhorias: [],
      plano: [],
      notaSeguranca: "Resposta textual convertida porque o modelo nao retornou JSON puro.",
    };
  }
}

async function diagnose(payload, mode = "diagnose") {
  const request = sanitizeRequest(payload);
  const [mcpAnalysis, mcpSignals] = await Promise.all([
    callMcpTool("analyze_company_health", request),
    callMcpTool("list_realtime_signals", {
      companySize: request.companySize,
      window: request.window,
    }),
  ]);

  const ai =
    config.llmProvider === "gemini"
      ? await callGemini({ request, mcpAnalysis, mcpSignals, mode })
      : await callOpenAI({ request, mcpAnalysis, mcpSignals, mode });

  return {
    source: config.llmProvider === "gemini" ? "google-gemini-api" : "openai-responses-api",
    model: config.llmProvider === "gemini" ? config.geminiModel : config.openaiModel,
    request,
    mcp: {
      analysis: mcpAnalysis,
      signals: mcpSignals,
    },
    ai,
    safety: {
      apiKeyExposedToFrontend: false,
      realIntegrations: false,
      requiresHumanValidation: true,
      requiresFormalAuthorizationForRealData: true,
    },
  };
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      jsonResponse(res, 204, {});
      return;
    }

    if (req.method === "GET" && req.url === "/api/health") {
      jsonResponse(res, 200, {
        ok: true,
        service: "ai-resilience-os-backend",
        llmProvider: config.llmProvider,
        model: config.llmProvider === "gemini" ? config.geminiModel : config.openaiModel,
        mcpUrlConfigured: Boolean(config.mcpUrl),
        openaiKeyConfigured: Boolean(config.openaiApiKey),
        geminiKeyConfigured: Boolean(config.geminiApiKey),
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/diagnose") {
      const payload = await readJson(req);
      jsonResponse(res, 200, await diagnose(payload, "diagnose"));
      return;
    }

    if (req.method === "POST" && req.url === "/api/report") {
      const payload = await readJson(req);
      jsonResponse(res, 200, await diagnose(payload, "report"));
      return;
    }

    jsonResponse(res, 404, { error: "Rota nao encontrada. Use GET /api/health, POST /api/diagnose ou POST /api/report." });
  } catch (error) {
    jsonResponse(res, 500, {
      error: "Falha ao processar diagnostico.",
      message: error.message,
    });
  }
});

server.listen(config.port, () => {
  console.log(`AI Resilience OS backend listening on http://localhost:${config.port}`);
});
