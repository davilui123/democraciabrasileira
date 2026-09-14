// Fase 4.7 — Programas Governamentais.
// São arquiteturas de política pública; o jogador personaliza nome, território,
// escala, execução, financiamento e governança antes do lançamento.

export const regioesPrograma = [
  {id:'norte',nome:'Norte',ufs:['AC','AP','AM','PA','RO','RR','TO']},
  {id:'nordeste',nome:'Nordeste',ufs:['AL','BA','CE','MA','PB','PE','PI','RN','SE']},
  {id:'centro_oeste',nome:'Centro-Oeste',ufs:['DF','GO','MT','MS']},
  {id:'sudeste',nome:'Sudeste',ufs:['ES','MG','RJ','SP']},
  {id:'sul',nome:'Sul',ufs:['PR','RS','SC']},
];

export const modelosExecucaoPrograma = [
  {id:'federal',nome:'Execução federal',descricao:'Ministérios e autarquias lideram contratos, repasses e entregas.',eficiencia:0,risco:-4,custoFederal:1},
  {id:'federativo',nome:'Pacto federativo',descricao:'Estados e municípios executam metas pactuadas com a União.',eficiencia:6,risco:3,custoFederal:.84},
  {id:'estatais',nome:'Rede pública',descricao:'Empresas públicas e bancos federais assumem parte relevante da execução.',eficiencia:8,risco:5,custoFederal:.88},
  {id:'ppp',nome:'PPP / concessões',descricao:'Capital privado acelera investimento, mas aumenta disputa regulatória e social.',eficiencia:12,risco:9,custoFederal:.58},
  {id:'misto',nome:'Modelo misto',descricao:'Combina União, estados, empresas públicas e parceiros privados.',eficiencia:10,risco:6,custoFederal:.72},
];

export const fontesPrograma = [
  {id:'tesouro',nome:'Tesouro Nacional',descricao:'Maior controle federal; impacto primário integral.',fatorFiscal:1,mercado:0,risco:0},
  {id:'bancos_publicos',nome:'Bancos públicos',descricao:'Crédito direcionado e fundos garantidores reduzem desembolso direto.',fatorFiscal:.74,mercado:-1,risco:3},
  {id:'cofinanciamento',nome:'União + estados',descricao:'Requer governadores cooperando e capacidade local de execução.',fatorFiscal:.76,mercado:0,risco:2},
  {id:'multilateral',nome:'Financiamento multilateral',descricao:'BID, CAF, NDB ou Banco Mundial complementam recursos e exigem governança.',fatorFiscal:.7,mercado:2,risco:1},
  {id:'capital_privado',nome:'Capital privado / PPP',descricao:'Reduz desembolso federal, mas aumenta contratos, tarifas e pressão de grupos.',fatorFiscal:.48,mercado:3,risco:8},
];

export const governancaPrograma = [
  {id:'enxuta',nome:'Execução acelerada',descricao:'Menos etapas de controle; entrega mais rápida e maior risco de questionamento.',eficiencia:8,risco:14,custo:0},
  {id:'padrao',nome:'Governança padrão',descricao:'Controle ministerial, transparência e auditoria ordinária.',eficiencia:0,risco:0,custo:0},
  {id:'reforcada',nome:'Governança reforçada',descricao:'Painel público, auditoria contínua e marcos de pagamento.',eficiencia:-4,risco:-18,custo:.04},
];

const programa=(x)=>({
  duracaoPadrao:24,
  orcamentoPadrao:650,
  faixaOrcamento:[250,2200],
  legalPadrao:'executivo',
  escala:'nacional',
  polarizacao:35,
  ...x,
});

export const programasGovernamentaisSeed = [
  programa({id:'saude_perto',nome:'Saúde Mais Perto',area:'Saúde',icone:'🩺',promessaId:'saude',ministerios:['m_saude','m_fazenda','m_casacivil'],fiscalTipo:'saude',descricao:'Expande atenção primária, vacinação, telemedicina e capacidade regional do SUS.',metas:[['Cobertura de atenção primária',92,'%'],['Unidades modernizadas',1800,' un.'],['Teleatendimentos/ano',16,' mi']],grupos:{periferia:3,sindicalistas:1,universitarios:1,mercado:-1},macro:{crescimentoPib:.015,desemprego:-.015},territorio:'nacional'}),
  programa({id:'ensino_tecnico',nome:'Escola Técnica do Futuro',area:'Educação',icone:'🎓',promessaId:'educacao',ministerios:['m_educacao','m_ciencia','m_fazenda'],fiscalTipo:'educacao',descricao:'Expande ensino técnico, laboratórios e formação conectada à demanda regional.',metas:[['Novas vagas técnicas',600,' mil'],['Laboratórios modernizados',950,' un.'],['Egressos empregados',72,'%']],grupos:{universitarios:3,periferia:2,sindicalistas:1,mercado:1,agro:-.5},macro:{crescimentoPib:.025,desemprego:-.02},territorio:'nacional'}),
  programa({id:'casa_cidade',nome:'Casa & Cidade',area:'Cidades',icone:'🏠',promessaId:'moradia',ministerios:['m_casacivil','m_transp','m_fazenda'],fiscalTipo:'infraestrutura',descricao:'Habitação, saneamento, mobilidade e urbanização em territórios de maior déficit.',metas:[['Moradias contratadas',750,' mil'],['Pessoas com saneamento',8,' mi'],['Corredores de mobilidade',1800,' km']],grupos:{periferia:4,sindicalistas:1,mercado:1,agro:-.5},macro:{crescimentoPib:.035,desemprego:-.035},territorio:'estados'}),
  programa({id:'cidades_seguras',nome:'Cidades Seguras',area:'Segurança',icone:'🛡️',promessaId:'seguranca',ministerios:['m_justica','m_casacivil','m_fazenda'],fiscalTipo:'custeio',descricao:'Integra inteligência, policiamento, prevenção e metas federativas de redução da violência.',metas:[['Estados integrados',27,' UFs'],['Homicídios evitados',18,'%'],['Centros de inteligência',32,' un.']],grupos:{militares:3,evangelicos:2,periferia:1,universitarios:-1.5},macro:{crescimentoPib:.01,desemprego:0},territorio:'estados'}),
  programa({id:'rota_agro',nome:'Rota Agro',area:'Agricultura',icone:'🌾',promessaId:'agro',ministerios:['m_agro','m_transp','m_fazenda','m_exteriores'],fiscalTipo:'infraestrutura',descricao:'Armazenagem, irrigação, defesa sanitária, logística e acesso a mercados para o campo.',metas:[['Capacidade de armazenagem',28,'%'],['Corredores logísticos',2400,' km'],['Mercados sanitários abertos',12,'']],grupos:{agro:4,mercado:2,periferia:.5,universitarios:-1},macro:{crescimentoPib:.035,desemprego:-.01},territorio:'estados'}),
  programa({id:'brasil_produtivo',nome:'Brasil Produtivo',area:'Indústria',icone:'🏭',promessaId:'emprego',ministerios:['m_fazenda','m_ciencia','m_casacivil'],fiscalTipo:'produtivo',descricao:'Crédito, compras públicas, inovação e encadeamentos produtivos para elevar produtividade industrial.',metas:[['Empresas modernizadas',24,' mil'],['Produtividade média',12,'%'],['Empregos industriais',420,' mil']],grupos:{sindicalistas:3,mercado:2,universitarios:2,agro:-1},macro:{crescimentoPib:.045,desemprego:-.04},territorio:'nacional'}),
  programa({id:'conecta_brasil',nome:'Conecta Brasil',area:'Digital',icone:'📡',promessaId:'tecnologia',ministerios:['m_ciencia','m_educacao','m_casacivil'],fiscalTipo:'tecnologia',descricao:'Conectividade, serviços digitais públicos e infraestrutura compartilhada em áreas desatendidas.',metas:[['Municípios com backbone',98,'%'],['Escolas conectadas',100,'%'],['Serviços digitais integrados',240,'']],grupos:{universitarios:3,mercado:2,periferia:2,evangelicos:-.5},macro:{crescimentoPib:.03,desemprego:-.015},territorio:'nacional'}),
  programa({id:'primeira_infancia',nome:'Primeiros Caminhos',area:'Social',icone:'🧸',promessaId:'emprego',ministerios:['m_social','m_saude','m_educacao'],fiscalTipo:'humano',descricao:'Creche, nutrição, acompanhamento familiar e primeira infância integrada.',metas:[['Crianças acompanhadas',5,' mi'],['Vagas de creche',600,' mil'],['Cobertura nutricional',95,'%']],grupos:{periferia:4,evangelicos:2,sindicalistas:1,mercado:-1},macro:{crescimentoPib:.015,desemprego:-.01},territorio:'estados'}),
  programa({id:'transicao_justa',nome:'Transição Energética Justa',area:'Energia',icone:'⚡',promessaId:'infraestrutura',ministerios:['m_meioamb','m_fazenda','m_ciencia','m_transp'],fiscalTipo:'infraestrutura',descricao:'Rede elétrica, renováveis, armazenamento e requalificação produtiva em regiões expostas à transição.',metas:[['Nova capacidade limpa',18,' GW'],['Rede modernizada',12000,' km'],['Trabalhadores requalificados',180,' mil']],grupos:{universitarios:3,mercado:2,periferia:1,agro:-1,militares:-.5},macro:{crescimentoPib:.035,desemprego:-.02},territorio:'estados'}),
  programa({id:'aceleracao_investimentos',nome:'Programa Nacional de Aceleração de Investimentos',area:'Infraestrutura',icone:'🏗️',promessaId:'infraestrutura',ministerios:['m_casacivil','m_transp','m_fazenda','m_agro'],fiscalTipo:'infraestrutura',descricao:'Carteira integrada de infraestrutura com pactuação federativa, empresas e execução plurianual.',metas:[['Investimento mobilizado',420,' bi'],['Obras estruturantes',320,''],['Estados com carteira pactuada',27,' UFs']],grupos:{periferia:3,agro:3,mercado:2,sindicalistas:1,universitarios:-.5},macro:{crescimentoPib:.06,desemprego:-.05},territorio:'nacional',duracaoPadrao:36,orcamentoPadrao:1800,faixaOrcamento:[900,3500],requiresCapacity:'programa_aceleracao_investimentos',legalPadrao:'pl',polarizacao:48}),
  programa({id:'capital_humano',nome:'Pacto Nacional de Capital Humano',area:'Capital Humano',icone:'🧠',promessaId:'educacao',ministerios:['m_educacao','m_saude','m_ciencia','m_fazenda'],fiscalTipo:'humano',descricao:'Política integrada de aprendizagem, saúde preventiva, ciência e produtividade humana.',metas:[['Jovens acompanhados',12,' mi'],['Municípios integrados',3200,''],['Ganho de aprendizagem',15,'%']],grupos:{universitarios:4,periferia:3,sindicalistas:2,mercado:1,agro:-.5},macro:{crescimentoPib:.045,desemprego:-.025},territorio:'nacional',duracaoPadrao:30,orcamentoPadrao:1200,faixaOrcamento:[600,2600],requiresCapacity:'programa_capital_humano',legalPadrao:'pl',polarizacao:34}),
];

export const programaTemplatePorId=(id)=>programasGovernamentaisSeed.find(p=>p.id===id)||null;
export const modeloExecucaoPorId=(id)=>modelosExecucaoPrograma.find(x=>x.id===id)||modelosExecucaoPrograma[0];
export const fonteProgramaPorId=(id)=>fontesPrograma.find(x=>x.id===id)||fontesPrograma[0];
export const governancaProgramaPorId=(id)=>governancaPrograma.find(x=>x.id===id)||governancaPrograma[1];
