# Fase 4.9.6.1 — Mega Catálogo Legislativo

## Objetivo

Transformar o Banco de Leis do Congresso em um catálogo amplo, navegável e preparado para as próximas etapas da DLC legislativa: agenda autônoma da oposição/governadores, emendas, veto, judicialização, regulamentação e programas derivados.

## Expansão do catálogo

- Catálogo anterior: **78 leis**.
- Novas propostas: **78 leis**.
- Catálogo total: **156 leis fictícias**.
- 13 áreas legislativas, agora com **12 propostas cada**:
  - Economia e Desenvolvimento
  - Tributação
  - Trabalho e Previdência
  - Saúde
  - Educação e Ciência
  - Segurança e Justiça
  - Direitos e Sociedade
  - Meio Ambiente e Clima
  - Agricultura e Desenvolvimento Rural
  - Infraestrutura e Energia
  - Digital, Dados e Inovação
  - Estado e Instituições
  - Defesa e Relações Exteriores

## Cadeias pós-sanção

Todas as 156 leis, inclusive as 78 anteriores, agora carregam uma estrutura de consequências em quatro momentos:

1. reação imediata após aprovação/promulgação;
2. implantação e efeito operacional;
3. teste político, federativo e/ou institucional;
4. legado estrutural.

Leis centrais receberam cadeias específicas, incluindo Regra Fiscal, IGF, Trabalho por Plataformas, Licenciamento Ambiental, Armas, Mercado de Carbono, IA, Semicondutores, Minerais Críticos, Fim da Reeleição e Reforma Administrativa.

## Metadados preparados para a DLC completa

Cada proposta passa a possuir:

- `cadeiaConsequencias`;
- `riscosControle.stf`;
- `riscosControle.tcu`;
- `riscosControle.federativo`;
- `riscosControle.implementacao`;
- `regulamentacao` (necessidade, prazo, etapas e risco de inércia);
- `programasDerivados`;
- `atoresAfetados`;
- `origensPermitidas` (Executivo, Congresso e, quando aplicável, governadores);
- `legadoPotencial`;
- `eixoEstrategico`.

Esses campos são ganchos diretos para as fases 4.9.6.2 a 4.9.6.7.

## Banco de Leis

O catálogo do Congresso foi adaptado para o volume maior:

- busca por título, descrição, tags e programas derivados;
- filtro por categoria;
- filtro por instrumento (PL, PLP e PEC);
- filtro por propostas que exigem regulamentação;
- filtros por risco STF, TCU e federativo;
- filtro de alto impacto sistêmico;
- ordenação por apoio, polarização, custo político, risco STF, risco TCU ou ordem alfabética;
- card expansível com a cadeia de consequências prevista;
- visualização de riscos de controle e implementação;
- indicação dos programas que a lei poderá originar futuramente.

## Compatibilidade

O catálogo é carregado a partir dos seeds atuais. Campanhas antigas continuam válidas e recebem o catálogo expandido ao carregar o jogo, sem exigir reset do save.

## Próximas etapas

- 4.9.6.2 — Agenda legislativa autônoma: oposição, Congresso e governadores passam a protocolar matérias.
- 4.9.6.3 — Emendas, substitutivos, destaques e negociação de texto.
- 4.9.6.4 — Sanção, veto parcial/total e derrubada de veto.
- 4.9.6.5 — STF/TCU e judicialização/fiscalização pós-aprovação.
- 4.9.6.6 — Regulamentação, decretos e programas derivados.
- 4.9.6.7 — Legado legislativo e memória eleitoral do mandato.
