#!/usr/bin/env node

import { createServer } from "node:http";

const serverInfo = {
  name: "ai-resilience-os-mcp",
  version: "0.1.0",
};

const companyProfiles = {
  "Micro / Pequena empresa": {
    sectors: ["Vendas", "Atendimento", "Financeiro", "Operacao", "Marketing", "Tecnologia", "Contabilidade", "Juridico"],
    baseline: 58,
    focus: "controle basico, previsibilidade e reducao de dependencia do dono",
  },
  "Pequena empresa em crescimento": {
    sectors: ["Vendas", "Marketing", "Financeiro", "Atendimento", "Operacoes", "RH", "Tecnologia", "Seguranca"],
    baseline: 62,
    focus: "padronizacao, SLA, governanca inicial e dashboards confiaveis",
  },
  "Empresa media": {
    sectors: ["Comercial", "Marketing", "Produto", "Tecnologia", "Operacoes", "Financeiro", "RH", "Atendimento", "Compras", "Dados/BI", "Compliance basico", "Seguranca da Informacao"],
    baseline: 66,
    focus: "ownership por area, observabilidade, integracao e maturidade operacional",
  },
  "Empresa grande": {
    sectors: ["Diretorias", "Produto", "Engenharia/TI", "Operacoes", "Financeiro/controladoria", "Juridico", "RH estrategico", "Atendimento N1/N2/N3", "Compras/procurement", "Dados/BI", "Seguranca da Informacao", "Compliance", "Riscos", "Auditoria interna"],
    baseline: 71,
    focus: "correlacao de logs, risco corporativo, auditoria e visao executiva",
  },
  "Enterprise / Empresa regulada": {
    sectors: ["Governanca corporativa", "Unidades de negocio", "Tecnologia critica", "SOC", "CSIRT", "IAM", "GRC", "AppSec", "CloudSec", "Privacidade/LGPD", "Continuidade", "Auditoria interna", "Compliance regulatorio", "Gestao de terceiros", "Dados e IA"],
    baseline: 76,
    focus: "resiliencia regulatoria, continuidade, evidencias automaticas e risco tecnologico",
  },
};

const mockSignals = [
  { type: "SLA violado", sector: "Atendimento", severity: "alta", evidence: "12 chamados reabertos na janela selecionada" },
  { type: "Erro 500 recorrente", sector: "Tecnologia", severity: "critica", evidence: "pico de falhas em sistema critico" },
  { type: "Relatorio inconsistente", sector: "Financeiro", severity: "alta", evidence: "diferenca entre ERP e planilha de fechamento" },
  { type: "Acesso privilegiado fora do horario", sector: "Seguranca da Informacao", severity: "alta", evidence: "evento IAM fora da janela operacional" },
  { type: "Fluxo manual recorrente", sector: "Operacoes", severity: "media", evidence: "alto volume de atividades sem owner definido" },
  { type: "Baixa rastreabilidade", sector: "Compliance", severity: "alta", evidence: "decisoes sem log unico de aprovacao" },
];

const tools = [
  {
    name: "analyze_company_health",
    description: "Analisa a saude empresarial com dados mockados, respeitando porte, setor e janela de tempo.",
    inputSchema: {
      type: "object",
      properties: {
        companyName: { type: "string" },
        companySize: { type: "string", enum: Object.keys(companyProfiles) },
        sector: { type: "string" },
        window: { type: "string", enum: ["1H", "24H", "7D", "30D"] },
        declaredPain: { type: "string" },
      },
      required: ["companySize"],
    },
  },
  {
    name: "list_realtime_signals",
    description: "Lista sinais 24/7 simulados para demonstrar logs, evidencias e dores por setor.",
    inputSchema: {
      type: "object",
      properties: {
        companySize: { type: "string", enum: Object.keys(companyProfiles) },
        window: { type: "string", enum: ["1H", "24H", "7D", "30D"] },
      },
      required: ["companySize"],
    },
  },
  {
    name: "generate_executive_report",
    description: "Gera uma devolutiva executiva mockada com score, dores, evidencias e plano de acao.",
    inputSchema: {
      type: "object",
      properties: {
        companyName: { type: "string" },
        companySize: { type: "string", enum: Object.keys(companyProfiles) },
        declaredPain: { type: "string" },
        expectedOutcome: { type: "string" },
      },
      required: ["companySize"],
    },
  },
  {
    name: "get_mcp_architecture",
    description: "Explica a arquitetura MCP recomendada para publicar a demo sem integracoes reais.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

function profileFor(size) {
  return companyProfiles[size] || companyProfiles["Empresa media"];
}

function windowFactor(window = "24H") {
  return { "1H": 0.35, "24H": 1, "7D": 2.4, "30D": 4.2 }[window] || 1;
}

function severityPenalty(severity) {
  return { critica: 16, alta: 11, media: 6, baixa: 2 }[severity] || 4;
}

function analyzeCompanyHealth(args = {}) {
  const size = args.companySize || "Empresa media";
  const profile = profileFor(size);
  const selectedSector = args.sector || profile.sectors[0];
  const factor = windowFactor(args.window);
  const sectorSignals = mockSignals.filter((signal) => signal.sector === selectedSector || selectedSector.includes(signal.sector) || signal.sector.includes(selectedSector));
  const signals = sectorSignals.length ? sectorSignals : mockSignals.slice(0, 3);
  const penalty = Math.round(signals.reduce((sum, signal) => sum + severityPenalty(signal.severity), 0) * Math.min(factor, 2.2) / signals.length);
  const score = Math.max(22, Math.min(94, profile.baseline - penalty + Math.round(profile.sectors.length / 3)));
  const critical = signals.filter((signal) => ["critica", "alta"].includes(signal.severity));

  return {
    companyName: args.companyName || "Empresa demonstrativa",
    companySize: size,
    sector: selectedSector,
    window: args.window || "24H",
    healthScore: score,
    profileFocus: profile.focus,
    painPoints: signals.map((signal) => ({
      name: signal.type,
      sector: signal.sector,
      severity: signal.severity,
      evidence: signal.evidence,
      status: "mockado - requer validacao humana",
    })),
    improvementPoints: [
      "Centralizar evidencias e logs por setor",
      "Definir owner e criterio de aceite para cada dor critica",
      "Priorizar automacao apenas apos validacao humana",
      "Gerar plano 30/60/90 com responsaveis sugeridos",
    ],
    recommendation: {
      origem: "analise mockada do MCP",
      impacto: critical.length ? "reduz risco operacional priorizando sinais criticos e altos" : "mantem previsibilidade e amadurece indicadores por setor",
      artefato: "plano de acao executivo com evidencias simuladas",
      acao: critical.length
        ? "Priorizar sinais criticos e altos, validar evidencias e abrir plano com responsaveis."
        : "Manter monitoramento e amadurecer indicadores por setor.",
      responsavelSugerido: "lider da area avaliada",
      criterioAceite: "dor, origem, impacto, owner, status e dependencia registrados",
      status: "simulado - requer validacao humana",
      dependencia: "validacao humana e autorizacao formal para qualquer dado real",
    },
    safety: "Sem acesso real, sem auditoria real, sem pentest, sem scan e sem dados reais.",
  };
}

function listRealtimeSignals(args = {}) {
  const profile = profileFor(args.companySize || "Empresa media");
  const factor = windowFactor(args.window);
  return {
    window: args.window || "24H",
    companySize: args.companySize || "Empresa media",
    sectors: profile.sectors,
    signals: mockSignals.map((signal, index) => ({
      ...signal,
      events: Math.max(1, Math.round((index + 2) * 9 * factor)),
      timestamp: new Date(Date.now() - index * 3600000).toISOString(),
      status: "simulado",
      recommendation: recommendationFor(signal.type),
    })),
    notice: "Sinais simulados para demonstracao. Nao representam ambiente real.",
  };
}

function recommendationFor(type) {
  const action = (() => {
    if (type.includes("SLA")) return "Revisar triagem, capacidade e automacao de atendimento.";
    if (type.includes("Erro 500")) return "Correlacionar aplicacao, infraestrutura e dependencias.";
    if (type.includes("Relatorio")) return "Integrar fonte oficial e automatizar conciliacao.";
    if (type.includes("Acesso")) return "Revisar IAM, MFA e trilha de auditoria.";
    if (type.includes("manual")) return "Mapear fluxo, owner, criterio de aceite e automacao segura.";
    return "Criar log unico de decisao e evidencias.";
  })();

  return {
    origem: `sinal simulado: ${type}`,
    impacto: "reduz recorrencia, atraso e risco de decisao sem evidencia",
    artefato: "item de backlog com evidencia simulada e criterio de aceite",
    acao: action,
    responsavelSugerido: "owner da fila operacional",
    criterioAceite: "sinal validado, owner definido e proxima acao registrada",
    status: "simulado",
    dependencia: "validacao humana; autorizacao formal para qualquer coleta real",
  };
}

function generateExecutiveReport(args = {}) {
  const analysis = analyzeCompanyHealth(args);
  return {
    title: `Relatorio executivo - ${analysis.companyName}`,
    summary: `Score ${analysis.healthScore}/100 para ${analysis.companySize}. Foco: ${analysis.profileFocus}.`,
    declaredPain: args.declaredPain || "dor ainda nao declarada",
    expectedOutcome: args.expectedOutcome || "melhorar rastreabilidade, priorizacao e execucao",
    topPainPoints: analysis.painPoints.slice(0, 3),
    actionPlan: [
      {
        phase: "Agora",
        origem: "dor declarada e achados simulados",
        impacto: "reduz ambiguidade executiva",
        artefato: "registro de dor, impacto e evidencia minima",
        action: "Validar dor, origem e evidencia minima.",
        responsavelSugerido: "sponsor executivo e owner da area",
        acceptance: "dor, impacto, owner e status registrados",
        status: "a validar",
        dependencia: "validacao humana",
      },
      {
        phase: "7D",
        origem: "sinais simulados priorizados",
        impacto: "melhora foco operacional",
        artefato: "mapa de evidencias e priorizacao",
        action: "Criar mapa de evidencias e priorizacao.",
        responsavelSugerido: "PMO ou lider operacional",
        acceptance: "top riscos classificados por impacto e urgencia",
        status: "planejado",
        dependencia: "escopo definido",
      },
      {
        phase: "30D",
        origem: "plano aprovado pela lideranca",
        impacto: "transforma diagnostico em execucao auditavel",
        artefato: "plano 30 dias com score revisado",
        action: "Executar melhorias aprovadas e medir score.",
        responsavelSugerido: "lideranca das areas envolvidas",
        acceptance: "plano revisado por lideranca e responsaveis",
        status: "depende de aprovacao",
        dependencia: "autorizacao formal para dados reais, se houver",
      },
    ],
    dependencies: ["validacao humana", "autorizacao formal para dados reais", "escopo definido"],
    safety: analysis.safety,
  };
}

function getMcpArchitecture() {
  return {
    name: "AI Resilience OS - MCP Architecture",
    layers: [
      "Frontend estatico: dashboard, login demo, intake, graficos e relatorio visual.",
      "MCP Server: ferramentas de diagnostico, sinais 24/7, relatorio e arquitetura.",
      "Data adapters futuros: uploads, CSV/JSON/PDF, SIEM, ITSM, CMDB, ERP, CRM e observabilidade.",
      "LLM host: cliente MCP que chama tools e transforma evidencias em recomendacoes revisaveis.",
    ],
    deployment: {
      frontend: "Vercel, Netlify, Cloudflare Pages ou S3/CloudFront.",
      mcp: "Render, Fly.io, Railway, Azure App Service ou container privado.",
      transport: "stdio para uso local; HTTP para publicar endpoint /mcp.",
    },
    safety: [
      "Dados mockados por padrao.",
      "Sem scan, scraping, pentest ou auditoria real.",
      "Qualquer conector real exige autorizacao formal, escopo e logs de decisao.",
    ],
  };
}

function toolResult(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

function handleRpc(message) {
  const { id, method, params = {} } = message || {};
  try {
    if (method === "initialize") {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo,
        },
      };
    }
    if (method === "tools/list") {
      return { jsonrpc: "2.0", id, result: { tools } };
    }
    if (method === "tools/call") {
      const name = params.name;
      const args = params.arguments || {};
      const calls = {
        analyze_company_health: analyzeCompanyHealth,
        list_realtime_signals: listRealtimeSignals,
        generate_executive_report: generateExecutiveReport,
        get_mcp_architecture: getMcpArchitecture,
      };
      if (!calls[name]) {
        return { jsonrpc: "2.0", id, error: { code: -32601, message: `Tool not found: ${name}` } };
      }
      return { jsonrpc: "2.0", id, result: toolResult(calls[name](args)) };
    }
    if (method === "ping") {
      return { jsonrpc: "2.0", id, result: {} };
    }
    return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } };
  } catch (error) {
    return { jsonrpc: "2.0", id, error: { code: -32000, message: error.message } };
  }
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
      const lines = data.split(/\r?\n/);
      data = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const response = handleRpc(JSON.parse(line));
        process.stdout.write(`${JSON.stringify(response)}\n`);
      }
    });
    process.stdin.on("end", resolve);
  });
}

function startHttp() {
  const port = Number(process.env.PORT || 3333);
  const server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, serverInfo }));
      return;
    }
    if (req.method !== "POST" || req.url !== "/mcp") {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Use POST /mcp or GET /health" }));
      return;
    }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const payload = JSON.parse(body || "{}");
      const response = Array.isArray(payload) ? payload.map(handleRpc) : handleRpc(payload);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    });
  });
  server.listen(port, () => {
    console.error(`AI Resilience OS MCP listening on http://0.0.0.0:${port}/mcp`);
  });
}

if (process.argv.includes("--http") || process.env.MCP_TRANSPORT === "http") {
  startHttp();
} else {
  readStdin();
}
