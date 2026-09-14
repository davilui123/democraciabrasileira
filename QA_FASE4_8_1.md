# QA — Fase 4.8.1

## Validação estrutural

- 108 arquivos JS/JSX analisados pelo parser TypeScript: **0 erros sintáticos**.
- 246 imports relativos verificados: **0 referências ausentes**.
- Save atual: **v14**, mantendo leitura das versões anteriores.

## Catálogo eleitoral

- 27 adversários estaduais, um por UF.
- 27 corridas para governador.
- 12 caciques partidários.
- 4 Vice-Presidentes atuais possíveis, conforme o partido do jogador.
- 7 ações eleitorais, incluindo desinformação abstrata de alto risco.
- 4 modalidades de captação pré-eleitoral/eleitoral.
- 3 rodadas no minigame de debate.

## Smoke test `scripts/test-fase4-8-1.mjs`

Validado:

- pesquisa inicial com 55% de indecisos;
- fases do calendário eleitoral;
- barganha de convenção e crescimento do apoio entre delegados;
- oficialização com apoio suficiente;
- crowdfunding bloqueado antes da data e liberado depois;
- reincidência em desinformação elevando risco jurídico e podendo desclassificar a candidatura;
- criação de candidatura presidencial a partir de ministro e liderança da Câmara;
- pool dinâmico de vice;
- cálculo de compatibilidade do vice;
- apoio presidencial a candidato estadual.

## Regressão

Executados com sucesso:

- `test-fase4-7-1.mjs`
- `test-fase4-7.mjs`
- `test-fase4-6-2-1.mjs`

## Observação de build

A validação desta etapa cobre sintaxe, imports e motores de domínio. Não declarar build Vite completo aprovado sem executar `npm install`/`npm run build` em ambiente com dependências instaladas.
