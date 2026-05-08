import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  Clipboard,
  Download,
  FileText,
  GitBranch,
  Home,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { basePlanActions, emptyPainForm, macroScenarios, options, sankhyaScenario, simulatedFindings } from "./data/demoData";
import {
  calculateScore,
  createAuditEvents,
  createBacklog,
  createCodexPrompt,
  createCorrelation,
  createExecutiveSummary,
  createFullReport,
  createPainMap,
} from "./lib/engine";
import type { PainForm } from "./types";

const steps = [
  "Home",
  "Mapa de Dores",
  "Resultado",
  "Stress Test",
  "Auditoria",
  "Correlacao",
  "Score",
  "Plano",
  "Backlog",
  "Codex Lab",
  "Log",
  "Relatorio",
  "Piloto",
];

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function AppButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const className =
    variant === "primary"
      ? "bg-ink text-white hover:bg-slate-800"
      : variant === "secondary"
        ? "border border-line bg-white text-ink hover:border-signal"
        : "text-ink hover:bg-white";
  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function Section({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {kicker ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-signal">{kicker}</p> : null}
      <h1 className="max-w-4xl text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-white p-5 shadow-panel ${className}`}>{children}</div>;
}

function TraceTags() {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="tag">origem: demo mockada</span>
      <span className="tag">status: requer validacao</span>
      <span className="tag">dependencia: autorizacao formal</span>
    </div>
  );
}

export function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PainForm>(emptyPainForm);
  const [selectedScenario, setSelectedScenario] = useState(macroScenarios[3].id);
  const [copied, setCopied] = useState("");

  const painMap = useMemo(() => createPainMap(form), [form]);
  const correlation = useMemo(() => createCorrelation(form), [form]);
  const score = useMemo(() => calculateScore(form), [form]);
  const backlog = useMemo(() => createBacklog(basePlanActions), []);
  const prompt = useMemo(() => createCodexPrompt(), []);
  const auditEvents = useMemo(() => createAuditEvents(), []);
  const executiveSummary = useMemo(() => createExecutiveSummary(form, score, correlation), [form, score, correlation]);
  const fullReport = useMemo(() => createFullReport(form, score, correlation), [form, score, correlation]);

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const exportJson = () => {
    const payload = {
      notice: "Demo mockada. Sem integracao real, auditoria real, pentest, scan, scraping ou enumeracao.",
      form,
      painMap,
      selectedScenario,
      simulatedFindings,
      correlation,
      score,
      plan: basePlanActions,
      backlog,
      auditEvents,
      executiveSummary,
      fullReport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-resilience-os-demo.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button className="flex items-center gap-2 font-bold text-ink" onClick={() => setStep(0)} type="button">
              <ShieldCheck className="h-6 w-6 text-signal" />
              AI Resilience OS
            </button>
            <div className="flex items-center gap-2">
              <AppButton onClick={() => setForm(sankhyaScenario)} variant="secondary">
                <Sparkles className="h-4 w-4" /> Usar cenario Sankhya
              </AppButton>
              <AppButton onClick={() => setStep(Math.min(step + 1, steps.length - 1))}>
                <ArrowRight className="h-4 w-4" /> Avancar
              </AppButton>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {steps.map((item, index) => (
              <button
                className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition ${
                  index === step ? "bg-ink text-white" : "bg-paper text-slate-600 hover:bg-white"
                }`}
                key={item}
                onClick={() => setStep(index)}
                type="button"
              >
                {index + 1}. {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {step === 0 && (
        <Section kicker="Demo executiva" title="Sistema operacional de resiliencia empresarial para a era da IA">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="max-w-3xl text-lg leading-8 text-slate-700">
                Cruza dores internas, cenarios macro e auditoria autorizada para gerar score, plano de resiliencia,
                backlog, artefatos Codex e relatorio executivo.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: "Mapa de Dores", text: "Captura problemas visiveis que a empresa ja reconhece.", Icon: Activity },
                  { title: "Stress Test Macro", text: "Testa a empresa contra cenarios E se? provocados pela IA.", Icon: BarChart3 },
                  { title: "Auditoria Simulada", text: "Demonstra analise de evidencias apos autorizacao formal.", Icon: ShieldCheck },
                ].map(({ title, text, Icon }) => (
                  <Panel key={title}>
                    <Icon className="h-6 w-6 text-signal" />
                    <h2 className="mt-4 text-lg font-bold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </Panel>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <AppButton onClick={() => setStep(1)}>
                  <Play className="h-4 w-4" /> Iniciar demo
                </AppButton>
                <AppButton
                  onClick={() => {
                    setForm(sankhyaScenario);
                    setStep(2);
                  }}
                  variant="secondary"
                >
                  <Sparkles className="h-4 w-4" /> Usar cenario demonstrativo Sankhya
                </AppButton>
              </div>
            </div>
            <Panel>
              <div className="grid gap-5">
                <div>
                  <h2 className="font-bold text-ember">Antes</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Dores dispersas, riscos invisiveis, IA informal, auditoria inexistente e decisoes sem
                    rastreabilidade.
                  </p>
                </div>
                <div className="border-t border-line pt-5">
                  <h2 className="font-bold text-signal">Depois</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Score de resiliencia, plano 30/60/90, backlog priorizado, artefatos Codex e log de auditoria.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </Section>
      )}

      {step === 1 && (
        <Section kicker="Etapa 1" title="Mapa de Dores">
          <div className="grid gap-5 lg:grid-cols-2">
            <Question title="1. Qual e a principal dor operacional?">
              <Select value={form.mainPain} onChange={(value) => setForm({ ...form, mainPain: value })} options={options.pains} />
            </Question>
            <Question title="2. Em quais areas essa dor aparece?">
              <CheckboxGrid values={form.impactedAreas} options={options.areas} onToggle={(value) => setForm({ ...form, impactedAreas: toggle(form.impactedAreas, value) })} />
            </Question>
            <Question title="3. O problema e recorrente ou pontual?">
              <Select value={form.recurrence} onChange={(value) => setForm({ ...form, recurrence: value })} options={["recorrente e critico", "recorrente mas controlado", "acontece em momentos especificos", "ainda nao esta claro"]} />
            </Question>
            <Question title="4. Qual e o impacto mais visivel?">
              <CheckboxGrid values={form.perceivedImpacts} options={options.impacts} onToggle={(value) => setForm({ ...form, perceivedImpacts: toggle(form.perceivedImpacts, value) })} />
            </Question>
            <Question title="5. A empresa ja tentou resolver?">
              <Select value={form.previousAttempt} onChange={(value) => setForm({ ...form, previousAttempt: value })} options={["sim mas nao funcionou", "sim parcialmente", "esta em andamento", "ainda nao tentou de forma estruturada", "nao sei"]} />
            </Question>
            <Question title="6. Onde a IA ja esta sendo usada?">
              <CheckboxGrid values={form.aiUsage} options={options.aiUsage} onToggle={(value) => setForm({ ...form, aiUsage: toggle(form.aiUsage, value) })} />
            </Question>
            <Question title="7. Existe governanca para uso de IA?">
              <Select value={form.aiGovernance} onChange={(value) => setForm({ ...form, aiGovernance: value })} options={["sim formal e aplicada", "existe orientacao informal", "esta sendo criada", "nao existe", "nao sei"]} />
            </Question>
            <Question title="8. Qual risco mais preocupa a lideranca?">
              <Select value={form.leadershipRisk} onChange={(value) => setForm({ ...form, leadershipRisk: value })} options={["vazamento de dados", "decisoes sem rastreabilidade", "codigo gerado sem revisao", "automacoes sem auditoria", "obsolescencia de pessoas/processos", "nao esta claro"]} />
            </Question>
            <Question title="9. Preparacao para mudancas rapidas da IA">
              <input className="w-full accent-signal" max={5} min={1} onChange={(event) => setForm({ ...form, readiness: Number(event.target.value) })} type="range" value={form.readiness} />
              <p className="mt-2 text-sm font-semibold">{form.readiness}/5</p>
            </Question>
            <Question title="10. Resultado de alto valor em 30 dias">
              <Select value={form.thirtyDayGoal} onChange={(value) => setForm({ ...form, thirtyDayGoal: value })} options={["reduzir retrabalho", "acelerar integracao pos-aquisicao", "criar governanca de IA", "automatizar processo critico", "auditar uso de IA", "estruturar piloto com Codex", "gerar plano executivo para conselho"]} />
            </Question>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section kicker="Etapa 1 - Resultado" title="Painel do Mapa de Dores">
          <div className="grid gap-5 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <h2 className="text-xl font-bold">{painMap.mainPain}</h2>
              <p className="mt-3 text-slate-600">Impacto percebido: {painMap.perceivedImpacts.join(", ") || "nao informado"}.</p>
              <TraceTags />
            </Panel>
            <Panel>
              <h2 className="font-bold">Maturidade percebida</h2>
              <p className="mt-2 text-2xl font-bold text-signal">{painMap.maturity}</p>
              <p className="mt-2 text-sm text-slate-600">Risco associado: {painMap.associatedRisk}</p>
            </Panel>
            <ListPanel title="Hipoteses de causa-raiz" items={painMap.rootCauseHypotheses} />
            <ListPanel title="Quick wins sugeridos" items={painMap.quickWins} />
            <ListPanel title="Artefatos Codex" items={painMap.codexArtifacts} />
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section kicker="Etapa 2" title="Stress Test Macro">
          <div className="grid gap-4 md:grid-cols-2">
            {macroScenarios.map((scenario) => (
              <button
                className={`rounded-lg border p-5 text-left shadow-panel transition ${
                  selectedScenario === scenario.id ? "border-signal bg-white" : "border-line bg-white hover:border-signal"
                }`}
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                type="button"
              >
                <h2 className="font-bold">{scenario.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.whyItMatters}</p>
                <p className="mt-3 text-sm"><strong>O que pode quebrar:</strong> {scenario.whatCanBreak}</p>
                <div className="mt-3 flex flex-wrap gap-2">{scenario.surface.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
                <p className="mt-3 text-sm"><strong>Resposta:</strong> {scenario.recommendedResponse}</p>
              </button>
            ))}
          </div>
        </Section>
      )}

      {step === 4 && (
        <Section kicker="Etapa 3" title="Auditoria Simulada">
          <Panel className="mb-5 border-amber-300 bg-amber-50">
            <p className="font-semibold text-amber-900">
              Auditoria simulada. Estes achados sao mockados. Auditoria real so ocorre com autorizacao formal,
              escopo definido, responsaveis indicados e acompanhamento da empresa.
            </p>
          </Panel>
          <div className="grid gap-4 md:grid-cols-2">
            {simulatedFindings.map((finding) => (
              <Panel key={finding.id}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold">{finding.title}</h2>
                  <span className="tag">{finding.priority}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{finding.risk}</p>
                <p className="mt-3 text-sm"><strong>Evidencia necessaria:</strong> {finding.requiredEvidence}</p>
                <p className="mt-2 text-sm"><strong>Como validar:</strong> {finding.validationMethod}</p>
                <TraceTags />
              </Panel>
            ))}
          </div>
        </Section>
      )}

      {step === 5 && (
        <Section kicker="Momento uau" title="Motor de Correlacao">
          <Panel className="border-signal">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-signal px-3 py-2 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4" /> Correlacao critica identificada
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <SignalBlock title="Dor declarada" text={correlation.declaredPain} />
              <SignalBlock title="Cenario macro" text={correlation.macroScenario} />
              <SignalBlock title="Achado simulado" text={correlation.simulatedFinding} />
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <SignalBlock title="Fragilidade prioritaria" text={correlation.priorityFragility} strong />
              <SignalBlock title="Acao recomendada" text={correlation.recommendedAction} strong />
              <SignalBlock title="Artefato Codex" text={correlation.codexArtifact} strong />
            </div>
            <p className="mt-6 rounded-md border border-line bg-paper p-4 text-sm">
              <strong>Criterio de aceite:</strong> {correlation.acceptanceCriteria}
            </p>
          </Panel>
        </Section>
      )}

      {step === 6 && (
        <Section kicker="Metrica executiva" title="Resilience Score">
          <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
            <Panel>
              <p className="text-sm font-semibold uppercase text-slate-500">Score geral</p>
              <p className="mt-3 text-6xl font-bold text-signal">{score.total}</p>
              <p className="mt-2 text-xl font-bold">{score.profile}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{score.explanation}</p>
            </Panel>
            <div className="grid gap-3">
              {score.dimensions.map((item) => (
                <Panel key={item.dimension}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-bold">{item.dimension}</h2>
                    <span className="text-lg font-bold">{item.raw}/5</span>
                  </div>
                  <div className="mt-3 h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-signal" style={{ width: `${item.raw * 20}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{item.justification}</p>
                  <p className="mt-2 text-sm"><strong>Recomendacao:</strong> {item.recommendation}</p>
                </Panel>
              ))}
            </div>
          </div>
        </Section>
      )}

      {step === 7 && (
        <Section kicker="Execucao" title="Plano Executavel">
          {(["Quick wins", "Iniciativas estruturais", "Dependem de autorizacao"] as const).map((bucket) => (
            <div className="mb-6" key={bucket}>
              <h2 className="mb-3 text-xl font-bold">{bucket}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {basePlanActions.filter((item) => item.bucket === bucket).map((action) => (
                  <Panel key={action.title}>
                    <h3 className="font-bold">{action.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{action.objective}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="tag">prioridade: {action.priority}</span>
                      <span className="tag">esforco: {action.effort}</span>
                      <span className="tag">status: {action.status}</span>
                    </div>
                    <p className="mt-3 text-sm"><strong>Artefato:</strong> {action.artifact}</p>
                    <p className="mt-2 text-sm"><strong>Criterio:</strong> {action.acceptanceCriteria}</p>
                  </Panel>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}

      {step === 8 && (
        <Section kicker="GitHub ready" title="Backlog">
          <div className="grid gap-4">
            {backlog.map((issue) => (
              <Panel key={issue.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-bold">{issue.id} - {issue.title}</h2>
                  <span className="tag">{issue.type}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{issue.description}</p>
                <p className="mt-3 text-sm"><strong>Arquivo esperado:</strong> {issue.expectedFile}</p>
                <p className="mt-2 text-sm"><strong>Origem:</strong> {issue.origin}</p>
                <ul className="mt-3 grid gap-1 text-sm text-slate-700">
                  {issue.acceptanceCriteria.map((criteria) => <li key={criteria}>- {criteria}</li>)}
                </ul>
              </Panel>
            ))}
          </div>
        </Section>
      )}

      {step === 9 && (
        <Section kicker="Codex Execution Lab" title="Ponte entre diagnostico e execucao versionavel">
          <div className="grid gap-5 lg:grid-cols-[0.4fr_0.6fr]">
            <Panel>
              <h2 className="font-bold">Artefatos selecionados</h2>
              <ul className="mt-3 grid gap-2 text-sm">
                {backlog.slice(0, 6).map((issue) => <li key={issue.id}>- {issue.expectedFile}</li>)}
              </ul>
            </Panel>
            <Panel>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">Prompt gerado para Codex</h2>
                <AppButton onClick={() => copy("prompt", prompt)} variant="secondary">
                  {copied === "prompt" ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />} Copiar
                </AppButton>
              </div>
              <pre className="mt-4 max-h-[520px] overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-6 text-slate-100">{prompt}</pre>
            </Panel>
          </div>
        </Section>
      )}

      {step === 10 && (
        <Section kicker="Rastreabilidade" title="Log de Auditoria">
          <div className="grid gap-3">
            {auditEvents.map((event) => (
              <Panel key={`${event.source}-${event.type}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-bold">{event.type}</h2>
                  <span className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString("pt-BR")}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="tag">fonte: {event.source}</span>
                  <span className="tag">validacao humana: sim</span>
                  <span className="tag">autorizacao formal: {event.requiresFormalAuthorization ? "sim" : "nao"}</span>
                </div>
              </Panel>
            ))}
          </div>
        </Section>
      )}

      {step === 11 && (
        <Section kicker="Saida executiva" title="Relatorio Executivo">
          <div className="grid gap-5 lg:grid-cols-2">
            <ReportPanel title="Resumo executivo de 1 pagina" text={executiveSummary} onCopy={() => copy("summary", executiveSummary)} copied={copied === "summary"} />
            <ReportPanel title="Relatorio completo" text={fullReport} onCopy={() => copy("report", fullReport)} copied={copied === "report"} />
          </div>
          <div className="mt-5">
            <AppButton onClick={exportJson} variant="secondary">
              <Download className="h-4 w-4" /> Exportar JSON da demo
            </AppButton>
          </div>
        </Section>
      )}

      {step === 12 && (
        <Section kicker="Conversao comercial" title="Transformar simulacao em piloto real">
          <div className="grid gap-5 lg:grid-cols-[0.65fr_0.35fr]">
            <Panel>
              <p className="text-lg leading-8 text-slate-700">
                A demo mostrou o fluxo com dados mockados. O proximo passo e executar o AI Resilience Sprint de 30
                dias com informacoes reais, autorizacao formal e escopo definido.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Mapa de Dores real",
                  "5 cenarios macro",
                  "auditoria autorizada de ate 3 processos",
                  "Resilience Score inicial",
                  "plano 30/60/90",
                  "backlog priorizado",
                  "ate 10 artefatos Codex",
                  "relatorio executivo",
                ].map((item) => (
                  <div className="flex items-center gap-2 text-sm font-semibold" key={item}>
                    <Check className="h-4 w-4 text-signal" /> {item}
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <FileText className="h-8 w-8 text-signal" />
              <h2 className="mt-4 text-xl font-bold">AI Resilience Sprint</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Diagnostico, stress test, auditoria autorizada, plano, backlog, artefatos Codex e proposta de
                continuidade.
              </p>
              <div className="mt-5">
                <AppButton onClick={() => copy("proposal", fullReport)}>
                  <GitBranch className="h-4 w-4" /> Gerar proposta de piloto
                </AppButton>
              </div>
            </Panel>
          </div>
        </Section>
      )}
    </div>
  );
}

function Question({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel>
      <h2 className="mb-3 font-bold">{title}</h2>
      {children}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="tag">tipo: dor declarada</span>
        <span className="tag">log: resposta coletada</span>
      </div>
    </Panel>
  );
}

function Select({ value, onChange, options: items }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select className="focus-ring w-full rounded-md border border-line bg-white px-3 py-3 text-sm" onChange={(event) => onChange(event.target.value)} value={value}>
      <option value="">Selecionar</option>
      {items.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
  );
}

function CheckboxGrid({ values, options: items, onToggle }: { values: string[]; options: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-line bg-paper px-3 py-2 text-sm" key={item}>
          <input checked={values.includes(item)} className="accent-signal" onChange={() => onToggle(item)} type="checkbox" />
          {item}
        </label>
      ))}
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel>
      <h2 className="font-bold">{title}</h2>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </Panel>
  );
}

function SignalBlock({ title, text, strong = false }: { title: string; text: string; strong?: boolean }) {
  return (
    <div className={`rounded-lg border border-line p-4 ${strong ? "bg-paper" : "bg-white"}`}>
      <p className="text-xs font-bold uppercase text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{text}</p>
    </div>
  );
}

function ReportPanel({ title, text, onCopy, copied }: { title: string; text: string; onCopy: () => void; copied: boolean }) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">{title}</h2>
        <AppButton onClick={onCopy} variant="secondary">
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />} Copiar
        </AppButton>
      </div>
      <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-white p-4 text-sm leading-6 text-slate-700 ring-1 ring-line">{text}</pre>
    </Panel>
  );
}

export default App;
