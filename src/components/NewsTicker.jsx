import React from 'react';
import { Radio } from 'lucide-react';
import useGameStore from '../store/useGameStore';

const NewsTicker = () => {
  const { eventosRecentes = [] } = useGameStore();
  const noticias = eventosRecentes.length > 0
    ? eventosRecentes
    : ['Governo inicia trabalhos em Brasília.', 'Mercado aguarda definições econômicas.'];

  return (
    <div className="relative z-30 flex h-8 shrink-0 items-center overflow-hidden border-b border-border bg-ink text-xs text-muted">
      <div className="z-10 flex h-full shrink-0 items-center gap-2 border-r border-border bg-panel px-4 text-[9px] font-black uppercase tracking-[0.18em] text-warning">
        <Radio size={12} className="animate-pulse-soft" /> Radar
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...noticias, ...noticias].map((mensagem, index) => (
            <span key={`${index}-${mensagem}`} className="mx-8 inline-flex items-center gap-2 font-medium">
              <span className="h-1 w-1 rounded-full bg-success" />
              {mensagem}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
