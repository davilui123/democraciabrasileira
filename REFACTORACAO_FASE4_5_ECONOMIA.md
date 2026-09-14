# Fase 4.5 — Economia & Fazenda

## Objetivo
Transformar Economia & Fazenda em uma sala de decisão macroeconômica. O Presidente não possui uma conta com saldo: gasto, receita, financiamento e dívida entram no fluxo fiscal e produzem efeitos com defasagem sobre atividade, inflação, emprego, juros, risco-país e aprovação.

## Nova arquitetura visual
A página usa cinco mesas, sem uma página vertical interminável:

1. **Sala Econômica** — cadeia macro, radar de crise e decisões do mês.
2. **Tributos** — alavancas executivas + reformas que precisam do Congresso.
3. **Dívida & Crédito** — composição da dívida, estratégia de emissão e financiamento de investimento.
4. **Medidas** — caixa de ferramentas fiscal, creditícia e anticíclica.
5. **Cenários** — detecção de desequilíbrios macro e respostas recomendadas.

## Controlador de impostos
Ajustes executivos simplificados:
- IPI seletivo;
- IOF sobre crédito;
- tarifa média de importação;
- CIDE combustíveis.

Há limite de duas alterações executivas por mês e cada instrumento só pode ser alterado uma vez no mesmo mês. Os níveis são abstrações de gameplay, não reprodução normativa.

Reformas estruturais permanecem no Congresso:
- Reforma do Imposto de Renda;
- Tributação de Dividendos;
- Cashback Tributário;
- Simples Verde;
- Reforma Patrimonial.

## Dívida pública
A dívida passou a ter composição explícita:
- prefixados;
- pós-fixados/Selic;
- IPCA;
- cambial/externa.

O custo médio estimado da dívida agora influencia os juros mensais. A composição escolhida muda prazo médio e risco de rolagem.

Estratégias disponíveis:
- carteira equilibrada;
- alongar vencimentos;
- mais pós-fixados;
- mais indexação ao IPCA;
- abrir janela externa.

## Financiamentos
Cinco linhas iniciais:
- NDB — infraestrutura resiliente;
- BID — infraestrutura social;
- CAF — integração regional;
- Banco Mundial — adaptação climática;
- emissão extraordinária doméstica do Tesouro.

O financiamento não entra como receita primária. Ele financia um programa/investimento, portanto o gasto aparece no primário e é financiado pela dívida. As linhas externas também alteram exposição e relações do Brasil.

## Caixa de ferramentas
12 medidas econômicas iniciais, entre elas:
- contingenciamento cautelar;
- pacote de custo de vida;
- garantia de crédito para PMEs;
- aceleração de obras;
- revisão de benefícios tributários;
- crédito à exportação;
- amortecedor de combustíveis;
- reindustrialização;
- linha emergencial ao sistema financeiro;
- conformidade fiscal;
- seguro emprego;
- concessões aceleradas.

Cada medida possui cooldown e efeitos conflitantes sobre grupos sociais, fiscal, inflação, crescimento, emprego, risco e confiança.

## Cenários econômicos
O motor identifica seis famílias de desequilíbrio:
- inflação pressionada;
- recessão;
- desemprego elevado;
- risco-país em deterioração;
- crédito travado;
- dívida sob escrutínio.

A situação dominante aparece na Sala Econômica e na aba Cenários com gravidade e respostas sugeridas. Não existe uma resposta universalmente correta.

## Integrações
- **Congresso:** reformas tributárias estruturais são enviadas ao motor legislativo existente.
- **Estatais:** crédito à exportação usa BNDES; amortecedor de combustíveis depende da Petrobras.
- **Pulso:** decisões econômicas geram repercussão da mídia e comentários da comunidade.
- **Grupos sociais:** mercado, periferia, agro, sindicalistas, universitários etc. reagem de modo diferente.
- **Ministérios:** competência e lealdade do ministro da Fazenda alteram a eficácia das medidas; pasta vaga reduz execução e confiança.
- **BC:** a Selic permanece reação do Copom ao cenário, não instrumento do Presidente.
- **Geopolítica:** financiamentos multilaterais e exposição externa criam pontos de conexão para as fases seguintes.

## Save
Save atualizado para **v8**, com compatibilidade de leitura dos saves v7 e anteriores.
