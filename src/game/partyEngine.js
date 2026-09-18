const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));
const round1=(v)=>Math.round(Number(v||0)*10)/10;
const norm=(s='')=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const hash=(text='')=>[...String(text)].reduce((a,c)=>(a*31+c.charCodeAt(0))%100003,17);
const roll=(partyId,turno,salt='')=>(hash(`${partyId}:${turno}:${salt}`)%1000)/10;

export const PARTY_ACTIONS={
  reuniao_executiva:{id:'reuniao_executiva',nome:'Reunião da Executiva',descricao:'Presidência, bancada e direção nacional alinham prioridades antes que divergências virem rebelião.',custoCapital:2,custoCaixa:2,efeito:'Direção +6 · unidade +4'},
  mobilizar_militancia:{id:'mobilizar_militancia',nome:'Mobilizar militância',descricao:'Ativa núcleos, redes e organização de base para ampliar filiações e presença territorial.',custoCapital:0,custoCaixa:8,efeito:'Militância +3 · máquina +1 · filiações'},
  formacao_quadros:{id:'formacao_quadros',nome:'Formação de quadros',descricao:'Investe em escolas partidárias, novas lideranças e preparação técnica para governos e campanhas.',custoCapital:0,custoCaixa:10,efeito:'Quadros +3 · prestígio +2'},
  fortalecer_diretorio:{id:'fortalecer_diretorio',nome:'Fortalecer diretório',descricao:'Transfere estrutura e recursos para uma direção estadual selecionada.',custoCapital:1,custoCaixa:12,efeito:'Máquina local +6 · relação nacional +4'},
  apaziguar_ala:{id:'apaziguar_ala',nome:'Apaziguar ala',descricao:'Negociação interna concede espaço político a uma corrente insatisfeita.',custoCapital:1,custoCaixa:5,efeito:'Satisfação da ala +12 · unidade +2'},
};

const totalFiliados=(party)=>Math.round((party.diretorios||[]).reduce((s,d)=>s+(d.filiadosEstimados||0),0));
const initialCash=(party)=>Math.round((party.fundoBase||20)*3.2+(party.cadeiras||0)*.16);

export const hydratePartyDynamics=(party)=>{
  const alas=(party.alas||[]).map(a=>({
    ...a,
    satisfacao: a.satisfacao ?? clamp(58+(a.forca||30)*.12),
    mobilizacao: a.mobilizacao ?? clamp(42+(a.forca||30)*.55),
    relacaoDirecao: a.relacaoDirecao ?? 62,
    tendencia: a.tendencia || 'estável',
  }));
  const diretorios=(party.diretorios||[]).map(d=>({
    ...d,
    satisfacao: d.satisfacao ?? clamp(54+(d.relacaoNacional||50)*.16),
    caixaLocal: d.caixaLocal ?? Math.max(2,Math.round((d.maquina||50)*.11)),
    crescimentoFiliados: d.crescimentoFiliados ?? 0,
    riscoIntervencao: d.riscoIntervencao ?? clamp((d.autonomia||50)*.45+(100-(d.relacaoNacional||50))*.35-18),
  }));
  return {
    ...party,
    alas,diretorios,
    satisfacaoDirecao:party.satisfacaoDirecao ?? 62,
    unidadeInterna:party.unidadeInterna ?? clamp((party.disciplina||50)*.72+22),
    prestigioPartidario:party.prestigioPartidario ?? clamp(((party.maquina||50)+(party.capilaridade||50)+(party.disciplina||50))/3),
    caixaPartidario:party.caixaPartidario ?? initialCash(party),
    filiadosNacionais:party.filiadosNacionais ?? totalFiliados({...party,diretorios}),
    balancoFundo:party.balancoFundo || {entrada:0,saida:0,saldo:0,turno:0},
    acoesPartidariasTurno:party.acoesPartidariasTurno || [],
    historicoPartidario:party.historicoPartidario || [],
    crisesInternas:party.crisesInternas || [],
    governoPartidario:hydrateGovernmentRelationship(party),
  };
};

const wingTags={
  trabalhista:['trabalho','social','renda','emprego','previd'], desenvolvimentista:['econom','infra','industr','energia','tecnolog'], progressista:['direitos','ambient','cultura','digital','educ'],
  municipalista:['feder','municip','infra','regional'], conservador_social:['segur','justica','famil','defesa'], regional_desenvolvimento:['infra','agro','desenvolv','credito'],
  liberal_economica:['econom','tribut','mercado','fiscal','empresa'], conservador_institucional:['segur','justica','instituc','defesa'], agroempresarial:['agro','ambient','infra','comercio'],
  social_liberal:['direitos','social','educ','saude'], tecnocrata:['gestao','digital','educ','tecnolog','instituc'], pragmatico_eleitoral:['feder','infra','politic','eleitor'],
};
const recentLawTags=(state,turno)=>{
  const out=[];
  (state.votacoes||[]).forEach(v=>{
    const recent=(v.historico||[]).some(h=>Number(h.turno)>=Number(turno)-1&&['sancao','veto_congresso','promulgacao','votacao'].includes(h.tipo));
    if(recent)out.push(norm(`${v.categoria||''} ${v.titulo||''}`));
  });
  return out;
};
const wingPolicyDelta=(ala,lawTags)=>{
  const tags=wingTags[ala.id]||[];
  if(!lawTags.length||!tags.length)return 0;
  const hits=lawTags.reduce((sum,l)=>sum+tags.filter(t=>l.includes(t)).length,0);
  return Math.min(2.4,hits*.55);
};

const inferPartyAffinity=(minister,party)=>{
  const text=norm(`${minister.ideologia||''} ${(minister.apoia||[]).join(' ')} ${minister.perfil||''} ${minister.vinculo||''}`);
  const map={
    esq:['social','desenvolv','sind','sus','public','progress','ambient','trabalh'],
    centro:['pragmat','municip','federal','regional','centro','congresso','infra'],
    dir:['liberal','mercado','privat','fiscal','agro','seguranca','conserv'],
    ind:['tecn','institucional','evidencia','gestao','social-liberal','independente','inovacao'],
  };
  return (map[party.id]||[]).reduce((s,k)=>s+(text.includes(k)?1:0),0)+(text.includes(norm(party.sigla))?3:0);
};
const chooseWing=(minister,party)=>{
  const text=norm(`${minister.ideologia||''} ${(minister.apoia||[]).join(' ')} ${minister.vinculo||''}`);
  return (party.alas||[]).slice().sort((a,b)=>{
    const sb=(wingTags[b.id]||[]).reduce((s,k)=>s+(text.includes(k)?1:0),0);
    const sa=(wingTags[a.id]||[]).reduce((s,k)=>s+(text.includes(k)?1:0),0);
    return sb-sa;
  })[0]?.id||party.alas?.[0]?.id||null;
};

export const processMinisterAffiliations=({nomeacoes=[],partidos=[],perfilPresidencial={},turno=1})=>{
  let updated=nomeacoes.map(n=>({...n}));
  const events=[];
  const joins=[];
  const ownId=perfilPresidencial?.partidoId;
  updated=updated.map(m=>{
    if(m.partidoId||m.filiacaoPartidaria?.partidoId)return m;
    const tenure=Math.max(0,turno-(m.nomeadoNoTurno||turno));
    if(tenure<4)return m;
    const loyal=m.lealdade??m.lealdadeInicial??50;
    const efficacy=m.eficacia??60;
    const tension=m.tensao??0;
    const ambition=m.ambicao??30;
    const favorable=loyal>=64&&efficacy>=60&&tension<=42;
    const frustrated=loyal<=44&&tension>=58&&ambition>=42;
    if(!favorable&&!frustrated)return m;
    const ranked=partidos.map(p=>({p,score:inferPartyAffinity(m,p)+(favorable&&p.id===ownId?2.5:0)+(frustrated&&p.id===ownId?-3:0)})).sort((a,b)=>b.score-a.score);
    const target=ranked[0]?.p;
    if(!target||ranked[0].score<1)return m;
    const chance=(m.perfil==='politico'?32:14)+(favorable?8:0)+(ambition>60?8:0);
    if(roll(m.id||m.nome,turno,'filiacao')>=chance)return m;
    const alaId=chooseWing(m,target);
    const novo={...m,partidoId:target.id,filiacaoPartidaria:{partidoId:target.id,alaId,turno,origem:favorable?'projecao_no_governo':'reposicionamento_politico'}};
    joins.push({ministerId:m.id,nome:m.nome,partidoId:target.id,sigla:target.sigla,alaId,origem:novo.filiacaoPartidaria.origem});
    events.push(favorable
      ? `🪪 ${m.nome} filia-se ao ${target.sigla} após ganhar projeção política no ministério.`
      : `🪪 ${m.nome}, em atrito com o governo, filia-se ao ${target.sigla} e amplia sua autonomia política.`);
    return novo;
  });
  return {nomeacoes:updated,joins,events};
};



// =================================================================================
// 4.9.7.3 — PARTIDO NO PODER
// O partido presidencial passa a avaliar o governo como uma organização com
// interesses próprios: espaço, cargos, agenda, bandeiras e coerência programática.
// =================================================================================
const GOVERNMENT_PARTY_PROFILES={
  esq:{
    axes:{economia:['social','equilibrio'],costumes:['progressista','moderado'],seguranca:['garantista','equilibrio'],ambiente:['verde','equilibrio'],exterior:['multilateral','autonomia']},
    promiseTags:['trabalho','economia','saude','educacao','ciencia','social','infraestrutura'],
    agenda:['ruas','ciencia','congresso'],
    strategic:['m_casacivil','m_fazenda','m_social','m_educacao'],
  },
  centro:{
    axes:{economia:['equilibrio','social'],costumes:['moderado','conservador'],seguranca:['equilibrio','linha_dura'],ambiente:['equilibrio','desenvolvimento'],exterior:['autonomia','multilateral']},
    promiseTags:['infraestrutura','economia','fiscal','agro','seguranca','social'],
    agenda:['governadores','congresso','empresas'],
    strategic:['m_casacivil','m_fazenda','m_transp','m_agro'],
  },
  dir:{
    axes:{economia:['liberal','equilibrio'],costumes:['conservador','moderado'],seguranca:['linha_dura','equilibrio'],ambiente:['desenvolvimento','equilibrio'],exterior:['ocidental','autonomia']},
    promiseTags:['economia','fiscal','seguranca','agro','infraestrutura','tecnologia'],
    agenda:['empresas','producao','congresso'],
    strategic:['m_fazenda','m_justica','m_agro','m_exteriores'],
  },
  ind:{
    axes:{economia:['equilibrio','liberal'],costumes:['moderado','progressista'],seguranca:['equilibrio','garantista'],ambiente:['equilibrio','verde'],exterior:['autonomia','multilateral']},
    promiseTags:['educacao','ciencia','tecnologia','economia','infraestrutura','saude'],
    agenda:['ciencia','gabinete','empresas'],
    strategic:['m_casacivil','m_ciencia','m_fazenda','m_exteriores'],
  },
};

export const PARTY_GOVERNMENT_AGENDA_LABELS={
  ruas:'Ruas & sociedade',ciencia:'Ciência & inovação',congresso:'Articulação no Congresso',governadores:'Pacto com governadores',empresas:'Empresas & investimento',producao:'Produção & emprego',gabinete:'Coordenação do gabinete',imprensa:'Imprensa & comunicação',
};

const hydrateGovernmentRelationship=(party)=>{
  const old=party.governoPartidario||{};
  return {
    relacaoPresidente:old.relacaoPresidente ?? clamp((party.apoio||50)*.55+(party.satisfacaoDirecao||60)*.45),
    coerenciaProgramatica:old.coerenciaProgramatica ?? 60,
    coerenciaDetalhes:old.coerenciaDetalhes || {score:old.coerenciaProgramatica ?? 60,eixos:0,promessas:0,legislacao:0,economia:0},
    espacoMinisterial:old.espacoMinisterial ?? 0,
    espacoEstrategico:old.espacoEstrategico ?? 0,
    agendaAtendida:old.agendaAtendida ?? 50,
    indiceAtendimento:old.indiceAtendimento ?? 50,
    metaMinistros:old.metaMinistros ?? 2,
    ministrosPartido:old.ministrosPartido ?? 0,
    ministrosEstrategicos:old.ministrosEstrategicos ?? 0,
    agendaPreferencial:old.agendaPreferencial || GOVERNMENT_PARTY_PROFILES[party.id]?.agenda || [],
    pastasEstrategicas:old.pastasEstrategicas || GOVERNMENT_PARTY_PROFILES[party.id]?.strategic || [],
    cobrancas:old.cobrancas || [],
    historico:old.historico || [],
    ultimoTurnoCobranca:old.ultimoTurnoCobranca || 0,
    cumpridas:old.cumpridas || 0,
    descumpridas:old.descumpridas || 0,
  };
};

const ECONOMIC_POLICY_AFFINITY={
  esq:{pos:['pacote_custo_vida','acelerar_obras','credito_exportacao','programa_reindustrializacao','seguro_emprego','estoques_reguladores','equalizacao_credito_rural','fertilizantes_nacionais','semicondutores_nacional','cadeia_baterias','conteudo_local','compras_inovacao','ifa_nacional','fundo_minerais_criticos'],neg:['contingenciamento','choque_concessoes','revisao_subsidios_setoriais']},
  centro:{pos:['garantia_pme','acelerar_obras','credito_exportacao','ajuste_receita','choque_concessoes','equalizacao_credito_rural','fertilizantes_nacionais','depreciacao_acelerada'],neg:[]},
  dir:{pos:['contingenciamento','pente_fino_beneficios','ajuste_receita','choque_concessoes','revisao_subsidios_setoriais','depreciacao_acelerada','seguro_cambial_exportador'],neg:['pacote_custo_vida','fundo_combustivel','estoques_reguladores','conteudo_local','salvaguarda_industrial']},
  ind:{pos:['garantia_pme','pente_fino_beneficios','ajuste_receita','semicondutores_nacional','compras_inovacao','revisao_subsidios_setoriais','depreciacao_acelerada','ifa_nacional'],neg:['linha_bancaria']},
};

const economicPolicyCoherence=(party,state)=>{
  const cfg=ECONOMIC_POLICY_AFFINITY[party.id]||{pos:[],neg:[]};
  return (state.politicaEconomica?.historico||[]).filter(h=>h.tipo==='medida'&&(state.turno||1)-(h.turno||0)<=8).slice(0,8).reduce((score,h)=>score+(cfg.pos.includes(h.id)?2:cfg.neg.includes(h.id)?-2:0),0);
};

const profileCoherenceDetails=(party,state)=>{
  const cfg=GOVERNMENT_PARTY_PROFILES[party.id]||GOVERNMENT_PARTY_PROFILES.ind;
  const eixos=state.perfilPresidencial?.eixos||{};
  let axisScore=0;
  Object.entries(cfg.axes).forEach(([axis,accepted])=>{
    const value=eixos[axis];
    axisScore+=value===accepted[0]?11:value===accepted[1]?8:3;
  });
  const promises=(state.promessasPoliticas||[]).filter(p=>p.status!=='abandonada');
  let promiseScore=promises.length?0:10;
  if(promises.length){
    const hits=promises.reduce((sum,p)=>sum+((p.tags||[]).some(t=>cfg.promiseTags.includes(t))?1:0),0);
    promiseScore=Math.min(20,(hits/promises.length)*20);
  }
  const recent=(state.votacoes||[]).filter(v=>(v.historico||[]).some(h=>Number(h.turno)>=(state.turno||1)-8&&['sancao','promulgacao','veto_congresso'].includes(h.tipo)));
  let lawScore=12.5;
  if(recent.length){
    const affinities=recent.map(v=>{
      const lei=(state.leisDisponiveis||[]).find(l=>l.id===v.leiId);
      return lei?.afinidade?.[party.id] ?? 50;
    });
    lawScore=Math.min(25,affinities.reduce((a,b)=>a+b,0)/affinities.length/4);
  }
  const economicDelta=economicPolicyCoherence(party,state);
  const score=clamp(round1(axisScore+promiseScore+lawScore+economicDelta));
  return {score,eixos:round1(axisScore),promessas:round1(promiseScore),legislacao:round1(lawScore),economia:round1(economicDelta)};
};
const profileCoherence=(party,state)=>profileCoherenceDetails(party,state).score;

const governmentPresence=(party,state)=>{
  const cfg=GOVERNMENT_PARTY_PROFILES[party.id]||GOVERNMENT_PARTY_PROFILES.ind;
  const nomeacoes=state.nomeacoes||[];
  const slots=(state.cargos||[]).length||14;
  const members=nomeacoes.filter(m=>(m.partidoId||m.filiacaoPartidaria?.partidoId)===party.id);
  const seatShare=(party.cadeiras||0)/Math.max(1,(state.partidos||[]).reduce((s,p)=>s+(p.cadeiras||0),0)||513);
  const expected=Math.max(2,Math.min(6,Math.round(slots*(.18+seatShare*.35))));
  const strategic=members.filter(m=>cfg.strategic.includes(m.cargoId)).length;
  const filled=nomeacoes.length;
  return {
    members,
    expected,
    strategic,
    espacoMinisterial:clamp(members.length/expected*100),
    espacoEstrategico:filled<4?60:strategic>0?100:18,
    strategicIds:cfg.strategic,
  };
};

const pickFlagLaw=(party,state,turno)=>{
  const used=new Set((state.votacoes||[]).map(v=>v.leiId));
  const candidates=(state.leisDisponiveis||[])
    .filter(l=>!used.has(l.id)&&(l.afinidade?.[party.id]??0)>=72)
    .sort((a,b)=>(b.afinidade?.[party.id]||0)-(a.afinidade?.[party.id]||0)||(a.custoPolitico||0)-(b.custoPolitico||0));
  if(!candidates.length)return null;
  return candidates[hash(`${party.id}:${turno}:bandeira`)%Math.min(8,candidates.length)];
};

const demandText=(tipo,party,metrics,state,turno)=>{
  const cfg=GOVERNMENT_PARTY_PROFILES[party.id]||GOVERNMENT_PARTY_PROFILES.ind;
  if(tipo==='cargos'){
    const target=Math.min(metrics.presence.expected,metrics.presence.members.length+1);
    return {titulo:'Executiva cobra mais espaço no primeiro escalão',texto:`A direção do ${party.sigla} considera pequena sua presença no gabinete e quer ao menos ${target} ministro(s) filiado(s) ao partido.`,pedido:`Elevar a presença do ${party.sigla} para ${target} ministro(s).`,target:{ministrosMin:target},prazo:2,custoCapital:1};
  }
  if(tipo==='espaco')return {titulo:'Partido quer uma cadeira no núcleo estratégico',texto:`A Executiva afirma que apoiar o governo sem participar do núcleo decisório reduz a responsabilidade compartilhada.`,pedido:'Nomear ao menos um filiado do partido para uma pasta estratégica.',target:{minEstrategicos:1,strategicIds:cfg.strategic},prazo:3,custoCapital:1};
  if(tipo==='agenda'){
    const agendaId=cfg.agenda[hash(`${party.id}:${turno}:agenda`)%cfg.agenda.length];
    return {titulo:'Direção cobra presença da agenda partidária no Planalto',texto:`A direção quer ver uma prioridade da legenda dentro da agenda presidencial, não apenas nos discursos.`,pedido:`Reservar espaço para “${PARTY_GOVERNMENT_AGENDA_LABELS[agendaId]||agendaId}”.`,target:{agendaIds:[agendaId]},prazo:2,custoCapital:1};
  }
  if(tipo==='bandeira'){
    const lei=pickFlagLaw(party,state,turno); if(!lei)return null;
    return {titulo:`${party.sigla} quer transformar ${lei.titulo} em bandeira`,texto:`A Executiva vê a proposta como uma oportunidade para marcar identidade própria dentro do governo.`,pedido:`Protocolar ou assumir publicamente a tramitação de “${lei.titulo}”.`,target:{leiId:lei.id,leiTitulo:lei.titulo},prazo:3,custoCapital:1};
  }
  const target=Math.min(78,Math.max(62,Math.round(metrics.coherence+8)));
  return {titulo:'Executiva cobra coerência com o programa partidário',texto:`A direção avalia que decisões recentes afastaram o governo da identidade aprovada pelo partido.`,pedido:`Recuperar a coerência programática para pelo menos ${target}/100.`,target:{score:target,baseline:metrics.coherence},prazo:3,custoCapital:2};
};

const demandFulfilled=(d,metrics,state)=>{
  if(d.tipo==='cargos')return metrics.presence.members.length>=(d.target?.ministrosMin||1);
  if(d.tipo==='espaco')return metrics.presence.strategic>=(d.target?.minEstrategicos||1);
  if(d.tipo==='agenda')return (d.target?.agendaIds||[]).some(id=>(state.agendaMensal?.selecionados||[]).includes(id));
  if(d.tipo==='bandeira')return (state.votacoes||[]).some(v=>v.leiId===d.target?.leiId&&!['arquivada','rejeitada'].includes(v.status));
  if(d.tipo==='coerencia')return metrics.coherence>=(d.target?.score||65);
  return false;
};

export const processPartyInGovernment=({partidos=[],state={},turno=1})=>{
  const ownId=state.perfilPresidencial?.partidoId;
  if(!ownId)return {partidos,notices:[],events:[]};
  const notices=[]; const events=[];
  const updated=partidos.map(original=>{
    if(original.id!==ownId)return original;
    let p=hydratePartyDynamics(original);
    const presence=governmentPresence(p,{...state,partidos});
    const coherenceDetails=profileCoherenceDetails(p,state);
    const coherence=coherenceDetails.score;
    const selected=state.agendaMensal?.selecionados||[];
    const preferred=GOVERNMENT_PARTY_PROFILES[p.id]?.agenda||[];
    const agendaAtendida=selected.length?(selected.some(id=>preferred.includes(id))?82:34):48;
    let gov=hydrateGovernmentRelationship(p);
    let relacao=gov.relacaoPresidente;
    let satisfacao=p.satisfacaoDirecao;
    let disciplina=p.disciplina;
    let apoio=p.apoio;
    let cumpridas=gov.cumpridas||0,descumpridas=gov.descumpridas||0;
    const historico=[...(gov.historico||[])];
    let cobrancas=(gov.cobrancas||[]).map(d=>({...d,target:{...(d.target||{})}}));

    cobrancas=cobrancas.map(d=>{
      if(['cumprida','descumprida','recusada','ignorada'].includes(d.status))return d;
      if(d.status==='pendente'&&turno>Number(d.responderAte||d.turno+1)){
        relacao=clamp(relacao-6); satisfacao=clamp(satisfacao-5); disciplina=clamp(disciplina-1.2); apoio=clamp(apoio-2.5); descumpridas+=1;
        const next={...d,status:'ignorada',resolvidaNoTurno:turno,desfecho:'O Planalto não respondeu à cobrança da Executiva.'};
        notices.push(`⏳ ${p.sigla}: o Planalto ignorou “${d.titulo}”.`); historico.unshift({turno,tipo:'cobranca_ignorada',titulo:d.titulo});
        return next;
      }
      if(['comprometida','negociada'].includes(d.status)){
        if(demandFulfilled(d,{presence,coherence},state)){
          const bonus=d.tipo==='espaco'?7:d.tipo==='bandeira'?6:5;
          relacao=clamp(relacao+bonus); satisfacao=clamp(satisfacao+bonus*.75); disciplina=clamp(disciplina+1.1); apoio=clamp(apoio+2.2); cumpridas+=1;
          const next={...d,status:'cumprida',resolvidaNoTurno:turno,desfecho:'Compromisso cumprido pelo governo.'};
          notices.push(`✅ ${p.sigla}: compromisso cumprido — ${d.pedido}`); historico.unshift({turno,tipo:'compromisso_cumprido',titulo:d.titulo});
          return next;
        }
        if(turno>Number(d.prazoCumprimento||d.turno+3)){
          relacao=clamp(relacao-8); satisfacao=clamp(satisfacao-7); disciplina=clamp(disciplina-1.8); apoio=clamp(apoio-3.5); descumpridas+=1;
          const next={...d,status:'descumprida',resolvidaNoTurno:turno,desfecho:'O governo assumiu o compromisso, mas não entregou no prazo.'};
          notices.push(`❌ ${p.sigla}: compromisso descumprido — ${d.pedido}`); historico.unshift({turno,tipo:'compromisso_descumprido',titulo:d.titulo});
          return next;
        }
      }
      return d;
    });

    const resolved=cumpridas+descumpridas;
    const indiceAtendimento=resolved?clamp(35+(cumpridas/resolved)*65):50;
    // A relação não replica a satisfação interna: ela mede especificamente o vínculo Planalto–partido.
    relacao=clamp(relacao+(coherence-60)*.018+(presence.espacoMinisterial-70)*.012+(agendaAtendida-50)*.01);
    apoio=clamp(apoio+(relacao-apoio)*.025);

    const active=cobrancas.filter(d=>['pendente','comprometida','negociada'].includes(d.status));
    const severe=[];
    if(presence.espacoMinisterial<72)severe.push(['cargos',100-presence.espacoMinisterial]);
    if(presence.espacoEstrategico<55&&(state.nomeacoes||[]).length>=4)severe.push(['espaco',92-presence.espacoEstrategico]);
    if(coherence<64)severe.push(['coerencia',90-coherence]);
    if(turno>=3&&agendaAtendida<55)severe.push(['agenda',62-agendaAtendida*.2]);
    if(pickFlagLaw(p,state,turno))severe.push(['bandeira',48+(p.prestigioPartidario||50)*.08]);
    severe.sort((a,b)=>b[1]-a[1]);
    const canGenerate=turno>=2&&active.length<3&&turno-Number(gov.ultimoTurnoCobranca||0)>=2&&!active.some(d=>d.status==='pendente');
    const top=severe.find(([tipo])=>!active.some(d=>d.tipo===tipo));
    const trigger=top&&(top[1]>=68||roll(p.id,turno,'partido_no_poder')<62);
    if(canGenerate&&trigger){
      const data=demandText(top[0],p,{presence,coherence},state,turno);
      if(data){
        const demand={id:`gov_${p.id}_${top[0]}_${turno}`,tipo:top[0],turno,status:'pendente',responderAte:turno+1,portaVoz:p.presidencia?.nome||`Direção do ${p.sigla}`,...data};
        cobrancas=[demand,...cobrancas].slice(0,24);
        notices.push(`🏛️ ${p.sigla} cobra o Planalto: ${demand.titulo}.`);
        events.push({...demand,partidoId:p.id,sigla:p.sigla});
        historico.unshift({turno,tipo:'nova_cobranca',titulo:demand.titulo});
        gov.ultimoTurnoCobranca=turno;
      }
    }

    gov={...gov,relacaoPresidente:round1(relacao),coerenciaProgramatica:round1(coherence),coerenciaDetalhes:coherenceDetails,espacoMinisterial:round1(presence.espacoMinisterial),espacoEstrategico:round1(presence.espacoEstrategico),agendaAtendida:round1(agendaAtendida),indiceAtendimento:round1(indiceAtendimento),metaMinistros:presence.expected,ministrosPartido:presence.members.length,ministrosEstrategicos:presence.strategic,agendaPreferencial:preferred,pastasEstrategicas:presence.strategicIds,cobrancas,historico:historico.slice(0,30),cumpridas,descumpridas};
    return {...p,apoio,disciplina,satisfacaoDirecao:satisfacao,governoPartidario:gov};
  });
  return {partidos:updated,notices,events};
};

export const respondPartyGovernmentDemand=({partidos=[],partidoId,demandId,resposta,capitalPolitico=0,turno=1})=>{
  const index=partidos.findIndex(p=>p.id===partidoId); if(index<0)return {ok:false,motivo:'Partido não encontrado.'};
  let p=hydratePartyDynamics(partidos[index]);
  let gov=hydrateGovernmentRelationship(p);
  const demand=gov.cobrancas.find(d=>d.id===demandId);
  if(!demand)return {ok:false,motivo:'Cobrança partidária não encontrada.'};
  if(demand.status!=='pendente')return {ok:false,motivo:'Esta cobrança já recebeu uma resposta do Planalto.'};
  if(!['comprometer','negociar','recusar'].includes(resposta))return {ok:false,motivo:'Resposta inválida.'};
  const custo=resposta==='recusar'?0:resposta==='negociar'?2:Number(demand.custoCapital||1);
  if(capitalPolitico<custo)return {ok:false,motivo:`São necessários ${custo} pontos de Capital Político.`};
  let rel=gov.relacaoPresidente||50,sat=p.satisfacaoDirecao||50,disc=p.disciplina||50,apoio=p.apoio||50;
  let texto='';
  let nextDemand={...demand};
  if(resposta==='comprometer'){
    rel=clamp(rel+4);sat=clamp(sat+3);apoio=clamp(apoio+1.5);
    nextDemand={...nextDemand,status:'comprometida',respondidaNoTurno:turno,prazoCumprimento:turno+(demand.prazo||2),resposta:'O Planalto assumiu o compromisso.'};
    texto=`Compromisso assumido: ${demand.pedido}`;
  }else if(resposta==='negociar'){
    rel=clamp(rel+2);sat=clamp(sat+1.5);
    const target={...(demand.target||{})};
    if(demand.tipo==='cargos'&&target.ministrosMin>1)target.ministrosMin-=1;
    if(demand.tipo==='coerencia'&&target.score)target.score=Math.max(58,target.score-4);
    nextDemand={...nextDemand,target,status:'negociada',respondidaNoTurno:turno,prazoCumprimento:turno+(demand.prazo||2)+1,resposta:'A Executiva aceitou prazo e meta negociados.'};
    texto=`Prazo negociado com a Executiva: ${demand.pedido}`;
  }else{
    rel=clamp(rel-8);sat=clamp(sat-6);disc=clamp(disc-1.5);apoio=clamp(apoio-4);
    nextDemand={...nextDemand,status:'recusada',respondidaNoTurno:turno,resolvidaNoTurno:turno,resposta:'O Presidente recusou a cobrança.'};
    texto=`Cobrança recusada: ${demand.pedido}`;
  }
  const historico=[{turno,tipo:`resposta_${resposta}`,titulo:demand.titulo,texto},...(gov.historico||[])].slice(0,30);
  const descumpridas=(gov.descumpridas||0)+(resposta==='recusar'?1:0);
  const resolvedNow=(gov.cumpridas||0)+descumpridas;
  const indiceAtendimento=resolvedNow?clamp(35+((gov.cumpridas||0)/resolvedNow)*65):(gov.indiceAtendimento||50);
  gov={...gov,relacaoPresidente:round1(rel),indiceAtendimento:round1(indiceAtendimento),cobrancas:gov.cobrancas.map(d=>d.id===demandId?nextDemand:d),historico,descumpridas};
  p={...p,apoio,disciplina:disc,satisfacaoDirecao:sat,governoPartidario:gov};
  const out=[...partidos];out[index]=p;
  return {ok:true,partidos:out,capitalPolitico:capitalPolitico-custo,partido:p,cobranca:nextDemand,texto,custo};
};

const normalizeWings=(alas)=>{
  const raw=alas.map(a=>Math.max(8,a.forca||0));
  const total=raw.reduce((a,b)=>a+b,0)||1;
  let vals=raw.map(v=>round1(v/total*100));
  const diff=round1(100-vals.reduce((a,b)=>a+b,0));
  if(vals.length)vals[0]=round1(vals[0]+diff);
  return alas.map((a,i)=>({...a,forca:vals[i]}));
};
const partyMood=(p)=>p.satisfacaoDirecao>=72&&p.unidadeInterna>=68?'mobilizado':p.satisfacaoDirecao<38?'em rebelião':p.unidadeInterna<45?'fragmentado':p.satisfacaoDirecao<52?'tenso':'estável';

export const processPartyLife=({partidos=[],state={},turno=1})=>{
  const ownId=state.perfilPresidencial?.partidoId;
  const lawTags=recentLawTags(state,turno);
  const approval=state.popularidade?.geral??50;
  const cp=state.capitalPolitico??50;
  const notices=[];
  const events=[];
  const updated=partidos.map(original=>{
    let p=hydratePartyDynamics(original);
    const own=p.id===ownId;
    const cabinet=(state.nomeacoes||[]).filter(m=>(m.partidoId||m.filiacaoPartidaria?.partidoId)===p.id).length;
    const governors=(state.estados||[]).filter(e=>e.governador?.partidoId===p.id).length;
    const sanctioned=(state.votacoes||[]).filter(v=>(v.historico||[]).some(h=>Number(h.turno)===Number(turno)&&['sancao','promulgacao'].includes(h.tipo))).length;
    let satDelta=(own?(approval-50)*.035:-(approval-50)*.012)+(own?(cp>=65?.7:cp<28?-1.1:0):0)+(own?Math.min(1.4,cabinet*.18):0)+Math.min(.8,sanctioned*.18);
    if(own&&state.climaGoverno<40)satDelta-=.8;
    if(!own&&p.apoio<25&&approval<42)satDelta+=.55;
    let satisfacaoDirecao=clamp(p.satisfacaoDirecao+satDelta);
    let unidadeInterna=clamp(p.unidadeInterna+(satisfacaoDirecao-55)*.025+(p.disciplina-50)*.012);
    let disciplina=clamp(p.disciplina+(unidadeInterna-55)*.018+(satisfacaoDirecao-50)*.012);

    let alas=p.alas.map(a=>{
      let delta=wingPolicyDelta(a,lawTags)+(own?(approval-50)*.012:0)+(satisfacaoDirecao-55)*.008;
      if(a.relacaoDirecao<45)delta-=.35;
      const satisfacao=clamp(a.satisfacao+delta);
      const mobilizacao=clamp(a.mobilizacao+(satisfacao-55)*.018);
      const drift=(satisfacao-60)*.018+(mobilizacao-50)*.008;
      return {...a,satisfacao,mobilizacao,forca:clamp(a.forca+drift,8,70),tendencia:drift>.18?'crescendo':drift<-.18?'recuando':'estável'};
    });
    alas=normalizeWings(alas);

    const entrada=round1((p.fundoBase||20)*.36+(p.cadeiras||0)*.018+(p.capilaridade||50)*.018);
    const manutencao=round1((p.maquina||50)*.045+(p.diretorios?.length||27)*.075+(p.militancia||50)*.018);
    const gastoAcoes=round1((p.acoesPartidariasTurno||[]).reduce((s,id)=>s+(PARTY_ACTIONS[id]?.custoCaixa||0),0));
    const saida=round1(manutencao+gastoAcoes);
    // O gasto das ações já foi debitado quando o jogador clicou; aqui debitamos apenas manutenção.
    let caixaPartidario=Math.max(0,round1(p.caixaPartidario+entrada-manutencao));
    const prestigioDelta=(own?(approval-50)*.018:0)+(disciplina-55)*.01+(p.maquina-55)*.006;
    let prestigioPartidario=clamp(p.prestigioPartidario+prestigioDelta);

    let totalDeltaMembers=0;
    let diretorios=p.diretorios.map(d=>{
      const stateObj=(state.estados||[]).find(e=>e.uf===d.uf);
      const govParty=stateObj?.governador?.partidoId;
      let ds=(satisfacaoDirecao-55)*.012+(own?(stateObj?.aprovacao??50)-50:0)*.01+(govParty===p.id?.35:0);
      if(d.autonomia>75&&p.satisfacaoDirecao<48)ds-=.55;
      const satisfacao=clamp(d.satisfacao+ds);
      const growthPct=Math.max(-.012,Math.min(.014,(prestigioPartidario-50)/7000+(satisfacao-50)/9000+(p.digital-50)/16000));
      const deltaMembers=Math.round((d.filiadosEstimados||0)*growthPct);
      totalDeltaMembers+=deltaMembers;
      const machineDelta=(satisfacao-55)*.006+(d.caixaLocal>5?.04:-.06);
      const maquina=clamp(d.maquina+machineDelta);
      const relacaoNacional=clamp((d.relacaoNacional||50)+(satisfacaoDirecao-50)*.004-(d.autonomia>80&&satisfacaoDirecao<45?.2:0));
      const riscoIntervencao=clamp((d.autonomia||50)*.45+(100-relacaoNacional)*.35+(100-satisfacao)*.28-28);
      return {...d,satisfacao,maquina,relacaoNacional,filiadosEstimados:Math.max(1200,(d.filiadosEstimados||0)+deltaMembers),crescimentoFiliados:deltaMembers,riscoIntervencao};
    });
    let filiadosNacionais=Math.max(1000,p.filiadosNacionais+totalDeltaMembers);
    let maquina=clamp(p.maquina+(prestigioPartidario-55)*.006+(caixaPartidario>50?.05:-.08));
    let militancia=clamp(p.militancia+(satisfacaoDirecao-55)*.004);
    let formacaoQuadros=clamp(p.formacaoQuadros);

    let crises=[...(p.crisesInternas||[])].map(c=>({...c}));
    // Crises podem esfriar quando a organização recupera coesão; não ficam abertas para sempre.
    crises=crises.map(c=>{
      if(c.resolvida)return c;
      if(c.tipo==='rebeliao_ala'&&satisfacaoDirecao>=56&&unidadeInterna>=54)return {...c,resolvida:true,resolvidaNoTurno:turno,desfecho:'A direção recompôs a maioria interna.'};
      if(c.tipo==='diretorio_rebelde'){
        const local=diretorios.find(d=>d.uf===c.uf);
        if(local&&local.satisfacao>=58&&local.relacaoNacional>=55)return {...c,resolvida:true,resolvidaNoTurno:turno,desfecho:'O diretório voltou ao pacto nacional.'};
      }
      return c;
    });
    const abertas=()=>crises.filter(c=>!c.resolvida);
    const candidateDir=diretorios.slice().sort((a,b)=>b.riscoIntervencao-a.riscoIntervencao)[0];
    const r=roll(p.id,turno,'evento');
    if((satisfacaoDirecao<42||unidadeInterna<42)&&r<42&&!abertas().some(c=>c.tipo==='rebeliao_ala')){
      const ala=alas.slice().sort((a,b)=>a.satisfacao-b.satisfacao)[0];
      const ev={id:`crise_${p.id}_${turno}`,tipo:'rebeliao_ala',turno,titulo:`${ala.nome} cobra mudança de rumo`,texto:`A corrente ${ala.nome} contesta a direção nacional e ameaça levar a disputa às próximas convenções.`,gravidade:Math.round(100-Math.min(satisfacaoDirecao,unidadeInterna)),resolvida:false};
      crises.push(ev); events.push({...ev,partidoId:p.id,sigla:p.sigla}); notices.push(`⚠️ ${p.sigla}: ${ev.titulo}.`);
      unidadeInterna=clamp(unidadeInterna-3); disciplina=clamp(disciplina-2);
    }else if(candidateDir?.riscoIntervencao>72&&r<34&&!abertas().some(c=>c.tipo==='diretorio_rebelde'&&c.uf===candidateDir.uf)){
      const ev={id:`crise_${p.id}_${candidateDir.uf}_${turno}`,tipo:'diretorio_rebelde',uf:candidateDir.uf,turno,titulo:`${p.sigla}-${candidateDir.uf} desafia a Executiva`,texto:`O diretório de ${candidateDir.nomeEstado} exige autonomia sobre alianças e candidaturas.`,gravidade:Math.round(candidateDir.riscoIntervencao),resolvida:false};
      crises.push(ev); events.push({...ev,partidoId:p.id,sigla:p.sigla}); notices.push(`🏴 ${p.sigla}-${candidateDir.uf} desafia a direção nacional.`);
    }else if(satisfacaoDirecao>72&&prestigioPartidario>68&&r<22){
      const bonus=Math.round(filiadosNacionais*.006);
      filiadosNacionais+=bonus;
      maquina=clamp(maquina+1);
      notices.push(`📈 ${p.sigla} registra onda de novas filiações e reforça sua máquina.`);
    }

    const record={turno,entrada,saida,saldo:round1(entrada-saida),satisfacao:round1(satisfacaoDirecao),unidade:round1(unidadeInterna),disciplina:round1(disciplina),maquina:round1(maquina),filiados:Math.round(filiadosNacionais),humor:partyMood({satisfacaoDirecao,unidadeInterna})};
    return {...p,satisfacaoDirecao,unidadeInterna,disciplina,alas,diretorios,caixaPartidario,filiadosNacionais,prestigioPartidario,maquina,militancia,formacaoQuadros,balancoFundo:{entrada,saida,saldo:record.saldo,turno},crisesInternas:crises.slice(-18),humorInterno:record.humor,acoesPartidariasTurno:[],historicoPartidario:[record,...(p.historicoPartidario||[])].slice(0,24)};
  });
  return {partidos:updated,notices,events};
};

export const applyPartyAction=({partidos=[],partidoId,acaoId,uf=null,alaId=null,capitalPolitico=0,turno=1})=>{
  const meta=PARTY_ACTIONS[acaoId];
  if(!meta)return {ok:false,motivo:'Ação partidária inexistente.'};
  const index=partidos.findIndex(p=>p.id===partidoId);
  if(index<0)return {ok:false,motivo:'Partido não encontrado.'};
  let p=hydratePartyDynamics(partidos[index]);
  const used=p.acoesPartidariasTurno||[];
  if(used.length>=2)return {ok:false,motivo:'A direção nacional já executou duas ações partidárias neste mês.'};
  if(used.includes(acaoId))return {ok:false,motivo:'Esta ação já foi usada neste mês.'};
  if(capitalPolitico<meta.custoCapital)return {ok:false,motivo:`São necessários ${meta.custoCapital} pontos de Capital Político.`};
  if(p.caixaPartidario<meta.custoCaixa)return {ok:false,motivo:`O caixa partidário precisa de R$ ${meta.custoCaixa} mi.`};
  const balancoAtual=p.balancoFundo?.turno===turno?p.balancoFundo:{entrada:0,saida:0,saldo:0,turno};
  let next={...p,caixaPartidario:round1(p.caixaPartidario-meta.custoCaixa),acoesPartidariasTurno:[...used,acaoId],balancoFundo:{...balancoAtual,saida:round1((balancoAtual.saida||0)+meta.custoCaixa),saldo:round1((balancoAtual.saldo||0)-meta.custoCaixa)}};
  let texto=meta.nome;
  if(acaoId==='reuniao_executiva')next={...next,satisfacaoDirecao:clamp(p.satisfacaoDirecao+6),unidadeInterna:clamp(p.unidadeInterna+4),disciplina:clamp(p.disciplina+1.5),crisesInternas:(p.crisesInternas||[]).map(c=>c.tipo==='rebeliao_ala'&&!c.resolvida&&p.satisfacaoDirecao+6>=52?{...c,resolvida:true,resolvidaNoTurno:turno,desfecho:'Executiva recompôs a maioria interna.'}:c)};
  if(acaoId==='mobilizar_militancia')next={...next,militancia:clamp(p.militancia+3),maquina:clamp(p.maquina+1.2),filiadosNacionais:Math.round(p.filiadosNacionais*1.004),prestigioPartidario:clamp(p.prestigioPartidario+1)};
  if(acaoId==='formacao_quadros')next={...next,formacaoQuadros:clamp(p.formacaoQuadros+3),prestigioPartidario:clamp(p.prestigioPartidario+2),maquina:clamp(p.maquina+.7)};
  if(acaoId==='fortalecer_diretorio'){
    if(!uf)return {ok:false,motivo:'Selecione um diretório estadual.'};
    if(!p.diretorios.some(d=>d.uf===uf))return {ok:false,motivo:'Diretório estadual não encontrado.'};
    next={...next,diretorios:p.diretorios.map(d=>d.uf===uf?{...d,maquina:clamp(d.maquina+6),satisfacao:clamp(d.satisfacao+5),relacaoNacional:clamp(d.relacaoNacional+4),caixaLocal:round1((d.caixaLocal||0)+6),riscoIntervencao:clamp((d.riscoIntervencao||0)-8)}:d),crisesInternas:(next.crisesInternas||p.crisesInternas||[]).map(c=>c.tipo==='diretorio_rebelde'&&c.uf===uf&&!c.resolvida?{...c,resolvida:true,resolvidaNoTurno:turno,desfecho:'Reforço organizacional recompôs o diretório.'}:c)};
    texto=`${meta.nome} · ${p.sigla}-${uf}`;
  }
  if(acaoId==='apaziguar_ala'){
    if(!alaId)return {ok:false,motivo:'Selecione uma ala interna.'};
    const ala=p.alas.find(a=>a.id===alaId); if(!ala)return {ok:false,motivo:'Ala partidária não encontrada.'};
    next={...next,unidadeInterna:clamp(p.unidadeInterna+2),alas:p.alas.map(a=>a.id===alaId?{...a,satisfacao:clamp(a.satisfacao+12),relacaoDirecao:clamp(a.relacaoDirecao+7)}:{...a,satisfacao:clamp(a.satisfacao-1)}),crisesInternas:(next.crisesInternas||p.crisesInternas||[]).map(c=>c.tipo==='rebeliao_ala'&&!c.resolvida?{...c,resolvida:true,resolvidaNoTurno:turno,desfecho:`A corrente ${ala.nome} recebeu espaço e recuou da rebelião.`}:c)};
    texto=`${meta.nome} · ${ala.nome}`;
  }
  next={...next,historicoPartidario:[{turno,tipo:'acao',acaoId,texto},...(p.historicoPartidario||[])].slice(0,24)};
  const out=[...partidos];out[index]=next;
  return {ok:true,partidos:out,capitalPolitico:capitalPolitico-meta.custoCapital,partido:next,meta,texto};
};


// =================================================================================
// 4.9.7.4 — JANELA, MIGRAÇÃO & ALIANÇAS
// O sistema partidário passa a redesenhar o tabuleiro: lideranças podem mudar de
// legenda, blocos podem acompanhá-las, partidos negociam alianças/federações e
// diretórios estaduais podem sofrer intervenção da Executiva Nacional.
// =================================================================================
export const PARTY_SYSTEM_INITIAL={
  migracoes:[],aliancas:[],propostas:[],intervencoes:[],historico:[],relacoes:{},
  janela:{ativa:false,inicio:'2026-03-05',fim:'2026-04-03',ultimaAtualizacao:null},
};

export const hydratePartySystem=(system={})=>({
  ...PARTY_SYSTEM_INITIAL,...system,
  migracoes:[...(system.migracoes||[])],aliancas:[...(system.aliancas||[])],
  propostas:[...(system.propostas||[])],intervencoes:[...(system.intervencoes||[])],
  historico:[...(system.historico||[])],relacoes:{...(system.relacoes||{})},
  janela:{...PARTY_SYSTEM_INITIAL.janela,...(system.janela||{})},
});

const dateISO=(d)=>{try{return new Date(d).toISOString().slice(0,10)}catch{return '2023-01-01'}};
export const partyWindowStatus=(dateInput)=>{
  const d=dateISO(dateInput),inicio='2026-03-05',fim='2026-04-03';
  return {ativa:d>=inicio&&d<=fim,inicio,fim,data:d};
};
const partyIdeologyScore=(party)=>{const t=norm(party?.ideologia||'');return t.includes('esquerda')?0:t.includes('direita')?2:1};
const actorIdeologyScore=(actor)=>{const t=norm(`${actor?.ideologia||''} ${actor?.perfil||''} ${(actor?.pauta||[]).join(' ')}`);if(t.includes('esquerda')||t.includes('social')||t.includes('progress'))return .35;if(t.includes('direita')||t.includes('liberal')||t.includes('conserv')||t.includes('agro'))return 1.7;return 1};
const pairKey=(a,b)=>[a,b].sort().join(':');
const getRelation=(system,a,b)=>system.relacoes?.[pairKey(a,b)] ?? 50;
const setRelation=(system,a,b,value)=>({...system,relacoes:{...(system.relacoes||{}),[pairKey(a,b)]:clamp(value)}});
const partyCompatibility=(a,b,system)=>{
  const ideol=Math.abs(partyIdeologyScore(a)-partyIdeologyScore(b));
  return clamp(78-ideol*28+(getRelation(system,a.id,b.id)-50)*.45+((a.satisfacaoDirecao||50)+(b.satisfacaoDirecao||50)-100)*.08);
};
const chooseGovernorParty=(gov,parties,uf)=>{
  if(gov?.partidoId)return gov.partidoId;
  const text=norm(`${gov?.ideologia||''} ${gov?.estilo||''}`);
  let pool=text.includes('centro-esquerda')?['esq','ind']:text.includes('centro-direita')?['dir','centro']:text.includes('direita')?['dir','centro']:text.includes('esquerda')?['esq','ind']:['centro','ind'];
  pool=pool.filter(id=>parties.some(p=>p.id===id));
  return pool[hash(`${gov?.nome||''}:${uf}`)%Math.max(1,pool.length)]||parties[0]?.id||'ind';
};
const bestDestination=(actor,currentId,parties,system)=>{
  const ai=actorIdeologyScore(actor);
  return parties.filter(p=>p.id!==currentId).map(p=>{
    const ideol=Math.abs(ai-partyIdeologyScore(p));
    const relation=getRelation(system,currentId,p.id);
    const score=82-ideol*30+(p.prestigioPartidario||50)*.18+(p.maquina||50)*.08+(relation-50)*.14;
    return {p,score};
  }).sort((a,b)=>b.score-a.score)[0]?.p||null;
};
const transferSeats=(parties,from,to,seats)=>parties.map(p=>p.id===from?{...p,cadeiras:Math.max(1,(p.cadeiras||0)-seats)}:p.id===to?{...p,cadeiras:(p.cadeiras||0)+seats}:p);

export const processPartyRealignment=({partidos=[],nomeacoes=[],atoresCongresso=[],estados=[],sistemaPartidario={},state={},turno=1,dataAtual=null})=>{
  let system=hydratePartySystem(sistemaPartidario);
  let parties=partidos.map(hydratePartyDynamics);
  let ministers=nomeacoes.map(x=>({...x}));
  let actors=atoresCongresso.map(x=>({...x}));
  let states=estados.map(e=>({...e,governador:{...(e.governador||{})}}));
  const notices=[],events=[];
  const date=dataAtual||state.dataAtual||new Date(2023,0,1);
  const window=partyWindowStatus(date);
  system={...system,janela:{...system.janela,...window,ultimaAtualizacao:turno}};
  const ownId=state.perfilPresidencial?.partidoId;

  // Governadores passam a possuir uma filiação nacional sem apagar a sigla estadual narrativa.
  states=states.map(e=>e.governador?.partidoId?e:{...e,governador:{...e.governador,partidoId:chooseGovernorParty(e.governador,parties,e.uf),filiacaoNacionalOrigem:'alinhamento_inicial'}});

  // Propostas pendentes de aliança têm prazo. O silêncio do partido presidencial também é uma decisão.
  let proposals=system.propostas.map(pr=>({...pr}));
  proposals=proposals.map(pr=>{
    if(pr.status!=='pendente'||turno<=Number(pr.responderAte||999))return pr;
    const own=pr.partidos?.includes(ownId);
    if(own){notices.push(`⌛ ${pr.titulo}: a proposta expirou sem resposta do seu partido.`);return {...pr,status:'expirada',resolvidaNoTurno:turno};}
    const a=parties.find(p=>p.id===pr.partidos?.[0]),b=parties.find(p=>p.id===pr.partidos?.[1]);
    const accept=a&&b&&partyCompatibility(a,b,system)>=58;
    if(accept){
      system={...system,aliancas:[{id:`ali_${pr.id}`,tipo:pr.tipo,partidos:pr.partidos,inicioTurno:turno,status:'ativa',titulo:pr.titulo,origem:'ia'},...system.aliancas]};
      notices.push(`🤝 ${a.sigla} e ${b.sigla} confirmam ${pr.tipo==='federacao'?'federação':'aliança política'}.`);
      return {...pr,status:'aceita',resolvidaNoTurno:turno};
    }
    return {...pr,status:'recusada',resolvidaNoTurno:turno};
  });

  // Geração de alianças e federações. Federações exigem compatibilidade mais alta e ganham relevância perto da eleição.
  const activePairs=new Set(system.aliancas.filter(a=>a.status==='ativa').map(a=>pairKey(...a.partidos)));
  const pendingPairs=new Set(proposals.filter(p=>p.status==='pendente').map(p=>pairKey(...p.partidos)));
  if(turno>=6&&turno%3===0){
    const pairs=[];
    for(let i=0;i<parties.length;i++)for(let j=i+1;j<parties.length;j++){
      const a=parties[i],b=parties[j],key=pairKey(a.id,b.id);if(activePairs.has(key)||pendingPairs.has(key))continue;
      const compat=partyCompatibility(a,b,system);pairs.push({a,b,compat});
    }
    const best=pairs.sort((x,y)=>y.compat-x.compat)[0];
    if(best&&best.compat>=52&&roll(`${best.a.id}_${best.b.id}`,turno,'alianca')<Math.min(72,best.compat)){
      const year=Number(window.data.slice(0,4));
      const tipo=year>=2025&&best.compat>=68?'federacao':'alianca';
      const pr={id:`prop_${tipo}_${best.a.id}_${best.b.id}_${turno}`,tipo,partidos:[best.a.id,best.b.id],turno,status:'pendente',responderAte:turno+1,compatibilidade:round1(best.compat),titulo:`${best.a.sigla} e ${best.b.sigla} negociam ${tipo==='federacao'?'federação':'aliança nacional'}`,texto:tipo==='federacao'?'As Executivas discutem coordenação duradoura de recursos, convenção e estratégia eleitoral.':'As direções testam uma coordenação de pautas, palanques e recursos sem fundir suas estruturas.'};
      proposals=[pr,...proposals].slice(0,30);events.push(pr);notices.push(`🤝 ${pr.titulo}.`);
      // Se o Presidente não está envolvido, a IA pode resolver no fechamento seguinte. Se está, vira decisão do jogador.
    }
  }

  // A janela partidária transforma insatisfação em migração real. Fora dela ministros ainda podem reposicionar sua filiação.
  let migrations=[];
  if(window.ativa){
    const candidates=actors.filter(a=>a.partidoId).map(a=>{
      const source=parties.find(p=>p.id===a.partidoId);const stress=(100-(a.lealdade??50))*.36+(a.ambicao??40)*.32+(100-(source?.unidadeInterna??55))*.18+(100-(source?.satisfacaoDirecao??55))*.14;
      return {tipo:'camara',actor:a,score:stress};
    }).sort((a,b)=>b.score-a.score);
    for(const c of candidates.slice(0,3)){
      if(migrations.length>=2)break;
      const a=c.actor;if(c.score<48||roll(a.id,turno,'janela4974')>=Math.min(72,c.score))continue;
      const target=bestDestination(a,a.partidoId,parties,system);if(!target)continue;
      const source=parties.find(p=>p.id===a.partidoId);const group=(a.influencia??0)>=84&&(source?.unidadeInterna??60)<58?Math.min(8,3+(hash(`${a.id}:${turno}`)%6)):1;
      const from=a.partidoId;actors=actors.map(x=>x.id===a.id?{...x,partidoId:target.id,relacao:clamp((x.relacao||50)-1),historicoPartidario:[{turno,de:from,para:target.id,tipo:group>1?'dissidencia':'migracao'},...(x.historicoPartidario||[])].slice(0,12)}:x);
      parties=transferSeats(parties,from,target.id,group);
      const mv={id:`mig_${a.id}_${turno}`,turno,tipo:group>1?'dissidencia_bloco':'migracao',atorId:a.id,nome:a.nome,origemId:from,destinoId:target.id,cadeiras:group,janela:true};migrations.push(mv);notices.push(`🔁 ${a.nome} troca de legenda${group>1?` e leva um grupo de ${group} deputados`:''}: ${source?.sigla||from} → ${target.sigla}.`);
    }
    // Governadores com ambição e diretório local em ruptura também podem trocar de legenda na janela.
    if(migrations.length<2){
      const govCandidates=states.map(e=>({e,g:e.governador,p:parties.find(p=>p.id===e.governador?.partidoId)})).filter(x=>x.g?.partidoId).map(x=>{const d=x.p?.diretorios?.find(d=>d.uf===x.e.uf);return {...x,score:(x.g.ambicao||40)*.42+(100-(d?.satisfacao??55))*.36+(100-(d?.relacaoNacional??55))*.22}}).sort((a,b)=>b.score-a.score);
      const c=govCandidates[0];if(c&&c.score>57&&roll(`gov_${c.e.uf}`,turno,'janela4974')<Math.min(65,c.score)){
        const target=bestDestination(c.g,c.g.partidoId,parties,system);if(target){const from=c.g.partidoId;states=states.map(e=>e.uf===c.e.uf?{...e,governador:{...e.governador,partidoId:target.id,historicoPartidario:[{turno,de:from,para:target.id},...(e.governador.historicoPartidario||[])].slice(0,10)}}:e);const mv={id:`mig_gov_${c.e.uf}_${turno}`,turno,tipo:'governador',atorId:`gov_${c.e.uf}`,nome:c.g.nome,uf:c.e.uf,origemId:from,destinoId:target.id,cadeiras:0,janela:true};migrations.push(mv);notices.push(`🗺️ ${c.g.nome}, governador(a) de ${c.e.uf}, deixa ${parties.find(p=>p.id===from)?.sigla||from} e se filia ao ${target.sigla}.`);}
      }
    }
  }

  // Ministros filiados podem mudar de partido fora da janela quando o próprio governo rompe sua trajetória política.
  const ministerCandidates=ministers.filter(m=>m.partidoId&&(m.tensao??0)>=62&&(m.lealdade??50)<=46&&(m.ambicao??0)>=52);
  const mc=ministerCandidates.sort((a,b)=>(b.tensao||0)-(a.tensao||0))[0];
  if(mc&&roll(mc.id||mc.nome,turno,'troca_ministro')<26){const target=bestDestination(mc,mc.partidoId,parties,system);if(target){const from=mc.partidoId;ministers=ministers.map(m=>m.id===mc.id?{...m,partidoId:target.id,filiacaoPartidaria:{...(m.filiacaoPartidaria||{}),partidoId:target.id,turno,origem:'ruptura_com_governo',mudancas:[{turno,de:from,para:target.id},...(m.filiacaoPartidaria?.mudancas||[])]}}:m);const mv={id:`mig_min_${mc.id}_${turno}`,turno,tipo:'ministro',atorId:mc.id,nome:mc.nome,origemId:from,destinoId:target.id,cadeiras:0,janela:window.ativa};migrations.push(mv);notices.push(`🪪 ${mc.nome} rompe com ${parties.find(p=>p.id===from)?.sigla||from} e se filia ao ${target.sigla}.`);}}

  // Executivas de partidos controlados pela IA podem intervir em diretórios em ruptura. O partido do Presidente espera decisão humana.
  let interventions=[];
  parties=parties.map(p=>{
    if(p.id===ownId)return p;
    const d=(p.diretorios||[]).slice().sort((a,b)=>(b.riscoIntervencao||0)-(a.riscoIntervencao||0))[0];
    if(!d||(d.riscoIntervencao||0)<84||p.caixaPartidario<14||roll(`${p.id}_${d.uf}`,turno,'intervencao')>=32)return p;
    interventions.push({id:`int_${p.id}_${d.uf}_${turno}`,turno,partidoId:p.id,uf:d.uf,tipo:'intervencao_nacional',resultado:'executada'});notices.push(`⚖️ ${p.sigla} intervém no diretório de ${d.uf} após ruptura com a Executiva.`);
    return {...p,caixaPartidario:round1(p.caixaPartidario-14),diretorios:p.diretorios.map(x=>x.uf===d.uf?{...x,status:'sob intervenção',presidente:`Interventor(a) da Executiva Nacional`,autonomia:clamp(x.autonomia-16),relacaoNacional:clamp(x.relacaoNacional+12),satisfacao:clamp(x.satisfacao-8),maquina:clamp(x.maquina-3),riscoIntervencao:clamp(x.riscoIntervencao-35),intervencao:{turno,motivo:'ruptura com a direção nacional'}}:x)};
  });

  // Alianças ativas têm efeito político mensal discreto, sem transformar apoio em bloco monolítico.
  for(const al of system.aliancas.filter(a=>a.status==='ativa')){
    const [aId,bId]=al.partidos;const a=parties.find(p=>p.id===aId),b=parties.find(p=>p.id===bId);if(!a||!b)continue;
    const avg=((a.apoio||50)+(b.apoio||50))/2;const strength=al.tipo==='federacao'?.055:.025;
    parties=parties.map(p=>p.id===aId||p.id===bId?{...p,apoio:clamp((p.apoio||50)+(avg-(p.apoio||50))*strength),unidadeInterna:clamp((p.unidadeInterna||50)+(al.tipo==='federacao'?.15:.05))}:p);
  }

  system={...system,propostas:proposals,migracoes:[...migrations,...system.migracoes].slice(0,60),intervencoes:[...interventions,...system.intervencoes].slice(0,40),historico:[...migrations.map(m=>({turno,tipo:m.tipo,texto:`${m.nome}: ${m.origemId} → ${m.destinoId}`})),...interventions.map(i=>({turno,tipo:'intervencao',texto:`${i.partidoId}-${i.uf}`})),...(system.historico||[])].slice(0,80)};
  return {partidos:parties,nomeacoes:ministers,atoresCongresso:actors,estados:states,sistemaPartidario:system,notices,events,migracoes:migrations,intervencoes:interventions,janela:window};
};

export const respondPartyAllianceProposal=({partidos=[],sistemaPartidario={},partidoId,propostaId,resposta,capitalPolitico=0,turno=1})=>{
  let system=hydratePartySystem(sistemaPartidario);const pr=system.propostas.find(p=>p.id===propostaId);
  if(!pr||pr.status!=='pendente')return {ok:false,motivo:'Proposta partidária não está pendente.'};
  if(!pr.partidos?.includes(partidoId))return {ok:false,motivo:'Seu partido não participa desta negociação.'};
  if(!['aceitar','recusar'].includes(resposta))return {ok:false,motivo:'Resposta inválida.'};
  const custo=resposta==='aceitar'?(pr.tipo==='federacao'?3:2):0;if(capitalPolitico<custo)return {ok:false,motivo:`São necessários ${custo} pontos de Capital Político.`};
  const other=pr.partidos.find(id=>id!==partidoId);let parties=partidos.map(hydratePartyDynamics);const own=parties.find(p=>p.id===partidoId),target=parties.find(p=>p.id===other);
  if(resposta==='aceitar'){
    system={...system,propostas:system.propostas.map(p=>p.id===pr.id?{...p,status:'aceita',resolvidaNoTurno:turno}:p),aliancas:[{id:`ali_${pr.id}`,tipo:pr.tipo,partidos:pr.partidos,inicioTurno:turno,status:'ativa',titulo:pr.titulo,origem:'negociada'},...system.aliancas],historico:[{turno,tipo:'alianca_aceita',texto:pr.titulo},...system.historico]};
    system=setRelation(system,partidoId,other,getRelation(system,partidoId,other)+10);
    parties=parties.map(p=>p.id===partidoId||p.id===other?{...p,satisfacaoDirecao:clamp((p.satisfacaoDirecao||50)+2),prestigioPartidario:clamp((p.prestigioPartidario||50)+1)}:p);
    return {ok:true,partidos:parties,sistemaPartidario:system,capitalPolitico:capitalPolitico-custo,texto:`${own?.sigla||partidoId} aceita ${pr.tipo==='federacao'?'a federação':'a aliança'} com ${target?.sigla||other}.`,proposta:pr};
  }
  system={...system,propostas:system.propostas.map(p=>p.id===pr.id?{...p,status:'recusada',resolvidaNoTurno:turno}:p),historico:[{turno,tipo:'alianca_recusada',texto:pr.titulo},...system.historico]};system=setRelation(system,partidoId,other,getRelation(system,partidoId,other)-7);
  return {ok:true,partidos:parties,sistemaPartidario:system,capitalPolitico,texto:`${own?.sigla||partidoId} rejeita a composição com ${target?.sigla||other}.`,proposta:pr};
};

export const intervenePartyDirectorate=({partidos=[],partidoId,uf,capitalPolitico=0,turno=1})=>{
  const idx=partidos.findIndex(p=>p.id===partidoId);if(idx<0)return {ok:false,motivo:'Partido não encontrado.'};let p=hydratePartyDynamics(partidos[idx]);const d=p.diretorios.find(x=>x.uf===uf);if(!d)return {ok:false,motivo:'Diretório não encontrado.'};
  if((d.riscoIntervencao||0)<58&&d.status!=='disputado')return {ok:false,motivo:'Não há justificativa política suficiente para uma intervenção nacional.'};
  const custoCapital=3,custoCaixa=14;if(capitalPolitico<custoCapital)return {ok:false,motivo:'São necessários 3 pontos de Capital Político.'};if(p.caixaPartidario<custoCaixa)return {ok:false,motivo:'O partido precisa de R$ 14 mi em caixa.'};
  const backlash=(d.autonomia||0)>=76||(d.satisfacao||50)<42;const loss=backlash?Math.round((d.filiadosEstimados||0)*.045):0;
  const nd={...d,status:'sob intervenção',presidente:'Interventor(a) da Executiva Nacional',autonomia:clamp(d.autonomia-18),relacaoNacional:clamp(d.relacaoNacional+14),satisfacao:clamp(d.satisfacao-(backlash?12:5)),maquina:clamp(d.maquina-(backlash?5:2)),filiadosEstimados:Math.max(1000,(d.filiadosEstimados||0)-loss),riscoIntervencao:clamp(d.riscoIntervencao-38),intervencao:{turno,backlash,motivo:'crise de comando estadual'}};
  p={...p,caixaPartidario:round1(p.caixaPartidario-custoCaixa),unidadeInterna:clamp(p.unidadeInterna+(backlash?-2:1)),diretorios:p.diretorios.map(x=>x.uf===uf?nd:x),historicoPartidario:[{turno,tipo:'intervencao_diretorio',uf,backlash},...(p.historicoPartidario||[])].slice(0,30)};
  const out=[...partidos];out[idx]=p;return {ok:true,partidos:out,capitalPolitico:capitalPolitico-custoCapital,partido:p,diretorio:nd,backlash,texto:backlash?`Intervenção em ${p.sigla}-${uf} provoca dissidência local, embora recupere o comando formal.`:`Executiva assume temporariamente o comando do ${p.sigla}-${uf}.`};
};
