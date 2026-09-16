import React from 'react';
import { X, Landmark, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Scale, UsersRound } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { diagnosticoCapitalPolitico } from '../game/governabilityEngine.js';

const CriticalMinistries = ['m_casacivil','m_fazenda','m_justica','m_exteriores'];

export default function PoliticalCapitalModal({ onClose }) {
  const state = useGameStore();
  const { capitalPolitico=0, governabilidade={}, popularidade={}, congresso={}, climaGoverno=50, economia={}, nomeacoes=[] } = state;
  const diag = diagnosticoCapitalPolitico(state);
  const preenchidas = CriticalMinistries.filter(id => nomeacoes.some(n => n.cargoId === id)).length;
  const delta = Number(governabilidade.ultimoDelta||0);
  const motivos = governabilidade.motivos || [];

  return (
    <div className="fixed inset-0 z-[140] grid place-items-center bg-black/75 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-elevation-5">
        <header className="flex items-center justify-between border-b border-border bg-panel/75 px-6 py-4">
          <div>
            <div className="ui-kicker">Governabilidade</div>
            <h2 className="mt-1 text-xl font-black">Capital político da Presidência</h2>
          </div>
          <button type="button" onClick={onClose} className="ui-btn-secondary px-2.5" aria-label="Fechar"><X size={17}/></button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <section className="rounded-3xl border border-warning/25 bg-warning/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="ui-kicker">Margem de manobra</div>
                  <div className="mt-2 flex items-end gap-2"><span className="text-5xl font-black tracking-[-.06em]">{Math.round(capitalPolitico)}</span><span className="pb-1 text-sm font-black text-muted">/ 100 CP</span></div>
                </div>
                <div className="rounded-2xl border border-warning/25 bg-card/60 p-3 text-warning"><Landmark size={24}/></div>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-warning transition-all" style={{width:`${Math.max(0,Math.min(100,capitalPolitico))}%`}}/></div>
              <h3 className="mt-5 text-lg font-black">{diag.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{diag.texto}</p>
              <div className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black ${delta>0?'border-success/25 bg-success/5 text-success':delta<0?'border-danger/25 bg-danger/5 text-danger':'border-border bg-panel/40 text-muted'}`}>
                {delta>0?<TrendingUp size={15}/>:delta<0?<TrendingDown size={15}/>:<Scale size={15}/>} Fechamento anterior: {delta>0?'+':''}{delta} CP
              </div>
            </section>

            <section>
              <div className="ui-kicker">O que este recurso controla</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">Capital político mede a capacidade de transformar autoridade formal em apoio, negociação e execução. Grandes decisões consomem CP; desempenho, maioria política e coesão podem recuperá-lo no fechamento de cada mês.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="ui-stat"><div className="ui-data-label">Aprovação</div><div className="mt-1 text-xl font-black">{Math.round(popularidade.geral||0)}%</div></div>
                <div className="ui-stat"><div className="ui-data-label">Força no Congresso</div><div className="mt-1 text-xl font-black">{Math.round(congresso.poder||0)}</div></div>
                <div className="ui-stat"><div className="ui-data-label">Clima do governo</div><div className="mt-1 text-xl font-black">{Math.round(climaGoverno||0)}</div></div>
                <div className="ui-stat"><div className="ui-data-label">Núcleo estratégico</div><div className="mt-1 text-xl font-black">{preenchidas}/4</div></div>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-success/20 bg-success/5 p-4">
              <div className="flex items-center gap-2 font-black text-success"><ShieldCheck size={17}/> Como recuperar CP</div>
              <p className="mt-3 text-xs leading-6 text-muted">Aprovação acima de 52%, uma base parlamentar funcional, gabinete coeso e resultado fiscal favorável ajudam a reconstruir margem. Vitórias políticas específicas também podem conceder capital diretamente.</p>
            </section>
            <section className="rounded-2xl border border-danger/20 bg-danger/5 p-4">
              <div className="flex items-center gap-2 font-black text-danger"><AlertTriangle size={17}/> Como perder CP</div>
              <p className="mt-3 text-xs leading-6 text-muted">Grandes programas, medidas econômicas, articulação federativa, ações diplomáticas e derrotas institucionais cobram preço. Baixa aprovação, Congresso hostil, crises e ministérios estratégicos vagos corroem CP mês a mês.</p>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-border bg-panel/40 p-4">
            <div className="flex items-center gap-2"><UsersRound size={16} className="text-info"/><div className="ui-kicker">Balanço do último mês</div></div>
            <div className="mt-3 space-y-2">
              {motivos.length ? motivos.map((m,i)=><div key={`${m.texto}_${i}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/45 px-3 py-2 text-xs"><span className="text-muted">{m.texto}</span><b className={m.delta>0?'text-success':'text-danger'}>{m.delta>0?'+':''}{m.delta} CP</b></div>) : <p className="text-xs text-muted">Ainda não houve um fechamento mensal com o novo sistema de governabilidade.</p>}
            </div>
          </section>
          <p className="mt-4 text-[11px] leading-relaxed text-muted">Resultado primário atual: <b className="text-text">R$ {((economia.resultadoPrimario||0)/1000).toFixed(1)} bi</b>. Quando o CP cai para níveis críticos, algumas ações ficam mais caras e o sistema autônomo ganha novas oportunidades de pressão.</p>
        </div>
      </div>
    </div>
  );
}
