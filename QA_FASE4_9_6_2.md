# QA — Fase 4.9.6.2

## Teste automatizado

Execute:

```bash
node scripts/test-fase4-9-6-2.mjs
```

O teste valida:
- geração forçada por oposição, Congresso e governadores;
- autoria e patrocinadores;
- impacto da posição presidencial na projeção;
- votação autônoma após um mês na Ordem do Dia;
- presença da aba Agenda da Casa;
- integração com a Central de Notícias.

## Roteiro manual

1. Inicie campanha nova e avance alguns meses.
2. Abra **Congresso → Agenda da Casa**.
3. Aguarde uma iniciativa autônoma.
4. Confira autoria, origem e patrocinadores.
5. Escolha **Apoiar** e observe a projeção.
6. Em outra iniciativa, escolha **Opor-se** e compare.
7. Deixe uma iniciativa sem resposta e avance meses até chegar ao Plenário.
8. Confirme que ela é votada mesmo sem clicar em “Abrir votação”.
9. Confira notificações e **Central de Notícias → Pendências**.
10. Salve e recarregue a campanha; o histórico da agenda autônoma deve permanecer.

## Regressão executada

Foram executados os testes de 4.8.3, 4.9, 4.9.1, 4.9.2, 4.9.3, 4.9.4, 4.9.5, 4.9.6.1 e 4.9.6.2.
