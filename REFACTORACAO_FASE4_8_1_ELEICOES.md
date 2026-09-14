# Fase 4.8.1 — Sistema Eleitoral e Pré-campanha

## Objetivo

Transformar o ciclo eleitoral em um modo próprio do jogo, sem interromper o exercício da Presidência. O jogador continua governando, enquanto em **Política > Eleições 2026** administra filiação, convenção, chapa, recursos, campanha, pesquisas, eleições estaduais e a reação dos adversários.

## Calendário

O motor abre recursos progressivamente conforme o calendário eleitoral simulado de 2026:

- janeiro: pré-campanha;
- março/início de abril: janela partidária para a IA parlamentar e prazo de filiação do jogador;
- 15 de maio: crowdfunding;
- junho: disputa interna pelo fundo eleitoral;
- 20 de julho a 5 de agosto: convenções;
- 15 de agosto: fechamento do registro;
- 16 de agosto: campanha oficial;
- outubro: primeiro e eventual segundo turno.

As datas servem como trilho de gameplay. A resolução da votação é compatível com o turno mensal: outubro abre o primeiro turno e, se necessário, o segundo turno é resolvido como fase seguinte dentro do modo eleitoral.

## Central Eleitoral

A interface usa seis áreas sem exigir uma página vertical infinita:

1. **Radar** — pesquisa, indecisos, reconhecimento, coerência, recursos e movimentos da IA.
2. **Partido & Convenção** — filiação e minigame de bastidores.
3. **Chapa & Vice** — escolha do vice com equilíbrio regional, lealdade, risco e peso eleitoral.
4. **Recursos** — crowdfunding, pessoas físicas, eventos regionais e fundo partidário/eleitoral.
5. **Estados** — 27 eleições para governador acontecendo em paralelo.
6. **Estratégia** — ações de campanha, posições públicas, coerência e debate.

## Convenção partidária

Cada partido possui três caciques com base territorial, influência, demanda e preferências próprias. O jogador precisa reunir apoio suficiente para ser oficializado.

As barganhas são políticas e programáticas: estrutura regional, compromisso programático, prioridade territorial, participação política futura e influência sobre a composição da chapa. Não há compra ilícita de apoio.

Trocar de partido pode melhorar capilaridade ou acesso a recursos, mas custa coerência, autenticidade e reinicia parte da negociação interna.

## Vice-Presidência

O Vice-Presidente atual ganhou personagem, dossiê e relação com o Presidente. Ele permanece acessível no Gabinete.

Na eleição, o pool de vice é montado dinamicamente com:

- Vice-Presidente atual;
- governadores competitivos;
- ministros com peso político;
- lideranças do Congresso.

O algoritmo avalia região, distância ideológica, popularidade, lealdade, peso eleitoral, risco e possibilidade de o vice ofuscar o titular.

Retirar o vice atual da chapa deteriora a relação e pode provocar reação pública posterior.

## Pesquisa com descoberta do eleitorado

O jogo não começa a eleição com uma fotografia eleitoral precisa. A pesquisa inicial possui grande bloco de **não sabe/não respondeu** e margem de incerteza elevada.

Sabatinas, debates, viagens, Pulso e ações territoriais aumentam reconhecimento. Conforme o eleitorado conhece melhor os candidatos, os indecisos caem e a pesquisa fica mais precisa.

## Coerência e autenticidade

As posições públicas do candidato são persistidas. Reposicionar-se custa coerência; mudanças repetidas no mesmo eixo custam progressivamente mais. Contradições com o perfil assumido na posse aumentam a penalidade.

Assim, promessas contraditórias podem produzir ganho momentâneo em um grupo, mas corroer a autenticidade nacional.

## IA política global

O motor eleitoral observa o elenco já existente e pode reposicioná-lo:

- ministro ambicioso pode deixar a Esplanada para disputar Presidência ou governo estadual;
- liderança da Câmara pode trocar de partido na janela;
- governador presidenciável pode entrar no Planalto;
- personagens com capital político suficiente podem formar candidaturas dinâmicas;
- adversários presidenciais concentram recursos em estados competitivos ou onde o jogador abriu vantagem.

Mudanças relevantes são persistentes. Se um ministro deixa o governo, a pasta realmente fica vaga.

## Eleições estaduais

Há 27 disputas paralelas, cada uma com:

- governador atual;
- adversário próprio preparado desde esta fase;
- pesquisa estadual;
- indecisos;
- intensidade da IA;
- apoio presidencial opcional.

Ajudar um governador durante o mandato influencia a capacidade de transferir apoio na eleição. O Presidente pode apoiar o incumbente, apoiar o desafiante ou permanecer neutro. Uma decisão regional pode melhorar o desempenho presidencial naquele estado e, simultaneamente, deteriorar a relação com o ocupante do governo estadual.

## Recursos de campanha

O sistema abstrai recursos eleitorais em pontos de campanha e separa:

- crowdfunding de pessoas físicas;
- encontros legais com doadores individuais;
- eventos regionais;
- fundo eleitoral distribuído pelo partido.

Empresas não fazem doação direta de campanha. Relações empresariais continuam existindo no módulo Empresas, mas não viram cheque eleitoral.

## Desinformação

A ação **Operação de desinformação** é deliberadamente abstrata e não ensina técnicas reais. Ela representa uma decisão ilícita de campanha com:

- custo alto;
- baixa chance de benefício;
- perda imediata de coerência/autenticidade;
- risco crescente de investigação;
- risco jurídico acumulativo;
- possibilidade real de desclassificação da candidatura após reincidência.

A chance de benefício diminui a cada uso enquanto o risco de punição cresce de forma não linear.

## Minigames

### Convenção
Negociar apoio com caciques e chegar ao limiar de delegados sem desmontar a identidade da candidatura.

### Escolha do vice
Montar uma chapa equilibrada entre região, ideologia, lealdade, peso eleitoral e risco.

### Debate
Três rodadas temáticas. Respostas mais agressivas podem produzir ganho maior e risco/coerência pior; respostas consistentes ampliam autenticidade.

## Save

A versão de save passa para **v14** e persiste `eleicao`, incluindo campanha, chapa, convenção, recursos, pesquisas, posições, corridas estaduais, IA e histórico de desinformação.
