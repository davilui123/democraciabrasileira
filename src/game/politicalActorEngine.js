const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));

export const POLITICAL_AI_VERSION = 3;

export const createPoliticalAIState = () => ({
  version: POLITICAL_AI_VERSION,
  actors: {},
  movements: [],
  lastProcessedTurn: 0,
});

const actorFromGovernor=(estado)=>({
  id:`gov:${estado.uf}`,
  type:'governador',
  sourceId:estado.uf,
  nome:estado.governador?.nome||`Governador de ${estado.nome}`,
  cargo:`Governador de ${estado.nome}`,
  uf:estado.uf,
  relation:clamp(estado.governador?.relacao ?? estado.relacaoPlanalto ?? 50),
  ambition:clamp(estado.governador?.ambicao ?? 50),
  popularity:clamp(estado.governador?.popularidade ?? estado.aprovacao ?? 50),
  influence:clamp(35+(estado.eleitoradoPeso||1)*2.2),
  style:estado.governador?.estilo||'pragmático',
});

const actorFromMinister=(m)=>({
  id:`min:${m.id}`,
  type:'ministro',
  sourceId:m.id,
  nome:m.nome,
  cargo:m.cargo||m.cargoNome||'Ministro de Estado',
  relation:clamp(m.relacao ?? m.lealdade ?? 58),
  ambition:clamp(m.ambicao ?? 48),
  popularity:clamp(m.popularidade ?? 50),
  influence:clamp(m.influencia ?? 55),
  style:m.perfil||m.estilo||'governista',
});

const actorFromCongress=(a)=>({
  id:`cam:${a.id}`,
  type:'congresso',
  sourceId:a.id,
  nome:a.nome,
  cargo:a.cargo||a.funcao||'Liderança parlamentar',
  uf:a.uf,
  relation:clamp(a.relacao ?? 50),
  ambition:clamp(a.ambicao ?? 55),
  popularity:clamp(a.popularidade ?? 50),
  influence:clamp(a.influencia ?? 55),
  style:a.perfil||a.estilo||'articulador',
});

export const discoverPoliticalActors = (state) => [
  ...(state.estados||[]).map(actorFromGovernor),
  ...(state.nomeacoes||[]).map(actorFromMinister),
  ...(state.atoresCongresso||[]).filter(a=>(a.influencia||0)>=68 || a.cargo || a.funcao).map(actorFromCongress),
];

const mergeActor=(base,old={})=>({
  ...old,
  ...base,
  memories:Array.isArray(old.memories)?old.memories:[],
  momentum:Number(old.momentum||0),
  posture:old.posture||'observando',
  lastActionTurn:old.lastActionTurn||0,
});

export const syncPoliticalAI=(politicalAI,state)=>{
  const ai={...createPoliticalAIState(),...(politicalAI||{}),actors:{...(politicalAI?.actors||{})}};
  discoverPoliticalActors(state).forEach(actor=>{ai.actors[actor.id]=mergeActor(actor,ai.actors[actor.id]);});
  return ai;
};

export const addPoliticalMemory=(politicalAI,actorId,memory)=>{
  const ai={...createPoliticalAIState(),...(politicalAI||{}),actors:{...(politicalAI?.actors||{})}};
  const actor=ai.actors[actorId]||{id:actorId,nome:memory?.actorName||actorId,memories:[],momentum:0,posture:'observando'};
  const item={
    id:memory?.id||`mem_${actorId.replace(/[^a-z0-9]/gi,'_')}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    turn:memory?.turn||0,
    type:memory?.type||'politica',
    valence:Number(memory?.valence||0),
    title:memory?.title||'Movimento político',
    text:memory?.text||memory?.title||'Movimento político',
  };
  ai.actors[actorId]={...actor,memories:[item,...(actor.memories||[]).filter(m=>m.id!==item.id)].slice(0,8),momentum:clamp((actor.momentum||0)+item.valence,-20,20)};
  return ai;
};


const memoryWeight=(memory,turn)=>{
  const age=Math.max(0,Number(turn||0)-Number(memory?.turn||0));
  const permanent=['crise_federativa','rompimento','eleicao','humilhacao'].includes(memory?.type);
  const decay=permanent?Math.max(.35,1-age*.035):Math.max(0,1-age*.12);
  return Number(memory?.valence||0)*decay;
};

const memoryScore=(actor,turn)=>(actor.memories||[]).reduce((sum,m)=>sum+memoryWeight(m,turn),0);

const styleBias=(actor,kind)=>{
  const style=String(actor.style||'').toLowerCase();
  if(kind==='confronto' && /combativ|duro|soberan|oposi|linha/.test(style)) return 9;
  if(kind==='aproximacao' && /pragm|gestor|moderad|negoci/.test(style)) return 7;
  if(kind==='projecao_nacional' && /presid|ambicios|nacional/.test(style)) return 10;
  if(kind==='rompimento_ministerial' && /autonom|politic|ambicios/.test(style)) return 6;
  if(kind==='pressao_congresso' && /articul|lider|cacique/.test(style)) return 7;
  return 0;
};

export const agePoliticalMemories=(politicalAI,turn)=>{
  const ai={...createPoliticalAIState(),...(politicalAI||{}),actors:{...(politicalAI?.actors||{})}};
  const actors={};
  Object.entries(ai.actors).forEach(([id,actor])=>{
    const memories=(actor.memories||[]).filter(m=>{
      const age=Math.max(0,Number(turn||0)-Number(m.turn||0));
      return ['crise_federativa','rompimento','eleicao','humilhacao'].includes(m.type) || age<=12;
    });
    actors[id]={...actor,memories,momentum:Math.max(-20,Math.min(20,Number(actor.momentum||0)*.92))};
  });
  return {...ai,actors};
};

const pickMovement=(actor,turn)=>{
  if(turn-(actor.lastActionTurn||0)<2) return null;
  if(actor.type==='governador'){
    const mem=memoryScore(actor,turn);
    if(actor.ambition>=82 && actor.popularity>=62 && turn>=12) return {kind:'projecao_nacional',weight:actor.ambition+actor.popularity-110+styleBias(actor,'projecao_nacional')+Math.max(0,actor.momentum||0)};
    if(actor.relation<=34 && actor.influence>=55) return {kind:'confronto',weight:(40-actor.relation)+(actor.influence-50)+styleBias(actor,'confronto')+Math.max(0,-mem*2)};
    if(turn>=39 && actor.ambition<83 && actor.influence>=50 && actor.relation>=70) return {kind:'apoio_governo',weight:actor.relation-52+actor.influence*.15+Math.max(0,mem)};
    if(turn>=39 && actor.ambition<83 && actor.influence>=50 && actor.relation<=30) return {kind:'apoio_oposicao',weight:42-actor.relation+actor.influence*.15+Math.max(0,-mem)};
    if(actor.relation>=68 && mem>=-1) return {kind:'aproximacao',weight:actor.relation-58+styleBias(actor,'aproximacao')+Math.max(0,mem)};
  }
  if(actor.type==='ministro'){
    const mem=memoryScore(actor,turn);
    if(turn>=6 && actor.ambition>=68 && actor.relation<=27) return {kind:'rompimento_ministerial',weight:(actor.ambition-actor.relation)+24+styleBias(actor,'rompimento_ministerial')+Math.max(0,-mem)};
    if(actor.ambition>=72 && actor.relation<=42) return {kind:'autonomia_ministerial',weight:actor.ambition-actor.relation+Math.max(0,-mem)};
  }
  if(actor.type==='congresso'){
    const mem=memoryScore(actor,turn);
    if(actor.influence>=82 && actor.relation<=28) return {kind:'bloqueio_bancada',weight:(actor.influence-actor.relation)+12+Math.max(0,-mem)};
    if(actor.influence>=78 && actor.relation<=38) return {kind:'pressao_congresso',weight:actor.influence-actor.relation+styleBias(actor,'pressao_congresso')+Math.max(0,-mem)};
  }
  return null;
};

const describeMovement=(actor,kind)=>{
  if(kind==='projecao_nacional') return `${actor.nome} amplia viagens e articulações fora de ${actor.uf||'seu reduto'}, alimentando especulações sobre um projeto nacional.`;
  if(kind==='confronto') return `${actor.nome} endurece o discurso contra o Planalto e tenta transformar uma disputa local em pauta nacional.`;
  if(kind==='aproximacao') return `${actor.nome} sinaliza disposição para uma agenda conjunta com o Planalto e reduz o tom de confronto.`;
  if(kind==='apoio_governo') return `${actor.nome} anuncia apoio ao projeto eleitoral do Planalto e coloca sua máquina estadual na campanha.`;
  if(kind==='apoio_oposicao') return `${actor.nome} rompe a neutralidade e passa a apoiar uma candidatura de oposição ao Planalto.`;
  if(kind==='autonomia_ministerial') return `${actor.nome} começa a construir agenda própria dentro do governo e cobra mais espaço político.`;
  if(kind==='rompimento_ministerial') return `${actor.nome} rompe com o Planalto e deixa o governo, transformando a saída em gesto político.`;
  if(kind==='pressao_congresso') return `${actor.nome} articula sua bancada para elevar o preço político das próximas votações do governo.`;
  if(kind==='bloqueio_bancada') return `${actor.nome} anuncia que sua bancada não dará votos automáticos ao governo e ameaça travar a pauta.`;
  return `${actor.nome} faz um novo movimento político.`;
};

export const processPoliticalAI = (politicalAI,state,rng=Math.random)=>{
  let ai=agePoliticalMemories(syncPoliticalAI(politicalAI,state),state.turno);
  if(ai.lastProcessedTurn===state.turno) return {ai,movement:null};
  const candidates=Object.values(ai.actors).map(actor=>({actor,movement:pickMovement(actor,state.turno)})).filter(x=>x.movement);
  candidates.sort((a,b)=>b.movement.weight-a.movement.weight);
  // Nem todo mês precisa produzir uma jogada visível. Quanto maior a pressão, maior a chance.
  const selected=candidates.find((item,index)=>rng()<Math.min(.72,.18+item.movement.weight/100-index*.05))||null;
  let movement=null;
  if(selected){
    const {actor}=selected; const kind=selected.movement.kind;
    movement={id:`move_${state.turno}_${actor.id}_${kind}`,turn:state.turno,actorId:actor.id,actorName:actor.nome,actorType:actor.type,kind,text:describeMovement(actor,kind)};
    const old=ai.actors[actor.id];
    ai={...ai,actors:{...ai.actors,[actor.id]:{...old,lastActionTurn:state.turno,posture:kind}},movements:[movement,...(ai.movements||[])].slice(0,40)};
    ai=addPoliticalMemory(ai,actor.id,{id:`memory_${movement.id}`,turn:state.turno,type:'autonomia',valence:kind==='aproximacao'?1:-1,title:'Movimento autônomo',text:movement.text});
  }
  ai={...ai,lastProcessedTurn:state.turno};
  return {ai,movement};
};

export const getPoliticalActor=(politicalAI,actorId)=>politicalAI?.actors?.[actorId]||null;
