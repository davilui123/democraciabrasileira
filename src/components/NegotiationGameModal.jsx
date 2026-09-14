import React, { useMemo, useState } from 'react';
import { X, Handshake, ShieldCheck, Eye, Clock3, Sparkles, LockKeyhole, CheckCircle2, AlertTriangle, BadgeDollarSign } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import PoliticalAvatar from './PoliticalAvatar';
import { ativosNegociacaoSeed } from '../data/seed/geopolitica.js';
import { calcularNegociacao, interessesVitaisDoPais, liderDoPais } from '../game/geopoliticsEngine.js';

const typeTone={economico:'text-success border-success/25 bg-success/5',seguranca:'text-danger border-danger/25 bg-danger/5',tecnologia:'text-info border-info/25 bg-info/5',diplomatico:'text-warning border-warning/25 bg-warning/5',clima:'text-success border-success/25 bg-success/5',prestigio:'text-warning border-warning/25 bg-warning/5',soft_power:'text-info border-info/25 bg-info/5',infraestrutura:'text-warning border-warning/25 bg-warning/5',multilateral:'text-info border-info/25 bg-info/5'};
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
const countryFlagUrl=(countryId,size='w160')=>`https://flagcdn.com/${size}/${String(countryId||'').toLowerCase()}.png`;
function CountryFlag({countryId,name,emoji='🌍',className='',size='w160'}){const [failed,setFailed]=useState(false);if(failed||!countryId)return <div className={`grid place-items-center rounded-lg border border-border bg-bg text-xl ${className}`}>{emoji}</div>;return <img src={countryFlagUrl(countryId,size)} alt={`Bandeira de ${name}`} className={className} onError={()=>setFailed(true)}/>;}

export default function NegotiationGameModal({pais,onClose,onFinish}){
  const { diplomacia, geopolitica, podeNegociarCom, capacidadesDesbloqueadas=[] }=useGameStore();
  const leader=useMemo(()=>liderDoPais(pais),[pais]);
  const vitais=useMemo(()=>interessesVitaisDoPais(pais),[pais]);
  const [fase,setFase]=useState('briefing');
  const [ativos,setAtivos]=useState([]);
  const [perguntas,setPerguntas]=useState([]);
  const [tempo,setTempo]=useState(3);
  const [resultado,setResultado]=useState(null);
  const [protegerAutonomia,setProtegerAutonomia]=useState(true);
  const [protegerIndustria,setProtegerIndustria]=useState(true);
  const disponibilidade=podeNegociarCom(pais.id);
  const custo=ativos.reduce((s,a)=>s+(a.custo||0),0);
  const poderMax=7+Math.max(0,(diplomacia?.nivel||1)-1)+(capacidadesDesbloqueadas.includes('diplomacia_presidencial')?1:0);

  const togglear=(a)=>{
    if(ativos.some(x=>x.id===a.id))return setAtivos(ativos.filter(x=>x.id!==a.id));
    if(ativos.length>=3||custo+a.custo>poderMax)return;
    setAtivos([...ativos,a]);
  };
  const perguntar=(tipo)=>{
    if(tempo<=0||perguntas.includes(tipo))return;
    setPerguntas([...perguntas,tipo]);setTempo(t=>t-1);
  };
  const revelar=(i)=>perguntas.length>i || perguntas.includes(i===0?'economia':i===1?'seguranca':'politica');
  const propor=()=>{
    const protegidos=[{id:'autonomia',violado:!protegerAutonomia},{id:'industria',violado:!protegerIndustria}];
    const r=calcularNegociacao({pais,ativos,interessesProtegidos:protegidos,relacao:pais.relacao});
    setResultado(r);setFase('resultado');
  };
  const finalizar=()=>{onFinish?.(!!resultado?.sucesso,pais,resultado);onClose?.();};

  return <div className="fixed inset-0 z-[130] grid place-items-center bg-black/80 p-2 backdrop-blur-xl md:p-5">
    <section className="flex h-[min(92vh,820px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-5">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-panel/85 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3"><CountryFlag countryId={pais.id} name={pais.nome} emoji={pais.icone} size="w80" className="h-12 w-16 rounded-lg border border-border object-cover"/><PoliticalAvatar name={leader.nome} seed={leader.avatar} size={48}/><div className="min-w-0"><div className="ui-kicker">Mesa presidencial · {pais.nome}</div><h2 className="truncate text-lg font-black text-text">{leader.nome} <span className="font-medium text-muted">· {leader.cargo}</span></h2></div></div>
        <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><div className="ui-data-label">Relação bilateral</div><div className="font-black text-text">{pais.relacao}%</div></div><button onClick={onClose} className="ui-btn-secondary px-3"><X size={17}/></button></div>
      </header>

      {fase==='briefing'&&<div className="grid min-h-0 flex-1 lg:grid-cols-[.9fr_1.1fr]">
        <div className="min-h-0 overflow-y-auto border-b border-border p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="ui-kicker">Briefing reservado do Itamaraty</div><h3 className="mt-2 text-3xl font-black tracking-[-.04em] text-text">Negociar só quando existe uma janela.</h3><p className="mt-4 text-sm leading-relaxed text-muted">Esta conversa presidencial consome capital diplomático. Se falhar, o canal esfria por meses. Leia a personalidade do interlocutor e não entregue um interesse vital brasileiro apenas para fechar um acordo.</p>
          <div className="mt-6 rounded-2xl border border-border bg-panel/45 p-4"><div className="text-xs font-black text-text">{leader.perfil}</div><p className="mt-2 text-sm leading-relaxed text-muted">{leader.estilo}</p><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-xl border border-border bg-bg/45 p-3"><div className="ui-data-label">Pressão doméstica</div><p className="mt-1 text-[11px] leading-relaxed text-muted">{leader.pressaoDomestica||'Estabilidade política e econômica.'}</p></div><div className="rounded-xl border border-border bg-bg/45 p-3"><div className="ui-data-label">Vulnerabilidade</div><p className="mt-1 text-[11px] leading-relaxed text-muted">{leader.vulnerabilidade||leader.aversoes?.join(' · ')}</p></div></div><div className="mt-4 flex flex-wrap gap-1.5">{leader.interesses.map(x=><span key={x} className="ui-chip">{x}</span>)}</div></div>
          {!disponibilidade.ok&&<div className="mt-4 rounded-2xl border border-warning/30 bg-warning/5 p-4 text-sm text-warning"><LockKeyhole className="mb-2" size={18}/>{disponibilidade.motivo}</div>}
        </div>
        <div className="min-h-0 overflow-y-auto p-5 lg:p-7"><div className="ui-kicker">Interesses vitais estimados</div><div className="mt-3 space-y-3">{vitais.map((v,i)=><div key={v.id} className="rounded-2xl border border-border bg-bg/45 p-4"><div className="flex items-center justify-between"><div className="font-black text-text">{revelar(i)?v.nome:'Interesse ainda não confirmado'}</div><span className="ui-chip">peso {v.peso}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-panel"><div className="h-full bg-warning" style={{width:`${revelar(i)?v.peso*22:18}%`}}/></div></div>)}</div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">{[['economia','Perguntar por comércio'],['seguranca','Testar linha de segurança'],['politica','Sondar custo político']].map(([id,l])=><button key={id} onClick={()=>perguntar(id)} disabled={tempo<=0||perguntas.includes(id)} className="ui-btn-secondary justify-center text-xs"><Eye size={14}/>{l}</button>)}</div><div className="mt-3 text-xs text-muted">Tempo de sondagem restante: <b className="text-text">{tempo}</b></div>
          <button onClick={()=>setFase('mesa')} disabled={!disponibilidade.ok} className="ui-btn-primary mt-6 w-full justify-center"><Handshake size={17}/> Sentar à mesa</button>
        </div>
      </div>}

      {fase==='mesa'&&<div className="grid min-h-0 flex-1 lg:grid-cols-[1.2fr_.8fr]">
        <div className="min-h-0 overflow-y-auto border-b border-border p-4 lg:border-b-0 lg:border-r lg:p-6"><div className="flex items-center justify-between gap-3"><div><div className="ui-kicker">Cartas de ativos do Estado</div><h3 className="mt-1 text-xl font-black">Monte uma proposta coerente</h3></div><div className="rounded-xl border border-border bg-panel px-3 py-2 text-right"><div className="ui-data-label">Mandato negocial</div><div className={`font-black ${custo>poderMax?'text-danger':'text-success'}`}>{custo}/{poderMax}</div></div></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{ativosNegociacaoSeed.map(a=>{const sel=ativos.some(x=>x.id===a.id);const bloqueado=!sel&&(ativos.length>=3||custo+a.custo>poderMax);return <button key={a.id} onClick={()=>togglear(a)} disabled={bloqueado} className={`min-h-[132px] rounded-2xl border p-3 text-left transition ${sel?'border-success/50 bg-success/7 shadow-elevation-1':'border-border bg-panel/35 hover:border-muted/60'} ${bloqueado?'opacity-35':''}`}><div className="flex items-start justify-between gap-2"><span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${typeTone[a.tipo]||'border-border text-muted'}`}>{a.tipo.replace('_',' ')}</span><span className="text-xs font-black text-warning">{a.custo} pts</span></div><div className="mt-3 text-sm font-black text-text">{a.nome}</div><p className="mt-1 text-[11px] leading-relaxed text-muted">{a.texto}</p></button>})}</div>
        </div>
        <aside className="min-h-0 overflow-y-auto p-5 lg:p-6"><div className="ui-kicker">Linhas vermelhas brasileiras</div><p className="mt-2 text-xs leading-relaxed text-muted">Você pode abrir mão delas para aumentar chance de acordo, mas a concessão terá efeitos futuros.</p><div className="mt-4 space-y-2"><label className="flex items-center gap-3 rounded-xl border border-border bg-panel/45 p-3"><input type="checkbox" checked={protegerAutonomia} onChange={e=>setProtegerAutonomia(e.target.checked)}/><div><div className="text-xs font-black">Autonomia estratégica</div><div className="text-[10px] text-muted">Não aceitar alinhamento automático.</div></div></label><label className="flex items-center gap-3 rounded-xl border border-border bg-panel/45 p-3"><input type="checkbox" checked={protegerIndustria} onChange={e=>setProtegerIndustria(e.target.checked)}/><div><div className="text-xs font-black">Capacidade industrial</div><div className="text-[10px] text-muted">Não trocar mercado por desindustrialização.</div></div></label></div>
          <div className="mt-5 rounded-2xl border border-border bg-bg/50 p-4"><div className="ui-data-label">Sua proposta</div>{ativos.length?<div className="mt-3 space-y-2">{ativos.map(a=><div key={a.id} className="flex items-center justify-between text-xs"><span className="font-bold text-text">{a.nome}</span><span className="text-muted">força {a.forca}</span></div>)}</div>:<p className="mt-2 text-xs text-muted">Nenhum ativo escolhido.</p>}</div>
          <button onClick={propor} disabled={!ativos.length} className="ui-btn-primary mt-5 w-full justify-center"><BadgeDollarSign size={16}/> Colocar proposta na mesa</button>
        </aside>
      </div>}

      {fase==='resultado'&&resultado&&<div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6"><div className="w-full max-w-2xl text-center">{resultado.sucesso?<CheckCircle2 size={56} className="mx-auto text-success"/>:<AlertTriangle size={56} className="mx-auto text-warning"/>}<div className="ui-kicker mt-5">Resultado da mesa</div><h3 className="mt-2 text-3xl font-black">{resultado.sucesso?'Entendimento político alcançado':'A proposta não atravessou as linhas vitais'}</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">{resultado.sucesso?`${leader.nome} aceita levar o entendimento à sua equipe. A relação presidencial ganhou confiança e abre caminho para tratado ou ação concreta.`:`${leader.nome} considera o pacote insuficiente ou politicamente caro. O canal presidencial entra em resfriamento.`}</p><div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3"><div className="ui-stat"><div className="ui-data-label">Força obtida</div><div className="ui-data-value">{resultado.pontuacao}</div></div><div className="ui-stat"><div className="ui-data-label">Resistência</div><div className="ui-data-value">{resultado.resistencia}</div></div></div><button onClick={finalizar} className="ui-btn-primary mt-6 px-8"><Sparkles size={16}/> Encerrar encontro</button></div></div>}
    </section>
  </div>;
}
