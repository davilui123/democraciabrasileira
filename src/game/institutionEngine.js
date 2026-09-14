import { eventosFederativosSeed } from '../data/seed/eventosFederativos.js';

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));

export function montarEventoFederativo(base, estados=[], nomeacoes=[], cargos=[]){
  if(!base) return null;
  const estado=estados.find(e=>e.uf===base.uf);
  const gov=estado?.governador;
  const casa=nomeacoes.find(n=>n.cargoId==='m_casacivil');
  const casaNome=casa?.nome||'ministro-chefe da Casa Civil';
  const texto=String(base.texto||'')
    .replaceAll('{governador}',gov?.nome||`o governador de ${estado?.nome||base.uf}`)
    .replaceAll('{partido}',gov?.partido||'seu partido')
    .replaceAll('{casaCivil}',casaNome);
  return {
    ...base,
    instanceId:`${base.id}_${Date.now()}`,
    estado:estado?.nome||base.uf,
    governador:gov||null,
    casaCivil:casaNome,
    texto,
    status:'ativa',
    criadoNoTurno:null,
  };
}

export function sortearEventoFederativo({turno=1,estados=[],historico=[],nomeacoes=[],cargos=[],rng=Math.random}){
  const usados=new Set((historico||[]).slice(0,14).map(e=>e.baseId||e.id));
  const elegiveis=eventosFederativosSeed.filter(e=>!usados.has(e.id));
  const pool=elegiveis.length?elegiveis:eventosFederativosSeed;
  // A seleção voltou a ser realmente aleatória. O parâmetro rng existe para QA reproduzível.
  const idx=Math.max(0,Math.min(pool.length-1,Math.floor((rng?.() ?? Math.random())*pool.length)));
  const event=montarEventoFederativo(pool[idx],estados,nomeacoes,cargos);
  return event?{...event,baseId:pool[idx].id,criadoNoTurno:turno}:null;
}

export function criarProcessoSTF({evento,opcao,corte=[],turno=1}){
  const ministros=(corte||[]).filter(x=>x&&x.id);
  const relator=ministros.length?ministros[(turno+(evento?.uf?.charCodeAt?.(0)||0))%ministros.length]:null;
  const perfil=relator?.perfil||'institucionalista';
  const viés=(relator?.independencia||80)/20 + (relator?.rigorFiscal||50)/50;
  const risco=clamp(45+(evento?.gravidade||50)*.25+(opcao?.tensao||0)*2-viés,15,92);
  return {
    id:`adi_${evento?.baseId||'federal'}_${Date.now()}`,
    titulo:`Controle constitucional · ${evento?.titulo||'Conflito federativo'}`,
    origem:evento?.uf||'União',
    tipo:'ADI',
    relatorId:relator?.id||null,
    relator:relator?.nome||'Relatoria a definir',
    status:'aguardando_julgamento',
    abertoNoTurno:turno,
    julgamentoNoTurno:turno+1,
    riscoGoverno:Math.round(risco),
    tema:evento?.tema||'federalismo',
  };
}

export function julgarProcessosSTF(stf,turno){
  const corte=stf?.corte||[];
  const julgados=[];
  const processos=(stf?.processosEmCurso||[]).map(p=>{
    if(p.status!=='aguardando_julgamento'||(p.julgamentoNoTurno||999)>turno)return p;
    const relator=corte.find(m=>m.id===p.relatorId);
    const independencia=relator?.independencia||80;
    const score=(p.riscoGoverno||50)+(100-independencia)*.15;
    const governoVence=score<58;
    const novo={...p,status:'julgado',resultado:governoVence?'governo_vitorioso':'governo_derrotado',julgadoNoTurno:turno};
    julgados.push(novo);
    return novo;
  });
  return {processos,julgados};
}

export function projetarVotosSTF({candidato,congresso,oposicao}){
  const poder=congresso?.poder??50;
  const resistencia=oposicao?.forca??30;
  const base=(candidato?.apoioSenado??50)*.55+poder*.35-resistencia*.15+(candidato?.reputacao??70)*.08;
  return clamp(Math.round(24+base*.57),20,68);
}
