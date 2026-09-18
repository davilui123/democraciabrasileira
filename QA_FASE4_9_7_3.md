# QA — Fase 4.9.7.3

## Teste rápido
1. Inicie uma campanha e abra **Política → Partidos**.
2. Selecione o partido presidencial e abra **Partido no poder**.
3. Confira relação, coerência, espaço ministerial, núcleo estratégico e compromissos.
4. Avance meses com pouca presença do partido no gabinete. A Executiva deve apresentar uma cobrança.
5. Teste as três respostas: assumir, negociar e recusar.
6. Ao assumir cobrança de cargos, nomeie um ministro filiado ao partido e feche o mês. O compromisso deve ser reconhecido.
7. Ao assumir cobrança de agenda, inclua a pauta exigida na Agenda Presidencial antes de encerrar o mês.
8. Ao assumir uma bandeira, protocole a lei exigida no Congresso.
9. Ignore uma cobrança até o prazo: a relação e o apoio da bancada devem sofrer.
10. Abra a **Central de Notícias → Pendências** e confirme que cobranças sem resposta aparecem ali.

## Automação
```bash
node scripts/test-fase4-9-7-3.mjs
```

Regressão:
```bash
for f in scripts/test-*.mjs; do node "$f" || exit 1; done
```
