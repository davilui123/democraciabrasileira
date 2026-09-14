# QA — Fase 4.4.1

## Validações realizadas

- 86 arquivos JS/JSX processados pelo parser TypeScript com JSX: **0 erros sintáticos**.
- 181 imports relativos conferidos: **0 referências ausentes**.
- 27 eventos federativos e 27 UFs únicas.
- Todas as referências a ministérios dos eventos apontam para pastas existentes.
- 10 estatais estratégicas.
- 30 diretrizes de estatais.
- STF inicia com 10 ministros + 1 vaga = 11 cadeiras.
- 6 candidatos à indicação presidencial para o STF.
- Projeção de votação no Senado testada com quórum de 41/81.
- Criação e julgamento posterior de ADI testados.
- 14 personagens comunitários do Pulso.
- Geração de comentários do Pulso ligada a evento/pai testada.

## Build

O pacote final não inclui `node_modules`. O build completo com Vite não foi usado como validação desta rodada no ambiente de execução; a verificação foi feita por parsing, imports e testes dos motores independentes.

Localmente:

```bash
npm install
npm run dev
```
