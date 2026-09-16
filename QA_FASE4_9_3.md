# QA — Fase 4.9.3

## Automático

```bash
node --check src/store/useGameStore.js
node --check src/game/governabilityEngine.js
node --check src/game/systemicCascadeEngine.js
node --check src/game/institutionalAutonomyEngine.js
node scripts/test-fase4-8-3.mjs
node scripts/test-fase4-9.mjs
node scripts/test-fase4-9-1.mjs
node scripts/test-fase4-9-2.mjs
node scripts/test-fase4-9-3.mjs
```

O teste 4.9.3 verifica repertório mínimo, ganho/perda mensal de CP, encarecimento de ações em crise, cascata do tarifaço, autonomia institucional, persistência, exposição global do Capital Político e proteção contra repetição de interação com governador.

## QA manual recomendado

1. Inicie ou carregue uma campanha e confirme que **Capital político** aparece na lateral e no cabeçalho.
2. Clique no indicador e confira o Painel de Governabilidade.
3. Execute uma ação de Economia, Federação, Comércio ou Projeto Especial e confira a cobrança de CP.
4. Tente conversar duas vezes com o mesmo governador no mesmo mês; a segunda tentativa deve ser bloqueada.
5. Termine um mês com boa aprovação/Congresso/clima e observe a recuperação de CP no relatório.
6. Teste uma campanha politicamente deteriorada e confira perda mensal e aumento do custo de ações grandes.
7. Em uma pressão dos EUA por tarifas, escolha retaliação e avance os meses; a cadeia deve alcançar exportação, agro/indústria e estados exportadores.
8. Abra Instituições e confira a seção de movimentações autônomas após eventos elegíveis.
9. Confirme que notícias de TCU/PGR/BC/STF levam à área de Instituições.
10. Salve, troque de campanha e retorne para confirmar que governabilidade e cascatas são independentes por campanha.

## Build local

```bash
npm install
npm run build
```

O build Vite deve ser validado no ambiente local antes do deploy no Vercel.
