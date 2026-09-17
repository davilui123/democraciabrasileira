const clamp=(value,min=0,max=100)=>Math.min(max,Math.max(min,value));

const hasAny=(tags=[],list=[])=>list.some(tag=>tags.includes(tag));
const byId=(atores,id)=>atores.find(a=>a.id===id)||null;

export const EMENDAS_TIPOS = [
  {
    id:'ancora_fiscal', titulo:'Cláusula de responsabilidade fiscal',
    descricao:'Limita a expansão permanente de despesas, exige fonte de custeio e revisão periódica do impacto orçamentário.',
    autorId:'pres_cft', alvoPartido:'dir',
    aplica:(lei)=>['economia','tributacao','saude','educacao','infraestrutura','agro','sociedade'].includes(lei.categoria)||hasAny(lei.tags,['fundo','credito','subsidio','investimento','programa']),
    efeito:{apoio:2,bonusPorPartido:{dir:11,centro:7,ind:4},polarizacao:-2,fiscal:-180,riscos:{tcu:-12,implementacao:-5},efeitosLei:{confiancaMercado:1,orcamento:80}},
    custo:{capital:1,poder:2}, grupo:'fiscal'
  },
  {
    id:'repasse_federativo', titulo:'Contrapartida federativa',
    descricao:'Reserva participação de estados e municípios na execução, com critérios de repasse e governança compartilhada.',
    autorId:'lider_centro', alvoPartido:'centro',
    aplica:(lei)=>['saude','educacao','seguranca','infraestrutura','agro','sociedade'].includes(lei.categoria)||hasAny(lei.tags,['estados','municipios','federalismo','royalties','icms']),
    efeito:{apoio:3,bonusPorPartido:{centro:12,ind:7,esq:3},polarizacao:1,fiscal:240,riscos:{federativo:-18,implementacao:-7,tcu:2},efeitosLei:{popularidade:.5,orcamento:-100}},
    custo:{capital:2,poder:2}, grupo:'federativo'
  },
  {
    id:'transicao_gradual', titulo:'Transição gradual',
    descricao:'Escalona a entrada em vigor e cria fase-piloto antes da aplicação integral das novas obrigações.',
    autorId:'lider_ind', alvoPartido:'ind',
    aplica:()=>true,
    efeito:{apoio:2,bonusPorPartido:{ind:10,centro:7,dir:5},polarizacao:-7,fiscal:60,riscos:{stf:-4,implementacao:-12},efeitosLei:{confiancaMercado:.5}},
    custo:{capital:1,poder:1}, grupo:'transicao'
  },
  {
    id:'salvaguarda_direitos', titulo:'Salvaguarda de direitos e devido processo',
    descricao:'Inclui garantias de contraditório, transparência, proteção de dados e revisão judicial das decisões administrativas.',
    autorId:'pres_ccjc', alvoPartido:'ind',
    aplica:(lei)=>['digital','seguranca','sociedade','trabalho','institucional'].includes(lei.categoria)||hasAny(lei.tags,['dados','direitos','privacidade','judiciario','armas']),
    efeito:{apoio:2,bonusPorPartido:{esq:9,ind:9,centro:4},polarizacao:-1,fiscal:25,riscos:{stf:-16,implementacao:3},efeitosLei:{popularidade:.3}},
    custo:{capital:1,poder:2}, grupo:'direitos'
  },
  {
    id:'excecao_setorial', titulo:'Exceção setorial e tratamento diferenciado',
    descricao:'Cria exceções temporárias para setores mais expostos ao custo de adaptação e pequenas empresas.',
    autorId:'lider_liberal', alvoPartido:'dir',
    aplica:(lei)=>['economia','tributacao','trabalho','agro','ambiental','digital'].includes(lei.categoria),
    efeito:{apoio:1,bonusPorPartido:{dir:14,centro:6,esq:-4},polarizacao:4,fiscal:190,riscos:{tcu:8,implementacao:7},efeitosLei:{confiancaMercado:.5,orcamento:-70}},
    custo:{capital:2,poder:2}, grupo:'setorial'
  },
  {
    id:'transparencia_controle', titulo:'Rastreabilidade e controle reforçado',
    descricao:'Exige metas públicas, beneficiário final, indicadores de desempenho e auditoria periódica de recursos e contratos.',
    autorId:'pres_cft', alvoPartido:'ind',
    aplica:(lei)=>(lei.riscosControle?.tcu||0)>=45||hasAny(lei.tags,['fundo','credito','compras','investimento','concessao','subsidio','estatal','orcamento']),
    efeito:{apoio:2,bonusPorPartido:{ind:10,centro:8,dir:5},polarizacao:-3,fiscal:35,riscos:{tcu:-20,implementacao:-6},efeitosLei:{confiancaMercado:.4}},
    custo:{capital:0,poder:1}, grupo:'controle'
  },
  {
    id:'conteudo_local', titulo:'Conteúdo local e transferência tecnológica',
    descricao:'Condiciona incentivos e compras estratégicas a produção local, fornecedores nacionais e transferência de tecnologia.',
    autorId:'lider_centro', alvoPartido:'centro',
    aplica:(lei)=>['economia','digital','geopolitica','infraestrutura'].includes(lei.categoria)||hasAny(lei.tags,['industria','tecnologia','compras','mineracao','defesa']),
    efeito:{apoio:2,bonusPorPartido:{centro:10,esq:7,dir:-4},polarizacao:3,fiscal:120,riscos:{tcu:5,implementacao:4},efeitosLei:{crescimentoPib:.05,confiancaMercado:-.2}},
    custo:{capital:2,poder:2}, grupo:'industrial'
  },
  {
    id:'clausula_revisao', titulo:'Cláusula de revisão legislativa',
    descricao:'Obriga avaliação independente e revisão do texto após período determinado, com indicadores previamente definidos.',
    autorId:'pres_camara', alvoPartido:'ind',
    aplica:()=>true,
    efeito:{apoio:2,bonusPorPartido:{ind:10,centro:6,dir:4},polarizacao:-5,fiscal:15,riscos:{stf:-5,tcu:-6,implementacao:-7},efeitosLei:{}},
    custo:{capital:1,poder:1}, grupo:'revisao'
  },
  {
    id:'garantia_social', titulo:'Piso de proteção social',
    descricao:'Inclui proteção mínima, fase de adaptação para famílias vulneráveis e mecanismos de compensação social.',
    autorId:'pres_social', alvoPartido:'esq',
    aplica:(lei)=>['trabalho','saude','educacao','sociedade','tributacao'].includes(lei.categoria),
    efeito:{apoio:2,bonusPorPartido:{esq:13,ind:5,centro:3},polarizacao:2,fiscal:170,riscos:{tcu:3,implementacao:4},efeitosLei:{popularidade:1,orcamento:-80}},
    custo:{capital:2,poder:1}, grupo:'social'
  },
  {
    id:'rastreabilidade_ambiental', titulo:'Rastreabilidade socioambiental',
    descricao:'Acrescenta critérios de rastreabilidade, transparência territorial e mitigação para cadeias produtivas sensíveis.',
    autorId:'pres_meioamb', alvoPartido:'ind',
    aplica:(lei)=>['ambiental','agro','infraestrutura','geopolitica'].includes(lei.categoria)||hasAny(lei.tags,['mineracao','licenciamento','clima','exportacao']),
    efeito:{apoio:1,bonusPorPartido:{ind:9,esq:8,centro:3,dir:-2},polarizacao:0,fiscal:55,riscos:{stf:-10,federativo:-4,implementacao:5},efeitosLei:{imagemExterna:1}},
    custo:{capital:1,poder:1}, grupo:'ambiental'
  },
  {
    id:'seguranca_operacional', titulo:'Protocolo nacional de execução e segurança',
    descricao:'Define competências, interoperabilidade, treinamento e padrões operacionais para reduzir falhas na implementação.',
    autorId:'pres_seguranca', alvoPartido:'dir',
    aplica:(lei)=>['seguranca','digital','geopolitica'].includes(lei.categoria)||hasAny(lei.tags,['defesa','ciberseguranca','dados']),
    efeito:{apoio:2,bonusPorPartido:{dir:11,centro:5,ind:3},polarizacao:1,fiscal:80,riscos:{implementacao:-12,stf:2},efeitosLei:{}},
    custo:{capital:1,poder:1}, grupo:'operacional'
  },
  {
    id:'prazo_expiracao', titulo:'Cláusula de expiração',
    descricao:'Determina que dispositivos mais controversos percam eficácia se não forem renovados após avaliação de resultados.',
    autorId:'lider_ind', alvoPartido:'ind',
    aplica:(lei)=>(lei.polarizacao||0)>=60||(lei.riscosControle?.stf||0)>=60,
    efeito:{apoio:2,bonusPorPartido:{ind:11,centro:8,dir:4},polarizacao:-9,fiscal:0,riscos:{stf:-7,implementacao:-3},efeitosLei:{}},
    custo:{capital:1,poder:2}, grupo:'expiracao'
  },
];

const relevance=(tipo,lei)=>{
  if(!tipo.aplica(lei)) return -999;
  let score=10;
  if(tipo.alvoPartido) score += Math.max(0,55-(lei.afinidade?.[tipo.alvoPartido]??50))/4;
  if(tipo.id==='transparencia_controle') score+=(lei.riscosControle?.tcu||0)/10;
  if(tipo.id==='prazo_expiracao') score+=(lei.polarizacao||0)/10;
  if(tipo.id==='repasse_federativo') score+=(lei.riscosControle?.federativo||0)/10;
  return score;
};

const pickSponsor=(tipo,atores=[],fallbackParty=null)=>byId(atores,tipo.autorId)||atores.find(a=>a.partidoId===(fallbackParty||tipo.alvoPartido))||atores[0]||null;

const materialize=(tipo,{lei,atores,turno,index=0,origem='congresso'})=>{
  const autor=pickSponsor(tipo,atores);
  return {
    id:`emd_${tipo.id}_${turno}_${index}_${Math.random().toString(36).slice(2,7)}`,
    tipoId:tipo.id,
    titulo:tipo.titulo,
    descricao:tipo.descricao,
    origem,
    autor:autor?{id:autor.id,nome:autor.nome,cargo:autor.cargo,partidoId:autor.partidoId,uf:autor.uf}:null,
    status:'pendente',
    criadaNoTurno:turno,
    alvoPartido:tipo.alvoPartido,
    grupo:tipo.grupo,
    efeito:JSON.parse(JSON.stringify(tipo.efeito)),
    custo:{...tipo.custo},
    negociacao:null,
  };
};

export const gerarEmendasIniciais=({lei,atores=[],turno=1,origemProjeto='executivo'})=>{
  const ranked=EMENDAS_TIPOS
    .map(tipo=>({tipo,score:relevance(tipo,lei)}))
    .filter(x=>x.score>-100)
    .sort((a,b)=>b.score-a.score);
  const limite=(lei.polarizacao||0)>=70?4:3;
  const chosen=[];
  for(const entry of ranked){
    if(chosen.some(e=>e.tipo.grupo===entry.tipo.grupo)) continue;
    chosen.push(entry);
    if(chosen.length>=limite) break;
  }
  return chosen.map((entry,index)=>materialize(entry.tipo,{lei,atores,turno,index,origem:origemProjeto==='governadores'?'camara':'congresso'}));
};

export const gerarEmendaAdicional=({lei,proposta,atores=[],turno=1})=>{
  const existentes=new Set((proposta.emendas||[]).map(e=>e.tipoId));
  const candidates=EMENDAS_TIPOS.filter(t=>!existentes.has(t.id)&&t.aplica(lei));
  if(!candidates.length) return null;
  const tipo=candidates.sort((a,b)=>relevance(b,lei)-relevance(a,lei))[0];
  return materialize(tipo,{lei,atores,turno,index:(proposta.emendas||[]).length,origem:'congresso'});
};

export const emendasResumo=(proposta={})=>{
  const emendas=proposta.emendas||[];
  return {
    total:emendas.length,
    pendentes:emendas.filter(e=>e.status==='pendente').length,
    aceitas:emendas.filter(e=>['aceita','aceita_negociada','incorporada_governo'].includes(e.status)).length,
    rejeitadas:emendas.filter(e=>['rejeitada','prejudicada'].includes(e.status)).length,
    versao:proposta.versaoTexto||1,
    impactoFiscal:proposta.impactoFiscalEmendas||0,
  };
};

const mergeBonus=(base={},delta={},factor=1)=>{
  const out={...base};
  Object.entries(delta||{}).forEach(([k,v])=>{out[k]=clamp((out[k]||0)+v*factor,-30,30);});
  return out;
};

const mergeEffects=(base={},delta={},factor=1)=>{
  const out={...base};
  Object.entries(delta||{}).forEach(([k,v])=>{out[k]=(out[k]||0)+v*factor;});
  return out;
};

const applyRiskDelta=(base={},delta={},factor=1)=>{
  const out={...base};
  ['stf','tcu','federativo','implementacao'].forEach(k=>{out[k]=clamp((out[k]||0)+(delta?.[k]||0)*factor);});
  return out;
};

const incorporatedStatuses=new Set(['aceita','aceita_negociada','incorporada_governo']);

export const deliberarEmenda=({proposta,lei,emendaId,decisao,turno=1})=>{
  const original=(proposta.emendas||[]).find(e=>e.id===emendaId);
  if(!original) return {ok:false,motivo:'Emenda não encontrada.'};
  if(original.status!=='pendente') return {ok:false,motivo:'Esta emenda já foi deliberada.'};
  if(!['aceitar','contrapropor','rejeitar'].includes(decisao)) return {ok:false,motivo:'Decisão inválida.'};

  const factor=decisao==='contrapropor'?.55:decisao==='aceitar'?1:0;
  const custos=decisao==='rejeitar'?{capital:0,poder:0}:decisao==='contrapropor'?{capital:1,poder:2}:{capital:original.custo?.capital||0,poder:original.custo?.poder||0};
  const status=decisao==='aceitar'?'aceita':decisao==='contrapropor'?'aceita_negociada':'rejeitada';
  let emendas=(proposta.emendas||[]).map(e=>e.id===emendaId?{...e,status,decididaNoTurno:turno,negociacao:decisao==='contrapropor'?'Texto reduzido e contrapartidas intermediárias acordadas.':null}:e);
  let apoioBonus=proposta.apoioBonus||0;
  let bonusPorPartido={...(proposta.bonusPorPartido||{})};
  let polarizacaoAtual=proposta.polarizacaoAtual??lei.polarizacao??40;
  let riscosTexto={...(proposta.riscosTexto||lei.riscosControle||{})};
  let impactoFiscal=proposta.impactoFiscalEmendas||0;
  let modificadoresEfeitos={...(proposta.modificadoresEfeitos||{})};
  let versaoTexto=proposta.versaoTexto||1;
  let alteracoes=[...(proposta.alteracoesTexto||[])];
  let historico=[...(proposta.historico||[])];

  if(decisao==='rejeitar'){
    const partido=original.autor?.partidoId||original.alvoPartido;
    if(partido) bonusPorPartido=mergeBonus(bonusPorPartido,{[partido]:-5});
    polarizacaoAtual=clamp(polarizacaoAtual+2);
    historico.unshift({turno,tipo:'emenda',texto:`Emenda “${original.titulo}” rejeitada. ${original.autor?.nome||'A bancada autora'} reage à decisão.`});
  }else{
    apoioBonus+=Math.round((original.efeito?.apoio||0)*factor);
    bonusPorPartido=mergeBonus(bonusPorPartido,original.efeito?.bonusPorPartido||{},factor);
    polarizacaoAtual=clamp(polarizacaoAtual+(original.efeito?.polarizacao||0)*factor);
    riscosTexto=applyRiskDelta(riscosTexto,original.efeito?.riscos||{},factor);
    impactoFiscal+=Math.round((original.efeito?.fiscal||0)*factor);
    modificadoresEfeitos=mergeEffects(modificadoresEfeitos,original.efeito?.efeitosLei||{},factor);
    versaoTexto+=1;
    alteracoes.unshift({turno,versao:versaoTexto,emendaId:original.id,titulo:original.titulo,modo:decisao==='aceitar'?'integral':'negociada',autor:original.autor?.nome||'Congresso'});
    historico.unshift({turno,tipo:'emenda',texto:`${decisao==='aceitar'?'Emenda incorporada':'Contraproposta fechada'}: ${original.titulo}. Texto passa à versão ${versaoTexto}.`});
    // emendas do mesmo grupo tornam-se prejudicadas depois de uma solução incorporada
    emendas=emendas.map(e=>e.id!==emendaId&&e.status==='pendente'&&e.grupo===original.grupo?{...e,status:'prejudicada',decididaNoTurno:turno}:e);
  }

  const aceitas=emendas.filter(e=>incorporatedStatuses.has(e.status)).length;
  const textoBase=aceitas>=2?'Substitutivo negociado':aceitas===1?'Texto com emenda incorporada':'Texto original';
  return {ok:true,custos,decisao,emenda:original,proposta:{...proposta,emendas,apoioBonus,bonusPorPartido,polarizacaoAtual,riscosTexto,impactoFiscalEmendas:impactoFiscal,modificadoresEfeitos,versaoTexto,alteracoesTexto:alteracoes,textoBase,historico}};
};

export const AJUSTES_GOVERNO = [
  {id:'fiscal',titulo:'Salvaguarda fiscal do governo',tipoId:'ancora_fiscal'},
  {id:'transicao',titulo:'Transição negociada pelo Planalto',tipoId:'transicao_gradual'},
  {id:'governanca',titulo:'Governança e revisão periódica',tipoId:'clausula_revisao'},
  {id:'federativo',titulo:'Pacto federativo de execução',tipoId:'repasse_federativo'},
];

export const incorporarAjusteGoverno=({proposta,lei,atores=[],tipoId,turno=1})=>{
  const preset=AJUSTES_GOVERNO.find(x=>x.id===tipoId);
  if(!preset) return {ok:false,motivo:'Ajuste do governo inválido.'};
  const tipo=EMENDAS_TIPOS.find(t=>t.id===preset.tipoId);
  if(!tipo||!tipo.aplica(lei)) return {ok:false,motivo:'Esse ajuste não se aplica a esta matéria.'};
  if((proposta.emendas||[]).some(e=>e.tipoId===tipo.id&&incorporatedStatuses.has(e.status))) return {ok:false,motivo:'Esse eixo já foi incorporado ao texto.'};
  const lider=byId(atores,'lider_governo')||atores[0]||null;
  const emenda={...materialize(tipo,{lei,atores:[lider].filter(Boolean),turno,index:(proposta.emendas||[]).length,origem:'governo'}),id:`emd_gov_${tipo.id}_${turno}_${Math.random().toString(36).slice(2,7)}`,status:'pendente',titulo:preset.titulo};
  const propostaComEmenda={...proposta,emendas:[...(proposta.emendas||[]),emenda]};
  const result=deliberarEmenda({proposta:propostaComEmenda,lei,emendaId:emenda.id,decisao:'contrapropor',turno});
  if(!result.ok)return result;
  result.proposta.emendas=result.proposta.emendas.map(e=>e.id===emenda.id?{...e,status:'incorporada_governo',origem:'governo'}:e);
  result.custos={capital:2,poder:3};
  result.emenda={...emenda,status:'incorporada_governo'};
  result.proposta.historico=[{turno,tipo:'emenda_governo',texto:`Bancada do governo incorpora ajuste: ${preset.titulo}.`},...(result.proposta.historico||[])];
  return result;
};

export const consolidarTextoFinal=(proposta,lei)=>({
  versao:proposta.versaoTexto||1,
  rotulo:proposta.textoBase||'Texto original',
  alteracoes:proposta.alteracoesTexto||[],
  riscos:{...(lei.riscosControle||{}),...(proposta.riscosTexto||{})},
  impactoFiscal:proposta.impactoFiscalEmendas||0,
  modificadoresEfeitos:proposta.modificadoresEfeitos||{},
});
