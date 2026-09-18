const UFS = [
  ['AC','Acre','Norte',2],['AL','Alagoas','Nordeste',3],['AP','Amapá','Norte',2],['AM','Amazonas','Norte',5],
  ['BA','Bahia','Nordeste',9],['CE','Ceará','Nordeste',6],['DF','Distrito Federal','Centro-Oeste',4],['ES','Espírito Santo','Sudeste',4],
  ['GO','Goiás','Centro-Oeste',6],['MA','Maranhão','Nordeste',5],['MT','Mato Grosso','Centro-Oeste',5],['MS','Mato Grosso do Sul','Centro-Oeste',4],
  ['MG','Minas Gerais','Sudeste',12],['PA','Pará','Norte',6],['PB','Paraíba','Nordeste',4],['PR','Paraná','Sul',8],
  ['PE','Pernambuco','Nordeste',7],['PI','Piauí','Nordeste',3],['RJ','Rio de Janeiro','Sudeste',10],['RN','Rio Grande do Norte','Nordeste',4],
  ['RS','Rio Grande do Sul','Sul',8],['RO','Rondônia','Norte',3],['RR','Roraima','Norte',2],['SC','Santa Catarina','Sul',6],
  ['SP','São Paulo','Sudeste',16],['SE','Sergipe','Nordeste',3],['TO','Tocantins','Norte',3],
];

const FIRST = ['Aline','Bruno','Camila','Diego','Elisa','Fábio','Giovana','Henrique','Isadora','Júlio','Karina','Leandro','Márcia','Nelson','Olívia','Paulo','Renata','Sérgio','Talita','Ulisses','Vitória','Wagner','Yara','Caio','Débora','Gustavo','Helena'];
const LAST = ['Albuquerque','Barreto','Campos','Diniz','Esteves','Farias','Gouveia','Lacerda','Menezes','Nogueira','Paiva','Queiroz','Ramos','Salles','Tavares','Valença','Azevedo','Bastos','Couto','Ferraz','Lemos','Montenegro','Prado','Ribeiro','Serpa','Torres','Vasconcelos'];

const diretoriaName = (partyIndex, stateIndex) => {
  const first = FIRST[(stateIndex + partyIndex * 6) % FIRST.length];
  const last = LAST[(stateIndex * 5 + partyIndex * 7) % LAST.length];
  return `${first} ${last}`;
};

const buildDiretorios = (party, partyIndex) => UFS.map(([uf,nome,regiao,peso], index) => {
  const regionalBias = party.regioesFortes?.includes(regiao) ? 13 : party.regioesFracas?.includes(regiao) ? -8 : 0;
  const pesoBoost = Math.min(13, Math.round(peso * .7));
  const maquina = Math.max(24, Math.min(96, party.maquina + regionalBias + pesoBoost + ((index * 7 + partyIndex * 11) % 13) - 8));
  const autonomia = Math.max(28, Math.min(92, 46 + ((index * 11 + partyIndex * 17) % 43) + (party.id === 'centro' ? 7 : 0)));
  const relacaoNacional = Math.max(31, Math.min(93, 58 + ((index * 9 + partyIndex * 5) % 31) - 15));
  const ala = party.alas[(index + partyIndex) % party.alas.length];
  const disputado = ((index + partyIndex * 2) % 8) === 0;
  return {
    id:`${party.id}_${uf.toLowerCase()}`,
    uf,nomeEstado:nome,regiao,
    presidente:diretoriaName(partyIndex,index),
    cargo:`Presidência estadual do ${party.sigla}`,
    maquina,
    autonomia,
    relacaoNacional,
    alaDominanteId:ala.id,
    alaDominante:ala.nome,
    delegados:Math.max(4, Math.round(peso * (0.8 + maquina/180))),
    filiadosEstimados:Math.round((11000 + peso*6900) * (0.55 + maquina/100)),
    status:disputado?'disputado':'estavel',
    prioridade: peso >= 10 ? 'estratégica' : peso >= 6 ? 'alta' : 'regular',
    observacao: disputado
      ? 'Duas correntes disputam o controle do diretório e a definição das próximas candidaturas.'
      : autonomia >= 72
        ? 'Diretório forte e autônomo; a direção nacional precisa negociar decisões locais.'
        : 'Diretório alinhado à direção nacional e dependente da estrutura partidária central.',
  };
});

const base = [
  {
    id:'esq', sigla:'PPG', nome:'Partido Progressista', numero:'29', fundacao:1989,
    logo:'/logos/parties/ppg.webp', corPrincipal:'#C84552', corSecundaria:'#7F2430', ideologia:'centro-esquerda desenvolvimentista',
    slogan:'Desenvolver para incluir.', cadeiras:110, apoio:80, fundoBase:44, capilaridade:78, disciplina:71, maquina:76,
    militancia:83, formacaoQuadros:79, digital:72, municipios:74, congresso:78,
    personalidade:'Ideológico', lider:'Dep. Silva', dialogo:'Precisamos focar no social, Presidente.',
    historia:'Nasceu da convergência entre trabalhistas, gestores públicos e movimentos sociais. Cresceu em grandes cidades e no Nordeste ao combinar proteção social, industrialização e presença estatal.',
    identidade:'Partido de massas com vocação de governo, forte cultura programática e disputa permanente entre pragmatismo fiscal e expansão social.',
    baseSocial:['sindicatos','periferias urbanas','servidores públicos','movimentos sociais','universidades'],
    prioridades:['renda e proteção social','industrialização nacional','serviços públicos','integração regional'],
    linhasVermelhas:['privatização ampla de serviços essenciais','flexibilização trabalhista sem proteção','corte abrupto de programas sociais'],
    regioesFortes:['Nordeste','Sudeste'], regioesFracas:['Centro-Oeste'],
    presidencia:{id:'part_ppg_marta',nome:'Marta Alencar',idade:59,uf:'BA',cargo:'Presidenta nacional do PPG',avatar:'part-ppg-marta-alencar',perfil:'articuladora programática',influencia:91,ambicao:74,frase:'Partido que governa sem identidade termina governado pela conjuntura.',rede:'Governadores aliados, sindicatos, bancadas sociais e diretórios do Nordeste.',vulnerabilidade:'A ala desenvolvimentista cobra mais espaço e acusa a direção de ceder demais ao centro.'},
    executivo:[
      {nome:'Márcio Fontoura',cargo:'Tesoureiro nacional',uf:'SP',influencia:84},
      {nome:'Dalva Menezes',cargo:'Secretária de organização',uf:'CE',influencia:78},
      {nome:'Irene Bastos',cargo:'Presidente do conselho programático',uf:'RS',influencia:69},
    ],
    alas:[
      {id:'trabalhista',nome:'Trabalhistas',forca:36,agenda:'Emprego, sindicatos, salário e proteção social.',risco:'Resiste a reformas liberalizantes.'},
      {id:'desenvolvimentista',nome:'Desenvolvimentistas',forca:35,agenda:'Indústria, infraestrutura e investimento público.',risco:'Pressiona por expansão fiscal.'},
      {id:'progressista',nome:'Progressistas urbanos',forca:29,agenda:'Direitos civis, ambiente, cultura e tecnologia.',risco:'Pode romper com acordos conservadores.'},
    ],
  },
  {
    id:'centro', sigla:'MOC', nome:'Movimento Central', numero:'34', fundacao:1978,
    logo:'/logos/parties/moc.webp', corPrincipal:'#E28A3A', corSecundaria:'#8A4E1E', ideologia:'centro pragmático e municipalista',
    slogan:'O Brasil cabe no diálogo.', cadeiras:220, apoio:30, fundoBase:39, capilaridade:92, disciplina:54, maquina:91,
    militancia:48, formacaoQuadros:68, digital:57, municipios:96, congresso:96,
    personalidade:'Pragmático', lider:'Dep. Cunha', dialogo:'A governabilidade tem seu preço...',
    historia:'Federação de lideranças regionais e máquinas municipais que se consolidou como principal força de mediação do Congresso. Raramente fala com uma só voz fora dos momentos eleitorais.',
    identidade:'Partido de capilaridade extrema, especializado em prefeitos, bancadas regionais e negociação orçamentária. Sua força está menos na militância e mais na organização territorial.',
    baseSocial:['prefeitos','empresariado regional','agronegócio moderado','classes médias do interior','lideranças municipais'],
    prioridades:['federalismo','infraestrutura regional','transferências a municípios','estabilidade política'],
    linhasVermelhas:['centralização excessiva em Brasília','perda abrupta de emendas e transferências','decisões nacionais sem consulta regional'],
    regioesFortes:['Centro-Oeste','Nordeste','Sudeste'], regioesFracas:[],
    presidencia:{id:'part_moc_rogerio',nome:'Rogério Paes',idade:64,uf:'MG',cargo:'Presidente nacional do MOC',avatar:'part-moc-rogerio-paes',perfil:'cacique municipalista',influencia:96,ambicao:67,frase:'Maioria nacional começa em mil acordos locais.',rede:'Prefeitos, presidentes de assembleias, líderes da Câmara e diretórios estaduais.',vulnerabilidade:'A autonomia regional torna a direção nacional dependente de pactos frágeis.'},
    executivo:[
      {nome:'Artur Lemos',cargo:'Secretário-geral',uf:'PE',influencia:90},
      {nome:'Mônica Rezende',cargo:'Coordenadora de bancadas',uf:'GO',influencia:82},
      {nome:'Paulo Seabra',cargo:'Presidente do conselho político',uf:'MG',influencia:86},
    ],
    alas:[
      {id:'municipalista',nome:'Municipalistas',forca:41,agenda:'Prefeitos, repasses, obras e autonomia local.',risco:'Rejeita centralização partidária.'},
      {id:'conservador_social',nome:'Conservadores sociais',forca:27,agenda:'Costumes, segurança e redes comunitárias.',risco:'Pode bloquear alianças progressistas.'},
      {id:'regional_desenvolvimento',nome:'Desenvolvimentistas regionais',forca:32,agenda:'Infraestrutura, crédito regional e grandes projetos.',risco:'Pressiona por gasto territorial.'},
    ],
  },
  {
    id:'dir', sigla:'LIB', nome:'Liberais Unidos', numero:'46', fundacao:1996,
    logo:'/logos/parties/lib.webp', corPrincipal:'#3D9B67', corSecundaria:'#1F5F3C', ideologia:'centro-direita liberal',
    slogan:'Liberdade para crescer.', cadeiras:130, apoio:10, fundoBase:36, capilaridade:74, disciplina:68, maquina:73,
    militancia:64, formacaoQuadros:83, digital:91, municipios:61, congresso:72,
    personalidade:'Opositor', lider:'Dep. Mendes', dialogo:'O mercado não está feliz.',
    historia:'Surgiu da união entre liberais econômicos, conservadores institucionais e novas lideranças empresariais. Cresceu com forte comunicação digital e presença nas regiões Sul e Sudeste.',
    identidade:'Partido de oposição programática com boa disciplina, quadros técnicos e grande capacidade de mobilização digital.',
    baseSocial:['empreendedores','mercado financeiro','profissionais liberais','agro exportador','eleitorado urbano de renda média'],
    prioridades:['equilíbrio fiscal','segurança jurídica','abertura econômica','inovação privada'],
    linhasVermelhas:['controle amplo de preços','estatizações sem compensação','expansão fiscal permanente sem fonte'],
    regioesFortes:['Sul','Sudeste','Centro-Oeste'], regioesFracas:['Nordeste'],
    presidencia:{id:'cac_lib_se',nome:'Eduardo Meirelles',idade:58,uf:'SP',cargo:'Presidente nacional do LIB',avatar:'cac-eduardo-meirelles',perfil:'liberal ortodoxo',influencia:92,ambicao:81,frase:'Coerência econômica é o primeiro ativo de uma oposição.',rede:'Mercado, industriais, bancada liberal e diretórios do Sul e Sudeste.',vulnerabilidade:'A ala conservadora cobra maior presença em segurança e costumes.'},
    executivo:[
      {nome:'Renata Morais',cargo:'Líder nacional na Câmara',uf:'PR',influencia:84},
      {nome:'Vicente Nobre',cargo:'Coordenador jurídico',uf:'GO',influencia:78},
      {nome:'Marina Valença',cargo:'Secretária de formação política',uf:'SC',influencia:72},
    ],
    alas:[
      {id:'liberal_economica',nome:'Liberais econômicos',forca:39,agenda:'Fiscal, privatização, concorrência e comércio.',risco:'Resiste a concessões distributivas.'},
      {id:'conservador_institucional',nome:'Conservadores institucionais',forca:33,agenda:'Segurança, ordem e instituições.',risco:'Pressiona por agenda mais dura.'},
      {id:'agroempresarial',nome:'Agroempresariais',forca:28,agenda:'Exportação, infraestrutura e desregulação rural.',risco:'Conflita com pautas ambientais.'},
    ],
  },
  {
    id:'ind', sigla:'IND', nome:'Independentes', numero:'58', fundacao:2012,
    logo:'/logos/parties/ind.webp', corPrincipal:'#3F7FBF', corSecundaria:'#234C78', ideologia:'centro social-liberal',
    slogan:'Ideias antes de trincheiras.', cadeiras:53, apoio:50, fundoBase:18, capilaridade:46, disciplina:38, maquina:49,
    militancia:52, formacaoQuadros:75, digital:86, municipios:39, congresso:47,
    personalidade:'Moderado', lider:'Dep. Alves', dialogo:'Analisaremos caso a caso.',
    historia:'Criado por gestores, acadêmicos e dissidentes dos grandes partidos, tornou-se abrigo de candidaturas personalistas e quadros técnicos. Cresce rápido, mas sofre para impor disciplina.',
    identidade:'Rede partidária mais horizontal, urbana e técnica. Tem pouca máquina tradicional, porém grande flexibilidade eleitoral e capacidade de atrair nomes sem trajetória partidária.',
    baseSocial:['profissionais técnicos','universitários','gestores públicos','empreendedores de inovação','eleitorado independente'],
    prioridades:['gestão baseada em evidências','educação e tecnologia','federalismo cooperativo','reformas institucionais'],
    linhasVermelhas:['aparelhamento partidário explícito','alianças sem justificativa programática','controle excessivo da direção nacional'],
    regioesFortes:['Sudeste','Norte'], regioesFracas:['Centro-Oeste'],
    presidencia:{id:'part_ind_clara',nome:'Clara Vasconcelos',idade:55,uf:'RJ',cargo:'Presidenta nacional do IND',avatar:'part-ind-clara-vasconcelos',perfil:'gestora social-liberal',influencia:75,ambicao:63,frase:'Independência sem organização é só solidão eleitoral.',rede:'Quadros técnicos, universidades, movimentos cívicos e novos prefeitos.',vulnerabilidade:'Personalidades fortes resistem às decisões da Executiva Nacional.'},
    executivo:[
      {nome:'Luís Ferraz',cargo:'Porta-voz nacional',uf:'RJ',influencia:67},
      {nome:'Nádia Macuxi',cargo:'Coordenadora regional',uf:'RR',influencia:62},
      {nome:'Sérgio Neri',cargo:'Secretário de inovação partidária',uf:'SP',influencia:58},
    ],
    alas:[
      {id:'social_liberal',nome:'Social-liberais',forca:34,agenda:'Direitos, mercado regulado e mobilidade social.',risco:'Conflita com pautas conservadoras.'},
      {id:'tecnocrata',nome:'Tecnocratas',forca:38,agenda:'Gestão, evidências, digitalização e educação.',risco:'Baixa tolerância à barganha política.'},
      {id:'pragmatico_eleitoral',nome:'Pragmáticos eleitorais',forca:28,agenda:'Candidaturas competitivas e alianças locais.',risco:'Pode diluir identidade partidária.'},
    ],
  },
];

const GOVERNANCA = {
  convencao:{titulo:'Convenção',texto:'Delegados estaduais, bancada federal e Executiva Nacional dividem o poder de oficializar chapa e programa.'},
  fundo:{titulo:'Fundo partidário',texto:'A direção nacional administra custeio, formação política e estrutura permanente da máquina.'},
  diretorios:{titulo:'Diretórios estaduais',texto:'Cada UF possui liderança, máquina, ala dominante, autonomia e delegados próprios.'},
  distribuicao:{titulo:'Distribuição de recursos',texto:'Peso eleitoral, competitividade e acordos internos definem quanto cada candidatura recebe.'},
  aliancas:{titulo:'Alianças',texto:'A Executiva autoriza a estratégia nacional, mas diretórios fortes podem negociar exceções locais.'},
  intervencao:{titulo:'Intervenção em diretórios',texto:'Em crise grave, a direção pode tentar substituir comandos estaduais — com custo político e risco de dissidência.'},
  candidaturas:{titulo:'Escolha de candidaturas',texto:'Prévias, convenções e acordos entre alas definem nomes; máquina e popularidade pesam tanto quanto fidelidade.'},
};

export const partidosSeed = base.map((party, index) => ({
  ...party,
  cor:`bg-${party.id==='esq'?'red-600':party.id==='centro'?'orange-500':party.id==='dir'?'green-600':'blue-600'}`,
  governanca:GOVERNANCA,
  diretorios:buildDiretorios(party,index),
}));

export const partidoPorId = (id) => partidosSeed.find(p=>p.id===id) || null;
export const partidoPorSigla = (sigla) => partidosSeed.find(p=>p.sigla===sigla) || null;
export const diretorioPartidario = (partidoId, uf) => partidoPorId(partidoId)?.diretorios?.find(d=>d.uf===uf) || null;

export const partidosEleitoraisBase = partidosSeed.map(p=>({
  id:p.id,sigla:p.sigla,nome:p.nome,ideologia:p.ideologia,fundoBase:p.fundoBase,capilaridade:p.capilaridade,disciplina:p.disciplina,cor:p.corPrincipal,logo:p.logo,maquina:p.maquina,
}));
