# Refatoração — Fase 4.9.6.5

## Judicialização & Controle — STF + TCU

A 4.9.6.5 fecha a etapa pós-sanção do pacote legislativo: uma lei pode sair do Congresso, receber sanção/veto e ainda assim enfrentar controle constitucional e controle externo durante sua execução.

### Texto efetivamente controlado

O motor usa `proposta.textoFinal`, portanto considera:

- versão negociada do projeto;
- emendas incorporadas;
- impacto fiscal criado pelas emendas;
- riscos STF/TCU atualizados durante a negociação;
- veto parcial ou derrubada/manutenção do veto;
- vigência integral ou parcial.

### STF

Leis vigentes podem gerar uma ação de controle conforme o risco jurídico do texto final. O caso registra:

- autor da ação;
- tipo do processo;
- relator entre os ministros da Corte da campanha;
- questionamentos constitucionais relacionados à matéria;
- análise de liminar no mês seguinte;
- julgamento colegiado posterior;
- votos individuais dos ministros;
- resultado: constitucional, inconstitucional parcial ou inconstitucional total.

O governo pode gastar **3 CP** para mobilizar a defesa institucional da lei antes da decisão.

Uma liminar ou julgamento pode marcar programas derivados com bloqueios de execução, sem apagar o histórico legislativo.

### TCU

Leis com risco fiscal, contratos, fundos, subsídios, transferências ou alta complexidade de execução podem entrar em acompanhamento do TCU.

Fluxo:

1. auditoria aberta;
2. achados preliminares;
3. decisão.

O governo pode gastar **2 CP** para apresentar plano de adequação e reduzir o risco da decisão.

Resultados possíveis:

- regularidade;
- ressalvas;
- determinação de ajustes;
- suspensão cautelar de despesas.

O TCU não invalida a lei. Os efeitos incidem sobre execução, governança e gasto.

### Interface

`Instituições` ganhou a aba **Leis sob controle**, com duas colunas:

- processos legislativos no STF;
- acompanhamentos do TCU.

A Central de Notícias e o Radar contam processos que ainda aguardam defesa ou plano de adequação como pendências presidenciais.

### Persistência

Novo estado persistido:

```js
controleLeis: {
  casosSTF: [],
  auditoriasTCU: [],
  leisMonitoradas: [],
  historico: []
}
```

Campanhas anteriores recebem esse estado por fallback ao serem carregadas.

### Próxima etapa

A estrutura já deixa a 4.9.6.6 preparada para regulamentação: decretos, normas técnicas, orçamento, pactuação federativa e programas derivados poderão consultar os bloqueios de STF/TCU antes de avançar.
