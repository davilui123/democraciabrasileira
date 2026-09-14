# Fase 4.6 — Conquistas & Progressão de Estado

## Objetivo
Substituir a antiga galeria de troféus por um sistema de progressão que reconhece feitos verificáveis do governo e devolve capacidade real de gameplay.

## Princípios
- Conquista não é decoração.
- Metas precisam ser mensuráveis pelo estado do jogo.
- Bônus permanentes devem atuar em sistemas existentes.
- Desbloqueios estruturais abrem decisões; não entregam ativos gratuitamente.
- Recompensas devem respeitar a teia entre Economia, Congresso, Estatais, Ministérios, Federação, STF, Pulso e Geopolítica.

## Catálogo
A Fase 4.6 possui 23 conquistas distribuídas entre Governo, Política, Sociedade, Economia, Desenvolvimento, Soberania, Exterior, Instituições e Legado.

Exemplos:
- Mandato Popular — 70% de aprovação; +15% de alcance presidencial no Pulso.
- Maioria Constitucional — 308 votos projetados; desconto na primeira articulação mensal de PEC.
- Primário no Azul — 3 meses consecutivos de superávit; libera Fundo de Estabilização Fiscal.
- Expectativas Ancoradas — 6 meses com inflação entre 1,5% e 4,5%; reduz risco e melhora resposta monetária.
- País em Obras — R$ 50 bi de investimento produtivo acumulado; libera requisito para programa nacional de investimentos na Fase 4.7.
- Domínio do Ciclo Nuclear — Nuclear 2040 concluído + ENBPar orientada à expansão; libera projeto de criação da EBTN.
- Soberania em Semicondutores — projeto concluído; libera expansão estratégica da CEITEC.
- Diplomacia de Estado — 3 parceiros >80 + 2 tratados; +1 ponto de mandato negocial.

## Recompensas estruturais
### Fundo de Estabilização Fiscal
Precisa ser implantado após desbloqueio. Custa capital político e reduz prêmio de risco/volatilidade fiscal.

### Empresa Brasileira de Tecnologia Nuclear (EBTN)
Entidade fictícia de gameplay. O desbloqueio NÃO cria a empresa automaticamente. O Presidente envia um PL ao Congresso; somente após tramitação, votação, Senado e sanção a empresa entra na rede estatal. A implantação custa investimento produtivo e aumenta soft power, com custo político/institucional.

### CEITEC — expansão estratégica
A CEITEC é tratada como empresa pública já existente. A recompensa financia sua entrada ampliada na rede estratégica do jogo, com foco em chips de potência, infraestrutura pública e foundry aberta.

### Comitê de Governança das Estatais
Requer ativação; eleva governança média e reduz risco jurídico/controle.

## Integrações permanentes
- `presidencia_popular`: +15% de alcance no Pulso.
- `ponte_constitucional`: 25% de economia de Poder de Bastidor na primeira articulação mensal de PEC.
- `expectativas_ancoradas`: reduz risco-país e o alvo implícito de Selic em choques moderados.
- `credito_soberano`: melhora impacto de financiamentos externos.
- `rede_biotecnologia`: reduz nascimento e escalada de problemas na Saúde.
- `diplomacia_presidencial`: +1 ponto na Mesa de Negociação.

## Investimento acumulado
O motor fiscal agora registra investimento produtivo e humano acumulado ao longo de todo o mandato, além do histórico mensal, para metas de longo prazo.

## Toasts
O App verifica conquistas conforme o estado muda e exibe toast dedicado com:
- ícone;
- nome da conquista;
- nome da recompensa;
- efeito/desbloqueio.
O evento histórico de conquista não dispara um segundo toast genérico.

## Persistência
Save atualizado para v9. Novos campos:
- `capacidadesDesbloqueadas`
- `recompensasEstruturaisAtivadas`
- `estatais` (necessário para empresas/desbloqueios persistentes)

Saves antigos continuam legíveis. IDs de conquistas obsoletas são filtrados e as novas metas são reavaliadas pelo estado atual da campanha.
