import { comercioExteriorInicial, oportunidadesComerciaisSeed, itensEstrategicosSeed } from '../data/seed/comercioExterior.js';

const clone=v=>typeof structuredClone==='function'?structuredClone(v):JSON.parse(JSON.stringify(v));
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
const relationFor=(paises=[],id)=>Number(paises.find(p=>p.id===id)?.relacao??50);

export const COMERCIO_INICIAL=clone(comercioExteriorInicial);

export function normalizarComercio(comercio={}){
  const c=clone({...COMERCIO_INICIAL,...comercio});
  c.exportacoesPorSetor={...clone(COMERCIO_INICIAL.exportacoesPorSetor),...(comercio.exportacoesPorSetor||{})};
  c.importacoesPorSetor={...clone(COMERCIO_INICIAL.importacoesPorSetor),...(comercio.importacoesPorSetor||{})};
  c.parceiros={...clone(COMERCIO_INICIAL.parceiros),...(comercio.parceiros||{})};
  c.itensEstrategicos={...clone(itensEstrategicosSeed),...(comercio.itensEstrategicos||{})};
  c.concorrenciaGeopolitica={...clone(COMERCIO_INICIAL.concorrenciaGeopolitica),...(comercio.concorrenciaGeopolitica||{}),preferencias:{...clone(COMERCIO_INICIAL.concorrenciaGeopolitica.preferencias),...(comercio.concorrenciaGeopolitica?.preferencias||{})},tensoes:[...(comercio.concorrenciaGeopolitica?.tensoes||[])]};
  c.politica={...clone(COMERCIO_INICIAL.politica),...(comercio.politica||{})};
  c.acordos=[...(comercio.acordos||[])]; c.oportunidades=[...(comercio.oportunidades||[])]; c.historico=[...(comercio.historico||[])];
  return c;
}

export function criarOportunidadeVisita({paisId,turno=1,comercio}){
  const c=normalizarComercio(comercio);
  const candidatas=oportunidadesComerciaisSeed.filter(o=>o.paisId===paisId && !(c.oportunidades||[]).some(x=>x.id===o.id) && !(c.acordos||[]).some(x=>x.origemId===o.id));
  if(!candidatas.length)return null;
  return {...clone(candidatas[(turno+candidatas.length)%candidatas.length]),status:'aberta',criadaNoTurno:turno,expiraNoTurno:turno+4};
}

export function aplicarPreferenciaComercial(comercio,oportunidade,turno=1){
  const c=normalizarComercio(comercio);
  const pref={...(c.concorrenciaGeopolitica?.preferencias||{})};
  Object.entries(oportunidade?.preferencia||{}).forEach(([id,v])=>{pref[id]=clamp((pref[id]||0)+Number(v),-30,30);});
  Object.entries(oportunidade?.rivalidades||{}).forEach(([id,v])=>{pref[id]=clamp((pref[id]||0)+Number(v),-30,30);});
  const tensions=[...Object.entries(oportunidade?.rivalidades||{}).filter(([,v])=>Number(v)<0).map(([paisId,v])=>({id:`tens_${oportunidade.id}_${paisId}_${turno}`,paisId,origemId:oportunidade.id,titulo:`Preferência comercial por ${oportunidade.paisId.toUpperCase()} gera desconforto`,intensidade:Math.abs(Number(v))*10,criadaNoTurno:turno,status:'ativa'})),...(c.concorrenciaGeopolitica?.tensoes||[])].slice(0,20);
  c.concorrenciaGeopolitica={...c.concorrenciaGeopolitica,preferencias:pref,tensoes:tensions,ultimaMudanca:{oportunidadeId:oportunidade.id,paisId:oportunidade.paisId,turno}};
  if(oportunidade.produtoId&&c.itensEstrategicos[oportunidade.produtoId]){
    const item=c.itensEstrategicos[oportunidade.produtoId];
    item.potencial=clamp((item.potencial||50)+(oportunidade.tipo==='exportacao'?5:2));
    if(oportunidade.tipo==='importacao_estrategica') item.dependencia=clamp((item.dependencia||50)-3);
  }
  return c;
}

export function processarComercioMensal(comercio,economia,mundo={}){
  const c=normalizarComercio(comercio||COMERCIO_INICIAL);
  const dolar=Number(economia?.dolar||5);
  const crescimento=Number(economia?.crescimentoPib||0);
  const risco=Number(economia?.riscoPais||250);
  const sancoes=(mundo?.sancoesAtivas||[]).length || 0;
  const paises=mundo?.paises||[];
  let exFactor=1+Math.max(-.025,Math.min(.035,(dolar-5)*.012))+Math.max(-.02,Math.min(.025,crescimento*.004));
  let imFactor=1+Math.max(-.025,Math.min(.03,crescimento*.006))-Math.max(-.03,Math.min(.03,(dolar-5)*.01));
  exFactor-=Math.min(.03,sancoes*.004); imFactor-=Math.min(.025,sancoes*.003);
  Object.values(c.exportacoesPorSetor||{}).forEach(s=>{s.valor=Math.max(100,Math.round(s.valor*exFactor*(1+(s.potencial-60)/5000)));});
  Object.values(c.importacoesPorSetor||{}).forEach(s=>{const tariffDrag=Math.max(-.04,Math.min(.06,(10-(s.tarifa||10))*.004));s.valor=Math.max(100,Math.round(s.valor*imFactor*(1+tariffDrag)));});

  Object.values(c.itensEstrategicos||{}).forEach(item=>{
    const rels=(item.parceiros||[]).map(id=>relationFor(paises,id));
    const relMedia=rels.length?rels.reduce((a,b)=>a+b,0)/rels.length:50;
    const diplomatic=1+Math.max(-.035,Math.min(.035,(relMedia-50)/1000));
    const preference=(item.parceiros||[]).reduce((s,id)=>s+Number(c.concorrenciaGeopolitica?.preferencias?.[id]||0),0)/Math.max(1,(item.parceiros||[]).length);
    const prefFactor=1+Math.max(-.025,Math.min(.03,preference/600));
    const baseFactor=item.tipo==='importacao'?imFactor:item.tipo==='exportacao'?exFactor:(imFactor+exFactor)/2;
    item.valor=Math.max(40,Math.round((item.valor||100)*baseFactor*diplomatic*prefFactor));
    const shock=Math.max(0,(item.sensibilidade||50)-70)/1500;
    if(sancoes&&item.sensibilidade>=85)item.valor=Math.max(40,Math.round(item.valor*(1-shock*Math.min(3,sancoes))));
  });

  c.exportacoesMensais=Object.values(c.exportacoesPorSetor||{}).reduce((a,s)=>a+s.valor,0);
  c.importacoesMensais=Object.values(c.importacoesPorSetor||{}).reduce((a,s)=>a+s.valor,0);
  c.balanca=c.exportacoesMensais-c.importacoesMensais;
  c.oportunidades=(c.oportunidades||[]).filter(o=>o.status==='aberta' && (o.expiraNoTurno??9999)>((economia?.turno)||0));
  c.concorrenciaGeopolitica.tensoes=(c.concorrenciaGeopolitica.tensoes||[]).map(t=>({...t,intensidade:Math.max(0,(t.intensidade||0)-6)})).filter(t=>(t.intensidade||0)>5).slice(0,20);
  c.historico=[{exportacoes:c.exportacoesMensais,importacoes:c.importacoesMensais,balanca:c.balanca,risco,dolar,itens:Object.fromEntries(Object.entries(c.itensEstrategicos||{}).map(([id,i])=>[id,i.valor]))},...(c.historico||[])].slice(0,18);
  return c;
}

export function ajustarTarifaSetorial(comercio,setor,delta){
  const c=normalizarComercio(comercio||COMERCIO_INICIAL);
  const item=c.importacoesPorSetor?.[setor]; if(!item)return {ok:false,motivo:'Setor de importação inexistente.'};
  item.tarifa=clamp((item.tarifa||0)+delta,0,35);
  return {ok:true,comercio:c,item};
}
