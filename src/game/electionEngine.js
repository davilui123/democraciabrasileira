import {
  adversariosGovernadoresSeed,
  acoesCampanhaSeed,
  caciquesPartidariosSeed,
  calendarioEleitoral2026,
  eventosCaptacaoSeed,
  ofertasConvencaoSeed,
  partidosEleitoraisSeed,
  topicosDebateSeed,
  viceAtualPorPartido,
} from '../data/seed/eleicoes.js';

const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));
const iso=(date)=>new Date(date).toISOString().slice(0,10);
const party=(id)=>partidosEleitoraisSeed.find(p=>p.id===id)||partidosEleitoraisSeed[0];

const regionByUF={
  AC:'Norte',AP:'Norte',AM:'Norte',PA:'Norte',RO:'Norte',RR:'Norte',TO:'Norte',
  AL:'Nordeste',BA:'Nordeste',CE:'Nordeste',MA:'Nordeste',PB:'Nordeste',PE:'Nordeste',PI:'Nordeste',RN:'Nordeste',SE:'Nordeste',
  DF:'Centro-Oeste',GO:'Centro-Oeste',MT:'Centro-Oeste',MS:'Centro-Oeste',
  ES:'Sudeste',MG:'Sudeste',RJ:'Sudeste',SP:'Sudeste',
  PR:'Sul',RS:'Sul',SC:'Sul',
};

const ideologyDistance=(a='',b='')=>{
  const score=(v)=>String(v).includes('esquerda')?0:String(v).includes('direita')?2:1;
  return Math.abs(score(a)-score(b));
};

export const faseEleitoralPorData=(dateInput)=>{
  const d=iso(dateInput);
  if(d<'2026-01-01') return 'governo';
  if(d>='2026-10-01') return 'primeiro_turno';
  if(d>='2026-08-16') return 'campanha';
  if(d>='2026-08-06') return 'registro';
  if(d>='2026-07-20') return 'convencao';
  if(d>='2026-03-05'&&d<='2026-04-03') return 'janela_partidaria';
  return 'pre_campanha';
};

export const diasParaPrimeiroTurno=(dateInput)=>Math.max(0,Math.ceil((new Date('2026-10-04T12:00:00')-new Date(dateInput))/(1000*60*60*24)));

const buildGovernorRace=(estado)=>{
  const challenger=adversariosGovernadoresSeed.find(c=>c.uf===estado.uf);
  const inc=clamp(estado.governador?.popularidade??55);
  const undecided=24;
  const decided=100-undecided;
  const incumbent=Math.round(decided*(inc/100));
  const challengerPct=Math.max(8,decided-incumbent);
  return {
    uf:estado.uf,
    estado:estado.nome,
    regiao:estado.regiao,
    incumbent:{...estado.governador,id:`gov_${estado.uf}`,avatar:estado.governador?.avatar||`gov-${estado.uf.toLowerCase()}-${String(estado.governador?.nome||'governador').toLowerCase().replace(/\s+/g,'-')}`},
    challenger:{...challenger,id:`challenger_${estado.uf}`},
    pesquisa:{incumbent,challenger:challengerPct,indecisos:Math.max(0,100-incumbent-challengerPct)},
    apoioPresidencial:'neutro',
    intensidadeIA:35,
    historico:[],
    vencedor:null,
  };
};

const initialOpponent=(id,nome,origem,uf,ideologia,avatar,peso=50)=>({
  id,nome,origem,uf,ideologia,avatar,pesoEleitoral:peso,conhecimento:55,intencaoLatente:14,medido:0,recursos:20,focoEstados:[],estrategia:'construir_conhecimento',coerencia:78,ativo:true,
});

export const criarEstadoEleitoralInicial=({perfil={},estados=[]}={})=>{
  const partidoId=perfil.partidoId||'esq';
  const atual=viceAtualPorPartido[partidoId]||viceAtualPorPartido.esq;
  return {
    ano:2026,
    fase:'governo',
    partidoAtual:partidoId,
    filiacao:{partidoId,desde:'2022-01-01',mudancas:[],confirmada2026:false},
    candidatura:{status:'governo',oficializada:false,registro:false,desclassificado:false,motivo:null},
    viceAtual:{...atual,relacao:72,historico:[]},
    chapa:{titular:'presidente',viceId:null,vice:null,status:'em_formacao',equilibrio:50,risco:0},
    convencao:{apoioDelegados:28,apoios:[],compromissos:[],ofertasUsadas:[],realizada:false,oficializado:false,minimo:62},
    recursos:{caixa:8,fefcProjetado:party(partidoId).fundoBase,fefcLiberado:0,crowdfunding:0,doacoesIndividuais:0,gasto:0,prestacaoRisco:3,acoesCaptacao:[]},
    campanha:{energiaMax:3,energia:3,acoesMes:[],historico:[],mensagemCentral:'',estadoFoco:null},
    coerencia:86,
    autenticidade:82,
    posicoesPublicas:{...(perfil.eixos||{})},
    historicoPosicoes:[],
    reconhecimento:22,
    pesquisa:{indecisos:55,voce:0,adversarios:[],conhecimento:22,margemIncerteza:8,historico:[],ultimaAtualizacao:null},
    desinformacao:{usos:0,riscoJuridico:0,investigacoes:0,processoAtivo:false,desclassificado:false,historico:[]},
    adversarios:[
      initialOpponent('caio_valente','Caio Valente','Oposição nacional','MG','centro-direita','op-caio-valente',78),
      initialOpponent('isabela_ferraz','Isabela Ferraz','Governo de São Paulo','SP','centro-direita','gov-SP-Isabela-Ferraz',83),
      initialOpponent('augusto_vilela','Augusto Vilela','Governo de Minas Gerais','MG','centro-direita','gov-MG-Augusto-Vilela',76),
    ],
    candidaturasPersonagens:[],
    movimentosIA:[],
    corridasGovernadores:estados.map(buildGovernorRace),
    apoiosGovernadores:[],
    modificadoresEstados:{},
    debate:{realizado:false,rodadas:[],pontuacao:0,risco:0},
    resultado:null,
    segundoTurno:null,
    minigames:{convencao:false,vice:false,debate:false},
    calendario:calendarioEleitoral2026,
    noticiaMes:null,
  };
};

const actorCandidate=(actor,tipo,office,partyId)=>({
  id:`cand_${tipo}_${actor.id||actor.nome.replace(/\s+/g,'_')}`,
  personagemId:actor.id,
  nome:actor.nome,
  origem:tipo,
  cargoAtual:actor.cargo||actor.carreira||'Figura política',
  partidoId:actor.partidoId||partyId||'ind',
  uf:actor.uf||'DF',
  ambicao:actor.ambicao??40,
  popularidade:actor.popularidade??actor.influencia??50,
  office,
  status:'avaliando',
  avatar:actor.avatar||actor.avatarSeed||actor.id,
});

export const avaliarCandidaturasPersonagens=({nomeacoes=[],atoresCongresso=[],estados=[],turno=1,existentes=[]})=>{
  const map=new Map((existentes||[]).map(c=>[c.personagemId,c]));
  nomeacoes.forEach(m=>{
    const amb=m.ambicao??0,pop=m.popularidade??50;
    if(amb<58||pop<55)return;
    const office=amb>=84&&pop>=72?'presidencia':amb>=72?'governo_estadual':'senado';
    const cand=actorCandidate(m,'ministro',office,m.partidoId);
    map.set(m.id,{...map.get(m.id),...cand,status:turno>=39?'pre_candidato':'avaliando'});
  });
  atoresCongresso.forEach(a=>{
    const amb=a.ambicao??0,inf=a.influencia??50;
    if(amb<62||inf<60)return;
    const office=amb>=88&&inf>=85?'presidencia':amb>=78?'senado':'reeleicao_camara';
    const cand=actorCandidate(a,'camara',office,a.partidoId);
    map.set(a.id,{...map.get(a.id),...cand,status:turno>=39?'pre_candidato':'avaliando'});
  });
  estados.forEach(e=>{
    const g=e.governador||{}; const amb=g.ambicao??0,pop=g.popularidade??50;
    const office=amb>=83&&pop>=60?'presidencia':'governo_estadual';
    const cand=actorCandidate({...g,id:`gov_${e.uf}`,uf:e.uf},'governador',office,'ind');
    map.set(`gov_${e.uf}`,{...map.get(`gov_${e.uf}`),...cand,status:turno>=39?'pre_candidato':'avaliando'});
  });
  return [...map.values()];
};

const latentPlayerSupport=({estado,eleicao,gruposSociais={},perfil={},apoioGov})=>{
  const base=(estado.aprovacao??50)*0.52 + (eleicao.coerencia??80)*0.08 + (eleicao.autenticidade??80)*0.05;
  const groupAvg=Object.values(gruposSociais||{}).reduce((s,g)=>s+(g.aprovacao||50),0)/Math.max(1,Object.keys(gruposSociais||{}).length);
  let value=base+groupAvg*.12-8;
  if(perfil.ufOrigem===estado.uf)value+=4;
  if(eleicao.chapa?.vice?.uf===estado.uf)value+=3;
  if(apoioGov==='incumbent'&&(estado.governador?.relacao??50)>55)value+=2;
  if(apoioGov==='challenger')value+=1;
  value+=(eleicao.modificadoresEstados?.[estado.uf]||0);
  return clamp(value,8,62);
};

export const atualizarPesquisaEleitoral=({eleicao,estados=[],gruposSociais={},perfil={},oposicao={},forcarDescoberta=0,turno=1})=>{
  const conhecimento=clamp((eleicao.reconhecimento??22)+forcarDescoberta);
  const indecisos=clamp(66-conhecimento*.55,12,58);
  const races=eleicao.corridasGovernadores||[];
  const weights=estados.reduce((s,e)=>s+(e.eleitoradoPeso||1),0)||1;
  const latent=estados.reduce((s,e)=>{
    const race=races.find(r=>r.uf===e.uf);
    return s+latentPlayerSupport({estado:e,eleicao,gruposSociais,perfil,apoioGov:race?.apoioPresidencial})*(e.eleitoradoPeso||1);
  },0)/weights;
  const knownShare=(100-indecisos)/100;
  const player=Math.max(3,latent*knownShare);
  const active=(eleicao.adversarios||[]).filter(a=>a.ativo);
  const oppBase=Math.max(10,(oposicao.forca||34)*.55);
  const rawOpp=active.map((a,i)=>Math.max(3,(a.intencaoLatente||14)+(i===0?oppBase*.22:0)+(a.recursos||20)*.04));
  const pool=Math.max(5,100-indecisos-player);
  const sum=rawOpp.reduce((a,b)=>a+b,0)||1;
  const adversarios=active.map((a,i)=>({...a,medido:Number((pool*(rawOpp[i]/sum)).toFixed(1))}));
  const voce=Number(player.toFixed(1));
  const hist={turno,voce,indecisos:Number(indecisos.toFixed(1)),adversarios:adversarios.map(a=>({id:a.id,nome:a.nome,valor:a.medido})),conhecimento:Number(conhecimento.toFixed(1))};
  return {...eleicao,pesquisa:{...eleicao.pesquisa,voce,indecisos:Number(indecisos.toFixed(1)),adversarios,conhecimento:Number(conhecimento.toFixed(1)),margemIncerteza:Number((8-(conhecimento/100)*5).toFixed(1)),ultimaAtualizacao:turno,historico:[hist,...(eleicao.pesquisa?.historico||[])].slice(0,18)},reconhecimento:conhecimento,adversarios};
};

const targetStatesForAI=(estados,eleicao,opponent)=>{
  const sorted=[...estados].sort((a,b)=>{
    const pa=Math.abs((a.aprovacao??50)-50); const pb=Math.abs((b.aprovacao??50)-50);
    const homeA=a.uf===opponent.uf?-9:0,homeB=b.uf===opponent.uf?-9:0;
    return (pa+homeA)-(pb+homeB);
  });
  return sorted.slice(0,3).map(e=>e.uf);
};

export const processarIAEleitoral=({eleicao,estados=[],nomeacoes=[],atoresCongresso=[],turno=1,dataAtual})=>{
  let next={...eleicao};
  const fase=faseEleitoralPorData(dataAtual);
  const candidaturas=avaliarCandidaturasPersonagens({nomeacoes,atoresCongresso,estados,turno,existentes:next.candidaturasPersonagens});
  const movimentos=[];
  let adversarios=(next.adversarios||[]).map(a=>({...a}));
  if(fase!=='governo'){
    adversarios=adversarios.map(a=>{
      const foco=targetStatesForAI(estados,next,a);
      const leader=(next.pesquisa?.voce||0)>(a.medido||0)+4;
      const estrategia=leader?'concentrar_battleground':'ampliar_conhecimento';
      const recursos=Math.max(0,(a.recursos||20)-1);
      movimentos.push({turno,ator:a.nome,tipo:'campanha',texto:leader?`${a.nome} desloca equipe para ${foco.join(', ')} para conter sua liderança.`:`${a.nome} investe em conhecimento nacional e tenta abrir novos estados.`,foco});
      return {...a,focoEstados:foco,estrategia,recursos,conhecimento:clamp((a.conhecimento||55)+2),intencaoLatente:clamp((a.intencaoLatente||14)+(leader?.8:.35),5,45)};
    });
  }
  if(fase==='janela_partidaria'){
    const movable=atoresCongresso.filter(a=>(a.ambicao||0)>65&&(a.lealdade||50)<50);
    movable.slice(0,2).forEach(a=>movimentos.push({turno,ator:a.nome,tipo:'janela',texto:`${a.nome} negocia mudança de legenda durante a janela partidária.`,personagemId:a.id}));
  }
  return {...next,fase,adversarios,candidaturasPersonagens:candidaturas,movimentosIA:[...movimentos,...(next.movimentosIA||[])].slice(0,60),noticiaMes:movimentos[0]?.texto||null};
};

export const prepararVicePool=({eleicao,nomeacoes=[],atoresCongresso=[],estados=[]})=>{
  const current=eleicao.viceAtual?[{...eleicao.viceAtual,origem:'Vice atual',tipo:'vice_atual'}]:[];
  const govs=estados.filter(e=>(e.governador?.popularidade||0)>=58).sort((a,b)=>(b.governador?.ambicao||0)-(a.governador?.ambicao||0)).slice(0,3).map(e=>({id:`gov_${e.uf}`,nome:e.governador.nome,uf:e.uf,regiao:e.regiao,ideologia:e.governador.ideologia,popularidade:e.governador.popularidade,lealdade:clamp(100-Math.abs((e.governador.relacao||50)-60)),ambicao:e.governador.ambicao,pesoEleitoral:clamp((e.eleitoradoPeso||1)*7+35),risco:clamp((e.governador.ambicao||50)*.28),visibilidade:e.governador.popularidade,avatar:e.governador.avatar||`gov-${e.uf.toLowerCase()}-${e.governador.nome.toLowerCase().replace(/\s+/g,'-')}`,carreira:'Governador(a)',frase:e.governador.frase,agendaPessoal:e.governador.agendaPessoal,rede:e.governador.rede,vulnerabilidade:e.governador.vulnerabilidade,biografia:e.governador.biografia,origem:'Governador',tipo:'governador'}));
  const ministers=nomeacoes.filter(m=>(m.popularidade||0)>=65&&(m.habilidadePolitica||m.habPolitica||0)>=60).sort((a,b)=>(b.popularidade||0)-(a.popularidade||0)).slice(0,2).map(m=>({id:m.id,nome:m.nome,uf:m.uf||'DF',regiao:regionByUF[m.uf]||'Nacional',ideologia:m.ideologia||'centro',popularidade:m.popularidade||60,lealdade:m.lealdade||65,ambicao:m.ambicao||45,pesoEleitoral:clamp((m.popularidade||60)*.7),risco:clamp((m.riscoCorrupcao||10)+((m.ambicao||40)*.15)),visibilidade:m.popularidade||60,avatar:m.avatar||m.avatarSeed||m.id,carreira:m.carreira,frase:m.frase,agendaPessoal:m.agendaPessoal,rede:m.rede,vulnerabilidade:m.vulnerabilidade,biografia:m.biografia,origem:'Ministro',tipo:'ministro'}));
  const congress=atoresCongresso.filter(a=>(a.influencia||0)>=75).sort((a,b)=>(b.relacao||0)-(a.relacao||0)).slice(0,2).map(a=>({id:a.id,nome:a.nome,uf:a.uf,regiao:regionByUF[a.uf]||'Nacional',ideologia:a.perfil||'centro',popularidade:a.influencia||60,lealdade:a.lealdade||45,ambicao:a.ambicao||60,pesoEleitoral:clamp((a.influencia||70)*.72),risco:a.risco||15,visibilidade:a.influencia||60,avatar:a.avatar||a.avatarSeed||a.id,carreira:a.cargo,frase:a.frase,agendaPessoal:a.agendaPessoal,rede:a.rede,vulnerabilidade:a.vulnerabilidade,biografia:a.biografia,origem:'Congresso',tipo:'congresso'}));
  const unique=new Map([...current,...govs,...ministers,...congress].map(v=>[v.id,v]));
  return [...unique.values()].slice(0,7);
};

export const calcularViceFit=(vice,perfil,eleicao)=>{
  const p=party(eleicao.partidoAtual);
  const ideol=ideologyDistance(vice.ideologia,p.ideologia);
  const regional=vice.uf&&vice.uf!==perfil.ufOrigem?10:2;
  const score=clamp((vice.pesoEleitoral||50)*.36+(vice.lealdade||50)*.22+(vice.popularidade||50)*.2+regional-ideol*6-(vice.risco||0)*.14);
  return {score:Number(score.toFixed(0)),regional,ideol,ofusca:(vice.visibilidade||0)>(eleicao.reconhecimento||30)+30,risco:vice.risco||0};
};

export const aplicarOfertaConvencao=(eleicao,caciqueId,ofertaId)=>{
  const cacique=caciquesPartidariosSeed.find(c=>c.id===caciqueId);
  const offer=ofertasConvencaoSeed[ofertaId];
  if(!cacique||!offer||cacique.partidoId!==eleicao.partidoAtual)return {ok:false,motivo:'Oferta incompatível com sua convenção.'};
  if((eleicao.convencao.apoios||[]).some(a=>a.caciqueId===caciqueId))return {ok:false,motivo:'Este grupo já recebeu sua proposta final.'};
  if((eleicao.recursos.caixa||0)<offer.custo)return {ok:false,motivo:'Recursos pré-eleitorais insuficientes.'};
  const fit=cacique.ofertas.includes(ofertaId)?1:.55;
  const apoio=clamp(cacique.apoioInicial+offer.apoio*fit+(eleicao.coerencia-50)*.08);
  const accepted=apoio>=54;
  const delta=accepted?Math.round(cacique.influencia*.11):Math.round(cacique.influencia*.025);
  const next={...eleicao,
    coerencia:clamp(eleicao.coerencia+offer.coerencia),
    recursos:{...eleicao.recursos,caixa:Math.max(0,eleicao.recursos.caixa-offer.custo)},
    convencao:{...eleicao.convencao,apoioDelegados:clamp(eleicao.convencao.apoioDelegados+delta),apoios:[...(eleicao.convencao.apoios||[]),{caciqueId,ofertaId,accepted,apoio}],compromissos:[...(eleicao.convencao.compromissos||[]),{caciqueId,ofertaId,nome:offer.nome,risco:offer.risco}],ofertasUsadas:[...(eleicao.convencao.ofertasUsadas||[]),ofertaId]},
  };
  return {ok:true,accepted,apoio,eleicao:next,cacique,offer};
};

export const finalizarConvencao=(eleicao)=>{
  const apoio=eleicao.convencao?.apoioDelegados||0;
  if(apoio<(eleicao.convencao?.minimo||62))return {ok:false,motivo:`Você tem ${apoio}% dos delegados. A candidatura ainda não está garantida.`};
  return {ok:true,eleicao:{...eleicao,convencao:{...eleicao.convencao,realizada:true,oficializado:true},candidatura:{...eleicao.candidatura,status:'oficializada',oficializada:true},chapa:{...eleicao.chapa,status:eleicao.chapa.vice?'oficializada':'aguarda_vice'}}};
};

export const mudarFiliacaoEleitoral=(eleicao,partidoId,dataAtual)=>{
  const d=iso(dataAtual);
  if(d>'2026-04-04')return {ok:false,motivo:'O prazo de filiação para esta eleição já terminou.'};
  if(partidoId===eleicao.partidoAtual)return {ok:false,motivo:'Você já está filiado a este partido.'};
  const old=party(eleicao.partidoAtual),novo=party(partidoId);
  const distance=ideologyDistance(old.ideologia,novo.ideologia);
  const perda=8+distance*8;
  return {ok:true,eleicao:{...eleicao,partidoAtual:partidoId,filiacao:{partidoId,desde:d,confirmada2026:true,mudancas:[{de:eleicao.partidoAtual,para:partidoId,data:d},...(eleicao.filiacao?.mudancas||[])]},coerencia:clamp(eleicao.coerencia-perda),autenticidade:clamp(eleicao.autenticidade-perda*.7),convencao:{...eleicao.convencao,apoioDelegados:24,apoios:[],compromissos:[],ofertasUsadas:[]},recursos:{...eleicao.recursos,fefcProjetado:novo.fundoBase}}};
};

export const executarCaptacao=(eleicao,id,{reputacaoDigital=50,relacaoGovernadores=50,dataAtual='2026-01-01'}={})=>{
  const evt=eventosCaptacaoSeed.find(e=>e.id===id); if(!evt)return {ok:false,motivo:'Evento inexistente.'};
  if(iso(dataAtual)<evt.libera)return {ok:false,motivo:`Esta modalidade só abre em ${evt.libera.split('-').reverse().join('/')}.`};
  if(id==='fundo_eleitoral'&&!eleicao.convencao?.oficializado)return {ok:false,motivo:'A cota presidencial do fundo depende da candidatura oficializada pelo partido.'};
  let ganho=evt.base;
  if(id==='crowdfunding')ganho+=reputacaoDigital*.08+eleicao.coerencia*.04;
  if(id==='jantar_regional')ganho+=relacaoGovernadores*.05;
  if(id==='fundo_eleitoral')ganho+=Math.max(0,(eleicao.convencao.apoioDelegados-50)*.16);
  if(id==='doadores')ganho+=(eleicao.autenticidade||70)*.035;
  ganho=Math.round(ganho*10)/10;
  const recursos={...eleicao.recursos,caixa:Number(((eleicao.recursos.caixa||0)+ganho).toFixed(1)),prestacaoRisco:clamp((eleicao.recursos.prestacaoRisco||0)+evt.risco),acoesCaptacao:[{id,ganho},...(eleicao.recursos.acoesCaptacao||[])].slice(0,30)};
  if(id==='crowdfunding')recursos.crowdfunding=Number(((recursos.crowdfunding||0)+ganho).toFixed(1));
  if(id==='doadores'||id==='jantar_regional')recursos.doacoesIndividuais=Number(((recursos.doacoesIndividuais||0)+ganho).toFixed(1));
  if(id==='fundo_eleitoral'){recursos.fefcLiberado=Number(((recursos.fefcLiberado||0)+ganho).toFixed(1));}
  return {ok:true,ganho,eleicao:{...eleicao,recursos}};
};

export const executarAcaoEleitoral=(eleicao,acaoId,{uf=null,grupo=null,random=Math.random}={})=>{
  const acao=acoesCampanhaSeed.find(a=>a.id===acaoId);if(!acao)return {ok:false,motivo:'Ação eleitoral inexistente.'};
  if((eleicao.campanha.energia||0)<acao.energia)return {ok:false,motivo:'Agenda de campanha esgotada neste mês.'};
  if((eleicao.recursos.caixa||0)<acao.custo)return {ok:false,motivo:'Recursos de campanha insuficientes.'};
  let next={...eleicao,
    coerencia:clamp(eleicao.coerencia+(acao.efeito.coerencia||0)),
    autenticidade:clamp(eleicao.autenticidade+(acao.efeito.coerencia||0)*.5),
    reconhecimento:clamp(eleicao.reconhecimento+(acao.efeito.conhecimento||0)),
    recursos:{...eleicao.recursos,caixa:Math.max(0,eleicao.recursos.caixa-acao.custo),gasto:(eleicao.recursos.gasto||0)+acao.custo},
    campanha:{...eleicao.campanha,energia:eleicao.campanha.energia-acao.energia,acoesMes:[...(eleicao.campanha.acoesMes||[]),{id:acaoId,uf,grupo}],historico:[{id:acaoId,uf,grupo},...(eleicao.campanha.historico||[])].slice(0,50)}
  };
  let resultado='A ação teve efeito moderado.'; let juridico=false; let sucesso=true;
  if(acaoId==='desinformacao'){
    const usos=(eleicao.desinformacao?.usos||0)+1;
    const chanceSucesso=Math.max(.05,.22-(usos-1)*.04);
    sucesso=random()<chanceSucesso;
    const riscoInvestigacao=Math.min(.96,.12+Math.pow(usos-1,1.35)*.23);
    const investigada=random()<riscoInvestigacao;
    const riscoJuridico=clamp((eleicao.desinformacao?.riscoJuridico||0)+22+usos*8);
    const processoAtivo=(eleicao.desinformacao?.processoAtivo||false)||investigada;
    const desclassificado=usos>=4&&random()<Math.min(.95,.45+(usos-4)*.25) || riscoJuridico>=100&&random()<.55;
    next={...next,autenticidade:clamp(next.autenticidade-8),desinformacao:{...eleicao.desinformacao,usos,riscoJuridico,investigacoes:(eleicao.desinformacao?.investigacoes||0)+(investigada?1:0),processoAtivo,desclassificado,historico:[{usos,sucesso,investigada},...(eleicao.desinformacao?.historico||[])]},candidatura:{...eleicao.candidatura,desclassificado,status:desclassificado?'desclassificada':processoAtivo?'sob_investigacao':eleicao.candidatura.status,motivo:desclassificado?'Reincidência em ilícitos eleitorais simulados':eleicao.candidatura.motivo}};
    if(sucesso)next={...next,adversarios:(next.adversarios||[]).map((a,i)=>i===0?{...a,intencaoLatente:clamp(a.intencaoLatente-2.2)}:a)};
    juridico=investigada||desclassificado;
    resultado=desclassificado?'A Justiça Eleitoral desclassificou sua candidatura após reincidência.':investigada?'A operação vazou e abriu investigação eleitoral.':sucesso?'A ação produziu dano limitado ao adversário, mas elevou muito o risco jurídico.':'A ação falhou e deixou rastros políticos.';
  } else {
    if(acao.efeito.adversario)next={...next,adversarios:(next.adversarios||[]).map((a,i)=>i===0?{...a,intencaoLatente:clamp(a.intencaoLatente+acao.efeito.adversario)}:a)};
    if(uf){const delta=acaoId==='caravana'?3.2:acaoId==='contraste'?1.0:1.6;next={...next,modificadoresEstados:{...(next.modificadoresEstados||{}),[uf]:clamp((next.modificadoresEstados?.[uf]||0)+delta,-12,14)},campanha:{...next.campanha,estadoFoco:uf}};}
    resultado=`${acao.nome} executada${uf?` em ${uf}`:''}${grupo?` com foco em ${grupo}`:''}.`;
  }
  return {ok:true,eleicao:next,acao,resultado,juridico,sucesso};
};

export const escolherVice=(eleicao,vice,perfil)=>{
  if(!vice)return {ok:false,motivo:'Selecione um nome para a vice-presidência.'};
  const fit=calcularViceFit(vice,perfil,eleicao);
  return {ok:true,fit,eleicao:{...eleicao,chapa:{...eleicao.chapa,viceId:vice.id,vice:{...vice,relacao:vice.lealdade||60},equilibrio:fit.score,risco:fit.risco,status:eleicao.convencao?.oficializado?'oficializada':'em_formacao'},minigames:{...eleicao.minigames,vice:true}}};
};

export const apoiarCorridaEstadual=(eleicao,uf,lado)=>{
  const races=(eleicao.corridasGovernadores||[]).map(r=>r.uf===uf?{...r,apoioPresidencial:lado,historico:[{tipo:'apoio',lado},...(r.historico||[])]}:r);
  return {...eleicao,corridasGovernadores:races,apoiosGovernadores:[{uf,lado},...(eleicao.apoiosGovernadores||[]).filter(a=>a.uf!==uf)]};
};

export const resolverDebate=(eleicao,escolhas=[])=>{
  if(escolhas.length<3)return {ok:false,motivo:'Responda as três rodadas do debate.'};
  let score=0,coerencia=eleicao.coerencia,risco=0;
  const rodadas=topicosDebateSeed.map((t,i)=>{const op=t.opcoes.find(o=>o.id===escolhas[i])||t.opcoes[0];score+=op.ganho+(coerencia>70?.4:0);coerencia=clamp(coerencia+op.coerencia);risco+=op.risco;return {topico:t.id,opcao:op.id,texto:op.texto};});
  const ganho=Number(Math.max(-1,Math.min(4,score/3-1.2)).toFixed(1));
  return {ok:true,ganho,eleicao:{...eleicao,coerencia,autenticidade:clamp(eleicao.autenticidade+(coerencia-eleicao.coerencia)*.5),reconhecimento:clamp(eleicao.reconhecimento+8),debate:{realizado:true,rodadas,pontuacao:Number(score.toFixed(1)),risco},minigames:{...eleicao.minigames,debate:true}}};
};

export const processarCorridasGovernadores=(eleicao,estados=[],turno=1)=>{
  const races=(eleicao.corridasGovernadores||[]).map(r=>{
    const e=estados.find(x=>x.uf===r.uf); if(!e)return r;
    const govPop=e.governador?.popularidade??55;
    let inc=(r.pesquisa?.incumbent||38)+(govPop-50)*.04;
    let chal=(r.pesquisa?.challenger||38)+((100-govPop)-50)*.025;
    if(r.apoioPresidencial==='incumbent')inc+=((e.aprovacao||50)-45)*.04;
    if(r.apoioPresidencial==='challenger')chal+=((e.aprovacao||50)-45)*.035;
    const sum=inc+chal; const undec=Math.max(7,100-sum);
    return {...r,pesquisa:{incumbent:Number(inc.toFixed(1)),challenger:Number(chal.toFixed(1)),indecisos:Number(undec.toFixed(1))},intensidadeIA:clamp((r.intensidadeIA||35)+1.5)};
  });
  return {...eleicao,corridasGovernadores:races};
};

export const alterarPosicaoEleitoral=(eleicao,eixo,valor,perfil={})=>{
  const atual=eleicao.posicoesPublicas?.[eixo];
  if(!eixo||!valor||atual===valor)return {ok:false,motivo:'Escolha uma posição diferente da atual.'};
  const original=perfil.eixos?.[eixo];
  const flips=(eleicao.historicoPosicoes||[]).filter(h=>h.eixo===eixo).length;
  const distanciaOriginal=original&&valor!==original?1:0;
  const custo=4+flips*4+distanciaOriginal*3;
  return {ok:true,custo,eleicao:{...eleicao,posicoesPublicas:{...(eleicao.posicoesPublicas||{}),[eixo]:valor},historicoPosicoes:[{eixo,de:atual,para:valor},...(eleicao.historicoPosicoes||[])].slice(0,30),coerencia:clamp(eleicao.coerencia-custo),autenticidade:clamp(eleicao.autenticidade-custo*.7)}};
};

export const simularPrimeiroTurno=(eleicao)=>{
  if(eleicao.candidatura?.desclassificado)return {ok:false,motivo:'A candidatura está desclassificada.'};
  if(!eleicao.candidatura?.registro)return {ok:false,motivo:'A candidatura não possui registro válido.'};
  const undec=eleicao.pesquisa?.indecisos||20;
  const playerRaw=(eleicao.pesquisa?.voce||20)+(eleicao.coerencia-60)*.035+(eleicao.autenticidade-60)*.025+(Math.random()*3-1.5);
  const adv=(eleicao.pesquisa?.adversarios||[]).map(a=>({id:a.id,nome:a.nome,valor:Math.max(1,(a.medido||10)+(Math.random()*3-1.5))}));
  const raw=[{id:'presidente',nome:'Você',valor:Math.max(1,playerRaw)},...adv];
  const sum=raw.reduce((s,x)=>s+x.valor,0)||1;
  const validos=raw.map(x=>({...x,valor:Number((x.valor/sum*100).toFixed(1))})).sort((a,b)=>b.valor-a.valor);
  const voce=validos.find(x=>x.id==='presidente');
  if(voce?.valor>50){return {ok:true,eleito:true,eleicao:{...eleicao,fase:'encerrada',resultado:{turno:1,status:'eleito',validos,abstencaoSimulada:Number((8+undec*.08).toFixed(1))},candidatura:{...eleicao.candidatura,status:'eleito'}}};}
  const top2=validos.slice(0,2);
  const classificado=top2.some(x=>x.id==='presidente');
  return {ok:true,eleito:false,classificado,eleicao:{...eleicao,fase:classificado?'segundo_turno':'encerrada',resultado:{turno:1,status:classificado?'segundo_turno':'derrotado',validos,abstencaoSimulada:Number((8+undec*.08).toFixed(1))},segundoTurno:classificado?{adversario:top2.find(x=>x.id!=='presidente'),realizado:false}:null,candidatura:{...eleicao.candidatura,status:classificado?'segundo_turno':'derrotada'}}};
};

export const simularSegundoTurno=(eleicao)=>{
  if(eleicao.fase!=='segundo_turno'||!eleicao.segundoTurno?.adversario)return {ok:false,motivo:'Não há segundo turno presidencial em aberto.'};
  const adv=eleicao.segundoTurno.adversario;
  const base=(eleicao.pesquisa?.voce||35)+(eleicao.coerencia-50)*.05+(eleicao.autenticidade-50)*.04+(eleicao.chapa?.equilibrio||50)*.025;
  const your=Math.max(20,base+(Math.random()*4-2));
  const opp=Math.max(20,(adv.valor||40)+(Math.random()*4-2)+(100-(eleicao.coerencia||70))*.015);
  const sum=your+opp;
  const voce=Number((your/sum*100).toFixed(1));
  const outro=Number((100-voce).toFixed(1));
  const eleito=voce>outro;
  return {ok:true,eleito,eleicao:{...eleicao,fase:'encerrada',segundoTurno:{...eleicao.segundoTurno,realizado:true,resultado:{voce,adversario:outro}},resultado:{...(eleicao.resultado||{}),turno:2,status:eleito?'eleito':'derrotado',segundoTurno:{voce,adversario:{...adv,valor:outro}}},candidatura:{...eleicao.candidatura,status:eleito?'eleito':'derrotada'}}};
};

export const processarMesEleitoral=({eleicao,estados=[],gruposSociais={},perfil={},oposicao={},nomeacoes=[],atoresCongresso=[],turno=1,dataAtual})=>{
  const calculada=faseEleitoralPorData(dataAtual);
  const fase=['segundo_turno','encerrada'].includes(eleicao.fase)?eleicao.fase:calculada;
  let next={...eleicao,fase,campanha:{...eleicao.campanha,energia:eleicao.campanha?.energiaMax||3,acoesMes:[]}};
  if(next.chapa?.vice?.uf&&fase!=='governo'){
    next={...next,modificadoresEstados:{...(next.modificadoresEstados||{}),[next.chapa.vice.uf]:clamp((next.modificadoresEstados?.[next.chapa.vice.uf]||0)+.45,-12,14)}};
  }
  next=processarIAEleitoral({eleicao:next,estados,nomeacoes,atoresCongresso,turno,dataAtual});
  next=processarCorridasGovernadores(next,estados,turno);
  if(fase!=='governo'){
    let descoberta=2;
    if(fase==='campanha')descoberta=6;
    if(fase==='convencao'||fase==='registro')descoberta=4;
    next=atualizarPesquisaEleitoral({eleicao:next,estados,gruposSociais,perfil,oposicao,forcarDescoberta:descoberta,turno});
  }
  if(iso(dataAtual)>='2026-06-16'&&!next.recursos.fefcLiberado&&next.convencao?.oficializado){
    next={...next,recursos:{...next.recursos,fefcLiberado:Number((next.recursos.fefcProjetado*.55).toFixed(1)),caixa:Number(((next.recursos.caixa||0)+next.recursos.fefcProjetado*.55).toFixed(1))}};
  }
  if(iso(dataAtual)>='2026-08-15'&&!next.candidatura.desclassificado){
    if(next.convencao?.oficializado&&next.chapa?.vice){
      next={...next,candidatura:{...next.candidatura,registro:true,status:'registrada'}};
    }else{
      next={...next,candidatura:{...next.candidatura,registro:false,status:'registro_incompleto',motivo:!next.convencao?.oficializado?'Convenção não oficializou a candidatura':'Chapa sem vice no prazo de registro'}};
    }
  }
  if(next.desinformacao?.processoAtivo&&!next.candidatura.desclassificado){
    const p=Math.min(.72,(next.desinformacao.riscoJuridico||0)/145);
    if(Math.random()<p*.18){
      const dis=(next.desinformacao.usos||0)>=3&&Math.random()<.42;
      next={...next,candidatura:{...next.candidatura,desclassificado:dis,status:dis?'desclassificada':'sob_investigacao',motivo:dis?'Decisão simulada da Justiça Eleitoral por reincidência':'Investigação eleitoral em curso'},desinformacao:{...next.desinformacao,desclassificado:dis}};
    }
  }
  return next;
};

export const simularResultadoGovernadores=(eleicao)=>{
  return (eleicao.corridasGovernadores||[]).map(r=>{
    const inc=(r.pesquisa?.incumbent||40)+(Math.random()*4-2);
    const cha=(r.pesquisa?.challenger||40)+(Math.random()*4-2);
    return {...r,vencedor:inc>=cha?'incumbent':'challenger'};
  });
};

export const getElectionAction=(id)=>acoesCampanhaSeed.find(a=>a.id===id);
export const getParty=(id)=>party(id);
export { acoesCampanhaSeed, caciquesPartidariosSeed, eventosCaptacaoSeed, ofertasConvencaoSeed, partidosEleitoraisSeed, topicosDebateSeed };
