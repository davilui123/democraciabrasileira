# Democracia Brasileira — Refatoração Fase 1

## Objetivo
Remover a dependência de banco/backend do núcleo do jogo e criar uma base confiável para evoluir o projeto como simulador político.

## Problemas encontrados

1. `src/data/db.js` implementava um CRUD em memória, enquanto `src/data/index.js` e os seeds esperavam uma API de banco (`open`, `count`, `bulkAdd`, `toArray`).
2. A maioria dos repositories usava métodos `static`, mas `data/index.js` criava instâncias e o store chamava os métodos como se fossem de instância.
3. Não existia repository de blocos na fachada utilizada pelo store.
4. Os candidatos reais a ministro estavam em `ministros.js`, mas não eram associados aos ministérios carregados.
5. Os problemas estruturais estavam definidos em `problemas.js`, mas o estado `problemasEstruturais` permanecia vazio.
6. O estado da campanha não tinha uma estratégia independente de backend para persistência.

## O que foi alterado

### Dados-base sem banco
`src/data/index.js` agora funciona como catálogo estático versionado. Ministérios, países, leis, cartas, commodities, STF e demais dados são carregados diretamente dos seeds.

Isso significa:
- sem Supabase;
- sem servidor;
- sem migração de schema;
- conteúdo reproduzível pelo Git;
- deploy estático possível.

### Persistência local de campanha
Foi criado `src/services/saveService.js`.

A campanha agora pode ser persistida em `localStorage`, com:
- versão de save;
- data do save;
- salvar;
- carregar;
- limpar;
- exportar JSON;
- importar JSON;
- autosave ao avançar o mês.

### Conteúdo reativado
O carregamento inicial agora:
- associa `ministrosSeed` aos respectivos ministérios;
- organiza `problemasSeed` por ministério e origem;
- carrega commodities, países, cartas, leis, estatais, STF e ministérios diretamente do catálogo local.

## Arquitetura recomendada para as próximas fases

```text
src/
├── game/
│   ├── engine/          # processamento de turnos, RNG, regras e calendário
│   ├── systems/         # Congresso, economia, STF, ministérios, opinião pública
│   ├── events/          # eventos e crises
│   ├── decisions/       # decisões presidenciais
│   └── selectors/       # estado derivado para a UI
├── content/             # conteúdo estático/data-driven
├── services/            # saves, importação/exportação
├── store/               # estado da campanha
└── components/          # apresentação
```

## Próximos upgrades prioritários

1. Separar `useGameStore.js` em slices/sistemas. Hoje ele concentra regras demais.
2. Criar um `TurnEngine` determinístico com seed aleatória para permitir replay e testes.
3. Transformar Congresso em Câmara + Senado, quóruns distintos, PEC/PL/MP e coalizões.
4. Adicionar agenda presidencial e custo de atenção por mês.
5. Criar sistema de opinião pública por grupos e regiões, não apenas popularidade geral.
6. Criar máquina de eventos/crises com condições, escolhas, consequências imediatas e atrasadas.
7. Introduzir governadores, bancadas estaduais e federação.
8. Modelar Banco Central, política fiscal, dívida, desemprego, câmbio e expectativas.
9. Transformar ministros em agentes com ambição, lealdade, competência, ideologia e escândalos.
10. Criar final de mandato, eleição, transição, impeachment/renúncia e condições de derrota.
11. Adicionar testes automatizados para regras do jogo.
12. Criar tela de Novo Jogo / Continuar / Gerenciar Saves.

## Validação
Os arquivos JavaScript alterados foram validados sintaticamente com Node.

O build completo não pôde ser finalizado neste ambiente porque o ZIP original continha `node_modules` de outra plataforma e a reinstalação das dependências excedeu o limite de execução da sessão. Recomenda-se executar localmente:

```bash
rm -rf node_modules
npm install
npm run build
```
