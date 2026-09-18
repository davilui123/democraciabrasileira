import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { partidosSeed } from '../src/data/seed/partidos.js';
import {
  hydratePartyDynamics,
  processPartyInGovernment,
  respondPartyGovernmentDemand,
  PARTY_GOVERNMENT_AGENDA_LABELS,
} from '../src/game/partyEngine.js';
import { calcularVariacaoMensalCapital } from '../src/game/governabilityEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const cargos=[
  {id:'m_casacivil',nome:'Casa Civil'},{id:'m_fazenda',nome:'Fazenda'},{id:'m_saude',nome:'Saúde'},{id:'m_educacao',nome:'Educação'},
  {id:'m_justica',nome:'Justiça'},{id:'m_defesa',nome:'Defesa'},{id:'m_transp',nome:'Transportes'},{id:'m_meioamb',nome:'Meio Ambiente'},
  {id:'m_agro',nome:'Agricultura'},{id:'m_social',nome:'Desenvolvimento Social'},{id:'m_ciencia',nome:'Ciência & Tecnologia'},
  {id:'m_esportes',nome:'Esportes'},{id:'m_cultura',nome:'Cultura'},{id:'m_exteriores',nome:'Relações Exteriores'},
];
const leis=[
  {id:'lei_social',titulo:'Lei Social',afinidade:{esq:92,centro:65,dir:30,ind:70},custoPolitico:20},
  {id:'lei_industria',titulo:'Política Industrial',afinidade:{esq:88,centro:75,dir:58,ind:72},custoPolitico:24},
];
let partidos=partidosSeed.map(hydratePartyDynamics);
let state={
  turno:2,
  perfilPresidencial:{partidoId:'esq',eixos:{economia:'social',costumes:'progressista',seguranca:'equilibrio',ambiente:'verde',exterior:'multilateral'}},
  promessasPoliticas:[{id:'emprego',tags:['economia','trabalho'],status:'prometida'},{id:'saude',tags:['saude'],status:'prometida'}],
  popularidade:{geral:55},capitalPolitico:70,climaGoverno:60,cargos,nomeacoes:[],votacoes:[],leisDisponiveis:leis,agendaMensal:{selecionados:[]},
  estados:[],partidos,
};
const first=processPartyInGovernment({partidos,state,turno:2});
partidos=first.partidos;
const ppg=partidos.find(p=>p.id==='esq');
if(!ppg?.governoPartidario)throw new Error('Partido presidencial sem relação com o governo.');
if(!Number.isFinite(ppg.governoPartidario.coerenciaProgramatica))throw new Error('Coerência programática ausente.');
const demand=ppg.governoPartidario.cobrancas.find(c=>c.status==='pendente');
if(!demand)throw new Error('Motor não gerou cobrança do partido presidencial em cenário de gabinete vazio.');
if(demand.tipo!=='cargos')throw new Error(`Cobrança esperada de cargos, recebida: ${demand.tipo}`);

const response=respondPartyGovernmentDemand({partidos,partidoId:'esq',demandId:demand.id,resposta:'comprometer',capitalPolitico:70,turno:2});
if(!response.ok)throw new Error(`Resposta à cobrança falhou: ${response.motivo}`);
if(response.capitalPolitico>=70)throw new Error('Compromisso partidário não consumiu Capital Político.');

state={...state,turno:3,partidos:response.partidos,nomeacoes:[{id:'min1',nome:'Ministra Partidária',cargoId:'m_social',partidoId:'esq'}]};
const second=processPartyInGovernment({partidos:response.partidos,state,turno:3});
const fulfilled=second.partidos.find(p=>p.id==='esq').governoPartidario.cobrancas.find(c=>c.id===demand.id);
if(fulfilled.status!=='cumprida')throw new Error(`Compromisso de cargos não foi reconhecido como cumprido: ${fulfilled.status}`);
if(second.partidos.find(p=>p.id==='esq').governoPartidario.cumpridas<1)throw new Error('Índice de compromissos não registrou entrega.');
if(Object.keys(PARTY_GOVERNMENT_AGENDA_LABELS).length<7)throw new Error('Mapa de agenda partidária incompleto.');
const weakParty=second.partidos.map(p=>p.id==='esq'?{...p,governoPartidario:{...p.governoPartidario,relacaoPresidente:25,cobrancas:[{id:'a',status:'pendente'},{id:'b',status:'comprometida'},{id:'c',status:'negociada'}]}}:p);
const govImpact=calcularVariacaoMensalCapital({popularidade:{geral:50},congresso:{poder:50},climaGoverno:50,economia:{resultadoPrimario:0},oposicao:{forca:30},institucional:{tensaoInstitucional:20},cargos,nomeacoes:state.nomeacoes,partidos:weakParty,perfilPresidencial:{partidoId:'esq'}});
if(!govImpact.motivos.some(m=>m.texto.includes('próprio partido')))throw new Error('Ruptura com partido presidencial não afeta governabilidade.');

const store=read('src/store/useGameStore.js');
for(const marker of ['processPartyInGovernment','respondPartyGovernmentDemand','responderCobrancaPartidaria','governoPartidario'])if(!store.includes(marker))throw new Error(`Store sem ${marker}.`);
const ui=read('src/components/Parties.jsx');
for(const marker of ['Partido no poder','Cobranças da Executiva','Coerência programática','Espaço ministerial','Núcleo estratégico','Compromissos cumpridos'])if(!ui.includes(marker))throw new Error(`UI partidária sem ${marker}.`);
const news=read('src/components/NewsCenter.jsx');
for(const marker of ['cobrancasPartidarias','Partido no poder','responderPartido'])if(!news.includes(marker))throw new Error(`Central de Notícias sem integração ${marker}.`);

console.log(JSON.stringify({status:'ok',fase:'4.9.7.3',tipoCobranca:demand.tipo,coerencia:ppg.governoPartidario.coerenciaProgramatica,relacao:ppg.governoPartidario.relacaoPresidente,compromisso:fulfilled.status},null,2));
