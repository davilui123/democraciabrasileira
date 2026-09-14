# Fase 4.3 — Geopolítica & Diplomacia

## Objetivo
Transformar Geopolítica em um sistema jogável de política externa, conectado a Ministérios, Congresso, Economia, Pulso, Projetos Especiais e à futura camada institucional/STF.

## 1. Ministério das Relações Exteriores
A Esplanada agora possui `m_exteriores` como pasta completa. O Itamaraty participa do mesmo motor dos demais ministérios: nomeação, relação com o Presidente, problemas estruturais, telefonemas e operações.

Há quatro candidatos escritos como personagens, não arquétipos genéricos:
- Helena Sampaio — diplomata de carreira e autonomista institucional;
- Marcelo Vilar — senador, comercial e atlanticista;
- Amina Barreto — acadêmica, clima e Sul Global;
- Danilo Ferraz — inteligência econômica, tecnologia e soberania.

O chanceler aconselha e acumula capacidade diplomática. Decisões soberanas continuam reservadas ao Presidente.

## 2. Poder soberano presidencial
No dossiê de cada país existe uma área de instrumentos presidenciais:
- sanções/embargos;
- mobilização nacional;
- operações encobertas abstratas de inteligência;
- reconhecimento de soberania;
- tratado estratégico;
- autorização de uso da força.

As ações afetam relação bilateral, tensão global, soft power, risco-país, inflação, prontidão, inteligência, opinião pública e Congresso. Sanções permanecem no tempo e podem produzir retaliação comercial e alerta humanitário. Uso da força exige Ministério da Defesa e estado de emergência previamente ativado.

Guerra/mobilização e tratados estratégicos também consomem Poder de Bastidor no Congresso, representando a autorização/referendo legislativo. É um elo inicial; uma sessão extraordinária dedicada pode ser criada em fase posterior.

## 3. Nova navegação sem página infinita
A tela de Geopolítica foi dividida em páginas internas:
- Visão Global;
- Países;
- Itamaraty;
- Organizações;
- Crises;
- Legado.

A lista de países usa paginação de oito dossiês por página. O módulo controla a própria altura e evita que o jogador percorra uma página vertical gigantesca.

O modal de país foi refeito como modal fixo de viewport. Também foi removida a transformação vertical global da animação `fadeIn`, que fazia elementos `position: fixed` se comportarem como se pertencessem ao conteúdo rolável.

## 4. Dossiê bilateral
Os 34 países existentes foram preservados. Cada dossiê mostra:
- relação bilateral;
- blocos;
- soft power e pressão ambiental;
- interesses no Brasil;
- recursos e leitura do Itamaraty;
- chefe de governo fictício da linha temporal do jogo;
- janela de negociação presidencial;
- tratados e marcas permanentes de decisões soberanas.

Os líderes estrangeiros são fictícios para não atrelar a campanha a ocupantes reais de cargos.

## 5. Mesa de Negociação Presidencial
A negociação não pode ser aberta a qualquer momento. É preciso existir uma janela diplomática criada por:
- visita de Estado;
- crise internacional;
- evento global;
- Projeto Especial;
- arena multilateral.

Após uma negociação, o canal presidencial entra em resfriamento por quatro meses.

A mesa é um jogo de dedução e montagem de pacote:
1. sondar comércio, segurança e política para revelar interesses;
2. identificar interesses vitais do outro governo;
3. montar uma oferta com até três ativos de Estado;
4. proteger ou sacrificar linhas vermelhas brasileiras;
5. comparar força do pacote e resistência do outro lado.

Existem 18 ativos, incluindo acesso ao mercado, crédito, tecnologia, cooperação de defesa, votos multilaterais, energia, alimentos, logística e mediação.

## 6. Itamaraty e cartas diplomáticas
As cartas diplomáticas anteriores foram preservadas como repertório institucional acumulado. O nível e o XP diplomático desbloqueiam instrumentos. A página do Itamaraty mostra o acervo e permite aplicar cartas nos relacionamentos bilaterais.

Projetos Especiais passaram a abrir canais externos automaticamente. Exemplos:
- semicondutores: EUA, Japão, Coreia e Alemanha;
- nuclear: França, Rússia e EUA;
- terras raras: EUA, China, Japão e Alemanha;
- vacinas, IA, ferrovias, espaço e Amazônia possuem parceiros próprios.

## 7. Organizações internacionais com função
Foram estruturadas oito arenas:
- ONU;
- Conselho de Segurança;
- BRICS;
- Mercosul;
- G20;
- OMC;
- OEA;
- OTAN.

Elas não são filtros. Cada uma possui instrumentos, custo e efeitos diferentes. ONU/CSNU/OEA podem reduzir intensidade de crises; BRICS abre canais econômicos/tecnológicos; Mercosul reforça relações regionais; G20 e OMC ajudam ambiente econômico/comercial; diálogo com OTAN aumenta prontidão e inteligência, mas pode elevar tensão. O Brasil aparece como interlocutor externo da OTAN, não como membro.

## 8. Crises internacionais
Há dez matrizes de crise, entre fronteira regional, energia, semicondutores, Amazônia, Mercosul, cibernética, alimentos, subsídios, ruptura institucional e proliferação nuclear.

Crises amadurecem no tempo e podem abrir janelas de negociação. Respostas multilaterais e mediação tendem a aumentar credibilidade e soft power.

## 9. Feed internacional + Pulso
O banco inicial possui 60 acontecimentos internacionais que alimentam um feed vivo. Notícias cobrem tecnologia, energia, comércio, clima, defesa, alimentos, finanças, saúde, espaço, cadeias produtivas, cultura e governança.

Os acontecimentos relevantes também viram posts de Global, N1, Mundi ou Canal Geral no Pulso. Política externa passa a repercutir na mesma rede social usada pelo restante do governo.

## 10. Legado geopolítico
O Presidente pode consolidar uma doutrina de longo prazo:
- Potência Diplomática;
- Potência Econômica;
- Potência Militar;
- Potência Tecnológica.

A escolha altera grupos sociais e define a direção estratégica do mandato. A intenção é que projetos, nomeações e decisões posteriores reforcem ou entrem em conflito com esse legado.

## 11. Correções de UI
- modal de país centralizado no viewport;
- modal de nomeação ocupa a viewport e mantém rodapé/botão de confirmar visível;
- Geopolítica usa páginas/paginação em vez de scroll vertical longo;
- medidores usam classes Tailwind estáticas;
- uso da força informa custos de Capital Político e Poder de Bastidor.

## Próximos elos sugeridos
- sessão extraordinária no Congresso para guerra, paz e grandes tratados;
- Conselho de Defesa Nacional;
- reações do STF a medidas extraordinárias;
- política consular e crises com brasileiros no exterior;
- cúpulas/visitas com agenda presidencial;
- espionagem e contrainteligência como sistema abstrato de risco/informação;
- missões de paz e operações militares como camada futura, sem transformar Geopolítica em RTS.
