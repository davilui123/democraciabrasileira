import React, { useMemo, useState } from 'react';
import { Landmark, TrendingUp, Gauge, Banknote, ShieldCheck, Map, Radio, UsersRound, ArrowRight, Scale, CalendarClock } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import SituationRoom from './SituationRoom';
import BrazilPoliticalMap from './BrazilPoliticalMap';
import GameIcon from './GameIcon';
import PresidentialAgendaModal from './PresidentialAgendaModal';
import PoliticalAvatar from './PoliticalAvatar';
import CharacterDossierModal from './CharacterDossier';

const tone=(v,good=50)=>v>=good?'text-success':v>=good-12?'text-warning':'text-danger';
const fmtBi=v=>`R$ ${(v/1000).toFixed(1)} bi`;
export default function Dashboard({onOpenState}){
  const {popularidade,economia,gruposSociais={},estados=[],partidos=[],institucional,redeSocial={posts:[]},midias=[],comunidadePulso=[],consequenciasPendentes=[],agendaCalendario={compromissos:[],convites:[]},turno=1,eleicao}=useGameStore();
  const [mode,setMode]=useState('painel');
  const [showAgenda,setShowAgenda]=useState(false);
  const [showVice,setShowVice]=useState(false);
  const votos=useMemo(()=>partidos.reduce((s,p)=>s+Math.round(p.cadeiras*(p.apoio/100)),0),[partidos]);
  const mediaNames=Object.fromEntries(midias.map(m=>[m.id,m.nome]));
  const communityNames=Object.fromEntries(comunidadePulso.map(m=>[m.id,m.nome]));
  const topPosts=(redeSocial.posts||[]).filter(p=>p.autorId!=='presidente').slice(0,3);
  const groups=Object.values(gruposSociais).sort((a,b)=>(b.peso||0)-(a.peso||0));
  return <div className="ui-page flex h-full min-h-0 flex-col overflow-hidden">
    <div className="mb-3 flex shrink-0 items-center justify-between gap-3"><div className="ui-tabs"><button className={`ui-tab ${mode==='painel'?'ui-tab-active':''}`} onClick={()=>setMode('painel')}>Visão presidencial</button><button className={`ui-tab ${mode==='situacao'?'ui-tab-active':''}`} onClick={()=>setMode('situacao')}>Sala de Situação</button></div><div className="flex items-center gap-2"><div className="hidden text-[10px] font-bold uppercase tracking-wider text-muted xl:block">Nenhuma decisão agrada a todos · escolha sua coalizão social</div>{eleicao?.viceAtual&&<button onClick={()=>setShowVice(true)} className="ui-btn-secondary shrink-0"><PoliticalAvatar name={eleicao.viceAtual.nome} imageKey={eleicao.viceAtual.avatar} size={22} className="rounded-md"/><span className="hidden md:inline">Vice · {eleicao.viceAtual.nome.split(' ')[0]}</span><span className={`ml-1 text-[9px] font-black ${tone(eleicao.viceAtual.relacao||50)}`}>{Math.round(eleicao.viceAtual.relacao||50)}</span></button>}<button onClick={()=>setShowAgenda(true)} className="ui-btn-secondary shrink-0"><CalendarClock size={15}/> Agenda Presidencial {(agendaCalendario.convites||[]).filter(c=>c.status==='pendente'&&(c.prazoTurno??999)>=turno).length>0&&<span className="ml-1 rounded-full bg-danger px-1.5 py-0.5 text-[9px] font-black text-white">{(agendaCalendario.convites||[]).filter(c=>c.status==='pendente'&&(c.prazoTurno??999)>=turno).length}</span>}</button></div></div>
    {mode==='situacao'?<div className="min-h-0 flex-1 overflow-y-auto pr-1"><SituationRoom/></div>:<div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-3">
      <section className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <Mini icon={Landmark} label="Aprovação" value={`${popularidade.geral.toFixed(1)}%`} tone={tone(popularidade.geral)}/>
        <Mini icon={Banknote} label="Primário" value={fmtBi(economia.resultadoPrimario||0)} tone={(economia.resultadoPrimario||0)>=0?'text-success':'text-danger'}/>
        <Mini icon={Scale} label="Dívida / PIB" value={`${(economia.dividaPublica||0).toFixed(1)}%`} tone={(economia.dividaPublica||0)<80?'text-success':'text-warning'}/>
        <Mini icon={Gauge} label="Risco-país" value={`${economia.riscoPais||0} pts`} tone={(economia.riscoPais||0)<300?'text-success':(economia.riscoPais||0)<450?'text-warning':'text-danger'}/>
        <Mini icon={UsersRound} label="Base Câmara" value={`${votos}/513`} tone={votos>=257?'text-success':'text-danger'}/>
        <Mini icon={ShieldCheck} label="Institucional" value={`${100-(institucional.tensaoInstitucional||0)}%`} tone={institucional.tensaoInstitucional<35?'text-success':'text-warning'}/>
      </section>
      <section className="grid min-h-0 overflow-hidden gap-3 xl:grid-cols-[1.05fr_.82fr_.83fr]">
        <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-card/65 p-4"><div className="mb-2 flex items-center justify-between"><div><div className="ui-kicker">Brasil político</div><h3 className="font-black">Aprovação por estado</h3></div><Map size={18} className="text-info"/></div><div className="min-h-0 flex-1"><BrazilPoliticalMap estados={estados} compact onSelect={(uf)=>onOpenState?.(uf)}/></div><button onClick={()=>onOpenState?.('SP')} className="mt-2 flex items-center justify-end gap-1 text-xs font-black text-info">Abrir Federação <ArrowRight size={13}/></button></div>
        <div className="min-h-0 overflow-y-auto rounded-2xl border border-border bg-card/65 p-4 custom-scrollbar"><div className="ui-kicker">Coalizão social</div><h3 className="mt-1 font-black">Quem está com você?</h3><div className="mt-4 space-y-3">{groups.map(g=><div key={g.id}><div className="flex items-center justify-between text-xs"><span className="font-bold">{g.nome}</span><b className={tone(g.aprovacao)}>{Math.round(g.aprovacao)}%</b></div><div className="mt-1.5 h-1.5 rounded-full bg-panel"><div className={`h-full rounded-full ${g.aprovacao>=55?'bg-success':g.aprovacao>=42?'bg-warning':'bg-danger'}`} style={{width:`${g.aprovacao}%`}}/></div></div>)}</div></div>
        <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-card/65 p-4"><div className="flex items-center justify-between"><div><div className="ui-kicker">Pulso & imprensa</div><h3 className="mt-1 font-black">Narrativa do mês</h3></div><div className="text-right"><Radio size={18} className="ml-auto text-warning"/><div className="mt-1 text-[9px] font-black text-muted">força {Math.round(redeSocial.reputacaoDigital||50)}%</div></div></div><div className="mt-2 flex gap-1 overflow-hidden">{(redeSocial.tendencias||[]).slice(0,3).map(t=><span key={t} className="ui-chip truncate">{t}</span>)}</div><div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">{topPosts.map(p=><article key={p.id} className="rounded-xl border border-border bg-panel/40 p-3"><div className="text-[10px] font-black uppercase text-info">{mediaNames[p.autorId]||communityNames[p.autorId]||p.autor||'Pulso'}</div><p className="mt-1 text-xs font-bold leading-relaxed text-text/80">{p.texto}</p></article>)}{!topPosts.length&&<div className="text-sm text-muted">A imprensa ainda está formando a narrativa.</div>}</div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl border border-border bg-panel/40 p-3"><div className="ui-data-label">Compromissos futuros</div><div className="mt-1 text-lg font-black text-warning">{consequenciasPendentes.length}</div></div><div className="rounded-xl border border-border bg-panel/40 p-3"><div className="ui-data-label">Seguidores</div><div className="mt-1 text-lg font-black">{((redeSocial.seguidores||0)/1000000).toFixed(1)} mi</div></div></div></div>
      </section>
    </div>}
    {showAgenda&&<PresidentialAgendaModal onClose={()=>setShowAgenda(false)}/>}
    {showVice&&eleicao?.viceAtual&&<CharacterDossierModal person={eleicao.viceAtual} onClose={()=>setShowVice(false)} eyebrow="Vice-Presidência da República" subtitle={`${eleicao.viceAtual.cargo||'Vice-Presidente'} · ${eleicao.viceAtual.partidoId?.toUpperCase()||''}`} imageKey={eleicao.viceAtual.avatar} stats={[{label:'Relação',value:Math.round(eleicao.viceAtual.relacao||50),suffix:'%'},{label:'Lealdade',value:eleicao.viceAtual.lealdade||50,suffix:'%'},{label:'Peso eleitoral',value:eleicao.viceAtual.pesoEleitoral||50}]}/>}
  </div>;
}
function Mini({icon:Icon,label,value,tone}){return <div className="rounded-2xl border border-border bg-card/65 p-3"><div className="flex items-center gap-2"><GameIcon icon={Icon} size="sm" tone="neutral"/><div className="min-w-0"><div className="ui-data-label truncate">{label}</div><div className={`mt-0.5 truncate text-lg font-black ${tone}`}>{value}</div></div></div></div>}
