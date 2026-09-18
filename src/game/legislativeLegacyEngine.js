const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));

export const LEGADO_LEGISLATIVO_INICIAL={
  indice:0,
  pontos:0,
  bandeiras:[],
  marcos:[],
  historico:[],
  scoresAnteriores:{},
  ultimaAvaliacaoTurno:0,
};

export const STATUS_VIGENTES=new Set([
  'sancionada','sancionada_veto_mantido','sancionada_veto_derrubado','promulgada_veto_derrubado',
]);

const finalStatus=(p={})=>{
  if(STATUS_VIGENTES.has(p.status)&&p.textoFinal?.vigencia!=='sem_vigencia')return 'vigente';
  if(['vetada_mantida','vetada'].includes(p.status)||p.textoFinal?.vigencia==='sem_vigencia')return 'vetada';
  if(p.status==='arquivada')return 'arquivada';
  if(['em_tramitacao','votacao_hoje','aguarda_segundo_turno','senado','aguardando_sancao','veto_congresso'].includes(p.status))return 'tramitando';
  return 'encerrada';
};

const statusPrograma=(programa={})=>{
  if(programa.status==='concluido')return 8;
  if(['ativo','implantacao'].includes(programa.status))return 4;
  if(programa.status==='atrasado')return -5;
  if(['suspenso','vetado','rejeitado'].includes(programa.status))return -10;
  return 0;
};

const programaScore=(programas=[])=>{
  if(!programas.length)return {pontos:0,resumo:'Sem programa derivado em execução',media:0};
  const valores=programas.map(p=>{
    const progresso=clamp(Number(p.progresso||0));
    const qualidade=clamp(Number(p.qualidade??60));
    const execucao=clamp(Number(p.execucao??50));
    const risco=clamp(Number(p.riscoExecucao??40));
    return clamp(progresso*.09+qualidade*.035+execucao*.025-risco*.025+statusPrograma(p),-12,22);
  });
  const media=valores.reduce((a,b)=>a+b,0)/valores.length;
  return {pontos:media,resumo:`${programas.length} programa(s) · ${Math.round(programas.reduce((s,p)=>s+(p.progresso||0),0)/programas.length)}% de progresso médio`,media};
};

const scoreSTF=(casos=[])=>{
  if(!casos.length)return {pontos:0,resumo:'Sem julgamento constitucional relevante'};
  const c=[...casos].sort((a,b)=>(b.julgadoNoTurno||b.abertoNoTurno||0)-(a.julgadoNoTurno||a.abertoNoTurno||0))[0];
  if(c.status!=='julgado')return {pontos:-2,resumo:'Controle no STF ainda pendente'};
  if(c.resultado==='constitucional')return {pontos:9,resumo:'Constitucionalidade confirmada pelo STF'};
  if(c.resultado==='inconstitucional_parcial')return {pontos:-8,resumo:'STF retirou parte da eficácia da lei'};
  if(c.resultado==='inconstitucional_total')return {pontos:-22,resumo:'STF invalidou a lei'};
  return {pontos:0,resumo:'Controle constitucional concluído'};
};

const scoreTCU=(auditorias=[])=>{
  if(!auditorias.length)return {pontos:0,resumo:'Sem decisão relevante do TCU'};
  const a=[...auditorias].sort((x,y)=>(y.decididaNoTurno||y.abertoNoTurno||0)-(x.decididaNoTurno||x.abertoNoTurno||0))[0];
  if(a.status!=='decidida')return {pontos:-1,resumo:'Execução sob acompanhamento do TCU'};
  if(a.resultado==='regularidade')return {pontos:7,resumo:'TCU reconheceu regularidade da implementação'};
  if(a.resultado==='ressalvas')return {pontos:1,resumo:'TCU concluiu com ressalvas'};
  if(a.resultado==='determinacao_ajustes')return {pontos:-6,resumo:'TCU determinou ajustes de execução'};
  if(a.resultado==='suspensao_despesas')return {pontos:-15,resumo:'TCU suspendeu despesas vinculadas'};
  return {pontos:0,resumo:'Fiscalização concluída'};
};

const scoreRegulacao=(processo,lei={})=>{
  if(!lei.regulamentacao?.necessaria)return {pontos:8,resumo:'Aplicação direta, sem regulamentação adicional'};
  if(!processo)return {pontos:-4,resumo:'Regulamentação ainda não iniciada'};
  if(processo.status==='regulamentada'){
    const nota=clamp(Number(processo.notaDesenho??60));
    const bonus=(nota-50)*.12;
    return {pontos:clamp(8+bonus,2,14),resumo:`Regulamentada · desenho ${Math.round(nota)}/100`};
  }
  const atraso=Number(processo.mesesEmAtraso||0);
  return {pontos:-Math.min(14,3+atraso*3),resumo:atraso?`Regulamentação atrasada há ${atraso} mês(es)`:'Regulamentação pendente'};
};

const origemLabel=(p={})=>p.origem==='executivo'?'Planalto':p.origem==='oposicao'?'Oposição':p.origem==='governadores'?'Governadores':'Congresso';

const tier=(score,status)=>{
  if(status==='arquivada')return {id:'arquivada',label:'Arquivada',tone:'muted'};
  if(status==='vetada')return {id:'vetada',label:'Vetada',tone:'danger'};
  if(status==='invalidada')return {id:'invalidada',label:'Invalidada pelo STF',tone:'danger'};
  if(status==='tramitando')return {id:'tramitando',label:'Em disputa',tone:'warning'};
  if(score>=90)return {id:'historica',label:'Legado histórico',tone:'warning'};
  if(score>=80)return {id:'emblematica',label:'Lei emblemática',tone:'success'};
  if(score>=65)return {id:'estruturante',label:'Lei estruturante',tone:'info'};
  if(score>=45)return {id:'consolidacao',label:'Em consolidação',tone:'neutral'};
  return {id:'contestada',label:'Legado contestado',tone:'danger'};
};

const timeline=(proposta,regulacao,casos,auditorias,programas)=>{
  const rows=(proposta?.historico||[]).map((h,i)=>({id:`p_${i}_${h.turno||0}`,turno:h.turno||0,tipo:h.tipo||'tramitação',texto:h.texto||''}));
  if(regulacao){
    if(regulacao.criadoNoTurno)rows.push({id:'reg_abertura',turno:regulacao.criadoNoTurno,tipo:'regulamentação',texto:'Lei entrou na fila de regulamentação.'});
    if(regulacao.regulamentadaNoTurno)rows.push({id:'reg_fim',turno:regulacao.regulamentadaNoTurno,tipo:'regulamentação',texto:`Regulamentação concluída com desenho ${Math.round(regulacao.notaDesenho||0)}/100.`});
  }
  casos.forEach(c=>{rows.push({id:c.id+'_a',turno:c.abertoNoTurno||0,tipo:'STF',texto:`${c.tipo} distribuída no STF.`});if(c.julgadoNoTurno)rows.push({id:c.id+'_j',turno:c.julgadoNoTurno,tipo:'STF',texto:`Julgamento: ${(c.resultado||'concluído').replaceAll('_',' ')}.`});});
  auditorias.forEach(a=>{rows.push({id:a.id+'_a',turno:a.abertoNoTurno||0,tipo:'TCU',texto:'TCU abriu acompanhamento da implementação.'});if(a.decididaNoTurno)rows.push({id:a.id+'_d',turno:a.decididaNoTurno,tipo:'TCU',texto:`Decisão: ${(a.resultado||'concluída').replaceAll('_',' ')}.`});});
  programas.forEach(p=>rows.push({id:`prog_${p.id}`,turno:p.criadoNoTurno||p.iniciadoNoTurno||0,tipo:'programa',texto:`${p.nome} nasceu desta lei${p.status==='concluido'?' e concluiu suas entregas':''}.`}));
  return rows.filter(r=>r.texto).sort((a,b)=>(b.turno||0)-(a.turno||0)).slice(0,18);
};

export function avaliarLeiLegado({lei,proposta,controle={},regulamentacao={},programas=[]}={}){
  if(!lei||!proposta)return null;
  const casos=(controle.casosSTF||[]).filter(c=>c.propostaId===proposta.id||c.leiId===lei.id);
  const auditorias=(controle.auditoriasTCU||[]).filter(a=>a.propostaId===proposta.id||a.leiId===lei.id);
  const processo=(regulamentacao.processos||[]).find(p=>p.propostaId===proposta.id||p.leiId===lei.id);
  const programs=(programas||[]).filter(p=>p.leiOrigemId===lei.id||p.leiId===lei.id||p.propostaOrigemId===proposta.id);
  const invalidada=casos.some(c=>c.status==='julgado'&&c.resultado==='inconstitucional_total');
  const status=invalidada?'invalidada':finalStatus(proposta);
  if(status!=='vigente'){
    const score=status==='tramitando'?20:status==='vetada'?8:status==='invalidada'?12:5;
    return {leiId:lei.id,propostaId:proposta.id,titulo:lei.titulo,categoria:lei.categoria,instrumento:lei.instrumento,status,score,tier:tier(score,status),origem:origemLabel(proposta),posicaoGoverno:proposta.posicaoGoverno||null,programas:programs,regulacao:processo,casosSTF:casos,auditoriasTCU:auditorias,timeline:timeline(proposta,processo,casos,auditorias,programs),legadoPotencial:lei.legadoPotencial||null};
  }
  let score=46;
  const alteracoes=(proposta.textoFinal?.alteracoes||proposta.alteracoesTexto||[]).length;
  score+=Math.min(7,alteracoes*1.2);
  const veto=proposta.textoFinal?.veto||proposta.vetoPresidencial;
  if(veto?.tipo==='parcial'&&veto?.resultado==='mantido')score-=3;
  if(veto?.resultado==='derrubado')score+=2;
  const reg=scoreRegulacao(processo,lei); score+=reg.pontos;
  const prog=programaScore(programs); score+=prog.pontos;
  const stf=scoreSTF(casos); score+=stf.pontos;
  const tcu=scoreTCU(auditorias); score+=tcu.pontos;
  if(proposta.origem==='executivo')score+=3;
  else if(['apoiar','negociar'].includes(proposta.posicaoGoverno))score+=1;
  score=clamp(Math.round(score));
  return {leiId:lei.id,propostaId:proposta.id,titulo:lei.titulo,categoria:lei.categoria,instrumento:lei.instrumento,status,score,tier:tier(score,status),origem:origemLabel(proposta),posicaoGoverno:proposta.posicaoGoverno||null,versao:proposta.textoFinal?.versao||proposta.versaoTexto||1,alteracoes,regulacao:processo,programas:programs,casosSTF:casos,auditoriasTCU:auditorias,regResumo:reg.resumo,progResumo:prog.resumo,stfResumo:stf.resumo,tcuResumo:tcu.resumo,timeline:timeline(proposta,processo,casos,auditorias,programs),legadoPotencial:lei.legadoPotencial||null};
}

export function construirLegadoLegislativo(state={}){
  const propostas=(state.votacoes||[]);
  const leis=state.leisDisponiveis||[];
  const entradas=propostas.map(p=>avaliarLeiLegado({lei:leis.find(l=>l.id===p.leiId),proposta:p,controle:state.controleLeis||{},regulamentacao:state.regulamentacaoLeis||{},programas:state.programas||[]})).filter(Boolean);
  const vigentes=entradas.filter(e=>e.status==='vigente');
  const bandeiras=new Set(state.legadoLegislativo?.bandeiras||[]);
  const weighted=vigentes.map(e=>({e,w:bandeiras.has(e.leiId)?1.35:1}));
  const avg=weighted.length?weighted.reduce((s,x)=>s+x.e.score*x.w,0)/weighted.reduce((s,x)=>s+x.w,0):0;
  const categorias=new Set(vigentes.map(e=>e.categoria));
  const cobertura=clamp(categorias.size/13*100);
  const regulamentaveis=vigentes.filter(e=>leis.find(l=>l.id===e.leiId)?.regulamentacao?.necessaria);
  const reguladas=regulamentaveis.filter(e=>e.regulacao?.status==='regulamentada');
  const taxaRegulacao=regulamentaveis.length?reguladas.length/regulamentaveis.length*100:100;
  const indice=vigentes.length?clamp(Math.round(avg*.72+cobertura*.13+taxaRegulacao*.15)):0;
  const emblematicas=vigentes.filter(e=>e.score>=80).sort((a,b)=>b.score-a.score);
  const historicas=vigentes.filter(e=>e.score>=90).sort((a,b)=>b.score-a.score);
  const contestadas=vigentes.filter(e=>e.score<45).sort((a,b)=>a.score-b.score);
  const programasDerivados=(state.programas||[]).filter(p=>p.derivadoDeLei||p.leiOrigemId);
  const categoriasResumo=[...categorias].map(id=>{const list=vigentes.filter(e=>e.categoria===id);return {id,quantidade:list.length,score:Math.round(list.reduce((s,e)=>s+e.score,0)/Math.max(1,list.length))};}).sort((a,b)=>b.score-a.score);
  return {indice,entradas:entradas.sort((a,b)=>b.score-a.score),vigentes:vigentes.length,arquivadas:entradas.filter(e=>e.status==='arquivada').length,vetadas:entradas.filter(e=>e.status==='vetada').length,invalidas:entradas.filter(e=>e.status==='invalidada').length,emblematicas,historicas,contestadas,cobertura:Math.round(cobertura),taxaRegulacao:Math.round(taxaRegulacao),reguladas:reguladas.length,programasDerivados:programasDerivados.length,categoriasResumo,bandeiras:[...bandeiras]};
}

export function processarLegadoLegislativoMensal({legado=LEGADO_LEGISLATIVO_INICIAL,state={}}){
  const base={...LEGADO_LEGISLATIVO_INICIAL,...(legado||{}),bandeiras:[...(legado?.bandeiras||[])],marcos:[...(legado?.marcos||[])],historico:[...(legado?.historico||[])],scoresAnteriores:{...(legado?.scoresAnteriores||{})}};
  const resumo=construirLegadoLegislativo({...state,legadoLegislativo:base});
  const novosMarcos=[];
  const thresholds=[{v:65,id:'estruturante',label:'torna-se estruturante'},{v:80,id:'emblematica',label:'entra entre as leis emblemáticas'},{v:90,id:'historica',label:'alcança legado histórico'}];
  resumo.entradas.filter(e=>e.status==='vigente').forEach(e=>{
    const old=base.scoresAnteriores[e.leiId]??0;
    thresholds.forEach(t=>{
      const key=`${e.leiId}:${t.id}`;
      if(old<t.v&&e.score>=t.v&&!base.marcos.some(m=>m.key===key))novosMarcos.push({key,leiId:e.leiId,titulo:e.titulo,tipo:t.id,turno:state.turno||1,texto:`${e.titulo} ${t.label}.`,score:e.score});
    });
    base.scoresAnteriores[e.leiId]=e.score;
  });
  const pontosNovos=novosMarcos.reduce((s,m)=>s+(m.tipo==='historica'?4:m.tipo==='emblematica'?2:1),0);
  const next={...base,indice:resumo.indice,pontos:(base.pontos||0)+pontosNovos,marcos:[...novosMarcos,...base.marcos].slice(0,80),historico:[{turno:state.turno||1,indice:resumo.indice,vigentes:resumo.vigentes,emblematicas:resumo.emblematicas.length,reguladas:resumo.reguladas},...base.historico].slice(0,60),ultimaAvaliacaoTurno:state.turno||1};
  return {legado:next,resumo,novosMarcos,pontosNovos};
}

export function alternarBandeiraLegado(legado,leiId,vigente=true){
  if(!vigente)return {ok:false,motivo:'Apenas leis em vigor podem virar bandeira do mandato.'};
  const current=[...(legado?.bandeiras||[])];
  if(current.includes(leiId))return {ok:true,legado:{...LEGADO_LEGISLATIVO_INICIAL,...legado,bandeiras:current.filter(id=>id!==leiId)}};
  if(current.length>=3)return {ok:false,motivo:'O mandato pode sustentar no máximo três bandeiras legislativas.'};
  return {ok:true,legado:{...LEGADO_LEGISLATIVO_INICIAL,...legado,bandeiras:[...current,leiId]}};
}
