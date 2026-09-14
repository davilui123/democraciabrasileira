import { comunidadePulsoSeed } from '../data/seed/comunidadePulso.js';
import { midiasSeed } from '../data/seed/midias.js';
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
const TOPICOS=[
  ['economia',['economia','emprego','fiscal','dívida','divida','imposto','crescimento','juros']],
  ['saude',['saúde','saude','vacina','sus','hospital']],
  ['educacao',['educação','educacao','escola','universidade','professor']],
  ['seguranca',['segurança','seguranca','polícia','policia','crime']],
  ['agro',['agro','agricultura','campo','produtor']],
  ['defesa',['defesa','militar','forças armadas','forcas armadas','soberania']],
  ['social',['renda','pobreza','periferia','fome','moradia']],
  ['clima',['amazônia','amazonia','clima','meio ambiente','desmatamento']],
  ['cultura',['cinema','cultura','livro','arte']],
];
export function analisarTexto(texto=''){
  const t=texto.toLowerCase();const temas=TOPICOS.filter(([,ks])=>ks.some(k=>t.includes(k))).map(([id])=>id);
  const confronto=(t.match(/!/g)||[]).length + ['absurdo','mentira','irresponsável','irresponsavel','não aceitaremos'].filter(k=>t.includes(k)).length;
  const institucional=['diálogo','dialogo','responsabilidade','transparência','transparencia','dados','compromisso'].filter(k=>t.includes(k)).length;
  return {temas:temas.length?temas:['governo'],tom:clamp(50+confronto*8-institucional*3,0,100)};
}
export function impactoPost({texto,popularidade=50,resposta=false}){
  const a=analisarTexto(texto);const grupos={};
  if(a.temas.includes('social')){grupos.periferia=3;grupos.sindicalistas=1;grupos.mercado=-1;}
  if(a.temas.includes('economia')){grupos.mercado=2;grupos.periferia=a.tom>65?-1:1;}
  if(a.temas.includes('seguranca')){grupos.militares=2;grupos.evangelicos=1;grupos.universitarios=a.tom>65?-2:0;}
  if(a.temas.includes('educacao')){grupos.universitarios=3;grupos.sindicalistas=1;grupos.mercado=(grupos.mercado||0)-0.5;}
  if(a.temas.includes('agro')){grupos.agro=3;grupos.universitarios=-1;}
  if(a.temas.includes('defesa')){grupos.militares=3;grupos.universitarios=(grupos.universitarios||0)-1;}
  if(a.temas.includes('clima')){grupos.universitarios=3;grupos.agro=-1;}
  if(a.temas.includes('cultura')){grupos.universitarios=2;grupos.evangelicos=(grupos.evangelicos||0)-1;}
  if(a.tom>75){grupos.mercado=(grupos.mercado||0)-1;grupos.periferia=(grupos.periferia||0)+1;}
  const alcance=Math.round((1.2 + popularidade/35 + (resposta?0.8:0) + Math.min(1.8,texto.length/180))*1000000);
  return {analise:a,grupos,alcance};
}
export function gerarRepercussao({evento,turno}){
  const base=midiasSeed[(turno+(evento?.length||0))%midiasSeed.length];
  const texto=evento ? `${base.sigla}: ${String(evento).replace(/^[^\wÀ-ÿ]+/,'')}` : `${base.sigla}: o governo abre o mês sob novas pressões políticas.`;
  return {id:`midia_${turno}_${base.id}_${Date.now()}`,autorId:base.id,texto,tema:'governo',sentimento:base.tomBase,turno};
}

export function gerarConviteMidia({turno=1,popularidade=50}){
  // Convites são frequentes, mas não mensais: evita transformar a transição em checklist.
  if (turno % 2 !== 0) return null;
  const midia=midiasSeed[turno % midiasSeed.length];
  const formatos=midia.formatos||['Entrevista'];
  const formato=formatos[turno % formatos.length];
  const tensao=popularidade<40?'alta':popularidade>60?'favorável':'moderada';
  return {
    id:`convite_${turno}_${midia.id}`,
    midiaId:midia.id,
    midia:midia.nome,
    formato,
    alcance:midia.alcance,
    tensao,
    pergunta: popularidade<40
      ? 'O país está mais difícil de governar. Qual decisão sua merece continuar sendo defendida?'
      : 'Qual será a prioridade política que o governo pretende transformar em resultado nos próximos meses?',
  };
}


const frasesGrupo={
  universitarios:{bom:['Finalmente alguém falando de ciência e serviço público com alguma seriedade.','Isso tem impacto real em universidade, pesquisa e direitos.'],ruim:['O governo está simplificando um problema que precisava de evidência e transparência.','Bonito no discurso; quero ver dados e execução.']},
  periferia:{bom:['Se chegar no bairro de verdade, vai fazer diferença.','O que importa é emprego, posto funcionando e preço cabendo no bolso.'],ruim:['Aqui na ponta a conta sempre chega primeiro.','Muito anúncio e pouca mudança na vida de quem pega dois ônibus por dia.']},
  agro:{bom:['Previsibilidade e estrada valem mais que discurso. Essa decisão ajuda.','Quem produz precisa de regra clara e logística; ponto para o governo.'],ruim:['Brasília está esquecendo quem produz e exporta.','Essa conta vai parar no campo e depois no preço da comida.']},
  evangelicos:{bom:['Se proteger família, trabalho e segurança, tem nosso apoio.','Política pública precisa chegar às comunidades, não só à televisão.'],ruim:['O governo está falando para bolhas e esquecendo as famílias comuns.','Falta ouvir quem está nas igrejas e nos bairros todos os dias.']},
  sindicalistas:{bom:['Emprego e serviço público forte: é disso que estamos falando.','Quando o trabalhador participa da decisão, a política dura mais.'],ruim:['Querem ajuste nas costas de quem trabalha.','Sem negociação com trabalhadores, isso vai dar conflito.']},
  mercado:{bom:['A direção melhora previsibilidade e reduz prêmio de risco.','Se houver execução e governança, o investimento reage.'],ruim:['A conta fiscal não fecha só com boa intenção.','Intervenção sem regra clara cobra juros depois.']},
  militares:{bom:['Soberania e capacidade do Estado não são detalhes.','Decisão firme e cadeia de comando clara ajudam.'],ruim:['Improviso em tema estratégico custa caro.','Falta planejamento de Estado, não só reação política.']},
};

export function gerarPostsComunidade({gruposSociais={},turno=1,evento='',quantidade=4,respostaA=null}){
  const ordenados=[...comunidadePulsoSeed].sort((a,b)=>{
    const av=gruposSociais[a.grupo]?.aprovacao??50; const bv=gruposSociais[b.grupo]?.aprovacao??50;
    return Math.abs(bv-50)-Math.abs(av-50) || a.id.localeCompare(b.id);
  });
  return ordenados.slice(0,quantidade).map((p,i)=>{
    const aprov=gruposSociais[p.grupo]?.aprovacao??50;
    const positivo=aprov>=52;
    const banco=frasesGrupo[p.grupo]?.[positivo?'bom':'ruim']||['Estou acompanhando.'];
    const texto=banco[(turno+i)%banco.length];
    return {id:`com_${turno}_${p.id}_${i}`,autorId:p.id,autor:p.nome,handle:p.handle,grupo:p.grupo,uf:p.uf,ocupacao:p.ocupacao,avatar:p.avatar,texto:evento?`${texto} #${String(evento).replace(/[^\p{L}\p{N}]+/gu,'').slice(0,18)}`:texto,tema:'comunidade',tipo:'comentario',respostaA,sentimento:positivo?1:-1,alcance:Math.round((p.alcance||40)*12000+(Math.abs(aprov-50)*18000)),turno};
  });
}

export function calcularTendenciasPulso(posts=[],limite=6){
  const mapa=new Map();
  posts.slice(0,45).forEach((p,idx)=>{
    const peso=Math.max(1,45-idx)+(p.alcance||0)/900000;
    const hashtags=String(p.texto||'').match(/#[\p{L}\p{N}_]+/gu)||[];
    const temas=[p.tema,...hashtags.map(h=>h.slice(1).toLowerCase())].filter(Boolean);
    temas.forEach(t=>mapa.set(t,(mapa.get(t)||0)+peso));
  });
  return [...mapa.entries()].sort((a,b)=>b[1]-a[1]).slice(0,limite).map(([t])=>`#${String(t).replace(/[^\p{L}\p{N}_]+/gu,'')}`);
}
