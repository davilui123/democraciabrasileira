import { comercioExteriorInicial, oportunidadesComerciaisSeed } from '../data/seed/comercioExterior.js';

const clone=v=>typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));

export const COMERCIO_INICIAL=clone(comercioExteriorInicial);

export function criarOportunidadeVisita({paisId,turno=1,comercio}){
  const candidatas=oportunidadesComerciaisSeed.filter(o=>o.paisId===paisId && !(comercio?.oportunidades||[]).some(x=>x.id===o.id) && !(comercio?.acordos||[]).some(x=>x.origemId===o.id));
  if(!candidatas.length)return null;
  return {...clone(candidatas[(turno+candidatas.length)%candidatas.length]),status:'aberta',criadaNoTurno:turno,expiraNoTurno:turno+4};
}

export function processarComercioMensal(comercio,economia,mundo={}){
  const c=clone(comercio||COMERCIO_INICIAL);
  const dolar=Number(economia?.dolar||5);
  const crescimento=Number(economia?.crescimentoPib||0);
  const risco=Number(economia?.riscoPais||250);
  const sancoes=(mundo?.sancoesAtivas||[]).length || 0;
  let exFactor=1+Math.max(-.025,Math.min(.035,(dolar-5)*.012))+Math.max(-.02,Math.min(.025,crescimento*.004));
  let imFactor=1+Math.max(-.025,Math.min(.03,crescimento*.006))-Math.max(-.03,Math.min(.03,(dolar-5)*.01));
  exFactor-=Math.min(.03,sancoes*.004); imFactor-=Math.min(.025,sancoes*.003);
  Object.values(c.exportacoesPorSetor||{}).forEach(s=>{s.valor=Math.max(100,Math.round(s.valor*exFactor*(1+(s.potencial-60)/5000)));});
  Object.values(c.importacoesPorSetor||{}).forEach(s=>{const tariffDrag=Math.max(-.04,Math.min(.06,(10-(s.tarifa||10))*.004));s.valor=Math.max(100,Math.round(s.valor*imFactor*(1+tariffDrag)));});
  c.exportacoesMensais=Object.values(c.exportacoesPorSetor||{}).reduce((a,s)=>a+s.valor,0);
  c.importacoesMensais=Object.values(c.importacoesPorSetor||{}).reduce((a,s)=>a+s.valor,0);
  c.balanca=c.exportacoesMensais-c.importacoesMensais;
  c.oportunidades=(c.oportunidades||[]).filter(o=>o.status==='aberta' && (o.expiraNoTurno??9999)>((economia?.turno)||0));
  c.historico=[{exportacoes:c.exportacoesMensais,importacoes:c.importacoesMensais,balanca:c.balanca,risco,dolar},...(c.historico||[])].slice(0,18);
  return c;
}

export function ajustarTarifaSetorial(comercio,setor,delta){
  const c=clone(comercio||COMERCIO_INICIAL);
  const item=c.importacoesPorSetor?.[setor]; if(!item)return {ok:false,motivo:'Setor de importação inexistente.'};
  item.tarifa=clamp((item.tarifa||0)+delta,0,35);
  return {ok:true,comercio:c,item};
}
