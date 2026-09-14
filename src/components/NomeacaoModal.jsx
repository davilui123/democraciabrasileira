import React, { useMemo, useState } from 'react';
import { X, Briefcase, ShieldCheck, Flame, Users, Brain, Landmark, AlertTriangle, Quote, MapPin, Network, Target, FileWarning, CheckCircle2 } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import PoliticalAvatar from './PoliticalAvatar';

const scoreTone=(v,reverse=false)=>{const good=reverse?100-v:v; return good>=75?'text-success':good>=52?'text-warning':'text-danger'};
const MiniScore=({label,value,reverse=false})=><div><div className="flex justify-between gap-2 text-[9px] font-black uppercase tracking-wider text-muted"><span>{label}</span><span className={scoreTone(value,reverse)}>{Math.round(value)}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-panel"><div className={`h-full ${scoreTone(value,reverse).replace('text-','bg-')}`} style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div></div>;

export default function NomeacaoModal({ cargo, onClose }) {
  const { nomearParaCargo, capitalPolitico, turno } = useGameStore();
  const candidatos = cargo.candidatosEspecificos || [];
  const ranking = useMemo(()=>[...candidatos].sort((a,b)=>((b.habilidadeTecnica+b.habilidadePolitica)-(a.habilidadeTecnica+a.habilidadePolitica))),[candidatos]);
  const [selectedId,setSelectedId]=useState(ranking[0]?.id);
  const candidato=ranking.find(c=>c.id===selectedId)||ranking[0];
  const custo=turno<=6?0:10;
  const rival=candidato?Math.max(0,Math.round(candidato.ambicao*.55+candidato.popularidade*.35-candidato.lealdadeInicial*.2)):0;
  const escandalo=candidato?Math.round((candidato.riscoCorrupcao||20)*.6+(100-(candidato.integridade||60))*.35):0;
  const nomear=()=>{if(candidato&&nomearParaCargo(cargo.id,candidato)) onClose();};
  if(!candidato)return null;

  return <div className="fixed inset-0 z-[125] flex items-stretch justify-center bg-black/80 p-2 backdrop-blur-xl md:p-4"><div className="flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-5">
    <header className="flex items-start justify-between gap-5 border-b border-border bg-panel/75 px-5 py-4 md:px-6"><div><div className="ui-kicker">Dossiê de nomeação · {cargo.nome}</div><h2 className="mt-1 text-xl font-black text-text">Quem vai comandar esta pasta?</h2><p className="mt-1 text-sm text-muted">Não existe candidato neutro. Cada nome traz capacidade, aliados, agenda própria e um problema potencial.</p></div><button onClick={onClose} className="ui-btn-secondary min-h-9 px-3"><X size={17}/></button></header>

    <div className="grid min-h-0 flex-1 lg:grid-cols-[310px_1fr]">
      <aside className="min-h-0 overflow-y-auto border-b border-border bg-bg/35 p-3 lg:border-b-0 lg:border-r"><div className="ui-kicker px-2 py-2">Lista curta · {ranking.length} nomes</div><div className="space-y-2">{ranking.map(c=><button key={c.id} onClick={()=>setSelectedId(c.id)} className={`w-full rounded-2xl border p-3 text-left transition ${c.id===candidato.id?'border-success/40 bg-success/5':'border-border bg-card/65 hover:border-muted/60'}`}><div className="flex gap-3"><PoliticalAvatar name={c.nome} seed={c.avatarSeed||c.id} size={52}/><div className="min-w-0 flex-1"><div className="truncate text-sm font-black text-text">{c.nome}</div><div className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-muted">{c.carreira}</div><div className="mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-muted"><span>{c.vinculo||c.ideologia}</span></div></div></div><div className="mt-3 grid grid-cols-3 gap-2"><MiniScore label="Técnica" value={c.habilidadeTecnica}/><MiniScore label="Política" value={c.habilidadePolitica}/><MiniScore label="Lealdade" value={c.lealdadeInicial}/></div></button>)}</div></aside>

      <main className="min-h-0 overflow-y-auto p-5 md:p-7"><div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-start"><PoliticalAvatar name={candidato.nome} seed={candidato.avatarSeed||candidato.id} size={118}/><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="ui-kicker">{candidato.ideologia} · {candidato.perfil}</div><h3 className="mt-1 text-3xl font-black tracking-[-.035em] text-text">{candidato.nome}</h3><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted"><span>{candidato.carreira}</span><span className="inline-flex items-center gap-1"><MapPin size={12}/>{candidato.origem||'Brasil'}</span><span>{candidato.idade?`${candidato.idade} anos`:''}</span></div></div><span className="ui-chip">{candidato.vinculo||'Sem vínculo declarado'}</span></div><div className="mt-4 flex gap-2 rounded-2xl border border-info/15 bg-info/5 p-4 text-sm italic leading-relaxed text-text/80"><Quote size={18} className="mt-0.5 shrink-0 text-info"/><span>{candidato.frase||'“A pasta precisa de direção, não apenas administração.”'}</span></div></div></div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Score icon={Brain} label="Capacidade técnica" value={candidato.habilidadeTecnica}/><Score icon={Users} label="Força política" value={candidato.habilidadePolitica}/><Score icon={ShieldCheck} label="Integridade" value={candidato.integridade}/><Score icon={Landmark} label="Popularidade" value={candidato.popularidade}/></div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-4"><Dossier icon={Briefcase} title="Trajetória" text={candidato.biografia}/><Dossier icon={Target} title="O que esta pessoa quer" text={candidato.agendaPessoal}/><Dossier icon={Network} title="Rede de poder" text={candidato.rede}/><Dossier icon={CheckCircle2} title="Episódio que a definiu" text={candidato.passado}/></div>
          <div className="space-y-4"><div className="rounded-2xl border border-border bg-panel/45 p-4"><div className="ui-kicker mb-4">Leitura reservada do Planalto</div><div className="space-y-4"><MiniScore label="Ambição" value={candidato.ambicao} reverse/><MiniScore label="Risco de rival" value={rival} reverse/><MiniScore label="Risco de escândalo" value={escandalo} reverse/><MiniScore label="Lealdade inicial" value={candidato.lealdadeInicial}/></div></div><div className="rounded-2xl border border-danger/20 bg-danger/5 p-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-danger"><FileWarning size={14}/> Vulnerabilidade</div><p className="mt-2 text-sm leading-relaxed text-text/75">{candidato.vulnerabilidade}</p></div><div className="rounded-2xl border border-border bg-panel/45 p-4"><div className="mb-2 text-[10px] font-black uppercase tracking-wider text-success">Tende a apoiar</div><div className="flex flex-wrap gap-1.5">{(candidato.apoia||[]).map(t=><span key={t} className="ui-chip border-success/20 bg-success/5 text-success">{t.replaceAll('_',' ')}</span>)}</div><div className="mb-2 mt-4 text-[10px] font-black uppercase tracking-wider text-danger">Pode sabotar ou resistir</div><div className="flex flex-wrap gap-1.5">{(candidato.rejeita||[]).map(t=><span key={t} className="ui-chip border-danger/20 bg-danger/5 text-danger">{t.replaceAll('_',' ')}</span>)}</div></div></div>
        </div>
      </div></main>
    </div>
    <footer className="shrink-0 flex flex-wrap items-center justify-between gap-4 border-t border-border bg-panel/95 px-5 py-3"><div className="text-sm text-muted">Custo da nomeação: <b className="text-text">{custo} CP</b>{custo===0&&<span className="ml-2 text-xs font-black text-success">capital de montagem</span>}</div><button onClick={nomear} disabled={capitalPolitico<custo} className="ui-btn-primary px-7"><Briefcase size={16}/> Nomear {candidato.nome.split(' ')[0]}</button></footer>
  </div></div>;
}

function Score({icon:Icon,label,value}){return <div className="rounded-2xl border border-border bg-card/70 p-4"><div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-muted"><Icon size={13}/>{label}</div><div className={`mt-2 text-2xl font-black ${scoreTone(value)}`}>{Math.round(value)}</div></div>}
function Dossier({icon:Icon,title,text}){return <div className="rounded-2xl border border-border bg-card/65 p-4"><div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted"><Icon size={14}/>{title}</div><p className="text-sm leading-relaxed text-text/75">{text}</p></div>}
