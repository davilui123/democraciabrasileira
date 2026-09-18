// =================================================================================
// 4.9.7.5 — CONVENÇÃO & ELEIÇÃO
// Conecta a máquina partidária viva ao ciclo eleitoral: delegados reais dos 27
// diretórios, alas, alianças, distribuição do fundo e escolha de candidaturas.
// =================================================================================

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));
const round1=(v)=>Math.round(Number(v||0)*10)/10;
const hash=(text='')=>[...String(text)].reduce((a,c)=>(a*31+c.charCodeAt(0))%100003,17);

const REGIOES=['Norte','Nordeste','Centro-Oeste','Sudeste','Sul'];
const DEFAULT_ALLOCATION={presidencia:38,governadores:34,camara:18,senado:10};
const MIN_ALLOC={presidencia:20,governadores:18,camara:8,senado:6};
const MAX_ALLOC={presidencia:58,governadores:52,camara:35,senado:25};

export const PARTY_ELECTION_INITIAL={
  partidoId:null,
  atualizadoTurno:0,
  delegados:{total:0,favor:0,contra:0,indecisos:0,apoioPct:28,porRegiao:[],porDiretorio:[]},
  alas:[],
  fundo:{totalProjetado:0,distribuicao:{...DEFAULT_ALLOCATION},valores:{},revisoes:[]},
  candidaturasEstaduais:[],
  aliancas:[],
  maquinaEleitoral:50,
  rivalInterno:null,
  convencao:{status:'preparacao',minimo:62,homologada:false,resumo:null},
};

export const hydratePartyElection=(state={},partidoId=null)=>{
  state=state||{};
  return ({
  ...PARTY_ELECTION_INITIAL,
  ...state,
  partidoId:partidoId||state.partidoId||null,
  delegados:{...PARTY_ELECTION_INITIAL.delegados,...(state.delegados||{}),porRegiao:[...(state.delegados?.porRegiao||[])],porDiretorio:[...(state.delegados?.porDiretorio||[])]},
  alas:[...(state.alas||[])],
  fundo:{...PARTY_ELECTION_INITIAL.fundo,...(state.fundo||{}),distribuicao:{...DEFAULT_ALLOCATION,...(state.fundo?.distribuicao||{})},valores:{...(state.fundo?.valores||{})},revisoes:[...(state.fundo?.revisoes||[])]},
  candidaturasEstaduais:[...(state.candidaturasEstaduais||[])],
  aliancas:[...(state.aliancas||[])],
  convencao:{...PARTY_ELECTION_INITIAL.convencao,...(state.convencao||{})},
  });
};

const activeAlliances=(sistema,partyId)=>(sistema?.aliancas||[]).filter(a=>a.status==='ativa'&&a.partidos?.includes(partyId));
const negotiationRegionBonus=(eleicao,regiao)=>{
  const apoios=eleicao?.convencao?.apoios||[];
  return apoios.reduce((sum,a)=>{
    if(!a.accepted)return sum;
    const r=a.regiao||a.caciqueRegiao;
    return sum+(r===regiao?6.5:1.2);
  },0);
};
const wingOf=(party,id)=>party?.alas?.find(a=>a.id===id)||party?.alas?.[0]||{};

const buildDelegates=({party,eleicao,estados=[]})=>{
  const dirs=party?.diretorios||[];
  const govRelation=party?.governoPartidario?.relacaoPresidente ?? party?.apoio ?? 50;
  const coherence=party?.governoPartidario?.coerenciaProgramatica ?? eleicao?.coerencia ?? 60;
  const rows=dirs.map(d=>{
    const wing=wingOf(party,d.alaDominanteId);
    const estado=estados.find(e=>e.uf===d.uf);
    const gov=estado?.governador||{};
    const incumbentBoost=gov.partidoId===party.id?Math.max(0,((gov.popularidade||50)-45)*.11)+4:0;
    const autonomyPenalty=(d.autonomia||50)>78&&govRelation<55?4:0;
    const support=clamp(
      20+(d.satisfacao||50)*.18+(d.relacaoNacional||50)*.13+(wing.satisfacao||55)*.10+
      (party.satisfacaoDirecao||55)*.10+(party.unidadeInterna||55)*.08+govRelation*.08+coherence*.07+
      incumbentBoost+negotiationRegionBonus(eleicao,d.regiao)-autonomyPenalty
    );
    const delegates=Math.max(1,Math.round(d.delegados||4));
    const favor=Math.round(delegates*support/100);
    const undecided=Math.max(0,Math.round(delegates*(.08+(100-(party.unidadeInterna||55))*.0011)));
    const favorAdj=Math.min(delegates-undecided,favor);
    const contra=Math.max(0,delegates-favorAdj-undecided);
    return {uf:d.uf,estado:d.nomeEstado,regiao:d.regiao,delegados:delegates,apoioPct:round1(support),favor:favorAdj,contra,indecisos:undecided,maquina:d.maquina||50,autonomia:d.autonomia||50,alaDominante:d.alaDominante};
  });
  const total=rows.reduce((s,r)=>s+r.delegados,0)||1;
  const favor=rows.reduce((s,r)=>s+r.favor,0),contra=rows.reduce((s,r)=>s+r.contra,0),indecisos=rows.reduce((s,r)=>s+r.indecisos,0);
  const apoioPct=round1(favor/total*100);
  const porRegiao=REGIOES.map(regiao=>{
    const rr=rows.filter(r=>r.regiao===regiao);const t=rr.reduce((s,r)=>s+r.delegados,0)||0;const f=rr.reduce((s,r)=>s+r.favor,0);
    return {regiao,delegados:t,apoioPct:t?round1(f/t*100):0,maquina:t?round1(rr.reduce((s,r)=>s+r.maquina*r.delegados,0)/t):0};
  }).filter(r=>r.delegados>0);
  return {total,favor,contra,indecisos,apoioPct,porRegiao,porDiretorio:rows};
};

const buildWingConvention=(party,delegates)=>{
  const total=delegates.total||1;
  return (party?.alas||[]).map(a=>{
    const dirs=delegates.porDiretorio.filter(d=>d.alaDominante===a.nome);
    const local=dirs.reduce((s,d)=>s+d.delegados,0);
    const peso=local||Math.round(total*(a.forca||33)/100);
    const apoioLocal=dirs.length?dirs.reduce((s,d)=>s+d.apoioPct*d.delegados,0)/Math.max(1,local):delegates.apoioPct;
    const apoio=clamp(apoioLocal+((a.satisfacao||55)-55)*.12);
    return {id:a.id,nome:a.nome,pesoDelegados:peso,apoioPct:round1(apoio),satisfacao:round1(a.satisfacao||55),mobilizacao:round1(a.mobilizacao||50)};
  });
};

const fundTotal=(party,alliances=[])=>{
  const federationBonus=alliances.filter(a=>a.tipo==='federacao').length*10;
  const allianceBonus=alliances.filter(a=>a.tipo!=='federacao').length*4;
  return round1((party?.fundoBase||20)*1.85+(party?.caixaPartidario||60)*.14+(party?.maquina||50)*.11+(party?.cadeiras||0)*.035+federationBonus+allianceBonus);
};
const fundValues=(total,dist)=>Object.fromEntries(Object.entries(dist).map(([k,v])=>[k,round1(total*v/100)]));

const buildStateSlate=({party,estados=[],eleicao=null,previous=[]})=>(party?.diretorios||[]).map(d=>{
  const old=previous.find(c=>c.uf===d.uf)||{};
  const e=estados.find(x=>x.uf===d.uf);const gov=e?.governador||{};const race=(eleicao?.corridasGovernadores||[]).find(r=>r.uf===d.uf);
  const incumbent=gov.partidoId===party.id;
  const localName=incumbent?gov.nome:(race?.challenger?.nome||d.presidente);
  const localType=incumbent?'reeleição estadual':race?.challenger?.nome?'candidatura estadual da legenda':'quadro do diretório';
  const competitiveness=clamp((d.maquina||50)*.5+(d.satisfacao||50)*.18+(d.relacaoNacional||50)*.12+(incumbent?(gov.popularidade||50)*.2:12));
  return {...old,uf:d.uf,estado:d.nomeEstado,prioridade:d.prioridade,candidatoBase:localName,tipoBase:localType,competitividade:round1(competitiveness),status:old.status||'avaliando',estrategia:old.estrategia||'avaliando',parceiroId:old.parceiroId||null,nomeEscolhido:old.nomeEscolhido||localName};
});

const pickInternalRival=(party,delegates)=>{
  if(!party||delegates.apoioPct>=73)return null;
  const dissatisfied=(party.alas||[]).slice().sort((a,b)=>((a.satisfacao||55)-(b.satisfacao||55)))[0];
  const exec=(party.executivo||[])[hash(`${party.id}:${dissatisfied?.id||'ala'}`)%Math.max(1,(party.executivo||[]).length)]||party.presidencia;
  const tension=clamp((100-(party.unidadeInterna||55))*.45+(100-(dissatisfied?.satisfacao||55))*.35+(100-delegates.apoioPct)*.35);
  if(tension<31)return null;
  return {id:`rival_${party.id}_${dissatisfied?.id||'interno'}`,nome:exec?.nome||`Nome da ala ${dissatisfied?.nome||'dissidente'}`,cargo:exec?.cargo||'Liderança partidária',ala:dissatisfied?.nome||'Dissidência',apoioPct:round1(clamp(18+tension*.55,18,48)),ativo:true,motivo:'A candidatura presidencial enfrenta resistência de uma corrente que teme perda de identidade e espaço.'};
};

export const sincronizarPartidoEleitoral=({eleicao,partido,sistemaPartidario={},estados=[],turno=1})=>{
  if(!eleicao||!partido)return hydratePartyElection(eleicao?.partidoEleitoral,partido?.id||eleicao?.partidoAtual);
  const prev=hydratePartyElection(eleicao.partidoEleitoral,partido.id);
  const aliancas=activeAlliances(sistemaPartidario,partido.id).map(a=>({...a}));
  const delegados=buildDelegates({party:partido,eleicao,estados});
  const alas=buildWingConvention(partido,delegados);
  const total=fundTotal(partido,aliancas);
  const distribuicao={...DEFAULT_ALLOCATION,...prev.fundo.distribuicao};
  const valores=fundValues(total,distribuicao);
  const candidaturasEstaduais=buildStateSlate({party:partido,estados,eleicao,previous:prev.candidaturasEstaduais});
  const allyMachine=aliancas.reduce((s,a)=>s+(a.tipo==='federacao'?5:2),0);
  const maquinaEleitoral=round1(clamp((partido.maquina||50)*.42+(partido.capilaridade||50)*.24+(partido.digital||50)*.14+(partido.disciplina||50)*.1+(partido.prestigioPartidario||50)*.1+allyMachine));
  const rivalInterno=prev.convencao?.homologada?null:pickInternalRival(partido,delegados);
  return {...prev,partidoId:partido.id,atualizadoTurno:turno,delegados,alas,aliancas,maquinaEleitoral,rivalInterno,candidaturasEstaduais,fundo:{...prev.fundo,totalProjetado:total,distribuicao,valores},convencao:{...prev.convencao,minimo:eleicao.convencao?.minimo||62,status:prev.convencao?.homologada?'homologada':delegados.apoioPct>=(eleicao.convencao?.minimo||62)?'pronta':'em_disputa'}};
};

export const ajustarDistribuicaoFundo=({partidoEleitoral,categoria,delta=5,turno=1})=>{
  const pe=hydratePartyElection(partidoEleitoral,partidoEleitoral?.partidoId);
  if(!Object.hasOwn(DEFAULT_ALLOCATION,categoria))return {ok:false,motivo:'Categoria de distribuição inválida.'};
  delta=Math.sign(delta)*5;
  if(!delta)return {ok:false,motivo:'Ajuste inválido.'};
  const dist={...pe.fundo.distribuicao};
  const next=dist[categoria]+delta;
  if(next<MIN_ALLOC[categoria]||next>MAX_ALLOC[categoria])return {ok:false,motivo:`${categoria} deve permanecer entre ${MIN_ALLOC[categoria]}% e ${MAX_ALLOC[categoria]}%.`};
  const others=Object.keys(dist).filter(k=>k!==categoria).sort((a,b)=>delta>0?dist[b]-dist[a]:dist[a]-dist[b]);
  const target=others.find(k=>delta>0?dist[k]-5>=MIN_ALLOC[k]:dist[k]+5<=MAX_ALLOC[k]);
  if(!target)return {ok:false,motivo:'Não há margem para redistribuir mais recursos.'};
  dist[categoria]+=delta;dist[target]-=delta;
  const valores=fundValues(pe.fundo.totalProjetado,dist);
  return {ok:true,partidoEleitoral:{...pe,fundo:{...pe.fundo,distribuicao:dist,valores,revisoes:[{turno,categoria,delta,contrapartida:target},...(pe.fundo.revisoes||[])].slice(0,20)}}};
};

export const decidirCandidaturaEstadual=({partidoEleitoral,partido,sistemaPartidario={},uf,estrategia,capitalPolitico=0,turno=1})=>{
  const pe=hydratePartyElection(partidoEleitoral,partido?.id);const item=pe.candidaturasEstaduais.find(c=>c.uf===uf);if(!item)return {ok:false,motivo:'Estado não encontrado na estratégia partidária.'};
  const dir=partido?.diretorios?.find(d=>d.uf===uf);if(!dir)return {ok:false,motivo:'Diretório estadual não encontrado.'};
  const allies=activeAlliances(sistemaPartidario,partido.id).map(a=>a.partidos.find(id=>id!==partido.id)).filter(Boolean);
  const costs={homologar_local:0,compor_alianca:1,impor_nacional:2};const cost=costs[estrategia];if(cost===undefined)return {ok:false,motivo:'Estratégia de candidatura inválida.'};if(capitalPolitico<cost)return {ok:false,motivo:`São necessários ${cost} pontos de Capital Político.`};
  if(estrategia==='compor_alianca'&&!allies.length)return {ok:false,motivo:'Seu partido não possui aliança nacional ativa para sustentar uma composição local.'};
  let nome=item.candidatoBase,status='homologada',parceiroId=null,dirSat=0,dirRel=0;
  if(estrategia==='compor_alianca'){parceiroId=allies[0];nome=`Composição estadual com aliado`;status='composicao';dirSat=(dir.autonomia||50)>70?-4:1;dirRel=2;}
  if(estrategia==='impor_nacional'){const exec=(partido.executivo||[])[hash(`${partido.id}:${uf}`)%Math.max(1,(partido.executivo||[]).length)]||partido.presidencia;nome=exec?.nome||item.candidatoBase;status='imposta';dirSat=-9;dirRel=5;}
  if(estrategia==='homologar_local'){dirSat=4;dirRel=1;}
  const candidaturasEstaduais=pe.candidaturasEstaduais.map(c=>c.uf===uf?{...c,estrategia,status,parceiroId,nomeEscolhido:nome,decididaTurno:turno}:c);
  const diretorios=(partido.diretorios||[]).map(d=>d.uf===uf?{...d,satisfacao:clamp((d.satisfacao||50)+dirSat),relacaoNacional:clamp((d.relacaoNacional||50)+dirRel)}:d);
  return {ok:true,partidoEleitoral:{...pe,candidaturasEstaduais},partido:{...partido,diretorios},capitalPolitico:capitalPolitico-cost,custoCapital:cost,item:candidaturasEstaduais.find(c=>c.uf===uf)};
};

export const finalizarConvencaoPartidaria=({eleicao,partidoEleitoral,partido,turno=1})=>{
  const pe=hydratePartyElection(partidoEleitoral,partido?.id||eleicao?.partidoAtual);
  const apoio=pe.delegados.apoioPct||0, minimo=eleicao?.convencao?.minimo||62;
  if(apoio<minimo)return {ok:false,motivo:`A convenção real tem ${apoio.toFixed(1)}% dos delegados com você. São necessários ${minimo}%.`};
  const presidencia=pe.fundo.valores?.presidencia||0;
  const rival=pe.rivalInterno;
  const resumo={turno,delegados:pe.delegados.total,apoioPct:apoio,favor:pe.delegados.favor,contra:pe.delegados.contra,indecisos:pe.delegados.indecisos,rivalInterno:rival?.nome||null,aliancas:pe.aliancas.map(a=>a.id),cotaPresidencial:presidencia};
  const partidoEleitoralFinal={...pe,rivalInterno:rival?{...rival,ativo:false,desfecho:'derrotado_na_convencao'}:null,convencao:{...pe.convencao,status:'homologada',homologada:true,resumo}};
  const next={...eleicao,partidoEleitoral:partidoEleitoralFinal,convencao:{...(eleicao.convencao||{}),apoioDelegados:apoio,realizada:true,oficializado:true,delegadosReais:resumo},candidatura:{...(eleicao.candidatura||{}),status:'oficializada',oficializada:true},chapa:{...(eleicao.chapa||{}),status:eleicao.chapa?.vice?'oficializada':'aguarda_vice'},recursos:{...(eleicao.recursos||{}),fefcProjetado:round1(presidencia)}};
  return {ok:true,eleicao:next,partidoEleitoral:partidoEleitoralFinal,resumo};
};

export const aplicarEfeitoMaquinaEleitoral=(eleicao)=>{
  const pe=eleicao?.partidoEleitoral;if(!pe)return eleicao;
  const machine=pe.maquinaEleitoral||50;
  const recognitionDelta=clamp((machine-50)*.018,-.45,.65);
  const govShare=(pe.fundo?.distribuicao?.governadores||34)-34;
  const mods={...(eleicao.modificadoresEstados||{})};
  const selected=(pe.candidaturasEstaduais||[]).filter(c=>['homologada','imposta','composicao'].includes(c.status));
  selected.forEach(c=>{const base=c.status==='homologada'?.09:c.status==='imposta'?.05:.06;mods[c.uf]=clamp((mods[c.uf]||0)+base+govShare*.004,-12,14)});
  return {...eleicao,reconhecimento:clamp((eleicao.reconhecimento||22)+recognitionDelta),modificadoresEstados:mods};
};
