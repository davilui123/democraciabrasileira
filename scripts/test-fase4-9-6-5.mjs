import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed } from '../src/data/seed/leis.js';
import { corteSTFSeed } from '../src/data/seed/instituicoes.js';
import {
  CONTROLE_LEIS_INICIAL,
  calcularRiscoFinalLei,
  processarControleLegislativo,
  prepararDefesaSTF,
  prepararPlanoTCU,
} from '../src/game/legalControlEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const lei=leisSeed.find(l=>l.id==='equalizacao_federativa') || leisSeed.find(l=>(l.riscosControle?.stf||0)>=70&&(l.riscosControle?.tcu||0)>=70);
if(!lei) throw new Error('Lei de alto risco não encontrada para QA.');
const proposta={
  id:'prop_qa_controle',leiId:lei.id,titulo:lei.titulo,status:'sancionada',instrumento:lei.instrumento,versaoTexto:3,
  riscosTexto:{...lei.riscosControle,stf:Math.max(78,lei.riscosControle.stf),tcu:Math.max(82,lei.riscosControle.tcu)},
  impactoFiscalEmendas:4800,
  textoFinal:{versao:3,rotulo:'Substitutivo negociado',vigencia:'integral',riscos:{...lei.riscosControle,stf:82,tcu:86},impactoFiscal:4800,alteracoes:[{titulo:'Emenda federativa'},{titulo:'Salvaguarda fiscal'}]},
};
const risco=calcularRiscoFinalLei(proposta,lei);
if(risco.stf<70||risco.tcu<70) throw new Error('Risco final não incorporou texto negociado.');

let r=processarControleLegislativo({controle:{...CONTROLE_LEIS_INICIAL},votacoes:[proposta],leis:[lei],corte:corteSTFSeed,turno:2,rng:()=>0});
if(r.novasAberturas.length!==2) throw new Error(`Esperava STF+TCU; recebeu ${r.novasAberturas.length}.`);
if(r.controle.casosSTF.length!==1||r.controle.auditoriasTCU.length!==1) throw new Error('Controles não foram armazenados.');
const caso=r.controle.casosSTF[0];
const audit=r.controle.auditoriasTCU[0];
if(!caso.relator||!caso.questionamentos.length) throw new Error('Caso STF incompleto.');
if(!audit.escopo.length) throw new Error('Auditoria TCU sem escopo.');

const d=prepararDefesaSTF(r.controle,caso.id);
if(!d.ok||!d.controle.casosSTF[0].defesaApresentada||d.custoCapital!==3) throw new Error('Defesa STF não aplicada.');
const a=prepararPlanoTCU(d.controle,audit.id);
if(!a.ok||!a.controle.auditoriasTCU[0].planoApresentado||a.custoCapital!==2) throw new Error('Plano TCU não aplicado.');

r=processarControleLegislativo({controle:a.controle,votacoes:[proposta],leis:[lei],corte:corteSTFSeed,turno:3,rng:()=>0.55});
if(r.controle.casosSTF[0].status!=='aguardando_plenario') throw new Error('Liminar STF não foi processada.');
if(r.controle.auditoriasTCU[0].status!=='achados_preliminares') throw new Error('Achados TCU não foram processados.');

r=processarControleLegislativo({controle:r.controle,votacoes:[proposta],leis:[lei],corte:corteSTFSeed,turno:4,rng:()=>0.52});
if(r.controle.casosSTF[0].status!=='julgado') throw new Error('STF não concluiu julgamento.');
if(r.controle.auditoriasTCU[0].status!=='decidida') throw new Error('TCU não concluiu auditoria.');
if(!r.controle.casosSTF[0].placar||!r.controle.auditoriasTCU[0].resultado) throw new Error('Resultado institucional incompleto.');

const store=read('src/store/useGameStore.js');
for(const marker of ['controleLeis','apresentarDefesaLeiSTF','apresentarPlanoAdequacaoTCU','processarControleLegislativo','controleConstitucional','controleTCU']){
  if(!store.includes(marker)) throw new Error(`Store sem ${marker}`);
}
const institutions=read('src/components/Institutions.jsx');
for(const marker of ['Leis sob controle','Leis judicializadas','Leis sob acompanhamento','Defender constitucionalidade','Apresentar plano de adequação']){
  if(!institutions.includes(marker)) throw new Error(`Instituições sem marcador: ${marker}`);
}
const news=read('src/components/NewsCenter.jsx');
for(const marker of ['casosSTFPendentes','auditoriasTCUPendentes','Apresentar defesa · 3 CP','Plano de adequação · 2 CP']){
  if(!news.includes(marker)) throw new Error(`Central de Notícias sem ${marker}`);
}
const save=read('src/services/saveService.js');
if(!save.includes("'controleLeis'")) throw new Error('controleLeis não persistido no save.');

console.log(JSON.stringify({status:'ok',fase:'4.9.6.5',lei:lei.id,risco,caso:{tipo:r.controle.casosSTF[0].tipo,resultado:r.controle.casosSTF[0].resultado,placar:r.controle.casosSTF[0].placar},tcu:r.controle.auditoriasTCU[0].resultado},null,2));
