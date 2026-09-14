# Fase 4.1 — Congresso

## Objetivo

Transformar o Congresso no principal tabuleiro político do jogo: menos “clicar para aprovar” e mais construir maioria, sobreviver às comissões, administrar lideranças, escolher atalhos regimentais e arcar com o custo de cada vitória.

Esta subfase é propositalmente focada na **Câmara dos Deputados**. O Senado já existe no fluxo de tramitação, mas permanece abstraído por enquanto. A Câmara mantém as 513 cadeiras como leitura quantitativa; os personagens-chave dão a camada qualitativa de poder.

## Referências de design

A direção foi inspirada principalmente por simuladores legislativos como **Lawgivers / Lawgivers II**: parlamentares como atores, lealdade/opiniões, relações entre partidos, comissões e leis como objetos de gameplay — não apenas textos de evento.

O fluxo brasileiro foi modelado de forma simplificada a partir da Constituição Federal e do processo legislativo descrito pela Câmara dos Deputados: comissões temáticas, CFT quando há impacto financeiro, CCJC, apreciação conclusiva em alguns casos, Plenário, dois turnos e 3/5 para PEC, Senado e sanção/veto.

## 1. Plenário compacto — 513 cadeiras

O hemiciclo foi refeito para ocupar aproximadamente **1/3 da altura anterior**.

- 513 pontos continuam sendo desenhados individualmente;
- 10 fileiras somam exatamente 513 cadeiras;
- os pontos usam a mesma equação geométrica das linhas-guia, eliminando cadeiras “fora das linhas”;
- clique em uma bancada destaca apenas seus assentos;
- a legenda mostra tamanho e apoio ao governo;
- base projetada e linha de maioria ficam visíveis sem dominar a tela.

Contagem das fileiras: `35 + 39 + 43 + 47 + 50 + 53 + 56 + 60 + 63 + 67 = 513`.

## 2. Quatro espaços de jogo

### Plenário

Mostra a composição e a **Ordem do Dia**. Projetos prontos para voto podem abrir a votação eletrônica animada. Projetos que retornam do Senado aparecem para sanção ou veto.

### Comissões

A matéria avança por um pipeline visual. Cada proposta registra:

- comissão atual;
- relator/liderança relacionada;
- tempo na etapa;
- pareceres e eventos;
- projeção de votos;
- polarização;
- urgência;
- histórico completo.

### Articulação

A “cúpula parlamentar” contém 10 personagens fictícios, entre Presidência da Câmara, liderança do governo, líderes de blocos e presidências de comissões. Cada um possui:

- relação com o Planalto;
- influência;
- ambição;
- lealdade;
- risco;
- pauta prioritária;
- perfil político.

O Presidente pode conversar reservadamente, dar protagonismo ou firmar compromisso de pauta. Essas relações agora repercutem nas projeções das matérias relacionadas ao bloco do ator.

### Banco de Leis

O antigo módulo separado de “Leis & Reformas” foi incorporado ao Congresso para não haver dois fluxos legislativos concorrentes.

O catálogo inicial possui **78 propostas fictícias, mas plausíveis no contexto brasileiro**, distribuídas em 13 áreas:

1. Economia
2. Tributação
3. Trabalho
4. Saúde
5. Educação
6. Segurança
7. Sociedade
8. Meio ambiente
9. Agro
10. Infraestrutura
11. Digital
12. Institucional
13. Defesa & Exterior

O banco aceita busca e filtros por área e instrumento (PL, PLP, PEC).

> Importante: as propostas são conteúdo de simulação. Não representam necessariamente projetos reais em tramitação no Congresso Nacional.

## 3. Tramitação

Cada lei define sua rota por comissões. O motor pode produzir eventos aleatórios como:

- pedido de vista;
- relator favorável;
- emenda de consenso;
- pressão das ruas;
- bancada rebelde;
- pressão de governadores;
- vazamento de bastidor;
- parecer técnico favorável.

A matéria pode sofrer atraso, ganhar ou perder votos, aumentar polarização e elevar o risco político do governo.

### PL

Usa maioria dos presentes, respeitando o quórum mínimo de presença modelado em 257 deputados.

### PLP

Exige maioria absoluta: 257 votos.

### PEC

Exige 308 votos (3/5 dos 513 deputados) e dois turnos na Câmara. PECs do catálogo não usam o atalho de urgência do modelo.

## 4. Poder de Bastidor

Novo recurso distinto de Capital Político.

Ele representa acesso, agenda, capacidade de coordenação, relações e poder informal do Planalto no Legislativo. É gasto em movimentos como:

- reunião de líderes;
- negociação do texto;
- priorização transparente de emendas de bancada;
- urgência;
- pressão pública;
- operação de bastidor.

Ações mais agressivas aumentam o **Risco de Vazamento**, que pode gerar eventos negativos. O Poder de Bastidor se regenera parcialmente a cada mês, e a regeneração é maior quando a base projetada é mais sólida.

## 5. Votação eletrônica

A votação deixou de ser uma resposta instantânea em texto.

Ao abrir o painel:

1. o motor calcula o resultado uma única vez;
2. o placar é revelado progressivamente;
3. SIM, NÃO e ABSTENÇÃO aparecem como uma apuração;
4. bancadas exibem suas projeções;
5. só depois o jogador registra o resultado;
6. o projeto segue para segundo turno, Senado ou arquivamento conforme o caso.

## 6. Senado e Presidência

Nesta etapa, o Senado permanece abstrato para não duplicar a complexidade antes da gameplay da Fase 5. Ele pode:

- aprovar e enviar à sanção;
- alterar o texto e devolvê-lo à Câmara.

Quando a matéria chega ao Planalto, o jogador pode sancionar ou vetar integralmente. Efeitos de gameplay só são aplicados quando a lei é sancionada.

## 7. Avatares

Foi adotado **DiceBear / Notionists** para os personagens políticos.

- o avatar é determinístico por `seed`;
- o mesmo personagem mantém o mesmo rosto;
- não há necessidade de armazenar imagens no save;
- se a API de avatar estiver indisponível, a UI cai automaticamente para iniciais estilizadas.

A integração atual usa a API HTTP para evitar acrescentar uma dependência ao bundle. Em uma fase posterior podemos empacotar o gerador localmente para funcionamento totalmente offline.

## 8. Ícones “de conquista” como linguagem global

Foi criado o componente reutilizável `GameIcon.jsx`, inspirado nos medalhões visuais das conquistas.

Ele já foi aplicado em:

- navegação principal;
- Congresso;
- Dashboard executivo;
- Indicadores;
- Geopolítica.

A regra para as próximas subfases é reutilizar esse componente para ícones de domínio e estados importantes, evitando voltar aos quadrados genéricos antigos.

## 9. Persistência

O save passou para versão 4 e inclui:

- estado do Congresso;
- Poder de Bastidor;
- risco de vazamento;
- acordos;
- atores e relações;
- propostas e histórico de tramitação;
- resultados legislativos.

Saves antigos v3/v2 continuam contemplados pela camada de migração já existente.

## Próximos refinamentos possíveis

A Fase 4.1 deixa espaço para evoluções futuras sem obrigar a implementá-las antes da primeira gameplay:

- Senado jogável com 81 cadeiras;
- CPI/CPMI;
- vetos parciais e derrubada de veto;
- medidas provisórias;
- emendas parlamentares individuais mais granulares;
- frentes parlamentares;
- fidelidade partidária, dissidências e troca de partido;
- Presidência da Câmara disputada em eleição;
- calendário legislativo e recesso;
- pressão de grupos organizados e opinião pública por pauta.

A recomendação é avaliar primeiro o ritmo desta camada na gameplay da Fase 5 antes de aumentar a granularidade.
