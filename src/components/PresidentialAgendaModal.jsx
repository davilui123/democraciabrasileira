import React, { useMemo, useState } from 'react';
import {
  X, CalendarDays, UsersRound, Factory, FlaskConical, Radio, Landmark, Building2,
  BriefcaseBusiness, Plane, Clock3, Save, ChevronLeft, ChevronRight, Mail, MapPin,
  CheckCircle2, XCircle, CalendarClock, LockKeyhole, AlertTriangle, Newspaper, Handshake
} from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { agendaPresidencialOpcoesSeed, AGENDA_SLOTS_MENSAIS } from '../data/seed/agendaPresidencial.js';
import GameIcon from './GameIcon';
import { toast } from './sonner';

const iconMap={ruas:UsersRound,producao:Factory,governadores:Landmark,ciencia:FlaskConical,imprensa:Radio,congresso:Building2,empresas:BriefcaseBusiness,gabinete:CalendarDays};
const toneMap={domestica:'success',economica:'warning',federativa:'info',estrategica:'violet',comunicacao:'danger',politica:'info',governo:'neutral'};
const typeIcon={internacional:Plane,midia:Newspaper,governador:Landmark,empresa:BriefcaseBusiness,institucional:Building2,economia:Factory};
const typeTone={internacional:'warning',midia:'danger',governador:'info',empresa:'success',institucional:'violet',economia:'warning'};
const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const week=['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
const priorityClass={urgente:'text-danger border-danger/30 bg-danger/5',alta:'text-warning border-warning/30 bg-warning/5',media:'text-info border-info/25 bg-info/5'};

const dateLabel=(iso)=>{if(!iso)return 'Data a definir';const d=new Date(`${iso}T12:00:00`);return `${String(d.getDate()).padStart(2,'0')} ${meses[d.getMonth()].slice(0,3).toUpperCase()} ${d.getFullYear()}`;};
const keyMonth=(iso)=>iso?.slice(0,7);

export default function PresidentialAgendaModal({onClose}){
  const {
    agendaMensal={},agendaCalendario={compromissos:[],convites:[]},turno=1,dataAtual,
    definirAgendaMensal,aceitarConviteAgenda,recusarConviteAgenda,remarcarCompromissoAgenda,cancelarCompromissoAgenda,
    consequenciasPendentes=[]
  }=useGameStore();
  const [tab,setTab]=useState('calendario');
  const [selectedPautas,setSelectedPautas]=useState(agendaMensal.selecionados||[]);
  const [monthOffset,setMonthOffset]=useState(0);
  const [selectedItem,setSelectedItem]=useState(null);
  const [invitePage,setInvitePage]=useState(0);

  const baseDate=useMemo(()=>new Date(dataAtual||new Date(2023,0,1)),[dataAtual]);
  const viewDate=useMemo(()=>new Date(baseDate.getFullYear(),baseDate.getMonth()+monthOffset,1),[baseDate,monthOffset]);
  const viewTurn=turno+monthOffset;
  const monthKey=`${viewDate.getFullYear()}-${String(viewDate.getMonth()+1).padStart(2,'0')}`;
  const dias=useMemo(()=>{
    const first=new Date(viewDate.getFullYear(),viewDate.getMonth(),1).getDay();
    const count=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate();
    return Array.from({length:42},(_,i)=>{const dia=i-first+1;return dia>=1&&dia<=count?dia:null});
  },[viewDate]);
  const compromissos=(agendaCalendario.compromissos||[]).filter(c=>keyMonth(c.dataISO)===monthKey&&['confirmado','realizado'].includes(c.status));
  const propostas=(agendaCalendario.convites||[]).filter(c=>keyMonth(c.dataISO)===monthKey&&c.status==='pendente');
  const abertas=(agendaCalendario.convites||[]).filter(c=>c.status==='pendente'&&(c.prazoTurno??999)>=turno).sort((a,b)=>(a.turnoProposto||999)-(b.turnoProposto||999)||(a.dia||1)-(b.dia||1));
  const proximos=(agendaCalendario.compromissos||[]).filter(c=>c.status==='confirmado'&&c.turno>=turno).sort((a,b)=>a.turno-b.turno||(a.dia||1)-(b.dia||1)).slice(0,5);
  const inviteSlice=abertas.slice(invitePage*4,invitePage*4+4);
  const inviteMax=Math.max(0,Math.ceil(abertas.length/4)-1);

  const togglePauta=id=>setSelectedPautas(s=>s.includes(id)?s.filter(x=>x!==id):s.length<AGENDA_SLOTS_MENSAIS?[...s,id]:s);
  const savePautas=()=>{definirAgendaMensal(selectedPautas);toast.success(`Pautas do mês salvas · ${selectedPautas.length}/${AGENDA_SLOTS_MENSAIS}.`);};
  const accept=(id)=>{const r=aceitarConviteAgenda(id);r.ok?(toast.success('Compromisso confirmado na agenda.'),setSelectedItem(r.compromisso)):toast.error(r.motivo)};
  const reject=(id)=>{const r=recusarConviteAgenda(id);r.ok?(toast.warning('Convite recusado.'),setSelectedItem(null)):toast.error(r.motivo)};
  const move=(id,d)=>{const r=remarcarCompromissoAgenda(id,d);r.ok?toast.success('Compromisso remarcado.'):toast.error(r.motivo)};
  const cancel=(id)=>{if(!window.confirm('Cancelar este compromisso? A decisão pode gerar custo político ou diplomático.'))return;const r=cancelarCompromissoAgenda(id);r.ok?(toast.warning('Compromisso cancelado.'),setSelectedItem(null)):toast.error(r.motivo)};

  return <div className="fixed inset-0 z-[110] grid place-items-center bg-black/75 p-2 backdrop-blur-lg md:p-4" onMouseDown={e=>{if(e.target===e.currentTarget)onClose?.()}}>
    <section className="flex h-[min(94vh,860px)] w-full max-w-[1380px] flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-elevation-5">
      <header className="shrink-0 border-b border-border bg-panel/85 px-5 pt-4">
        <div className="flex items-start justify-between gap-4"><div><div className="ui-kicker">Gabinete Presidencial</div><h2 className="mt-1 text-xl font-black">Agenda Presidencial</h2><p className="mt-1 text-xs text-muted">Datas, convites e prioridades. Um compromisso confirmado ocupa o calendário; uma pauta orienta o mês.</p></div><button onClick={onClose} className="ui-btn-secondary px-3"><X size={17}/></button></div>
        <div className="mt-4 flex gap-1 rounded-xl border border-border bg-bg/45 p-1">{[
          ['calendario',CalendarDays,'Calendário'],['convites',Mail,`Convites${abertas.length?` (${abertas.length})`:''}`],['pautas',Landmark,'Pautas do mês']
        ].map(([id,Icon,label])=><button key={id} onClick={()=>setTab(id)} className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg text-[10px] font-black uppercase tracking-wider ${tab===id?'bg-card text-text shadow-elevation-1':'text-muted'}`}><Icon size={14}/>{label}</button>)}</div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden p-4">
        {tab==='calendario'&&<div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1fr_310px]">
          <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-panel/35 p-3">
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3"><button onClick={()=>setMonthOffset(o=>Math.max(0,o-1))} disabled={monthOffset<=0} className="ui-btn-secondary px-3"><ChevronLeft size={15}/></button><div className="text-center"><div className="ui-kicker">{monthOffset===0?'Mês atual':`+${monthOffset} mês${monthOffset>1?'es':''}`}</div><div className="text-lg font-black">{meses[viewDate.getMonth()]} {viewDate.getFullYear()}</div></div><button onClick={()=>setMonthOffset(o=>Math.min(12,o+1))} className="ui-btn-secondary px-3"><ChevronRight size={15}/></button></div>
            <div className="grid shrink-0 grid-cols-7 gap-1">{week.map(w=><div key={w} className="py-1 text-center text-[8px] font-black tracking-wider text-muted">{w}</div>)}</div>
            <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1">{dias.map((dia,i)=>{const itens=dia?[...compromissos.filter(c=>(c.dia||1)===dia),...propostas.filter(c=>(c.dia||1)===dia)]:[];return <div key={i} className={`min-h-0 rounded-lg border p-1.5 ${dia?'border-border bg-bg/45':'border-transparent bg-transparent'} ${viewTurn===turno&&dia===1?'ring-1 ring-success/35':''}`}><div className="text-[9px] font-black text-muted">{dia||''}</div><div className="mt-1 space-y-1">{itens.slice(0,2).map(item=>{const pending=item.status==='pendente';return <button key={item.id} onClick={()=>setSelectedItem(item)} className={`block w-full truncate rounded px-1.5 py-1 text-left text-[8px] font-black ${pending?'border border-dashed border-warning/40 bg-warning/5 text-warning':'bg-primary/12 text-text'}`}>{pending?'? ':''}{item.titulo}</button>})}{itens.length>2&&<div className="px-1 text-[8px] font-black text-info">+{itens.length-2}</div>}</div></div>})}</div>
          </section>
          <aside className="flex min-h-0 flex-col gap-3">
            {selectedItem?<AgendaDetail item={selectedItem} turno={turno} onAccept={accept} onReject={reject} onMove={move} onCancel={cancel}/>:<div className="rounded-2xl border border-border bg-panel/40 p-4"><div className="ui-kicker">Próximos compromissos</div><div className="mt-3 space-y-2">{proximos.map(c=><button key={c.id} onClick={()=>{setSelectedItem(c);setMonthOffset(Math.max(0,c.turno-turno))}} className="w-full rounded-xl border border-border bg-bg/45 p-3 text-left hover:border-info/30"><div className="flex items-center justify-between gap-2"><span className="text-[9px] font-black text-warning">{dateLabel(c.dataISO)}</span><span className="ui-chip">{c.tipo}</span></div><div className="mt-1 text-xs font-black">{c.titulo}</div><div className="mt-1 truncate text-[10px] text-muted">{c.local}</div></button>)}{!proximos.length&&<div className="text-xs text-muted">Nenhum compromisso futuro confirmado.</div>}</div></div>}
            <div className="rounded-2xl border border-border bg-panel/40 p-4"><div className="flex items-center justify-between"><div className="ui-kicker">Pressão da agenda</div><CalendarClock size={16} className="text-warning"/></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl border border-border bg-bg/45 p-3"><div className="ui-data-label">Convites abertos</div><div className="mt-1 text-2xl font-black text-warning">{abertas.length}</div></div><div className="rounded-xl border border-border bg-bg/45 p-3"><div className="ui-data-label">Compromissos futuros</div><div className="mt-1 text-2xl font-black">{proximos.length}</div></div></div><p className="mt-3 text-[10px] leading-relaxed text-muted">Ignorar convite não é neutro: imprensa, governadores e governos estrangeiros podem reagir ao silêncio do Planalto.</p></div>
          </aside>
        </div>}

        {tab==='convites'&&<div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1fr_330px]">
          <section className="grid min-h-0 grid-cols-1 content-start gap-3 md:grid-cols-2">{inviteSlice.map(c=>{const Icon=typeIcon[c.tipo]||Mail;return <button key={c.id} onClick={()=>setSelectedItem(c)} className={`min-h-[190px] rounded-2xl border p-4 text-left transition hover:border-info/35 ${c.prioridade==='urgente'?'border-danger/35 bg-danger/5':'border-border bg-panel/35'}`}><div className="flex items-start justify-between gap-3"><GameIcon icon={Icon} tone={typeTone[c.tipo]||'info'} size="sm"/><span className={`rounded-full border px-2 py-1 text-[8px] font-black uppercase ${priorityClass[c.prioridade]||priorityClass.media}`}>{c.prioridade||'média'}</span></div><div className="mt-3 text-sm font-black leading-tight">{c.titulo}</div><div className="mt-1 text-[10px] font-black uppercase tracking-wider text-info">{dateLabel(c.dataISO)} · {c.origem}</div><p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">{c.descricao}</p><div className="mt-3 flex items-center gap-1 text-[9px] font-bold text-muted"><Clock3 size={11}/> Responder até o mês {c.prazoTurno}</div></button>})}{!inviteSlice.length&&<div className="col-span-full grid h-full place-items-center rounded-2xl border border-dashed border-border text-center"><div><Mail size={34} className="mx-auto text-muted/50"/><div className="mt-3 font-black text-muted">Caixa de convites vazia</div><p className="mt-1 text-xs text-muted">Imprensa, governadores, empresas e Itamaraty podem procurar o Presidente.</p></div></div>}</section>
          <aside className="flex min-h-0 flex-col gap-3">{selectedItem?.status==='pendente'?<AgendaDetail item={selectedItem} turno={turno} onAccept={accept} onReject={reject} onMove={move} onCancel={cancel}/>:<div className="rounded-2xl border border-border bg-panel/40 p-4"><div className="ui-kicker">Como funciona</div><h3 className="mt-1 text-lg font-black">O convite vem até você</h3><p className="mt-3 text-xs leading-relaxed text-muted">Você não precisa inventar todos os compromissos. Uma tragédia pode fazer um governador pedir sua presença; uma emissora pode convocar uma sabatina; uma empresa pode pedir audiência; outro chefe de governo pode propor uma data meses à frente.</p></div>}
            <div className="mt-auto flex items-center justify-between rounded-xl border border-border bg-bg/45 p-2"><button disabled={invitePage<=0} onClick={()=>setInvitePage(p=>Math.max(0,p-1))} className="ui-btn-secondary px-3"><ChevronLeft size={14}/></button><span className="text-[9px] font-black text-muted">{inviteMax?`${invitePage+1}/${inviteMax+1}`:`${abertas.length} convite(s)`}</span><button disabled={invitePage>=inviteMax} onClick={()=>setInvitePage(p=>Math.min(inviteMax,p+1))} className="ui-btn-secondary px-3"><ChevronRight size={14}/></button></div>
          </aside>
        </div>}

        {tab==='pautas'&&<div className="grid h-full min-h-0 gap-4 lg:grid-cols-[1fr_300px]">
          <section className="grid min-h-0 grid-cols-2 grid-rows-4 gap-2 lg:grid-cols-4 lg:grid-rows-2">{agendaPresidencialOpcoesSeed.map(o=>{const active=selectedPautas.includes(o.id);const Icon=iconMap[o.id]||CalendarDays;return <button key={o.id} onClick={()=>togglePauta(o.id)} className={`min-h-0 rounded-2xl border p-3 text-left transition ${active?'border-success/45 bg-success/7':'border-border bg-panel/35 hover:border-info/30'}`}><div className="flex items-start justify-between gap-2"><GameIcon icon={Icon} tone={toneMap[o.tipo]||'info'} size="sm"/><span className={`ui-chip ${active?'text-success':'text-muted'}`}>{active?'ATIVA':o.tipo}</span></div><div className="mt-2 text-xs font-black">{o.titulo}</div><div className="mt-1 text-[9px] font-black uppercase tracking-wider text-info">{o.subtitulo}</div><p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-muted">{o.descricao}</p></button>})}</section>
          <aside className="flex min-h-0 flex-col gap-3"><div className="rounded-2xl border border-border bg-panel/40 p-4"><div className="flex items-center justify-between"><div className="ui-kicker">Prioridades políticas</div><span className={`text-2xl font-black ${selectedPautas.length===AGENDA_SLOTS_MENSAIS?'text-warning':'text-success'}`}>{selectedPautas.length}/{AGENDA_SLOTS_MENSAIS}</span></div><p className="mt-3 text-xs leading-relaxed text-muted">Pauta não é compromisso datado. Ela define onde o Presidente concentra presença e capital político ao longo do mês.</p><div className="mt-3 grid grid-cols-4 gap-1">{Array.from({length:AGENDA_SLOTS_MENSAIS}).map((_,i)=><div key={i} className={`h-2 rounded-full ${i<selectedPautas.length?'bg-warning':'bg-bg border border-border'}`}/>)}</div></div><div className="min-h-0 flex-1 rounded-2xl border border-border bg-panel/40 p-4"><div className="ui-kicker">Compromissos gerados</div><div className="mt-3 space-y-2">{consequenciasPendentes.slice(0,4).map(c=><div key={c.id} className="rounded-xl border border-border bg-bg/45 p-3"><div className="text-xs font-black">{c.titulo}</div><div className="mt-1 text-[10px] text-muted">Pode cobrar preço em mês futuro.</div></div>)}{!consequenciasPendentes.length&&<div className="text-xs text-muted">Nenhuma consequência futura pendente.</div>}</div></div></aside>
        </div>}
      </main>

      <footer className="flex shrink-0 items-center justify-between border-t border-border bg-panel/60 px-5 py-3"><span className="text-xs text-muted">{tab==='calendario'?`${compromissos.length} compromisso(s) confirmado(s) em ${meses[viewDate.getMonth()]}`:tab==='convites'?`${abertas.length} convite(s) aguardando decisão`:`${selectedPautas.length}/${AGENDA_SLOTS_MENSAIS} pautas escolhidas`}</span>{tab==='pautas'?<button onClick={savePautas} className="ui-btn-primary"><Save size={15}/> Salvar pautas</button>:<button onClick={onClose} className="ui-btn-secondary">Fechar agenda</button>}</footer>
    </section>
  </div>;
}

function AgendaDetail({item,turno,onAccept,onReject,onMove,onCancel}){
  const Icon=typeIcon[item.tipo]||CalendarDays;
  const pendente=item.status==='pendente'; const confirmado=item.status==='confirmado'; const futuro=(item.turno??item.turnoProposto??turno)>=turno;
  return <div className="rounded-2xl border border-border bg-panel/45 p-4"><div className="flex items-start justify-between gap-3"><GameIcon icon={Icon} tone={typeTone[item.tipo]||'info'} size="md"/><span className={`ui-chip ${item.prioridade==='urgente'?'text-danger':item.prioridade==='alta'?'text-warning':'text-info'}`}>{item.status}</span></div><div className="mt-4 text-base font-black leading-tight">{item.titulo}</div><div className="mt-1 text-[10px] font-black uppercase tracking-wider text-info">{item.subtitulo}</div><div className="mt-4 space-y-2 text-xs"><div className="flex items-center gap-2 text-text"><CalendarClock size={14} className="text-warning"/><b>{dateLabel(item.dataISO)}</b></div><div className="flex items-center gap-2 text-muted"><MapPin size={14}/>{item.local||'Local a confirmar'}</div><div className="flex items-center gap-2 text-muted"><Handshake size={14}/>{item.origem||'Gabinete Presidencial'}</div></div><p className="mt-4 text-xs leading-relaxed text-muted">{item.descricao}</p>{!item.flexivel&&<div className="mt-3 flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 p-2 text-[10px] text-warning"><LockKeyhole size={12}/> Data protocolar ou previamente acordada.</div>}{pendente&&<div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>onAccept(item.id)} className="ui-btn-primary justify-center"><CheckCircle2 size={14}/> Aceitar</button><button onClick={()=>onReject(item.id)} className="ui-btn-secondary justify-center"><XCircle size={14}/> Recusar</button></div>}{confirmado&&futuro&&item.flexivel&&<><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>onMove(item.id,-1)} className="ui-btn-secondary justify-center"><ChevronLeft size={14}/> 1 mês</button><button onClick={()=>onMove(item.id,1)} className="ui-btn-secondary justify-center">1 mês <ChevronRight size={14}/></button></div><button onClick={()=>onCancel(item.id)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-danger/25 bg-danger/5 px-3 py-2 text-xs font-black text-danger"><AlertTriangle size={14}/> Cancelar compromisso</button></>}</div>;
}
