// Fase 4.4.1 — rede estratégica das empresas estatais federais.
// Valores são abstrações de jogo e não tentam reproduzir balanços reais.

export const estataisSeed = [
  {
    id:'petro',nome:'Petrobras',sigla:'PETRO',setor:'Energia',eixo:'soberania',valorMercado:350000,lucroAnual:40000,eficiencia:76,missaoPublica:67,governanca:72,exposicaoPolitica:88,empregos:84,capacidadeInvestimento:90,
    descricao:'Gigante de energia e principal instrumento estatal para petróleo, refino, gás e transição energética.',
    tensao:'Preço de combustíveis × dividendos × investimento de longo prazo.',
    tags:['energia','soberania','inflacao'],
    diretrizes:[
      {id:'petro_dividendos',nome:'Priorizar dividendos',texto:'Distribuir caixa ao Tesouro e acionistas, reduzindo o ritmo de novos investimentos.',impactoFiscal:2200,eficiencia:1,missao:-2,governanca:1,grupos:{mercado:3,sindicalistas:-2,periferia:-1},riscoPais:-5},
      {id:'petro_investir',nome:'Reinvestimento pesado',texto:'Expandir refino, gás, offshore e energia de transição.',impactoFiscal:-1800,eficiencia:2,missao:2,governanca:0,grupos:{sindicalistas:2,mercado:1,periferia:1,universitarios:1},crescimento:0.08},
      {id:'petro_preco',nome:'Amortecer combustíveis',texto:'Usar política comercial para reduzir repasses abruptos de preços.',impactoFiscal:-900,eficiencia:-1,missao:3,governanca:-2,grupos:{periferia:3,agro:2,mercado:-3},inflacao:-0.12,riscoInstitucional:2},
    ]
  },
  {
    id:'bb',nome:'Banco do Brasil',sigla:'BB',setor:'Financeiro',eixo:'credito',valorMercado:150000,lucroAnual:25000,eficiencia:84,missaoPublica:62,governanca:82,exposicaoPolitica:66,empregos:71,capacidadeInvestimento:79,
    descricao:'Banco comercial de controle estatal, com presença no agro, empresas e varejo.',tensao:'Rentabilidade × crédito direcionado × competição bancária.',tags:['credito','agro','mercado'],
    diretrizes:[
      {id:'bb_agro',nome:'Safra e cooperativas',texto:'Expandir crédito para produção, armazenagem e cooperativas.',impactoFiscal:-450,missao:2,grupos:{agro:4,mercado:1,universitarios:-1},crescimento:0.03},
      {id:'bb_rentavel',nome:'Disciplina comercial',texto:'Priorizar retorno e qualidade de carteira.',impactoFiscal:700,eficiencia:2,grupos:{mercado:3,agro:-1,periferia:-1}},
      {id:'bb_pmes',nome:'Crédito a pequenas empresas',texto:'Acelerar capital de giro e investimento para PMEs.',impactoFiscal:-550,missao:3,grupos:{mercado:2,periferia:2,sindicalistas:1},crescimento:0.04},
    ]
  },
  {
    id:'caixa',nome:'Caixa Econômica Federal',sigla:'CAIXA',setor:'Financeiro',eixo:'credito',valorMercado:100000,lucroAnual:15000,eficiencia:68,missaoPublica:91,governanca:73,exposicaoPolitica:79,empregos:78,capacidadeInvestimento:72,
    descricao:'Principal braço de habitação, infraestrutura urbana, benefícios sociais e loterias.',tensao:'Habitação popular × risco de crédito × execução de políticas sociais.',tags:['habitacao','social','credito'],
    diretrizes:[
      {id:'caixa_habitacao',nome:'Mutirão habitacional',texto:'Aumentar financiamento e subsídio cruzado para moradia popular.',impactoFiscal:-1100,missao:4,grupos:{periferia:4,sindicalistas:1,mercado:-2},crescimento:0.04},
      {id:'caixa_infra',nome:'Infraestrutura municipal',texto:'Financiar saneamento, mobilidade e iluminação em estados e municípios.',impactoFiscal:-800,missao:3,grupos:{periferia:2,mercado:1,agro:1},crescimento:0.06},
      {id:'caixa_balanco',nome:'Recompor capital',texto:'Reduzir expansão e fortalecer balanço.',impactoFiscal:600,eficiencia:2,missao:-2,grupos:{mercado:3,periferia:-2}},
    ]
  },
  {
    id:'correios',nome:'Correios',sigla:'ECT',setor:'Logística',eixo:'servicos',valorMercado:12000,lucroAnual:600,eficiencia:49,missaoPublica:94,governanca:61,exposicaoPolitica:82,empregos:90,capacidadeInvestimento:48,
    descricao:'Rede logística nacional com obrigação de universalização e capilaridade territorial.',tensao:'Universalização × modernização × custo trabalhista.',tags:['logistica','servico_publico','trabalho'],
    diretrizes:[
      {id:'ect_universal',nome:'Universalização total',texto:'Preservar rede ampla e reforçar atendimento em áreas deficitárias.',impactoFiscal:-650,missao:4,grupos:{periferia:2,sindicalistas:3,agro:1,mercado:-2}},
      {id:'ect_digital',nome:'Virada logística digital',texto:'Automação, lockers, hubs regionais e integração com e-commerce.',impactoFiscal:-750,eficiencia:4,missao:1,grupos:{mercado:3,universitarios:2,sindicalistas:-2},crescimento:0.03},
      {id:'ect_enxuta',nome:'Reestruturação agressiva',texto:'Fechar unidades deficitárias e reduzir quadro.',impactoFiscal:500,eficiencia:3,missao:-4,grupos:{mercado:3,sindicalistas:-4,periferia:-2},riscoInstitucional:2},
    ]
  },
  {
    id:'bndes',nome:'BNDES',sigla:'BNDES',setor:'Desenvolvimento',eixo:'credito',valorMercado:210000,lucroAnual:18000,eficiencia:81,missaoPublica:88,governanca:87,exposicaoPolitica:74,empregos:39,capacidadeInvestimento:94,
    descricao:'Banco de desenvolvimento para infraestrutura, indústria, inovação e transição energética.',tensao:'Política industrial × subsídio implícito × adicionalidade econômica.',tags:['infraestrutura','industria','credito'],
    diretrizes:[
      {id:'bndes_industria',nome:'Nova industrialização',texto:'Priorizar cadeias estratégicas, máquinas, defesa e manufatura avançada.',impactoFiscal:-1300,missao:4,grupos:{mercado:2,sindicalistas:2,universitarios:2,agro:-1},crescimento:0.09},
      {id:'bndes_verde',nome:'Transição verde',texto:'Financiar energia limpa, bioeconomia e descarbonização.',impactoFiscal:-1000,missao:3,grupos:{universitarios:4,mercado:1,agro:-2},crescimento:0.06},
      {id:'bndes_retorno',nome:'Retorno financeiro',texto:'Concentrar carteira em projetos com alta capacidade de pagamento.',impactoFiscal:850,eficiencia:2,missao:-2,grupos:{mercado:3,sindicalistas:-1}},
    ]
  },
  {
    id:'serpro',nome:'Serpro',sigla:'SERPRO',setor:'Tecnologia',eixo:'dados',valorMercado:18000,lucroAnual:2200,eficiencia:79,missaoPublica:87,governanca:84,exposicaoPolitica:63,empregos:52,capacidadeInvestimento:78,
    descricao:'Infraestrutura digital estatal para dados, identidade, serviços e sistemas críticos.',tensao:'Soberania digital × interoperabilidade × custo de modernização.',tags:['tecnologia','dados','soberania'],
    diretrizes:[
      {id:'serpro_nuvem',nome:'Nuvem soberana',texto:'Expandir infraestrutura nacional para dados críticos do Estado.',impactoFiscal:-650,missao:4,grupos:{universitarios:3,militares:2,mercado:1},crescimento:0.03},
      {id:'serpro_aberto',nome:'APIs e governo aberto',texto:'Priorizar interoperabilidade, transparência e serviços digitais.',impactoFiscal:-320,eficiencia:3,missao:3,grupos:{universitarios:3,mercado:2}},
      {id:'serpro_comercial',nome:'Expansão comercial',texto:'Vender mais soluções ao mercado e a governos locais.',impactoFiscal:500,eficiencia:2,missao:-1,grupos:{mercado:3,universitarios:1}},
    ]
  },
  {
    id:'dataprev',nome:'Dataprev',sigla:'DATAPREV',setor:'Tecnologia social',eixo:'dados',valorMercado:9000,lucroAnual:1000,eficiencia:72,missaoPublica:92,governanca:78,exposicaoPolitica:57,empregos:45,capacidadeInvestimento:66,
    descricao:'Processa benefícios, vínculos trabalhistas e dados previdenciários críticos.',tensao:'Modernização × segurança de dados × inclusão digital.',tags:['dados','social','previdencia'],
    diretrizes:[
      {id:'data_fraude',nome:'Combate a fraude com IA',texto:'Cruzar bases e automatizar detecção de pagamentos irregulares.',impactoFiscal:-350,eficiencia:4,missao:2,grupos:{mercado:2,universitarios:2,periferia:-1}},
      {id:'data_inclusao',nome:'Atendimento assistido',texto:'Reforçar canais para quem não consegue usar serviços digitais.',impactoFiscal:-420,missao:4,grupos:{periferia:4,evangelicos:1,mercado:-1}},
      {id:'data_ciber',nome:'Blindagem cibernética',texto:'Investir em segurança, redundância e resposta a incidentes.',impactoFiscal:-500,governanca:3,missao:2,grupos:{militares:2,universitarios:2,mercado:1}},
    ]
  },
  {
    id:'infraero',nome:'Infraero',sigla:'INFRAERO',setor:'Infraestrutura',eixo:'servicos',valorMercado:14000,lucroAnual:300,eficiencia:57,missaoPublica:81,governanca:69,exposicaoPolitica:54,empregos:43,capacidadeInvestimento:61,
    descricao:'Opera e apoia infraestrutura aeroportuária e serviços associados.',tensao:'Aeroportos regionais × rentabilidade × integração territorial.',tags:['infraestrutura','aviacao','regional'],
    diretrizes:[
      {id:'infra_regional',nome:'Aviação regional',texto:'Investir em aeroportos de cidades médias e conexão amazônica.',impactoFiscal:-700,missao:4,grupos:{agro:2,periferia:1,mercado:1},crescimento:0.04},
      {id:'infra_servicos',nome:'Serviços e concessões',texto:'Monetizar expertise, engenharia e operação aeroportuária.',impactoFiscal:420,eficiencia:3,missao:-1,grupos:{mercado:3}},
      {id:'infra_defesa',nome:'Infraestrutura estratégica',texto:'Coordenar terminais e pistas de uso logístico e soberano.',impactoFiscal:-550,missao:2,grupos:{militares:3,mercado:1}},
    ]
  },
  {
    id:'enbpar',nome:'ENBPar',sigla:'ENBPAR',setor:'Energia estratégica',eixo:'soberania',valorMercado:25000,lucroAnual:1200,eficiencia:58,missaoPublica:96,governanca:70,exposicaoPolitica:70,empregos:36,capacidadeInvestimento:73,
    descricao:'Concentra ativos estratégicos de energia nuclear e políticas públicas de energia.',tensao:'Segurança nuclear × custo fiscal × autonomia energética.',tags:['nuclear','energia','soberania'],
    diretrizes:[
      {id:'enb_nuclear',nome:'Acelerar programa nuclear',texto:'Reforçar cadeia nuclear, combustível e geração de base.',impactoFiscal:-1500,missao:4,grupos:{militares:4,mercado:1,universitarios:-1},crescimento:0.06},
      {id:'enb_governanca',nome:'Governança e segurança',texto:'Priorizar auditoria, manutenção e licenciamento antes da expansão.',impactoFiscal:-450,governanca:4,missao:1,grupos:{universitarios:2,mercado:2,militares:1}},
      {id:'enb_moderar',nome:'Congelar expansão',texto:'Manter ativos atuais e reduzir novos compromissos.',impactoFiscal:350,missao:-3,grupos:{mercado:2,militares:-3,universitarios:1}},
    ]
  },
  {
    id:'ebc',nome:'Empresa Brasil de Comunicação',sigla:'EBC',setor:'Comunicação',eixo:'servicos',valorMercado:2500,lucroAnual:-300,eficiencia:51,missaoPublica:84,governanca:64,exposicaoPolitica:96,empregos:41,capacidadeInvestimento:45,
    descricao:'Comunicação pública federal em TV, rádio, agência e serviços institucionais.',tensao:'Comunicação pública × independência editorial × custo.',tags:['comunicacao','cultura','institucional'],
    diretrizes:[
      {id:'ebc_publica',nome:'Blindagem editorial',texto:'Reforçar mandato público, conselho editorial e transparência.',impactoFiscal:-250,governanca:4,missao:4,grupos:{universitarios:3,mercado:1,evangelicos:-1}},
      {id:'ebc_digital',nome:'Plataforma pública digital',texto:'Migrar distribuição para streaming, podcasts e jornalismo digital.',impactoFiscal:-380,eficiencia:3,missao:2,grupos:{universitarios:2,periferia:1}},
      {id:'ebc_governo',nome:'Comunicação de governo',texto:'Usar a rede para amplificar entregas e pronunciamentos oficiais.',impactoFiscal:-180,eficiencia:1,missao:-3,governanca:-4,grupos:{periferia:1,mercado:-2,universitarios:-3},riscoInstitucional:4},
    ]
  },
];
