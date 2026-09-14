# Democracia Brasileira — Refatoração Fase 3

## Objetivo desta fase

A Fase 3 é deliberadamente uma fase de **frontend, identidade visual e arquitetura de interface**.

Nenhuma mecânica central foi redesenhada por causa desta etapa. O objetivo foi transformar módulos que pareciam produtos diferentes em uma única experiência de simulador presidencial.

A direção adotada é **Central de Governo**: uma interface institucional, densa o suficiente para um simulador político, mas com hierarquia clara, leitura rápida e momentos especiais de maior dramaticidade.

## 1. Design system único

O projeto agora usa um vocabulário visual comum em `tailwind.config.js` e `src/index.css`.

Paleta principal:

- fundo: grafite/azul profundo;
- superfícies: azul-grafite em diferentes elevações;
- ação institucional: verde-petróleo;
- atenção/pressão: âmbar;
- perigo/crise: vermelho dessaturado;
- informação: azul;
- sucesso: verde;
- cores partidárias e eleitorais permanecem reservadas para informação política real.

Componentes utilitários compartilhados:

- `ui-page`
- `ui-surface`
- `ui-surface-soft`
- `ui-toolbar`
- `ui-tabs`
- `ui-tab`
- `ui-btn-primary`
- `ui-btn-secondary`
- `ui-btn-ghost`
- `ui-stat`
- `ui-chip`
- `ui-kicker`
- `ui-data-label`
- `ui-data-value`

Isso reduz a tendência de cada módulo criar botões, cartões, títulos e espaçamentos próprios.

## 2. Novo chassi do jogo

`src/App.jsx` foi redesenhado como um **console presidencial**.

### Sidebar

A navegação agora é organizada por contexto:

- Governo
  - Gabinete
  - Ministérios
  - Leis & Reformas
- Política
  - Congresso Nacional
- Estratégia
  - Economia & Fazenda
  - Indicadores
  - Geopolítica

A lateral também exibe aprovação e contagem para a próxima eleição sem competir com o conteúdo principal.

### Cabeçalho global

O cabeçalho concentra:

- local/contexto da tela;
- nome do módulo;
- descrição curta;
- atenção presidencial;
- orçamento disponível;
- calendário do mandato;
- ação de encerrar o mês.

As páginas deixam de repetir grandes cabeçalhos desnecessários.

### Responsividade

Em telas abaixo de desktop, a sidebar vira uma navegação horizontal compacta sem remover módulos.

## 3. Congresso Nacional

A composição parlamentar foi preservada e refinada.

### Plenário com 513 cadeiras

O antigo arranjo visual foi substituído por um **hemiciclo SVG**.

Regras preservadas:

- as 513 cadeiras continuam sendo renderizadas individualmente;
- cada bancada mantém seu número real no estado do jogo;
- cada cadeira mantém a identidade do seu campo político;
- o apoio de cada bancada continua sendo usado para calcular a base projetada.

Melhorias visuais:

- disposição semicircular em 12 fileiras;
- leitura esquerda → centro → independentes → direita;
- mesa diretora representada visualmente;
- tooltip por cadeira;
- resumo da base projetada;
- marca clara da maioria simples de 257 votos;
- legenda compacta com cadeiras e apoio.

A composição do Plenário passa a ser a primeira visualização do Congresso.

### Sessão plenária

O placar de votação continua com linguagem própria inspirada em transmissão institucional. É uma exceção proposital ao design system porque representa um “modo evento”.

## 4. Geopolítica

A estrutura conceitual do módulo foi preservada:

- países;
- relações bilaterais;
- blocos;
- tratados;
- doutrina/cartas;
- negociação diplomática.

A Fase 3 apenas reorganiza hierarquia, superfícies, filtros, estatísticas e modais para encaixar o módulo na mesma linguagem do restante do jogo.

A Geopolítica continua podendo ter uma personalidade mais cartográfica/diplomática — ela não foi achatada para parecer um dashboard genérico.

### Negociação diplomática

A mesa de negociação foi refinada para usar as superfícies escuras do jogo.

As cartas agora parecem elementos estratégicos da interface, usando cor principalmente como acento de categoria, e não grandes fundos claros.

O briefing confidencial do Itamaraty permanece propositalmente com estética de documento físico. Essa quebra é intencional e comunica que o jogador está lendo um documento oficial, não navegando em outro módulo.

## 5. Gabinete e Sala de Situação

A Sala de Situação introduzida na Fase 2 foi integrada ao design system.

O dashboard passa a funcionar como síntese de governo:

- Sala de Situação;
- aprovação;
- crescimento;
- orçamento;
- relação institucional;
- segmentos da população;
- termômetro de mercado;
- leitura do STF;
- riscos do mês.

A intenção é reduzir a sensação de “painel de BI” e reforçar a ideia de centro de comando presidencial.

## 6. Ministérios

O módulo agora usa três níveis visuais:

1. **Esplanada** — seleção da pasta;
2. **Dossiê ministerial** — ministro, prioridade, situação e demandas;
3. **Casa Civil** — leitura transversal e alertas.

Nomeação, prioridade, crise e intervenção continuam usando as regras existentes. A Fase 3 apenas melhora a forma de apresentar essas decisões.

## 7. Economia, Leis e Indicadores

Os três módulos foram reorganizados sob os mesmos padrões de:

- cards;
- tabelas;
- controles;
- sliders;
- badges de status;
- hierarquia tipográfica;
- espaços e bordas.

A economia continua permitindo atuação direta nos instrumentos já existentes. Leis continua preservando apoio, custo político e envio ao Congresso. Indicadores permanece como leitura consolidada, agora sem cards visualmente desconectados.

## 8. Modais, notificações e telas especiais

Foram alinhados ao novo sistema:

- nomeação de ministros;
- criação de programas;
- conquistas;
- notificações/toasts;
- negociação diplomática;
- centro eleitoral.

Exceções visuais deliberadas:

- briefing em papel do Itamaraty;
- placar de votação;
- eleição/apuração;
- medalhas de conquistas.

Esses momentos têm identidade própria por serem eventos, não módulos permanentes.

## 9. Princípios para as próximas telas

A partir desta fase, novas interfaces devem seguir estas regras:

1. O cabeçalho global contextualiza a página; evitar títulos gigantes repetidos dentro do conteúdo.
2. Verde-petróleo indica ação institucional, não decoração.
3. Âmbar significa atenção, custo ou pressão.
4. Vermelho só aparece para risco, deterioração ou oposição grave.
5. Cores partidárias/eleitorais carregam significado político e não devem ser usadas como decoração genérica.
6. Dados importantes devem ser lidos primeiro; explicações aparecem em segundo nível.
7. Uma tela de rotina usa o design system. Uma tela de evento pode quebrá-lo de forma controlada.
8. Todo novo módulo deve funcionar visualmente em desktop e se reorganizar em telas menores.

## 10. Roadmap combinado

### Fase 3 — atual

**Design e coesão de frontend.**

Nenhuma expansão grande de mecânicas.

### Fase 4

**Mecânicas ponto a ponto.**

A partir da interface consolidada, cada sistema será refinado individualmente, com regras, feedback e integração entre módulos.

### Fase 5

**Primeira gameplay completa.**

O projeto será jogado como uma campanha real para identificar:

- gargalos;
- telas lentas ou confusas;
- decisões sem peso;
- loops repetitivos;
- balanceamento econômico/político;
- falta ou excesso de informação;
- bugs de progressão;
- ritmo do mandato.

A Fase 5 será usada como teste de produto, não apenas como teste técnico.
