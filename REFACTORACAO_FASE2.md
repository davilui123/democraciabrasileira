# Democracia Brasileira — Refatoração Fase 2

## Objetivo

A Fase 2 muda o centro do projeto de um painel que informa números para um jogo em que o jogador **gasta capacidade presidencial limitada para alterar o tabuleiro político**.

O princípio de design passa a ser:

> decidir → deslocar forças → instituições reagem → problemas amadurecem → o próximo mês nasce diferente

## 1. Sala de Situação / Mesa Presidencial

Novo componente: `src/components/SituationRoom.jsx`.

Ele ocupa o topo da Visão Geral e possui:

- mapa visual de poder com Presidência no centro;
- seis polos clicáveis: Ruas, Mercado, Congresso, STF/Instituições, Governo e Mundo;
- leitura dinâmica da força/pressão de cada polo;
- filtro de ordens presidenciais por polo;
- preview dos trade-offs antes da autorização;
- reação imediata depois da decisão;
- três pontos mensais de **Atenção Presidencial (AP)**.

O jogador não consegue executar tudo no mesmo mês. A escassez de atenção é proposital e passa a ser um recurso do jogo.

## 2. Ordens Presidenciais

Novo catálogo: `src/game/presidentialActions.js`.

A Fase 2 inclui inicialmente nove ordens:

1. Mutirão Social Emergencial
2. Pronunciamento em Rede Nacional
3. Sinalização Fiscal
4. Plano Nacional de Infraestrutura
5. Rodada com Líderes
6. Pacto entre Poderes
7. Sala de Gestão Intensiva
8. Operação Integridade
9. Ofensiva Diplomática

As decisões não foram desenhadas como bônus puros. Elas deslocam vários sistemas ao mesmo tempo.

Exemplos:

- política social melhora aprovação popular, mas custa orçamento e confiança empresarial;
- sinalização fiscal melhora mercado e inflação, mas cobra preço social;
- articulação no Congresso aumenta apoio parlamentar, mas consome capital político;
- pacto institucional reduz tensão jurídica, mas também consome capital político;
- infraestrutura custa 2 AP e muito orçamento, porém gera impulso econômico;
- integridade melhora credibilidade, porém piora o clima dentro da máquina pública.

## 3. Atenção Presidencial

Novo estado persistente no Zustand:

`agendaPresidencial`

Campos principais:

- `pontosMax`
- `pontosRestantes`
- `acoesUsadas`
- `historico`
- `ultimaReacao`
- `impulsoPib`

Regras iniciais:

- 3 AP por mês;
- uma mesma ordem não pode ser repetida no mesmo mês;
- ordens estruturais podem custar 2 AP;
- terminar o mês sem usar boa parte da capacidade presidencial reduz levemente o clima de coordenação;
- usar toda a agenda melhora levemente o clima do governo;
- a agenda é reiniciada no próximo mês.

## 4. Mapa de Poder

Os valores do mapa não são decorativos. Eles são derivados do estado real do jogo:

- **Ruas:** aprovação geral;
- **Mercado:** confiança do mercado;
- **Congresso:** votos estimados a partir de cadeiras × apoio de cada partido;
- **Instituições:** relação entre tensão do STF e tensão institucional;
- **Governo:** clima interno;
- **Mundo:** soft power brasileiro.

Assim, decisões executadas em outros módulos aparecem visualmente na Mesa Presidencial.

## 5. Ministérios agora possuem dinâmica de crise

Na Fase 1 existia um catálogo grande de problemas estruturais, mas o processamento ministerial ainda estava praticamente vazio.

A Fase 2 implementa:

- surgimento gradual de problemas ocultos;
- maturação por nível;
- prioridade ministerial alterando a velocidade de deterioração;
- ausência de ministro acelerando problemas;
- transformação de problemas ocultos em demandas visíveis;
- níveis 3 e 4 gerando pressão concreta;
- efeitos sobre popularidade, economia, instituições, Congresso, oposição, orçamento e clima;
- resolução por investimento;
- escalada quando a demanda é ignorada;
- intervenção presidencial direta com custo político e perda de lealdade do ministro.

A Casa Civil já consegue detectar parte dessas pressões por meio do radar existente no módulo de Ministérios.

## 6. Lua de mel corrigida

A interface já afirmava existir um "capital de montagem" no início do mandato, mas a regra não existia de verdade.

Agora:

- a primeira nomeação de cada pasta nos seis primeiros turnos custa **0 de capital político**;
- trocas posteriores custam capital político normalmente.

Isso permite montar o governo no início sem destruir a capacidade de negociação do presidente.

## 7. Persistência

Save atualizado para versão 3.

Agora também é persistido:

- `agendaPresidencial`;
- estado dinâmico de `cargos`, incluindo problemas, crises, prioridade e demandas.

O carregamento mantém compatibilidade com o save local `v2` criado na Fase 1.

## 8. Integração entre sistemas

A Sala de Situação já altera sistemas existentes em vez de manter um minigame isolado:

- apoio de partidos altera Congresso;
- tensão do STF altera o polo institucional;
- confiança de mercado altera Economia;
- soft power altera Geopolítica;
- clima do governo afeta Ministérios;
- aprovação altera Ruas e continua sendo usada pelos demais sistemas.

## 9. Validações realizadas

Foram realizados testes lógicos da store em Node:

- carregamento dos catálogos locais;
- execução de ordens presidenciais;
- consumo e reset de AP;
- custo de capital político;
- custo orçamentário;
- alteração do apoio partidário;
- impulso de PIB carregado para o processamento do mês;
- geração e amadurecimento de problemas ministeriais;
- resolução de demanda;
- montagem inicial de gabinete sem custo político;
- parsing de todos os arquivos JS/JSX com Babel Parser.

O build do Vite neste ambiente Linux continua bloqueado pelo mesmo motivo externo já observado na Fase 1: o ZIP original contém somente o binding nativo do Rolldown para Windows (`@rolldown/binding-win32-x64-msvc`). O código-fonte alterado foi validado sintaticamente e a store foi executada em testes diretos.

## Próximas frentes sugeridas

A arquitetura da Fase 2 abre três caminhos fortes para a Fase 3:

- **eventos encadeados/cadeias de crise**, em vez de eventos isolados;
- **personagens e relações pessoais** (ministros, líderes do Congresso, governadores, STF, imprensa);
- **mapa político do Brasil por estados**, com governadores, base regional, obras, crise federativa e resultado eleitoral.

A recomendação é atacar personagens + estados na próxima fase, porque isso transforma os números em agentes com memória e interesse próprio.
