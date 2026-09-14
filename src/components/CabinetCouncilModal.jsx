import React, { useMemo, useState } from 'react';
import { X, UsersRound, MessageSquareQuote, Check, AlertTriangle } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { conselhosMinisteriais } from '../data/seed/conselhosMinisteriais';
import PoliticalAvatar from './PoliticalAvatar';
import { toast } from './sonner';

export default function CabinetCouncilModal({ onClose }) {
  const { nomeacoes=[], cargos=[], resolverConselhoMinisterial } = useGameStore();
  const disponiveis=useMemo(()=>conselhosMinisteriais.filter(c=>c.participantes.filter(id=>nomeacoes.some(n=>n.cargoId===id)).length>=2),[nomeacoes]);
  const [id,setId]=useState(disponiveis[0]?.id||conselhosMinisteriais[0].id);
  const cenario=conselhosMinisteriais.find(c=>c.id===id)||conselhosMinisteriais[0];
  const presentes=cenario.participantes.map(pid=>({cargo:cargos.find(c=>c.id===pid),ministro:nomeacoes.find(n=>n.cargoId===pid)}));
  const decidir=(opcao)=>{const r=resolverConselhoMinisterial(cenario.id,opcao.id); r?.ok?toast.success('Diretriz presidencial registrada.'):toast.error(r?.motivo||'Não foi possível concluir a reunião.'); if(r?.ok) onClose();};
  return <div className="fixed inset-0 z-[88] flex items-center justify-center bg-black/75 p-3 backdrop-blur-lg"><div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-5">
    <div className="flex items-start justify-between gap-5 border-b border-border bg-panel/75 px-5 py-4"><div><div className="ui-kicker">Palácio do Planalto · reunião reservada</div><h2 className="mt-1 text-xl font-black text-text">Conselho de Governo</h2><p className="mt-1 text-sm text-muted">Escolha uma pauta real de conflito entre pastas. A decisão altera relações com os ministros presentes.</p></div><button onClick={onClose} className="ui-btn-secondary min-h-9 px-3"><X size={17}/></button></div>
    <div className="grid min-h-0 flex-1 lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-bg/35 p-3 lg:border-b-0 lg:border-r"><div className="ui-kicker px-2 py-2">Pautas disponíveis</div><div className="space-y-1">{disponiveis.map(c=><button key={c.id} onClick={()=>setId(c.id)} className={`w-full rounded-xl border px-3 py-3 text-left text-xs font-bold ${c.id===cenario.id?'border-success/35 bg-success/5 text-text':'border-transparent text-muted hover:bg-panel hover:text-text'}`}>{c.titulo}</button>)}</div></aside>
      <main className="min-h-0 overflow-y-auto p-5 md:p-7"><div className="max-w-4xl"><div className="flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-success/20 bg-success/5 text-success"><UsersRound size={20}/></div><div><h3 className="text-2xl font-black text-text">{cenario.titulo}</h3><p className="mt-2 text-sm leading-relaxed text-text/75">{cenario.assunto}</p></div></div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">{presentes.map(({cargo,ministro})=><div key={cargo?.id} className={`rounded-2xl border p-4 ${ministro?'border-border bg-panel/45':'border-danger/25 bg-danger/5'}`}>{ministro?<><div className="flex items-center gap-3"><PoliticalAvatar name={ministro.nome} seed={ministro.avatarSeed||ministro.id} size={48}/><div><div className="text-sm font-black text-text">{ministro.nome}</div><div className="text-[10px] font-bold text-muted">{cargo?.nome}</div></div></div><div className="mt-3 flex gap-2 text-xs leading-relaxed text-text/75"><MessageSquareQuote size={15} className="mt-0.5 shrink-0 text-info"/><span>“{cenario.falas[cargo.id]}”</span></div></>:<div className="flex gap-2 text-xs text-danger"><AlertTriangle size={15}/>{cargo?.nome} está sem ministro. A reunião perde capacidade de execução.</div>}</div>)}</div>
        <div className="mt-6"><div className="ui-kicker mb-3">Sua diretriz</div><div className="space-y-2">{cenario.opcoes.map(o=><button key={o.id} onClick={()=>decidir(o)} className="group flex w-full items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 text-left hover:border-success/35 hover:bg-success/5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-panel text-muted group-hover:text-success"><Check size={15}/></span><span className="text-sm font-bold text-text">{o.texto}</span></button>)}</div></div>
      </div></main>
    </div>
  </div></div>;
}
