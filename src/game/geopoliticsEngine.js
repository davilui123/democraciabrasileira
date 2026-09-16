import { eventosInternacionaisSeed, crisesInternacionaisSeed, lideresPorPais } from '../data/seed/geopolitica.js';
import { pressoesGeopoliticasSeed } from '../data/seed/pressoesGeopoliticas.js';
import { pressoesGeopoliticasExtrasSeed } from '../data/seed/pressoesGeopoliticasExtras.js';

const catalogoPressoesGeopoliticas=[...pressoesGeopoliticasSeed,...pressoesGeopoliticasExtrasSeed];

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Math.round(v)));
const pick=(arr)=>arr[Math.floor(Math.random()*arr.length)];

export const GEOPOLITICA_INICIAL = {
  doutrina:null,
  estadoEmergencia:false,
  mesesEmergencia:0,
  prontidaoMilitar:36,
  capacidadeInteligencia:48,
  credibilidadeDiplomatica:58,
  autonomiaEstrategica:50,
  riscoVazamento:8,
  sancoesAtivas:[],
  operacoesEncobertas:[],
  reconhecimentos:[],
  tratadosEstrategicos:[],
  historicoSoberano:[],
  feed:[],
  crises:[],
  organizacoes:{},
  oportunidadesNegociacao:{},
  visitasEstado:[],
  mesUltimaNegociacao:{},
  pressoesDiplomaticas:[],
  historicoPressoes:[],
  ultimaPressaoTurno:0,
  cooldownsPressao:{},
};

export function criarFeedInicial(turno=1){
  return eventosInternacionaisSeed.slice(0,14).map((e,i)=>({...e,id:`${e.id}_${turno}_${i}`,turno:Math.max(1,turno-i),idade:i}));
}

export function liderDoPais(pais){
  return lideresPorPais[pais?.id] || {nome:`Chefia de Governo de ${pais?.nome||'Estado estrangeiro'}`,cargo:'Chefe de Governo',idade:55,perfil:'pragmático',avatar:`leader_${pais?.id||'xx'}`,interesses:pais?.interessesNoBrasil?.slice(0,3)||['comércio','segurança'],aversoes:['perda de soberania'],estilo:'Negocia de forma transacional e protege interesses domésticos.'};
}

export function interessesVitaisDoPais(pais){
  const lista=[];
  const recursos=pais?.recursos||[];
  if(recursos.some(r=>/energia|petroleo|gas|nuclear/.test(r))) lista.push({id:'energia',nome:'Segurança energética',peso:3});
  if(recursos.some(r=>/tecnologia|industria|financas|chips/.test(r))) lista.push({id:'tecnologia',nome:'Tecnologia e indústria',peso:3});
  if((pais?.blocos||[]).includes('otan')) lista.push({id:'seguranca',nome:'Segurança e alianças',peso:4});
  if((pais?.blocos||[]).includes('brics')) lista.push({id:'autonomia',nome:'Autonomia estratégica',peso:3});
  if((pais?.regiao||'').includes('america')) lista.push({id:'regiao',nome:'Influência regional',peso:3});
  if((pais?.pressaoAmbiental||0)>70) lista.push({id:'clima',nome:'Clima e rastreabilidade',peso:2});
  lista.push({id:'mercado',nome:'Acesso a mercado',peso:3});
  return lista.slice(0,4);
}

export function podeAbrirNegociacao(geopolitica,paisId,turno){
  const ultimo=geopolitica?.mesUltimaNegociacao?.[paisId]||-99;
  const janela=geopolitica?.oportunidadesNegociacao?.[paisId];
  if(turno-ultimo<4) return {ok:false,motivo:`Canal presidencial em resfriamento por mais ${4-(turno-ultimo)} mês(es).`};
  if(janela && janela>=turno) return {ok:true,motivo:'Janela diplomática aberta por visita, crise ou missão.'};
  return {ok:false,motivo:'Não há janela presidencial aberta. Crie oportunidade via visita, crise, Itamaraty ou organização internacional.'};
}

export function abrirJanela(geopolitica,paisId,turno,duracao=2){
  return {...geopolitica,oportunidadesNegociacao:{...(geopolitica.oportunidadesNegociacao||{}),[paisId]:turno+duracao}};
}

export function processarMesGeopolitico({geopolitica=GEOPOLITICA_INICIAL,paises=[],turno=1,tensaoGlobal=30}){
  const g={...GEOPOLITICA_INICIAL,...geopolitica};
  const feed=[...(g.feed||[])].map(e=>({...e,idade:(e.idade||0)+1}));
  const qtd=tensaoGlobal>65?5:tensaoGlobal>40?4:3;
  const pool=[...eventosInternacionaisSeed].sort(()=>Math.random()-.5).slice(0,qtd);
  pool.forEach((e,i)=>feed.unshift({...e,id:`${e.id}_${turno}_${Date.now()}_${i}`,turno,idade:0}));
  const crises=(g.crises||[]).map(c=>({...c,gravidade:clamp(c.gravidade+(Math.random()*8-3))}));
  if(crises.length<3 && Math.random()<(tensaoGlobal/130)) {
    const cand=pick(crisesInternacionaisSeed.filter(c=>!crises.some(a=>a.baseId===c.id)));
    if(cand) crises.unshift({...cand,id:`crise_${cand.id}_${turno}`,baseId:cand.id,turno,status:'ativa'});
  }
  const oportunidades={...(g.oportunidadesNegociacao||{})};
  pool.flatMap(e=>e.paises||[]).slice(0,4).forEach(id=>{ oportunidades[id]=Math.max(oportunidades[id]||0,turno+1); });
  return {
    ...g,
    feed:feed.slice(0,90),
    crises:crises.slice(0,8),
    oportunidadesNegociacao:oportunidades,
    mesesEmergencia:g.estadoEmergencia?Math.max(0,(g.mesesEmergencia||0)-1):0,
    estadoEmergencia:g.estadoEmergencia && (g.mesesEmergencia||0)>1,
    riscoVazamento:clamp((g.riscoVazamento||0)-2),
    prontidaoMilitar:clamp((g.prontidaoMilitar||36)+(g.estadoEmergencia?2:-1)),
  };
}

export function calcularNegociacao({pais,ativos=[],interessesProtegidos=[],relacao=50}){
  const vitais=interessesVitaisDoPais(pais);
  const leader=liderDoPais(pais);
  const tags=new Set(ativos.flatMap(a=>a.tags||[]));
  let oferta=ativos.reduce((s,a)=>s+(a.forca||0),0);
  const sinergias=vitais.reduce((s,v)=>s+(tags.has(v.id)?v.peso:0),0);
  const violacoes=interessesProtegidos.filter(i=>i.violado).length;
  const resistencia=Math.max(5,14+(100-relacao)/7+(pais?.emGuerra?5:0));
  const pontuacao=oferta+sinergias+(relacao-50)/10-violacoes*7;
  const sucesso=pontuacao>=resistencia;
  return {sucesso,pontuacao:Math.round(pontuacao),resistencia:Math.round(resistencia),vitais,leader,confiancaFinal:clamp(relacao+(sucesso?8:-6))};
}

export function impactoAcaoSoberana(acaoId,pais,geopolitica,mundo,economia){
  const base={softPower:0,relacao:0,riscoPais:0,inflacao:0,desemprego:0,tensao:0,prontidao:0,inteligencia:0,vazamento:0,rally:0};
  if(acaoId==='sancoes') return {...base,softPower:-1,relacao:-18,riscoPais:10,inflacao:.18,tensao:5};
  if(acaoId==='mobilizacao') return {...base,softPower:-3,relacao:-9,riscoPais:24,inflacao:.28,tensao:12,prontidao:18,rally:5};
  if(acaoId==='operacao_encoberta') return {...base,softPower:-1,relacao:-5,tensao:4,inteligencia:7,vazamento:18};
  if(acaoId==='reconhecimento') return {...base,softPower:2,relacao:pais?.relacao<40?-8:4,tensao:3};
  if(acaoId==='tratado_estrategico') return {...base,softPower:5,relacao:12,riscoPais:-5,tensao:-2};
  if(acaoId==='forca') return {...base,softPower:-10,relacao:-30,riscoPais:55,inflacao:.55,desemprego:.2,tensao:25,prontidao:22,rally:8};
  return base;
}

const condicaoPressaoAtendida=(base,{paises=[],mundo={},economia={}})=>{
  const pais=paises.find(p=>p.id===base.paisId);
  if(!pais) return false;
  if(base.condicao==='guerra') return !!pais.emGuerra;
  if(base.condicao==='clima') return (mundo.liderancaAmbiental??40)<78;
  if(base.condicao==='mercado') return (economia.confiancaMercado??50)>=36;
  return true;
};

const pesoPressao=(base,{paises=[],mundo={},economia={}})=>{
  const pais=paises.find(p=>p.id===base.paisId);
  const relacao=pais?.relacao??50;
  let peso=base.prioridade||50;
  if(base.paisId==='ru') peso+=(mundo.tensaoGlobal||30)*.22+relacao*.16;
  if(base.paisId==='cn') peso+=relacao*.22+(economia.crescimentoPib<1?6:0);
  if(base.paisId==='us') peso+=(mundo.tensaoGlobal||30)*.18+(100-relacao)*.2;
  if(base.paisId==='de') peso+=Math.max(0,65-(mundo.liderancaAmbiental||40))*.35;
  if(base.paisId==='ar') peso+=8;
  return peso;
};

const clonePressure=(base,turno)=>({
  ...base,
  id:`pressure_${base.id}_${turno}`,
  baseId:base.id,
  turno,
  prazoTurno:turno+1,
  status:'pendente',
  opcoes:(base.opcoes||[]).map(o=>({...o,efeitos:{...(o.efeitos||{})}})),
  silencio:base.silencio?{...base.silencio,efeitos:{...(base.silencio.efeitos||{})}}:null,
});

export function gerarPressaoGeopolitica({geopolitica=GEOPOLITICA_INICIAL,paises=[],mundo={},economia={},turno=1,rng=Math.random}){
  const g={...GEOPOLITICA_INICIAL,...geopolitica};
  const pendentes=(g.pressoesDiplomaticas||[]).filter(p=>p.status==='pendente');
  if(pendentes.length>=2) return {geopolitica:g,pressao:null};
  const distancia=turno-(g.ultimaPressaoTurno||0);
  if(distancia<2 || turno<2) return {geopolitica:g,pressao:null};
  const chance=Math.min(.78,.28+(mundo.tensaoGlobal||30)/220+Math.max(0,distancia-3)*.08);
  if(rng()>chance) return {geopolitica:g,pressao:null};
  const candidatos=catalogoPressoesGeopoliticas
    .filter(base=>condicaoPressaoAtendida(base,{paises,mundo,economia}))
    .filter(base=>turno-(g.cooldownsPressao?.[base.id]||-99)>=(base.cooldown||8))
    .sort((a,b)=>pesoPressao(b,{paises,mundo,economia})-pesoPressao(a,{paises,mundo,economia}));
  if(!candidatos.length) return {geopolitica:g,pressao:null};
  const janela=Math.min(4,candidatos.length);
  const idx=Math.min(janela-1,Math.floor(rng()*janela));
  const base=candidatos[idx];
  const pressao=clonePressure(base,turno);
  const feedItem={id:`geo_pressure_${base.id}_${turno}`,titulo:base.manchete,tema:'pressao_diplomatica',paises:[base.paisId],gravidade:Math.min(95,Math.round(base.prioridade||60)),fonte:base.fonte,turno,idade:0,pressaoId:pressao.id};
  return {
    pressao,
    geopolitica:{
      ...g,
      pressoesDiplomaticas:[pressao,...(g.pressoesDiplomaticas||[])].slice(0,30),
      ultimaPressaoTurno:turno,
      cooldownsPressao:{...(g.cooldownsPressao||{}),[base.id]:turno},
      feed:[feedItem,...(g.feed||[])].slice(0,90),
      oportunidadesNegociacao:{...(g.oportunidadesNegociacao||{}),[base.paisId]:Math.max(g.oportunidadesNegociacao?.[base.paisId]||0,turno+2)},
    },
  };
}

export function resolverPressaoGeopolitica(geopolitica,pressaoId,opcaoId,turno=1){
  const g={...GEOPOLITICA_INICIAL,...geopolitica};
  const pressao=(g.pressoesDiplomaticas||[]).find(p=>p.id===pressaoId);
  if(!pressao || pressao.status!=='pendente') return {ok:false,motivo:'Esta pressão diplomática já foi encerrada ou não existe.',geopolitica:g};
  const opcao=(pressao.opcoes||[]).find(o=>o.id===opcaoId);
  if(!opcao) return {ok:false,motivo:'Resposta diplomática inválida.',geopolitica:g};
  const resolvida={...pressao,status:'respondida',respostaId:opcao.id,respostaTitulo:opcao.titulo,resolvidoNoTurno:turno};
  return {
    ok:true,pressao:resolvida,opcao,
    geopolitica:{...g,pressoesDiplomaticas:(g.pressoesDiplomaticas||[]).map(p=>p.id===pressaoId?resolvida:p),historicoPressoes:[resolvida,...(g.historicoPressoes||[])].slice(0,40)},
  };
}

export function expirarPressoesGeopoliticas(geopolitica,turno=1){
  const g={...GEOPOLITICA_INICIAL,...geopolitica};
  const expiradas=[];
  const lista=(g.pressoesDiplomaticas||[]).map(p=>{
    if(p.status!=='pendente' || (p.prazoTurno??999)>=turno) return p;
    const silencio=p.silencio||{titulo:'Ausência de resposta',efeitos:{}};
    const encerrada={...p,status:'ignorada',respostaId:'silencio',respostaTitulo:silencio.titulo,resolvidoNoTurno:turno};
    expiradas.push({pressao:encerrada,opcao:silencio});
    return encerrada;
  });
  if(!expiradas.length) return {geopolitica:g,expiradas:[]};
  return {geopolitica:{...g,pressoesDiplomaticas:lista,historicoPressoes:[...expiradas.map(x=>x.pressao),...(g.historicoPressoes||[])].slice(0,40)},expiradas};
}

