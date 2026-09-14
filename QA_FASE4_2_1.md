# QA — Fase 4.2.1

- 73 arquivos JS/JSX analisados pelo parser TypeScript/JSX: **0 erros de sintaxe**.
- Imports relativos analisados: **0 caminhos quebrados**.
- 27 UFs únicas, todas com governador e composição social somando 100%.
- 8 Projetos Especiais.
- 4 grupos de mídia nacionais, cada um com pelo menos 3 formatos editoriais.
- Motor fiscal testado em cenário-base, choque de custeio, infraestrutura e capital humano.
- Custeio elevado piora o primário/dívida/risco; infraestrutura e capital humano geram crescimento maior que custeio puro.
- Motor de opinião produz trade-offs entre grupos e aprovações diferentes entre UFs.
- Convites de mídia e análise de texto do Pulso testados.
- Teste da Fase 4.1 do Congresso continua passando: 78 leis, 14 comissões, 10 atores e 513 cadeiras.

## Limitação do ambiente

A instalação npm completa não terminou no ambiente de validação. Por isso o `vite build` não foi usado como critério final. Qualquer `node_modules` parcial foi removido do pacote final.
