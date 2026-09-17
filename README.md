# Democracia Brasileira

Simulador político em React/Vite no qual o jogador ocupa a Presidência da República e governa por meio de instituições, coalizões, economia, opinião pública e relações internacionais.

## Estado da refatoração

- **Fase 1:** dados locais, persistência e desacoplamento de backend externo.
- **Fase 2:** Sala de Situação, atenção presidencial e problemas ministeriais.
- **Fase 3:** design system e frontend coeso.
- **Fase 4.1:** Congresso — plenário compacto de 513 cadeiras, banco de leis, comissões, tramitação, personagens, articulação e votação.
- **Fase 4.2 revisada:** Ministérios — 52 personagens, Conselho de Governo, telefone permanente, operações/minigames e grandes eventos nacionais.
- **Fase 4.2.1:** Federação, macroeconomia fiscal, grupos sociais, Pulso, mídia, governadores, agenda mensal e Projetos Especiais.
- **Fase 4.3:** Geopolítica & Diplomacia — poder soberano, Itamaraty, organizações, crises e negociação.
- **Fase 4.4.1:** Estatais, Instituições, STF, oposição, Pulso social e eventos federativos.
- **Fase 4.5:** Economia & Fazenda — controlador tributário, dívida, crédito, medidas anticíclicas e cenários macroeconômicos.
- **Fase 4.6:** Conquistas — metas verificáveis, bônus permanentes e desbloqueios estruturais ligados à capacidade do Estado.
- **Fase 4.6.1:** memória de decisões, Pulso reforçado, Empresas públicas/privadas, ExpoAgro e perfil presidencial com promessas de posse.
- **Fase 4.6.2:** Agenda Presidencial no Gabinete, visitas econômicas e Importação × Exportação.
- **Fase 4.6.2.1:** Agenda como calendário real: compromissos futuros, convites, datas, remarcações e execução mensal.
- **Fase 4.7:** Programas Governamentais — desenho, marco legal, execução, território, metas e promessas de posse.
- **Fase 4.7.1:** Personagens Institucionais — dossiês profundos para Câmara, STF, governadores e líderes estrangeiros.
- **Fase 4.8.1:** Eleições & Pré-campanha — convenções, vice, recursos, pesquisas, IA política global, 27 eleições estaduais, coerência e campanha.
- **Fase 4.8.2:** acontecimentos audiovisuais persistentes, com Isabela Ferraz como personagem-piloto.
- **Fase 4.8.3:** Central de Notícias, gabinete incompleto com consequências, STF redistribuído e cenas disparadas por fatos políticos reais do jogo.
- **Fase 4.9:** Motor Político Global — memória de personagens, movimentos autônomos e arquivo com múltiplas campanhas independentes.
- **Fase 4.9.1:** Movimentação Política Autônoma — ações dos personagens passam a alterar o estado do jogo; dossiês geopolíticos ganham idade e leitura aprofundada no padrão dos ministros.
- **Fase 4.9.2:** Mundo em Movimento — governos estrangeiros passam a pressionar autonomamente o Planalto, com respostas ramificadas, prazo, consequências, notícias e histórico diplomático.
- **Fase 4.9.3:** Governabilidade & Efeito Dominó — Capital Político vira freio real de poder; repertório internacional/federativo/institucional cresce e decisões passam a gerar cadeias de consequências entre sistemas.
- **Fase 4.9.4:** Orquestrador Político — histórias emergentes ganham prioridade, começo/meio/fim, escalada por silêncio, memória temporal, trilha causal e resolução persistente.
- **Fase 4.9.5:** Comércio Estratégico, Concorrência & Regulação — itens estratégicos, dependências, preferências geopolíticas, concorrência empresarial, novas medidas econômicas, logos/ilustrações com fallback e supervisão TCU/STF.
- **Fase 4.9.6.1:** Mega Catálogo Legislativo — 156 leis fictícias, cadeias pós-sanção, riscos STF/TCU/federativos, regulamentação futura, programas derivados e banco legislativo expandido.
- **Fase 4.9.6.2:** Agenda Legislativa Autônoma — oposição, Congresso e governadores protocolam projetos próprios; o Planalto escolhe posição e matérias externas podem avançar e ser votadas sem autorização presidencial.
- **Fase 4.9.6.3:** Emendas & Negociação do Texto — bancadas e comissões alteram projetos, o Planalto pode aceitar, contrapropor ou rejeitar demandas, versões do texto são persistidas e concessões modificam votos, custos e riscos do texto final.
- **Fases 5–7:** expansão da gameplay, integração sistêmica, balanceamento e fechamento do ciclo completo de governo.

Consulte `REFACTORACAO_FASE4_9_6_3.md` e `QA_FASE4_9_6_3.md` para a etapa atual.

## Executar

```bash
npm install
npm run dev
```
