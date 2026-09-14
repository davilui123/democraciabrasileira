import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CalendarCheck2,
  Check,
  Clock3,
  Landmark,
  Newspaper,
  Radio,
  Scale,
  X,
} from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { toast } from './sonner';

const cleanHeadline = (text='') => String(text).replace(/^[^\p{L}\p{N}]+/u, '').trim();
const hashText = (text='') => [...String(text)].reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 7);

const routeForHeadline = (headline='') => {
  const text = headline.toLowerCase();
  if (/stf|supremo|constitucional|senado aprova|senado rejeita/.test(text)) return 'instituicoes';
  if (/congresso|câmara|senado|lei |veto|sancion|cpi|plenário/.test(text)) return 'congresso';
  if (/fazenda|inflação|selic|dívida|primário|fiscal|tribut|tarifa|risco-país/.test(text)) return 'economia';
  if (/governador|estado:|crise federativa|federativ|são paulo|repasse/.test(text)) return 'federacao';
  if (/ministério|ministro|pasta|conselho de governo/.test(text)) return 'ministerios';
  if (/programa|política pública/.test(text)) return 'programas';
  if (/estatal|empresa|parceria|ceitec/.test(text)) return 'estatais';
  if (/eleição|campanha|pesquisa|convenção|vice-presid/.test(text)) return 'eleicoes';
  if (/itamaraty|internacional|diplom|visita presidencial|tratado|geopol/.test(text)) return 'mapa';
  return null;
};

const editoriaForHeadline = (headline='') => {
  const route = routeForHeadline(headline);
  return ({
    instituicoes: 'Justiça & Poder',
    congresso: 'Política',
    economia: 'Economia',
    federacao: 'Brasil',
    ministerios: 'Governo',
    programas: 'Políticas Públicas',
    estatais: 'Negócios',
    eleicoes: 'Eleições',
    mapa: 'Mundo',
  })[route] || 'Última Hora';
};

function SourceStamp({ media, headline }) {
  if (!media) return <span className="ui-chip">RADAR</span>;
  const formats = [...(media.formatos || []), ...(media.canais || [])];
  const branch = formats.length ? formats[hashText(headline) % formats.length] : media.nome;
  return (
    <div className="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-muted">
      <span className="text-warning">{media.sigla || media.nome}</span>
      <span>·</span>
      <span>{branch}</span>
      <span className="ui-chip">{editoriaForHeadline(headline)}</span>
    </div>
  );
}

export default function NewsCenter({ onClose, onNavigate }) {
  const {
    eventosRecentes = [],
    midias = [],
    redeSocial = { notificacoes: [] },
    eventoFederativoAtivo,
    resolverEventoFederativo,
    cargos = [],
    nomeacoes = [],
    resolverDemanda,
    agendaCalendario = { convites: [] },
    turno = 1,
    aceitarConviteAgenda,
    recusarConviteAgenda,
    stf,
    dataString,
    limparNotificacoes,
  } = useGameStore();

  const demandas = useMemo(() => cargos.filter(c => c.demandaAtual), [cargos]);
  const convites = useMemo(() => (agendaCalendario.convites || []).filter(c => c.status === 'pendente' && (c.prazoTurno ?? 999) >= turno), [agendaCalendario.convites, turno]);
  const vagas = useMemo(() => cargos.filter(c => !nomeacoes.some(n => n.cargoId === c.id)), [cargos, nomeacoes]);
  const vagasCriticas = vagas.filter(c => c.prioridade === 'alta').length;
  const notificacoes = redeSocial.notificacoes || [];
  const pendenciasCount = (eventoFederativoAtivo ? 1 : 0) + demandas.length + convites.length + (stf?.indicacaoPendente ? 1 : 0) + (vagas.length ? 1 : 0);
  const [tab, setTab] = useState('plantao');

  const mediaFor = (headline, index) => midias.length ? midias[(hashText(headline) + index) % midias.length] : null;
  const go = (route) => { if (!route) return; onNavigate?.(route); onClose?.(); };

  const responderFederacao = (opcaoId) => {
    const result = resolverEventoFederativo(opcaoId);
    if (result?.ok) toast.success('Resposta presidencial registrada.');
    else toast.error(result?.motivo || 'Não foi possível responder à crise.');
  };
  const responderDemanda = (cargoId, aceitou) => {
    const result = resolverDemanda(cargoId, aceitou);
    if (result?.ok === false) toast.error(result.motivo || 'Não foi possível registrar a decisão.');
    else toast.success(aceitou ? 'Resposta ministerial autorizada.' : 'Demanda adiada.');
  };
  const responderConvite = (conviteId, aceitou) => {
    const result = aceitou ? aceitarConviteAgenda(conviteId) : recusarConviteAgenda(conviteId);
    if (result?.ok) toast.success(aceitou ? 'Compromisso confirmado na Agenda Presidencial.' : 'Convite recusado.');
    else toast.error(result?.motivo || 'Não foi possível responder ao convite.');
  };

  return (
    <div className="fixed inset-0 z-[140] grid place-items-center bg-black/72 p-3 backdrop-blur-lg md:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <section className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-border bg-card shadow-elevation-5">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-panel/80 px-5 py-4 md:px-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.2em] text-warning"><Radio size={13} className="animate-pulse-soft" /> Sala de Imprensa · Presidência</div>
            <h2 className="mt-1 text-2xl font-black tracking-[-.03em]">Central de Notícias</h2>
            <p className="mt-1 text-xs text-muted">Leia o que entrou no radar e resolva assuntos que ainda exigem decisão presidencial.</p>
          </div>
          <button type="button" onClick={onClose} className="ui-btn-secondary px-3"><X size={17} /></button>
        </header>

        <div className="shrink-0 border-b border-border bg-bg/30 px-5 py-3 md:px-6">
          <div className="ui-tabs w-fit">
            <button onClick={() => setTab('plantao')} className={`ui-tab ${tab === 'plantao' ? 'ui-tab-active' : ''}`}><Newspaper size={13} className="mr-1 inline" /> Plantão</button>
            <button onClick={() => setTab('pendencias')} className={`ui-tab ${tab === 'pendencias' ? 'ui-tab-active' : ''}`}><AlertTriangle size={13} className="mr-1 inline" /> Pendências {pendenciasCount > 0 && <span className="ml-1 rounded-full bg-danger px-1.5 py-0.5 text-[8px] text-white">{pendenciasCount}</span>}</button>
            <button onClick={() => setTab('notificacoes')} className={`ui-tab ${tab === 'notificacoes' ? 'ui-tab-active' : ''}`}><BellRing size={13} className="mr-1 inline" /> Notificações {notificacoes.length > 0 && <span className="ml-1 rounded-full bg-warning px-1.5 py-0.5 text-[8px] text-black">{notificacoes.length}</span>}</button>
          </div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          {tab === 'plantao' && (
            <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
              <section className="space-y-3">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div><div className="ui-kicker">Últimas movimentações</div><h3 className="mt-1 text-xl font-black">O que aconteceu no governo</h3></div>
                  <span className="ui-chip">{dataString}</span>
                </div>
                {eventosRecentes.length ? eventosRecentes.map((evento, index) => {
                  const headline = cleanHeadline(evento);
                  const media = mediaFor(headline, index);
                  const route = routeForHeadline(headline);
                  return (
                    <article key={`${evento}-${index}`} className="rounded-2xl border border-border bg-panel/42 p-4">
                      <SourceStamp media={media} headline={headline} />
                      <h4 className="mt-2 text-sm font-black leading-relaxed text-text">{headline}</h4>
                      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-muted">
                        <span><Clock3 size={12} className="mr-1 inline" /> {index === 0 ? 'Agora no radar' : 'Registro recente'}</span>
                        {route && <button onClick={() => go(route)} className="inline-flex items-center gap-1 font-black text-info hover:text-text">Abrir área <ArrowRight size={12} /></button>}
                      </div>
                    </article>
                  );
                }) : <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">Nenhuma notícia registrada ainda.</div>}
              </section>

              <aside className="space-y-3">
                <div className="rounded-2xl border border-warning/25 bg-warning/5 p-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-warning"><AlertTriangle size={14} /> Mesa presidencial</div>
                  <div className="mt-2 text-2xl font-black">{pendenciasCount}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">assunto(s) ainda dependem de decisão ou atenção direta do Planalto.</p>
                  <button onClick={() => setTab('pendencias')} className="ui-btn-secondary mt-3 w-full justify-center">Ver pendências <ArrowRight size={14} /></button>
                </div>
                <div className="rounded-2xl border border-border bg-panel/42 p-4">
                  <div className="ui-kicker">Como o radar funciona</div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">As manchetes do topo deixam de ser apenas passagem visual. A Central guarda os acontecimentos recentes e aponta a área do governo relacionada a cada um.</p>
                </div>
              </aside>
            </div>
          )}

          {tab === 'pendencias' && (
            <div className="space-y-4">
              <div><div className="ui-kicker">Decisão presidencial</div><h3 className="mt-1 text-xl font-black">Assuntos que não podem ficar só na manchete</h3></div>

              {eventoFederativoAtivo && (
                <section className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-danger"><Landmark size={14} /> Crise federativa · {eventoFederativoAtivo.estado}</div><span className="ui-chip text-danger">impacto ×{eventoFederativoAtivo.multiplicador?.toFixed?.(2) || '1.00'}</span></div>
                  <h4 className="mt-2 text-lg font-black">{eventoFederativoAtivo.titulo}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-text/75">{eventoFederativoAtivo.texto}</p>
                  <div className="mt-4 grid gap-2 lg:grid-cols-3">{(eventoFederativoAtivo.opcoes || []).map((op, index) => <button key={op.id} onClick={() => responderFederacao(op.id)} className="rounded-xl border border-border bg-card/65 p-3 text-left text-xs font-bold hover:border-warning/40"><span className="mr-2 font-mono text-warning">{String.fromCharCode(65 + index)}</span>{op.texto}</button>)}</div>
                </section>
              )}

              {vagas.length > 0 && (
                <section className={`rounded-2xl border p-4 ${turno >= 3 ? 'border-danger/30 bg-danger/5' : 'border-warning/25 bg-warning/5'}`}>
                  <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-warning"><BriefcaseBusiness size={14} /> Gabinete incompleto</div><h4 className="mt-1 font-black">{vagas.length} de {cargos.length} ministério(s) seguem sem titular</h4></div><span className="ui-chip">{vagasCriticas} estratégicos</span></div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">Pastas vagas aceleram crises administrativas e, depois do primeiro mês, passam a cobrar preço em coordenação, confiança e popularidade.</p>
                  <button onClick={() => go('ministerios')} className="ui-btn-secondary mt-3">Montar gabinete <ArrowRight size={14} /></button>
                </section>
              )}

              {demandas.map(cargo => (
                <section key={cargo.id} className="rounded-2xl border border-warning/25 bg-warning/5 p-4">
                  <div className="text-[9px] font-black uppercase tracking-wider text-warning">{cargo.nome} · nível {cargo.demandaAtual.nivel}</div>
                  <h4 className="mt-1 font-black">{cargo.demandaAtual.titulo}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{cargo.demandaAtual.texto}</p>
                  <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => responderDemanda(cargo.id, true)} className="ui-btn-primary"><Check size={14} /> Autorizar resposta</button><button onClick={() => responderDemanda(cargo.id, false)} className="ui-btn-secondary">Adiar</button></div>
                </section>
              ))}

              {convites.map(convite => (
                <section key={convite.id} className="rounded-2xl border border-info/25 bg-info/5 p-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-info"><CalendarCheck2 size={14} /> Agenda · {convite.tipo}</div>
                  <h4 className="mt-1 font-black">{convite.titulo}</h4>
                  <p className="mt-1 text-xs text-muted">{[convite.origem, convite.local, convite.dataISO].filter(Boolean).join(' · ')}</p>
                  <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => responderConvite(convite.id, true)} className="ui-btn-primary">Aceitar</button><button onClick={() => responderConvite(convite.id, false)} className="ui-btn-secondary">Recusar</button></div>
                </section>
              ))}

              {stf?.indicacaoPendente && (
                <section className="rounded-2xl border border-border bg-panel/42 p-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-info"><Scale size={14} /> STF · indicação no Senado</div>
                  <h4 className="mt-1 font-black">{stf.indicacaoPendente.nome}</h4>
                  <p className="mt-1 text-xs text-muted">Projeção de {stf.indicacaoPendente.votosProjetados}/81 votos. A indicação ainda precisa ser submetida.</p>
                  <button onClick={() => go('instituicoes')} className="ui-btn-secondary mt-3">Abrir STF <ArrowRight size={14} /></button>
                </section>
              )}

              {pendenciasCount === 0 && <div className="rounded-3xl border border-success/25 bg-success/5 p-8 text-center"><Check size={24} className="mx-auto text-success" /><h4 className="mt-3 font-black">Mesa limpa</h4><p className="mt-1 text-sm text-muted">Não há decisões urgentes aguardando o Presidente.</p></div>}
            </div>
          )}

          {tab === 'notificacoes' && (
            <div>
              <div className="mb-4 flex items-end justify-between gap-3"><div><div className="ui-kicker">Caixa de entrada</div><h3 className="mt-1 text-xl font-black">Notificações do sistema político</h3></div>{notificacoes.length > 0 && <button onClick={() => limparNotificacoes?.()} className="ui-btn-secondary">Marcar todas como lidas</button>}</div>
              <div className="space-y-3">{notificacoes.map((notificacao, index) => {
                const headline = cleanHeadline(notificacao.texto);
                const media = mediaFor(headline, index + 13);
                return <article key={notificacao.id || index} className="rounded-2xl border border-border bg-panel/42 p-4"><SourceStamp media={media} headline={headline} /><p className="mt-2 text-sm leading-relaxed text-text/85">{headline}</p><div className="mt-2 text-[9px] font-black uppercase text-muted">{notificacao.tipo || 'sistema político'}</div></article>;
              })}{!notificacoes.length && <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted"><BellRing size={24} className="mx-auto mb-3" />Nenhuma notificação pendente.</div>}</div>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
