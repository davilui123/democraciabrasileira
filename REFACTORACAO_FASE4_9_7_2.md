# Fase 4.9.7.2 — Vida Interna & Máquina Partidária

## Objetivo
Transformar os partidos da 4.9.7.1 em organizações vivas. Máquina, disciplina, caixa, filiações, alas e diretórios deixam de ser atributos estáticos e passam a evoluir mensalmente conforme desempenho político, governo, Congresso e organização territorial.

## Entregas principais

### 1. Vida interna mensal
Cada partido passa a manter:
- satisfação da direção nacional;
- unidade interna;
- prestígio partidário;
- caixa partidário;
- filiados nacionais estimados;
- balanço mensal do fundo;
- histórico partidário;
- crises internas abertas/resolvidas;
- humor interno.

### 2. Alas dinâmicas
As 12 alas existentes agora possuem:
- satisfação;
- mobilização;
- relação com a direção;
- tendência de crescimento/recuo;
- força relativa recalculada ao longo do mandato.

Leis e agendas compatíveis com cada corrente podem melhorar seu humor. Correntes frustradas podem abrir crise interna.

### 3. Diretórios estaduais vivos
Os 108 diretórios passam a acompanhar:
- satisfação local;
- caixa estadual;
- variação de filiados;
- risco de intervenção;
- máquina estadual dinâmica;
- relação com a Executiva Nacional dinâmica.

Diretórios autônomos e insatisfeitos podem desafiar a direção nacional.

### 4. Caixa e manutenção da máquina
O fundo deixa de ser apenas um valor eleitoral projetado. Mensalmente há entrada estrutural e custo de manutenção da organização. Ações internas usam recursos reais do caixa partidário.

### 5. Ações do partido do Presidente
Até duas por mês:
- Reunião da Executiva;
- Mobilizar militância;
- Formação de quadros;
- Fortalecer diretório estadual;
- Apaziguar ala.

As ações podem consumir Capital Político e caixa do partido.

### 6. Disciplina chega ao Congresso
`calcularProjecao()` agora usa `partido.disciplina`. Uma bancada coesa converte melhor a orientação política em votos; uma legenda fragmentada tende a produzir mais dissidências.

### 7. Filiação ministerial emergente
Ministros sem partido podem filiar-se ao longo do jogo. O motor considera:
- tempo no cargo;
- lealdade ao Presidente;
- eficácia;
- tensão;
- ambição;
- afinidade ideológica/programática com as legendas;
- espaço político conquistado dentro do governo.

Um ministro valorizado pode se filiar ao partido presidencial. Um ministro ambicioso e frustrado pode buscar outra legenda compatível. A filiação aparece no módulo de Ministérios e na presença partidária dentro de Partidos.

## Performance
A dinâmica é processada uma vez por virada mensal. O estado é armazenado dentro das estruturas já existentes de `partidos`, sem criar uma base paralela de 108 diretórios.

## Arquivos principais
- `src/game/partyEngine.js`
- `src/data/seed/partidos.js`
- `src/store/useGameStore.js`
- `src/game/congressEngine.js`
- `src/components/Parties.jsx`
- `src/components/Ministries.jsx`
- `scripts/test-fase4-9-7-2.mjs`
