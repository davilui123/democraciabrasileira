# QA — Fase 4.7.1 Personagens

## Validações executadas

- 106 arquivos JS/JSX analisados pelo parser TypeScript com JSX preservado: **0 erros de sintaxe**.
- 236 imports relativos verificados: **0 referências ausentes**.
- Smoke test `scripts/test-fase4-7-1.mjs`: aprovado.

## Integridade dos dossiês

- Cúpula da Câmara: **10/10** com agenda própria, rede de poder e vulnerabilidade.
- Governadores: **27/27** com dossiê narrativo.
- Líderes estrangeiros: **34/34 países** com personagem individualizado.
- STF: **10 ministros iniciais** com formação, trajetória, tese, rede, vulnerabilidade e estilo de voto.
- Candidatos ao STF: **6/6** com dossiê.
- Corte inicial: 1 Presidente, 1 Vice-Presidente, 1 Decano, 4 integrantes da 1ª Turma, 5 da 2ª Turma e 1 vaga institucional.

## UX

- Cúpula da Câmara paginada em até 6 atores por página; dossiê abre em modal, evitando crescimento vertical da tela.
- Governador usa dossiê dentro da página estadual.
- Líder estrangeiro possui botão de dossiê no modal do país.
- Mesa de Negociação exibe pressão doméstica e vulnerabilidade do interlocutor.
- STF usa visual de Presidência destacada + duas Turmas; as cadeiras são clicáveis.

## Compatibilidade

O schema principal do save não mudou. Ao carregar saves antigos, valores mutáveis (relação, popularidade, processos etc.) são preservados e os novos campos narrativos são reanexados do catálogo atual.

## Build

Não foi feita nova instalação de dependências neste pacote. A validação foi feita por parser JS/JSX, imports e smoke tests de domínio.
