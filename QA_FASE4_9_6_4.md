# QA — Fase 4.9.6.4

## Testes automatizados

Executar:

```bash
node scripts/test-fase4-9-6-4.mjs
```

O teste valida:
- geração dos dispositivos para veto parcial;
- cálculo do impacto retido;
- projeção Câmara/Senado;
- efeito da articulação presidencial sobre a projeção;
- deliberação automática do veto na virada;
- marcadores da interface e do store.

Também foram executados todos os scripts `scripts/test-*.mjs` existentes no projeto, sem regressões.

## Roteiro manual

1. Leve uma matéria até `aguardando_sancao`.
2. Confira as três opções: sanção integral, veto parcial e veto total.
3. Abra o veto parcial e selecione um ou mais dispositivos.
4. Confirme que a proposta aparece em **Vetos sob análise do Congresso**.
5. Confira a projeção separada de Câmara e Senado.
6. Use **Articular manutenção** e confirme a queda na projeção de derrubada e o gasto de CP/Poder de Bastidor.
7. Encerre o mês.
8. Confira se o veto foi mantido ou derrubado e se o histórico registra os dois placares.
9. Em veto parcial, confirme que a lei já estava parcialmente vigente e que a decisão do Congresso restaura ou preserva os dispositivos vetados.
10. Em veto total, confirme que a lei só produz efeitos se o veto for derrubado.

## Build

Os testes Node de regras de negócio passaram. O `npm ci` do ambiente de geração não concluiu dentro do tempo disponível e deixou a instalação incompleta; portanto, validar localmente:

```bash
npm install
npm run build
```
