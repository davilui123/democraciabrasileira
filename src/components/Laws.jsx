import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Gavel, PlusCircle, Scroll, Vote } from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { toast } from 'sonner';

const CATEGORIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'economia', label: 'Economia' },
  { id: 'institucional', label: 'Institucional' },
  { id: 'sociedade', label: 'Sociedade' },
  { id: 'educacao', label: 'Educação' },
  { id: 'ambiental', label: 'Ambiental' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'geopolitica', label: 'Geopolítica' },
  { id: 'eleitoral', label: 'Eleitoral' },
];

const Laws = ({ onCriarPrograma }) => {
  const {
    leisDisponiveis,
    leisAprovadas,
    leisEmTramitacao,
    enviarLeiParaCongresso,
    capitalPolitico,
    climaGoverno,
  } = useGameStore();
  const [filtro, setFiltro] = useState('todas');

  const handlePropor = (lei) => {
    const sucesso = enviarLeiParaCongresso(lei.id);
    if (sucesso) toast.success('Projeto de Lei enviado ao Congresso.');
    else toast.error('Capital político insuficiente ou lei já em trâmite.');
  };

  const leisFiltradas = leisDisponiveis.filter(lei => filtro === 'todas' || lei.categoria === filtro);

  return (
    <div className="ui-page space-y-5">
      <div className="ui-toolbar">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-warning/20 bg-warning/10 text-warning"><Gavel size={18} /></div>
          <div>
            <p className="ui-data-label">Capital político disponível</p>
            <p className="mt-0.5 text-lg font-black text-warning">{capitalPolitico} pontos</p>
          </div>
        </div>
        <button type="button" onClick={onCriarPrograma} className="ui-btn-primary"><PlusCircle size={16} /> Criar programa / MP</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {CATEGORIAS.map((categoria) => (
          <button
            type="button"
            key={categoria.id}
            onClick={() => setFiltro(categoria.id)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold ${filtro === categoria.id ? 'border-primary/50 bg-primary/15 text-success' : 'border-border bg-card/70 text-muted hover:text-text'}`}
          >
            {categoria.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leisFiltradas.map((lei) => {
          const aprovada = leisAprovadas.includes(lei.id);
          const tramitando = leisEmTramitacao.includes(lei.id);
          const disponivel = !aprovada && !tramitando;
          const bloqueada = lei.condicao && !lei.condicao({ climaGoverno, economia: { inflacao: 15 } });
          const categoria = CATEGORIAS.find(item => item.id === lei.categoria)?.label || lei.categoria;

          return (
            <article
              key={lei.id}
              className={`flex min-h-[300px] flex-col rounded-2xl border p-5 transition-colors ${
                aprovada
                  ? 'border-success/30 bg-success/5'
                  : tramitando
                    ? 'border-warning/30 bg-warning/5'
                    : bloqueada
                      ? 'border-border bg-card/45 opacity-55'
                      : 'border-border bg-card/85 hover:border-primary/45'
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="ui-chip">{categoria}</span>
                {aprovada && <span className="ui-chip border-success/30 bg-success/5 text-success"><CheckCircle size={11} /> Vigorando</span>}
                {tramitando && <span className="ui-chip border-warning/30 bg-warning/5 text-warning"><Vote size={11} /> Tramitando</span>}
                {lei.riscoCrise && disponivel && <span className="ui-chip border-danger/30 bg-danger/5 text-danger"><AlertTriangle size={11} /> Polêmica</span>}
              </div>

              <h3 className="pr-3 text-lg font-black leading-tight tracking-[-0.02em] text-text">{lei.titulo}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{lei.descricao}</p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-xl border border-success/20 bg-success/5 p-3">
                  <p className="mb-1 font-black uppercase tracking-wider text-success">Apoio</p>
                  <p className="leading-relaxed text-muted">{lei.apoio.join(' · ') || 'Sem bloco definido'}</p>
                </div>
                <div className="rounded-xl border border-danger/20 bg-danger/5 p-3">
                  <p className="mb-1 font-black uppercase tracking-wider text-danger">Oposição</p>
                  <p className="leading-relaxed text-muted">{lei.oposicao.join(' · ') || 'Sem bloco definido'}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                <div>
                  <p className="ui-data-label">Custo político</p>
                  <p className={`mt-0.5 font-mono text-sm font-black ${capitalPolitico >= lei.custoPolitico ? 'text-text' : 'text-danger'}`}>{lei.custoPolitico} CP</p>
                </div>

                {disponivel && (
                  <button
                    type="button"
                    onClick={() => handlePropor(lei)}
                    disabled={capitalPolitico < lei.custoPolitico || bloqueada}
                    className="ui-btn-secondary"
                  >
                    <Scroll size={14} /> {bloqueada ? 'Indisponível' : 'Enviar PL'}
                  </button>
                )}
                {aprovada && <span className="text-xs font-black text-success">Lei sancionada</span>}
                {tramitando && <span className="text-xs font-black text-warning">No Congresso</span>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Laws;
