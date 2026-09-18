# QA — Fase 4.9.7.5

## Teste automatizado

Execute:

```bash
node scripts/test-fase4-9-7-5.mjs
```

O teste valida:
- 27 diretórios convertidos em mapa de delegados;
- apoio nacional e regional;
- três alas participando da convenção;
- federação ativa chegando ao ecossistema eleitoral;
- 27 candidaturas estaduais;
- distribuição do fundo somando 100%;
- redistribuição de 5 p.p.;
- homologação local;
- composição com aliado;
- imposição nacional com custo de Capital Político;
- homologação da convenção;
- cota presidencial derivada do fundo;
- impacto da máquina eleitoral;
- FEFC liberado apenas uma vez.

## Regressão recomendada

```bash
node scripts/test-fase4-8-1.mjs
node scripts/test-fase4-9-7-1.mjs
node scripts/test-fase4-9-7-2.mjs
node scripts/test-fase4-9-7-3.mjs
node scripts/test-fase4-9-7-4.mjs
node scripts/test-fase4-9-7-5.mjs
```

## Teste manual no jogo

1. Avance uma campanha até 2026.
2. Abra **Eleições 2026 → Partido & Convenção**.
3. Confira o total de delegados, apoio por região e alas.
4. Faça um acordo com uma liderança e confirme que o apoio é recalculado.
5. Em **Fundo & recursos**, mova 5% para a Presidência e verifique se o total continua 100%.
6. Em **Candidaturas estaduais**, escolha estratégias diferentes em três UFs.
7. Confira em **Estados** que a decisão partidária aparece na corrida estadual.
8. Se houver aliança/federação, escolha um vice do aliado e confira o bônus de encaixe.
9. Entre 20/07 e 05/08, finalize a convenção.
10. Verifique se a cota do FEFC presidencial corresponde à distribuição escolhida.
11. Tente captar o fundo duas vezes: a segunda tentativa deve ser bloqueada.
12. Durante a convenção sem homologação, abra a Central de Notícias e confira a pendência.

## Build

No ambiente local:

```bash
npm install
npm run build
```

O ambiente de geração pode não ter todas as dependências npm em cache; por isso o build completo deve ser confirmado no projeto local antes do deploy no Vercel.
