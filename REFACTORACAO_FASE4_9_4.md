# Fase 4.9.4 — Orquestrador Político

## Objetivo

Fechar o Motor de Movimentação Política Autônoma iniciado na 4.9. A partir desta fase, acontecimentos deixam de ser apenas sorteios independentes: o jogo reconhece causas, abre histórias, escolhe prioridades, escala consequências ao longo dos meses, registra memória e encerra crises quando as condições que as sustentavam são removidas.

## 1. Histórias emergentes

Novo `politicalOrchestratorEngine` mantém dois conjuntos persistentes:

- `activeArcs`: histórias que ainda estão no centro da agenda;
- `archive`: histórias encerradas ou resolvidas, preservando a memória da campanha.

Cada história possui gravidade, categoria, tags, causa, estágio atual, linha do tempo e condição de resolução.

Pilotos sistêmicos implementados:

1. disputa comercial / tarifaço → exportadores → estados → bancadas;
2. minerais críticos → dependência → controle → parceiros externos;
3. Rússia/fertilizantes → safra → alimentos → estados produtores;
4. inflação → capitais → governadores → oposição;
5. governadores hostis → frente coordenada → bancadas;
6. gabinete estratégico vazio → atraso → interlocução paralela → governabilidade;
7. tensão institucional → fiscalização/judicialização → pressão política;
8. programas atrasados → território → governadores/prefeitos → Congresso.

## 2. Orçamento narrativo

Várias condições podem existir ao mesmo tempo, mas no máximo **duas histórias avançam visivelmente em um mês**. A prioridade combina gravidade e antiguidade.

Isso evita que uma virada mensal dispare uma sequência sem hierarquia, sem impedir que problemas de fundo continuem existindo.

### Convergência de crises

O Orquestrador também reconhece quando problemas que nasceram separados passam a compartilhar a mesma cadeia política. Nesses casos, a Central deixa de apresentá-los como uma pilha de cards independentes e cria uma convergência. Pilotos:

- tarifaço + pressão sobre fertilizantes/inflação → **Crise agroexportadora e de abastecimento**;
- gabinete estratégico vazio + tensão institucional → **Crise de coordenação encontra pressão institucional**;
- inflação/programas atrasados + governadores hostis → **Pacto federativo sob pressão coordenada**.

Os componentes continuam existindo no motor para que suas causas possam ser resolvidas separadamente, mas a experiência do jogador mostra a crise composta como o tema político dominante.

## 3. Escalada com efeito de gameplay

Avançar um estágio pode produzir efeito moderado no estado do jogo — capital político, Congresso, oposição, grupos sociais, relações estaduais, risco jurídico, inflação ou relações internacionais.

Os efeitos maiores continuam pertencendo aos motores setoriais e às cascatas da 4.9.3; o Orquestrador representa o custo adicional de uma crise que ganhou tração política.

## 4. Silêncio é decisão

Pressões diplomáticas já expiravam na 4.9.2. Agora crises federativas também escalam quando o Planalto não responde:

- cobrança pública;
- deterioração da relação estadual;
- perda de Capital Político;
- em crises prolongadas, pressão sobre Congresso e fortalecimento da oposição.

## 5. Memória política com envelhecimento

A memória dos personagens ganhou peso temporal:

- fatos cotidianos perdem influência ao longo dos meses;
- momentum político decai;
- marcas estruturais — crises federativas, rompimentos e eventos eleitorais — permanecem por mais tempo;
- estilo do personagem altera a propensão a confronto, aproximação, projeção nacional, rompimento ou pressão parlamentar.

Assim, dois personagens com os mesmos números podem reagir de forma diferente. Na fase eleitoral, governadores que não entram na corrida presidencial também podem abandonar a neutralidade e declarar apoio ao governo ou à oposição, alterando o desempenho eleitoral no estado e registrando a nova posição na carreira política do personagem.

## 6. Central de Notícias — Em curso

A Central de Notícias possui uma nova aba **Em curso**. Ela mostra:

- enredos ativos ordenados por gravidade;
- estágio atual;
- trilha `Por que isso aconteceu?`;
- áreas contaminadas/tags;
- histórico recente de histórias resolvidas.

O relatório mensal também mostra as principais histórias em andamento.

## 7. Resolução

Uma história pode terminar de duas formas:

- **resolvida:** o jogador alterou as condições que sustentavam a crise;
- **concluída:** o tema deixou o centro da agenda após atingir o ápice, mas seus efeitos anteriores continuam no estado da campanha.

A resolução fica arquivada para explicar a história do mandato.

## Resultado da série 4.9

A série fecha com quatro camadas conectadas:

- **4.9:** atores e memória;
- **4.9.1:** decisões políticas autônomas internas;
- **4.9.2:** autonomia internacional;
- **4.9.3:** governabilidade e efeitos dominó;
- **4.9.4:** continuidade, prioridade, escalada, causalidade e resolução.

A próxima fase pode começar em 5.0 sem depender de mais uma rodada estrutural do Motor Político Global.
