import { programasGovernamentaisSeed } from '../src/data/seed/programasGovernamentais.js';
import { ministeriosSeed } from '../src/data/seed/ministerios.js';
import { promessasPosseSeed } from '../src/data/seed/perfilPresidencial.js';
import { conquistasSeed } from '../src/data/seed/conquistas.js';
import { construirPrograma, simularDesenhoPrograma, avaliarMesPrograma, programaParaLei } from '../src/game/programEngine.js';

const assert=(cond,msg)=>{if(!cond)throw new Error(msg)};
const mids=new Set(ministeriosSeed.map(x=>x.id));
const promessas=new Set(promessasPosseSeed.map(x=>x.id));
const capacities=new Set(conquistasSeed.map(x=>x.recompensa?.id).filter(Boolean));
const ids=new Set();
for(const t of programasGovernamentaisSeed){
  assert(!ids.has(t.id),`ID duplicado: ${t.id}`); ids.add(t.id);
  assert((t.metas||[]).length===3,`${t.id} precisa de 3 metas`);
  for(const m of t.ministerios||[])assert(mids.has(m),`${t.id}: ministério inválido ${m}`);
  if(t.promessaId)assert(promessas.has(t.promessaId),`${t.id}: promessa inválida ${t.promessaId}`);
  if(t.requiresCapacity)assert(capacities.has(t.requiresCapacity),`${t.id}: capacidade não existe ${t.requiresCapacity}`);
  const cfg={templateId:t.id,nome:t.nome,promessaId:t.promessaId,prioridade:'media',territorio:'nacional',ufs:[],duracao:t.duracaoPadrao,orcamentoMensal:t.orcamentoPadrao,modeloExecucao:'misto',fonte:'tesouro',governanca:'padrao',viaLegal:t.legalPadrao};
  const ctx={turno:3,nomeacoes:(t.ministerios||[]).map(cargoId=>({cargoId})),estados:Array.from({length:27},(_,i)=>({uf:`T${i}`,relacaoPlanalto:58})),parceriasEmpresariais:[]};
  const p=construirPrograma(cfg,ctx); const sim=simularDesenhoPrograma(cfg,ctx); const mes=avaliarMesPrograma({...p,status:'ativo',execucao:sim.eficiencia,riscoExecucao:sim.risco},{...ctx,roll:95}); const lei=programaParaLei(p);
  assert(mes.progresso>0,`${t.id}: progresso não avança`);
  assert(lei.programaId===p.id,`${t.id}: lei não vinculada`);
  assert(sim.custoFederalMensal>0,`${t.id}: custo federal inválido`);
}
const mp=construirPrograma({templateId:'brasil_produtivo',nome:'Teste MP',territorio:'nacional',ufs:[],duracao:24,orcamentoMensal:700,modeloExecucao:'misto',fonte:'tesouro',governanca:'padrao',viaLegal:'mp'},{turno:1,nomeacoes:[],estados:[],parceriasEmpresariais:[]});
assert(programaParaLei(mp).instrumento==='MP','MP deve preservar instrumento próprio');
console.log(JSON.stringify({templates:programasGovernamentaisSeed.length,locked:programasGovernamentaisSeed.filter(x=>x.requiresCapacity).length,metas:programasGovernamentaisSeed.reduce((s,x)=>s+x.metas.length,0),ok:true},null,2));
