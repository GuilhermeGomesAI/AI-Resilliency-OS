import { basePlanActions, macroScenarios, simulatedFindings } from "../data/demoData";
import type {
  AuditEvent,
  BacklogIssue,
  Correlation,
  PainForm,
  PainMap,
  PlanAction,
  ScoreDimension,
  ScoreResult,
} from "../types";

const weights: Record<ScoreDimension["dimension"], number> = {
  "Governanca de IA": 15,
  Seguranca: 15,
  "Processos criticos": 12,
  "Auditoria e rastreabilidade": 12,
  "Pessoas e competencias": 10,
  Infraestrutura: 10,
  "Integracao pos-aquisicao": 10,
  Automacao: 8,
  "Capacidade de execucao": 5,
  "Resposta a cenarios macro": 3,
};

export function createPainMap(form: PainForm): PainMap {
  const isMA = form.mainPain.toLowerCase().includes("aquis");
  return {
    mainPain: form.mainPain || "Dor operacional ainda nao declarada",
    impactedAreas: form.impactedAreas,
    perceivedImpacts: form.perceivedImpacts,
    recurrence: form.recurrence || "ainda nao esta claro",
    maturity:
      form.readiness <= 2
        ? "preparacao baixa ou informal"
        : form.readiness === 3
          ? "preparacao parcial"
          : "preparacao estruturada",
    associatedRisk: form.leadershipRisk || "risco ainda nao priorizado",
    rootCauseHypotheses: isMA
      ? [
          "ausencia de playbook unico de integracao",
          "documentacao dispersa",
          "baixa rastreabilidade de decisoes",
          "ausencia de matriz de responsaveis",
          "processos diferentes entre empresas adquiridas",
        ]
      : [
          "processos sem owner claro",
          "governanca de IA ainda informal",
          "criterios de aceite pouco rastreaveis",
          "documentacao operacional dispersa",
        ],
    quickWins: [
      "criar checklist de integracao pos-aquisicao",
      "criar matriz de sistemas criticos",
      "criar log de decisoes de integracao",
      "criar politica minima de uso seguro de IA",
    ],
    automationOpportunities: [
      "gerar playbooks versionaveis com Codex",
      "converter plano em issues de GitHub",
      "padronizar templates de auditoria e decisao",
      "criar roteiro de revisao humana por artefato",
    ],
    codexArtifacts: [
      "M&A AI Integration Playbook",
      "Checklist de integracao",
      "Template de auditoria inicial",
      "Matriz de riscos",
      "Plano 30/60/90",
      "Relatorio executivo para lideranca",
    ],
    tags: [
      {
        origem: "Mapa de Dores",
        tipo: "dor declarada",
        status: "requer validacao",
        dependencia: "validacao humana no piloto real",
      },
      {
        origem: "Mapa de Dores",
        tipo: "hipotese",
        status: "requer validacao",
        dependencia: "evidencia autorizada",
      },
    ],
  };
}

export function createCorrelation(form: PainForm): Correlation {
  const scenario = macroScenarios[3];
  const finding = simulatedFindings[3];
  return {
    id: "corr-001",
    declaredPain: form.mainPain || "Integracao pos-aquisicao lenta",
    macroScenario: scenario.title,
    simulatedFinding: finding.title,
    priorityFragility:
      "Crescimento por aquisicao pode acumular complexidade operacional sem padrao comum.",
    recommendedAction: "Criar M&A AI Integration Playbook.",
    codexArtifact: "/playbooks/ma-ai-integration-playbook.md",
    acceptanceCriteria:
      "Playbook revisado por tecnologia, seguranca e operacao e testado em uma unidade piloto.",
  };
}

export function calculateScore(form: PainForm): ScoreResult {
  const governance = form.aiGovernance.includes("formal") ? 4 : form.aiGovernance ? 2 : 1;
  const audit = form.aiGovernance.includes("formal") ? 3 : 2;
  const ma = form.mainPain.toLowerCase().includes("aquis") ? 2 : 3;
  const dimensions: ScoreDimension[] = [
    {
      dimension: "Governanca de IA",
      raw: governance,
      weighted: governance * weights["Governanca de IA"],
      justification: "Existe uso de IA, mas a governanca aparece como informal ou em formacao.",
      recommendation: "Criar politica de uso seguro de IA e fluxo de aprovacao.",
    },
    {
      dimension: "Seguranca",
      raw: 2,
      weighted: 2 * weights.Seguranca,
      justification: "Cenarios de codigo e dados sensiveis exigem checklist e revisao humana.",
      recommendation: "Criar checklist para codigo gerado por IA.",
    },
    {
      dimension: "Processos criticos",
      raw: 2,
      weighted: 2 * weights["Processos criticos"],
      justification: "Dor declarada sugere processos recorrentes e pouco padronizados.",
      recommendation: "Mapear processo piloto e gerar playbook operacional.",
    },
    {
      dimension: "Auditoria e rastreabilidade",
      raw: audit,
      weighted: audit * weights["Auditoria e rastreabilidade"],
      justification: "A demo identifica ausencia de AI Decision Log como achado simulado.",
      recommendation: "Implantar AI Decision Log para decisoes apoiadas por IA.",
    },
    {
      dimension: "Pessoas e competencias",
      raw: form.readiness <= 2 ? 2 : 3,
      weighted: (form.readiness <= 2 ? 2 : 3) * weights["Pessoas e competencias"],
      justification: "Preparacao declarada indica maturidade baixa ou parcial.",
      recommendation: "Criar trilha de requalificacao em IA.",
    },
    {
      dimension: "Infraestrutura",
      raw: 3,
      weighted: 3 * weights.Infraestrutura,
      justification: "A matriz de sistemas criticos ainda depende de validacao no piloto.",
      recommendation: "Criar matriz de sistemas criticos por processo.",
    },
    {
      dimension: "Integracao pos-aquisicao",
      raw: ma,
      weighted: ma * weights["Integracao pos-aquisicao"],
      justification: "A dor central e a ausencia simulada de playbook reduzem a maturidade.",
      recommendation: "Criar M&A AI Integration Playbook.",
    },
    {
      dimension: "Automacao",
      raw: 3,
      weighted: 3 * weights.Automacao,
      justification: "Ha oportunidades claras, mas ainda precisam de backlog e criterios.",
      recommendation: "Priorizar automacoes Codex com revisao humana.",
    },
    {
      dimension: "Capacidade de execucao",
      raw: 3,
      weighted: 3 * weights["Capacidade de execucao"],
      justification: "O Codex Execution Lab torna o plano executavel, mas depende de aprovacao.",
      recommendation: "Rodar piloto Codex controlado.",
    },
    {
      dimension: "Resposta a cenarios macro",
      raw: 3,
      weighted: 3 * weights["Resposta a cenarios macro"],
      justification: "A demo testa cenarios relevantes, mas ainda sem evidencias reais.",
      recommendation: "Selecionar 5 cenarios no piloto de 30 dias.",
    },
  ];
  const total = Math.round(
    dimensions.reduce((sum, item) => sum + item.weighted, 0) /
      Object.values(weights).reduce((sum, item) => sum + item, 0) *
      20,
  );

  return {
    total,
    profile:
      total <= 30
        ? "Resiliencia baixa"
        : total <= 55
          ? "Resiliencia em formacao"
          : total <= 75
            ? "Resiliencia intermediaria"
            : total <= 90
              ? "Resiliencia avancada"
              : "Resiliencia antifragil",
    dimensions,
    explanation:
      "O score combina respostas declaradas, cenarios macro e achados simulados. Cada dimensao recebe nota de 1 a 5 e peso executivo; sem evidencia real, o resultado permanece demonstrativo.",
  };
}

export function createBacklog(actions: PlanAction[] = basePlanActions): BacklogIssue[] {
  return actions.map((action, index) => ({
    id: `ISSUE-${String(index + 1).padStart(3, "0")}`,
    title: action.title,
    description: `${action.objective} Impacto esperado: ${action.expectedImpact}`,
    priority: action.priority,
    type: action.artifact.includes("playbook")
      ? "Playbook"
      : action.artifact.includes("policy")
        ? "Politica"
        : action.artifact.includes("audit")
          ? "Template"
          : "Checklist",
    origin: action.origin,
    dependencies: action.dependencies,
    acceptanceCriteria: [
      `arquivo criado em ${action.artifact}`,
      action.acceptanceCriteria,
      "origem, status e dependencias indicados",
      "revisao humana obrigatoria definida",
    ],
    status: "pronto para revisao",
    expectedFile: action.artifact,
  }));
}

export function createCodexPrompt(): string {
  return `Voce e o Agente Codex do projeto AI Resilience OS.

Crie os seguintes arquivos mockados, sem usar dados reais da Sankhya:

- /playbooks/ma-ai-integration-playbook.md
- /checklists/ma-systems-criticality.md
- /governance/ai-policy-acquired-companies.md
- /audit/ai-decision-log-template.md
- /backlog/ma-codex-automation-issues.md
- /reports/executive-summary-ma-resilience.md

Cada arquivo deve conter:
- objetivo;
- escopo;
- fora de escopo;
- responsaveis sugeridos;
- criterios de aceite;
- dependencias de validacao;
- dependencias de autorizacao;
- log de revisao humana.

Regras anti-AI Slop:
- nao usar dados reais da Sankhya;
- separar hipotese, achado simulado e recomendacao;
- cada recomendacao deve ter origem, impacto, responsavel sugerido, artefato e criterio de aceite;
- nao propor teste ativo sem autorizacao formal;
- nenhuma recomendacao critica deve ser tratada como verdade sem validacao humana ou evidencia autorizada.`;
}

export function createAuditEvents(): AuditEvent[] {
  const now = new Date();
  const events = [
    ["Mapa de Dores", "resposta coletada", "Cenario demonstrativo ou respostas manuais registradas.", false],
    ["Stress Test Macro", "cenario selecionado", "Cenario de M&A com IA e seguranca apresentado.", false],
    ["Auditoria Simulada", "achado simulado exibido", "Achados mockados marcados como dependentes de autorizacao.", true],
    ["Motor de Correlacao", "correlacao gerada", "Dor + cenario + achado simulado geraram acao recomendada.", false],
    ["Resilience Score", "score calculado", "Score demonstrativo calculado com justificativa.", false],
    ["Plano Executavel", "plano criado", "Acoes divididas por quick wins, estruturais e autorizacao.", false],
    ["Backlog", "backlog criado", "Issues prontas para GitHub geradas a partir do plano.", false],
    ["Codex Execution Lab", "prompt Codex gerado", "Prompt copiavel para artefatos versionaveis.", false],
    ["Relatorio Executivo", "relatorio exportado", "Resumo e relatorio completo gerados.", false],
  ] as const;

  return events.map(([source, type, description, requiresFormalAuthorization], index) => ({
    timestamp: new Date(now.getTime() + index * 1000).toISOString(),
    source,
    type,
    description,
    status: requiresFormalAuthorization ? "dependente de autorizacao" : "pronto para revisao",
    requiresHumanValidation: true,
    requiresFormalAuthorization,
  }));
}

export function createExecutiveSummary(form: PainForm, score: ScoreResult, correlation: Correlation): string {
  return `AI Resilience OS - Resumo Executivo

Dor principal: ${form.mainPain || "Integracao pos-aquisicao lenta"}.
Cenario testado: ${correlation.macroScenario}
Achado simulado: ${correlation.simulatedFinding}
Correlacao critica: ${correlation.priorityFragility}
Score geral: ${score.total}/100 - ${score.profile}.

Top 3 acoes:
1. Criar M&A AI Integration Playbook.
2. Criar AI Decision Log.
3. Criar Politica de Uso Seguro de IA.

Artefatos Codex: playbook de integracao, matriz de sistemas criticos, politica de IA, template de decisao, backlog e relatorio executivo.

Recomendacao: executar AI Resilience Sprint de 30 dias com dados reais, autorizacao formal e escopo definido.`;
}

export function createFullReport(form: PainForm, score: ScoreResult, correlation: Correlation): string {
  return `${createExecutiveSummary(form, score, correlation)}

Aviso: esta demo usa dados mockados, nao acessa sistemas reais, nao executa auditoria real, nao executa pentest e nao afirma vulnerabilidades reais.

Mapa de Dores:
- Areas impactadas: ${form.impactedAreas.join(", ") || "nao informado"}.
- Impactos percebidos: ${form.perceivedImpacts.join(", ") || "nao informado"}.
- Governanca de IA: ${form.aiGovernance || "nao informado"}.

Plano de resiliencia:
- Quick wins: politica de IA, checklist de codigo gerado por IA, AI Decision Log.
- Estruturais: M&A AI Integration Playbook, matriz de sistemas criticos, trilha de requalificacao.
- Dependem de autorizacao: piloto Codex controlado com escopo formal.

Dependencias:
- validacao humana;
- autorizacao formal;
- escopo e fora de escopo;
- responsaveis internos;
- evidencias autorizadas.

Proximo passo: aprovar a construcao do piloto AI Resilience Sprint de 30 dias.`;
}
