# Fase 4.9.7.3 — Partido no Poder

## Objetivo
Fazer o partido presidencial agir como uma organização autônoma que apoia o governo, mas cobra contrapartidas políticas. A legenda passa a avaliar cargos, espaço estratégico, agenda presidencial, bandeiras legislativas e coerência programática.

## Entregas

### 1. Relação Planalto–partido
O partido presidencial passa a acompanhar cinco indicadores próprios:
- relação com o Presidente;
- coerência programática;
- espaço ministerial;
- presença no núcleo estratégico;
- índice de compromissos cumpridos.

A relação é diferente da satisfação interna: uma legenda pode estar organizada internamente e, ainda assim, descontente com o Presidente que elegeu.

### 2. Coerência programática
O motor compara:
- posições públicas escolhidas na criação da campanha;
- promessas de posse;
- afinidade do partido com leis efetivamente sancionadas/promulgadas;
- medidas econômicas recentes compatíveis ou conflitantes com a identidade da legenda.

A coerência não é fixa e pode melhorar ou piorar ao longo do mandato.

### 3. Espaço no governo
A Executiva calcula uma meta de presença no gabinete considerando tamanho da bancada e estrutura ministerial. Também observa se possui algum filiado em pastas estratégicas.

### 4. Cobranças autônomas
A direção nacional pode cobrar:
- mais ministros filiados;
- espaço em ministério estratégico;
- inclusão de prioridade na Agenda Presidencial;
- adoção de uma lei compatível como bandeira do governo;
- recuperação da coerência programática.

As cobranças possuem prazo de resposta e prazo de entrega.

### 5. Respostas presidenciais
O Presidente pode:
- assumir o compromisso;
- negociar prazo/meta;
- recusar.

Assumir ou negociar consome Capital Político. Recusar ou ignorar afeta relação com a direção, apoio parlamentar e disciplina. Prometer e não entregar é mais custoso do que simplesmente discordar.

### 6. Verificação automática
O motor acompanha se o compromisso foi realmente cumprido:
- nomeações são verificadas no gabinete;
- espaço estratégico é verificado por pasta;
- agenda é verificada no fechamento mensal;
- bandeira legislativa é verificada pela tramitação real;
- coerência é recalculada com as decisões do mandato.

### 7. Interface
Nova aba **Partido no poder** dentro do partido presidencial, com:
- placar da relação;
- cobranças e respostas;
- presença ministerial;
- agenda preferencial;
- memória Planalto–partido.

A Central de Notícias também trata cobranças pendentes como decisões presidenciais.

## Arquivos principais
- `src/game/partyEngine.js`
- `src/store/useGameStore.js`
- `src/components/Parties.jsx`
- `src/components/NewsCenter.jsx`
- `scripts/test-fase4-9-7-3.mjs`
