import { conquistasSeed } from '../data/seed/conquistas.js';

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
const hist=(s)=>s.economia?.historicoFiscal||[];
const grupos=(s)=>Object.values(s.gruposSociais||{});
const baseCongressual=(s)=>(s.partidos||[]).reduce((sum,p)=>sum+Math.round((p.cadeiras||0)*(p.apoio||0)/100),0);
const concluidos=(s)=>(s.projetosEspeciais||[]).filter(p=>p.status==='concluido');
const investimentoProdutivo=(s)=>(s.economia?.investimentoProdutivoAcumulado??hist(s).reduce((a,h)=>a+(h.investimentoProdutivo||0),0))+(s.economia?.investimentoProdutivoTurno||0);
const investimentoHumano=(s)=>(s.economia?.investimentoHumanoAcumulado??hist(s).reduce((a,h)=>a+(h.investimentoHumano||0),0))+(s.economia?.investimentoHumanoTurno||0);

export function progressoConquista(s,id){
  const h=hist(s);
  const votos=baseCongressual(s);
  switch(id){
    case 'primeiros_100_dias': return {valor:Math.min(s.turno||1,4),meta:4,sufixo:' meses',ok:(s.turno||1)>=4};
    case 'gabinete_completo': {const total=(s.cargos||[]).length||14;const nomeados=new Set((s.nomeacoes||[]).map(n=>n.cargoId)).size;return {valor:nomeados,meta:total,sufixo:' pastas',ok:total>0&&nomeados>=total};}
    case 'aprovacao_70': return {valor:Math.round(s.popularidade?.geral||0),meta:70,sufixo:'%',ok:(s.popularidade?.geral||0)>=70};
    case 'coalizao_social': {const n=grupos(s).filter(g=>(g.aprovacao||0)>=65).length;return {valor:n,meta:5,sufixo:' grupos',ok:n>=5};}
    case 'maioria_257': return {valor:votos,meta:257,sufixo:' votos',ok:votos>=257};
    case 'maioria_308': return {valor:votos,meta:308,sufixo:' votos',ok:votos>=308};
    case 'pacto_federativo': {const n=(s.estados||[]).filter(e=>(e.relacaoPlanalto||0)>=60).length;return {valor:n,meta:18,sufixo:' governadores',ok:n>=18};}
    case 'superavit_3m': {const n=h.slice(0,3).filter(x=>(x.resultadoPrimario||0)>0).length;return {valor:n,meta:3,sufixo:' meses',ok:h.length>=3&&n===3};}
    case 'inflacao_meta_6m': {const n=h.slice(0,6).filter(x=>(x.inflacao||99)>=1.5&&(x.inflacao||99)<=4.5).length;return {valor:n,meta:6,sufixo:' meses',ok:h.length>=6&&n===6};}
    case 'crescimento_3': return {valor:Number(s.economia?.crescimentoPib||0),meta:3,sufixo:'%',ok:(s.economia?.crescimentoPib||0)>=3};
    case 'pleno_emprego': {const n=h.slice(0,4).filter(x=>(x.desemprego??99)<=6.5).length;return {valor:n,meta:4,sufixo:' meses',ok:h.length>=4&&n===4};}
    case 'grau_confianca': {const d=s.economia?.dividaPublica||100,r=s.economia?.riscoPais||999,c=s.economia?.confiancaMercado||0;const score=[d<70,r<200,c>=65].filter(Boolean).length;return {valor:score,meta:3,sufixo:' critérios',ok:score===3,detalhe:`Dívida ${d.toFixed?.(1)||d}% · risco ${r} · confiança ${Math.round(c)}`};}
    case 'pais_em_obras': {const v=investimentoProdutivo(s);return {valor:Math.round(v/1000),meta:50,sufixo:' bi',ok:v>=50000};}
    case 'capital_humano': {const v=investimentoHumano(s);return {valor:Math.round(v/1000),meta:25,sufixo:' bi',ok:v>=25000};}
    case 'projeto_de_pais': {const n=concluidos(s).length;return {valor:n,meta:3,sufixo:' projetos',ok:n>=3};}
    case 'dominio_nuclear': {const p=concluidos(s).some(x=>x.id==='nuclear_2040');const e=(s.estatais||[]).some(x=>x.id==='enbpar'&&x.diretrizAtual==='enb_nuclear')||(s.eventosEstatais||[]).some(ev=>ev.estatalId==='enbpar'&&String(ev.titulo||'').toLowerCase().includes('nuclear'));return {valor:(p?1:0)+(e?1:0),meta:2,sufixo:' marcos',ok:p&&e};}
    case 'soberania_chips': {const ok=concluidos(s).some(x=>x.id==='semicondutores');return {valor:ok?1:0,meta:1,sufixo:' projeto',ok};}
    case 'soberania_vacinas': {const ok=concluidos(s).some(x=>x.id==='bio_vacinas');return {valor:ok?1:0,meta:1,sufixo:' projeto',ok};}
    case 'diplomacia_estado': {const parceiros=(s.paises||[]).filter(p=>(p.relacao||0)>80).length;const tratados=s.geopolitica?.tratadosEstrategicos?.length||0;return {valor:Math.min(3,parceiros)+Math.min(2,tratados),meta:5,sufixo:' marcos',ok:parceiros>=3&&tratados>=2,detalhe:`${parceiros} parceiros · ${tratados} tratados`};}
    case 'corte_marcada': {const n=(s.stf?.historicoIndicacoes||[]).filter(i=>i.aprovada||i.aprovado||i.status==='aprovado').length;return {valor:n,meta:1,sufixo:' indicação',ok:n>=1};}
    case 'governanca_estatais': {const es=s.estatais||[];const gov=es.length?es.reduce((a,e)=>a+(e.governanca||0),0)/es.length:0;const decisoes=s.eventosEstatais?.length||0;return {valor:Math.min(80,Math.round(gov)),meta:80,sufixo:' governança',ok:gov>=80&&decisoes>=8,detalhe:`Governança ${Math.round(gov)} · ${decisoes} diretrizes`};}
    case 'estabilidade_institucional': {const ok=(s.turno||0)>=12&&(s.institucional?.tensaoInstitucional||99)<20&&(s.stf?.tensaoInstitucional||99)<25;return {valor:ok?3:[(s.turno||0)>=12,(s.institucional?.tensaoInstitucional||99)<20,(s.stf?.tensaoInstitucional||99)<25].filter(Boolean).length,meta:3,sufixo:' critérios',ok};}
    case 'mandato_completo': return {valor:Math.min(s.turno||0,48),meta:48,sufixo:' meses',ok:(s.turno||0)>=48};
    default:return {valor:0,meta:1,sufixo:'',ok:false};
  }
}

export function avaliarConquistas(state){
  const has=new Set((state.conquistasDesbloqueadas||[]).map(c=>typeof c==='string'?c:c.id));
  return conquistasSeed.filter(c=>!has.has(c.id)&&progressoConquista(state,c.id).ok);
}

export function aplicarBonusConquista(state,conquista){
  let popularidade={...state.popularidade}, economia={...state.economia}, mundo={...state.mundo}, institucional={...state.institucional}, stf={...state.stf}, congresso={...state.congresso}, oposicao={...state.oposicao};
  let capitalPolitico=state.capitalPolitico, climaGoverno=state.climaGoverno;
  let estados=(state.estados||[]).map(e=>({...e}));
  let gruposSociais={...state.gruposSociais};
  const capacidades=new Set(state.capacidadesDesbloqueadas||[]);
  const r=conquista.recompensa||{};
  if(['capacidade','estrutural'].includes(r.tipo)&&r.id)capacidades.add(r.id);
  switch(conquista.id){
    case 'primeiros_100_dias': capitalPolitico=clamp(capitalPolitico+3);climaGoverno=clamp(climaGoverno+2);break;
    case 'gabinete_completo': climaGoverno=clamp(climaGoverno+5);break;
    case 'coalizao_social': capitalPolitico=clamp(capitalPolitico+3);estados=estados.map(e=>({...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+2)}));break;
    case 'maioria_257': congresso.poder=clamp((congresso.poder||0)+5);break;
    case 'maioria_308': congresso.poder=clamp((congresso.poder||0)+5);break;
    case 'pacto_federativo': congresso.poder=clamp((congresso.poder||0)+6);climaGoverno=clamp(climaGoverno+2);break;
    case 'inflacao_meta_6m': economia.riscoPais=Math.max(80,(economia.riscoPais||250)-10);economia.confiancaMercado=clamp((economia.confiancaMercado||50)+3);economia.expectativasAncoradas=true;break;
    case 'crescimento_3': economia.confiancaMercado=clamp((economia.confiancaMercado||50)+4);capitalPolitico=clamp(capitalPolitico+2);break;
    case 'pleno_emprego': for(const id of ['periferia','sindicalistas','mercado'])if(gruposSociais[id])gruposSociais[id]={...gruposSociais[id],aprovacao:clamp((gruposSociais[id].aprovacao||50)+3)};break;
    case 'pais_em_obras': economia.crescimentoPib=Number(((economia.crescimentoPib||0)+.08).toFixed(2));estados=estados.map(e=>({...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+1)}));break;
    case 'projeto_de_pais': mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+4);climaGoverno=clamp(climaGoverno+3);economia.confiancaMercado=clamp((economia.confiancaMercado||50)+3);break;
    case 'soberania_vacinas': mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+3);if(gruposSociais.periferia)gruposSociais.periferia={...gruposSociais.periferia,aprovacao:clamp((gruposSociais.periferia.aprovacao||50)+2)};if(gruposSociais.universitarios)gruposSociais.universitarios={...gruposSociais.universitarios,aprovacao:clamp((gruposSociais.universitarios.aprovacao||50)+2)};break;
    case 'diplomacia_estado': mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+5);break;
    case 'grau_confianca': economia.creditoSoberano=true;economia.confiancaMercado=clamp((economia.confiancaMercado||50)+3);break;
    case 'corte_marcada': institucional.respeitoConstitucional=clamp((institucional.respeitoConstitucional||80)+3);institucional.tensaoInstitucional=clamp((institucional.tensaoInstitucional||10)-2);break;
    case 'estabilidade_institucional': institucional.credibilidadeDemocratica=clamp((institucional.credibilidadeDemocratica||80)+4);economia.confiancaMercado=clamp((economia.confiancaMercado||50)+3);oposicao.forca=clamp((oposicao.forca||30)-3);break;
    default: break;
  }
  return {...state,popularidade,economia,mundo,institucional,stf,congresso,oposicao,capitalPolitico,climaGoverno,estados,gruposSociais,capacidadesDesbloqueadas:[...capacidades]};
}
