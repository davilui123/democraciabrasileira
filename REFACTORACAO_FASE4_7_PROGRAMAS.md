# Fase 4.7 — Programas Governamentais

## Objetivo
Transformar promessas e prioridades presidenciais em políticas públicas plurimensais com metas, orçamento, território, governança, execução e consequências políticas/econômicas persistentes.

## Nova área
`Estratégia > Programas`

Abas:
- **Portfólio** — carteira presidencial e detalhe de cada programa.
- **Execução** — progresso, qualidade, risco, gasto e alertas.
- **Território** — onde cada programa está incidindo no mapa federativo.
- **Promessas** — vínculo direto entre promessa de posse e política pública em execução.

## Desenho do programa
O wizard foi dividido em quatro etapas para evitar página vertical longa:
1. Arquétipo e identidade política.
2. Escala territorial, duração e orçamento mensal.
3. Modelo de execução, financiamento, governança e via legal.
4. Revisão com capacidade de execução e risco projetados.

## Arquétipos iniciais
1. Saúde Mais Perto
2. Escola Técnica do Futuro
3. Casa & Cidade
4. Cidades Seguras
5. Rota Agro
6. Brasil Produtivo
7. Conecta Brasil
8. Primeiros Caminhos
9. Transição Energética Justa
10. Programa Nacional de Aceleração de Investimentos — bloqueado pela conquista `País em Obras`
11. Pacto Nacional de Capital Humano — bloqueado pela conquista `Capital Humano`

Cada arquitetura possui três metas mensuráveis, ministérios responsáveis, efeitos macroeconômicos e coalizões sociais próprias.

## Via legal
- **Executivo** — permitido para programas menores e dentro de estruturas existentes.
- **PL** — programa espera Congresso, Senado e sanção antes de implantar.
- **MP** — entra em execução provisória imediatamente, mas continua dependente de conversão legislativa. Se cair, o programa é interrompido depois de já ter produzido gasto e expectativa política.

Programas de escala excessiva não podem usar a via executiva simplificada.

## Execução mensal
A execução considera:
- ministros nomeados nas pastas responsáveis;
- relação do Planalto com governadores;
- modelo de execução;
- fonte de financiamento;
- governança;
- prioridade presidencial;
- parcerias empresariais existentes.

Podem ocorrer:
- atraso de cronograma;
- sobrecusto;
- exigência de correção pelos órgãos de controle;
- entrega acima do cronograma.

## Intervenção presidencial
Durante a execução o Presidente pode:
- **Auditoria extraordinária** — reduz risco jurídico/execução, mas desacelera.
- **Acelerar execução** — aumenta velocidade e gasto, elevando risco.
- **Recalibrar metas** — melhora qualidade e reduz parte do risco político.

## Integrações
### Economia
Todo desembolso entra no fluxo fiscal real do jogo. Financiamento reduz ou distribui a participação federal, mas não cria saldo fictício.

### Congresso
Marcos legais de programas usam o Congresso existente: comissões, Câmara, Senado e sanção.

### Federação
Programas territoriais afetam aprovação e relação com governadores nas UFs escolhidas.

### Empresas
Modelos mistos/PPP consideram a capacidade empresarial construída nas fases anteriores.

### Pulso
Marcos de 25%, 50%, 75% e conclusão viram comunicação política. Atrasos e controle alimentam oposição e imprensa.

### Promessas de posse
Uma promessa ligada a programa muda de `prometida` para `em_cumprimento` ao alcançar execução relevante e para `cumprida` ao finalizar o programa.

### Conquistas
As capacidades `programa_aceleracao_investimentos` e `programa_capital_humano` agora têm uso concreto.

## Save
Save atualizado para **v13**. Leis dinâmicas de programas também passam a ser persistidas em `leisDisponiveis`, para que tramitações não desapareçam após recarregar a campanha.
