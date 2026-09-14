import React from 'react';
import { X, Quote, Network, ShieldAlert, History, Target, Compass, BadgeInfo } from 'lucide-react';
import PoliticalAvatar from './PoliticalAvatar';

const statTone=(value)=>Number(value)>=70?'text-success':Number(value)>=45?'text-warning':'text-danger';

const normalizeTags=(person)=>[
  ...(person?.pauta||[]),
  ...(person?.interesses||[]),
  ...(person?.aversoes||[]).slice(0,2).map(x=>`evita: ${x}`),
].filter(Boolean).slice(0,7);

export function CharacterDossierPanel({person,eyebrow='Dossiê',subtitle='',imageKey,stats=[]}){
  if(!person)return null;
  const trajectory=person.trajetoria||person.passado||person.biografia||person.descricao;
  const agenda=person.agendaPessoal||person.agenda||person.teseCentral||person.interesses?.join(' · ');
  const network=person.rede||person.baseEleitoral||person.origem;
  const vulnerability=person.vulnerabilidade||person.pressaoDomestica||person.aversoes?.join(' · ');
  const episode=person.episodioMarcante||person.estilo||person.estiloVoto;
  const how=person.comoLidar||person.comoLer||person.estiloNegociacao;
  const legacy=person.legadoDesejado||person.ambicaoNacional;
  const tags=normalizeTags(person);
  const shownStats=stats.filter(x=>x?.value!==undefined&&x?.value!==null);
  return <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
    <aside className="rounded-2xl border border-border bg-panel/45 p-4">
      <div className="flex items-center gap-4 lg:block">
        <PoliticalAvatar name={person.nome} seed={person.avatar||person.avatarSeed||person.id} imageKey={imageKey||person.avatar||person.avatarSeed} size={112} className="lg:mx-auto"/>
        <div className="min-w-0 lg:mt-4 lg:text-center">
          <div className="ui-kicker">{eyebrow}</div>
          <h3 className="mt-1 text-xl font-black text-text">{person.nome}</h3>
          <p className="mt-1 text-xs font-bold text-muted">{subtitle||[person.cargo,person.partido,person.origem,person.perfil].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
      {person.frase&&<div className="mt-4 rounded-xl border border-border bg-bg/50 p-3"><Quote size={14} className="text-warning"/><p className="mt-2 text-xs italic leading-relaxed text-text/80">“{person.frase}”</p></div>}
      {shownStats.length>0&&<div className="mt-4 grid grid-cols-2 gap-2">{shownStats.slice(0,6).map(s=><div key={s.label} className="rounded-xl border border-border bg-bg/45 p-2.5"><div className="ui-data-label">{s.label}</div><div className={`mt-1 text-lg font-black ${s.tone||statTone(s.value)}`}>{s.suffix?`${Math.round(s.value)}${s.suffix}`:s.value}</div></div>)}</div>}
      {tags.length>0&&<div className="mt-4 flex flex-wrap gap-1.5">{tags.map(t=><span key={t} className="ui-chip">{String(t).replaceAll('_',' ')}</span>)}</div>}
    </aside>
    <section className="grid content-start gap-3 sm:grid-cols-2">
      {trajectory&&<Block icon={History} title="Trajetória" text={trajectory}/>} 
      {agenda&&<Block icon={Target} title="Agenda própria" text={agenda}/>} 
      {network&&<Block icon={Network} title="Rede de poder" text={network}/>} 
      {vulnerability&&<Block icon={ShieldAlert} title="Vulnerabilidade" text={vulnerability}/>} 
      {episode&&<Block icon={BadgeInfo} title="Episódio / estilo definidor" text={episode}/>} 
      {how&&<Block icon={Compass} title="Como lidar" text={how}/>} 
      {legacy&&<div className="sm:col-span-2 rounded-2xl border border-warning/20 bg-warning/5 p-4"><div className="ui-kicker text-warning">Ambição / legado</div><p className="mt-2 text-sm leading-relaxed text-text/80">{legacy}</p></div>}
    </section>
  </div>;
}

function Block({icon:Icon,title,text}){return <div className="rounded-2xl border border-border bg-panel/38 p-4"><div className="flex items-center gap-2"><Icon size={15} className="text-info"/><div className="ui-kicker">{title}</div></div><p className="mt-2 text-sm leading-relaxed text-text/75">{text}</p></div>}

export default function CharacterDossierModal({person,onClose,eyebrow,subtitle,imageKey,stats=[]}){
  if(!person)return null;
  return <div className="fixed inset-0 z-[150] grid place-items-center bg-black/75 p-3 backdrop-blur-xl" onMouseDown={e=>{if(e.target===e.currentTarget)onClose?.()}}>
    <section className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-5">
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-panel/80 px-5 py-4"><div><div className="ui-kicker">Arquivo reservado</div><h2 className="mt-1 text-lg font-black">Dossiê de personagem</h2></div><button onClick={onClose} className="ui-btn-secondary px-3"><X size={17}/></button></header>
      <div className="min-h-0 flex-1 overflow-y-auto p-5"><CharacterDossierPanel person={person} eyebrow={eyebrow} subtitle={subtitle} imageKey={imageKey} stats={stats}/></div>
    </section>
  </div>;
}
