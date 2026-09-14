import React, { useMemo, useState } from 'react';
import { CalendarRange, Trophy, Film, Syringe, Cpu, BookOpen, Play, AlertTriangle, XCircle, Wheat } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { eventosNacionaisSeed } from '../data/seed/eventosNacionais';
import { toast } from './sonner';

const iconByCategory = { Esporte:Trophy, Cultura:Film, Saúde:Syringe, Ciência:Cpu, Educação:BookOpen, Agricultura:Wheat };
const modeLabel = { sediar:'Sediar', criar:'Criar no país', participar:'Participar' };

export default function NationalEventsPanel({ ministerioId }) {
  const { eventosNacionais=[], iniciarEventoNacional, cancelarEventoNacional, cargos=[], nomeacoes=[] } = useGameStore();
  const [selectedId, setSelectedId] = useState(null);
  const [strategy, setStrategy] = useState('legado');
  const catalog = useMemo(()=>ministerioId==='m_casacivil'?eventosNacionaisSeed:eventosNacionaisSeed.filter(e=>e.ministerioId===ministerioId),[ministerioId]);
    const selected = catalog.find(e=>e.id===selectedId) || catalog[0];
  const supportNames = (selected?.apoios||[]).map(id=>cargos.find(c=>c.id===id)?.nome||id);
  const missing = (selected?.apoios||[]).filter(id=>!nomeacoes.some(n=>n.cargoId===id));
  const strategyAdjust = { legado:{custo:1.05,risco:-10,prestigio:1}, prestigio:{custo:1.20,risco:8,prestigio:6}, austero:{custo:.82,risco:4,prestigio:-3} }[strategy] || {custo:1,risco:0,prestigio:0};
  const projected = selected ? { custo:Math.round(selected.custo*strategyAdjust.custo), risco:Math.max(0,Math.min(100,selected.risco+strategyAdjust.risco)), prestigio:Math.max(1,selected.prestigio+strategyAdjust.prestigio) } : null;
  if(!catalog.length) return <div className="rounded-2xl border border-dashed border-border bg-panel/25 p-8 text-center text-sm text-muted">Esta pasta não possui grandes eventos próprios no catálogo atual.</div>;
  const start=()=>{const r=iniciarEventoNacional(selected.id,strategy); if(!r.ok) toast.error(r.motivo); else toast.success(`${selected.titulo} entrou em preparação.`)};
  return <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
    <div className="space-y-3">
      <div><div className="ui-kicker">Portfólio nacional</div><h3 className="text-xl font-black text-text">Eventos e candidaturas</h3><p className="mt-1 text-sm text-muted">Projetos especiais com começo, preparação, custo, risco e legado. Eles avançam mês a mês.</p></div>
      <div className="space-y-2">{catalog.map(evt=>{const Icon=iconByCategory[evt.categoria]||CalendarRange; const running=eventosNacionais.find(e=>e.id===evt.id&&!['cancelado'].includes(e.status)); return <button key={evt.id} onClick={()=>setSelectedId(evt.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id===evt.id?'border-success/40 bg-success/5':'border-border bg-card/65 hover:border-muted/60'}`}><div className="flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-panel"><Icon size={18} className="text-info"/></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-text">{evt.titulo}</div><div className="mt-1 text-[10px] font-black uppercase tracking-wider text-muted">{modeLabel[evt.modo]} · {evt.categoria}</div></div>{running&&<span className={`ui-chip ${running.status==='concluido'?'text-success':'text-warning'}`}>{running.status==='concluido'?'Concluído':`${running.progresso||0}%`}</span>}</div></div></div></button>})}</div>
    </div>

    {selected&&<div className="rounded-3xl border border-border bg-card/75 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="ui-chip border-info/25 bg-info/5 text-info">{modeLabel[selected.modo]}</span><h3 className="mt-3 text-2xl font-black text-text">{selected.titulo}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-text/75">{selected.descricao}</p></div><div className="grid h-16 w-16 place-items-center rounded-2xl border border-warning/20 bg-warning/5 text-warning"><CalendarRange size={28}/></div></div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4"><Metric label="Duração" value={`${selected.duracao} meses`}/><Metric label="Custo estimado" value={`R$ ${projected.custo} mi`}/><Metric label="Prestígio" value={`+${projected.prestigio}`}/><Metric label="Risco" value={`${projected.risco}%`}/></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-success/20 bg-success/5 p-4"><div className="text-[10px] font-black uppercase tracking-wider text-success">Legado possível</div><p className="mt-2 text-sm text-text/75">{selected.legado}</p></div><div className="rounded-2xl border border-warning/20 bg-warning/5 p-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-warning"><AlertTriangle size={13}/> Risco político</div><p className="mt-2 text-sm text-text/75">{selected.alerta}</p></div></div>
      <div className="mt-5"><div className="mb-2 text-[10px] font-black uppercase tracking-wider text-muted">Estratégia presidencial</div><div className="grid gap-2 md:grid-cols-3">{[
        ['legado','Legado primeiro','Mais governança e infraestrutura reutilizável.'],
        ['prestigio','Prestígio máximo','Mais caro, mais visível e mais arriscado.'],
        ['austero','Orçamento contido','Escopo menor e menor retorno de imagem.'],
      ].map(([id,title,desc])=><button key={id} onClick={()=>setStrategy(id)} className={`rounded-xl border p-3 text-left ${strategy===id?'border-success/40 bg-success/5':'border-border bg-panel/40'}`}><div className="text-xs font-black text-text">{title}</div><div className="mt-1 text-[10px] leading-relaxed text-muted">{desc}</div></button>)}</div></div>
      <div className="mt-5 rounded-2xl border border-border bg-panel/45 p-4"><div className="text-[10px] font-black uppercase tracking-wider text-muted">Pastas de apoio</div><div className="mt-2 flex flex-wrap gap-2">{supportNames.map((name,i)=><span key={name} className={`ui-chip ${missing.includes(selected.apoios[i])?'border-danger/25 text-danger':'border-success/25 text-success'}`}>{name}{missing.includes(selected.apoios[i])?' · vago':' · pronto'}</span>)}</div>{missing.length>0&&<p className="mt-3 text-xs text-warning">Você pode iniciar mesmo assim, mas a ausência de apoio reduz ritmo e chance de sucesso.</p>}</div>
      {(()=>{const running=eventosNacionais.find(e=>e.id===selected.id&&e.status!=='cancelado'); if(!running) return <button onClick={start} className="ui-btn-primary mt-5 w-full justify-center"><Play size={16}/> Iniciar fase de preparação</button>; if(running.status==='concluido') return <div className="mt-5 rounded-xl border border-success/25 bg-success/5 p-4 text-sm font-bold text-success">Projeto concluído · resultado: {running.resultado==='sucesso'?'sucesso e legado':'execução contestada'}</div>; return <div className="mt-5"><div className="mb-2 flex items-center justify-between text-xs font-bold text-muted"><span>Preparação em andamento</span><span>{running.progresso||0}% · {running.mesesRestantes} meses</span></div><div className="h-2 overflow-hidden rounded-full bg-panel"><div className="h-full bg-info" style={{width:`${running.progresso||0}%`}}/></div><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted">Investido: R$ {running.investimento||0} mi</span><button onClick={()=>{if(window.confirm('Cancelar este projeto?')) cancelarEventoNacional(running.id)}} className="ui-btn-secondary hover:border-danger hover:text-danger"><XCircle size={15}/> Cancelar</button></div></div>})()}
    </div>}
  </div>;
}

function Metric({label,value}){return <div className="rounded-xl border border-border bg-panel/45 p-3"><div className="text-[9px] font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-1 text-sm font-black text-text">{value}</div></div>}
