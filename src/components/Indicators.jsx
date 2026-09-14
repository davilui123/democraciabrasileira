import React from 'react';
import { Activity, DollarSign, Users } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import GameIcon from './GameIcon';

const toneClasses = {
  green: 'text-success bg-success/10 border-success/20',
  red: 'text-danger bg-danger/10 border-danger/20',
  blue: 'text-info bg-info/10 border-info/20',
  yellow: 'text-warning bg-warning/10 border-warning/20',
  purple: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const Sparkline = ({ data, positive = true }) => {
  if (!data || data.length < 2) return <div className="mt-4 h-14 rounded-xl bg-panel/50" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  const stroke = positive ? '#43AE83' : '#D35C67';

  return (
    <div className="mt-4 h-14 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden="true">
        <polyline fill="none" stroke={stroke} strokeWidth="2.3" points={points} vectorEffect="non-scaling-stroke" />
        <polyline fill={stroke} fillOpacity="0.07" stroke="none" points={`0,100 ${points} 100,100`} />
      </svg>
    </div>
  );
};

const MetricBox = ({ label, value, sub, trend = 0, data, tone = 'blue' }) => (
  <div className="ui-stat">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="ui-data-label">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-text">{value}</p>
        <p className={`mt-1 text-[11px] font-black ${trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-muted'}`}>
          {trend > 0 ? '+' : ''}{Number.isFinite(trend) ? trend.toFixed(1) : '0.0'}% no mês
        </p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${toneClasses[tone] || toneClasses.blue}`}><Activity size={18} /></div>
    </div>
    {data && <Sparkline data={data} positive={trend >= 0} />}
    {sub && <p className="mt-3 border-t border-border pt-3 text-[10px] text-muted">{sub}</p>}
  </div>
);

const Indicators = () => {
  const { economia, popularidade, historico, estatais } = useGameStore();
  const last = (items = [], offset = 1) => items[Math.max(0, items.length - offset)] ?? 0;

  return (
    <div className="ui-page space-y-5">
      <div className="ui-toolbar">
        <div>
          <p className="ui-kicker">Boletim consolidado</p>
          <p className="mt-1 text-sm font-bold text-text">IBGE · Banco Central · Tesouro Nacional</p>
        </div>
        <span className="ui-chip"><Activity size={12} className="text-success" /> Atualização mensal</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricBox label="Inflação — IPCA" value={`${economia.inflacao}%`} trend={last(historico.inflacao) - last(historico.inflacao, 2)} data={historico.inflacao} tone={economia.inflacao > 6 ? 'red' : 'green'} sub="Meta de referência: 4,5%" />
        <MetricBox label="Crescimento do PIB" value={`${economia.crescimentoPib}%`} trend={0.1} data={historico.pib} tone="blue" sub={`PIB total: R$ ${(economia.pib / 1000000).toFixed(1)} tri`} />
        <MetricBox label="Aprovação do governo" value={`${popularidade.geral.toFixed(0)}%`} trend={popularidade.geral - last(historico.aprovacao, 2)} data={historico.aprovacao} tone="yellow" sub="Pesquisa nacional de opinião" />
        <MetricBox label="Risco País — CDS" value={`${economia.riscoPais} pts`} trend={-5} tone="purple" sub="Percepção do investidor externo" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="ui-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4 md:px-6">
            <p className="ui-kicker">Contas públicas</p>
            <h3 className="mt-1 text-lg font-black text-text">Balanço Fiscal</h3>
          </div>
          <div className="overflow-x-auto p-3 md:p-5">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">
                  <th className="px-3 py-3">Indicador</th>
                  <th className="px-3 py-3">Mensal</th>
                  <th className="px-3 py-3 text-right">% do PIB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-3 py-4 font-bold text-text">Receita líquida</td><td className="px-3 py-4 font-mono font-black text-success">+ R$ {(economia.arrecadacaoMensal / 1000).toFixed(1)} bi</td><td className="px-3 py-4 text-right text-muted">18,5%</td></tr>
                <tr><td className="px-3 py-4 font-bold text-text">Despesa total</td><td className="px-3 py-4 font-mono font-black text-danger">− R$ {(economia.gastosMensais / 1000).toFixed(1)} bi</td><td className="px-3 py-4 text-right text-muted">18,2%</td></tr>
                <tr className="bg-panel/25"><td className="px-3 py-4 font-black text-text">Resultado primário</td><td className={`px-3 py-4 font-mono font-black ${economia.resultadoPrimario >= 0 ? 'text-success' : 'text-danger'}`}>{economia.resultadoPrimario >= 0 ? '+' : '−'} R$ {(Math.abs(economia.resultadoPrimario) / 1000).toFixed(1)} bi</td><td className="px-3 py-4 text-right font-black text-text">0,3%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="ui-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <p className="ui-kicker">Carteira federal</p>
            <h3 className="mt-1 text-lg font-black text-text">Eficiência das Estatais</h3>
          </div>
          <div className="space-y-4 p-5">
            {estatais.slice(0, 5).map((estatal) => (
              <div key={estatal.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-bold text-text">{estatal.nome}</span>
                  <span className={`shrink-0 font-mono font-black ${estatal.lucroAnual > 0 ? 'text-success' : 'text-danger'}`}>R$ {(estatal.lucroAnual / 1000).toFixed(1)} bi</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-panel"><div className="h-full rounded-full bg-info" style={{ width: `${Math.max(0, Math.min(100, estatal.eficiencia))}%` }} /></div>
                <p className="mt-1 text-right text-[9px] font-bold uppercase tracking-wider text-muted">Eficiência {estatal.eficiencia}%</p>
              </div>
            ))}
            {estatais.length === 0 && <p className="text-sm italic text-muted">Não há empresas estatais na carteira.</p>}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: 'Desemprego', value: '8,4%', icon: Users, tone: 'text-info' },
          { label: 'Renda média', value: 'R$ 2.850', icon: DollarSign, tone: 'text-success' },
          { label: 'IDH', value: '0,765', icon: Activity, tone: 'text-violet-400' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="ui-surface-soft flex items-center gap-3 p-4">
            <GameIcon icon={Icon} tone={tone.includes('success') ? 'success' : tone.includes('violet') ? 'violet' : 'info'} />
            <div><p className="ui-data-label">{label}</p><p className="mt-0.5 text-xl font-black text-text">{value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Indicators;
