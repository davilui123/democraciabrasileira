import { situacoesEconomicasSeed, tributosExecutivosSeed } from '../data/seed/economiaPolitica.js';

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
const round=(v,d=2)=>Number(Number(v).toFixed(d));

export const POLITICA_ECONOMICA_INICIAL={
  tributos:{ipi:10,iof:3,importacao:12,cide:.3},
  pacoteTributarioUsadoTurno:0,
  tributosAlteradosTurno:[],
  estrategiaDivida:'equilibrada',
  dividaComposicao:{prefixado:30,selic:35,ipca:31,cambial:4},
  prazoMedioDivida:4.1,
  riscoRolagem:36,
  financiamentos:[],
  medidasUsadas:[],
  historico:[],
  situacaoAtiva:null,
};

export function normalizarTributos(tributos={}){
  const out={};
  tributosExecutivosSeed.forEach(t=>{out[t.id]=Number.isFinite(Number(tributos[t.id]))?Number(tributos[t.id]):t.referencia;});
  return out;
}

export function calcularPressaoTributaria(tributos={}){
  const t=normalizarTributos(tributos);
  const ipi=(t.ipi-10)/10;
  const iof=(t.iof-3)/3;
  const imp=(t.importacao-12)/12;
  const cide=(t.cide-.3)/.9;
  return {
    indiceReceita:round(clamp(1+ipi*.035+iof*.018+imp*.016+cide*.012,.90,1.12),4),
    arrastoCrescimento:round(clamp(Math.max(0,ipi)*.08+Math.max(0,iof)*.13+Math.max(0,imp)*.06,0,.45),3),
    impulsoInflacao:round(clamp(ipi*.10+imp*.13+cide*.10-iof*.035,-.35,.55),3),
    pressaoCredito:round(clamp(iof*.22, -.25,.35),3),
  };
}

export function aplicarMudancaTributaria(politica,id,delta){
  const meta=tributosExecutivosSeed.find(x=>x.id===id); if(!meta)return {ok:false,motivo:'Tributo inexistente.'};
  const tributos=normalizarTributos(politica?.tributos);
  const atual=tributos[id];
  const novo=round(clamp(atual+delta,meta.min,meta.max),2);
  if(novo===atual)return {ok:false,motivo:'Limite regulatório atingido.'};
  return {ok:true,politica:{...POLITICA_ECONOMICA_INICIAL,...politica,tributos:{...tributos,[id]:novo}},meta,atual,novo,subiu:novo>atual};
}

export function detectarSituacaoEconomica(economia={}){
  const candidatas=situacoesEconomicasSeed.filter(s=>s.quando(economia)).map(s=>({...s,gravidade:typeof s.gravidade==='function'?Math.round(s.gravidade(economia)):s.gravidade}));
  return candidatas.sort((a,b)=>b.gravidade-a.gravidade)[0]||null;
}

export function custoMedioDivida({economia={},composicao={}}){
  const c={prefixado:30,selic:35,ipca:31,cambial:4,...composicao};
  const selic=economia.selic||13.75, infl=economia.inflacao||4.5, risco=economia.riscoPais||250;
  const prefixado=selic+1.2+Math.max(0,risco-250)*.004;
  const pos=selic;
  const ipca=infl+5.4;
  const cambial=6.2+Math.max(0,risco-250)*.006;
  return round((c.prefixado*prefixado+c.selic*pos+c.ipca*ipca+c.cambial*cambial)/100,2);
}

export function resumoPoliticaEconomica(politica,economia){
  const pressao=calcularPressaoTributaria(politica?.tributos);
  const custo=custoMedioDivida({economia,composicao:politica?.dividaComposicao});
  return {...pressao,custoMedioDivida:custo,situacao:detectarSituacaoEconomica(economia)};
}
