# QA — Fase 4.9.7.2

## Teste rápido
1. Abra **Partidos**.
2. Confirme a nova aba **Vida interna**.
3. No partido presidencial, verifique satisfação, unidade, caixa, filiados e prestígio.
4. Execute uma ação da Executiva e confirme débito de caixa/CP.
5. Em **Alas internas**, use `Apaziguar ala` e confira a mudança de satisfação.
6. Em **Diretórios estaduais**, selecione uma UF e use `Fortalecer diretório`.
7. Encerre um mês e confira:
   - balanço do fundo;
   - evolução da máquina;
   - histórico partidário;
   - possíveis crises internas;
   - variação das alas e diretórios.
8. Observe o Congresso: partidos com disciplina alta devem manter comportamento de bancada mais coerente que partidos fragmentados.
9. Mantenha um ministro sem partido por vários meses com boa eficácia/lealdade ou forte atrito/ambição. A filiação pode surgir autonomamente.
10. Ao ocorrer, confirme a filiação no dossiê do ministro e em **Partidos → Vida interna**.

## Automação
Execute:

```bash
node scripts/test-fase4-9-7-2.mjs
```

A regressão completa pode ser verificada com:

```bash
for f in scripts/test-*.mjs; do node "$f" || exit 1; done
```

## Resultado desta entrega
- 4 partidos dinâmicos;
- 12 alas vivas;
- 108 diretórios estaduais vivos;
- 5 ações partidárias;
- filiação ministerial emergente;
- disciplina integrada à projeção legislativa.

## Build
O `npm ci` não concluiu no ambiente de geração. Rode localmente `npm install` e `npm run build` antes do deploy no Vercel.
