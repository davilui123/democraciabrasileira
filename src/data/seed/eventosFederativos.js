// Eventos federativos de alta saliência. São ficcionais, mas inspirados em tensões plausíveis do federalismo brasileiro.
// O multiplicador aumenta o impacto político das respostas quando o assunto domina a agenda pública.

export const eventosFederativosSeed = [
  {id:'sp_icms',uf:'SP',titulo:'São Paulo segura repasse e leva disputa fiscal ao STF',tema:'federalismo',multiplicador:2.2,gravidade:86,ministerios:['m_casacivil','m_fazenda'],instituicoes:['stf'],texto:'{governador}, de {partido}, determina que empresas estaduais suspendam um repasse extraordinário ligado à compensação tributária e acusa Brasília de transferir custos para São Paulo. A Casa Civil recomenda reação imediata. Outros governadores avaliam seguir o movimento.',opcoes:[
    {id:'stf',texto:'Contestar imediatamente no STF',efeito:'institucional',grupos:{mercado:2,universitarios:2,agro:-1},relacao:-5,oposicao:3,tensao:3,stf:true},
    {id:'pacto',texto:'Abrir negociação com governadores e parcelar o impasse',efeito:'negociacao',grupos:{mercado:1,periferia:1,agro:1,universitarios:-1},relacao:8,oposicao:-2,tensao:-2},
    {id:'confronto',texto:'Responder em rede nacional e bloquear transferências discricionárias',efeito:'confronto',grupos:{periferia:2,sindicalistas:1,mercado:-3,agro:-2,universitarios:-2},relacao:-12,oposicao:6,tensao:7},
  ]},
  {id:'mt_terras_raras',uf:'MT',titulo:'Descoberta de terras raras divide Mato Grosso e o governo federal',tema:'minerais',multiplicador:2.0,gravidade:82,ministerios:['m_fazenda','m_meioamb','m_fazenda'],instituicoes:['tcu'],texto:'Uma descoberta de alto potencial mineral coloca {governador} sob pressão do agro, investidores estrangeiros e municípios. O governo estadual quer licenciamento acelerado e participação maior nas receitas; ambientalistas exigem salvaguardas e Brasília precisa decidir o modelo estratégico.',opcoes:[
    {id:'consorcio',texto:'Criar consórcio federal-estadual com processamento no Brasil',efeito:'desenvolvimento',grupos:{agro:3,mercado:3,universitarios:1,sindicalistas:1},relacao:7,oposicao:-1,crescimento:.06,fiscal:-650},
    {id:'licenca',texto:'Acelerar licenças e abrir leilão internacional',efeito:'mercado',grupos:{agro:4,mercado:4,universitarios:-4,periferia:1},relacao:10,oposicao:1,tensao:2,crescimento:.08},
    {id:'reserva',texto:'Classificar área como estratégica e estudar exploração estatal',efeito:'soberania',grupos:{militares:3,sindicalistas:2,universitarios:2,mercado:-3,agro:-2},relacao:-4,oposicao:4,fiscal:-400},
  ]},
  {id:'pe_apoio',uf:'PE',titulo:'Pernambuco condiciona apoio no Congresso a novo pacto de investimentos',tema:'coalizao',multiplicador:1.8,gravidade:70,ministerios:['m_casacivil','m_transp'],instituicoes:[],texto:'{governador} reúne prefeitos e a bancada federal de Pernambuco. O grupo exige cronograma para mobilidade, porto e indústria criativa antes de apoiar a agenda prioritária do Planalto no Congresso.',opcoes:[
    {id:'pacote',texto:'Fechar pacote plurianual com metas e contrapartidas',efeito:'investimento',grupos:{periferia:3,sindicalistas:2,mercado:1},relacao:10,oposicao:-2,fiscal:-720,crescimento:.04},
    {id:'bancada',texto:'Negociar diretamente com a bancada, sem cheque em branco ao governador',efeito:'congresso',grupos:{mercado:1,universitarios:-1},relacao:-4,oposicao:1,bastidor:5},
    {id:'recusar',texto:'Recusar pressão e manter critérios nacionais de investimento',efeito:'tecnico',grupos:{mercado:2,periferia:-2,sindicalistas:-1},relacao:-9,oposicao:4},
  ]},
  {id:'mg_royalties',uf:'MG',titulo:'Minas exige nova partilha da mineração e ameaça frente de governadores',tema:'mineracao',multiplicador:1.9,gravidade:74,ministerios:['m_fazenda','m_fazenda'],instituicoes:['stf'],texto:'{governador} articula estados mineradores para rever compensações e responsabilidades ambientais. A ameaça é judicializar o tema e bloquear projetos do governo no Congresso.',opcoes:[
    {id:'reforma',texto:'Patrocinar reforma negociada das compensações',efeito:'federalismo',grupos:{agro:1,mercado:1,universitarios:1},relacao:7,oposicao:-1,fiscal:-350},
    {id:'judicial',texto:'Defender o modelo atual e aguardar o STF',efeito:'institucional',grupos:{mercado:2,universitarios:1,periferia:-1},relacao:-7,oposicao:3,stf:true},
    {id:'ambiental',texto:'Vincular nova partilha a recuperação ambiental',efeito:'clima',grupos:{universitarios:4,mercado:-1,agro:-2},relacao:2,oposicao:2},
  ]},
  {id:'rs_divida',uf:'RS',titulo:'Rio Grande do Sul pede suspensão da dívida para reconstrução climática',tema:'fiscal',multiplicador:2.1,gravidade:84,ministerios:['m_fazenda','m_transp'],instituicoes:['tcu'],texto:'Após nova sequência de eventos climáticos, {governador} pede suspensão temporária do serviço da dívida estadual e um fundo federal de reconstrução. Outros estados endividados observam a decisão.',opcoes:[
    {id:'suspender',texto:'Suspender parcelas com metas de reconstrução',efeito:'solidariedade',grupos:{periferia:3,universitarios:3,mercado:-2},relacao:10,oposicao:-1,fiscal:-900,crescimento:.03},
    {id:'credito',texto:'Oferecer crédito federal sem suspender a dívida',efeito:'fiscal',grupos:{mercado:3,periferia:1,universitarios:1},relacao:4,oposicao:1,fiscal:-450},
    {id:'negar',texto:'Manter contratos e regras fiscais',efeito:'austeridade',grupos:{mercado:4,periferia:-3,universitarios:-2},relacao:-11,oposicao:5},
  ]},
  {id:'am_zona_franca',uf:'AM',titulo:'Amazonas ameaça ação judicial por mudanças na Zona Franca',tema:'tributacao',multiplicador:1.9,gravidade:73,ministerios:['m_fazenda','m_ciencia'],instituicoes:['stf'],texto:'{governador} afirma que mudanças tributárias federais retiram competitividade da Zona Franca e prepara ação no STF. Indústria e ambientalistas cobram um novo modelo para Manaus.',opcoes:[
    {id:'garantia',texto:'Garantir transição longa e incentivos equivalentes',efeito:'industria',grupos:{mercado:2,periferia:2,universitarios:1},relacao:9,fiscal:-500},
    {id:'bio',texto:'Trocar parte dos incentivos por bioeconomia e tecnologia',efeito:'inovacao',grupos:{universitarios:4,mercado:2,agro:-1},relacao:3,fiscal:-650,crescimento:.04},
    {id:'stf',texto:'Sustentar a reforma e enfrentar a ação no STF',efeito:'institucional',grupos:{mercado:2,periferia:-2},relacao:-10,oposicao:4,stf:true},
  ]},
  {id:'pa_porto',uf:'PA',titulo:'Pará trava licença de corredor mineral e cobra participação federal',tema:'infraestrutura',multiplicador:1.7,gravidade:69,ministerios:['m_transp','m_meioamb'],instituicoes:['tcu'],texto:'O governo do Pará segura etapas de um corredor ferroviário-mineral e exige recursos para saneamento e cidades afetadas. {governador} diz que o estado não aceitará ser apenas rota de exportação.',opcoes:[
    {id:'territorial',texto:'Vincular obra a fundo territorial para municípios',efeito:'desenvolvimento',grupos:{periferia:3,universitarios:2,agro:1,mercado:1},relacao:8,fiscal:-600,crescimento:.04},
    {id:'obra',texto:'Priorizar cronograma da obra e compensações mínimas',efeito:'infraestrutura',grupos:{mercado:3,agro:2,universitarios:-3},relacao:-2,crescimento:.06},
    {id:'revisao',texto:'Suspender e revisar licenciamento integralmente',efeito:'ambiental',grupos:{universitarios:4,mercado:-3,agro:-2},relacao:2,crescimento:-.02},
  ]},
  {id:'rj_petroleo',uf:'RJ',titulo:'Rio ameaça frente judicial por royalties do petróleo',tema:'petroleo',multiplicador:2.0,gravidade:76,ministerios:['m_fazenda','m_fazenda'],instituicoes:['stf'],texto:'{governador} acusa o Planalto de apoiar uma mudança que reduz receitas do Rio e anuncia articulação com municípios produtores. A oposição nacional entra na disputa.',opcoes:[
    {id:'acordo',texto:'Negociar regra de transição para produtores e não produtores',efeito:'pacto',grupos:{mercado:1,periferia:1},relacao:7,fiscal:-320,oposicao:-1},
    {id:'redistribuir',texto:'Defender redistribuição nacional dos royalties',efeito:'nacional',grupos:{periferia:2,mercado:-1},relacao:-10,oposicao:5,stf:true},
    {id:'investir',texto:'Manter regra e oferecer pacote federal de segurança e mobilidade',efeito:'compensacao',grupos:{periferia:3,militares:2,mercado:-1},relacao:5,fiscal:-700},
  ]},
  {id:'ba_hidrogenio',uf:'BA',titulo:'Bahia disputa fábrica de hidrogênio verde com estados rivais',tema:'industria',multiplicador:1.6,gravidade:61,ministerios:['m_ciencia','m_meioamb','m_fazenda'],instituicoes:[],texto:'{governador} pede garantias federais e infraestrutura para atrair um megaprojeto de hidrogênio. Ceará e Pernambuco oferecem pacotes concorrentes.',opcoes:[
    {id:'competitivo',texto:'Abrir seleção técnica nacional entre estados',efeito:'tecnico',grupos:{mercado:3,universitarios:2},relacao:-1},
    {id:'bahia',texto:'Apoiar a Bahia com infraestrutura dedicada',efeito:'regional',grupos:{periferia:2,mercado:2,universitarios:2},relacao:9,fiscal:-600},
    {id:'consorcio',texto:'Criar corredor Nordeste com projetos em vários estados',efeito:'regional',grupos:{periferia:3,universitarios:3,mercado:1},relacao:5,fiscal:-900,crescimento:.05},
  ]},
  {id:'ce_datacenter',uf:'CE',titulo:'Data centers no Ceará provocam disputa por energia e água',tema:'tecnologia',multiplicador:1.7,gravidade:65,ministerios:['m_ciencia','m_fazenda','m_meioamb'],instituicoes:[],texto:'Uma rodada de investimentos em data centers é celebrada por {governador}, mas cresce a disputa sobre consumo de energia, água e incentivos fiscais.',opcoes:[
    {id:'atrair',texto:'Acelerar incentivos e conexão elétrica',efeito:'tecnologia',grupos:{mercado:4,universitarios:2,periferia:1},relacao:8,fiscal:-400,crescimento:.06},
    {id:'condicionar',texto:'Exigir metas de energia renovável e reuso de água',efeito:'clima',grupos:{universitarios:4,mercado:1},relacao:4,crescimento:.03},
    {id:'limitar',texto:'Limitar novos projetos até estudo de capacidade',efeito:'precaucao',grupos:{universitarios:2,mercado:-4},relacao:-5},
  ]},
  {id:'go_embargo',uf:'GO',titulo:'Goiás reage a embargo sanitário e cobra ofensiva diplomática',tema:'agro',multiplicador:1.7,gravidade:64,ministerios:['m_agro','m_exteriores'],instituicoes:[],texto:'Um mercado externo suspende compras de proteína brasileira após alerta sanitário. {governador} cobra reação rápida e produtores ameaçam bloquear rodovias.',opcoes:[
    {id:'missao',texto:'Enviar missão sanitária e diplomática imediatamente',efeito:'diplomacia',grupos:{agro:4,mercado:2},relacao:7,fiscal:-180},
    {id:'credito',texto:'Abrir crédito emergencial enquanto negocia',efeito:'credito',grupos:{agro:4,mercado:-1,periferia:-1},relacao:9,fiscal:-500},
    {id:'mercado',texto:'Não intervir e deixar o setor redirecionar exportações',efeito:'mercado',grupos:{mercado:2,agro:-4},relacao:-8,oposicao:3},
  ]},
  {id:'sc_portos',uf:'SC',titulo:'Santa Catarina desafia modelo federal para portos',tema:'infraestrutura',multiplicador:1.6,gravidade:58,ministerios:['m_transp'],instituicoes:['tcu'],texto:'{governador} pede mais autonomia para terminais e concessões, argumentando que Brasília atrasa investimentos e reduz competitividade exportadora.',opcoes:[
    {id:'autonomia',texto:'Delegar mais autonomia com metas de desempenho',efeito:'federalismo',grupos:{mercado:3,agro:2},relacao:10},
    {id:'padrao',texto:'Manter coordenação federal e acelerar aprovações',efeito:'gestao',grupos:{mercado:2,agro:1},relacao:2},
    {id:'controle',texto:'Endurecer controle federal e auditorias',efeito:'controle',grupos:{universitarios:1,mercado:-2},relacao:-9,oposicao:3},
  ]},
  {id:'pr_energia',uf:'PR',titulo:'Paraná pede participação maior em novo corredor energético',tema:'energia',multiplicador:1.5,gravidade:56,ministerios:['m_fazenda'],instituicoes:[],texto:'O Paraná quer prioridade industrial e compensações em um novo corredor de transmissão. {governador} ameaça retirar apoio político se o estado ficar apenas com os impactos da obra.',opcoes:[
    {id:'industria',texto:'Vincular energia a parque industrial local',efeito:'industria',grupos:{mercado:3,sindicalistas:2,agro:1},relacao:8,fiscal:-400,crescimento:.04},
    {id:'nacional',texto:'Manter planejamento nacional sem reserva estadual',efeito:'tecnico',grupos:{mercado:1},relacao:-5},
    {id:'compensar',texto:'Criar compensação ambiental e municipal',efeito:'ambiental',grupos:{universitarios:3,periferia:1},relacao:4,fiscal:-250},
  ]},
  {id:'ms_pantanal',uf:'MS',titulo:'Incêndios no Pantanal viram disputa entre produtores e ambientalistas',tema:'clima',multiplicador:2.0,gravidade:80,ministerios:['m_meioamb','m_agro','m_defesa'],instituicoes:[],texto:'Com fogo avançando sobre áreas críticas, {governador} pede Forças Armadas e crédito ao produtor. Organizações ambientais acusam omissão regulatória.',opcoes:[
    {id:'forca',texto:'Mobilizar Forças Armadas e brigadas nacionais',efeito:'emergencia',grupos:{militares:3,agro:2,universitarios:2},relacao:8,fiscal:-350},
    {id:'credito',texto:'Focar crédito de recuperação e prevenção rural',efeito:'agro',grupos:{agro:4,mercado:1,universitarios:-2},relacao:8,fiscal:-420},
    {id:'fiscalizar',texto:'Endurecer fiscalização e responsabilização',efeito:'ambiental',grupos:{universitarios:4,agro:-4},relacao:-3,oposicao:2},
  ]},
  {id:'rn_eolica',uf:'RN',titulo:'Rio Grande do Norte cobra regra para eólica offshore',tema:'energia',multiplicador:1.6,gravidade:60,ministerios:['m_fazenda','m_meioamb'],instituicoes:[],texto:'Projetos de eólica no mar aguardam regras e conexão à rede. {governador} quer acelerar investimentos e garantir participação da indústria local.',opcoes:[
    {id:'marco',texto:'Priorizar marco regulatório e leilão competitivo',efeito:'energia',grupos:{mercado:3,universitarios:3},relacao:8,crescimento:.04},
    {id:'local',texto:'Exigir conteúdo local elevado',efeito:'industria',grupos:{sindicalistas:3,periferia:2,mercado:-1},relacao:7},
    {id:'cautela',texto:'Adiar até concluir estudos ambientais',efeito:'ambiental',grupos:{universitarios:3,mercado:-3},relacao:-5},
  ]},
  {id:'pb_agua',uf:'PB',titulo:'Paraíba pressiona por garantia hídrica e novas adutoras',tema:'agua',multiplicador:1.7,gravidade:63,ministerios:['m_transp','m_social'],instituicoes:[],texto:'{governador} alerta para reservatórios críticos no interior e pede obras de integração hídrica. Prefeitos ameaçam romper politicamente com o Planalto.',opcoes:[
    {id:'obras',texto:'Acelerar adutoras e reservatórios',efeito:'infraestrutura',grupos:{periferia:4,agro:2},relacao:10,fiscal:-650,crescimento:.02},
    {id:'gestao',texto:'Priorizar gestão, perdas e contingência',efeito:'gestao',grupos:{mercado:2,periferia:1},relacao:2,fiscal:-180},
    {id:'emergencia',texto:'Liberar auxílio emergencial aos municípios',efeito:'social',grupos:{periferia:4,mercado:-2},relacao:7,fiscal:-400},
  ]},
  {id:'ma_alcantara',uf:'MA',titulo:'Alcântara volta ao centro de disputa por espaço, comunidades e soberania',tema:'espaco',multiplicador:2.0,gravidade:77,ministerios:['m_defesa','m_ciencia','m_exteriores'],instituicoes:['stf'],texto:'Uma nova proposta de cooperação espacial internacional exige expansão operacional em Alcântara. {governador} quer investimento local e garantias às comunidades afetadas.',opcoes:[
    {id:'acordo',texto:'Fechar acordo com salvaguardas territoriais e fundo local',efeito:'soberania',grupos:{militares:3,universitarios:2,periferia:2},relacao:7,fiscal:-500,crescimento:.04},
    {id:'expansao',texto:'Priorizar expansão estratégica da base',efeito:'defesa',grupos:{militares:4,mercado:2,universitarios:-3},relacao:-2,stf:true},
    {id:'adiar',texto:'Adiar o projeto até pacto social completo',efeito:'social',grupos:{universitarios:4,militares:-3},relacao:2,crescimento:-.02},
  ]},
  {id:'es_portos',uf:'ES',titulo:'Espírito Santo quer corredor portuário federal e incentivos à indústria',tema:'logistica',multiplicador:1.5,gravidade:55,ministerios:['m_transp','m_fazenda'],instituicoes:[],texto:'{governador} propõe um corredor logístico com portos, ferrovias e indústria de transformação. O projeto concorre com demandas de outros estados.',opcoes:[
    {id:'corredor',texto:'Adotar projeto como prioridade nacional',efeito:'infraestrutura',grupos:{mercado:3,agro:2,sindicalistas:1},relacao:9,fiscal:-700,crescimento:.05},
    {id:'ppp',texto:'Exigir participação privada majoritária',efeito:'mercado',grupos:{mercado:4,sindicalistas:-2},relacao:4,fiscal:-220,crescimento:.03},
    {id:'fila',texto:'Manter projeto na fila nacional',efeito:'tecnico',grupos:{mercado:1},relacao:-5,oposicao:2},
  ]},
  {id:'ac_fronteira',uf:'AC',titulo:'Acre pede operação federal após pressão migratória na fronteira',tema:'fronteira',multiplicador:1.8,gravidade:68,ministerios:['m_justica','m_saude','m_exteriores'],instituicoes:[],texto:'Fluxos migratórios elevam pressão sobre abrigo e saúde em cidades de fronteira. {governador} cobra presença federal e coordenação internacional.',opcoes:[
    {id:'humanitaria',texto:'Abrir força-tarefa humanitária e diplomática',efeito:'social',grupos:{periferia:2,universitarios:3,evangelicos:1},relacao:9,fiscal:-350},
    {id:'fronteira',texto:'Reforçar controle e triagem de fronteira',efeito:'seguranca',grupos:{militares:3,evangelicos:2,universitarios:-2},relacao:7,fiscal:-220},
    {id:'estado',texto:'Transferir execução ao estado com repasse limitado',efeito:'federalismo',grupos:{mercado:1},relacao:-4,fiscal:-100},
  ]},
  {id:'rr_energia',uf:'RR',titulo:'Roraima exige solução definitiva para energia e segurança de fronteira',tema:'energia',multiplicador:1.8,gravidade:69,ministerios:['m_fazenda','m_defesa'],instituicoes:[],texto:'{governador} afirma que a dependência energética e a tensão na fronteira criam risco estratégico. A cobrança é por conexão, geração local e presença federal.',opcoes:[
    {id:'linha',texto:'Acelerar interligação e geração de reserva',efeito:'infraestrutura',grupos:{militares:2,mercado:2,periferia:2},relacao:9,fiscal:-600,crescimento:.03},
    {id:'defesa',texto:'Priorizar presença militar e geração emergencial',efeito:'defesa',grupos:{militares:4,evangelicos:1},relacao:7,fiscal:-350},
    {id:'mercado',texto:'Contratar solução privada emergencial',efeito:'mercado',grupos:{mercado:3,periferia:-1},relacao:2,fiscal:-250},
  ]},
  {id:'ro_transmissao',uf:'RO',titulo:'Rondônia ameaça licenças de transmissão por compensações locais',tema:'energia',multiplicador:1.5,gravidade:54,ministerios:['m_fazenda','m_meioamb'],instituicoes:[],texto:'O governo estadual condiciona apoio a novas linhas de transmissão a obras locais. {governador} diz que o estado produz energia, mas recebe pouco em infraestrutura.',opcoes:[
    {id:'compensar',texto:'Criar pacote de compensações municipais',efeito:'pacto',grupos:{periferia:2,agro:2},relacao:9,fiscal:-300},
    {id:'licenca',texto:'Defender competência federal e acelerar licenças',efeito:'federal',grupos:{mercado:3,agro:1},relacao:-7,oposicao:2},
    {id:'mesa',texto:'Abrir mesa técnica com revisão de impactos',efeito:'negociacao',grupos:{universitarios:2,mercado:1},relacao:5},
  ]},
  {id:'to_irrigacao',uf:'TO',titulo:'Tocantins quer megaprojeto de irrigação e ferrovia',tema:'agro',multiplicador:1.6,gravidade:60,ministerios:['m_transp','m_agro'],instituicoes:['tcu'],texto:'{governador} apresenta um plano combinado de irrigação e logística que promete ampliar exportações, mas exige grande participação federal e licenciamento complexo.',opcoes:[
    {id:'integrado',texto:'Transformar em Projeto Especial federal',efeito:'infraestrutura',grupos:{agro:4,mercado:2,periferia:1},relacao:10,fiscal:-900,crescimento:.06},
    {id:'faseado',texto:'Aprovar por etapas e metas',efeito:'governanca',grupos:{mercado:3,agro:2},relacao:6,fiscal:-400,crescimento:.03},
    {id:'recusar',texto:'Recusar concentração de recursos',efeito:'fiscal',grupos:{mercado:1,agro:-4},relacao:-9,oposicao:3},
  ]},
  {id:'pi_solar',uf:'PI',titulo:'Piauí propõe corredor solar e indústria de equipamentos',tema:'energia',multiplicador:1.5,gravidade:53,ministerios:['m_fazenda','m_ciencia'],instituicoes:[],texto:'{governador} quer usar a expansão solar para atrair fábricas de equipamentos, com crédito federal e conteúdo local.',opcoes:[
    {id:'cadeia',texto:'Apoiar cadeia industrial completa',efeito:'industria',grupos:{mercado:2,sindicalistas:2,universitarios:2},relacao:9,fiscal:-550,crescimento:.04},
    {id:'energia',texto:'Apoiar apenas geração e transmissão',efeito:'energia',grupos:{mercado:3},relacao:5,fiscal:-300,crescimento:.03},
    {id:'leilao',texto:'Deixar expansão a cargo de leilões privados',efeito:'mercado',grupos:{mercado:4,sindicalistas:-2},relacao:-2},
  ]},
  {id:'se_gas',uf:'SE',titulo:'Sergipe cobra prioridade para gás e fertilizantes',tema:'industria',multiplicador:1.6,gravidade:58,ministerios:['m_fazenda','m_agro','m_ciencia'],instituicoes:[],texto:'{governador} propõe usar reservas de gás para atrair fertilizantes e indústria química, pedindo infraestrutura e garantias federais.',opcoes:[
    {id:'fertilizante',texto:'Priorizar fertilizantes como segurança nacional',efeito:'agro',grupos:{agro:4,militares:1,mercado:2},relacao:9,fiscal:-500,crescimento:.04},
    {id:'mercado',texto:'Abrir infraestrutura e deixar investidores escolherem projetos',efeito:'mercado',grupos:{mercado:4,agro:1},relacao:4},
    {id:'transicao',texto:'Condicionar apoio a redução de emissões',efeito:'clima',grupos:{universitarios:4,agro:-1},relacao:1},
  ]},
  {id:'al_saneamento',uf:'AL',titulo:'Alagoas pede socorro para universalização do saneamento',tema:'saneamento',multiplicador:1.5,gravidade:55,ministerios:['m_social','m_saude'],instituicoes:[],texto:'Municípios menores ficam fora de projetos rentáveis e {governador} cobra mecanismo federal para evitar desigualdade no acesso ao saneamento.',opcoes:[
    {id:'fundo',texto:'Criar fundo de equalização para municípios pequenos',efeito:'social',grupos:{periferia:4,mercado:-1},relacao:9,fiscal:-450},
    {id:'concessao',texto:'Reestruturar blocos de concessão para atrair investimento',efeito:'mercado',grupos:{mercado:3,periferia:1},relacao:5},
    {id:'estado',texto:'Exigir maior contrapartida estadual',efeito:'federalismo',grupos:{mercado:2},relacao:-4},
  ]},
  {id:'ap_petroleo',uf:'AP',titulo:'Amapá pressiona por exploração de petróleo na margem equatorial',tema:'petroleo',multiplicador:2.2,gravidade:87,ministerios:['m_fazenda','m_meioamb'],instituicoes:['stf'],texto:'{governador} afirma que o estado não aceitará permanecer pobre diante de uma fronteira petrolífera potencial. Ambientalistas alertam para risco costeiro e comunidades tradicionais.',opcoes:[
    {id:'explorar',texto:'Autorizar avanço exploratório com condicionantes',efeito:'energia',grupos:{agro:2,mercado:4,periferia:2,universitarios:-4},relacao:10,crescimento:.05,tensao:2},
    {id:'estudar',texto:'Financiar avaliação ambiental estratégica antes da decisão',efeito:'precaucao',grupos:{universitarios:4,mercado:-1,periferia:1},relacao:2,fiscal:-180},
    {id:'bloquear',texto:'Descartar exploração e apostar em bioeconomia',efeito:'clima',grupos:{universitarios:5,mercado:-3,periferia:-2},relacao:-9,oposicao:4},
  ]},
  {id:'df_servidores',uf:'DF',titulo:'Distrito Federal vira epicentro de greve e pressão sobre servidores',tema:'trabalho',multiplicador:1.7,gravidade:63,ministerios:['m_casacivil','m_fazenda'],instituicoes:[],texto:'Uma paralisação de servidores federais se espalha por Brasília. {governador} cobra solução rápida por impactos em serviços e mobilidade na capital.',opcoes:[
    {id:'negociar',texto:'Abrir mesa salarial com metas e calendário',efeito:'trabalho',grupos:{sindicalistas:4,mercado:-2},relacao:5,fiscal:-500},
    {id:'reforma',texto:'Vincular reajuste a reforma de carreiras',efeito:'gestao',grupos:{mercado:3,sindicalistas:-2},relacao:3},
    {id:'endurecer',texto:'Recusar reajuste e cortar ponto',efeito:'confronto',grupos:{mercado:4,sindicalistas:-5,universitarios:-1},relacao:-4,oposicao:3},
  ]},
];
