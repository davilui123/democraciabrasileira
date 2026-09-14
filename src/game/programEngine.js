import { programaTemplatePorId, modeloExecucaoPorId, fonteProgramaPorId, governancaProgramaPorId } from '../data/seed/programasGovernamentais.js';

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));

export function simularDesenhoPrograma(config, contexto={}){
  const t=programaTemplatePorId(config.templateId)||config.template||{};
  const modelo=modeloExecucaoPorId(config.modeloExecucao);
  const fonte=fonteProgramaPorId(config.fonte);
  const gov=governancaProgramaPorId(config.governanca);
  const budget=Number(config.orcamentoMensal||t.orcamentoPadrao||600);
  const duration=Number(config.duracao||t.duracaoPadrao||24);
  const estados=(config.ufs||[]).length;
  const escopo=config.territorio==='nacional'?1:clamp(.38+estados/34,.42,1);
  const federalShare=clamp((fonte.fatorFiscal||1)*(modelo.custoFederal||1),.3,1.15);
  const custoFederal=Math.round(budget*federalShare*(1+(gov.custo||0)));
  const ministerios=t.ministerios||[];
  const nomeados=ministerios.filter(id=>(contexto.nomeacoes||[]).some(n=>n.cargoId===id));
  const capacidadeMinisterial=ministerios.length?nomeados.length/ministerios.length:1;
  const apoioGovernadores=config.territorio==='nacional'?((contexto.estados||[]).reduce((s,e)=>s+(e.relacaoPlanalto||50),0)/Math.max(1,(contexto.estados||[]).length)):((contexto.estados||[]).filter(e=>(config.ufs||[]).includes(e.uf)).reduce((s,e)=>s+(e.relacaoPlanalto||50),0)/Math.max(1,estados));
  const parceiros=(contexto.parceriasEmpresariais||[]).filter(p=>p.status==='ativa'||p.status==='concluida').length;
  const eficiencia=clamp(48+modelo.eficiencia+gov.eficiencia+capacidadeMinisterial*18+(apoioGovernadores-50)*.12+Math.min(8,parceiros*1.5),25,95);
  const risco=clamp(22+modelo.risco+gov.risco+(1-capacidadeMinisterial)*18+Math.max(0,50-apoioGovernadores)*.18+(config.viaLegal==='decreto'&&budget>900?9:0),4,85);
  const impactoPrimarioTotal=Math.round(custoFederal*duration);
  return {custoFederalMensal:custoFederal,custoTotal:Math.round(budget*duration),impactoPrimarioTotal,eficiencia,risco,escopo,capacidadeMinisterial,apoioGovernadores,federalShare};
}

export function construirPrograma(config, contexto={}){
  const t=programaTemplatePorId(config.templateId);
  if(!t)throw new Error('Arquétipo de programa não encontrado.');
  const sim=simularDesenhoPrograma(config,contexto);
  const agora=Date.now();
  return {
    id:`prog_${t.id}_${agora}`,
    templateId:t.id,
    nome:String(config.nome||t.nome).trim(),
    area:t.area,
    icone:t.icone,
    descricao:t.descricao,
    promessaId:config.promessaId||t.promessaId||null,
    ministerios:t.ministerios||[],
    fiscalTipo:t.fiscalTipo||'custeio',
    macro:t.macro||{},
    grupos:t.grupos||{},
    metas:(t.metas||[]).map(([nome,meta,unidade],i)=>({id:`meta_${i}`,nome,meta,unidade,valor:0,peso:i===0?1.2:1})),
    territorio:config.territorio||'nacional',
    ufs:config.territorio==='nacional'?[]:[...(config.ufs||[])],
    duracao:Number(config.duracao||t.duracaoPadrao||24),
    orcamentoMensal:Number(config.orcamentoMensal||t.orcamentoPadrao||600),
    modeloExecucao:config.modeloExecucao||'federal',
    fonte:config.fonte||'tesouro',
    governanca:config.governanca||'padrao',
    viaLegal:config.viaLegal||t.legalPadrao||'executivo',
    prioridade:config.prioridade||'media',
    status:'planejamento',
    progresso:0,
    qualidade:50,
    execucao:sim.eficiencia,
    riscoExecucao:sim.risco,
    custoFederalMensal:sim.custoFederalMensal,
    custoTotalProjetado:sim.custoTotal,
    gastoAcumulado:0,
    mesesExecutados:0,
    atrasoMeses:0,
    alertas:[],
    marcos:[],
    criadoNoTurno:contexto.turno||1,
    atualizadoNoTurno:contexto.turno||1,
  };
}

export function programaParaLei(programa){
  const afinidadeBase={esq:72,centro:68,ind:66,dir:54};
  if(programa.area==='Segurança')Object.assign(afinidadeBase,{esq:58,centro:76,ind:72,dir:82});
  if(programa.area==='Indústria')Object.assign(afinidadeBase,{esq:78,centro:74,ind:70,dir:62});
  if(programa.area==='Social'||programa.area==='Saúde'||programa.area==='Educação')Object.assign(afinidadeBase,{esq:90,centro:76,ind:72,dir:48});
  if(programa.modeloExecucao==='ppp')afinidadeBase.dir+=10,afinidadeBase.esq-=8;
  const instrumento=programa.viaLegal==='mp'?'MP':programa.viaLegal==='plp'?'PLP':'PL';
  return {
    id:`lei_${programa.id}`,
    programaId:programa.id,
    titulo:`Marco do ${programa.nome}`,
    categoria:programa.area==='Segurança'?'seguranca':programa.area==='Saúde'?'saude':programa.area==='Educação'?'educacao':'infraestrutura',
    instrumento,
    descricao:`Autoriza e estrutura o programa governamental ${programa.nome}, com metas, governança e execução plurianual.`,
    comissoes:['cft',programa.area==='Saúde'?'cssf':programa.area==='Segurança'?'cspcco':'cde','ccjc'],
    apreciacao:'plenario',
    admiteUrgencia:true,
    custoPolitico:Math.round(24+programa.riscoExecucao*.22),
    complexidade:'alta',
    polarizacao:clamp(28+programa.riscoExecucao*.38,25,78),
    tempoTramitacao:5,
    afinidade:afinidadeBase,
    tags:['programa_governamental',String(programa.area||'').toLowerCase(),programa.promessaId].filter(Boolean),
    efeitos:{climaGoverno:1},
  };
}

export function avaliarMesPrograma(programa, contexto={}){
  const sim=simularDesenhoPrograma(programa,contexto);
  const prioridade={baixa:.88,media:1,alta:1.11}[programa.prioridade]||1;
  const maturidade=programa.mesesExecutados<3?.82:programa.mesesExecutados<8?.96:1.05;
  const execucao=clamp((programa.execucao||sim.eficiencia)*.6+sim.eficiencia*.4,20,98);
  const passoBase=100/Math.max(6,programa.duracao||24);
  const passo=passoBase*(execucao/68)*prioridade*maturidade;
  const roll=Number(contexto.roll??Math.random()*100);
  let evento=null;
  let custoMult=1;
  let qualidadeDelta=(execucao-58)/60;
  if(roll<(programa.riscoExecucao||sim.risco)*.16){
    const tipos=['atraso','sobrecusto','controle'];
    const tipo=tipos[Math.floor((roll*7)%tipos.length)];
    if(tipo==='atraso')evento={tipo,titulo:'Cronograma sob pressão',texto:'Licitações, capacidade local ou coordenação atrasam uma etapa crítica.',progresso:-passo*.45,risco:2};
    if(tipo==='sobrecusto'){evento={tipo,titulo:'Custo acima do previsto',texto:'Revisões de contrato e preços pressionam o orçamento do programa.',progresso:-passo*.18,risco:3};custoMult=1.14;}
    if(tipo==='controle')evento={tipo,titulo:'Órgãos de controle pedem ajustes',texto:'TCU e controladorias exigem correções antes de novos desembolsos.',progresso:-passo*.3,risco:-2,judicial:2};
    qualidadeDelta-=2;
  } else if(roll>92){
    evento={tipo:'marco',titulo:'Entrega acima do cronograma',texto:'Um lote de entregas antecipa resultados e melhora a percepção de execução.',progresso:passo*.35,risco:-1};
    qualidadeDelta+=2;
  }
  const progresso=clamp((programa.progresso||0)+passo+(evento?.progresso||0),0,100);
  const qualidade=clamp((programa.qualidade||50)+qualidadeDelta,20,100);
  const atrasado=(programa.mesesExecutados+1)>programa.duracao&&progresso<95;
  const custoFederal=Math.round(sim.custoFederalMensal*custoMult);
  return {progresso,qualidade,execucao,riscoExecucao:clamp((programa.riscoExecucao||sim.risco)+(evento?.risco||0),4,90),custoFederal,evento,atrasado,concluido:progresso>=99.5};
}
