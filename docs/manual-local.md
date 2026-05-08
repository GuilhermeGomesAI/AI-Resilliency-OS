# Manual de execucao local - AI Resilience OS

## Objetivo

Este manual orienta como rodar a demo do AI Resilience OS em ambiente local, usando apenas dados mockados e sem conexao com sistemas reais.

O caminho recomendado para apresentacao local e o frontend React/Vite. O backend e o MCP local existem para testes tecnicos controlados, mas nao sao necessarios para demonstrar o fluxo principal da demo.

## Regras de seguranca da execucao local

- Nao usar dados reais da Sankhya ou de qualquer cliente.
- Nao conectar a sistemas reais.
- Nao executar auditoria real.
- Nao executar pentest.
- Nao fazer scan, scraping ou enumeracao.
- Tratar todos os achados como simulados.
- Tratar qualquer auditoria real como dependente de autorizacao formal.
- Validar que toda recomendacao exibida contenha origem, impacto, artefato, responsavel sugerido, criterio de aceite, status e dependencia.

## Pre-requisitos

- Node.js compativel com Vite 7. Recomendado: Node.js 20.19+ ou Node.js 22 LTS.
- npm instalado junto com o Node.js.
- Terminal PowerShell.
- Acesso ao diretorio local do projeto.

Verifique as versoes:

```powershell
node -v
npm -v
```

## Diretorio do projeto

No PowerShell, entre na pasta do projeto:

```powershell
cd "C:\Users\Meu Computador\Documents\Codex\2026-05-02\AI Resiliency OS"
```

## Instalacao

Instale as dependencias do projeto:

```powershell
npm install
```

Resultado esperado:

- `node_modules` criado localmente.
- Dependencias de React, Vite, TypeScript e Tailwind instaladas.
- Nenhuma chave, credencial ou dado real necessario.

## Rodar a demo principal

Inicie o servidor local do Vite:

```powershell
npm run dev
```

Abra no navegador a URL exibida no terminal. Por padrao, o Vite deve usar:

```text
http://127.0.0.1:5173/
```

Se a porta `5173` estiver ocupada, o Vite pode sugerir outra porta. Use a URL impressa no terminal.

## Validacao funcional da demo

Com a demo aberta, valide o roteiro minimo:

1. A tela inicial carrega sem erro visual.
2. O botao `Usar cenario demonstrativo Sankhya` preenche o fluxo demonstrativo.
3. O Motor de Correlacao aparece como o momento central da demo.
4. O fluxo separa dor declarada, hipotese, cenario macro, achado simulado, recomendacao e evidencia necessaria.
5. O Prompt Codex pode ser copiado.
6. O relatorio pode ser copiado.
7. O JSON pode ser exportado.
8. Nenhuma tela pede credencial real.
9. Nenhuma chamada real de auditoria, pentest, scan, scraping ou enumeracao e executada.

## Build de producao local

Para validar TypeScript e gerar o pacote de producao:

```powershell
npm run build
```

Resultado esperado:

- TypeScript sem erros.
- Pasta `dist` criada.
- Arquivos estaticos prontos para publicacao.

Para visualizar o build localmente:

```powershell
npm run preview
```

Abra a URL exibida no terminal. Por padrao, o preview tambem usa host local em `127.0.0.1`.

## Opcao sem instalacao

Quando npm ou rede nao estiverem disponiveis, use a versao standalone:

```powershell
Start-Process ".\demo.html"
```

Essa opcao abre a demo diretamente no navegador. Use este modo apenas para apresentacao estatica; para validar TypeScript e build, use `npm install` e `npm run build`.

## MCP local opcional

O MCP local expoe ferramentas mockadas para demonstrar arquitetura e diagnostico controlado. Ele nao conecta sistemas reais.

Rodar via HTTP:

```powershell
npm run mcp:http
```

Health check:

```powershell
Invoke-RestMethod "http://localhost:3333/health"
```

Listar ferramentas por JSON-RPC:

```powershell
Invoke-RestMethod "http://localhost:3333/mcp" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Resultado esperado:

- Servidor MCP local ativo na porta `3333`.
- Ferramentas demonstrativas listadas.
- Respostas marcadas como mockadas ou simuladas.

## Backend orquestrador opcional

O script abaixo inicia o backend local:

```powershell
npm run backend
```

Endpoints locais:

```text
GET  http://localhost:3001/api/health
POST http://localhost:3001/api/diagnose
POST http://localhost:3001/api/report
```

Importante:

- Este backend nao e necessario para o roteiro principal da demo.
- Nao configure chaves reais de provedores externos para apresentacoes mockadas.
- Qualquer uso com provedor externo deve ser tratado como teste tecnico controlado, com escopo e autorizacao definidos.
- Nenhum dado real da Sankhya ou de cliente deve ser enviado.

## Portas usadas

```text
5173  frontend Vite em modo dev
4173  preview local do Vite, quando disponivel
3333  MCP HTTP local
3001  backend orquestrador local
```

## Checklist antes de apresentar

- `npm install` executado com sucesso.
- `npm run dev` abre a interface.
- `npm run build` passa sem erros.
- A interface esta limpa e executiva.
- O cenario demonstrativo Sankhya funciona.
- Prompt Codex copiavel.
- Relatorio copiavel.
- JSON exportavel.
- Nenhuma integracao real habilitada.
- Nenhum teste ativo necessario.
- Outputs mantem origem, status e dependencias.

## Problemas comuns

### `npm install` falha

Verifique:

- conexao com a internet;
- versao do Node.js;
- permissao de escrita na pasta do projeto;
- se outro processo esta usando arquivos de `node_modules`.

### `npm run dev` abre outra porta

Use a URL exibida pelo Vite no terminal. A porta padrao e `5173`, mas pode mudar se ja estiver ocupada.

### `npm run build` falha por versao do Node

Atualize para uma versao compativel com Vite 7, preferencialmente Node.js 20.19+ ou Node.js 22 LTS.

### A demo nao deve acessar dados reais

Isto e esperado. A versao local e uma demo com dados mockados. Qualquer coleta real depende de autorizacao formal, escopo definido, responsaveis, criterio de aceite e trilha de auditoria.
