const pad=(n)=>String(n).padStart(2,'0');

export const AGENDA_CALENDARIO_INICIAL = {
  compromissos: [],
  convites: [],
  historico: [],
};

export const adicionarMeses=(data,meses=0,dia=12)=>{
  const d=new Date(data instanceof Date?data:new Date(data));
  const out=new Date(d.getFullYear(),d.getMonth()+meses,Math.min(28,Math.max(1,dia)));
  return out;
};

export const isoData=(data)=>{
  const d=data instanceof Date?data:new Date(data);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
};

export const turnoDaData=(dataInicio,data)=>{
  const a=new Date(dataInicio); const b=new Date(data);
  return (b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth())+1;
};

export const dataDoTurno=(dataInicio,turno,dia=12)=>adicionarMeses(dataInicio,Math.max(0,(turno||1)-1),dia);

export const criarAgendaCalendarioInicial=(dataInicio=new Date(2023,0,1))=>({
  compromissos:[
    {id:'agenda_abertura_congresso',tipo:'institucional',titulo:'Abertura do ano legislativo',subtitulo:'Presidentes da Câmara e do Senado',local:'Congresso Nacional · Brasília',turno:2,dia:2,dataISO:isoData(dataDoTurno(dataInicio,2,2)),status:'confirmado',prioridade:'alta',flexivel:false,origem:'Congresso',descricao:'Cerimônia institucional e primeira grande sinalização da relação do Planalto com o Legislativo.',efeitos:{congresso:2,capitalPolitico:1}},
    {id:'agenda_expoagro',tipo:'economia',titulo:'ExpoAgro Brasil · abertura oficial',subtitulo:'Produtores, cooperativas e exportadores',local:'Goiânia · GO',turno:4,dia:14,dataISO:isoData(dataDoTurno(dataInicio,4,14)),status:'confirmado',prioridade:'media',flexivel:true,origem:'Ministério da Agricultura',descricao:'Grande vitrine nacional do agronegócio, crédito rural, tecnologia e abertura de mercados.',efeitos:{grupos:{agro:1.6,mercado:.6},comercio:1}},
    {id:'agenda_brics',tipo:'internacional',titulo:'Cúpula do BRICS',subtitulo:'Chefes de Estado e agenda econômica',local:'Exterior · sede rotativa',turno:6,dia:18,dataISO:isoData(dataDoTurno(dataInicio,6,18)),status:'confirmado',prioridade:'alta',flexivel:false,origem:'Itamaraty',descricao:'Compromisso multilateral marcado com antecedência. Abre encontros bilaterais paralelos e oportunidades de investimento.',efeitos:{softPower:2,diplomacia:2}},
    {id:'agenda_onu',tipo:'internacional',titulo:'Assembleia Geral das Nações Unidas',subtitulo:'Discurso e encontros bilaterais',local:'Nova York · Estados Unidos',turno:9,dia:20,dataISO:isoData(dataDoTurno(dataInicio,9,20)),status:'confirmado',prioridade:'alta',flexivel:false,origem:'Itamaraty',descricao:'Semana de alta exposição internacional com discurso, bilaterais e articulação multilateral.',efeitos:{softPower:2,diplomacia:2}},
    {id:'agenda_g20',tipo:'internacional',titulo:'Cúpula do G20',subtitulo:'Economia global, clima e desenvolvimento',local:'Exterior · sede rotativa',turno:11,dia:15,dataISO:isoData(dataDoTurno(dataInicio,11,15)),status:'confirmado',prioridade:'alta',flexivel:false,origem:'Itamaraty',descricao:'Encontro de chefes de governo com forte potencial para comércio, financiamento e acordos laterais.',efeitos:{softPower:2,confiancaMercado:1}},
  ],
  convites:[],
  historico:[],
});

const hash=(s='')=>[...String(s)].reduce((a,c)=>a+c.charCodeAt(0),0);

export const criarConviteVisitaInternacional=({pais,turnoAtual=1,dataInicio=new Date(2023,0,1)})=>{
  const deslocamento=2+(hash(pais?.id)%4); // 2 a 5 meses
  const turnoProposto=turnoAtual+deslocamento;
  const dia=10+(hash(pais?.nome)%12);
  const data=dataDoTurno(dataInicio,turnoProposto,dia);
  return {
    id:`conv_visita_${pais.id}_${turnoAtual}`,
    tipo:'internacional',
    titulo:`Encontro bilateral · Brasil × ${pais.nome}`,
    subtitulo:'Proposta de data recebida pela chancelaria',
    local:pais.nome,
    turnoProposto,
    dia,
    dataISO:isoData(data),
    prazoTurno:Math.max(turnoAtual+1,turnoProposto-1),
    status:'pendente',
    prioridade:'alta',
    flexivel:true,
    origem:'Itamaraty',
    paisId:pais.id,
    descricao:`A chancelaria de ${pais.nome} propõe encontro presidencial. A visita pode incluir agenda empresarial, abertura de mercado e reunião bilateral.`,
    custoRecusa:{relacao:-2,softPower:-1},
  };
};

export const criarConviteMidiaCalendario=({convite,turnoAtual=1,dataInicio=new Date(2023,0,1)})=>{
  if(!convite)return null;
  const turnoProposto=turnoAtual+1;
  const dia=7+((turnoAtual*3)%17);
  return {
    id:`agenda_${convite.id}`,
    tipo:'midia',
    titulo:`${convite.midia} · ${convite.formato}`,
    subtitulo:'Entrevista presidencial solicitada',
    local:convite.midia==='Global'?'Estúdios Global · Brasília':'Estúdio / transmissão nacional',
    turnoProposto,dia,dataISO:isoData(dataDoTurno(dataInicio,turnoProposto,dia)),prazoTurno:turnoProposto,
    status:'pendente',prioridade:convite.tensao==='alta'?'alta':'media',flexivel:true,origem:convite.midia,
    midiaId:convite.midiaId,formato:convite.formato,pergunta:convite.pergunta,alcance:convite.alcance,
    descricao:`${convite.midia} quer entrevistar o Presidente. A pauta pode ser favorável, hostil ou imprevisível conforme o momento político.`,
    custoRecusa:{reputacaoDigital:-1,oposicao:1},
  };
};

export const criarConviteGovernadorCalendario=({evento,turnoAtual=1,dataInicio=new Date(2023,0,1)})=>{
  if(!evento||!evento.governador||Number(evento.gravidade||0)<72)return null;
  const turnoProposto=turnoAtual+1;
  const dia=4+((hash(evento.uf)+turnoAtual)%10);
  const urgencia=Number(evento.gravidade||0)>=82;
  return {
    id:`conv_gov_${evento.id}_${turnoAtual}`,
    tipo:'governador',
    titulo:`${evento.governador.nome} pede presença presidencial em ${evento.estado}`,
    subtitulo:urgencia?'Chamado de alta urgência':'Convite federativo',
    local:`${evento.estado} · ${evento.uf}`,
    turnoProposto,dia,dataISO:isoData(dataDoTurno(dataInicio,turnoProposto,dia)),prazoTurno:turnoProposto,
    status:'pendente',prioridade:urgencia?'urgente':'alta',flexivel:!urgencia,origem:`Governo de ${evento.estado}`,
    uf:evento.uf,eventoId:evento.id,
    descricao:`O governador pede que o Presidente vá ao estado durante a crise “${evento.titulo}”. Presença física pode reduzir desgaste federativo, mas ocupa agenda e cria expectativas de ajuda federal.`,
    custoRecusa:{relacaoGovernador:-5,oposicao:2},
  };
};

export const criarConviteEmpresarialCalendario=({turnoAtual=1,dataInicio=new Date(2023,0,1),empresa})=>{
  if(!empresa)return null;
  const turnoProposto=turnoAtual+1;
  const dia=16+((hash(empresa.id)+turnoAtual)%8);
  return {id:`conv_empresa_${empresa.id}_${turnoAtual}`,tipo:'empresa',titulo:`Reunião com ${empresa.nome}`,subtitulo:'Investimento e expansão no Brasil',local:'Palácio do Planalto · Brasília',turnoProposto,dia,dataISO:isoData(dataDoTurno(dataInicio,turnoProposto,dia)),prazoTurno:turnoProposto,status:'pendente',prioridade:'media',flexivel:true,origem:'Secretaria de Investimentos',empresaId:empresa.id,descricao:`A direção de ${empresa.nome} solicita encontro para discutir investimento, parceria e acesso ao mercado brasileiro.`,custoRecusa:{confiancaMercado:-.5}};
};

export const compromissosNoTurno=(agenda={},turno=1)=>(agenda.compromissos||[]).filter(c=>c.status==='confirmado'&&Number(c.turno)===Number(turno)).sort((a,b)=>(a.dia||1)-(b.dia||1));
export const convitesAbertos=(agenda={},turno=1)=>(agenda.convites||[]).filter(c=>c.status==='pendente'&&(c.prazoTurno??999)>=turno).sort((a,b)=>(a.turnoProposto||999)-(b.turnoProposto||999)||(a.dia||1)-(b.dia||1));
export const proximosCompromissos=(agenda={},turno=1,limite=6)=>(agenda.compromissos||[]).filter(c=>c.status==='confirmado'&&c.turno>=turno).sort((a,b)=>a.turno-b.turno||(a.dia||1)-(b.dia||1)).slice(0,limite);
