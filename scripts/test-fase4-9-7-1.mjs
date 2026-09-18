import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { partidosSeed, partidosEleitoraisBase } from '../src/data/seed/partidos.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

if(partidosSeed.length!==4)throw new Error(`Esperados 4 partidos, encontrados ${partidosSeed.length}`);
for(const p of partidosSeed){
  if(!p.logo||!p.numero||!p.presidencia?.nome)throw new Error(`${p.sigla} sem identidade completa.`);
  if((p.alas||[]).length!==3)throw new Error(`${p.sigla} sem três alas internas.`);
  if((p.diretorios||[]).length!==27)throw new Error(`${p.sigla} sem 27 diretórios estaduais.`);
  if(Object.keys(p.governanca||{}).length!==7)throw new Error(`${p.sigla} sem os sete pilares de governança.`);
  const ufs=new Set(p.diretorios.map(d=>d.uf));
  if(ufs.size!==27)throw new Error(`${p.sigla} possui UFs duplicadas no diretório.`);
  if(!p.diretorios.every(d=>d.presidente&&d.alaDominante&&Number.isFinite(d.maquina)&&Number.isFinite(d.delegados)))throw new Error(`${p.sigla} possui diretório incompleto.`);
}
if(partidosEleitoraisBase.length!==partidosSeed.length)throw new Error('Catálogo eleitoral não deriva do catálogo partidário.');

const app=read('src/App.jsx');
if(!app.includes("id: 'partidos'")||!app.includes('<Parties />'))throw new Error('Partidos não entrou na navegação principal.');
const ui=read('src/components/Parties.jsx');
for(const marker of ['Identidade histórica','Correntes que disputam a identidade','27 diretórios estaduais','Quem controla o partido controla mais do que a sigla.'])if(!ui.includes(marker))throw new Error(`UI de partidos sem marcador: ${marker}`);
const logo=read('src/components/PartyLogo.jsx');
if(!logo.includes('onError')||!logo.includes('party?.sigla'))throw new Error('Fallback de logo partidário ausente.');
const store=read('src/store/useGameStore.js');
if(!store.includes('mergePartyCatalog')||!store.includes('partidosSeed.map'))throw new Error('Store não mescla o catálogo partidário com saves antigos.');
const election=read('src/data/seed/eleicoes.js');
if(!election.includes('partidosEleitoraisBase'))throw new Error('Eleições ainda usa catálogo partidário duplicado.');

console.log(JSON.stringify({status:'ok',fase:'4.9.7.1',partidos:partidosSeed.length,diretorios:partidosSeed.reduce((s,p)=>s+p.diretorios.length,0),alas:partidosSeed.reduce((s,p)=>s+p.alas.length,0),governanca:Object.keys(partidosSeed[0].governanca).length},null,2));
