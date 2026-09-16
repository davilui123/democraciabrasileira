# QA — Fase 4.9.4

## Teste automatizado

```bash
node scripts/test-fase4-9-4.mjs
```

O teste valida:

- detecção simultânea de múltiplas histórias;
- criação da fila de prioridade;
- convergência de crises relacionadas em um único enredo dominante;
- limite de dois avanços narrativos por mês;
- efeitos reais na escalada;
- reconhecimento de condições de resolução e arquivamento;
- envelhecimento de memórias comuns e preservação de marcas estruturais;
- persistência do Orquestrador no save;
- aba `Em curso` e trilha causal na Central de Notícias;
- resumo de histórias no relatório mensal;
- escalada por silêncio em crises federativas.

## QA manual recomendado

1. Abra uma campanha existente da 4.9.3 e confirme que ela carrega normalmente.
2. Avance meses com ministérios estratégicos vagos. Abra `Central de Notícias → Em curso` e confirme a história do vazio de comando.
3. Deixe uma crise federativa sem resposta por pelo menos uma virada e confirme a cobrança pública e perda política.
4. Gere/respond a uma pressão comercial externa de forma confrontacional e acompanhe a cadeia pela aba `Em curso`.
5. Confirme que várias condições podem ficar ativas, mas apenas as mais importantes avançam de estágio na mesma virada.
6. Resolva a causa de uma crise (por exemplo, recomponha gabinete ou reduza inflação) e confirme que ela vai para `Histórico recente`.
7. Confira o relatório mensal: as principais histórias devem aparecer em `Histórias em curso`.
8. Salve, feche e reabra a campanha; estágios e histórico devem permanecer.

## Regressões

Foram mantidos os testes das fases 4.8.3, 4.9, 4.9.1, 4.9.2 e 4.9.3.
