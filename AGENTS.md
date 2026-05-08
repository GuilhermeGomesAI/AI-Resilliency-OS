# AGENTS.md

## Missao

Construir e evoluir a demo do AI Resilience OS sem transformar o produto em consultoria generica ou AI Slop.

## Regras obrigatorias

- Usar apenas dados mockados na demo.
- Nao usar dados reais da Sankhya.
- Nao conectar em sistemas reais.
- Nao executar auditoria real.
- Nao executar pentest.
- Nao fazer scan, scraping ou enumeracao.
- Toda auditoria real deve ser marcada como dependente de autorizacao formal.
- Toda recomendacao deve ter origem, impacto, artefato, responsavel sugerido, criterio de aceite, status e dependencia.
- Separar claramente dor declarada, hipotese, cenario macro, achado simulado, recomendacao e evidencia necessaria.

## Criterios de aceite

- `npm install` funciona.
- `npm run dev` funciona.
- `npm run build` funciona.
- TypeScript sem erros.
- Interface executiva e limpa.
- Botao "Usar cenario demonstrativo Sankhya" funcionando.
- Prompt Codex copiavel.
- Relatorio copiavel.
- JSON exportavel.
- Nenhuma integracao real.
- Nenhum teste ativo.
- Todos os outputs com origem, status e dependencias.

## Direcao de produto

O momento mais forte da demo deve ser o Motor de Correlacao:

Dor declarada + Cenario macro + Achado simulado = Fragilidade prioritaria + Acao recomendada + Artefato Codex.

O Codex deve ser apresentado como produtor de artefatos revisaveis, versionaveis e executaveis, nunca como fonte final de verdade.
