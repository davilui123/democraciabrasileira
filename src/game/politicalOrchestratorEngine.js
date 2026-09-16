const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));

export const POLITICAL_ORCHESTRATOR_VERSION=1;

export const createPoliticalOrchestratorState=()=>({
  version:POLITICAL_ORCHESTRATOR_VERSION,
  activeArcs:[],
  clusters:[],
  archive:[],
  priorityQueue:[],
  monthlyDigest:null,
  lastProcessedTurn:0,
});

const pressure=(state,id)=>[
  ...(state.geopolitica?.historicoPressoes||[]),
  ...(state.geopolitica?.pressoesDiplomaticas||[]),
].find(p=>p.baseId===id||p.templateId===id||p.id===id);

const mkArc=(def,turn,state,causes=[])=>({
  id:`arc_${def.id}_${turn}`,
  baseId:def.id,
  title:def.title,
  category:def.category,
  severity:def.severity(state),
  status:'ativo',
  stage:0,
  stageLabel:def.stages[0]?.label||'Sinal inicial',
  startedTurn:turn,
  lastAdvanceTurn:turn,
  lastVisibleTurn:turn,
  tags:def.tags||[],
  causes:causes.length?causes:[{turn,label:def.triggerLabel||'Condição sistêmica detectada'}],
  timeline:[{turn,label:def.stages[0]?.label||'Sinal inicial',text:def.stages[0]?.text||def.summary}],
  summary:def.summary,
  resolution:null,
});

const definitions=[
  {
    id:'tarifaco_exportador',category:'economia_externa',title:'Disputa comercial pressiona cadeia exportadora',tags:['EUA','comércio','agro','estados','Congresso'],triggerLabel:'A disputa comercial com os EUA chega aos exportadores',summary:'Uma decisão de política externa começa a contaminar produção, estados exportadores e articulação parlamentar.',
    severity:s=>clamp(58+Math.max(0,Number(s.economia?.riscoPais||250)-250)/8),
    trigger:s=>{const p=pressure(s,'us_tarifaco');return !!(p&&['retaliar','silencio','ignorada'].includes(p.respostaId||p.status));},
    resolve:s=>Number((s.paises||[]).find(p=>p.id==='us')?.relacao||50)>=62 && Number(s.comercioExterior?.balanca||0)>-1000,
    resolution:'A tensão comercial perde força após melhora bilateral e estabilização das exportações.',
    stages:[
      {label:'Choque comercial',text:'Tarifas e incerteza reduzem pedidos e elevam o risco das cadeias exportadoras.'},
      {label:'Pressão setorial',text:'Agro e indústria exportadora cobram compensações, crédito e acesso a novos mercados.'},
      {label:'Pressão federativa',text:'Governadores de estados exportadores transformam perdas econômicas em cobrança contra Brasília.'},
      {label:'Bancadas entram em campo',text:'Bancadas ligadas ao agro e à indústria elevam o preço político das votações do governo.'},
    ],
  },
  {
    id:'minerais_dependencia',category:'estrategia',title:'Minerais críticos viram disputa por soberania industrial',tags:['China','minerais','TCU','indústria'],triggerLabel:'Preferência estratégica concentra a cadeia mineral',summary:'Investimento rápido traz ganhos, mas aumenta questionamentos sobre dependência, governança e acesso de outros parceiros.',
    severity:s=>65+Math.max(0,50-Number(s.geopolitica?.autonomiaEstrategica||50))*.35,
    trigger:s=>pressure(s,'cn_terras_raras')?.respostaId==='preferencia',
    resolve:s=>Number(s.geopolitica?.autonomiaEstrategica||50)>=55 || (s.projetosEspeciais||[]).some(p=>p.id==='terras_raras'&&p.status==='concluido'),
    resolution:'Diversificação de parceiros e capacidade doméstica reduzem o risco de dependência mineral.',
    stages:[
      {label:'Acordo concentrado',text:'O investimento acelera, mas a preferência concedida chama atenção de concorrentes e órgãos de controle.'},
      {label:'Controle e indústria reagem',text:'TCU, empresas brasileiras e especialistas pedem salvaguardas, processamento local e transparência.'},
      {label:'Parceiros pressionam',text:'Outras potências oferecem alternativas ou cobram acesso à cadeia de minerais críticos.'},
      {label:'Decisão estratégica',text:'O governo precisa mostrar se a política mineral será diversificada ou dependente de um parceiro central.'},
    ],
  },
  {
    id:'fertilizantes_abastecimento',category:'abastecimento',title:'Atrito externo ameaça fertilizantes e custo dos alimentos',tags:['Rússia','agro','inflação','Centro-Oeste'],triggerLabel:'Relação com fornecedor de fertilizantes se deteriora',summary:'Uma disputa diplomática alcança a safra, o custo dos alimentos e os governos estaduais.',
    severity:s=>55+Math.max(0,Number(s.economia?.inflacao||4.5)-4.5)*5,
    trigger:s=>pressure(s,'ru_apoio_guerra')?.respostaId==='rejeitar',
    resolve:s=>Number(s.economia?.inflacao||4.5)<5.5 && Number((s.paises||[]).find(p=>p.id==='ru')?.relacao||50)>42,
    resolution:'Custos agrícolas e relação bilateral se estabilizam, reduzindo a pressão sobre a safra.',
    stages:[
      {label:'Atrito diplomático',text:'O custo político da disputa começa a aparecer nas condições comerciais de insumos agrícolas.'},
      {label:'Safra sob pressão',text:'Produtores e cooperativas relatam fertilizantes mais caros e pressionam o Ministério da Agricultura.'},
      {label:'Inflação de alimentos',text:'O choque agrícola chega a preços e abastecimento, ampliando a pressão sobre o governo.'},
      {label:'Governadores cobram resposta',text:'Estados produtores exigem crédito, logística e diversificação de fornecedores.'},
    ],
  },
  {
    id:'inflacao_federativa',category:'economia_interna',title:'Inflação deixa Brasília e vira crise nos estados',tags:['inflação','governadores','abastecimento'],triggerLabel:'Inflação nacional cruza patamar de forte pressão',summary:'Preços de alimentos, transporte e energia passam a dominar a agenda territorial.',
    severity:s=>clamp(55+(Number(s.economia?.inflacao||4.5)-6)*8),
    trigger:s=>Number(s.economia?.inflacao||4.5)>=7.2,
    resolve:s=>Number(s.economia?.inflacao||4.5)<5.8,
    resolution:'A desaceleração dos preços reduz a pressão territorial e devolve o tema à gestão macroeconômica.',
    stages:[
      {label:'Preços dominam a agenda',text:'Famílias sentem alimentos, energia e transporte; a aprovação começa a refletir o choque.'},
      {label:'Capitais pressionam',text:'Governadores e prefeitos cobram medidas de abastecimento e desoneração.'},
      {label:'Oposição nacionaliza o tema',text:'A crise local vira discurso nacional contra a condução econômica do governo.'},
    ],
  },
  {
    id:'frente_governadores',category:'federacao',title:'Governadores articulam frente contra o Planalto',tags:['governadores','Congresso','federação'],triggerLabel:'Relações estaduais deterioradas deixam de ser casos isolados',summary:'Conflitos estaduais passam a ser coordenados e chegam às bancadas no Congresso.',
    severity:s=>55+(s.estados||[]).filter(e=>(e.relacaoPlanalto??50)<35).length*4,
    trigger:s=>(s.estados||[]).filter(e=>(e.relacaoPlanalto??50)<35).length>=5,
    resolve:s=>(s.estados||[]).filter(e=>(e.relacaoPlanalto??50)<35).length<=2,
    resolution:'A recomposição com governos estaduais desmonta a frente e reduz a coordenação contra o Planalto.',
    stages:[
      {label:'Insatisfação coordenada',text:'Governadores começam a compartilhar pautas e combinar posicionamentos.'},
      {label:'Carta conjunta',text:'A pressão ganha forma pública e passa a cobrar compromissos federativos concretos.'},
      {label:'Bancadas estaduais pressionam',text:'Deputados e senadores recebem orientação para elevar o custo das votações do governo.'},
      {label:'Crise federativa nacional',text:'O Planalto precisa escolher entre concessões, negociação ou confronto prolongado.'},
    ],
  },
  {
    id:'vazio_gabinete',category:'governo',title:'Vazio no núcleo estratégico corrói coordenação do governo',tags:['ministérios','Casa Civil','Fazenda','Justiça','Itamaraty'],triggerLabel:'Pastas estratégicas permanecem sem comando',summary:'A ausência prolongada de titulares transforma atraso administrativo em problema político.',
    severity:s=>50+['m_casacivil','m_fazenda','m_justica','m_exteriores'].filter(id=>!(s.nomeacoes||[]).some(n=>n.cargoId===id)).length*10,
    trigger:s=>Number(s.turno||1)>=3 && ['m_casacivil','m_fazenda','m_justica','m_exteriores'].filter(id=>!(s.nomeacoes||[]).some(n=>n.cargoId===id)).length>=2,
    resolve:s=>['m_casacivil','m_fazenda','m_justica','m_exteriores'].filter(id=>!(s.nomeacoes||[]).some(n=>n.cargoId===id)).length<=1,
    resolution:'A recomposição do núcleo estratégico melhora a coordenação e reduz interlocutores paralelos.',
    stages:[
      {label:'Decisões atrasam',text:'Demandas cruzam ministérios sem uma cadeia clara de coordenação.'},
      {label:'Interlocutores contornam o Planalto',text:'Congresso, governadores e parceiros externos passam a procurar canais alternativos.'},
      {label:'Custo de governabilidade',text:'O vazio de comando começa a corroer capital político e confiança na capacidade de entrega.'},
    ],
  },
  {
    id:'controle_institucional',category:'instituicoes',title:'Tensão institucional vira ciclo de fiscalização e judicialização',tags:['STF','TCU','PGR','controle'],triggerLabel:'Risco jurídico e tensão institucional permanecem elevados',summary:'Atos do Executivo atraem fiscalização, judicialização e pressão política em sequência.',
    severity:s=>clamp(45+Number(s.institucional?.tensaoInstitucional||0)*.45+Number(s.institucional?.riscoJuridico||0)*.3),
    trigger:s=>Number(s.institucional?.tensaoInstitucional||0)>=52 || Number(s.institucional?.riscoJuridico||0)>=48,
    resolve:s=>Number(s.institucional?.tensaoInstitucional||0)<35 && Number(s.institucional?.riscoJuridico||0)<35,
    resolution:'Queda do risco jurídico e da tensão reduz a intensidade do ciclo de controle institucional.',
    stages:[
      {label:'Órgãos de controle entram no radar',text:'TCU, PGR ou STF passam a acompanhar atos do Executivo com maior atenção.'},
      {label:'Judicialização e fiscalização',text:'Pedidos de informação, auditorias ou ações elevam o custo de decisões presidenciais.'},
      {label:'Pressão política',text:'Congresso e oposição usam o ambiente institucional para aumentar o desgaste do Planalto.'},
    ],
  },
  {
    id:'execucao_programas',category:'gestao',title:'Atrasos federais viram crise territorial',tags:['programas','estados','prefeitos','Congresso'],triggerLabel:'Mais de um programa estratégico acumula atraso',summary:'Falha de execução deixa de ser indicador interno e passa a mobilizar prefeitos, governadores e bancadas.',
    severity:s=>50+(s.programas||[]).filter(p=>p.status==='atrasado').length*8,
    trigger:s=>(s.programas||[]).filter(p=>p.status==='atrasado').length>=2,
    resolve:s=>(s.programas||[]).filter(p=>p.status==='atrasado').length===0,
    resolution:'A recuperação dos cronogramas reduz a cobrança territorial e parlamentar.',
    stages:[
      {label:'Cronogramas estouram',text:'Entregas atrasadas começam a produzir cobrança administrativa e perda de confiança.'},
      {label:'Prefeitos e governadores cobram',text:'A execução federal vira tema local e pressiona a relação com o Planalto.'},
      {label:'Bancadas transformam atraso em pauta',text:'Parlamentares passam a condicionar apoio à liberação e retomada das entregas.'},
    ],
  },
];


const stageImpact=(baseId,stage)=>{
  const impacts={
    tarifaco_exportador:{1:{grupos:{agro:-.5,mercado:-.4}},2:{estados:{ufs:['MT','GO','PR','MS','SP'],relacao:-.6}},3:{congresso:-1.5,capitalPolitico:-1}},
    minerais_dependencia:{1:{institucional:{riscoJuridico:1.5}},2:{relacoes:{us:-1,jp:-1,kr:-1}},3:{capitalPolitico:-1}},
    fertilizantes_abastecimento:{1:{grupos:{agro:-.6}},2:{economia:{inflacao:.05},grupos:{periferia:-.3}},3:{estados:{ufs:['MT','GO','MS','PR'],relacao:-.7},capitalPolitico:-1}},
    inflacao_federativa:{1:{estados:{ufs:['SP','RJ','MG','BA','PE','CE','RS','PR'],relacao:-.5}},2:{oposicao:1,capitalPolitico:-1}},
    frente_governadores:{1:{capitalPolitico:-1}},
    vazio_gabinete:{1:{climaGoverno:-1.5}},
    controle_institucional:{1:{capitalPolitico:-1}},
    execucao_programas:{1:{climaGoverno:-1}},
  };
  return impacts[baseId]?.[stage]||null;
};


const buildClusters=(active,turn)=>{
  const byId=Object.fromEntries(active.map(a=>[a.baseId,a]));
  const clusters=[];
  const make=(id,title,memberIds,summary,tags)=>{
    const members=memberIds.map(x=>byId[x]).filter(Boolean);
    if(members.length<2) return;
    const severity=clamp(Math.max(...members.map(m=>m.severity||50))+8+members.length*2);
    const timeline=members.flatMap(m=>(m.timeline||[]).slice(-2)).sort((a,b)=>(a.turn||0)-(b.turn||0)).slice(-6);
    clusters.push({
      id:`cluster_${id}`,baseId:id,isCluster:true,status:'ativo',category:'convergencia',title,summary,
      stageLabel:'Crises convergiram',severity,tags,memberIds:members.map(m=>m.id),memberBaseIds:members.map(m=>m.baseId),
      causes:members.map(m=>({turn:m.startedTurn,label:m.title})),timeline,lastAdvanceTurn:Math.max(...members.map(m=>m.lastAdvanceTurn||m.startedTurn||turn)),
    });
  };
  make('agroexportadora','Crise agroexportadora e de abastecimento',['tarifaco_exportador','fertilizantes_abastecimento','inflacao_federativa'],'Choques de comércio exterior, insumos e preços deixam de ser problemas separados e passam a alimentar a mesma crise no campo, no consumidor e nos estados.',['agro','exportações','fertilizantes','inflação','estados','Congresso']);
  make('governabilidade_institucional','Crise de coordenação encontra pressão institucional',['vazio_gabinete','controle_institucional'],'A fragilidade de coordenação do Executivo passa a amplificar fiscalização, judicialização e perda de capacidade de resposta do Planalto.',['governo','STF','TCU','PGR','governabilidade']);
  make('pacto_federativo','Pacto federativo sob pressão coordenada',['frente_governadores','inflacao_federativa','execucao_programas'],'Cobranças econômicas e falhas de execução se combinam com relações estaduais ruins e produzem uma frente política mais organizada.',['governadores','estados','programas','Congresso']);
  return clusters;
};

const hasRecent=(orchestrator,baseId,turn,window=8)=>[...(orchestrator.activeArcs||[]),...(orchestrator.archive||[])].some(a=>a.baseId===baseId && turn-(a.startedTurn||0)<window);

const causalHints=(state,def)=>{
  const hints=[];
  if(def.id==='tarifaco_exportador') hints.push('Pressão externa: tarifa/sobretaxa','Efeito econômico: exportações e confiança','Efeito territorial: estados exportadores','Efeito político: bancadas setoriais');
  if(def.id==='fertilizantes_abastecimento') hints.push('Atrito diplomático','Insumos agrícolas mais caros','Pressão sobre alimentos','Cobrança de estados produtores');
  if(def.id==='frente_governadores') hints.push('Relações estaduais baixas','Coordenação entre governadores','Bancadas estaduais','Pressão no Congresso');
  if(def.id==='vazio_gabinete') hints.push('Pastas estratégicas vagas','Decisões e interlocução atrasam','Atores contornam o Planalto','Perda de governabilidade');
  if(def.id==='controle_institucional') hints.push('Tensão/risco jurídico','Fiscalização e ações','Repercussão política','Custo de governabilidade');
  return hints.map((label,i)=>({turn:Math.max(1,Number(state.turno||1)-Math.max(0,hints.length-i-1)),label}));
};

export function processPoliticalOrchestrator(orchestratorInput,state={}){
  const turn=Number(state.turno||1)+1;
  let o={...createPoliticalOrchestratorState(),...(orchestratorInput||{})};
  if(o.lastProcessedTurn===turn) return {orchestrator:o,headline:null,advanced:[],started:[],resolved:[]};
  let active=[...(o.activeArcs||[])];
  let archive=[...(o.archive||[])];
  const started=[]; const resolved=[]; const advanced=[];

  // Resolve primeiro: o mundo reconhece quando o jogador de fato desarma a causa.
  active=active.filter(arc=>{
    const def=definitions.find(d=>d.id===arc.baseId);
    if(def?.resolve?.(state)){
      const done={...arc,status:'resolvido',resolvedTurn:turn,resolution:def.resolution,timeline:[...(arc.timeline||[]),{turn,label:'Resolvido',text:def.resolution}]};
      archive=[done,...archive].slice(0,60); resolved.push(done); return false;
    }
    return true;
  });

  // Abre novas histórias apenas quando há causa verificável e evita repetição curta.
  for(const def of definitions){
    if(active.some(a=>a.baseId===def.id)||hasRecent({activeArcs:active,archive},def.id,turn,7)) continue;
    if(def.trigger(state)){
      const arc=mkArc(def,turn,state,causalHints(state,def));
      active.push(arc); started.push(arc);
    }
  }

  // Orçamento narrativo: no máximo duas histórias avançam visivelmente por mês.
  const candidates=active
    .filter(a=>turn-(a.lastAdvanceTurn||0)>=1)
    .map(a=>({arc:a,def:definitions.find(d=>d.id===a.baseId)}))
    .filter(x=>x.def)
    .sort((a,b)=>(b.arc.severity||0)-(a.arc.severity||0) || (a.arc.startedTurn||0)-(b.arc.startedTurn||0));

  const chosen=candidates.slice(0,2);
  const chosenIds=new Set(chosen.map(x=>x.arc.id));
  active=active.map(arc=>{
    if(!chosenIds.has(arc.id)) return arc;
    const def=definitions.find(d=>d.id===arc.baseId);
    const nextStage=Math.min((arc.stage||0)+1,def.stages.length-1);
    if(nextStage===(arc.stage||0)) return {...arc,lastVisibleTurn:turn};
    const stage=def.stages[nextStage];
    const impact=stageImpact(arc.baseId,nextStage);
    const updated={...arc,stage:nextStage,stageLabel:stage.label,lastAdvanceTurn:turn,lastVisibleTurn:turn,severity:clamp(def.severity(state)),lastImpact:impact,timeline:[...(arc.timeline||[]),{turn,label:stage.label,text:stage.text}].slice(-8)};
    advanced.push({...updated,impact}); return updated;
  });

  // Depois de chegar ao ápice, a história não some: entra em fase de acomodação e é arquivada após dois meses sem nova piora.
  active=active.filter(arc=>{
    const def=definitions.find(d=>d.id===arc.baseId);
    if(!def) return true;
    const atPeak=(arc.stage||0)>=def.stages.length-1;
    if(atPeak && turn-(arc.lastAdvanceTurn||turn)>=2){
      const done={...arc,status:'concluido',resolvedTurn:turn,resolution:'A crise deixa o centro da agenda, mas suas consequências permanecem registradas na memória política.',timeline:[...(arc.timeline||[]),{turn,label:'Sai do centro da agenda',text:'O tema perde prioridade, sem apagar seus efeitos políticos e econômicos.'}]};
      archive=[done,...archive].slice(0,60); resolved.push(done); return false;
    }
    return true;
  });

  const clusters=buildClusters(active,turn);
  const clusteredIds=new Set(clusters.flatMap(c=>c.memberIds||[]));
  const visible=[...clusters,...active.filter(a=>!clusteredIds.has(a.id))].sort((a,b)=>(b.severity||0)-(a.severity||0));
  const queue=visible.slice(0,5).map(a=>({id:a.id,title:a.title,severity:Math.round(a.severity||0),stageLabel:a.stageLabel,category:a.category,isCluster:!!a.isCluster,memberBaseIds:a.memberBaseIds||[]}));
  const clusterKey=c=>(c.memberBaseIds||[]).slice().sort().join('|');
  const previousClusterKeys=new Set((o.clusters||[]).map(clusterKey));
  const newCluster=clusters.find(c=>!previousClusterKeys.has(clusterKey(c)))||null;
  const headline=(newCluster||advanced[0]||started[0]||resolved[0])||null;
  const digest={turn,active:active.length,clusters:clusters.length,started:started.length,advanced:advanced.length,resolved:resolved.length,top:queue[0]||null};
  o={...o,activeArcs:active,clusters,archive,priorityQueue:queue,monthlyDigest:digest,lastProcessedTurn:turn};
  return {orchestrator:o,headline,advanced,started,resolved};
}

export function explainArc(arc){
  if(!arc) return [];
  const causes=(arc.causes||[]).map(c=>c.label);
  const timeline=(arc.timeline||[]).map(t=>t.label);
  return [...new Set([...causes,...timeline])];
}

export function getOrchestratorDefinition(id){return definitions.find(d=>d.id===id)||null;}
