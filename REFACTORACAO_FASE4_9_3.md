# Fase 4.9.3 — Governabilidade & Efeito Dominó

A 4.9.3 transforma **Capital Político** em um recurso operacional de governo e conecta acontecimentos antes isolados em cadeias de consequência que atravessam diplomacia, economia, setores produtivos, estados, Congresso, instituições e opinião pública.

## 1. Capital Político agora é um freio de poder

O recurso passa a ficar visível permanentemente na interface (barra lateral e cabeçalho). O clique abre o **Painel de Governabilidade**, que explica o saldo atual, o balanço do último mês, fatores de ganho/perda e o estado político do governo.

### Recuperação mensal

O fechamento do mês calcula uma variação de Capital Político a partir de:
- aprovação presidencial;
- força do governo no Congresso;
- clima interno do governo;
- resultado fiscal;
- preenchimento de ministérios estratégicos;
- força da oposição;
- tensão institucional.

A variação mensal é limitada para evitar saltos excessivos e fica registrada no histórico da campanha.

### Custos políticos

Ações de maior impacto agora exigem CP. Entre elas estão mudanças tributárias, medidas econômicas, financiamentos, investimentos federativos, Projetos Especiais, tarifas comerciais e articulações diretas com governadores, além dos custos que já existiam em Congresso, leis e geopolítica.

Quando o governo está politicamente fraco, ações grandes ficam mais caras. Portanto autoridade legal não equivale mais a capacidade política ilimitada.

A interação direta com um mesmo governador também foi limitada a **uma movimentação por mês**, eliminando a possibilidade de repetir pressão para gerar recurso ou alterar indefinidamente a relação estadual.

## 2. Repertório autônomo ampliado

- **26 pressões internacionais**: as 7 originais + 19 novas situações envolvendo cadeias de chips, baterias, defesa, energia, minerais, clima, Amazônia, BRICS, Mercosul, fronteira, financiamento e comércio.
- **39 eventos federativos**: os 27 estaduais originais + 12 novos enredos de segunda camada ligados a exportação, energia, mineração, tecnologia, fertilizantes, portos e indústria.
- **12 movimentos institucionais autônomos**: TCU, PGR, Banco Central e STF passam a reagir a condições concretas do governo.

## 3. Efeito Dominó

O novo `systemicCascadeEngine` observa o estado da campanha e transforma uma decisão ou deterioração em problema de outra área. Existem **15 rotas sistêmicas gerais + uma família dinâmica de controle de estatais**.

Exemplos:
- tarifaço + retaliação → queda de exportações → agro/indústria → MT/GO/PR/MS/SP → governadores/oposição → Capital Político;
- atrito com Rússia → fertilizantes mais caros → inflação de alimentos → agro e Centro-Oeste;
- preferência mineral à China → dependência estratégica → alerta de controle → tensão institucional e parceiros contrariados;
- tensão global alta → choque de diesel → frete/agro/indústria → inflação e estados;
- déficit + muitos programas → TCU/Congresso → risco-país e governabilidade;
- inflação alta → crise local em capitais → governadores cobram Brasília;
- muitos governadores hostis → frente federativa → bancadas estaduais pressionam o Congresso;
- programas atrasados → prefeitos/estados → oposição e perda de execução política;
- desemprego alto → pressão metropolitana → estados populosos e grupos sociais;
- déficit comercial → indústria/câmbio → estados manufatureiros;
- dependência de chips → gargalos produtivos → demanda por política industrial;
- reputação ambiental baixa → contratos/exportações → estados exportadores;
- Capital Político muito baixo + Congresso fraco → paralisia de governabilidade;
- núcleo ministerial vazio → falhas de coordenação em cadeia;
- estatal com alta exposição e baixa governança → controle externo específico.

As cascatas entram na fila de consequências, amadurecem no tempo, alteram o estado real da campanha e deixam histórico persistente.

## 4. Instituições com iniciativa própria

TCU, PGR, Banco Central e STF podem agir sem clique do jogador quando as condições justificam. Exemplos: auditoria de programas, controle de estatais, fiscalização de grandes obras, pedidos da PGR, alertas monetários e aceleração de conflitos federativos no STF.

Esses movimentos entram na Central de Notícias e permanecem visíveis em **Instituições → Controles → Movimentação institucional autônoma**.

## 5. Persistência

`governabilidade` e `historicoCascatas` passam a integrar o save de cada campanha. A 4.9.3 mantém a estrutura de campanhas da versão 16 para preservar compatibilidade com a 4.9.x.

## Arquivos principais

- `src/game/governabilityEngine.js`
- `src/game/systemicCascadeEngine.js`
- `src/game/institutionalAutonomyEngine.js`
- `src/data/seed/pressoesGeopoliticasExtras.js`
- `src/data/seed/eventosFederativosExtras.js`
- `src/components/PoliticalCapitalModal.jsx`
- `src/store/useGameStore.js`
- `src/components/Institutions.jsx`
- `src/components/NewsCenter.jsx`
