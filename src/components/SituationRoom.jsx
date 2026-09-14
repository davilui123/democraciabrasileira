import React, { useMemo, useState } from 'react';
import {
  Activity,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Landmark,
  Scale,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { toast } from './sonner';
import useGameStore from '../store/useGameStore';
import { PRESIDENTIAL_ACTIONS, PRESIDENTIAL_AREAS } from '../game/presidentialActions';

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const powerNodes = {
  congresso: { icon: Landmark, x: 14, y: 31 },
  instituicoes: { icon: Scale, x: 50, y: 12 },
  economia: { icon: CircleDollarSign, x: 86, y: 31 },
  governo: { icon: Building2, x: 18, y: 78 },
  povo: { icon: Users, x: 50, y: 88 },
  mundo: { icon: Globe2, x: 82, y: 78 },
};

const toneFor = (value) => {
  if (value >= 70) return { label: 'Forte', className: 'text-success', ring: '#43AE83' };
  if (value >= 45) return { label: 'Disputado', className: 'text-warning', ring: '#D5A246' };
  return { label: 'Pressão', className: 'text-danger', ring: '#D35C67' };
};

const ImpactBadge = ({ item }) => {
  const classes = item.tipo === 'good'
    ? 'bg-success/10 text-success border-success/20'
    : item.tipo === 'bad'
      ? 'bg-danger/10 text-danger border-danger/20'
      : 'bg-panel text-muted border-border';

  return <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${classes}`}>{item.texto}</span>;
};

const SituationRoom = () => {
  const {
    turno,
    agendaPresidencial,
    popularidade,
    economia,
    partidos,
    stf,
    institucional,
    climaGoverno,
    mundo,
    capitalPolitico,
    executarAcaoPresidencial,
  } = useGameStore();

  const [focusArea, setFocusArea] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);

  const agenda = agendaPresidencial || { pontosMax: 3, pontosRestantes: 3, acoesUsadas: [], historico: [], ultimaReacao: null };

  const votosGarantidos = useMemo(() => partidos.reduce((acc, partido) => (
    acc + Math.floor(partido.cadeiras * (partido.apoio / 100))
  ), 0), [partidos]);

  const indicators = useMemo(() => ({
    povo: clamp(popularidade.geral),
    economia: clamp(economia.confiancaMercado),
    congresso: clamp((votosGarantidos / 257) * 100),
    instituicoes: clamp(100 - ((stf?.tensaoInstitucional || 0) * 0.65 + (institucional?.tensaoInstitucional || 0) * 0.35)),
    governo: clamp(climaGoverno),
    mundo: clamp(mundo.softPowerBrasil),
  }), [popularidade.geral, economia.confiancaMercado, votosGarantidos, stf, institucional, climaGoverno, mundo.softPowerBrasil]);

  const actions = PRESIDENTIAL_ACTIONS.filter(acao => !focusArea || acao.area === focusArea);
  const selectedAction = PRESIDENTIAL_ACTIONS.find(acao => acao.id === selectedActionId) || actions[0] || null;

  const used = selectedAction ? agenda.acoesUsadas.includes(selectedAction.id) : false;
  const lacksPoints = selectedAction ? agenda.pontosRestantes < selectedAction.pontos : false;
  const lacksCapital = selectedAction ? (selectedAction.custoCapital || 0) > capitalPolitico : false;
  const canExecute = selectedAction && !used && !lacksPoints && !lacksCapital;

  const handleArea = (area) => {
    const next = focusArea === area ? null : area;
    setFocusArea(next);
    const first = PRESIDENTIAL_ACTIONS.find(acao => !next || acao.area === next);
    setSelectedActionId(first?.id || null);
  };

  const handleExecute = () => {
    if (!selectedAction) return;
    const result = executarAcaoPresidencial(selectedAction.id);
    if (!result?.ok) {
      toast.error(result?.motivo || 'Não foi possível executar a ordem.');
      return;
    }
    toast.success(`Ordem autorizada: ${selectedAction.titulo}`);
  };

  return (
    <section className="ui-surface overflow-hidden">
      <div className="px-5 py-4 md:px-6 border-b border-border bg-panel/65 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-warning text-[10px] font-black uppercase tracking-[0.22em]">
            <Zap size={15} /> Sala de Situação
          </div>
          <h3 className="text-xl font-black tracking-[-0.025em] mt-1 text-text">Mesa Presidencial — mês {turno}</h3>
          <p className="text-sm text-muted mt-1">Escolha onde a Presidência vai gastar atenção. Você não consegue controlar todos os tabuleiros ao mesmo tempo.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="ui-data-label">Atenção disponível</p>
            <div className="flex gap-1.5 justify-end mt-2" aria-label={`${agenda.pontosRestantes} de ${agenda.pontosMax} pontos de atenção disponíveis`}>
              {Array.from({ length: agenda.pontosMax || 3 }).map((_, index) => (
                <span
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full border ${index < agenda.pontosRestantes ? 'bg-warning border-warning/70 shadow-[0_0_12px_rgba(213,162,70,0.28)]' : 'bg-panel border-border'}`}
                />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-right">
            <p className="ui-data-label">Capital político</p>
            <p className="text-lg font-mono font-black text-text">{capitalPolitico}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.12fr_0.88fr] min-h-[520px]">
        <div className="p-5 md:p-6 border-b xl:border-b-0 xl:border-r border-border">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <p className="ui-section-title">Mapa de poder</p>
              <p className="text-sm text-muted mt-1">Clique em um polo para focar a agenda.</p>
            </div>
            {focusArea && (
              <button type="button" onClick={() => handleArea(focusArea)} className="ui-btn-ghost">
                Mostrar todos
              </button>
            )}
          </div>

          <div className="relative h-[390px] rounded-2xl border border-border bg-bg/55 overflow-hidden situation-map">
            <div className="absolute inset-0 opacity-30 situation-grid" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {Object.entries(powerNodes).map(([id, node]) => (
                <line key={id} x1="50" y1="51" x2={node.x} y2={node.y} stroke="rgba(148,163,184,.28)" strokeWidth="0.45" strokeDasharray="2.2 2.2" />
              ))}
            </svg>

            <div className="absolute left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-success via-primary to-warning p-[2px] shadow-[0_0_45px_rgba(23,128,106,0.18)]">
                <div className="w-full h-full rounded-full bg-bg flex flex-col items-center justify-center border border-primary/25">
                  <Landmark size={27} className="text-success mb-1" />
                  <span className="ui-data-label">Planalto</span>
                  <span className="text-sm font-black">PRESIDÊNCIA</span>
                </div>
              </div>
            </div>

            {Object.entries(powerNodes).map(([id, node]) => {
              const area = PRESIDENTIAL_AREAS[id];
              const Icon = node.icon;
              const value = Math.round(indicators[id]);
              const tone = toneFor(value);
              const active = focusArea === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => handleArea(id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group text-left ${active ? 'scale-105' : 'hover:scale-105'}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  aria-pressed={active}
                >
                  <div className={`w-[118px] rounded-xl border p-2.5 backdrop-blur-sm transition-all ${active ? 'bg-card border-warning shadow-[0_0_22px_rgba(213,162,70,0.12)]' : 'bg-bg/90 border-border hover:border-muted/60'}`}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-9 h-9 rounded-full p-[3px] shrink-0"
                        style={{ background: `conic-gradient(${tone.ring} ${value * 3.6}deg, #263446 0deg)` }}
                      >
                        <span className="w-full h-full rounded-full bg-bg flex items-center justify-center"><Icon size={15} /></span>
                      </span>
                      <span className="min-w-0">
                        <span className="block ui-data-label truncate">{area.shortLabel}</span>
                        <span className={`block text-lg leading-5 font-black ${tone.className}`}>{value}</span>
                      </span>
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${tone.className}`}>{tone.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 md:p-6 bg-panel/25 flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="ui-section-title">Ordens presidenciais</p>
              <p className="text-sm text-muted mt-1">{focusArea ? PRESIDENTIAL_AREAS[focusArea].label : 'Todas as frentes'}</p>
            </div>
            <span className="ui-data-label">{agenda.acoesUsadas.length} executada(s)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[210px] overflow-y-auto pr-1 situation-scroll">
            {actions.map(acao => {
              const Icon = acao.icon;
              const isUsed = agenda.acoesUsadas.includes(acao.id);
              const selected = selectedAction?.id === acao.id;
              return (
                <button
                  type="button"
                  key={acao.id}
                  onClick={() => setSelectedActionId(acao.id)}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[92px] ${selected ? 'bg-card border-warning/80' : 'bg-panel/65 border-border hover:border-muted/60'} ${isUsed ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`p-2 rounded-lg ${selected ? 'bg-warning text-ink' : 'bg-card text-muted'}`}><Icon size={16} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold leading-4">{acao.titulo}</span>
                        <span className="shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded bg-bg border border-border text-warning">{acao.pontos} AP</span>
                      </span>
                      <span className="text-[10px] text-muted mt-1 line-clamp-2 block">{acao.resumo}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAction && (
            <div className="mt-4 rounded-2xl border border-border bg-card/80 p-4 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-warning">
                    <Sparkles size={13} /> Ordem para autorização
                  </div>
                  <h4 className="text-base font-bold mt-1">{selectedAction.titulo}</h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{selectedAction.resumo}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-warning">{selectedAction.pontos}</span>
                  <span className="block text-[9px] uppercase tracking-widest text-muted">atenção</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedAction.efeitos.map((efeito, index) => <ImpactBadge key={index} item={efeito} />)}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-[10px] text-muted space-y-0.5">
                  {selectedAction.custoOrcamento > 0 && <p>Custo fiscal: <strong className="text-text">R$ {selectedAction.custoOrcamento} mi</strong></p>}
                  {selectedAction.custoCapital > 0 && <p>Custo político: <strong className="text-text">{selectedAction.custoCapital} pontos</strong></p>}
                  {!selectedAction.custoOrcamento && !selectedAction.custoCapital && <p>Sem custo fiscal direto ou capital político.</p>}
                </div>

                <button
                  type="button"
                  disabled={!canExecute}
                  onClick={handleExecute}
                  className={`min-h-11 px-4 rounded-xl font-black text-xs uppercase tracking-wide flex items-center gap-2 ${canExecute ? 'bg-warning hover:brightness-110 text-ink shadow-elevation-2' : 'bg-panel text-muted cursor-not-allowed'}`}
                >
                  {used ? <><Check size={16} /> Executada</> : <>{lacksPoints || lacksCapital ? 'Indisponível' : 'Autorizar'} <ChevronRight size={16} /></>}
                </button>
              </div>
            </div>
          )}

          {agenda.ultimaReacao && (
            <div className="mt-3 px-4 py-3 rounded-xl border border-primary/25 bg-primary/5">
              <div className="flex items-center gap-2 text-success text-[10px] uppercase tracking-widest font-black"><Activity size={13} /> Reação imediata</div>
              <p className="text-xs font-bold text-text mt-1">{agenda.ultimaReacao.titulo}</p>
              <p className="text-[11px] text-muted mt-1">{agenda.ultimaReacao.impactos.join(' · ')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SituationRoom;
