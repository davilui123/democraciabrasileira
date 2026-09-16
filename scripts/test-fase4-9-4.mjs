import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPoliticalOrchestratorState, processPoliticalOrchestrator } from '../src/game/politicalOrchestratorEngine.js';
import { createPoliticalAIState, agePoliticalMemories, processPoliticalAI } from '../src/game/politicalActorEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const base={
  turno:5,capitalPolitico:42,climaGoverno:48,
  economia:{inflacao:7.5,riscoPais:310},
  geopolitica:{historicoPressoes:[{baseId:'us_tarifaco',status:'respondida',respostaId:'retaliar'}],autonomiaEstrategica:50},
  paises:[{id:'us',relacao:28},{id:'ru',relacao:50},{id:'cn',relacao:50}],
  comercioExterior:{balanca:-2500},
  estados:[
    {uf:'SP',relacaoPlanalto:30},{uf:'RJ',relacaoPlanalto:30},{uf:'MG',relacaoPlanalto:31},{uf:'BA',relacaoPlanalto:33},{uf:'PE',relacaoPlanalto:34},{uf:'MT',relacaoPlanalto:45},
  ],
  nomeacoes:[],
  institucional:{tensaoInstitucional:58,riscoJuridico:51},
  programas:[{id:'p1',status:'atrasado'},{id:'p2',status:'atrasado'}],
  projetosEspeciais:[],
};

let r=processPoliticalOrchestrator(createPoliticalOrchestratorState(),base);
if(r.started.length<5) throw new Error(`Orquestrador detectou poucas histórias simultâneas: ${r.started.length}`);
if(!r.orchestrator.priorityQueue.length) throw new Error('Fila de prioridade não foi criada.');
if(!(r.orchestrator.clusters||[]).length) throw new Error('Crises simultâneas não foram conectadas em convergências.');
if(r.orchestrator.priorityQueue[0].severity<50) throw new Error('Fila não priorizou tema relevante.');

r=processPoliticalOrchestrator(r.orchestrator,{...base,turno:6});
if(r.advanced.length>2) throw new Error('Orçamento narrativo mensal excedido.');
if(r.advanced.length===0) throw new Error('Nenhuma história avançou no mês seguinte.');
if(!r.advanced.some(a=>a.impact)) throw new Error('Escalada não produz consequência de gameplay.');

const calmer={...base,turno:7,economia:{...base.economia,inflacao:5.1},paises:[{id:'us',relacao:70}],comercioExterior:{balanca:3000},estados:base.estados.map(e=>({...e,relacaoPlanalto:55})),nomeacoes:[{cargoId:'m_casacivil'},{cargoId:'m_fazenda'},{cargoId:'m_justica'},{cargoId:'m_exteriores'}],institucional:{tensaoInstitucional:20,riscoJuridico:20},programas:[]};
const resolved=processPoliticalOrchestrator(r.orchestrator,calmer);
if(!resolved.resolved.some(a=>a.baseId==='tarifaco_exportador')) throw new Error('História comercial não reconheceu condição de resolução.');
if(!resolved.orchestrator.archive.some(a=>a.baseId==='tarifaco_exportador')) throw new Error('História resolvida não foi arquivada.');

let ai=createPoliticalAIState();
ai.actors={x:{id:'x',memories:[{id:'old',turn:1,type:'politica',valence:-2},{id:'scar',turn:1,type:'crise_federativa',valence:-3}],momentum:10}};
ai=agePoliticalMemories(ai,15);
if(ai.actors.x.memories.some(m=>m.id==='old')) throw new Error('Memória comum antiga não envelheceu.');
if(!ai.actors.x.memories.some(m=>m.id==='scar')) throw new Error('Memória política estrutural foi apagada indevidamente.');
if(ai.actors.x.momentum>=10) throw new Error('Momentum político não decaiu com o tempo.');

const endorse=processPoliticalAI(createPoliticalAIState(),{turno:39,estados:[{uf:'BA',nome:'Bahia',eleitoradoPeso:7,aprovacao:62,governador:{nome:'Governadora Teste',relacao:82,ambicao:65,popularidade:67,estilo:'pragmática'}}],nomeacoes:[],atoresCongresso:[]},()=>0);
if(endorse.movement?.kind!=='apoio_governo') throw new Error(`Governador pragmático não entrou na carreira eleitoral autônoma: ${endorse.movement?.kind}`);

const store=read('src/store/useGameStore.js');
const news=read('src/components/NewsCenter.jsx');
const transition=read('src/components/TurnTransitionModal.jsx');
const save=read('src/services/saveService.js');
const actor=read('src/game/politicalActorEngine.js');
for(const marker of ['processarOrquestradorPolitico','processPoliticalOrchestrator','Silêncio também é uma decisão','fed_silencio_']) if(!store.includes(marker)) throw new Error(`Store sem fechamento do motor: ${marker}`);
for(const marker of ['Histórias emergentes','Por que isso aconteceu?','Crises e movimentos em curso','Em curso']) if(!news.includes(marker)) throw new Error(`Central de Notícias sem trilha causal: ${marker}`);
if(!transition.includes('Histórias em curso')) throw new Error('Relatório mensal não mostra enredos ativos.');
if(!save.includes("'politicalOrchestrator'")) throw new Error('Orquestrador não persiste no save.');
for(const marker of ['memoryWeight','agePoliticalMemories','styleBias']) if(!actor.includes(marker)) throw new Error(`Memória/persona sem polimento: ${marker}`);

console.log(JSON.stringify({status:'ok',fase:'4.9.4',started:r.orchestrator.activeArcs.length,advanced:r.advanced.length,resolved:resolved.resolved.map(x=>x.baseId),career:endorse.movement.kind,priority:r.orchestrator.priorityQueue.slice(0,3)},null,2));
