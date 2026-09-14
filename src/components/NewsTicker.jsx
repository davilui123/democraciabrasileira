import React from 'react';
import { Newspaper, Radio } from 'lucide-react';
import useGameStore from '../store/useGameStore';

const NewsTicker = ({ onOpen }) => {
  const {
    eventosRecentes = [],
    eventoFederativoAtivo,
    cargos = [],
    nomeacoes = [],
    agendaCalendario = { convites: [] },
    stf,
    turno = 1,
  } = useGameStore();
  const noticias = eventosRecentes.length > 0
    ? eventosRecentes
    : ['Governo inicia trabalhos em Brasília.', 'Mercado aguarda definições econômicas.'];
  const demandas = cargos.filter(c => c.demandaAtual).length;
  const convites = (agendaCalendario.convites || []).filter(c => c.status === 'pendente' && (c.prazoTurno ?? 999) >= turno).length;
  const vagas = cargos.filter(c => !nomeacoes.some(n => n.cargoId === c.id)).length;
  const pendencias = (eventoFederativoAtivo ? 1 : 0) + demandas + convites + (stf?.indicacaoPendente ? 1 : 0) + (vagas ? 1 : 0);

  return (
    <div className="relative z-30 flex h-8 shrink-0 items-center overflow-hidden border-b border-border bg-ink text-xs text-muted">
      <button type="button" onClick={onOpen} className="z-10 flex h-full shrink-0 items-center gap-2 border-r border-border bg-panel px-4 text-[9px] font-black uppercase tracking-[0.18em] text-warning hover:bg-card">
        <Radio size={12} className="animate-pulse-soft" /> Radar
      </button>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 overflow-hidden text-left" aria-label="Abrir Central de Notícias">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...noticias, ...noticias].map((mensagem, index) => (
            <span key={`${index}-${mensagem}`} className="mx-8 inline-flex items-center gap-2 font-medium">
              <span className="h-1 w-1 rounded-full bg-success" />
              {mensagem}
            </span>
          ))}
        </div>
      </button>
      <button type="button" onClick={onOpen} className="z-10 flex h-full shrink-0 items-center gap-2 border-l border-border bg-panel px-3 text-[9px] font-black uppercase tracking-[.12em] text-info hover:bg-card" title="Abrir Central de Notícias">
        <Newspaper size={13} />
        <span className="hidden sm:inline">Abrir central</span>
        {pendencias > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[8px] text-white">{Math.min(99, pendencias)}</span>}
      </button>
    </div>
  );
};

export default NewsTicker;
