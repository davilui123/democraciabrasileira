# QA — Fase 4.9.6.5

## Teste automatizado

Executar:

```bash
node scripts/test-fase4-9-6-5.mjs
```

Valida:

- cálculo de risco sobre o texto final negociado;
- abertura de controle STF e TCU para lei de alto risco;
- distribuição a ministro do STF;
- questionamentos constitucionais;
- escopo de auditoria do TCU;
- defesa institucional da lei;
- plano de adequação ao TCU;
- liminar;
- achados preliminares;
- julgamento colegiado;
- decisão final do TCU;
- persistência e marcadores de UI.

Todos os `scripts/test-*.mjs` existentes foram executados após a alteração.

## Roteiro manual

1. Aprove e sancione uma lei com risco STF ou TCU elevado.
2. Encerre o mês.
3. Abra **Instituições → Leis sob controle**.
4. Caso haja ação no STF, confira autor, relator, versão do texto e questionamentos.
5. Use **Defender constitucionalidade · 3 CP**.
6. Caso haja auditoria, use **Apresentar plano de adequação · 2 CP**.
7. Encerre o mês e confira liminar/achados preliminares.
8. Encerre novamente para chegar ao julgamento e à decisão do TCU.
9. Confira o resultado no card da lei e os efeitos em Capital Político, risco jurídico e bloqueios de execução.
10. Abra a Central de Notícias e valide que controles sem resposta entram em **Pendências**.

## Build

A regressão Node passou. O `npm ci` não concluiu no ambiente de geração dentro do tempo disponível, portanto valide localmente:

```bash
npm install
npm run build
```
