# Fase 4.9.6.7 — Legado Legislativo

Última etapa da DLC legislativa. O ciclo de uma lei agora é consolidado em um histórico de mandato que reúne tramitação, texto negociado, sanção/veto, STF, TCU, regulamentação e programas derivados.

## Entregas

- Novo `legislativeLegacyEngine.js` para calcular o legado de cada lei e do mandato.
- **Índice de Legado Legislativo (0–100)** baseado em qualidade/consolidação das leis vigentes, cobertura temática e taxa de regulamentação.
- Classificação dinâmica: Em consolidação, Lei estruturante, Lei emblemática e Legado histórico; leis contestadas, vetadas e arquivadas permanecem no arquivo.
- **Bandeiras legislativas**: o Presidente pode escolher até 3 leis para associar diretamente à identidade do mandato. Elas ganham peso maior no índice e passam a compor a memória eleitoral.
- Nova aba `Congresso > Legado Legislativo` com Livro do Mandato, pegada por área, arquivo pesquisável e jornada completa de cada lei.
- Linha do tempo reúne protocolo/votações, regulamentação, controle STF/TCU e nascimento de programas públicos.
- Marcos de legado são registrados quando uma lei cruza faixas estruturante/emblemática/histórica.
- Relatório mensal passa a mostrar índice, leis vigentes, emblemáticas e bandeiras.
- O motor eleitoral recebe um efeito moderado do legado do incumbente; a execução dos programas continua sendo a principal fonte material de popularidade.
- Persistência em multi-campanhas via `legadoLegislativo`.

## Filosofia

A DLC termina com a pergunta: não apenas “quantas leis foram aprovadas?”, mas “quais sobreviveram ao processo político, foram implementadas e se tornaram parte reconhecível do mandato?”.
