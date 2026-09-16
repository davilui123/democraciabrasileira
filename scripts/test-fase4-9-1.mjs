import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPoliticalAIState, syncPoliticalAI, processPoliticalAI } from '../src/game/politicalActorEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const geo=read('src/components/Geopolitics.jsx');
const store=read('src/store/useGameStore.js');
const engine=read('src/game/politicalActorEngine.js');

if(!geo.includes('function LeaderDossierModal')) throw new Error('Dossiê aprofundado de líderes estrangeiros não foi criado.');
if(!geo.includes('leader.idade') || !geo.includes('Idade')) throw new Error('Idade não aparece no dossiê geopolítico.');
for(const marker of ['Trajetória','O que esta pessoa quer','Rede de poder','Vulnerabilidade','Linhas vermelhas','Como lidar']){
  if(!geo.includes(marker)) throw new Error(`Dossiê geopolítico perdeu a seção: ${marker}`);
}
if(!engine.includes("rompimento_ministerial")||!engine.includes("bloqueio_bancada")) throw new Error('Movimentação política autônoma 4.9.1 incompleta.');
for(const marker of ["movement.kind==='confronto'","movement.kind==='aproximacao'","movement.kind==='rompimento_ministerial'","movement.kind==='bloqueio_bancada'"]){
  if(!store.includes(marker)) throw new Error(`Efeito real ausente no store: ${marker}`);
}

let ai=syncPoliticalAI(createPoliticalAIState(),{
  turno:6,estados:[],atoresCongresso:[],
  nomeacoes:[{id:'min_teste',nome:'Ministro Teste',cargo:'Ministro',lealdade:20,ambicao:90,popularidade:60,influencia:70,perfil:'político'}],
});
const rupture=processPoliticalAI(ai,{turno:6,estados:[],atoresCongresso:[],nomeacoes:[{id:'min_teste',nome:'Ministro Teste',cargo:'Ministro',lealdade:20,ambicao:90,popularidade:60,influencia:70,perfil:'político'}]},()=>0).movement;
if(rupture?.kind!=='rompimento_ministerial') throw new Error('Ministro em ruptura extrema não gerou saída autônoma.');

ai=syncPoliticalAI(createPoliticalAIState(),{
  turno:8,estados:[],nomeacoes:[],
  atoresCongresso:[{id:'lider_teste',nome:'Líder Teste',cargo:'Líder',relacao:20,ambicao:70,influencia:95,popularidade:60}],
});
const blockade=processPoliticalAI(ai,{turno:8,estados:[],nomeacoes:[],atoresCongresso:[{id:'lider_teste',nome:'Líder Teste',cargo:'Líder',relacao:20,ambicao:70,influencia:95,popularidade:60}]},()=>0).movement;
if(blockade?.kind!=='bloqueio_bancada') throw new Error('Liderança hostil de alta influência não gerou bloqueio autônomo.');

console.log(JSON.stringify({status:'ok',dossieGeopolitico:'expandido',idade:true,rompimentoMinisterial:rupture.kind,bloqueioCongresso:blockade.kind},null,2));
