const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const AGENDA_LEGISLATIVA_INICIAL = {
  ultimaIniciativaTurno: 0,
  totalAutonomas: 0,
  porOrigem: { oposicao: 0, congresso: 0, governadores: 0 },
  historico: [],
};

export const origemLegislativaMeta = {
  executivo: { label: 'Poder Executivo', short: 'Planalto' },
  oposicao: { label: 'Oposição', short: 'Oposição' },
  congresso: { label: 'Congresso', short: 'Câmara' },
  governadores: { label: 'Governadores', short: 'Estados' },
};

const normalize = (value='') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const words = (value='') => normalize(value)
  .split(/[^a-z0-9]+/)
  .filter(x => x.length >= 4);

const activeStatuses = new Set(['em_tramitacao','votacao_hoje','aguarda_segundo_turno','senado','aguardando_sancao']);

const isAvailable = (lei, votacoes, aprovadas, recentLaws=new Set()) => {
  if (aprovadas.includes(lei.id) || recentLaws.has(lei.id)) return false;
  return !votacoes.some(v => v.leiId === lei.id && activeStatuses.has(v.status));
};

const matchScore = (law, text) => {
  const haystack = new Set(words(`${law.titulo} ${law.descricao} ${(law.tags||[]).join(' ')} ${law.categoria}`));
  return words(text).reduce((sum, word) => sum + (haystack.has(word) ? 10 : 0), 0);
};

const scoreOpposition = (law, perfilPresidencial, oposicao) => {
  const affin = law.afinidade || {};
  const party = perfilPresidencial?.partidoId || 'esq';
  const antiGovernment = 100 - (affin[party] ?? 50);
  const oppositionAffinity = (affin.dir ?? 50) * .56 + (affin.centro ?? 50) * .24 + (affin.ind ?? 50) * .20;
  const symbolic = (law.polarizacao || 40) * .18;
  const force = (oposicao?.forca || 34) * .16;
  return oppositionAffinity + antiGovernment * .26 + symbolic + force;
};

const bestCongressActor = (law, atores=[]) => atores
  .map(actor => ({
    actor,
    score: (law.afinidade?.[actor.partidoId] ?? 50) * .52
      + (actor.influencia || 50) * .24
      + (actor.ambicao || 50) * .10
      + (actor.pauta || []).reduce((s,p)=>s + (p === law.categoria || (law.tags||[]).includes(p) ? 13 : 0),0),
  }))
  .sort((a,b)=>b.score-a.score)[0];

const scoreGovernor = (law, state) => {
  const gov=state.governador||{};
  const thematic = matchScore(law, `${state.prioridade||''} ${gov.biografia||''} ${gov.agendaPessoal||''}`);
  const federal = law.riscosControle?.federativo || 25;
  const strategic = (gov.ambicao || 45) * .20 + (gov.popularidade || 50) * .10;
  const friction = (100 - (state.relacaoPlanalto ?? gov.relacao ?? 50)) * .08;
  return thematic + federal*.28 + strategic + friction;
};

const topWeightedPick = (scored, random=Math.random) => {
  const top=scored.filter(x=>Number.isFinite(x.score)).sort((a,b)=>b.score-a.score).slice(0,6);
  if(!top.length) return null;
  const idx=Math.min(top.length-1,Math.floor(clamp(random(),0,.999999)*Math.min(3,top.length)));
  return top[idx];
};

const sourceChoice = ({oposicao, estados, random=Math.random}) => {
  const hostile=(estados||[]).filter(e=>(e.relacaoPlanalto??50)<42).length;
  const opp=oposicao?.forca||34;
  const x=random();
  const govWeight=clamp(.26+hostile*.018,.24,.48);
  const oppWeight=clamp(.28+(opp-34)*.004,.24,.48);
  if(x<oppWeight) return 'oposicao';
  if(x<oppWeight+govWeight) return 'governadores';
  return 'congresso';
};

export const criarIniciativaLegislativaAutonoma = ({
  turno,
  leis=[],
  votacoes=[],
  leisAprovadas=[],
  atoresCongresso=[],
  estados=[],
  oposicao={},
  partidos=[],
  perfilPresidencial={},
  agenda=AGENDA_LEGISLATIVA_INICIAL,
  random=Math.random,
  origemForcada=null,
}) => {
  const ativosAutonomos=votacoes.filter(v=>v.origem && v.origem!=='executivo' && activeStatuses.has(v.status)).length;
  if(turno<2 || ativosAutonomos>=5) return { ok:false, reason:'limite' };
  if((agenda?.ultimaIniciativaTurno||0)>=turno) return { ok:false, reason:'ja_gerou' };

  const chance=clamp(.48 + ((oposicao?.forca||34)-34)*.004 + Math.min(5,(estados||[]).filter(e=>(e.relacaoPlanalto??50)<40).length)*.025,.38,.78);
  if(!origemForcada && random()>chance) return { ok:false, reason:'sem_movimento' };

  const origem=origemForcada||sourceChoice({oposicao,estados,random});
  const recentLaws=new Set((agenda?.historico||[]).filter(h=>turno-(h.turno||0)<6).map(h=>h.leiId));
  let lawPick=null;
  let autor=null;
  let patrocinadores=[];

  if(origem==='oposicao'){
    const candidates=leis.filter(l=>l.origensPermitidas?.includes('congresso')&&isAvailable(l,votacoes,leisAprovadas,recentLaws));
    lawPick=topWeightedPick(candidates.map(l=>({law:l,score:scoreOpposition(l,perfilPresidencial,oposicao)})),random);
    const leader=(oposicao?.nucleo||[]).find(x=>/c[aâ]mara/i.test(x.cargo||'')) || oposicao?.lider || oposicao?.nucleo?.[0];
    autor=leader?{id:leader.id,nome:leader.nome,cargo:leader.cargo||'Liderança da oposição',tipo:'oposicao',partido:leader.partido||leader.partidoId||'LIB',partidoId:'dir'}:{id:'oposicao',nome:'Liderança da oposição',cargo:'Oposição',tipo:'oposicao'};
    patrocinadores=[oposicao?.sigla||'FRN','LIB'];
  }

  if(origem==='congresso'){
    const candidates=leis.filter(l=>l.origensPermitidas?.includes('congresso')&&isAvailable(l,votacoes,leisAprovadas,recentLaws));
    const scored=[];
    for(const law of candidates){const pick=bestCongressActor(law,atoresCongresso);if(pick)scored.push({law,actor:pick.actor,score:pick.score});}
    lawPick=topWeightedPick(scored,random);
    const actor=lawPick?.actor;
    autor=actor?{id:actor.id,nome:actor.nome,cargo:actor.cargo,tipo:'congresso',partidoId:actor.partidoId,uf:actor.uf}:null;
    if(actor?.partidoId){const p=partidos.find(x=>x.id===actor.partidoId);patrocinadores=[p?.sigla||actor.partidoId];}
  }

  if(origem==='governadores'){
    const candidates=leis.filter(l=>l.origensPermitidas?.includes('governadores')&&isAvailable(l,votacoes,leisAprovadas,recentLaws));
    const scored=[];
    for(const law of candidates){
      const ranking=(estados||[]).map(state=>({state,score:scoreGovernor(law,state)})).sort((a,b)=>b.score-a.score);
      if(ranking[0]) scored.push({law,leader:ranking[0],allies:ranking.slice(1,4),score:ranking[0].score+(law.riscosControle?.federativo||0)*.18});
    }
    lawPick=topWeightedPick(scored,random);
    const lead=lawPick?.leader?.state;
    autor=lead?{id:`gov_${lead.uf}`,nome:lead.governador?.nome||`Governador de ${lead.uf}`,cargo:`Governador(a) de ${lead.nome}`,tipo:'governador',uf:lead.uf,partido:lead.governador?.partido}:null;
    patrocinadores=[lead?.uf,...(lawPick?.allies||[]).filter(x=>x.score>=Math.max(35,(lawPick?.leader?.score||0)-18)).map(x=>x.state.uf)].filter(Boolean);
  }

  const lei=lawPick?.law;
  if(!lei || !autor) return { ok:false, reason:'sem_candidato' };

  const agendaNova={
    ...AGENDA_LEGISLATIVA_INICIAL,
    ...(agenda||{}),
    ultimaIniciativaTurno:turno,
    totalAutonomas:(agenda?.totalAutonomas||0)+1,
    porOrigem:{...AGENDA_LEGISLATIVA_INICIAL.porOrigem,...(agenda?.porOrigem||{}),[origem]:((agenda?.porOrigem||{})[origem]||0)+1},
    historico:[{turno,origem,leiId:lei.id,titulo:lei.titulo,autor:autor.nome,patrocinadores},...(agenda?.historico||[])].slice(0,40),
  };

  return {ok:true,origem,lei,autor,patrocinadores,agenda:agendaNova};
};

export const descricaoOrigemLegislativa = (proposal) => {
  if(!proposal) return '';
  if(proposal.origem==='governadores') return proposal.patrocinadores?.length>1 ? `Coalizão de ${proposal.patrocinadores.length} estados` : 'Governo estadual';
  if(proposal.origem==='oposicao') return 'Agenda da oposição';
  if(proposal.origem==='congresso') return 'Iniciativa parlamentar';
  return 'Agenda presidencial';
};

export default criarIniciativaLegislativaAutonoma;
