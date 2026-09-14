export const comercioExteriorInicial = {
  exportacoesMensais: 28200,
  importacoesMensais: 23600,
  exportacoesPorSetor: {
    agro:{nome:'Agro & alimentos',valor:8800,potencial:72},
    mineracao:{nome:'Mineração & metais',valor:5100,potencial:68},
    energia:{nome:'Energia & petróleo',valor:4300,potencial:61},
    industria:{nome:'Manufaturados',valor:5900,potencial:57},
    aeroespacial:{nome:'Aeroespacial & defesa',valor:1700,potencial:66},
    servicos:{nome:'Serviços & digital',valor:2400,potencial:73},
  },
  importacoesPorSetor: {
    maquinas:{nome:'Máquinas & equipamentos',valor:5100,tarifa:10,dependencia:62},
    chips:{nome:'Semicondutores & eletrônicos',valor:3900,tarifa:8,dependencia:84},
    quimicos:{nome:'Químicos & farmacêuticos',valor:4200,tarifa:9,dependencia:67},
    fertilizantes:{nome:'Fertilizantes',valor:2700,tarifa:4,dependencia:78},
    combustiveis:{nome:'Combustíveis & derivados',valor:3100,tarifa:6,dependencia:54},
    bens_consumo:{nome:'Bens de consumo',valor:4600,tarifa:14,dependencia:38},
  },
  parceiros: {
    cn:{nome:'China',exportacoes:8400,importacoes:6100,acesso:76},
    us:{nome:'Estados Unidos',exportacoes:3800,importacoes:4200,acesso:68},
    ar:{nome:'Argentina',exportacoes:2400,importacoes:1700,acesso:82},
    de:{nome:'Alemanha',exportacoes:1200,importacoes:1900,acesso:64},
    nl:{nome:'Países Baixos',exportacoes:1500,importacoes:600,acesso:72},
    in:{nome:'Índia',exportacoes:1300,importacoes:900,acesso:59},
    jp:{nome:'Japão',exportacoes:900,importacoes:1200,acesso:58},
    mx:{nome:'México',exportacoes:650,importacoes:850,acesso:55},
  },
  acordos:[], oportunidades:[], historico:[], politica:{creditoExportador:0},
};

export const oportunidadesComerciaisSeed = [
  {id:'opp_us_aero',paisId:'us',titulo:'Compras aeroespaciais',setor:'aeroespacial',tipo:'exportacao',valor:950,texto:'Compradores americanos avaliam aeronaves, componentes e sistemas brasileiros.'},
  {id:'opp_cn_agro',paisId:'cn',titulo:'Ampliação sanitária para alimentos',setor:'agro',tipo:'exportacao',valor:1400,texto:'Autoridades chinesas sinalizam abertura para novas plantas e categorias de alimentos.'},
  {id:'opp_de_verde',paisId:'de',titulo:'Máquinas para indústria verde',setor:'industria',tipo:'exportacao',valor:720,texto:'Empresas alemãs buscam fornecedores brasileiros para equipamentos e componentes verdes.'},
  {id:'opp_jp_chips',paisId:'jp',titulo:'Joint venture de semicondutores',setor:'chips',tipo:'importacao_estrategica',valor:1100,texto:'Consórcio japonês oferece equipamentos e tecnologia em troca de instalação produtiva local.'},
  {id:'opp_in_farma',paisId:'in',titulo:'Insumos farmacêuticos',setor:'quimicos',tipo:'importacao_estrategica',valor:680,texto:'Produtores indianos propõem contrato de fornecimento com transferência gradual de tecnologia.'},
  {id:'opp_ae_infra',paisId:'ae',titulo:'Fundo para infraestrutura exportadora',setor:'industria',tipo:'investimento',valor:1300,texto:'Fundo soberano quer financiar portos e terminais ligados ao comércio exterior.'},
];
