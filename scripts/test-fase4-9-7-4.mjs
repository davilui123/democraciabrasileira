import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { partidosSeed } from '../src/data/seed/partidos.js';
import {
  hydratePartyDynamics,
  hydratePartySystem,
  partyWindowStatus,
  processPartyRealignment,
  respondPartyAllianceProposal,
  intervenePartyDirectorate,
} from '../src/game/partyEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

let partidos=partidosSeed.map(p=>hydratePartyDynamics({...p,
  unidadeInterna:p.id==='centro'?28:p.unidadeInterna,
  satisfacaoDirecao:p.id==='centro'?35:p.satisfacaoDirecao,
}));
const atores=Array.from({length:12},(_,i)=>({
  id:`lider_teste_${i}`,nome:`Liderança ${i+1}`,cargo:'Deputado federal',partidoId:'centro',uf:i%2?'GO':'MG',
  perfil:i%3===0?'Liberal pragmático':'Negociador de centro',influencia:92-i,relacao:42,ambicao:96,lealdade:5,risco:20,pauta:['economia','federalismo'],
}));
const estados=[
  {uf:'SP',nome:'São Paulo',governador:{nome:'Isabela Teste',ideologia:'centro-direita',estilo:'presidenciável',ambicao:91,popularidade:69}},
  {uf:'BA',nome:'Bahia',governador:{nome:'Lúcia Teste',ideologia:'centro-esquerda',estilo:'carismática',ambicao:57,popularidade:66}},
];
const out=processPartyRealignment({
  partidos,nomeacoes:[],atoresCongresso:atores,estados,sistemaPartidario:hydratePartySystem(),
  state:{perfilPresidencial:{partidoId:'esq'},popularidade:{geral:52}},turno:40,dataAtual:new Date('2026-03-12T12:00:00'),
});
if(!partyWindowStatus('2026-03-12').ativa||!out.janela.ativa)throw new Error('Janela partidária não foi reconhecida.');
if(out.estados.some(e=>!e.governador.partidoId))throw new Error('Governadores não receberam filiação nacional.');
if(!out.migracoes.length)throw new Error('Cenário extremo de janela não produziu migração partidária.');
const totalAntes=partidos.reduce((s,p)=>s+p.cadeiras,0),totalDepois=out.partidos.reduce((s,p)=>s+p.cadeiras,0);
if(totalAntes!==totalDepois)throw new Error(`Migração alterou total de cadeiras: ${totalAntes} -> ${totalDepois}`);

const proposal={id:'prop_test',tipo:'federacao',partidos:['esq','ind'],status:'pendente',responderAte:41,titulo:'PPG e IND negociam federação',compatibilidade:72};
const alliance=respondPartyAllianceProposal({partidos:out.partidos,sistemaPartidario:{...out.sistemaPartidario,propostas:[proposal,...out.sistemaPartidario.propostas]},partidoId:'esq',propostaId:'prop_test',resposta:'aceitar',capitalPolitico:50,turno:40});
if(!alliance.ok||!alliance.sistemaPartidario.aliancas.some(a=>a.tipo==='federacao'&&a.status==='ativa'))throw new Error('Federação aceita não foi ativada.');
if(alliance.capitalPolitico!==47)throw new Error('Federação deveria custar 3 CP.');

const own=alliance.partidos.find(p=>p.id==='esq');
const target=own.diretorios.find(d=>d.uf==='SP');
const highRisk=alliance.partidos.map(p=>p.id==='esq'?{...p,diretorios:p.diretorios.map(d=>d.uf==='SP'?{...d,riscoIntervencao:92,autonomia:88,satisfacao:34,status:'disputado'}:d)}:p);
const intervention=intervenePartyDirectorate({partidos:highRisk,partidoId:'esq',uf:'SP',capitalPolitico:47,turno:40});
if(!intervention.ok||intervention.diretorio.status!=='sob intervenção')throw new Error('Intervenção estadual não foi executada.');
if(intervention.capitalPolitico!==44)throw new Error('Intervenção deveria custar 3 CP.');

const store=read('src/store/useGameStore.js');
for(const marker of ['sistemaPartidario','processPartyRealignment','responderPropostaPartidaria','intervirDiretorioPartidario'])if(!store.includes(marker))throw new Error(`Store sem ${marker}.`);
const ui=read('src/components/Parties.jsx');
for(const marker of ['Janela & alianças','Alianças e federações','Intervenção no','Migrações recentes'])if(!ui.includes(marker))throw new Error(`UI sem ${marker}.`);
const news=read('src/components/NewsCenter.jsx');
for(const marker of ['propostasPartidarias','responderAliancaPartidaria'])if(!news.includes(marker))throw new Error(`Central de Notícias sem ${marker}.`);
const save=read('src/services/saveService.js');
if(!save.includes("'sistemaPartidario'"))throw new Error('Save não persiste sistemaPartidario.');

console.log(JSON.stringify({status:'ok',fase:'4.9.7.4',janela:out.janela.ativa,migracoes:out.migracoes.length,totalCadeiras:totalDepois,federacao:alliance.sistemaPartidario.aliancas[0]?.titulo||'ativa',intervencao:intervention.diretorio.status},null,2));
