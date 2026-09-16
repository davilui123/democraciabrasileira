// Fase 4.9.3 — segundo repertório federativo para evitar uma única história por estado.
export const eventosFederativosExtrasSeed=[
  {id:'sp_exportadores',uf:'SP',titulo:'São Paulo cobra reação federal após perda de encomendas externas',tema:'comercio',multiplicador:2.1,gravidade:82,ministerios:['m_fazenda','m_exteriores','m_industria'],instituicoes:['tcu'],texto:'Exportadores paulistas relatam cancelamentos e {governador} exige crédito, negociação externa e resposta rápida do Planalto.',opcoes:[
    {id:'credito',texto:'Criar linha emergencial para exportadores',efeito:'economia',grupos:{mercado:3,sindicalistas:1},relacao:7,fiscal:-650,crescimento:.02},
    {id:'diplomacia',texto:'Priorizar negociação comercial e diversificação',efeito:'diplomacia',grupos:{mercado:2,agro:1},relacao:4,bastidor:1},
    {id:'mercado',texto:'Recusar socorro e deixar empresas absorverem o choque',efeito:'fiscal',grupos:{mercado:-3},relacao:-8,oposicao:3}]},
  {id:'rj_petroleo',uf:'RJ',titulo:'Rio pressiona por compensação após queda de receitas do petróleo',tema:'energia',multiplicador:1.9,gravidade:74,ministerios:['m_fazenda','m_energia'],instituicoes:['stf'],texto:'Receitas de royalties recuam e {governador} pede compensação federal para evitar cortes em serviços e obras.',opcoes:[
    {id:'fundo',texto:'Criar fundo temporário de estabilização',efeito:'fiscal',grupos:{periferia:2,mercado:-1},relacao:8,fiscal:-700},
    {id:'credito',texto:'Oferecer crédito condicionado a ajuste estadual',efeito:'gestao',grupos:{mercado:2,periferia:1},relacao:4,fiscal:-220},
    {id:'negar',texto:'Negar compensação extraordinária',efeito:'federalismo',grupos:{mercado:1,periferia:-2},relacao:-9,stf:true,oposicao:3}]},
  {id:'mg_minerais',uf:'MG',titulo:'Minas exige participação maior na cadeia de minerais críticos',tema:'minerais',multiplicador:1.8,gravidade:70,ministerios:['m_fazenda','m_ciencia','m_meioamb'],instituicoes:['tcu'],texto:'Com novos contratos minerais em discussão, {governador} quer processamento local, royalties e centros tecnológicos no estado.',opcoes:[
    {id:'cadeia',texto:'Vincular incentivos a processamento local',efeito:'industria',grupos:{mercado:2,sindicalistas:2,universitarios:1},relacao:9,fiscal:-350,crescimento:.04},
    {id:'royalties',texto:'Negociar apenas participação fiscal maior',efeito:'fiscal',grupos:{mercado:1,periferia:1},relacao:5},
    {id:'federal',texto:'Manter estratégia mineral centralizada na União',efeito:'federalismo',grupos:{mercado:1},relacao:-7,oposicao:2}]},
  {id:'ba_refino',uf:'BA',titulo:'Bahia pede pacote para refino, petroquímica e empregos industriais',tema:'industria',multiplicador:1.7,gravidade:65,ministerios:['m_fazenda','m_energia','m_trabalho'],instituicoes:[],texto:'Fechamentos e reestruturações ameaçam empregos industriais. {governador} cobra política federal para refino e química.',opcoes:[
    {id:'pacote',texto:'Lançar pacote industrial com conteúdo local',efeito:'industria',grupos:{sindicalistas:4,mercado:1,periferia:2},relacao:9,fiscal:-650,crescimento:.04},
    {id:'credito',texto:'Oferecer crédito e requalificação profissional',efeito:'trabalho',grupos:{sindicalistas:2,mercado:2},relacao:5,fiscal:-300,crescimento:.02},
    {id:'mercado',texto:'Não intervir na reestruturação',efeito:'mercado',grupos:{mercado:2,sindicalistas:-4},relacao:-7,oposicao:3}]},
  {id:'pe_porto_digital',uf:'PE',titulo:'Pernambuco disputa hub de data centers e cabos submarinos',tema:'tecnologia',multiplicador:1.6,gravidade:60,ministerios:['m_ciencia','m_fazenda','m_transp'],instituicoes:[],texto:'{governador} apresenta pacote para transformar o litoral em hub digital e pede energia, incentivos e infraestrutura federal.',opcoes:[
    {id:'hub',texto:'Apoiar hub digital integrado',efeito:'tecnologia',grupos:{universitarios:3,mercado:3},relacao:9,fiscal:-500,crescimento:.04},
    {id:'energia',texto:'Apoiar apenas infraestrutura energética',efeito:'infraestrutura',grupos:{mercado:2},relacao:4,fiscal:-250,crescimento:.02},
    {id:'neutro',texto:'Manter competição entre estados sem preferência',efeito:'federalismo',grupos:{mercado:1},relacao:-4}]},
  {id:'ce_hidrogenio',uf:'CE',titulo:'Ceará cobra decisão federal sobre corredor de hidrogênio verde',tema:'energia',multiplicador:1.7,gravidade:64,ministerios:['m_meioamb','m_fazenda','m_exteriores'],instituicoes:['tcu'],texto:'Investidores aguardam regras de exportação e infraestrutura. {governador} diz que a demora federal ameaça projetos já anunciados.',opcoes:[
    {id:'corredor',texto:'Criar corredor com incentivos e metas locais',efeito:'energia',grupos:{mercado:3,universitarios:2,sindicalistas:1},relacao:9,fiscal:-520,crescimento:.04},
    {id:'regra',texto:'Aprovar marco nacional sem subsídio',efeito:'regulacao',grupos:{mercado:3,universitarios:1},relacao:5},
    {id:'adiar',texto:'Adiar até revisão fiscal completa',efeito:'fiscal',grupos:{mercado:-2,universitarios:-1},relacao:-6}]},
  {id:'rs_agro_exportacao',uf:'RS',titulo:'Rio Grande do Sul cobra apoio após choque nas exportações agroindustriais',tema:'agro',multiplicador:1.8,gravidade:69,ministerios:['m_agro','m_fazenda','m_exteriores'],instituicoes:[],texto:'Cooperativas relatam perda de mercados e {governador} pede crédito, seguro e novas rotas comerciais.',opcoes:[
    {id:'seguro',texto:'Reforçar seguro e crédito exportador',efeito:'agro',grupos:{agro:4,mercado:1},relacao:8,fiscal:-420},
    {id:'mercados',texto:'Priorizar missões para novos mercados',efeito:'diplomacia',grupos:{agro:3,mercado:2},relacao:6,bastidor:1},
    {id:'sem_socorro',texto:'Evitar apoio setorial',efeito:'fiscal',grupos:{agro:-4},relacao:-8,oposicao:3}]},
  {id:'pr_chips',uf:'PR',titulo:'Paraná entra na disputa por nova fábrica de semicondutores',tema:'tecnologia',multiplicador:1.7,gravidade:63,ministerios:['m_ciencia','m_fazenda'],instituicoes:['tcu'],texto:'{governador} oferece área, universidades e incentivos e pede ao Planalto que não concentre a política de chips em outro estado.',opcoes:[
    {id:'competicao',texto:'Abrir seleção nacional transparente',efeito:'governanca',grupos:{mercado:3,universitarios:2},relacao:6,bastidor:1},
    {id:'pr',texto:'Priorizar o Paraná por critérios técnicos',efeito:'tecnologia',grupos:{mercado:3,universitarios:2},relacao:10,fiscal:-300,crescimento:.04},
    {id:'outro',texto:'Manter projeto em outra localização já negociada',efeito:'federalismo',grupos:{mercado:1},relacao:-8,oposicao:2}]},
  {id:'sc_portos',uf:'SC',titulo:'Santa Catarina cobra dragagem e acesso federal aos portos',tema:'logistica',multiplicador:1.5,gravidade:57,ministerios:['m_transp','m_fazenda'],instituicoes:['tcu'],texto:'Filas e limitações de calado ameaçam exportações. {governador} quer obras federais e prioridade no orçamento.',opcoes:[
    {id:'obras',texto:'Acelerar dragagem e acessos',efeito:'infraestrutura',grupos:{agro:2,mercado:3},relacao:9,fiscal:-480,crescimento:.03},
    {id:'ppp',texto:'Estruturar PPP portuária',efeito:'mercado',grupos:{mercado:4,sindicalistas:-1},relacao:5,fiscal:-150,crescimento:.02},
    {id:'fila',texto:'Manter cronograma nacional',efeito:'fiscal',grupos:{mercado:-1,agro:-2},relacao:-6}]},
  {id:'mt_fertilizantes',uf:'MT',titulo:'Mato Grosso exige plano de fertilizantes após alta de custos',tema:'agro',multiplicador:2.0,gravidade:78,ministerios:['m_agro','m_fazenda','m_exteriores'],instituicoes:[],texto:'Custos de fertilizantes sobem e {governador} alerta para impacto na safra, alimentos e balança comercial.',opcoes:[
    {id:'estoque',texto:'Criar estoque estratégico e crédito',efeito:'agro',grupos:{agro:4,periferia:1},relacao:9,fiscal:-520},
    {id:'fornecedor',texto:'Diversificar fornecedores via Itamaraty',efeito:'diplomacia',grupos:{agro:3,mercado:1},relacao:6},
    {id:'mercado',texto:'Não intervir no preço de insumos',efeito:'mercado',grupos:{agro:-4,mercado:1},relacao:-8,oposicao:3}]},
  {id:'pa_mineracao',uf:'PA',titulo:'Pará exige industrialização local antes de novos contratos minerais',tema:'minerais',multiplicador:1.9,gravidade:73,ministerios:['m_ciencia','m_meioamb','m_fazenda'],instituicoes:['tcu','stf'],texto:'{governador} condiciona apoio político a novos projetos a plantas de processamento, empregos locais e compensações ambientais.',opcoes:[
    {id:'industrializar',texto:'Exigir processamento local e fundo ambiental',efeito:'industria',grupos:{periferia:3,universitarios:2,mercado:1},relacao:10,fiscal:-350,crescimento:.04},
    {id:'compensar',texto:'Aumentar compensações sem obrigar processamento',efeito:'federalismo',grupos:{periferia:2,mercado:2},relacao:6,fiscal:-180},
    {id:'licenciar',texto:'Priorizar licenciamento e exportação',efeito:'mercado',grupos:{mercado:3,universitarios:-3},relacao:-5,stf:true}]},
  {id:'go_data_agro',uf:'GO',titulo:'Goiás quer centro nacional de dados e inteligência para o agro',tema:'tecnologia',multiplicador:1.5,gravidade:55,ministerios:['m_agro','m_ciencia'],instituicoes:[],texto:'{governador} propõe integrar satélites, crédito, clima e defesa sanitária em uma plataforma nacional sediada no estado.',opcoes:[
    {id:'centro',texto:'Criar centro nacional em Goiás',efeito:'tecnologia',grupos:{agro:3,universitarios:2,mercado:1},relacao:9,fiscal:-280,crescimento:.025},
    {id:'federado',texto:'Criar rede distribuída entre estados',efeito:'federalismo',grupos:{agro:2,universitarios:2},relacao:5,fiscal:-180},
    {id:'privado',texto:'Deixar plataforma ao setor privado',efeito:'mercado',grupos:{mercado:3,agro:1},relacao:-2}]},
];
