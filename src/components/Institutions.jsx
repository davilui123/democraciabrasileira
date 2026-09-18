import React, { useMemo, useState } from 'react';
import { Scale, ShieldCheck, Banknote, Gavel, Vote, CheckCircle2, XCircle, Network, BookOpen, Crown, Star, UsersRound, ChevronLeft, ChevronRight } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import PoliticalAvatar from './PoliticalAvatar';
import GameIcon from './GameIcon';
import CharacterDossierModal from './CharacterDossier';
import { toast } from './sonner';

const tone=v=>v>=70?'text-success':v>=45?'text-warning':'text-danger';
function Meter({label,value}){return <div><div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-muted"><span>{label}</span><span>{Math.round(value||0)}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg"><div className="h-full bg-info" style={{width:`${Math.max(0,Math.min(100,value||0))}%`}}/></div></div>}

function CourtSeat({member,onOpen,vacancy=false}){
  if(vacancy)return <div className="flex min-h-[184px] min-w-0 flex-col rounded-2xl border border-dashed border-warning/35 bg-warning/5 p-4"><div className="grid h-11 w-11 place-items-center rounded-xl border border-warning/25 text-warning"><Gavel size={18}/></div><div className="mt-4 text-sm font-black text-warning">Cadeira vaga</div><div className="mt-2 text-[10px] leading-relaxed text-muted">Indicação presidencial e aprovação do Senado.</div><div className="mt-auto pt-4 text-[9px] font-black uppercase tracking-wider text-warning/80">1 vaga no colegiado</div></div>;
  const role=member.funcao==='Presidente'?'Presidente':member.funcao==='Vice-Presidente'?'Vice-Presidente':member.funcao==='Decano'?'Decano':null;
  return <button title={member.nome} onClick={()=>onOpen(member)} className={`flex min-h-[184px] min-w-0 flex-col rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-info/35 hover:shadow-elevation-1 ${role?'border-warning/25 bg-warning/5':'border-border bg-panel/38'}`}>
    <div className="flex items-start justify-between gap-3"><PoliticalAvatar name={member.nome} seed={member.avatar||member.id} imageKey={member.avatar} size={50}/>{role==='Presidente'?<Crown size={16} className="mt-1 shrink-0 text-warning"/>:role==='Decano'?<Star size={16} className="mt-1 shrink-0 text-warning"/>:null}</div>
    <div className="mt-3 min-h-[38px] text-sm font-black leading-[1.15] text-text">{member.nome}</div>
    {role?<div className="mt-2"><span className="inline-flex max-w-full whitespace-normal rounded-full border border-warning/25 bg-warning/10 px-2.5 py-1 text-[8px] font-black uppercase leading-tight tracking-[.04em] text-warning">{role}</span></div>:<div className="mt-2 text-[8px] font-black uppercase tracking-[.08em] text-muted/70">{member.funcao||'Ministro'}</div>}
    <div className="mt-2 text-[10px] leading-snug text-muted">{member.perfil}</div>
    <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted/70">Desde {member.posse||'—'}</div>
    <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3 text-[10px]"><span className="text-muted">Independência</span><b className={tone(member.independencia)}>{member.independencia}</b></div>
  </button>;
}

function Turma({title,members,onOpen,index,total,onPrev,onNext}){
  const seats=[...members,...Array.from({length:Math.max(0,5-members.length)},(_,i)=>({id:`${title}_vaga_${i}`,vaga:true}))].slice(0,5);
  return <section className="rounded-2xl border border-border bg-card/55 p-4">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="min-w-0"><div className="ui-kicker">{title}</div><div className="mt-1 text-[10px] text-muted">Colegiado de cinco cadeiras · {index+1} de {total}</div></div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={onPrev} aria-label="Turma anterior" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-panel/70 text-muted transition hover:border-info/35 hover:text-text"><ChevronLeft size={17}/></button>
        <div className="hidden items-center gap-1.5 sm:flex">{Array.from({length:total}).map((_,i)=><span key={i} className={`h-1.5 rounded-full transition-all ${i===index?'w-5 bg-info':'w-1.5 bg-border'}`}/>)}</div>
        <button type="button" onClick={onNext} aria-label="Próxima turma" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-panel/70 text-muted transition hover:border-info/35 hover:text-text"><ChevronRight size={17}/></button>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">{seats.map(m=><CourtSeat key={m.id} member={m} vacancy={m.vaga} onOpen={onOpen}/>)}</div>
  </section>;
}

export default function Institutions({initialTab='stf'}){
  const {stf,instituicoes=[],candidatosSTF=[],indicarMinistroSTF,votarIndicacaoSTF,oposicao,congresso,institucional,economia,controleLeis={casosSTF:[],auditoriasTCU:[],historico:[]},apresentarDefesaLeiSTF,apresentarPlanoAdequacaoTCU,capitalPolitico}=useGameStore();
  const [tab,setTab]=useState(initialTab);
  const [candidate,setCandidate]=useState(null);
  const [dossier,setDossier]=useState(null);
  const [turmaAtiva,setTurmaAtiva]=useState(0);
  const corte=stf?.corte||[];
  const vagas=Math.max(0,11-corte.length);
  const pending=stf?.indicacaoPendente;
  const presidente=corte.find(m=>m.funcao==='Presidente')||corte[0];
  const turma1=corte.filter(m=>m.turma==='1ª Turma');
  const turma2=corte.filter(m=>m.turma==='2ª Turma');
  const turmas=[{title:'1ª Turma',members:turma1},{title:'2ª Turma',members:turma2}];
  const turmaVisivel=turmas[turmaAtiva]||turmas[0];
  const navegarTurma=(delta)=>setTurmaAtiva(current=>(current+delta+turmas.length)%turmas.length);
  const indicar=(c)=>{const r=indicarMinistroSTF(c.id);if(r.ok){toast.success(`${c.nome} foi enviado à sabatina no Senado.`);setCandidate(null)}else toast.error(r.motivo)};
  const votar=()=>{const r=votarIndicacaoSTF();r.ok?(r.aprovado?toast.success(`Indicação aprovada por ${r.votos} votos.`):toast.error(`Indicação rejeitada: ${r.votos} votos.`)):toast.error(r.motivo)};
  const defenderLei=(id)=>{const r=apresentarDefesaLeiSTF?.(id);r?.ok?toast.success('Defesa institucional protocolada no STF.'):toast.error(r?.motivo||'Não foi possível apresentar a defesa.');};
  const adequarTCU=(id)=>{const r=apresentarPlanoAdequacaoTCU?.(id);r?.ok?toast.success('Plano de adequação entregue ao TCU.'):toast.error(r?.motivo||'Não foi possível entregar o plano.');};
  const casosLei=[...(controleLeis?.casosSTF||[])].sort((a,b)=>(b.abertoNoTurno||0)-(a.abertoNoTurno||0));
  const auditoriasLei=[...(controleLeis?.auditoriasTCU||[])].sort((a,b)=>(b.abertoNoTurno||0)-(a.abertoNoTurno||0));
  const casosAbertos=casosLei.filter(c=>c.status!=='julgado');
  const auditoriasAbertas=auditoriasLei.filter(a=>a.status!=='decidida');
  return <div className="ui-page h-full min-h-0 overflow-hidden">
    <div className="mb-3 flex items-center justify-between"><div className="ui-tabs">{[['stf','STF'],['leis','Leis sob controle'],['controles','Controles'],['oposicao','Oposição']].map(([id,l])=><button key={id} onClick={()=>setTab(id)} className={`ui-tab ${tab===id?'ui-tab-active':''}`}>{l}</button>)}</div><div className="text-[10px] font-bold uppercase tracking-wider text-muted">Instituições não obedecem ao Presidente · elas reagem, limitam e legitimam</div></div>

    {tab==='stf'&&<div className="grid h-[calc(100%-46px)] min-h-0 gap-3 xl:grid-cols-[1.25fr_.75fr]">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/65"><header className="flex shrink-0 items-center justify-between border-b border-border p-4"><div><div className="ui-kicker">Supremo Tribunal Federal</div><h2 className="mt-1 text-xl font-black">Plenário, antiguidade e Turmas</h2><p className="mt-1 text-[10px] text-muted">Presidência em destaque; clique em qualquer cadeira para abrir o dossiê biográfico.</p></div><div className="text-right"><div className="ui-data-label">Tensão com Planalto</div><div className={`text-2xl font-black ${tone(100-(stf?.tensaoInstitucional||0))}`}>{Math.round(stf?.tensaoInstitucional||0)}</div></div></header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mx-auto mb-3 max-w-[260px]">{presidente&&<CourtSeat member={presidente} onOpen={setDossier}/>}</div>
          <Turma title={turmaVisivel.title} members={turmaVisivel.members} onOpen={setDossier} index={turmaAtiva} total={turmas.length} onPrev={()=>navegarTurma(-1)} onNext={()=>navegarTurma(1)}/>
          <div className="mt-3 rounded-xl border border-border bg-panel/35 p-3 text-[10px] leading-relaxed text-muted">O Plenário mantém a Presidência em destaque. As Turmas são exibidas uma por vez para preservar nomes, funções e perfis dos ministros; use as setas para alternar entre os colegiados. A campanha começa com uma vaga, preenchida mediante indicação presidencial e aprovação do Senado.</div>
        </div>
      </section>
      <aside className="min-h-0 overflow-y-auto rounded-2xl border border-border bg-card/65 p-4"><div className="ui-kicker">Controle constitucional</div><h3 className="mt-1 text-lg font-black">Processos e indicação</h3>{pending?<div className="mt-4 rounded-2xl border border-info/30 bg-info/5 p-4"><div className="text-[9px] font-black uppercase text-info">Indicação no Senado</div><div className="mt-2 flex items-center gap-3"><PoliticalAvatar name={pending.nome} seed={pending.avatar||pending.id} size={52}/><div><div className="font-black">{pending.nome}</div><div className="text-xs text-muted">projeção {pending.votosProjetados}/81 · precisa de 41</div></div></div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={votar} className="ui-btn-primary justify-center"><Vote size={15}/> Submeter ao Plenário</button><button onClick={()=>setDossier(pending)} className="ui-btn-secondary justify-center"><BookOpen size={14}/> Dossiê</button></div></div>:vagas>0?<div className="mt-4 rounded-2xl border border-warning/25 bg-warning/5 p-4"><div className="font-black text-warning">Há {vagas} vaga(s) no Supremo.</div><p className="mt-2 text-xs text-muted">A escolha muda a Corte por muitos anos. Um nome fácil de aprovar pode ser menos independente; um jurista prestigiado pode exigir mais capital político.</p><button onClick={()=>setCandidate(candidatosSTF[0]||null)} className="ui-btn-secondary mt-3">Abrir lista de indicáveis</button></div>:<div className="mt-4 rounded-2xl border border-success/20 bg-success/5 p-4 text-sm text-success"><CheckCircle2 className="mr-2 inline" size={16}/> Corte completa.</div>}
        <div className="mt-5 space-y-2">{(stf?.processosEmCurso||[]).slice(0,6).map(p=><div key={p.id} className="rounded-xl border border-border bg-panel/35 p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-black">{p.tipo||'Processo'}</span><span className={`ui-chip ${p.status==='julgado'?(p.resultado==='governo_vitorioso'?'text-success':'text-danger'):'text-warning'}`}>{p.status?.replaceAll('_',' ')}</span></div><div className="mt-1 text-xs text-muted">{p.titulo}</div>{p.relator&&<div className="mt-2 text-[9px] text-muted">Relatoria: {p.relator}</div>}</div>)}</div>
      </aside>
    </div>}

    {tab==='leis'&&<div className="grid h-[calc(100%-46px)] min-h-0 gap-3 overflow-y-auto xl:grid-cols-2">
      <section className="rounded-3xl border border-border bg-card/65 p-4">
        <div className="flex items-start justify-between gap-3"><div><div className="ui-kicker">STF · controle de constitucionalidade</div><h3 className="mt-1 text-xl font-black">Leis judicializadas</h3><p className="mt-1 text-xs leading-relaxed text-muted">A Corte analisa o texto que efetivamente entrou em vigor, incluindo emendas, veto e versão final.</p></div><Gavel className="shrink-0 text-info" size={22}/></div>
        <div className="mt-4 space-y-3">{casosLei.slice(0,8).map(c=><article key={c.id} className={`rounded-2xl border p-4 ${c.status==='julgado'?'border-border bg-panel/30':'border-info/25 bg-info/5'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><div className="text-[9px] font-black uppercase tracking-wider text-info">{c.tipo} · versão {c.textoVersao}</div><span className="ui-chip">{String(c.status||'').replaceAll('_',' ')}</span></div>
          <h4 className="mt-1 font-black">{c.tituloLei}</h4><div className="mt-1 text-[10px] text-muted">Autor: {c.autor} · Relatoria: {c.relator}</div>
          <div className="mt-3 rounded-xl border border-border bg-bg/35 p-3"><div className="ui-kicker">Questionamentos</div><ul className="mt-2 space-y-1 text-[10px] leading-relaxed text-muted">{(c.questionamentos||[]).map(q=><li key={q}>• {q}</li>)}</ul></div>
          {c.liminar&&<div className={`mt-3 rounded-xl border p-3 text-xs ${c.liminar.resultado==='indeferida'?'border-success/20 bg-success/5 text-success':'border-warning/25 bg-warning/5 text-warning'}`}>Liminar: <b>{c.liminar.resultado==='indeferida'?'negada':`concedida · alcance ${c.liminar.alcance}`}</b></div>}
          {c.resultado&&<div className="mt-3 rounded-xl border border-border bg-panel/45 p-3"><div className="text-xs font-black">Resultado: {c.resultado.replaceAll('_',' ')}</div>{c.placar&&<div className="mt-1 text-[10px] text-muted">Placar: {c.placar.inconstitucional} pela inconstitucionalidade × {c.placar.constitucional} pela constitucionalidade</div>}</div>}
          {c.status!=='julgado'&&!c.defesaApresentada&&<button onClick={()=>defenderLei(c.id)} className="ui-btn-primary mt-3">Defender constitucionalidade · 3 CP</button>}
          {c.defesaApresentada&&c.status!=='julgado'&&<div className="mt-3 text-[10px] font-black uppercase tracking-wider text-success">AGU já apresentou defesa</div>}
        </article>)}{!casosLei.length&&<div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">Nenhuma lei da campanha foi judicializada até agora.</div>}</div>
      </section>

      <section className="rounded-3xl border border-border bg-card/65 p-4">
        <div className="flex items-start justify-between gap-3"><div><div className="ui-kicker">TCU · execução e gasto</div><h3 className="mt-1 text-xl font-black">Leis sob acompanhamento</h3><p className="mt-1 text-xs leading-relaxed text-muted">O TCU não anula a lei: fiscaliza sua implementação, gasto, governança, contratos e prestação de contas.</p></div><ShieldCheck className="shrink-0 text-warning" size={22}/></div>
        <div className="mt-4 space-y-3">{auditoriasLei.slice(0,8).map(a=><article key={a.id} className={`rounded-2xl border p-4 ${a.status==='decidida'?'border-border bg-panel/30':'border-warning/25 bg-warning/5'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><div className="text-[9px] font-black uppercase tracking-wider text-warning">{a.tipo} · versão {a.textoVersao}</div><span className="ui-chip">{String(a.status||'').replaceAll('_',' ')}</span></div>
          <h4 className="mt-1 font-black">{a.tituloLei}</h4><div className="mt-1 text-[10px] text-muted">Risco de controle {Math.round(a.riscoAtual||0)}/100{a.impactoFiscal?` · impacto fiscal observado ${Math.round(a.impactoFiscal)}`:''}</div>
          <div className="mt-3 rounded-xl border border-border bg-bg/35 p-3"><div className="ui-kicker">Escopo</div><ul className="mt-2 space-y-1 text-[10px] leading-relaxed text-muted">{(a.escopo||[]).map(q=><li key={q}>• {q}</li>)}</ul></div>
          {(a.achados||[]).length>0&&<div className="mt-3 rounded-xl border border-warning/20 bg-warning/5 p-3"><div className="text-[9px] font-black uppercase tracking-wider text-warning">Achados preliminares</div>{a.achados.map(x=><div key={x.id} className="mt-1 text-[10px] text-muted">• {x.texto} · gravidade {x.gravidade}</div>)}</div>}
          {a.resultado&&<div className="mt-3 rounded-xl border border-border bg-panel/45 p-3 text-xs font-black">Decisão: {a.resultado.replaceAll('_',' ')}</div>}
          {a.status!=='decidida'&&!a.planoApresentado&&<button onClick={()=>adequarTCU(a.id)} className="ui-btn-primary mt-3">Apresentar plano de adequação · 2 CP</button>}
          {a.planoApresentado&&a.status!=='decidida'&&<div className="mt-3 text-[10px] font-black uppercase tracking-wider text-success">Plano de adequação entregue</div>}
        </article>)}{!auditoriasLei.length&&<div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">Nenhuma lei entrou em acompanhamento específico do TCU.</div>}</div>
      </section>
      <div className="xl:col-span-2 rounded-2xl border border-border bg-panel/35 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="ui-kicker">Capacidade de resposta</div><div className="mt-1 text-sm font-black">Capital Político disponível: {Math.round(capitalPolitico||0)} CP</div></div><div className="text-[10px] text-muted">Em aberto: {casosAbertos.length} frente(s) no STF · {auditoriasAbertas.length} acompanhamento(s) do TCU</div></div></div>
    </div>}

    {tab==='controles'&&<div className="grid h-[calc(100%-46px)] min-h-0 grid-cols-1 content-start gap-3 overflow-y-auto md:grid-cols-2 xl:grid-cols-4">{instituicoes.filter(i=>i.id!=='stf').map(i=>{const Icon=i.id==='tcu'?ShieldCheck:i.id==='pgr'?Scale:Banknote;const pressao=i.id==='tcu'?Math.round((institucional?.riscoJuridico||10)*1.1):i.id==='pgr'?Math.round(((institucional?.tensaoInstitucional||10)+(oposicao?.forca||30))*.65):Math.round(Math.min(100,(economia?.inflacao||4.5)*5+(economia?.riscoPais||250)/8));const leitura=i.id==='tcu'?'Contratos, obras e governança das estatais elevam a atenção do controle externo.':i.id==='pgr'?'Crises, denúncias e judicialização da oposição aumentam a chance de atuação.':'Inflação, expectativas e risco-país elevam a pressão por política monetária restritiva.';return <article key={i.id} className="rounded-3xl border border-border bg-card/65 p-5"><GameIcon icon={Icon} tone={i.id==='bc'?'warning':'info'} size="lg"/><div className="ui-kicker mt-5">{i.tipo}</div><h3 className="mt-1 text-xl font-black">{i.sigla}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{i.descricao}</p><div className="mt-5 space-y-3"><Meter label="Autonomia" value={i.autonomia}/><Meter label="Pressão atual" value={pressao}/></div><div className="mt-5 rounded-xl border border-border bg-panel/35 p-3 text-xs text-muted">{leitura}</div></article>})}
      <section className="md:col-span-2 xl:col-span-4 rounded-3xl border border-info/20 bg-info/5 p-5">
        <div className="flex items-center justify-between gap-4"><div><div className="ui-kicker text-info">Movimentação institucional autônoma</div><h3 className="mt-1 text-lg font-black">Órgãos de Estado também escolhem quando agir</h3></div><Scale className="text-info" size={22}/></div>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">TCU, PGR, Banco Central e STF podem reagir a gasto, inflação, risco jurídico, estatais, parcerias e conflitos federativos sem esperar uma ação direta do Presidente.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">{(institucional?.movimentosAutonomos||[]).slice(0,4).map(m=><div key={m.idInstancia||m.id} className="rounded-xl border border-border bg-card/55 p-3"><div className="text-[9px] font-black uppercase tracking-wider text-info">{m.instituicao} · mês {m.turno}</div><div className="mt-1 text-xs font-black">{m.titulo}</div><p className="mt-2 text-[10px] leading-relaxed text-muted">{m.texto}</p></div>)}{!(institucional?.movimentosAutonomos||[]).length&&<div className="md:col-span-2 xl:col-span-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted">Nenhum órgão abriu uma frente autônoma nesta campanha ainda.</div>}</div>
      </section>
    </div>}

    {tab==='oposicao'&&<div className="grid h-[calc(100%-46px)] min-h-0 gap-3 xl:grid-cols-[.85fr_1.15fr]"><section className="rounded-2xl border border-border bg-card/65 p-5"><div className="ui-kicker">Quem perdeu a eleição não desapareceu</div><div className="mt-4 flex items-center gap-4"><PoliticalAvatar name={oposicao?.lider?.nome} seed={oposicao?.lider?.avatar} size={86}/><div><h2 className="text-2xl font-black">{oposicao?.lider?.nome}</h2><div className="text-xs font-bold text-muted">{oposicao?.lider?.cargo} · {oposicao?.coalizao}</div><div className="mt-2 flex gap-2"><span className="ui-chip">força {Math.round(oposicao?.forca||0)}</span><span className="ui-chip">fôlego {Math.round(oposicao?.folego||0)}</span></div></div></div><p className="mt-5 text-sm leading-relaxed text-muted">{oposicao?.lider?.descricao}</p><button onClick={()=>setDossier(oposicao?.lider)} className="ui-btn-secondary mt-4"><BookOpen size={14}/> Abrir dossiê</button><div className="mt-5 rounded-2xl border border-danger/20 bg-danger/5 p-4"><div className="ui-kicker text-danger">Estratégia atual</div><div className="mt-1 font-black">{oposicao?.estrategiaAtual?.nome||'Reconstrução da narrativa'}</div><p className="mt-2 text-xs text-muted">{oposicao?.estrategiaAtual?.texto||'A oposição observa o governo e procura um tema capaz de unificar suas alas.'}</p></div></section>
      <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-card/65 p-4"><div className="flex items-center justify-between"><div><div className="ui-kicker">Cúpula oposicionista</div><h3 className="text-lg font-black">Atores que operam contra o Planalto</h3></div><Network className="text-danger"/></div><div className="mt-4 grid min-h-0 flex-1 content-start gap-2 overflow-y-auto sm:grid-cols-2">{oposicao?.nucleo?.map(a=><button onClick={()=>setDossier(a)} key={a.id} className="rounded-2xl border border-border bg-panel/38 p-4 text-left hover:border-danger/30"><div className="flex items-center gap-3"><PoliticalAvatar name={a.nome} seed={a.avatar} size={50}/><div><div className="font-black">{a.nome}</div><div className="text-[10px] text-muted">{a.cargo}</div></div></div><p className="mt-3 text-xs leading-relaxed text-muted">{a.descricao}</p><div className="mt-3 flex items-center justify-between text-[10px]"><span className="text-danger">{a.especialidade}</span><b>{a.influencia}</b></div></button>)}</div></section></div>}

    {candidate&&<div className="fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4 backdrop-blur-lg" onMouseDown={e=>{if(e.target===e.currentTarget)setCandidate(null)}}><section className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-5"><header className="flex items-center justify-between border-b border-border p-5"><div><div className="ui-kicker">Lista presidencial · vaga no STF</div><h2 className="text-xl font-black">Quem você quer deixar na Corte?</h2></div><button className="ui-btn-secondary px-3" onClick={()=>setCandidate(null)}><XCircle size={17}/></button></header><div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-5 md:grid-cols-2 xl:grid-cols-3">{candidatosSTF.map(c=><article key={c.id} className="rounded-2xl border border-border bg-panel/38 p-4"><div className="flex items-start justify-between"><PoliticalAvatar name={c.nome} seed={c.avatar} size={58}/><span className="ui-chip">Senado {c.apoioSenado}</span></div><h3 className="mt-3 font-black">{c.nome}</h3><div className="mt-1 text-[10px] text-muted">{c.origem} · {c.perfil}</div><p className="mt-3 text-xs leading-relaxed text-muted">{c.descricao}</p><div className="mt-3 rounded-xl border border-border bg-bg/40 p-3 text-[10px] text-muted"><b className="text-text">Agenda jurídica:</b> {c.agendaPessoal||c.frase}</div><div className="mt-4 grid grid-cols-3 gap-2 text-center text-[9px]"><div className="rounded-lg bg-bg p-2"><b className="block text-sm">{c.independencia}</b>Indep.</div><div className="rounded-lg bg-bg p-2"><b className="block text-sm">{c.reputacao}</b>Reput.</div><div className="rounded-lg bg-bg p-2"><b className="block text-sm">{c.apoioSenado}</b>Senado</div></div><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>setDossier(c)} className="ui-btn-secondary justify-center"><BookOpen size={13}/> Dossiê</button><button onClick={()=>indicar(c)} className="ui-btn-primary justify-center">Indicar</button></div></article>)}</div></section></div>}

    {dossier&&<CharacterDossierModal person={dossier} onClose={()=>setDossier(null)} eyebrow={dossier.id?.startsWith('stf_')||dossier.id?.startsWith('cand_stf')?'Supremo Tribunal Federal':'Dossiê político'} subtitle={[dossier.funcao,dossier.cargo,dossier.origem,dossier.perfil].filter(Boolean).join(' · ')} imageKey={dossier.avatar} stats={[
      {label:'Independência',value:dossier.independencia},
      {label:'Garantismo',value:dossier.garantismo},
      {label:'Rigor fiscal',value:dossier.rigorFiscal},
      {label:'Reputação',value:dossier.reputacao},
      {label:'Apoio Senado',value:dossier.apoioSenado},
      {label:'Influência',value:dossier.influencia},
    ]}/>} 
  </div>;
}
