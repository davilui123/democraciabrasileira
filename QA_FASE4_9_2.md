# QA — Fase 4.9.2

## Teste automatizado

```bash
node scripts/test-fase4-9-2.mjs
```

Valida:

- geração determinística de pressão internacional;
- três escolhas presidenciais;
- registro da resposta;
- efeito bilateral;
- expiração de uma demanda ignorada;
- presença da aba Pressões;
- integração com a Central de Notícias;
- catálogo mínimo de Rússia, China, EUA, Alemanha e Argentina.

## Roteiro manual recomendado

1. Inicie ou retome uma campanha.
2. Avance os meses normalmente.
3. Quando surgir uma manchete internacional com demanda ao Planalto, abra a Central de Notícias.
4. Confirme que a pressão aparece em `Pendências` com três respostas.
5. Responda e confira:
   - retirada da pendência;
   - nova manchete no radar;
   - alteração da relação com os países afetados;
   - registro em `Geopolítica → Pressões → Respostas recentes`.
6. Em outra campanha, deixe uma pressão sem resposta por tempo suficiente para vencer o prazo.
7. Confirme que ela aparece como `sem resposta` e gera custo diplomático.
8. Teste especialmente os cenários de Rússia, China e EUA em campanhas diferentes; o sistema não obriga nenhum deles a ser o primeiro.

## Regressão

Executar também:

```bash
node scripts/test-fase4-8-1.mjs
node scripts/test-fase4-8-2.mjs
node scripts/test-fase4-8-3.mjs
node scripts/test-fase4-9.mjs
node scripts/test-fase4-9-1.mjs
```
