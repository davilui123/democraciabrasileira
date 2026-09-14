import React, { useMemo, useState } from 'react';
import { Trophy, Lock, X, ChevronLeft, Sparkles, Gift, CheckCircle2, ArrowRight, Target, Landmark, TrendingUp, UsersRound, Globe2, Factory, Scale, Crown } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { conquistasSeed } from '../data/seed/conquistas.js';
import { progressoConquista } from '../game/achievementEngine.js';
import GameIcon from './GameIcon';
import { toast } from './sonner';

const TIER={bronze:{label:'Bronze',tone:'warning',cls:'text-amber-500 border-amber-500/35 bg-amber-500/5'},prata:{label:'Prata',tone:'neutral',cls:'text-slate-300 border-slate-400/30 bg-slate-400/5'},ouro:{label:'Ouro',tone:'warning',cls:'text-yellow-400 border-yellow-400/35 bg-yellow-400/5'},diamante:{label:'Diamante',tone:'info',cls:'text-cyan-300 border-cyan-400/35 bg-cyan-400/5'}};
const CATEGORY={todas:{label:'Todas',icon:Trophy},governo:{label:'Governo',icon:Landmark},politica:{label:'Política',icon:UsersRound},sociedade:{label:'Sociedade',icon:UsersRound},economia:{label:'Economia',icon:TrendingUp},desenvolvimento:{label:'Desenvolvimento',icon:Factory},soberania:{label:'Soberania',icon:Factory},exterior:{label:'Exterior',icon:Globe2},instituicoes:{label:'Instituições',icon:Scale},legado:{label:'Legado',icon:Crown}};
const pct=(p)=>p.meta?Math.max(0,Math.min(100,(Number(p.valor)||0)/p.meta*100)):0;

function AchievementCard({item,state,selected,onSelect}){
  const raw=(state.conquistasDesbloqueadas||[]).find(c=>(typeof c==='string'?c:c.id)===item.id);
  const unlocked=!!raw;const progress=progressoConquista(state,item.id);const tier=TIER[item.tipo]||TIER.bronze;
  return <button onClick={()=>onSelect(item.id)} className={`relative min-h-[202px] rounded-2xl border p-4 text-left transition ${selected?'border-success/55 bg-success/7 shadow-elevation-2':unlocked?'border-border bg-card/75 hover:border-success/30':'border-border bg-card/35 hover:border-muted/60'}`}>
    <div className="flex items-start justify-between gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-bg text-2xl">{item.icone}</div><span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${tier.cls}`}>{tier.label}</span></div>
    <div className="mt-3 text-sm font-black text-text">{item.titulo}</div><p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-muted">{item.descricao}</p>
    <div className="mt-4"><div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-muted"><span>{unlocked?'Concluída':'Progresso'}</span><span>{unlocked?'100%':`${progress.valor}${progress.sufixo||''} / ${progress.meta}${progress.sufixo||''}`}</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg"><div className={`h-full ${unlocked?'bg-success':'bg-info'}`} style={{width:`${unlocked?100:pct(progress)}%`}}/></div></div>
    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">{unlocked?<><CheckCircle2 size={12} className="text-success"/><span className="text-success">Turno {typeof raw==='string'?'—':raw.desbloqueadaEm}</span></>:<><Lock size={11} className="text-muted"/><span className="text-muted">{item.metaLabel}</span></>}</div>
  </button>;
}

export default function Achievements({onClose}){
  const state=useGameStore();
  const {ativarRecompensaConquista,recompensasEstruturaisAtivadas=[],capacidadesDesbloqueadas=[]}=state;
  const [filter,setFilter]=useState('todas');
  const [selectedId,setSelectedId]=useState(conquistasSeed[0].id);
  const items=useMemo(()=>filter==='todas'?conquistasSeed:conquistasSeed.filter(c=>c.categoria===filter),[filter]);
  const selected=conquistasSeed.find(c=>c.id===selectedId)||items[0]||conquistasSeed[0];
  const progress=progressoConquista(state,selected.id);
  const raw=(state.conquistasDesbloqueadas||[]).find(c=>(typeof c==='string'?c:c.id)===selected.id);
  const unlocked=!!raw;
  const reward=selected.recompensa||{};
  const nuclearEmTramitacao=reward.id==='empresa_nuclear_avancada'&&(state.votacoes||[]).some(v=>v.leiId==='criacao_ebtn'&&!['arquivada','vetada','sancionada'].includes(v.status));
  const activated=reward.id&&(recompensasEstruturaisAtivadas.includes(reward.id)||reward.tipo==='capacidade'&&capacidadesDesbloqueadas.includes(reward.id));
  const total=conquistasSeed.length, done=(state.conquistasDesbloqueadas||[]).length;
  const deploy=()=>{const r=ativarRecompensaConquista(selected.id);r.ok?toast.success(`${reward.nome} implantado no governo.`):toast.error(r.motivo||'Não foi possível implantar a recompensa.');};

  return <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-bg text-text">
    <header className="shrink-0 border-b border-border bg-panel/95 px-4 py-4 md:px-7"><div className="mx-auto flex max-w-[1540px] items-center justify-between gap-5"><div className="flex items-center gap-4"><button onClick={onClose} className="ui-btn-secondary px-3 md:hidden"><ChevronLeft size={18}/></button><GameIcon icon={Trophy} tone="warning" size="lg"/><div><div className="ui-kicker">Legado & progressão do Estado</div><h1 className="mt-1 text-2xl font-black tracking-[-.04em]">Conquistas Presidenciais</h1><p className="mt-1 hidden max-w-3xl text-xs text-muted md:block">Marcos políticos, econômicos e institucionais que transformam capacidade real de governo. Conquista não é decoração: ela pode abrir instrumentos, empresas, programas ou vantagens permanentes.</p></div></div><div className="flex items-center gap-3"><div className="hidden rounded-xl border border-border bg-card px-4 py-2 text-right sm:block"><div className="ui-data-label">Legado concluído</div><div className="text-xl font-black">{done}/{total}</div></div><button onClick={onClose} className="ui-btn-secondary px-3"><X size={18}/></button></div></div></header>

    <div className="shrink-0 border-b border-border bg-panel/65 px-4 py-3 md:px-7"><div className="mx-auto flex max-w-[1540px] gap-1 overflow-x-auto">{Object.entries(CATEGORY).map(([id,m])=>{const Icon=m.icon;return <button key={id} onClick={()=>setFilter(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider ${filter===id?'bg-card text-text shadow-elevation-1':'text-muted hover:text-text'}`}><Icon size={13}/>{m.label}</button>})}</div></div>

    <main className="mx-auto grid min-h-0 w-full max-w-[1540px] flex-1 gap-3 overflow-hidden px-4 py-4 md:px-7 xl:grid-cols-[1.25fr_.75fr]">
      <section className="min-h-0 overflow-y-auto pr-1"><div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">{items.map(item=><AchievementCard key={item.id} item={item} state={state} selected={selected.id===item.id} onSelect={setSelectedId}/>)}</div></section>
      <aside className="min-h-0 overflow-y-auto rounded-3xl border border-border bg-card/70 p-5"><div className="flex items-start justify-between gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl border border-border bg-bg text-4xl">{selected.icone}</div><span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${TIER[selected.tipo]?.cls}`}>{TIER[selected.tipo]?.label}</span></div>
        <div className="mt-5 ui-kicker">{CATEGORY[selected.categoria]?.label||selected.categoria}</div><h2 className="mt-1 text-2xl font-black">{selected.titulo}</h2><p className="mt-3 text-sm leading-relaxed text-muted">{selected.descricao}</p>
        <div className="mt-5 rounded-2xl border border-border bg-panel/40 p-4"><div className="flex items-center justify-between"><div className="ui-data-label">Meta verificável</div><Target size={16} className="text-info"/></div><div className="mt-2 text-sm font-black">{selected.metaLabel}</div>{progress.detalhe&&<p className="mt-1 text-[10px] text-muted">{progress.detalhe}</p>}<div className="mt-3 h-2 overflow-hidden rounded-full bg-bg"><div className={`h-full ${unlocked?'bg-success':'bg-info'}`} style={{width:`${unlocked?100:pct(progress)}%`}}/></div><div className="mt-2 text-right text-[10px] font-black text-muted">{unlocked?'CONCLUÍDA':`${progress.valor}${progress.sufixo||''} / ${progress.meta}${progress.sufixo||''}`}</div></div>
        <div className={`mt-4 rounded-2xl border p-4 ${unlocked?'border-success/25 bg-success/5':'border-warning/20 bg-warning/5'}`}><div className="flex items-start gap-3"><GameIcon icon={Gift} tone={unlocked?'success':'warning'} size="sm"/><div><div className="ui-kicker">Recompensa</div><div className="mt-1 text-sm font-black">{reward.nome}</div><p className="mt-1 text-xs leading-relaxed text-muted">{reward.texto}</p></div></div>
          {unlocked&&reward.tipo==='estrutural'&&!activated&&!nuclearEmTramitacao&&<button onClick={deploy} className="ui-btn-primary mt-4 w-full justify-center"><Sparkles size={15}/>{reward.id==='empresa_nuclear_avancada'?'Enviar projeto ao Congresso':'Implantar capacidade'} <ArrowRight size={14}/></button>}
          {nuclearEmTramitacao&&<div className="mt-4 flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-3 py-2 text-xs font-black text-warning"><Landmark size={14}/> Projeto de criação em tramitação no Congresso</div>}
          {unlocked&&activated&&<div className="mt-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 px-3 py-2 text-xs font-black text-success"><CheckCircle2 size={14}/> Capacidade ativa no governo</div>}
          {unlocked&&reward.tipo==='capacidade'&&reward.id==='programa_aceleracao_investimentos'&&<div className="mt-3 rounded-xl border border-info/20 bg-info/5 px-3 py-2 text-[10px] text-info">Requisito já registrado para a Fase 4.7 — Programas Governamentais.</div>}
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-bg/45 p-4"><div className="ui-kicker">Princípio da progressão</div><p className="mt-2 text-xs leading-relaxed text-muted">Bônus imediatos já alteram o estado do país. Recompensas estruturais apenas abrem a possibilidade: você ainda decide se quer implantá-las e arcar com custo fiscal, capital político e consequências.</p></div>
      </aside>
    </main>
  </div>;
}
