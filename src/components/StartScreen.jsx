import React, { useMemo, useState } from 'react';
import { Landmark, Play, RotateCcw, CalendarDays, Gauge, BriefcaseBusiness, ScrollText, UserRound, Flag, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { getSaveSummary } from '../services/saveService';
import { promessasPosseSeed, eixosPerfilSeed } from '../data/seed/perfilPresidencial.js';
import GameIcon from './GameIcon';
import PoliticalAvatar from './PoliticalAvatar';

const PARTIES=[
  {id:'esq',sigla:'PPG',nome:'Partido Progressista'},
  {id:'centro',sigla:'MOC',nome:'Movimento Central'},
  {id:'dir',sigla:'LIB',nome:'Liberais Unidos'},
  {id:'ind',sigla:'IND',nome:'Independentes'},
];
const UFS=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const Stat=({icon:Icon,label,value})=><div className="rounded-xl border border-border bg-bg/45 px-3 py-3"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.14em] text-muted"><Icon size={13}/>{label}</div><div className="mt-1 text-sm font-black text-text">{value}</div></div>;
const axisLabel={economia:'Economia',costumes:'Costumes',seguranca:'Segurança',ambiente:'Ambiente',exterior:'Política externa'};

function ProfileSteps({perfil,setPerfil,onBack,onSubmit}){
  const [step,setStep]=useState(1);
  const togglePromise=(id)=>setPerfil(p=>{const arr=p.promessas.includes(id)?p.promessas.filter(x=>x!==id):p.promessas.length<3?[...p.promessas,id]:p.promessas;return {...p,promessas:arr}});
  const canNext=!!perfil.nome.trim();
  const canSubmit=canNext&&perfil.promessas.length===3;
  const publicName=perfil.nomePublico.trim()||perfil.nome.trim().split(/\s+/)[0]||'Presidente';

  return <div className="relative h-screen overflow-y-auto bg-bg text-text lg:overflow-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_68%_5%,rgba(23,128,106,.18),transparent_34rem)]"/>
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 md:px-6 lg:h-screen lg:min-h-0 lg:px-8 lg:py-5">
      <header className="flex shrink-0 items-center justify-between gap-4">
        <button onClick={onBack} className="ui-btn-secondary"><ArrowLeft size={15}/> Voltar</button>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-8 rounded-full ${step===1?'bg-success':'bg-success/35'}`}/>
          <span className={`h-2.5 w-8 rounded-full ${step===2?'bg-success':'bg-panel'}`}/>
          <span className="ml-2 text-[9px] font-black uppercase tracking-[.16em] text-muted">Etapa {step} de 2</span>
        </div>
      </header>

      {step===1&&<div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[.78fr_1.22fr]">
        <section className="ui-surface flex min-h-0 flex-col p-5 lg:p-6">
          <div className="flex items-center gap-4">
            <PoliticalAvatar name={publicName} seed="presidente" imageKey="presidente" size={72}/>
            <div className="min-w-0"><div className="ui-kicker">Antes da posse</div><h1 className="mt-1 text-2xl font-black tracking-[-.04em] lg:text-3xl">Quem ganhou a eleição?</h1><p className="mt-1 text-xs leading-relaxed text-muted">Seu perfil passa a existir para oposição, imprensa, Pulso e eleitores.</p></div>
          </div>
          <div className="mt-5 grid gap-3">
            <label><span className="ui-data-label">Nome completo</span><input value={perfil.nome} onChange={e=>setPerfil({...perfil,nome:e.target.value})} placeholder="Nome do Presidente" className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 outline-none focus:border-success/45"/></label>
            <label><span className="ui-data-label">Nome público / urna</span><input value={perfil.nomePublico} onChange={e=>setPerfil({...perfil,nomePublico:e.target.value})} placeholder="Como o país vai te chamar" className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 outline-none focus:border-success/45"/></label>
            <div className="grid grid-cols-2 gap-3"><label><span className="ui-data-label">Partido</span><select value={perfil.partidoId} onChange={e=>setPerfil({...perfil,partidoId:e.target.value})} className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm">{PARTIES.map(p=><option key={p.id} value={p.id}>{p.sigla} · {p.nome}</option>)}</select></label><label><span className="ui-data-label">Origem política</span><select value={perfil.ufOrigem} onChange={e=>setPerfil({...perfil,ufOrigem:e.target.value})} className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3 py-2.5 text-sm">{UFS.map(uf=><option key={uf}>{uf}</option>)}</select></label></div>
          </div>
          <div className="mt-auto hidden rounded-xl border border-border bg-panel/35 p-3 text-[10px] leading-relaxed text-muted lg:block">Retrato opcional: <b className="text-text">public/characters/presidente.webp</b>. Se não existir, o jogo usa avatar ilustrado automaticamente.</div>
        </section>

        <section className="ui-surface flex min-h-0 flex-col p-5">
          <div className="flex items-center justify-between"><div><div className="ui-kicker">Posições públicas</div><h2 className="mt-1 text-xl font-black">Como você chega ao Planalto?</h2></div><span className="ui-chip">5 eixos</span></div>
          <div className="mt-4 grid min-h-0 flex-1 content-start gap-2.5">
            {Object.entries(eixosPerfilSeed).map(([eixo,ops])=><div key={eixo} className="grid items-center gap-2 rounded-xl border border-border bg-panel/30 p-2.5 md:grid-cols-[130px_1fr]"><div className="text-[10px] font-black uppercase tracking-wider text-muted">{axisLabel[eixo]||eixo}</div><div className="grid grid-cols-3 gap-1.5">{ops.map(([id,label])=><button key={id} onClick={()=>setPerfil(p=>({...p,eixos:{...p.eixos,[eixo]:id}}))} className={`min-h-9 rounded-lg border px-2 py-1.5 text-center text-[10px] font-bold leading-tight ${perfil.eixos[eixo]===id?'border-success/45 bg-success/8 text-text':'border-border bg-bg/50 text-muted hover:text-text'}`}>{label}</button>)}</div></div>)}
          </div>
          <div className="mt-4 flex shrink-0 items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted">Depois você define as três promessas de posse.</span><button onClick={()=>setStep(2)} disabled={!canNext} className="ui-btn-primary px-5">Próximo <ArrowRight size={16}/></button></div>
        </section>
      </div>}

      {step===2&&<div className="mt-4 flex min-h-0 flex-1 flex-col">
        <section className="ui-surface flex min-h-0 flex-1 flex-col p-5 lg:p-6">
          <div className="flex shrink-0 items-start justify-between gap-4"><div><div className="ui-kicker">Promessas de posse</div><h1 className="mt-1 text-2xl font-black tracking-[-.035em]">O que {publicName} prometeu ao país?</h1><p className="mt-1 text-xs text-muted">Escolha exatamente três. A oposição vai guardar essa lista.</p></div><span className={`ui-chip ${perfil.promessas.length===3?'text-success':'text-warning'}`}>{perfil.promessas.length}/3</span></div>
          <div className="mt-4 grid min-h-0 flex-1 content-start gap-2 md:grid-cols-2 lg:grid-cols-3">{promessasPosseSeed.map(p=>{const active=perfil.promessas.includes(p.id);return <button key={p.id} onClick={()=>togglePromise(p.id)} className={`min-h-[92px] rounded-2xl border p-3 text-left transition ${active?'border-success/45 bg-success/7':'border-border bg-panel/35 hover:border-muted/60'}`}><div className="flex items-start justify-between gap-2"><div className="text-xs font-black">{p.titulo}</div>{active&&<Check size={15} className="shrink-0 text-success"/>}</div><p className="mt-1.5 text-[10px] leading-relaxed text-muted">{p.texto}</p></button>})}</div>
          <footer className="mt-4 flex shrink-0 items-center justify-between border-t border-border pt-3"><button onClick={()=>setStep(1)} className="ui-btn-secondary"><ArrowLeft size={15}/> Posições públicas</button><button onClick={onSubmit} disabled={!canSubmit} className="ui-btn-primary px-6"><Flag size={17}/> Ir para a posse</button></footer>
        </section>
      </div>}
    </main>
  </div>;
}

export default function StartScreen({onNewGame,onContinue}){
  const save=useMemo(()=>getSaveSummary(),[]);
  const [mode,setMode]=useState('home');
  const [perfil,setPerfil]=useState({nome:'',nomePublico:'',partidoId:'esq',ufOrigem:'SP',eixos:{economia:'equilibrio',costumes:'moderado',seguranca:'equilibrio',ambiente:'equilibrio',exterior:'autonomia'},promessas:[]});
  const savedDate=save?.savedAt?new Date(save.savedAt).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):null;
  const submit=()=>{if(!perfil.nome.trim()||perfil.promessas.length!==3)return;onNewGame({...perfil,nomePublico:perfil.nomePublico.trim()||perfil.nome.trim().split(/\s+/)[0]});};
  if(mode==='profile')return <ProfileSteps perfil={perfil} setPerfil={setPerfil} onBack={()=>setMode('home')} onSubmit={submit}/>;
  return <div className="relative min-h-screen overflow-y-auto bg-bg text-text"><div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_68%_5%,rgba(23,128,106,.18),transparent_34rem),linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] [background-size:auto,44px_44px,44px_44px]"/><main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 md:px-8"><div className="grid w-full gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><section><div className="mb-7 flex items-center gap-4"><GameIcon icon={Landmark} tone="success" size="lg"/><div><div className="ui-kicker text-warning">República Federativa do Brasil</div><div className="text-sm font-bold text-muted">Simulador presidencial</div></div></div><h1 className="max-w-3xl text-4xl font-black leading-[.98] tracking-[-.05em] md:text-6xl">O poder começa no Planalto.<br/><span className="text-success">Governar é outra coisa.</span></h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">Monte seu gabinete, enfrente o Congresso, administre crises e construa um governo que sobreviva às próprias escolhas.</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={()=>setMode('profile')} className="ui-btn-primary min-h-12 px-6"><Play size={18}/> Novo jogo</button><button type="button" onClick={onContinue} disabled={!save} className="ui-btn-secondary min-h-12 px-6"><RotateCcw size={18}/> Continuar jogo</button></div><p className="mt-3 text-xs text-muted">Novo jogo começa pela criação do perfil presidencial e das promessas de posse.</p></section><section className="ui-surface overflow-hidden"><div className="border-b border-border bg-panel/70 px-5 py-4"><div className="ui-kicker">Arquivo presidencial</div><div className="mt-1 flex items-center justify-between gap-4"><h2 className="text-xl font-black">{save?'Jogo salvo':'Nenhuma campanha salva'}</h2>{save&&<span className="ui-chip border-success/25 bg-success/5 text-success">Disponível</span>}</div></div>{save?<div className="p-5"><div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-panel/45 p-3"><PoliticalAvatar name={save.presidente||'Presidente'} seed="presidente" imageKey="presidente" size={40}/><div className="min-w-0"><div className="flex items-center gap-2"><UserRound size={15} className="text-info"/><span className="truncate font-black">{save.presidente}</span></div></div></div><div className="grid grid-cols-2 gap-3"><Stat icon={CalendarDays} label="Data" value={save.dataString}/><Stat icon={Gauge} label="Aprovação" value={`${save.aprovacao}%`}/><Stat icon={BriefcaseBusiness} label="Ministros" value={`${save.nomeados} nomeados`}/><Stat icon={ScrollText} label="Leis" value={`${save.leis} aprovadas`}/></div><div className="mt-4 rounded-xl border border-border bg-panel/45 p-4 text-xs leading-relaxed text-muted">Mandato <b className="text-text">{save.mandato}</b> · turno {save.turno}<br/>Último salvamento: {savedDate}</div><button type="button" onClick={onContinue} className="ui-btn-primary mt-4 w-full justify-center">Retomar mandato</button></div>:<div className="p-8 text-center"><Landmark className="mx-auto text-muted/40" size={38}/><p className="mt-3 text-sm text-muted">Sua primeira campanha ainda não começou.</p></div>}</section></div></main></div>;
}
