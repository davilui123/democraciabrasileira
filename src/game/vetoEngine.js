const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
const incorporated=new Set(['aceita','aceita_negociada','incorporada_governo']);

export const SENADO_PARTIDOS={esq:18,centro:24,dir:25,ind:14};


const chamberSupport=(proposta,lei,partidos)=>partidos.reduce((total,partido)=>{
  const afinidade=lei.afinidade?.[partido.id]??50;
  const governismo=partido.apoio??50;
  let prob;
  if(proposta.origem==='executivo') prob=afinidade*.62+governismo*.38;
  else {
    prob=afinidade*.82+9;
    if(proposta.posicaoGoverno==='apoiar') prob+=8+(governismo-50)*.28;
    else if(proposta.posicaoGoverno==='negociar') prob+=4+(governismo-50)*.12;
    else if(proposta.posicaoGoverno==='opor') prob-=5+Math.max(0,governismo-45)*.25;
    if(proposta.autor?.partidoId===partido.id) prob+=11;
    if(proposta.origem==='oposicao'&&partido.id==='dir') prob+=10;
    if(proposta.origem==='governadores'&&['centro','ind'].includes(partido.id)) prob+=4;
  }
  prob+=(proposta.apoioBonus||0)+(proposta.bonusPorPartido?.[partido.id]||0);
  return total+Math.round((partido.cadeiras||0)*clamp(prob,4,97)/100);
},0);

const pesoEmenda=(emenda)=>{
  const fiscal=Math.min(8,Math.abs(emenda?.efeito?.fiscal||0)/55);
  const riscos=Object.values(emenda?.efeito?.riscos||{}).reduce((s,v)=>s+Math.abs(v||0),0)/18;
  return clamp(6+fiscal+riscos,6,14);
};

export const gerarDispositivosVeto=(proposta={},lei={})=>{
  const riscos={...(lei.riscosControle||{}),...(proposta.riscosTexto||{})};
  const dispositivos=[
    {
      id:'execucao_regulamentacao',
      titulo:'Execução e regulamentação',
      descricao:'Prazos, instrumentos de execução e regras complementares do texto aprovado.',
      origem:'texto-base',
      peso:12,
      impacto:'execução',
      riscos:{implementacao:-10,stf:-3},
      fiscal:Math.round((proposta.impactoFiscalEmendas||0)*.08),
    },
  ];
  if(Math.abs(proposta.impactoFiscalEmendas||0)>=80 || ['economia','tributacao','saude','educacao','infraestrutura','agro'].includes(lei.categoria)){
    dispositivos.push({
      id:'dispositivo_fiscal',
      titulo:'Dispositivo fiscal e incentivos',
      descricao:'Benefícios, incentivos, fundos e compromissos orçamentários acessórios previstos no texto.',
      origem:'texto-base',
      peso:14,
      impacto:'fiscal',
      riscos:{tcu:-10,implementacao:-3},
      fiscal:Math.round(Math.max(120,Math.abs(proposta.impactoFiscalEmendas||0)*.45)),
    });
  }
  if((riscos.federativo||0)>=45 || ['infraestrutura','saude','educacao','seguranca','agro','sociedade'].includes(lei.categoria)){
    dispositivos.push({
      id:'arranjo_federativo',
      titulo:'Competências e arranjo federativo',
      descricao:'Trechos que distribuem responsabilidades, repasses e obrigações entre União, estados e municípios.',
      origem:'texto-base',
      peso:10,
      impacto:'federativo',
      riscos:{federativo:-12,stf:-5},
      fiscal:60,
    });
  }
  (proposta.emendas||[]).filter(e=>incorporated.has(e.status)).forEach((emenda,index)=>{
    dispositivos.push({
      id:`emenda:${emenda.id}`,
      emendaId:emenda.id,
      titulo:emenda.titulo,
      descricao:emenda.descricao || 'Dispositivo incorporado durante a negociação parlamentar.',
      origem:emenda.origem==='governo'?'emenda do governo':'emenda parlamentar',
      autor:emenda.autor?.nome||null,
      peso:pesoEmenda(emenda),
      impacto:'emenda',
      riscos:Object.fromEntries(Object.entries(emenda.efeito?.riscos||{}).map(([k,v])=>[k,-Math.sign(v||0)*Math.min(12,Math.abs(v||0))])),
      fiscal:Math.round(Math.abs(emenda.efeito?.fiscal||0)),
    });
  });
  // Um veto parcial não pode apagar o projeto inteiro. Limitamos o peso agregado dos dispositivos acessórios a 45%.
  const total=dispositivos.reduce((s,d)=>s+d.peso,0)||1;
  const scale=total>45?45/total:1;
  return dispositivos.map(d=>({...d,peso:Number((d.peso*scale).toFixed(1))}));
};

export const resumirVetoParcial=(proposta,lei,ids=[])=>{
  const dispositivos=gerarDispositivosVeto(proposta,lei);
  const escolhidos=dispositivos.filter(d=>ids.includes(d.id));
  const pesoVetado=clamp(escolhidos.reduce((s,d)=>s+d.peso,0),1,45);
  const fatorRetido=Number((1-pesoVetado/100).toFixed(3));
  const reducaoRiscos={};
  let alivioFiscal=0;
  escolhidos.forEach(d=>{
    Object.entries(d.riscos||{}).forEach(([k,v])=>{reducaoRiscos[k]=(reducaoRiscos[k]||0)+v;});
    alivioFiscal+=d.fiscal||0;
  });
  return {dispositivos,escolhidos,pesoVetado,fatorRetido,reducaoRiscos,alivioFiscal};
};

const senateSupport=(proposta,lei,partidos)=>{
  let total=0;
  Object.entries(SENADO_PARTIDOS).forEach(([id,seats])=>{
    const partido=partidos.find(p=>p.id===id)||{apoio:50};
    const afinidade=lei.afinidade?.[id]??50;
    const governismo=partido.apoio??50;
    let prob=afinidade*.78+11;
    if(proposta.origem==='executivo') prob=afinidade*.6+governismo*.4;
    else if(proposta.posicaoGoverno==='apoiar') prob+=7+(governismo-50)*.18;
    else if(proposta.posicaoGoverno==='opor') prob-=5+Math.max(0,governismo-45)*.18;
    total+=Math.round(seats*clamp(prob,5,96)/100);
  });
  return clamp(total,0,81);
};

export const calcularProjecaoDerrubadaVeto=({proposta,lei,partidos=[],congresso={}})=>{
  const baseCamara=chamberSupport(proposta,lei,partidos);
  const baseSenado=senateSupport(proposta,lei,partidos);
  const governismo=partidos.reduce((s,p)=>s+(p.cadeiras||0)*(p.apoio||50),0)/(partidos.reduce((s,p)=>s+(p.cadeiras||0),0)||1);
  const veto=proposta.vetoPresidencial||{};
  const total=veto.tipo==='total';
  const origemBoost=proposta.origem==='oposicao'?20:proposta.origem==='governadores'?14:proposta.origem==='congresso'?9:-8;
  const respeitoVeto=(governismo-35)*.32 + Math.max(0,(congresso.poder||50)-45)*.18;
  const defesa=(veto.defesaBonus||0);
  const parcialPenalty=total?0:14;
  const camara=clamp(Math.round(baseCamara+origemBoost-respeitoVeto-defesa-parcialPenalty),80,410);
  const senado=clamp(Math.round(baseSenado+(origemBoost/7)-((governismo-35)*.055)-(defesa/6)-(total?0:2)),12,67);
  const margemCamara=camara-257;
  const margemSenado=senado-41;
  return {
    camara:{projetado:camara,necessario:257,margem:margemCamara},
    senado:{projetado:senado,necessario:41,margem:margemSenado},
    tendencia:margemCamara>=0&&margemSenado>=0?'derrubada':margemCamara<0&&margemSenado<0?'manutencao':'disputado',
  };
};

export const simularAnaliseVeto=({proposta,lei,partidos=[],congresso={},random=Math.random})=>{
  const proj=calcularProjecaoDerrubadaVeto({proposta,lei,partidos,congresso});
  const camara=clamp(Math.round(proj.camara.projetado+(random()-.5)*20),0,513);
  const senado=clamp(Math.round(proj.senado.projetado+(random()-.5)*8),0,81);
  const derrubado=camara>=257&&senado>=41;
  return {derrubado,camara,senado,necessarioCamara:257,necessarioSenado:41,projecao:proj};
};
