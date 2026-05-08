export type TraceType =
  | "dor declarada"
  | "hipotese"
  | "cenario macro"
  | "achado simulado"
  | "recomendacao"
  | "evidencia necessaria";

export type Status =
  | "coletado"
  | "requer validacao"
  | "proposto"
  | "dependente de autorizacao"
  | "pronto para revisao";

export type Dimension =
  | "Governanca de IA"
  | "Pessoas e competencias"
  | "Processos criticos"
  | "Infraestrutura"
  | "Seguranca"
  | "Auditoria e rastreabilidade"
  | "Automacao"
  | "Integracao pos-aquisicao"
  | "Capacidade de execucao"
  | "Resposta a cenarios macro";

export interface TraceTag {
  origem: string;
  tipo: TraceType;
  status: Status;
  dependencia: string;
}

export interface PainForm {
  mainPain: string;
  impactedAreas: string[];
  recurrence: string;
  perceivedImpacts: string[];
  previousAttempt: string;
  aiUsage: string[];
  aiGovernance: string;
  leadershipRisk: string;
  readiness: number;
  thirtyDayGoal: string;
}

export interface PainMap {
  mainPain: string;
  impactedAreas: string[];
  perceivedImpacts: string[];
  recurrence: string;
  maturity: string;
  associatedRisk: string;
  rootCauseHypotheses: string[];
  quickWins: string[];
  automationOpportunities: string[];
  codexArtifacts: string[];
  tags: TraceTag[];
}

export interface MacroScenario {
  id: string;
  title: string;
  whyItMatters: string;
  whatCanBreak: string;
  surface: string[];
  velocity: "alta" | "media" | "muito alta";
  potentialImpact: string;
  recommendedResponse: string;
}

export interface AuditFinding {
  id: string;
  dimension: Dimension;
  title: string;
  risk: string;
  requiredEvidence: string;
  validationMethod: string;
  priority: "alta" | "media";
  authorization: string;
  type: "simulado";
  status: Status;
}

export interface Correlation {
  id: string;
  declaredPain: string;
  macroScenario: string;
  simulatedFinding: string;
  priorityFragility: string;
  recommendedAction: string;
  codexArtifact: string;
  acceptanceCriteria: string;
}

export interface ScoreDimension {
  dimension: Dimension;
  raw: number;
  weighted: number;
  justification: string;
  recommendation: string;
}

export interface ScoreResult {
  total: number;
  profile: string;
  dimensions: ScoreDimension[];
  explanation: string;
}

export interface PlanAction {
  title: string;
  bucket: "Quick wins" | "Iniciativas estruturais" | "Dependem de autorizacao";
  origin: string;
  objective: string;
  dimension: Dimension;
  priority: "alta" | "media";
  effort: "baixo" | "medio";
  expectedImpact: string;
  suggestedOwner: string;
  suggestedDeadline: string;
  artifact: string;
  acceptanceCriteria: string;
  dependencies: string;
  status: Status;
}

export interface BacklogIssue {
  id: string;
  title: string;
  description: string;
  priority: "alta" | "media";
  type: string;
  origin: string;
  dependencies: string;
  acceptanceCriteria: string[];
  status: Status;
  expectedFile: string;
}

export interface AuditEvent {
  timestamp: string;
  source: string;
  type: string;
  description: string;
  status: Status;
  requiresHumanValidation: boolean;
  requiresFormalAuthorization: boolean;
}
