# QA — Fase 4.9.6.6

## Fluxo principal

1. Sancione/promulgue uma lei cuja ficha indique necessidade de regulamentação.
2. Abra **Programas → Regulamentação**.
3. Confirme que a lei aparece na fila com prazo, programa sugerido e versão do texto.
4. Abra a lei e percorra as quatro etapas do configurador.
5. Alterne entre os três ritmos e verifique mudança no risco/custo/eficiência.
6. Alterne entre piloto, estruturante e nacional.
7. Escolha implantação territorial e selecione UFs/regiões.
8. Troque modelo de execução, financiamento e governança.
9. Na publicação, confira atualização do placar de Qualidade Regulatória.
10. Publique.
11. Confirme redução de Capital Político e capacidade normativa quando aplicável.
12. Confirme criação do programa em implantação na carteira de Programas.
13. Verifique que território, modelo, fonte, governança e prioridade escolhidos foram preservados.

## Capacidade normativa

- Sem Casa Civil/Justiça: teto esperado de 2.
- Casa Civil nomeada: teto esperado de 3.
- Casa Civil + Justiça: teto esperado de 4.
- Lei complexa pode consumir 2 pontos.
- A capacidade deve renovar na virada mensal.
- Não deve ser possível publicar uma regulamentação sem capacidade suficiente.

## Atraso

1. Deixe uma lei pendente ultrapassar seu prazo.
2. Encerre o mês.
3. Verifique `mesesEmAtraso`.
4. Confira evento/notícia de regulamentação atrasada.
5. Se a gravidade for suficiente, confirme perda de Capital Político.
6. Confira o resumo **Regulamentação & implementação** no relatório mensal.

## Programas derivados

- Devem conter `derivadoDeLei=true`.
- Devem preservar `leiId`, `leiOrigemId`, `propostaOrigemId` e `regulamentacaoId`.
- Devem nascer em `implantacao`.
- Não criar duplicata se a lei já tiver programa vinculado.

## Controle institucional

- STF com bloqueio integral deve impedir execução do programa ligado à lei.
- TCU com suspensão de despesas deve impedir execução.
- Restrições parciais devem piorar risco/execução sem necessariamente bloquear totalmente.
- Programa bloqueado deve poder retomar quando o bloqueio desaparecer.

## Compatibilidade de save

- Save antigo sem `regulamentacaoLeis` deve carregar com estado padrão.
- Leis vigentes antigas devem entrar na fila após sincronização.
- `regulamentacaoLeis` deve persistir em campanhas salvas.

## Testes automatizados

Executar:

```bash
node scripts/test-fase4-9-6-6.mjs
```

Para regressão completa:

```bash
for f in scripts/test-*.mjs; do node "$f" || exit 1; done
```

Também executar localmente, com dependências instaladas:

```bash
npm install
npm run build
```
