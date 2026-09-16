const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));

const eventos=[
  {
    id:'tcu_programas',instituicao:'TCU',cooldown:6,
    quando:s=>Number(s.economia?.resultadoPrimario??0)<-12000 && (s.programas||[]).filter(p=>['ativo','implantacao','atrasado'].includes(p.status)).length>=3,
    titulo:'TCU abre auditoria coordenada sobre carteira de programas',
    texto:'O controle externo pede metas, contratos e cronogramas dos maiores programas federais após a expansão do gasto e da execução simultânea.',
    efeitos:{capitalPolitico:-2,riscoJuridico:4,congresso:-1,oposicao:1.5},
  },
  {
    id:'tcu_estatais',instituicao:'TCU',cooldown:6,
    quando:s=>(s.estatais||[]).some(e=>(e.exposicaoPolitica||0)>78 && (e.governanca||50)<60),
    titulo:'TCU amplia fiscalização sobre governança de estatais',
    texto:'Contratos, nomeações e decisões de investimento entram no radar do controle externo após sinais de exposição política elevada.',
    efeitos:{capitalPolitico:-1,riscoJuridico:5,oposicao:1},
  },
  {
    id:'tcu_obras',instituicao:'TCU',cooldown:7,
    quando:s=>(s.projetosEspeciais||[]).filter(p=>p.status==='ativo').length>=3,
    titulo:'TCU seleciona grandes obras para acompanhamento especial',
    texto:'A concentração de projetos estratégicos leva o tribunal a montar uma matriz de risco para contratos, licenças e cronogramas.',
    efeitos:{capitalPolitico:-1,riscoJuridico:3,confiancaMercado:.5},
  },
  {
    id:'pgr_tensao',instituicao:'PGR',cooldown:5,
    quando:s=>Number(s.institucional?.tensaoInstitucional??0)>=50,
    titulo:'PGR pede informações formais ao Planalto em meio à tensão institucional',
    texto:'A Procuradoria solicita documentos e fundamentos jurídicos de atos recentes antes de decidir se abre uma frente própria de apuração.',
    efeitos:{capitalPolitico:-1,riscoJuridico:3,tensaoInstitucional:1,oposicao:1},
  },
  {
    id:'pgr_estatais',instituicao:'PGR',cooldown:8,
    quando:s=>(s.estatais||[]).some(e=>(e.exposicaoPolitica||0)>88 && (e.governanca||50)<52),
    titulo:'PGR recebe representação sobre interferência em empresa estatal',
    texto:'Uma representação pede apuração sobre decisões administrativas e possível uso político de uma companhia federal.',
    efeitos:{capitalPolitico:-2,riscoJuridico:5,tensaoInstitucional:2,oposicao:2},
  },
  {
    id:'bc_inflacao',instituicao:'BC',cooldown:4,
    quando:s=>Number(s.economia?.inflacao??4.5)>=6.5,
    titulo:'Banco Central endurece sinalização diante da inflação',
    texto:'A autoridade monetária indica que a política de juros permanecerá restritiva enquanto expectativas e preços não convergirem.',
    efeitos:{selic:.5,crescimentoPib:-.025,confiancaMercado:.5},
  },
  {
    id:'bc_risco',instituicao:'BC',cooldown:5,
    quando:s=>Number(s.economia?.riscoPais??250)>=390,
    titulo:'Banco Central reage a deterioração das expectativas financeiras',
    texto:'Risco-país e câmbio pressionam expectativas. O BC sinaliza atuação mais dura para conter repasses à inflação.',
    efeitos:{selic:.25,crescimentoPib:-.015,confiancaMercado:.3,capitalPolitico:-1},
  },
  {
    id:'stf_federacao',instituicao:'STF',cooldown:6,
    quando:s=>(s.historicoEventosFederativos||[]).some(e=>(e.resolvidoNoTurno||0)>=(s.turno||1)-2 && (e.instituicoes||[]).includes('stf')),
    titulo:'STF acelera análise de disputa federativa com impacto nacional',
    texto:'A Corte decide dar prioridade a um conflito entre União e estado após a controvérsia começar a contaminar outras relações federativas.',
    efeitos:{capitalPolitico:-1,tensaoInstitucional:2,riscoJuridico:2},
  },
  {
    id:'stf_executivo',instituicao:'STF',cooldown:7,
    quando:s=>Number(s.institucional?.riscoJuridico??0)>=45,
    titulo:'STF pauta controle de atos do Executivo',
    texto:'O aumento do risco jurídico faz a Corte concentrar julgamentos capazes de limitar instrumentos do governo federal.',
    efeitos:{capitalPolitico:-1,tensaoInstitucional:2},
  },
  {
    id:'tcu_parcerias',instituicao:'TCU',cooldown:7,
    quando:s=>(s.parceriasEmpresariais||[]).filter(p=>p.status==='ativa').length>=3,
    titulo:'TCU cobra matriz de riscos das parcerias empresariais do governo',
    texto:'A multiplicação de acordos com grupos privados leva o controle externo a exigir critérios uniformes de seleção e fiscalização.',
    efeitos:{riscoJuridico:3,capitalPolitico:-1,confiancaMercado:.4},
  },
  {
    id:'pgr_eleitoral',instituicao:'PGR',cooldown:8,
    quando:s=>Number(s.eleicao?.riscoJuridico??0)>=45 || Number(s.eleicao?.juridico??0)>=45,
    titulo:'PGR Eleitoral acompanha condutas de alto risco da pré-campanha',
    texto:'A Procuradoria Eleitoral informa que reunirá elementos sobre condutas que podem ultrapassar os limites da disputa política regular.',
    efeitos:{capitalPolitico:-2,riscoJuridico:4,tensaoInstitucional:1},
  },
  {
    id:'bc_credito',instituicao:'BC',cooldown:6,
    quando:s=>Number(s.economia?.confiancaMercado??50)<32 && Number(s.economia?.crescimentoPib??0)<0,
    titulo:'Banco Central alerta para aperto de crédito e transmissão financeira',
    texto:'Indicadores de confiança e atividade sugerem piora nas condições de crédito. A autoridade monetária pede cautela fiscal e regulatória.',
    efeitos:{crescimentoPib:-.02,confiancaMercado:-.5,capitalPolitico:-1},
  },

  {
    id:'tcu_politica_industrial',instituicao:'TCU',cooldown:5,
    quando:s=>(s.politicaEconomica?.historico||[]).some(h=>h.tipo==='medida'&&(h.controle?.tcu||0)>=60&&(s.turno||1)-(h.turno||0)<=2),
    titulo:'TCU abre acompanhamento sobre incentivo econômico recente',
    texto:'O desenho de subsídios, metas e contratos entra em fiscalização preventiva. O tribunal pede critérios de seleção, custo fiscal e indicadores de desempenho.',
    efeitos:{capitalPolitico:-1,riscoJuridico:4,confiancaMercado:.4,oposicao:.5},
  },
  {
    id:'stf_politica_economica',instituicao:'STF',cooldown:6,
    quando:s=>(s.politicaEconomica?.historico||[]).some(h=>h.tipo==='medida'&&(h.controle?.stf||0)>=60&&(s.turno||1)-(h.turno||0)<=3),
    titulo:'STF recebe ação contra desenho de política econômica',
    texto:'Partidos e entidades questionam isonomia, livre concorrência ou competência do Executivo em uma medida econômica recente.',
    efeitos:{capitalPolitico:-1,riscoJuridico:5,tensaoInstitucional:2,oposicao:1},
  },
  {
    id:'tcu_minerais_criticos',instituicao:'TCU',cooldown:8,
    quando:s=>(s.comercioExterior?.acordos||[]).some(a=>['terras_raras','niobio','litio'].includes(a.produtoId)) && Number(s.comercioExterior?.concorrenciaGeopolitica?.ultimaMudanca?.turno||0)>=(s.turno||1)-3,
    titulo:'TCU pede transparência em contratos de minerais críticos',
    texto:'Acordos de longo prazo em minerais estratégicos entram no radar do controle externo por risco de concentração, preferência e perda de valor agregado doméstico.',
    efeitos:{capitalPolitico:-1,riscoJuridico:4,confiancaMercado:.3},
  },
  {
    id:'stf_concorrencia_externa',instituicao:'STF',cooldown:8,
    quando:s=>(s.comercioExterior?.concorrenciaGeopolitica?.tensoes||[]).some(t=>(t.intensidade||0)>=50) && Object.values(s.comercioExterior?.concorrenciaGeopolitica?.preferencias||{}).some(v=>Math.abs(Number(v))>=10),
    titulo:'Política de preferência comercial chega ao debate constitucional',
    texto:'Uma coalizão empresarial questiona critérios de preferência a fornecedores estrangeiros e pede parâmetros de concorrência e tratamento isonômico.',
    efeitos:{capitalPolitico:-1,riscoJuridico:4,tensaoInstitucional:1.5,confiancaMercado:-.3},
  },

];

export const eventosInstitucionaisAutonomos=eventos;

export function processInstitutionalAutonomy(state={},rng=Math.random){
  const turno=Number(state.turno||1)+1;
  const institucional={...(state.institucional||{})};
  const historico=institucional.movimentosAutonomos||[];
  const cooldowns={...(institucional.cooldownsAutonomos||{})};
  if((institucional.ultimaAcaoAutonomaTurno||0)>=turno-1) return {evento:null,institucional};
  const elegiveis=eventos
    .filter(e=>e.quando(state))
    .filter(e=>turno-(cooldowns[e.id]||-99)>=(e.cooldown||6));
  if(!elegiveis.length) return {evento:null,institucional};
  const chance=Math.min(.82,.3+elegiveis.length*.07+Math.max(0,(state.institucional?.tensaoInstitucional||0)-30)/180);
  if(rng()>chance) return {evento:null,institucional};
  const evento=elegiveis[Math.floor(rng()*Math.min(4,elegiveis.length))];
  const registro={...evento,turno,idInstancia:`inst_${evento.id}_${turno}`,status:'ocorrido'};
  return {
    evento:registro,
    institucional:{
      ...institucional,
      ultimaAcaoAutonomaTurno:turno,
      cooldownsAutonomos:{...cooldowns,[evento.id]:turno},
      movimentosAutonomos:[registro,...historico].slice(0,30),
    },
  };
}

export function aplicarEfeitosInstitucionais(state,evento){
  if(!evento) return {};
  const e=evento.efeitos||{};
  const economia={...state.economia};
  if(e.selic) economia.selic=Math.max(.5,(economia.selic||13.75)+e.selic);
  if(e.crescimentoPib) economia.crescimentoPib=Number(((economia.crescimentoPib||0)+e.crescimentoPib).toFixed(3));
  if(e.confiancaMercado) economia.confiancaMercado=clamp((economia.confiancaMercado||50)+e.confiancaMercado);
  const institucional={...(state.institucional||{})};
  if(e.riscoJuridico) institucional.riscoJuridico=clamp((institucional.riscoJuridico||0)+e.riscoJuridico);
  if(e.tensaoInstitucional) institucional.tensaoInstitucional=clamp((institucional.tensaoInstitucional||0)+e.tensaoInstitucional);
  return {
    economia,
    institucional,
    capitalPolitico:clamp((state.capitalPolitico||0)+(e.capitalPolitico||0)),
    congresso:{...state.congresso,poder:clamp((state.congresso?.poder||0)+(e.congresso||0))},
    oposicao:{...state.oposicao,forca:clamp((state.oposicao?.forca||30)+(e.oposicao||0))},
  };
}
