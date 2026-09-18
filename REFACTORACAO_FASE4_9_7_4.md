# Refatoração 4.9.7.4 — Janela, Migração & Alianças

## Objetivo

Transformar a estrutura partidária criada nas fases 4.9.7.1–4.9.7.3 em um tabuleiro dinâmico: partidos e lideranças deixam de permanecer congelados durante o mandato e podem reorganizar bancadas, alianças, filiações e comandos estaduais.

## Entregas

### 1. Sistema partidário persistente
Novo estado `sistemaPartidario` guarda:
- migrações e dissidências;
- alianças e federações ativas;
- propostas de composição;
- intervenções estaduais;
- histórico de rearranjos;
- relações entre partidos;
- situação da janela partidária.

O estado é persistido por campanha e hidratado em saves anteriores.

### 2. Janela partidária
O motor identifica a janela eleitoral de 2026 e aumenta a possibilidade de migrações políticas durante o período. Lideranças da Câmara são avaliadas por:
- lealdade;
- ambição;
- unidade do partido de origem;
- satisfação da direção;
- afinidade ideológica com o destino;
- prestígio e máquina do partido receptor.

Lideranças muito influentes podem gerar **dissidência em bloco**, transferindo mais de uma cadeira junto com a troca.

### 3. Governadores e ministros
Governadores passam a ter filiação nacional persistente, sem apagar a identidade estadual narrativa. Na janela, governadores ambiciosos e em choque com o diretório local podem trocar de partido.

Ministros filiados também podem mudar de legenda fora da janela quando combinação de tensão, baixa lealdade e ambição indica ruptura com sua trajetória dentro do governo. Isso complementa a filiação emergente de independentes introduzida na 4.9.7.2.

### 4. Alianças e federações
Partidos avaliam compatibilidade ideológica, relação bilateral e saúde interna. Podem surgir propostas de:
- aliança política nacional;
- federação partidária, especialmente na aproximação da eleição.

Se o partido do Presidente estiver envolvido, a composição vira decisão do jogador. Aceitar consome Capital Político; recusar deteriora a relação com a outra legenda. Propostas entre partidos controlados pela IA podem ser resolvidas autonomamente.

Alianças ativas produzem efeitos políticos discretos sobre apoio e coordenação, sem transformar as legendas em um bloco monolítico.

### 5. Intervenção em diretórios estaduais
Diretórios com alta autonomia, baixa relação com a Executiva e insatisfação elevada podem entrar em risco de intervenção.

A Executiva Nacional pode substituir temporariamente o comando local. Para o partido presidencial, a decisão custa:
- 3 Capital Político;
- R$ 14 mi do caixa partidário.

Intervir recupera comando formal, mas diretórios muito autônomos podem reagir com dissidência, perda de filiados e enfraquecimento da máquina local.

### 6. Interface
A área `Política → Partidos` ganhou a aba **Janela & alianças**, com:
- status da janela partidária;
- alianças/federações ativas;
- propostas pendentes;
- histórico de migrações;
- tamanho de dissidências em cadeiras;
- painel de intervenção no diretório selecionado.

Propostas envolvendo a legenda presidencial também entram na **Central de Notícias → Pendências**.

### 7. Integração sistêmica
Migrações atualizam a distribuição de cadeiras dos partidos sem alterar o total da Câmara. Governadores e ministros carregam histórico de filiação. O motor roda junto com a vida interna do partido no fechamento mensal.

## Preparação para a expansão eleitoral

A 4.9.7.4 deixa material pronto para que a futura expansão eleitoral use:
- federações na convenção;
- força territorial das alianças;
- diretórios intervencionados;
- migrações recentes como capital ou passivo político;
- composição real das bancadas;
- governadores filiados como palanques estaduais.
