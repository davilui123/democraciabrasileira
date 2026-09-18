import { modeloExecucaoPorId, fonteProgramaPorId, governancaProgramaPorId } from '../data/seed/programasGovernamentais.js';
import { STATUS_LEI_VIGENTE } from './legalControlEngine.js';

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));

export const REGULAMENTACAO_INICIAL={
  capacidadeMax:2,
  capacidadeRestante:2,
  processos:[],
  historico:[],
  ultimoResetTurno:1,
};

const CATEGORY_PROGRAM={
  economia:{area:'Economia',icone:'📈',ministerios:['m_fazenda','m_casacivil'],fiscalTipo:'produtivo',budget:520,duracao:18,grupos:{mercado:2,sindicalistas:.5,periferia:.5},macro:{crescimentoPib:.025,desemprego:-.015},metas:[['Empresas alcançadas',12000,' un.'],['Investimento mobilizado',45,' bi'],['Ganho de produtividade',7,'%']]},
  tributacao:{area:'Tributação',icone:'🧾',ministerios:['m_fazenda','m_casacivil'],fiscalTipo:'custeio',budget:320,duracao:15,grupos:{mercado:.5,periferia:1,sindicalistas:.5},macro:{crescimentoPib:.008,desemprego:-.004},metas:[['Contribuintes adaptados',80,'%'],['Sistemas integrados',27,' UFs'],['Contencioso reduzido',12,'%']]},
  trabalho:{area:'Trabalho',icone:'👷',ministerios:['m_fazenda','m_social','m_casacivil'],fiscalTipo:'humano',budget:420,duracao:18,grupos:{sindicalistas:2,periferia:1,mercado:-.5},macro:{crescimentoPib:.01,desemprego:-.025},metas:[['Trabalhadores alcançados',3.5,' mi'],['Empresas aderentes',35,' mil'],['Formalização adicional',6,'%']]},
  saude:{area:'Saúde',icone:'🩺',ministerios:['m_saude','m_fazenda','m_casacivil'],fiscalTipo:'saude',budget:760,duracao:24,grupos:{periferia:3,sindicalistas:1,universitarios:1},macro:{crescimentoPib:.012,desemprego:-.01},metas:[['Cobertura pactuada',90,'%'],['Municípios integrados',4200,''],['Entregas assistenciais',8,' mi']]},
  educacao:{area:'Educação',icone:'🎓',ministerios:['m_educacao','m_fazenda','m_ciencia'],fiscalTipo:'educacao',budget:680,duracao:24,grupos:{universitarios:3,periferia:2,sindicalistas:1},macro:{crescimentoPib:.018,desemprego:-.012},metas:[['Redes aderentes',24,' UFs'],['Beneficiários',2.5,' mi'],['Metas educacionais',75,'%']]},
  seguranca:{area:'Segurança',icone:'🛡️',ministerios:['m_justica','m_casacivil','m_fazenda'],fiscalTipo:'custeio',budget:590,duracao:21,grupos:{militares:2,evangelicos:1,periferia:.5},macro:{crescimentoPib:.005,desemprego:0},metas:[['Estados integrados',22,' UFs'],['Operações coordenadas',120,''],['Indicadores prioritários',70,'%']]},
  sociedade:{area:'Social',icone:'🤝',ministerios:['m_social','m_casacivil','m_fazenda'],fiscalTipo:'humano',budget:620,duracao:24,grupos:{periferia:3,sindicalistas:1,evangelicos:.5},macro:{crescimentoPib:.01,desemprego:-.012},metas:[['Pessoas alcançadas',4,' mi'],['Municípios aderentes',3000,''],['Cobertura da política',78,'%']]},
  ambiental:{area:'Meio Ambiente',icone:'🌱',ministerios:['m_meioamb','m_fazenda','m_agro'],fiscalTipo:'infraestrutura',budget:560,duracao:24,grupos:{universitarios:2,mercado:1,agro:-.5},macro:{crescimentoPib:.015,desemprego:-.008},metas:[['Projetos habilitados',850,''],['Área monitorada',65,'%'],['Investimento verde',30,' bi']]},
  agro:{area:'Agricultura',icone:'🌾',ministerios:['m_agro','m_fazenda','m_transp'],fiscalTipo:'produtivo',budget:630,duracao:21,grupos:{agro:3,mercado:1,periferia:.5},macro:{crescimentoPib:.025,desemprego:-.008},metas:[['Produtores alcançados',420,' mil'],['Estados pactuados',18,' UFs'],['Capacidade produtiva',8,'%']]},
  infraestrutura:{area:'Infraestrutura',icone:'🏗️',ministerios:['m_casacivil','m_transp','m_fazenda'],fiscalTipo:'infraestrutura',budget:980,duracao:30,grupos:{mercado:2,periferia:2,agro:1},macro:{crescimentoPib:.04,desemprego:-.03},metas:[['Projetos contratados',85,''],['Investimento mobilizado',110,' bi'],['Entregas concluídas',70,'%']]},
  digital:{area:'Tecnologia',icone:'💻',ministerios:['m_ciencia','m_fazenda','m_casacivil'],fiscalTipo:'tecnologia',budget:510,duracao:20,grupos:{universitarios:3,mercado:2,periferia:.5},macro:{crescimentoPib:.028,desemprego:-.012},metas:[['Serviços integrados',160,''],['Empresas aderentes',9000,''],['Cobertura digital',82,'%']]},
  institucional:{area:'Instituições',icone:'🏛️',ministerios:['m_casacivil','m_justica','m_fazenda'],fiscalTipo:'custeio',budget:280,duracao:15,grupos:{mercado:.5,universitarios:1},macro:{crescimentoPib:.004,desemprego:0},metas:[['Órgãos adaptados',90,'%'],['Normas publicadas',24,''],['Transparência operacional',85,'%']]},
  geopolitica:{area:'Relações Exteriores',icone:'🌐',ministerios:['m_exteriores','m_fazenda','m_defesa'],fiscalTipo:'produtivo',budget:430,duracao:18,grupos:{mercado:1,agro:1,militares:1},macro:{crescimentoPib:.018,desemprego:-.006},metas:[['Acordos operacionais',8,''],['Empresas beneficiadas',4500,''],['Parcerias estratégicas',6,'']]},
};

const RITMOS={
  acelerado:{id:'acelerado',nome:'100 dias',descricao:'Publicação rápida e forte coordenação da Casa Civil.',eficiencia:10,risco:11,custo:1.10,implantacao:1,cp:2},
  equilibrado:{id:'equilibrado',nome:'Implantação equilibrada',descricao:'Entrega, controle e coordenação caminham juntos.',eficiencia:3,risco:0,custo:1,implantacao:2,cp:1},
  cauteloso:{id:'cauteloso',nome:'Blindagem institucional',descricao:'Mais consultas, pilotos e testes antes da escala.',eficiencia:-5,risco:-14,custo:.94,implantacao:3,cp:0},
};
export const ritmosRegulamentacao=Object.values(RITMOS);

const ESCALAS={
  piloto:{id:'piloto',nome:'Piloto focalizado',descricao:'Começa menor, aprende rápido e limita exposição fiscal.',budget:.55,duracao:.8,eficiencia:5,risco:-8,cp:0},
  estruturante:{id:'estruturante',nome:'Escala estruturante',descricao:'Cobertura relevante com expansão em ondas.',budget:1,duracao:1,eficiencia:2,risco:0,cp:1},
  nacional:{id:'nacional',nome:'Mobilização nacional',descricao:'Entrega ampla desde o início, com alto custo de coordenação.',budget:1.45,duracao:1.15,eficiencia:8,risco:12,cp:3},
};
export const escalasRegulamentacao=Object.values(ESCALAS);

export function calcularCapacidadeRegulatoria(state={}){
  const nomes=new Set((state.nomeacoes||[]).map(n=>n.cargoId));
  let max=2;
  if(nomes.has('m_casacivil'))max+=1;
  if(nomes.has('m_justica'))max+=1;
  return clamp(max,2,4);
}

const vigente=(p)=>STATUS_LEI_VIGENTE.has(p?.status)&&p?.textoFinal?.vigencia!=='sem_vigencia';

export function sincronizarRegulamentacoes({regulamentacao=REGULAMENTACAO_INICIAL,votacoes=[],leis=[],turno=1}){
  const next={...REGULAMENTACAO_INICIAL,...(regulamentacao||{}),processos:[...(regulamentacao?.processos||[])],historico:[...(regulamentacao?.historico||[])]};
  const existing=new Set(next.processos.map(p=>p.propostaId));
  const leiMap=new Map((leis||[]).map(l=>[l.id,l]));
  const novos=[];
  for(const proposta of (votacoes||[])){
    if(!vigente(proposta)||existing.has(proposta.id))continue;
    const lei=leiMap.get(proposta.leiId);
    if(!lei?.regulamentacao?.necessaria)continue;
    const prazo=Math.max(2,Number(lei.regulamentacao.prazoTurnos||3));
    const proc={
      id:`reg_${proposta.id}`,propostaId:proposta.id,leiId:lei.id,tituloLei:lei.titulo,categoria:lei.categoria,
      status:'pendente',abertoNoTurno:turno,prazoTurnos:prazo,prazoNoTurno:turno+prazo,
      riscoInercia:Number(lei.regulamentacao.riscoInercia||40),etapasNormativas:[...(lei.regulamentacao.etapas||[])],
      programaSugerido:(lei.programasDerivados||[])[0]||`Programa de Implementação — ${lei.titulo}`,
      programasDerivados:[...(lei.programasDerivados||[])],textoVersao:proposta.textoFinal?.versao||proposta.versaoTexto||1,
      escolhas:null,progressoNormativo:0,mesesEmAtraso:0,programaId:null,
    };
    next.processos.unshift(proc); novos.push(proc); existing.add(proposta.id);
    next.historico.unshift({turno,tipo:'abertura',processoId:proc.id,leiId:lei.id,texto:`${lei.titulo} aguarda regulamentação para produzir sua capacidade operacional completa.`});
  }
  next.historico=next.historico.slice(0,100);
  return {regulamentacao:next,novos};
}

const stateRelations=(state,ufs)=>{
  const estados=state.estados||[];
  const alvo=ufs?.length?estados.filter(e=>ufs.includes(e.uf)):estados;
  return alvo.length?alvo.reduce((s,e)=>s+(e.relacaoPlanalto||50),0)/alvo.length:50;
};

export function simularRegulamentacao({processo,lei,config={},state={}}){
  const bp=CATEGORY_PROGRAM[lei?.categoria]||CATEGORY_PROGRAM.institucional;
  const ritmo=RITMOS[config.ritmo]||RITMOS.equilibrado;
  const escala=ESCALAS[config.escala]||ESCALAS.estruturante;
  const modelo=modeloExecucaoPorId(config.modeloExecucao||'federal');
  const fonte=fonteProgramaPorId(config.fonte||'tesouro');
  const gov=governancaProgramaPorId(config.governanca||'padrao');
  const ufs=config.territorio==='estados'?[...(config.ufs||[])]:[];
  const cobertura=config.territorio==='estados'?clamp(ufs.length/27,.08,1):1;
  const relacao=stateRelations(state,ufs);
  const ministerios=bp.ministerios||[];
  const nomeados=ministerios.filter(id=>(state.nomeacoes||[]).some(n=>n.cargoId===id)).length;
  const capacidadeMinisterial=ministerios.length?nomeados/ministerios.length:1;
  const baseRisco=Number(lei?.riscosControle?.implementacao||45);
  const risco=clamp(baseRisco*.45+18+ritmo.risco+escala.risco+(modelo.risco||0)+(gov.risco||0)+(1-capacidadeMinisterial)*16+Math.max(0,50-relacao)*.12,4,94);
  const eficiencia=clamp(48+ritmo.eficiencia+escala.eficiencia+(modelo.eficiencia||0)+(gov.eficiencia||0)+capacidadeMinisterial*14+(relacao-50)*.08,24,98);
  const baseBudget=bp.budget||500;
  const custoMensal=Math.round(baseBudget*escala.budget*ritmo.custo*(fonte.fatorFiscal||1)*(modelo.custoFederal||1)*(1+(gov.custo||0))*Math.max(.42,cobertura));
  const duracao=Math.max(9,Math.round((bp.duracao||18)*escala.duracao));
  const custoCapital=clamp(ritmo.cp+escala.cp+(config.territorio==='estados'&&ufs.length>12?1:0),0,7);
  const custoCapacidade=lei?.complexidade==='alta'?2:1;
  const nota=clamp(Math.round(eficiencia-risco*.32+(100-Math.min(100,custoMensal/(baseBudget*1.6)*100))*.08),0,100);
  return {bp,ritmo,escala,modelo,fonte,gov,ufs,cobertura,relacao,capacidadeMinisterial,risco,eficiencia,custoMensal,duracao,custoCapital,custoCapacidade,nota};
}

export function construirProgramaDerivado({processo,lei,config,state}){
  const sim=simularRegulamentacao({processo,lei,config,state});
  const bp=sim.bp;
  const nome=String(config.programaNome||processo.programaSugerido||`Implementação de ${lei.titulo}`).trim().slice(0,80);
  const metas=(bp.metas||[]).map(([n,m,u],i)=>({id:`meta_lei_${i}`,nome:n,meta:m,unidade:u,valor:0,peso:i===0?1.2:1}));
  return {
    id:`prog_lei_${lei.id}_${processo.propostaId}`,
    templateId:null,nome,area:bp.area,icone:bp.icone,descricao:`Programa criado pela regulamentação de “${lei.titulo}”. ${lei.eixoEstrategico||''}`.trim(),
    origem:'lei',derivadoDeLei:true,leiId:lei.id,leiOrigemId:lei.id,propostaOrigemId:processo.propostaId,regulamentacaoId:processo.id,
    ministerios:[...(bp.ministerios||[])],fiscalTipo:bp.fiscalTipo||'custeio',macro:{...(bp.macro||{})},grupos:{...(bp.grupos||{})},metas,
    territorio:config.territorio||'nacional',ufs:config.territorio==='estados'?[...(config.ufs||[])]:[],duracao:sim.duracao,
    orcamentoMensal:Math.round((bp.budget||500)*sim.escala.budget),modeloExecucao:config.modeloExecucao||'federal',fonte:config.fonte||'tesouro',governanca:config.governanca||'padrao',
    viaLegal:'lei_regulamentada',prioridade:config.prioridade||'media',status:'implantacao',implantacaoRestante:sim.ritmo.implantacao,
    progresso:0,qualidade:clamp(58+(sim.gov.risco<0?6:0)-Math.max(0,sim.risco-55)*.08,35,82),execucao:sim.eficiencia,riscoExecucao:sim.risco,
    custoFederalMensal:sim.custoMensal,custoTotalProjetado:sim.custoMensal*sim.duracao,gastoAcumulado:0,mesesExecutados:0,atrasoMeses:0,alertas:[],marcos:[],
    criadoNoTurno:state.turno||1,atualizadoNoTurno:state.turno||1,regulamentacao:{ritmo:config.ritmo||'equilibrado',escala:config.escala||'estruturante',nota:sim.nota},
  };
}

export function concluirRegulamentacao({regulamentacao,processoId,lei,config,state}){
  const reg={...REGULAMENTACAO_INICIAL,...regulamentacao,processos:[...(regulamentacao?.processos||[])],historico:[...(regulamentacao?.historico||[])]};
  const processo=reg.processos.find(p=>p.id===processoId);
  if(!processo)return {ok:false,motivo:'Processo de regulamentação não encontrado.'};
  if(processo.status==='regulamentada')return {ok:false,motivo:'Esta lei já foi regulamentada.'};
  if(config.territorio==='estados'&&!(config.ufs||[]).length)return {ok:false,motivo:'Escolha ao menos uma UF para a implantação territorial.'};
  const sim=simularRegulamentacao({processo,lei,config,state});
  if((reg.capacidadeRestante||0)<sim.custoCapacidade)return {ok:false,motivo:`A regulamentação exige ${sim.custoCapacidade} ponto(s) de capacidade normativa; restam ${reg.capacidadeRestante||0}.`};
  if((state.capitalPolitico||0)<sim.custoCapital)return {ok:false,motivo:`São necessários ${sim.custoCapital} pontos de Capital Político para sustentar este desenho.`};
  const programa=construirProgramaDerivado({processo,lei,config,state});
  reg.capacidadeRestante=Math.max(0,(reg.capacidadeRestante||0)-sim.custoCapacidade);
  reg.processos=reg.processos.map(p=>p.id===processoId?{...p,status:'regulamentada',regulamentadaNoTurno:state.turno,progressoNormativo:100,escolhas:{...config},programaId:programa.id,notaDesenho:sim.nota,riscoFinal:sim.risco,eficienciaFinal:sim.eficiencia,custoMensal:sim.custoMensal}:p);
  reg.historico.unshift({turno:state.turno,tipo:'regulamentada',processoId,leiId:lei.id,texto:`${lei.titulo} regulamentada; ${programa.nome} entra em implantação com nota de desenho ${sim.nota}/100.`});
  reg.historico=reg.historico.slice(0,100);
  return {ok:true,regulamentacao:reg,programa,sim,custoCapital:sim.custoCapital};
}

export function processarRegulamentacaoMensal({regulamentacao,state,leis=[],votacoes=[]}){
  const sync=sincronizarRegulamentacoes({regulamentacao,votacoes,leis,turno:state.turno+1});
  let reg=sync.regulamentacao;
  const max=calcularCapacidadeRegulatoria(state);
  const eventos=[];
  let perdaCapital=0;
  reg={...reg,capacidadeMax:max,capacidadeRestante:max,ultimoResetTurno:state.turno+1};
  reg.processos=reg.processos.map(p=>{
    if(p.status!=='pendente')return p;
    const atraso=Math.max(0,(state.turno+1)-(p.prazoNoTurno||999));
    if(!atraso)return p;
    const novoAtraso=Math.max(p.mesesEmAtraso||0,atraso);
    if(novoAtraso>(p.mesesEmAtraso||0)){
      const gravidade=clamp(Math.round((p.riscoInercia||40)+novoAtraso*8));
      if(gravidade>=55)perdaCapital+=1;
      eventos.push(`⏳ Regulamentação atrasada: ${p.tituloLei}. A lei existe, mas a capacidade de entrega segue incompleta.`);
      reg.historico.unshift({turno:state.turno+1,tipo:'atraso',processoId:p.id,leiId:p.leiId,texto:`Atraso de ${novoAtraso} mês(es) aumenta pressão política e risco de controle.`});
    }
    return {...p,mesesEmAtraso:novoAtraso,riscoInercia:clamp((p.riscoInercia||40)+4)};
  });
  reg.historico=reg.historico.slice(0,100);
  return {regulamentacao:reg,novos:sync.novos,eventos,perdaCapital:Math.min(4,perdaCapital)};
}
