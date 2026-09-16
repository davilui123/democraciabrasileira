# Fase 4.9 — Motor Político Global + Multi-campanhas

A 4.9 inicia a camada em que personagens deixam de existir apenas como fichas ou gatilhos isolados e passam a manter **estado político, memória e movimentos próprios** entre os meses.

## 1. Multi-campanhas

O save único foi substituído por um arquivo de campanhas. Cada novo presidente recebe um `campaignId` independente e o jogo mantém quantas campanhas o navegador comportar.

### Fluxo

- **Nova campanha** cria um slot novo sem apagar os anteriores.
- **Continuar mais recente** abre o save atualizado mais recentemente.
- O **Arquivo presidencial** lista todas as campanhas, com presidente, data, turno, aprovação, ministros e leis.
- Cada campanha possui botão próprio para retomar e exclusão individual.
- Dentro do jogo, **Trocar campanha** retorna ao arquivo presidencial.
- O antigo save único da 4.8.x é migrado automaticamente para uma campanha na primeira abertura da 4.9, sem apagar a chave original.

A persistência passa para a versão 16 e utiliza:

- `democracia-brasileira:campaign:v16:<id>` — conteúdo de cada campanha;
- `democracia-brasileira:campaign-index:v16` — índice e metadados;
- `democracia-brasileira:active-campaign:v16` — campanha atualmente selecionada.

## 2. Motor político global — primeira fundação

Novo módulo: `src/game/politicalActorEngine.js`.

O motor descobre personagens a partir do mundo existente e mantém um registro persistente. Nesta primeira versão entram:

- 27 governadores;
- ministros nomeados;
- lideranças do Congresso com influência relevante.

Cada ator pode carregar:

- relação com o Planalto;
- ambição;
- popularidade;
- influência;
- postura atual;
- momentum;
- último movimento;
- memórias políticas recentes.

## 3. Memória política

A relação deixa de ser somente um número. Interações importantes passam a criar registros explicáveis no personagem.

Nesta entrega, governadores lembram de:

- pacto, prestígio ou pressão do Planalto;
- investimentos federais no estado;
- respostas presidenciais a crises federativas;
- movimentos autônomos gerados pela própria IA.

Essas memórias aparecem no dossiê do governador em **Brasil & Estados → Governador**.

## 4. Movimentos autônomos

Ao fechar o mês, o motor avalia os atores e pode produzir uma movimentação política sem comando direto do jogador. A frequência é limitada para não transformar cada virada em ruído.

Exemplos já suportados pela fundação:

- governador de alta ambição sinalizando projeção nacional;
- governador com relação ruim endurecendo contra o Planalto;
- aliado estadual buscando aproximação;
- ministro ambicioso construindo agenda própria;
- liderança congressual pressionando o governo.

O movimento entra no histórico/notificações e também se torna memória do personagem.

Isabela Ferraz é o principal piloto: sua combinação de popularidade, ambição e peso político já permite que o motor reconheça a possibilidade de projeção nacional, sem transformá-la automaticamente em candidata.

## Próximos passos da 4.9

A fundação permite avançar para decisões de carreira reais: saída de ministério, troca de partido, lançamento de candidatura, apoio a terceiros, escolha de sucessor estadual, alianças e rompimentos com consequências sistêmicas.
