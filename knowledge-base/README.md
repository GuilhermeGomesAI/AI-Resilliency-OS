# Base de Conhecimento - AI Resilience OS

Use esta pasta para guardar livros, artigos, relatórios e materiais que possam melhorar os diagnósticos do AI Resilience OS.

## Estrutura

```text
knowledge-base/
  books/               arquivos originais: PDF, EPUB, TXT, DOCX
  notes/               anotações humanas por livro ou tema
  summaries/           resumos estruturados
  extracted-insights/  conceitos aplicáveis ao diagnóstico
  metadata/            fichas de origem, licença, tema e uso permitido
```

## Regra de uso

O LLM deve tratar estes materiais como contexto auxiliar, não como verdade automática.

Toda recomendação gerada a partir desta base deve indicar:

- fonte usada;
- trecho ou ideia de origem;
- como isso se conecta ao diagnóstico;
- nível de confiança;
- se depende de validação humana;
- se depende de evidência operacional do cliente.

## Convenção sugerida

Para cada livro, crie:

```text
books/nome-do-livro.pdf
metadata/nome-do-livro.md
summaries/nome-do-livro-summary.md
extracted-insights/nome-do-livro-insights.md
```

## Importante

- Não coloque dados confidenciais de clientes aqui sem autorização.
- Não misture achado real com hipótese teórica.
- Não use livros para afirmar fragilidade de uma empresa sem evidência interna.
- Use a base para melhorar perguntas, hipóteses, critérios de análise, riscos e planos.
