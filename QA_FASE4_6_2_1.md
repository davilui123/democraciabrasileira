# QA — Fase 4.6.2.1

## Validações executadas
- Parser JS/JSX do TypeScript em toda a árvore `src`.
- Imports relativos verificados programaticamente.
- Teste puro do motor de calendário.
- Regressão do teste da Fase 4.6.2 (Agenda + Comércio Exterior).

## Resultados
- 101 arquivos JS/JSX analisados sem erro sintático.
- 217 imports relativos verificados; 0 ausentes.
- Calendário inicial: 5 compromissos futuros.
- Bilateral preparada gera data proposta entre 2 e 5 meses à frente.
- Convite de mídia vira convite datado.
- Crise federativa grave pode gerar chamado urgente de governador.
- BRICS aparece como compromisso futuro no mês previsto.

## Observação
O build Vite completo não foi executado porque o pacote permanece sem `node_modules`. A validação independente cobre sintaxe, imports e motores de domínio.
