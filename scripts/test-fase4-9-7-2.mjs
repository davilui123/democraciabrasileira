import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { partidosSeed } from '../src/data/seed/partidos.js';
import { hydratePartyDynamics, processPartyLife, processMinisterAffiliations, applyPartyAction, PARTY_ACTIONS } from '../src/game/partyEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const parties=partidosSeed.map(hydratePartyDynamics);
if(parties.length!==4)throw new Error('Catálogo partidário inesperado.');
for(const p of parties){
  if(!Number.isFinite(p.caixaPartidario)||!Number.isFinite(p.satisfacaoDirecao)||!Number.isFinite(p.unidadeInterna))throw new Error(`${p.sigla} sem vida interna.`);
  if(!p.alas.every(a=>Number.isFinite(a.satisfacao)&&Number.isFinite(a.mobilizacao)))throw new Error(`${p.sigla} sem dinâmica nas alas.`);
  if(!p.diretorios.every(d=>Number.isFinite(d.satisfacao)&&Number.isFinite(d.caixaLocal)&&Number.isFinite(d.riscoIntervencao)))throw new Error(`${p.sigla} sem dinâmica estadual.`);
}
const state={
  perfilPresidencial:{partidoId:'esq'},popularidade:{geral:63},capitalPolitico:72,climaGoverno:66,
  nomeacoes:[{id:'teste_min',nome:'Ministra Teste',perfil:'politico',ideologia:'Desenvolvimentista',apoia:['industria','social'],lealdade:82,eficacia:78,tensao:10,ambicao:66,nomeadoNoTurno:1}],
  votacoes:[{titulo:'Política Industrial',categoria:'Economia',historico:[{turno:6,tipo:'sancao'}]}],
  estados:[],
};
const life=processPartyLife({partidos:parties,state,turno:6});
if(life.partidos.length!==4)throw new Error('Processamento mensal perdeu partidos.');
if(!life.partidos.every(p=>p.historicoPartidario?.[0]?.turno===6))throw new Error('Histórico mensal não foi gravado.');
const ppg=life.partidos.find(p=>p.id==='esq');
const act=applyPartyAction({partidos:life.partidos,partidoId:'esq',acaoId:'fortalecer_diretorio',uf:'SP',capitalPolitico:50,turno:6});
if(!act.ok)throw new Error(`Ação partidária falhou: ${act.motivo}`);
if(act.partidos.find(p=>p.id==='esq').diretorios.find(d=>d.uf==='SP').maquina<=ppg.diretorios.find(d=>d.uf==='SP').maquina)throw new Error('Fortalecimento de diretório não alterou máquina local.');
if(Object.keys(PARTY_ACTIONS).length<5)throw new Error('Poucas ações partidárias.');

let foundJoin=false;
for(let t=6;t<30;t++){
  const r=processMinisterAffiliations({nomeacoes:state.nomeacoes,partidos:life.partidos,perfilPresidencial:state.perfilPresidencial,turno:t});
  if(r.joins.length){foundJoin=true;break;}
}
if(!foundJoin)throw new Error('Fluxo de filiação ministerial não produz filiação em janela de teste.');

const store=read('src/store/useGameStore.js');
for(const marker of ['processarVidaPartidaria','executarAcaoPartidaria','processMinisterAffiliations','get().processarVidaPartidaria()'])if(!store.includes(marker))throw new Error(`Store sem ${marker}.`);
const ui=read('src/components/Parties.jsx');
for(const marker of ['Vida interna','O partido também precisa ser governado','Caixa partidário','Fortalecer ','Crises internas'])if(!ui.includes(marker))throw new Error(`UI sem ${marker}.`);
const ministries=read('src/components/Ministries.jsx');
if(!ministries.includes('Filiado ao')||!ministries.includes('Sem filiação partidária'))throw new Error('Filiação ministerial não aparece no módulo de Ministérios.');
const congress=read('src/game/congressEngine.js');
if(!congress.includes('fatorDisciplina')||!congress.includes('disciplina deixa de ser apenas'))throw new Error('Disciplina partidária ainda não influencia projeção legislativa.');

console.log(JSON.stringify({status:'ok',fase:'4.9.7.2',partidos:parties.length,acoes:Object.keys(PARTY_ACTIONS).length,diretorios:parties.reduce((s,p)=>s+p.diretorios.length,0),alas:parties.reduce((s,p)=>s+p.alas.length,0),filiacaoMinisterial:true},null,2));
