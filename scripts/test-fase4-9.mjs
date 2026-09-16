import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { estadosSeed } from '../src/data/seed/estados.js';
import { createPoliticalAIState, syncPoliticalAI, addPoliticalMemory, processPoliticalAI } from '../src/game/politicalActorEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const start=read('src/components/StartScreen.jsx');
const app=read('src/App.jsx');
const store=read('src/store/useGameStore.js');
const dossier=read('src/components/CharacterDossier.jsx');

if(!start.includes('getCampaignSummaries')||!start.includes('Nova campanha')||!start.includes('Retomar este mandato')) throw new Error('Tela inicial não expõe multi-campanhas.');
if(!app.includes('createCampaign(perfil || {})')||app.includes('Iniciar um novo jogo apagará o save local atual')) throw new Error('Novo jogo ainda ameaça apagar campanha anterior.');
if(!store.includes('processarTurnoPoliticoGlobal')||!store.includes('addPoliticalMemory')) throw new Error('Motor político 4.9 não integrado ao turno.');
if(!dossier.includes('Memória política')) throw new Error('Memória política não aparece no dossiê.');

let ai=syncPoliticalAI(createPoliticalAIState(),{turno:12,estados:estadosSeed,nomeacoes:[],atoresCongresso:[]});
if(Object.keys(ai.actors).length!==27) throw new Error('Governadores não foram registrados na IA global.');
if(ai.actors['gov:SP']?.nome!=='Isabela Ferraz') throw new Error('Isabela não foi registrada como ator político.');
ai=addPoliticalMemory(ai,'gov:SP',{turn:3,valence:-2,title:'Conflito teste',text:'Memória persistente'});
if(ai.actors['gov:SP'].memories[0]?.title!=='Conflito teste') throw new Error('Memória do personagem não foi registrada.');
const movement=processPoliticalAI(ai,{turno:12,estados:estadosSeed,nomeacoes:[],atoresCongresso:[]},()=>0).movement;
if(!movement) throw new Error('IA não gerou movimento sob pressão máxima de teste.');

// Teste isolado do multi-save com localStorage em memória.
class LS{constructor(){this.m=new Map()}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(k,String(v))}removeItem(k){this.m.delete(k)}}
globalThis.window={}; globalThis.localStorage=new LS();
const svc=await import(`${pathToFileURL(path.join(root,'src/services/saveService.js')).href}?qa=${Date.now()}`);
const a=svc.createCampaign({nomePublico:'Campanha A'});
svc.saveGame({turno:2,dataAtual:new Date(2023,1,1),dataString:'Fev 2023',mandato:'2023–2026',popularidade:{geral:55},nomeacoes:[],leisAprovadas:[],perfilPresidencial:{nomePublico:'Campanha A'}});
const b=svc.createCampaign({nomePublico:'Campanha B'});
svc.saveGame({turno:4,dataAtual:new Date(2023,3,1),dataString:'Abr 2023',mandato:'2023–2026',popularidade:{geral:48},nomeacoes:[{id:1}],leisAprovadas:[],perfilPresidencial:{nomePublico:'Campanha B'}});
const saves=svc.getCampaignSummaries();
if(saves.length!==2) throw new Error('Multi-save não mantém duas campanhas.');
if(svc.loadGame(a)?.gameState?.perfilPresidencial?.nomePublico!=='Campanha A') throw new Error('Seleção de campanha falhou.');
svc.deleteCampaign(b);
if(svc.getCampaignSummaries().length!==1) throw new Error('Exclusão individual de campanha falhou.');

console.log(JSON.stringify({status:'ok',campanhasSimultaneas:2,atoresPoliticos:Object.keys(ai.actors).length,piloto:ai.actors['gov:SP'].nome,movimentoTeste:movement.kind,memoriaPolitica:true},null,2));
