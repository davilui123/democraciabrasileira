const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));

export const GOVERNABILIDADE_INICIAL={
  ultimoDelta:0,
  ultimoTurno:0,
  motivos:[],
  historico:[],
};

export function custoPoliticoEfetivo(base=1,state={},escala='normal'){
  let custo=Math.max(0,Number(base)||0);
  const cp=Number(state.capitalPolitico??50);
  const clima=Number(state.climaGoverno??50);
  const congresso=Number(state.congresso?.poder??50);
  if(cp<20) custo+=escala==='grande'?2:1;
  if(clima<32 && escala!=='baixo') custo+=1;
  if(congresso<30 && escala==='grande') custo+=1;
  return Math.max(0,Math.round(custo));
}

export function diagnosticoCapitalPolitico(state={}){
  const valor=clamp(state.capitalPolitico??50);
  if(valor>=75) return {faixa:'muito_alto',titulo:'Presidência dominante',texto:'Há espaço para reformas, crises e negociações simultâneas, mas decisões ruins ainda podem consumir capital rapidamente.'};
  if(valor>=55) return {faixa:'alto',titulo:'Boa margem de manobra',texto:'O Planalto consegue sustentar uma agenda ativa sem depender de vitórias perfeitas todos os meses.'};
  if(valor>=35) return {faixa:'medio',titulo:'Margem disputada',texto:'Grandes movimentos exigem escolha. Gastar capital em uma frente pode deixar outra descoberta.'};
  if(valor>=20) return {faixa:'baixo',titulo:'Governo pressionado',texto:'Negociações ficam mais caras e ações de grande escala começam a exigir recuperação política antes de avançar.'};
  return {faixa:'critico',titulo:'Presidência encurralada',texto:'A capacidade de impor agenda está muito baixa. Congressistas, governadores e instituições ganham espaço para impor custos.'};
}

export function calcularVariacaoMensalCapital(state={}){
  const motivos=[];
  let delta=0;
  const aprov=Number(state.popularidade?.geral??50);
  const poder=Number(state.congresso?.poder??50);
  const clima=Number(state.climaGoverno??50);
  const primario=Number(state.economia?.resultadoPrimario??0);
  const oposicao=Number(state.oposicao?.forca??30);
  const cargos=state.cargos||[];
  const nomeacoes=state.nomeacoes||[];
  const criticos=['m_casacivil','m_fazenda','m_justica','m_exteriores'];
  const vagasCriticas=criticos.filter(id=>!nomeacoes.some(n=>n.cargoId===id)).length;

  if(aprov>=62){delta+=2;motivos.push({delta:2,texto:'aprovação nacional acima de 62%'});} 
  else if(aprov>=52){delta+=1;motivos.push({delta:1,texto:'aprovação nacional acima de 52%'});} 
  else if(aprov<32){delta-=2;motivos.push({delta:-2,texto:'aprovação nacional abaixo de 32%'});} 
  else if(aprov<40){delta-=1;motivos.push({delta:-1,texto:'aprovação nacional abaixo de 40%'});} 

  if(poder>=68){delta+=2;motivos.push({delta:2,texto:'forte poder de articulação no Congresso'});} 
  else if(poder>=54){delta+=1;motivos.push({delta:1,texto:'base parlamentar funcional'});} 
  else if(poder<28){delta-=2;motivos.push({delta:-2,texto:'Congresso em posição hostil'});} 
  else if(poder<40){delta-=1;motivos.push({delta:-1,texto:'articulação parlamentar frágil'});} 

  if(clima>=68){delta+=1;motivos.push({delta:1,texto:'gabinete coeso'});} 
  else if(clima<32){delta-=1;motivos.push({delta:-1,texto:'clima interno deteriorado'});} 

  if(primario>=8000){delta+=1;motivos.push({delta:1,texto:'resultado fiscal favorável'});} 
  else if(primario<=-15000){delta-=1;motivos.push({delta:-1,texto:'deterioração fiscal relevante'});} 

  if(vagasCriticas>=3){delta-=2;motivos.push({delta:-2,texto:'núcleo estratégico do governo incompleto'});} 
  else if(vagasCriticas===2){delta-=1;motivos.push({delta:-1,texto:'duas pastas estratégicas sem comando'});} 

  if(oposicao>=70){delta-=1;motivos.push({delta:-1,texto:'oposição em alta capacidade de mobilização'});} 
  if((state.institucional?.tensaoInstitucional??0)>=65){delta-=1;motivos.push({delta:-1,texto:'tensão institucional elevada'});} 

  delta=Math.max(-6,Math.min(6,delta));
  return {delta,motivos,vagasCriticas};
}

export function aplicarVariacaoMensalCapital(state={}){
  const calc=calcularVariacaoMensalCapital(state);
  const antes=clamp(state.capitalPolitico??50);
  const depois=clamp(antes+calc.delta);
  const turno=Number(state.turno||1)+1;
  const registro={turno,antes,depois,delta:depois-antes,motivos:calc.motivos};
  return {
    capitalPolitico:depois,
    governabilidade:{
      ...GOVERNABILIDADE_INICIAL,
      ...(state.governabilidade||{}),
      ultimoDelta:registro.delta,
      ultimoTurno:turno,
      motivos:calc.motivos,
      historico:[registro,...(state.governabilidade?.historico||[])].slice(0,18),
    },
    registro,
  };
}
