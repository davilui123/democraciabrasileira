import React, { useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle2, X, AlertTriangle, Lightbulb, ArrowUp, ArrowDown, Scale, Search, Layers3 } from 'lucide-react';
import useGameStore from '../store/useGameStore';

const shuffle = (items) => [...items].sort(()=>Math.random()-.5);

export default function MinistryChallengeModal({ desafio, onClose }) {
  const resolverDesafioMinisterial = useGameStore((s) => s.resolverDesafioMinisterial);
  const [selecionados, setSelecionados] = useState([]);
  const [ordem, setOrdem] = useState(()=>desafio.ordemIdeal ? shuffle(desafio.opcoes.map(o=>o.id)) : []);
  const [pistasMarcadas,setPistasMarcadas]=useState([]);
  const [resultado, setResultado] = useState(null);
  const isSequence=!!desafio.ordemIdeal;
  const custoAtual = useMemo(() => desafio.opcoes.filter((o) => selecionados.includes(o.id)).reduce((acc, o) => acc + (o.custo || 0), 0), [desafio, selecionados]);

  const toggle = (id) => {
    if (resultado || isSequence) return;
    if (desafio.resposta) return setSelecionados([id]);
    setSelecionados((old) => {
      if (old.includes(id)) return old.filter((x) => x !== id);
      if (desafio.maxEscolhas && old.length >= desafio.maxEscolhas) return old;
      return [...old, id];
    });
  };
  const mover=(idx,dir)=>setOrdem(old=>{const next=[...old],to=idx+dir;if(to<0||to>=next.length)return old;[next[idx],next[to]]=[next[to],next[idx]];return next});
  const confirmar = () => {
    const resposta=isSequence?ordem:selecionados;
    if (!resposta.length) return;
    setResultado(resolverDesafioMinisterial(desafio.ministerioId, desafio.id, resposta));
  };
  const icon = isSequence ? Layers3 : desafio.maxCusto ? Scale : Search;
  const Icon = icon;

  return <div className="fixed inset-0 z-[82] flex items-center justify-center bg-black/80 p-3 backdrop-blur-xl"><div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-5">
    <header className="flex items-start justify-between border-b border-border bg-panel/75 p-5"><div className="flex gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl border border-info/20 bg-info/10 text-info"><Icon size={23}/></div><div><div className="ui-kicker">Operação ministerial · {desafio.mecanica||desafio.tipo}</div><h2 className="mt-1 text-xl font-black text-text">{desafio.titulo}</h2><p className="text-sm text-muted">{desafio.subtitulo}</p></div></div><button onClick={onClose} className="ui-btn-secondary min-h-10 px-3"><X size={18}/></button></header>

    <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
      <div className="rounded-2xl border border-border bg-bg/45 p-4 text-sm leading-relaxed text-text/85">{desafio.contexto}</div>
      <section className="mt-5"><div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-warning"><Lightbulb size={14}/> Sala de evidências</div><div className="grid gap-2 md:grid-cols-2">{desafio.pistas.map((p,i)=>{const active=pistasMarcadas.includes(i);return <button type="button" key={i} onClick={()=>setPistasMarcadas(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])} className={`rounded-xl border p-3 text-left text-xs transition ${active?'border-warning/35 bg-warning/5 text-text':'border-border bg-panel/45 text-text/70 hover:border-muted/60'}`}><span className="mr-2 font-mono text-muted">0{i+1}</span>{p}{active&&<span className="ml-2 font-black text-warning">MARCADA</span>}</button>})}</div><p className="mt-2 text-[10px] text-muted">Marcar evidências serve para organizar seu raciocínio; a avaliação considera sua decisão final.</p></section>

      {!resultado && <section className="mt-6"><div className="mb-3 flex items-end justify-between gap-3"><div><div className="ui-kicker">Sua resposta</div><h3 className="text-base font-black text-text">{isSequence?'Coloque as ações na ordem correta':desafio.maxCusto?'Monte o pacote dentro do limite':desafio.respostasIdeais?'Escolha as prioridades essenciais':'Escolha a hipótese mais consistente'}</h3></div>{desafio.maxCusto&&<div className={`rounded-lg border px-3 py-2 font-mono text-xs font-black ${custoAtual>desafio.maxCusto?'border-danger/30 text-danger':'border-border text-text'}`}>{custoAtual}/{desafio.maxCusto} pts</div>}</div>

        {isSequence ? <div className="space-y-2">{ordem.map((id,idx)=>{const o=desafio.opcoes.find(x=>x.id===id);return <div key={id} className="flex items-center gap-3 rounded-2xl border border-border bg-panel/45 p-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-card font-mono text-xs font-black text-info">{idx+1}</span><div className="min-w-0 flex-1 text-sm font-bold text-text">{o?.texto}</div><div className="flex gap-1"><button onClick={()=>mover(idx,-1)} disabled={idx===0} className="ui-btn-secondary min-h-9 px-2.5"><ArrowUp size={14}/></button><button onClick={()=>mover(idx,1)} disabled={idx===ordem.length-1} className="ui-btn-secondary min-h-9 px-2.5"><ArrowDown size={14}/></button></div></div>})}</div> : <div className="grid gap-2 md:grid-cols-2">{desafio.opcoes.map((o)=>{const active=selecionados.includes(o.id); const excede=desafio.maxCusto&&!active&&custoAtual+(o.custo||0)>desafio.maxCusto;return <button key={o.id} disabled={excede} onClick={()=>toggle(o.id)} className={`min-h-[76px] rounded-2xl border p-4 text-left text-sm transition ${active?'border-success/45 bg-success/10 text-text':'border-border bg-panel/45 text-text/80 hover:border-muted/60'} disabled:opacity-30`}><div className="flex justify-between gap-3"><span className="font-bold">{o.texto}</span>{o.custo!=null&&<span className="font-mono text-xs text-muted">{o.custo} pts</span>}</div>{active&&<div className="mt-2 text-[9px] font-black uppercase tracking-wider text-success">Selecionado</div>}</button>})}</div>}
        <button onClick={confirmar} disabled={isSequence?ordem.length===0:selecionados.length===0} className="ui-btn-primary mt-4 w-full justify-center">Executar decisão</button>
      </section>}

      {resultado&&<section className={`mt-6 rounded-2xl border p-5 ${resultado.acertou?'border-success/35 bg-success/10':'border-warning/35 bg-warning/10'}`}><div className="mb-2 flex items-center gap-2 font-black text-text">{resultado.acertou?<CheckCircle2 className="text-success"/>:<AlertTriangle className="text-warning"/>}{resultado.acertou?'Resposta tecnicamente sólida':'Resposta contestada pela equipe'}</div><p className="text-sm leading-relaxed text-text/80">{desafio.explicacao}</p>{resultado.reacaoMinistro&&<p className="mt-3 border-t border-border/60 pt-3 text-xs italic text-muted">{resultado.reacaoMinistro}</p>}<button onClick={onClose} className="ui-btn-primary mt-4">Encerrar operação</button></section>}
    </div>
  </div></div>;
}
