# Refatoração 4.9.6.6 — Regulamentação & Implementação

## Objetivo

Fechar o ciclo **lei → regulamentação → implementação → programa governamental** e transformar a etapa pós-sanção em gameplay. Uma lei aprovada não entrega automaticamente: o jogador precisa decidir como ela será regulamentada, onde começará, quem executará, como será financiada e qual estrutura de governança sustentará a política.

## 1. Fila regulatória

Leis vigentes que exigem regulamentação entram automaticamente na carteira **Programas → Regulamentação**. Cada processo guarda prazo, risco de inércia, etapas normativas, versão efetivamente vigente do texto e o programa que poderá nascer da norma.

A fila é compatível com campanhas antigas: ao carregar um save, leis já sancionadas/promulgadas são sincronizadas sem apagar o progresso existente.

## 2. Capacidade normativa mensal

O Executivo possui uma capacidade limitada de regulamentação por mês:

- base: **2 pontos**;
- Casa Civil nomeada: **+1**;
- Justiça nomeada: **+1**;
- teto atual: **4 pontos**.

Leis de alta complexidade podem consumir dois pontos. A capacidade é renovada na virada mensal. Isso impede que dezenas de leis sejam implementadas instantaneamente e torna a composição ministerial relevante para a capacidade real de governo.

## 3. Jornada jogável de regulamentação

O novo `RegulationModal` organiza a decisão em quatro etapas.

### Estratégia
O jogador escolhe o ritmo:

- **100 dias:** mais velocidade e capacidade de entrega, porém maior risco e custo político;
- **equilibrado:** compromisso entre entrega e segurança;
- **blindagem institucional:** reduz riscos, mas atrasa a entrega.

Também escolhe a escala inicial:

- piloto focalizado;
- escala estruturante;
- mobilização nacional.

### Território
A implantação pode nascer nacional ou ser focalizada em UFs específicas. É possível selecionar regiões inteiras ou montar uma carteira estado a estado.

A relação com os governadores dos territórios selecionados entra no cálculo de execução. Portanto, **onde implementar** é uma decisão política, e não apenas visual.

### Entrega
O jogador escolhe:

- modelo de execução;
- fonte de financiamento;
- governança.

As opções já existentes no módulo de Programas passam a afetar o desenho regulatório antes do nascimento da política.

### Publicação
Antes de confirmar, o jogo apresenta um placar com:

- qualidade regulatória;
- capacidade de entrega;
- risco de implementação;
- presença ministerial;
- apoio federativo;
- custo mensal;
- duração estimada;
- custo em Capital Político;
- consumo de capacidade normativa.

O jogador também escolhe o nome e a prioridade do programa derivado.

## 4. Programas derivados de lei

Ao publicar a regulamentação, o jogo cria um programa governamental real com:

- vínculo permanente com a lei de origem;
- versão do texto legal que autorizou a política;
- território escolhido;
- modelo de execução;
- financiamento;
- governança;
- orçamento mensal;
- duração;
- metas mensuráveis;
- risco e eficiência calculados pelo desenho regulatório;
- status inicial de implantação.

As 13 famílias legislativas possuem blueprints próprios para gerar metas e parâmetros coerentes com a área da lei.

Se a lei já estiver vinculada a um programa criado anteriormente pelo jogador, a regulamentação consolida esse programa em vez de criar uma duplicata.

## 5. Atraso regulatório

Leis não regulamentadas dentro do prazo acumulam meses de atraso, risco de inércia e desgaste político. A virada mensal pode retirar Capital Político e gerar notícias sobre leis que existem formalmente, mas ainda não entregam.

A Central de Notícias mostra essas pendências e direciona o jogador para o módulo de Programas.

## 6. STF e TCU continuam relevantes

Programas derivados carregam `leiId`/`leiOrigemId`, permitindo que o controle institucional da 4.9.6.5 alcance a implementação.

- bloqueio total do STF ou suspensão de despesas pelo TCU pode colocar o programa em `bloqueado_controle`;
- restrições parciais reduzem execução e aumentam risco;
- após liberação, o programa pode voltar à execução.

Assim, a fiscalização não termina na lei: alcança a política pública criada a partir dela.

## 7. Feedback e gamificação

A experiência foi desenhada para oferecer decisões com trade-offs e feedback imediato:

- relógio de prazo;
- capacidade normativa limitada;
- placar do desenho em tempo real;
- barras de risco/entrega/apoio;
- custo político e fiscal visível antes da confirmação;
- carteira de regulamentações concluídas;
- relatório mensal com leis pendentes, atrasadas e capacidade disponível.

O objetivo é que regulamentar não pareça uma tela burocrática: é uma etapa de construção de governo.

## Arquivos principais

- `src/game/regulationEngine.js`
- `src/components/RegulationModal.jsx`
- `src/components/GovernmentPrograms.jsx`
- `src/components/NewsCenter.jsx`
- `src/components/TurnTransitionModal.jsx`
- `src/store/useGameStore.js`
- `src/services/saveService.js`
- `scripts/test-fase4-9-6-6.mjs`
