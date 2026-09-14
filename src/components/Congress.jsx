import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FilePenLine,
  Filter,
  Gavel,
  GraduationCap,
  Handshake,
  HeartPulse,
  KeyRound,
  Landmark,
  Leaf,
  LockKeyhole,
  Megaphone,
  Network,
  Play,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrainFront,
  TrendingUp,
  Users,
  Vote,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import useGameStore from '../store/useGameStore';
import { ACOES_ARTICULACAO, calcularProjecao } from '../game/congressEngine';
import { categoriasLeis } from '../data/seed/leis';
import GameIcon from './GameIcon';
import PoliticalAvatar from './PoliticalAvatar';
import CharacterDossierModal from './CharacterDossier';
import { toast } from './sonner';

const PARTY_COLORS = {
  esq: '#DC4C5B',
  centro: '#7D8796',
  ind: '#D6A246',
  dir: '#4C82D8',
};

const CATEGORY_META = {
  economia: { icon: TrendingUp, tone: 'success', label: 'Economia' },
  tributacao: { icon: CircleDollarSign, tone: 'warning', label: 'Tributação' },
  trabalho: { icon: BriefcaseBusiness, tone: 'info', label: 'Trabalho' },
  saude: { icon: HeartPulse, tone: 'danger', label: 'Saúde' },
  educacao: { icon: GraduationCap, tone: 'info', label: 'Educação' },
  seguranca: { icon: ShieldCheck, tone: 'danger', label: 'Segurança' },
  sociedade: { icon: Users, tone: 'violet', label: 'Sociedade' },
  ambiental: { icon: Leaf, tone: 'success', label: 'Meio ambiente' },
  agro: { icon: Leaf, tone: 'warning', label: 'Agro' },
  infraestrutura: { icon: TrainFront, tone: 'neutral', label: 'Infraestrutura' },
  digital: { icon: Wifi, tone: 'info', label: 'Digital' },
  institucional: { icon: Landmark, tone: 'violet', label: 'Institucional' },
  geopolitica: { icon: Network, tone: 'info', label: 'Defesa & Exterior' },
};

const ACTION_ICONS = {
  users: Users,
  'file-pen': FilePenLine,
  landmark: Landmark,
  zap: Zap,
  megaphone: Megaphone,
  'key-round': KeyRound,
};

const ROW_COUNTS = [35, 39, 43, 47, 50, 53, 56, 60, 63, 67];

const createHemicycleGeometry = () => {
  const cx = 500;
  const cy = 218;
  const positions = [];
  const arcs = [];

  ROW_COUNTS.forEach((count, row) => {
    const rx = 145 + row * 29.5;
    const ry = 52 + row * 11.9;
    const margin = 0.075 + row * 0.002;
    const arcPoints = [];

    for (let k = 0; k <= 90; k += 1) {
      const t = k / 90;
      const angle = Math.PI + margin + t * (Math.PI - margin * 2);
      arcPoints.push(`${(cx + Math.cos(angle) * rx).toFixed(1)},${(cy + Math.sin(angle) * ry).toFixed(1)}`);
    }
    arcs.push(arcPoints.join(' '));

    for (let index = 0; index < count; index += 1) {
      const t = count === 1 ? 0.5 : index / (count - 1);
      const angle = Math.PI + margin + t * (Math.PI - margin * 2);
      positions.push({
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        t,
        row,
      });
    }
  });

  positions.sort((a, b) => a.t - b.t || a.row - b.row);
  return { positions, arcs };
};

const HEMICYCLE = createHemicycleGeometry();

const getVoteProjection = (partidos, lei, proposta) => {
  if (!lei) return { sim: 0, nao: 513, meta: 257, bancadas: [] };
  return proposta?.projecao || calcularProjecao(proposta || {}, lei, partidos);
};

const statusLabel = (proposta) => {
  if (proposta.status === 'votacao_hoje') return 'Pronto para votar';
  if (proposta.status === 'aguarda_segundo_turno') return 'Entre turnos';
  if (proposta.status === 'senado') return 'No Senado';
  if (proposta.status === 'aguardando_sancao') return 'Na mesa do Presidente';
  if (proposta.status === 'sancionada') return 'Sancionada';
  if (proposta.status === 'arquivada') return 'Arquivada';
  if (proposta.status === 'vetada') return 'Vetada';
  return proposta.fase === 'comissao' ? 'Em comissão' : 'Em tramitação';
};

const statusTone = (proposta) => {
  if (proposta.status === 'votacao_hoje' || proposta.status === 'aguardando_sancao') return 'warning';
  if (proposta.status === 'sancionada') return 'success';
  if (proposta.status === 'arquivada' || proposta.status === 'vetada') return 'danger';
  return 'info';
};

const CompactHemicycle = ({ partidos, selectedParty, onSelectParty }) => {
  const seats = useMemo(() => {
    const order = ['esq', 'centro', 'ind', 'dir'];
    return order.flatMap((partyId) => {
      const partido = partidos.find((item) => item.id === partyId);
      if (!partido) return [];
      return Array.from({ length: partido.cadeiras }, () => partido);
    });
  }, [partidos]);

  const votosBase = partidos.reduce((acc, partido) => acc + Math.floor(partido.cadeiras * (partido.apoio / 100)), 0);

  return (
    <section className="ui-surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-3">
          <GameIcon icon={Landmark} tone="violet" size="sm" />
          <div>
            <p className="ui-kicker">Câmara dos Deputados</p>
            <h3 className="mt-0.5 text-sm font-black text-text">Composição do Plenário · 513 cadeiras</h3>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="ui-data-label">Base projetada</p>
            <p className={`font-mono text-lg font-black ${votosBase >= 257 ? 'text-success' : 'text-warning'}`}>{votosBase}</p>
          </div>
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div className="hidden text-right sm:block">
            <p className="ui-data-label">Maioria</p>
            <p className="font-mono text-lg font-black text-text">257</p>
          </div>
        </div>
      </div>

      <div className="px-3 pt-2 sm:px-5">
        <svg viewBox="0 0 1000 245" className="h-[118px] w-full sm:h-[132px]" role="img" aria-label="Hemiciclo compacto da Câmara dos Deputados com 513 cadeiras">
          <defs>
            <linearGradient id="compactFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#121C29" />
              <stop offset="100%" stopColor="#0B1119" />
            </linearGradient>
          </defs>
          <path d="M72 225 Q500 -8 928 225 L833 225 Q500 64 167 225 Z" fill="url(#compactFloor)" stroke="#263446" strokeWidth="1.4" />
          {HEMICYCLE.arcs.map((points, index) => (
            <polyline key={index} points={points} fill="none" stroke="#263446" strokeWidth="0.8" opacity="0.78" />
          ))}
          {HEMICYCLE.positions.map((position, index) => {
            const seat = seats[index];
            if (!seat) return null;
            const faded = selectedParty && selectedParty !== seat.id;
            return (
              <circle
                key={`${seat.id}-${index}`}
                cx={position.x}
                cy={position.y}
                r="3.05"
                fill={PARTY_COLORS[seat.id] || '#8B9AAF'}
                stroke="#080D14"
                strokeWidth="0.75"
                opacity={faded ? 0.18 : 0.96}
                className="parliament-seat cursor-pointer"
                onClick={() => onSelectParty?.(selectedParty === seat.id ? null : seat.id)}
              >
                <title>{`${seat.sigla} · ${seat.nome}`}</title>
              </circle>
            );
          })}
          <rect x="455" y="211" width="90" height="22" rx="7" fill="#172331" stroke="#35465B" />
          <text x="500" y="226" textAnchor="middle" fill="#8B9AAF" fontSize="9" fontWeight="800" letterSpacing="1.6">MESA</text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2.5">
        {partidos.map((partido) => (
          <button
            type="button"
            key={partido.id}
            onClick={() => onSelectParty?.(selectedParty === partido.id ? null : partido.id)}
            className={`ui-chip transition-colors ${selectedParty === partido.id ? 'border-white/25 bg-card text-text' : ''}`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PARTY_COLORS[partido.id] }} />
            <span className="text-text">{partido.sigla}</span>
            <span className="font-mono">{partido.cadeiras}</span>
            <span className="text-muted/70">· {partido.apoio}% gov.</span>
          </button>
        ))}
      </div>
    </section>
  );
};

const VoteBar = ({ projection, compact = false }) => {
  const simPct = Math.max(0, Math.min(100, (projection.sim / 513) * 100));
  const metaPct = Math.max(0, Math.min(100, ((projection.meta || 257) / 513) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <div>
          <p className="ui-data-label">Projeção do governo</p>
          <p className={`${compact ? 'text-lg' : 'text-2xl'} font-mono font-black text-text`}>{projection.sim} <span className="text-xs font-bold text-muted">SIM</span></p>
        </div>
        <div className="text-right">
          <p className="ui-data-label">Linha de corte</p>
          <p className="font-mono text-sm font-black text-warning">{projection.meta || 257}</p>
        </div>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full border border-border bg-bg">
        <div className={`h-full rounded-full ${projection.sim >= (projection.meta || 257) ? 'bg-success' : 'bg-warning'} transition-all`} style={{ width: `${simPct}%` }} />
        <span className="absolute inset-y-[-2px] w-[2px] bg-white/75" style={{ left: `${metaPct}%` }} />
      </div>
    </div>
  );
};

const VoteModal = ({ proposta, lei, partidos, onClose }) => {
  const { votarProposta } = useGameStore();
  const called = useRef(false);
  const [finalResult, setFinalResult] = useState(null);
  const [display, setDisplay] = useState({ sim: 0, nao: 0, abstencao: 0 });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (called.current) return undefined;
    called.current = true;
    const result = votarProposta(proposta.id, true);
    setFinalResult(result);
    const steps = 34;
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      const ratio = Math.min(1, step / steps);
      const ease = 1 - Math.pow(1 - ratio, 3);
      setDisplay({
        sim: Math.round(result.votosFavor * ease),
        nao: Math.round(result.votosContra * ease),
        abstencao: Math.round(result.abstencoes * ease),
      });
      if (step >= steps) {
        clearInterval(timer);
        setFinished(true);
      }
    }, 68);
    return () => clearInterval(timer);
  }, [proposta.id, votarProposta]);

  const encerrar = () => {
    const result = votarProposta(proposta.id, false);
    toast[result.aprovado ? 'success' : 'error'](result.aprovado ? 'Proposta aprovada na Câmara.' : 'Proposta rejeitada na Câmara.');
    onClose();
  };

  const projection = getVoteProjection(partidos, lei, proposta);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 backdrop-blur-lg">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-4">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 md:px-7">
          <div className="flex min-w-0 gap-3">
            <GameIcon icon={Gavel} tone="warning" size="lg" />
            <div className="min-w-0">
              <p className="ui-kicker">Sessão deliberativa · Câmara</p>
              <h2 className="mt-1 truncate text-xl font-black text-text">{proposta.titulo}</h2>
              <p className="mt-1 text-xs text-muted">{lei.instrumento} · {finalResult?.quorum?.rotulo || projection.quorum?.rotulo}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="ui-btn-ghost px-2"><X size={17} /></button>
        </div>

        <div className="grid gap-3 p-5 md:grid-cols-3 md:p-7">
          <div className="rounded-2xl border border-success/25 bg-success/5 p-5 text-center">
            <p className="ui-data-label text-success">Sim</p>
            <p className="mt-2 font-mono text-6xl font-black tracking-[-0.07em] text-text">{display.sim}</p>
          </div>
          <div className="rounded-2xl border border-danger/25 bg-danger/5 p-5 text-center">
            <p className="ui-data-label text-danger">Não</p>
            <p className="mt-2 font-mono text-6xl font-black tracking-[-0.07em] text-text">{display.nao}</p>
          </div>
          <div className="rounded-2xl border border-border bg-panel/70 p-5 text-center">
            <p className="ui-data-label">Abstenção</p>
            <p className="mt-2 font-mono text-6xl font-black tracking-[-0.07em] text-muted">{display.abstencao}</p>
          </div>
        </div>

        <div className="border-t border-border px-5 py-4 md:px-7">
          <div className="grid gap-3 md:grid-cols-4">
            {projection.bancadas.map((bancada) => (
              <div key={bancada.id} className="rounded-xl border border-border bg-panel/55 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-black text-text"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: PARTY_COLORS[bancada.id] }} />{bancada.sigla}</span>
                  <span className="font-mono text-xs text-muted">{bancada.sim}/{bancada.cadeiras}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg"><div className="h-full bg-primary" style={{ width: `${bancada.probabilidade}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-panel/45 px-5 py-4 md:px-7">
          <div>
            <p className="ui-data-label">Painel eletrônico</p>
            <p className={`mt-1 text-sm font-black ${finished ? (finalResult?.aprovado ? 'text-success' : 'text-danger') : 'text-warning'}`}>
              {finished ? (finalResult?.aprovado ? 'MAIORIA FORMADA' : 'GOVERNO DERROTADO') : 'VOTAÇÃO EM CURSO…'}
            </p>
          </div>
          <button type="button" disabled={!finished} onClick={encerrar} className="ui-btn-primary min-w-[180px]">
            <BadgeCheck size={16} /> Registrar resultado
          </button>
        </div>
      </div>
    </div>
  );
};

const ProposalTimeline = ({ proposta, lei, comissoes }) => {
  const steps = useMemo(() => {
    const committees = (lei?.comissoes || []).map((id) => ({ id, label: comissoes.find((c) => c.id === id)?.sigla || id.toUpperCase(), type: 'committee' }));
    const plenary = lei?.instrumento === 'PEC'
      ? [{ id: 'plenario1', label: 'Plenário 1º', type: 'plenary' }, { id: 'plenario2', label: 'Plenário 2º', type: 'plenary' }]
      : lei?.apreciacao === 'plenario' || proposta.urgencia
        ? [{ id: 'plenario1', label: 'Plenário', type: 'plenary' }]
        : [];
    return [...committees, ...plenary, { id: 'senado', label: 'Senado', type: 'senate' }, { id: 'sancao', label: 'Sanção', type: 'sanction' }];
  }, [lei, proposta.urgencia, comissoes]);

  const activeIndex = (() => {
    if (proposta.fase === 'comissao') return Math.max(0, proposta.comissaoIndex || 0);
    const base = (lei?.comissoes || []).length;
    if (proposta.fase === 'plenario') return base + ((lei?.instrumento === 'PEC' && proposta.rodadaPlenario === 2) ? 1 : 0);
    if (proposta.fase === 'senado') return steps.findIndex((s) => s.id === 'senado');
    if (proposta.fase === 'sancao') return steps.findIndex((s) => s.id === 'sancao');
    if (proposta.status === 'sancionada') return steps.length;
    return 0;
  })();

  return (
    <div className="overflow-x-auto pb-1 custom-scrollbar">
      <div className="flex min-w-max items-center gap-1">
        {steps.map((step, index) => {
          const completed = index < activeIndex || proposta.status === 'sancionada';
          const active = index === activeIndex && proposta.status !== 'sancionada';
          return (
            <React.Fragment key={step.id}>
              <div className={`flex min-w-[78px] items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[9px] font-black uppercase tracking-wider ${completed ? 'border-success/25 bg-success/8 text-success' : active ? 'border-warning/30 bg-warning/8 text-warning' : 'border-border bg-panel/45 text-muted'}`}>
                {completed ? <Check size={11} /> : active ? <Clock3 size={11} /> : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
                {step.label}
              </div>
              {index < steps.length - 1 && <ChevronRight size={12} className="text-border" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const LawCard = ({ lei, partidos, onSend, tramitando, aprovada }) => {
  const meta = CATEGORY_META[lei.categoria] || CATEGORY_META.institucional;
  const Icon = meta.icon;
  const projection = calcularProjecao({}, lei, partidos);
  const custoEnvio = Math.max(2, Math.min(10, Math.ceil((lei.custoPolitico || 20) / 9)));

  return (
    <article className="group flex min-h-[290px] flex-col rounded-2xl border border-border bg-card/75 p-4 transition-colors hover:border-white/15 hover:bg-card">
      <div className="flex items-start justify-between gap-3">
        <GameIcon icon={Icon} tone={meta.tone} />
        <div className="flex flex-wrap justify-end gap-1.5">
          <span className="ui-chip text-text">{lei.instrumento}</span>
          {lei.apreciacao === 'conclusiva' && <span className="ui-chip">Conclusiva</span>}
          {lei.polarizacao >= 70 && <span className="ui-chip border-danger/25 bg-danger/5 text-danger"><AlertTriangle size={10} /> Alta tensão</span>}
        </div>
      </div>

      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-muted">{meta.label}</p>
      <h3 className="mt-1 text-[15px] font-black leading-snug text-text">{lei.titulo}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">{lei.descricao}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border bg-panel/45 p-2.5">
          <p className="ui-data-label">Apoio inicial</p>
          <p className={`mt-1 font-mono text-lg font-black ${projection.sim >= projection.meta ? 'text-success' : 'text-warning'}`}>{projection.sim}</p>
        </div>
        <div className="rounded-xl border border-border bg-panel/45 p-2.5">
          <p className="ui-data-label">Polarização</p>
          <p className={`mt-1 font-mono text-lg font-black ${lei.polarizacao >= 70 ? 'text-danger' : lei.polarizacao >= 45 ? 'text-warning' : 'text-success'}`}>{lei.polarizacao}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3.5">
        <div>
          <p className="ui-data-label">Protocolo</p>
          <p className="mt-0.5 text-xs font-black text-text">{custoEnvio} CP</p>
        </div>
        {aprovada ? (
          <span className="ui-chip border-success/25 bg-success/5 text-success"><BadgeCheck size={11} /> Lei vigente</span>
        ) : tramitando ? (
          <span className="ui-chip border-warning/25 bg-warning/5 text-warning"><Clock3 size={11} /> Em tramitação</span>
        ) : (
          <button type="button" onClick={() => onSend(lei)} className="ui-btn-secondary"><ArrowRight size={14} /> Enviar agenda</button>
        )}
      </div>
    </article>
  );
};

const ActorCard = ({ ator, partido, onAction, onDossier }) => {
  const relationColor = ator.relacao >= 65 ? 'text-success' : ator.relacao >= 40 ? 'text-warning' : 'text-danger';
  return (
    <article className="rounded-2xl border border-border bg-card/75 p-3.5 transition-colors hover:border-white/15">
      <div className="flex items-start gap-3">
        <PoliticalAvatar name={ator.nome} seed={ator.avatarSeed} size={50} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><h3 className="truncate text-sm font-black text-text">{ator.nome}</h3><span className="h-2 w-2 rounded-full" style={{ backgroundColor: PARTY_COLORS[partido?.id] || '#7D8796' }} /></div>
          <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-wider text-muted">{ator.cargo} · {ator.uf}</p>
          <div className="mt-2 flex items-center gap-2"><span className={`font-mono text-xs font-black ${relationColor}`}>{ator.relacao}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg"><div className="h-full bg-primary" style={{ width: `${ator.relacao}%` }} /></div></div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-[11px] italic leading-relaxed text-muted">“{ator.frase}”</p>
      <div className="mt-3 flex items-center justify-between gap-2"><button type="button" onClick={() => onDossier?.(ator)} className="ui-btn-secondary px-2.5"><BookOpen size={12} /> Dossiê</button><div className="flex gap-1"><button title="Conversar" type="button" onClick={() => onAction(ator, 'conversa')} className="ui-btn-ghost border border-border px-2"><Handshake size={12}/></button><button title="Dar protagonismo" type="button" onClick={() => onAction(ator, 'protagonismo')} className="ui-btn-ghost border border-border px-2"><Sparkles size={12}/></button><button title="Firmar compromisso de pauta" type="button" onClick={() => onAction(ator, 'promessa_pauta')} className="ui-btn-ghost border border-border px-2"><LockKeyhole size={12}/></button></div></div>
    </article>
  );
};

export default function Congress() {
  const {
    partidos,
    congresso,
    atoresCongresso,
    comissoes,
    votacoes,
    leisDisponiveis,
    leisAprovadas,
    leisEmTramitacao,
    capitalPolitico,
    enviarLeiParaCongresso,
    executarArticulacaoCongresso,
    negociarAtorCongresso,
    sancionarProjeto,
  } = useGameStore();

  const [tab, setTab] = useState('plenario');
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [voteProposal, setVoteProposal] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('todas');
  const [instrument, setInstrument] = useState('todos');
  const [dossierActor, setDossierActor] = useState(null);
  const [actorPage, setActorPage] = useState(0);

  const activeProposals = useMemo(() => votacoes.filter((v) => !['arquivada', 'vetada', 'sancionada'].includes(v.status)), [votacoes]);
  const selectedProposal = activeProposals.find((v) => v.id === selectedProposalId) || activeProposals[0] || null;
  const selectedLaw = selectedProposal ? leisDisponiveis.find((l) => l.id === selectedProposal.leiId) : null;
  const projection = selectedProposal && selectedLaw ? getVoteProjection(partidos, selectedLaw, selectedProposal) : null;

  useEffect(() => {
    if (!selectedProposalId && activeProposals[0]) setSelectedProposalId(activeProposals[0].id);
  }, [activeProposals, selectedProposalId]);

  const billsReady = activeProposals.filter((v) => v.status === 'votacao_hoje');
  const sanctions = activeProposals.filter((v) => v.status === 'aguardando_sancao');
  const committeeBills = activeProposals.filter((v) => v.fase === 'comissao' || v.status === 'aguarda_segundo_turno' || v.status === 'senado');

  const filteredLaws = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leisDisponiveis.filter((lei) => {
      if (category !== 'todas' && lei.categoria !== category) return false;
      if (instrument !== 'todos' && lei.instrumento !== instrument) return false;
      if (!term) return true;
      return `${lei.titulo} ${lei.descricao} ${(lei.tags || []).join(' ')}`.toLowerCase().includes(term);
    });
  }, [leisDisponiveis, search, category, instrument]);

  const submitLaw = (lei) => {
    const result = enviarLeiParaCongresso(lei.id);
    if (result?.ok) {
      toast.success(`${lei.instrumento} protocolado na Câmara.`);
      setSelectedProposalId(result.propostaId);
      setTab('comissoes');
    } else toast.error(result?.motivo || 'Não foi possível enviar a proposta.');
  };

  const articulate = (acaoId) => {
    if (!selectedProposal) return;
    const result = executarArticulacaoCongresso(selectedProposal.id, acaoId);
    if (result?.ok) toast.success(`${result.acao.titulo} executada.`);
    else toast.error(result?.motivo || 'Movimento indisponível.');
  };

  const actorAction = (ator, estrategia) => {
    const result = negociarAtorCongresso(ator.id, estrategia);
    if (result?.ok) toast.success(`${result.acao.label} com ${ator.nome}.`);
    else toast.error(result?.motivo || 'Ação indisponível.');
  };

  const decideSanction = (proposal, sanction) => {
    const result = sancionarProjeto(proposal.id, sanction);
    if (result?.ok) toast[ sanction ? 'success' : 'warning'](sanction ? 'Lei sancionada.' : 'Veto presidencial registrado.');
    else toast.error(result?.motivo || 'Não foi possível registrar a decisão.');
  };

  const baseVotes = partidos.reduce((acc, p) => acc + Math.floor(p.cadeiras * (p.apoio / 100)), 0);
  const scandalRisk = congresso?.riscoEscandalo || 0;

  return (
    <div className="ui-page space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="ui-stat flex items-center gap-3">
          <GameIcon icon={KeyRound} tone="violet" />
          <div><p className="ui-data-label">Poder de bastidor</p><p className="ui-data-value mt-1">{congresso?.poder ?? 0}<span className="text-xs text-muted">/100</span></p></div>
        </div>
        <div className="ui-stat flex items-center gap-3">
          <GameIcon icon={Vote} tone={baseVotes >= 257 ? 'success' : 'warning'} />
          <div><p className="ui-data-label">Base nominal</p><p className={`ui-data-value mt-1 ${baseVotes >= 257 ? 'text-success' : 'text-warning'}`}>{baseVotes}<span className="text-xs text-muted">/513</span></p></div>
        </div>
        <div className="ui-stat flex items-center gap-3">
          <GameIcon icon={AlertTriangle} tone={scandalRisk >= 50 ? 'danger' : scandalRisk >= 25 ? 'warning' : 'neutral'} />
          <div><p className="ui-data-label">Risco de vazamento</p><p className={`ui-data-value mt-1 ${scandalRisk >= 50 ? 'text-danger' : scandalRisk >= 25 ? 'text-warning' : ''}`}>{scandalRisk}%</p></div>
        </div>
        <div className="ui-stat flex items-center gap-3">
          <GameIcon icon={BookOpen} tone="info" />
          <div><p className="ui-data-label">Agenda ativa</p><p className="ui-data-value mt-1">{activeProposals.length}<span className="text-xs text-muted"> projetos</span></p></div>
        </div>
      </section>

      <div className="ui-tabs flex w-full overflow-x-auto custom-scrollbar">
        {[
          { id: 'plenario', label: 'Plenário', icon: Landmark },
          { id: 'comissoes', label: 'Comissões & Tramitação', icon: Scale },
          { id: 'articulacao', label: 'Articulação', icon: KeyRound },
          { id: 'banco', label: `Banco de Leis · ${leisDisponiveis.length}`, icon: BookOpen },
        ].map((item) => {
          const Icon = item.icon;
          return <button type="button" key={item.id} onClick={() => setTab(item.id)} className={`ui-tab flex shrink-0 flex-1 items-center justify-center gap-2 ${tab === item.id ? 'ui-tab-active text-success' : ''}`}><Icon size={15} />{item.label}</button>;
        })}
      </div>

      {tab === 'plenario' && (
        <div className="space-y-4 animate-fadeIn">
          <CompactHemicycle partidos={partidos} selectedParty={selectedParty} onSelectParty={setSelectedParty} />

          <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
            <section className="ui-surface p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3"><GameIcon icon={Gavel} tone="warning" size="sm" /><div><p className="ui-kicker">Ordem do Dia</p><h3 className="mt-0.5 text-sm font-black text-text">Votações prontas</h3></div></div>
                <span className="ui-chip">{billsReady.length} em pauta</span>
              </div>

              <div className="mt-4 space-y-3">
                {billsReady.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-panel/25 px-5 py-9 text-center">
                    <Gavel size={28} className="mx-auto text-muted/35" />
                    <p className="mt-3 text-sm font-black text-muted">Nenhuma matéria pronta para votação.</p>
                    <p className="mt-1 text-xs text-muted/70">Envie uma proposta e conduza a tramitação nas comissões.</p>
                  </div>
                ) : billsReady.map((proposal) => {
                  const law = leisDisponiveis.find((item) => item.id === proposal.leiId);
                  const p = getVoteProjection(partidos, law, proposal);
                  return (
                    <article key={proposal.id} className="rounded-2xl border border-border bg-panel/45 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><span className="ui-chip text-text">{law?.instrumento}</span>{law?.instrumento === 'PEC' && <span className="ui-chip">{proposal.rodadaPlenario || 1}º turno</span>}</div>
                          <h4 className="mt-2 text-base font-black text-text">{proposal.titulo}</h4>
                          <p className="mt-1 text-xs text-muted">{proposal.descricao}</p>
                        </div>
                        <button type="button" onClick={() => setVoteProposal(proposal)} className="ui-btn-primary"><Play size={15} /> Abrir votação</button>
                      </div>
                      <div className="mt-4"><VoteBar projection={p} compact /></div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="ui-surface p-4 md:p-5">
              <div className="flex items-center gap-3"><GameIcon icon={FilePenLine} tone="success" size="sm" /><div><p className="ui-kicker">Palácio do Planalto</p><h3 className="mt-0.5 text-sm font-black text-text">Sanção presidencial</h3></div></div>
              <div className="mt-4 space-y-3">
                {sanctions.length === 0 ? <p className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted">Nenhum projeto aguarda sua assinatura.</p> : sanctions.map((proposal) => (
                  <article key={proposal.id} className="rounded-xl border border-warning/25 bg-warning/5 p-4">
                    <p className="text-sm font-black text-text">{proposal.titulo}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-warning">Aprovado nas duas Casas</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => decideSanction(proposal, true)} className="ui-btn-primary"><Check size={14} /> Sancionar</button>
                      <button type="button" onClick={() => decideSanction(proposal, false)} className="ui-btn-secondary"><X size={14} /> Vetar</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'comissoes' && (
        <div className="grid gap-4 xl:grid-cols-[.92fr_1.08fr] animate-fadeIn">
          <section className="ui-surface overflow-hidden">
            <div className="border-b border-border px-4 py-4 md:px-5">
              <div className="flex items-center justify-between gap-3"><div><p className="ui-kicker">Esteira legislativa</p><h3 className="mt-1 text-base font-black text-text">Projetos em tramitação</h3></div><span className="ui-chip">{committeeBills.length}</span></div>
            </div>
            <div className="max-h-[640px] space-y-2 overflow-y-auto p-3 custom-scrollbar">
              {activeProposals.length === 0 ? <p className="p-6 text-center text-sm text-muted">Nenhum projeto ativo. Abra o Banco de Leis e envie sua agenda.</p> : activeProposals.map((proposal) => {
                const law = leisDisponiveis.find((item) => item.id === proposal.leiId);
                const active = selectedProposal?.id === proposal.id;
                return (
                  <button type="button" key={proposal.id} onClick={() => setSelectedProposalId(proposal.id)} className={`w-full rounded-xl border p-3 text-left transition-colors ${active ? 'border-primary/45 bg-primary/8' : 'border-border bg-panel/35 hover:bg-panel/65'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><div className="flex items-center gap-2"><span className="ui-chip py-0.5">{law?.instrumento}</span><span className={`text-[9px] font-black uppercase tracking-wider ${statusTone(proposal) === 'warning' ? 'text-warning' : statusTone(proposal) === 'danger' ? 'text-danger' : 'text-info'}`}>{statusLabel(proposal)}</span></div><p className="mt-2 truncate text-sm font-black text-text">{proposal.titulo}</p></div>
                      <ChevronRight size={15} className="mt-1 shrink-0 text-muted" />
                    </div>
                    <div className="mt-3"><ProposalTimeline proposta={proposal} lei={law} comissoes={comissoes} /></div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="ui-surface p-4 md:p-5">
            {!selectedProposal || !selectedLaw ? (
              <div className="py-20 text-center text-muted"><Scale size={34} className="mx-auto opacity-25" /><p className="mt-3 text-sm font-black">Selecione uma matéria para abrir o dossiê.</p></div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2"><span className="ui-chip text-text">{selectedLaw.instrumento}</span><span className="ui-chip">{CATEGORY_META[selectedLaw.categoria]?.label || selectedLaw.categoria}</span><span className={`ui-chip ${selectedProposal.urgencia ? 'border-warning/25 bg-warning/5 text-warning' : ''}`}>{selectedProposal.urgencia ? 'Urgência' : selectedLaw.apreciacao === 'conclusiva' ? 'Conclusiva nas comissões' : 'Sujeita ao Plenário'}</span></div>
                    <h2 className="mt-3 text-xl font-black tracking-[-0.025em] text-text">{selectedProposal.titulo}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{selectedProposal.descricao}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-panel/50 px-3 py-2 text-right"><p className="ui-data-label">Polarização</p><p className={`mt-1 font-mono text-xl font-black ${selectedProposal.polarizacaoAtual >= 70 ? 'text-danger' : selectedProposal.polarizacaoAtual >= 45 ? 'text-warning' : 'text-success'}`}>{selectedProposal.polarizacaoAtual}</p></div>
                </div>

                <div className="mt-5"><ProposalTimeline proposta={selectedProposal} lei={selectedLaw} comissoes={comissoes} /></div>

                {selectedProposal.fase === 'comissao' && (
                  <div className="mt-5 rounded-2xl border border-border bg-panel/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div><p className="ui-data-label">Comissão atual</p><p className="mt-1 text-sm font-black text-text">{comissoes.find(c => c.id === selectedProposal.comissaoAtual)?.nome || selectedProposal.comissaoAtual}</p></div>
                      <span className="ui-chip text-warning"><TimerReset size={11} /> {selectedProposal.turnosNaEtapa || 0} mês(es)</span>
                    </div>
                    {(() => {
                      const relator = atoresCongresso.find(a => a.id === selectedProposal.relatorId);
                      return relator ? <div className="mt-4 flex items-center gap-3 border-t border-border pt-3"><PoliticalAvatar name={relator.nome} seed={relator.avatarSeed} size={44} /><div><p className="ui-data-label">Relatoria / influência</p><p className="mt-0.5 text-xs font-black text-text">{relator.nome} · relação {relator.relacao}/100</p></div></div> : null;
                    })()}
                  </div>
                )}

                <div className="mt-5"><VoteBar projection={projection} /></div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between"><p className="ui-section-title"><KeyRound size={13} /> Sala de articulação</p><span className="text-[10px] text-muted">Movimentos afetam este projeto</span></div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ACOES_ARTICULACAO.map((action) => {
                      const Icon = ACTION_ICONS[action.icone] || KeyRound;
                      const disabled = (congresso?.poder || 0) < action.custoPoder || capitalPolitico < (action.custoCapital || 0) || (action.id === 'urgencia' && !selectedLaw.admiteUrgencia);
                      return (
                        <button type="button" key={action.id} disabled={disabled} onClick={() => articulate(action.id)} className="group rounded-xl border border-border bg-panel/40 p-3 text-left transition-colors hover:border-primary/35 hover:bg-card disabled:cursor-not-allowed disabled:opacity-35">
                          <div className="flex items-start gap-3"><GameIcon icon={Icon} tone={action.id === 'bastidor' ? 'danger' : action.id === 'urgencia' ? 'warning' : 'neutral'} size="sm" /><div className="min-w-0 flex-1"><p className="text-xs font-black text-text">{action.titulo}</p><p className="mt-1 text-[10px] leading-relaxed text-muted">{action.descricao}</p></div></div>
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] font-bold"><span className="ui-chip py-0.5">-{action.custoPoder} poder</span>{action.custoCapital > 0 && <span className="ui-chip py-0.5">-{action.custoCapital} CP</span>}{action.custoOrcamento > 0 && <span className="ui-chip py-0.5">R$ {action.custoOrcamento}M</span>}{action.risco > 0 && <span className="ui-chip border-danger/20 py-0.5 text-danger">+{action.risco} risco</span>}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="ui-section-title">Últimos movimentos</p>
                  <div className="mt-3 space-y-2">
                    {(selectedProposal.historico || []).slice(0, 5).map((item, index) => <div key={`${item.tipo}-${index}`} className="flex gap-3 text-xs"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" /><div><span className="font-black text-text">{item.turno ? `Mês ${item.turno}` : 'Agora'}</span><span className="text-muted"> · {item.texto}</span></div></div>)}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {tab === 'articulacao' && (
        <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr] animate-fadeIn">
          <section className="ui-surface p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="ui-kicker">Cúpula da Câmara</p><h3 className="mt-1 text-base font-black text-text">Quem realmente move a Casa</h3><p className="mt-1 text-xs text-muted">Relação, influência, ambição e risco importam tanto quanto a bancada.</p></div>
              <span className="ui-chip"><KeyRound size={11} /> {congresso?.poder || 0} poder disponível</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {atoresCongresso.slice(actorPage*6,actorPage*6+6).map((ator) => <ActorCard key={ator.id} ator={ator} partido={partidos.find(p => p.id === ator.partidoId)} onAction={actorAction} onDossier={setDossierActor} />)}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3"><span className="text-[10px] font-black uppercase tracking-wider text-muted">6 por página · {atoresCongresso.length} atores</span><div className="flex gap-2"><button disabled={actorPage===0} onClick={()=>setActorPage(0)} className="ui-btn-secondary px-3">1</button><button disabled={actorPage===1} onClick={()=>setActorPage(1)} className="ui-btn-secondary px-3">2</button></div></div>
          </section>

          <div className="space-y-4">
            <section className="ui-surface p-4 md:p-5">
              <div className="flex items-center gap-3"><GameIcon icon={KeyRound} tone="violet" /><div><p className="ui-kicker">Capital informal</p><h3 className="mt-1 text-sm font-black text-text">Poder de Bastidor</h3></div></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg"><div className="h-full bg-gradient-to-r from-violet-500 to-primary" style={{ width: `${congresso?.poder || 0}%` }} /></div>
              <p className="mt-3 text-xs leading-relaxed text-muted">Vitórias difíceis, acordos cumpridos e relações fortes aumentam seu poder. Derrotas e exposição reduzem sua capacidade de controlar a agenda.</p>
            </section>

            <section className="ui-surface p-4 md:p-5">
              <div className="flex items-center gap-3"><GameIcon icon={AlertTriangle} tone={scandalRisk >= 35 ? 'danger' : 'warning'} /><div><p className="ui-kicker">Custo oculto</p><h3 className="mt-1 text-sm font-black text-text">Risco de vazamento</h3></div></div>
              <p className={`mt-4 font-mono text-4xl font-black ${scandalRisk >= 50 ? 'text-danger' : scandalRisk >= 25 ? 'text-warning' : 'text-success'}`}>{scandalRisk}%</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">Movimentos agressivos acumulam risco. Um vazamento pode virar crise, CPI ou derrubar relações com lideranças.</p>
            </section>

            <section className="ui-surface p-4 md:p-5">
              <p className="ui-section-title"><Handshake size={13} /> Compromissos ativos</p>
              <div className="mt-3 space-y-2">
                {(congresso?.acordos || []).length === 0 ? <p className="text-xs text-muted">Nenhum compromisso de pauta registrado.</p> : (congresso.acordos || []).slice(0, 5).map((deal) => {
                  const actor = atoresCongresso.find(a => a.id === deal.atorId);
                  return <div key={deal.id} className="rounded-xl border border-border bg-panel/40 p-3"><p className="text-xs font-black text-text">{deal.titulo}</p><p className="mt-1 text-[10px] text-muted">{actor?.nome || 'Liderança'} · firmado no mês {deal.turno}</p></div>;
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'banco' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="ui-toolbar">
            <div className="relative min-w-[240px] flex-1 md:max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar reforma, tema ou palavra-chave…" className="h-10 w-full rounded-xl border border-border bg-bg/70 pl-9 pr-3 text-sm text-text placeholder:text-muted/60" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-bg/50 px-3"><Filter size={13} className="text-muted" /><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 bg-transparent text-xs font-bold text-text outline-none">{categoriasLeis.map(c => <option key={c.id} value={c.id} className="bg-card">{c.nome}</option>)}</select></div>
              <div className="rounded-xl border border-border bg-bg/50 px-3"><select value={instrument} onChange={(e) => setInstrument(e.target.value)} className="h-10 bg-transparent text-xs font-bold text-text outline-none"><option value="todos" className="bg-card">Todos os instrumentos</option><option value="PL" className="bg-card">PL</option><option value="PLP" className="bg-card">PLP</option><option value="PEC" className="bg-card">PEC</option></select></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <p className="text-xs text-muted"><span className="font-black text-text">{filteredLaws.length}</span> propostas no catálogo · conteúdo fictício para simulação brasileira.</p>
            <div className="flex gap-2"><span className="ui-chip"><Banknote size={11} /> {capitalPolitico} CP</span><span className="ui-chip"><Building2 size={11} /> Fiscal via primário</span></div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredLaws.map((lei) => <LawCard key={lei.id} lei={lei} partidos={partidos} onSend={submitLaw} tramitando={leisEmTramitacao.includes(lei.id)} aprovada={leisAprovadas.includes(lei.id)} />)}
          </div>
        </div>
      )}

      {dossierActor && <CharacterDossierModal
        person={dossierActor}
        onClose={()=>setDossierActor(null)}
        eyebrow="Cúpula da Câmara"
        subtitle={`${dossierActor.cargo} · ${dossierActor.uf}`}
        imageKey={dossierActor.avatarSeed}
        stats={[
          {label:'Relação',value:dossierActor.relacao},
          {label:'Influência',value:dossierActor.influencia},
          {label:'Ambição',value:dossierActor.ambicao},
          {label:'Lealdade',value:dossierActor.lealdade},
          {label:'Risco',value:dossierActor.risco},
        ]}
      />}

      {voteProposal && (
        <VoteModal
          proposta={voteProposal}
          lei={leisDisponiveis.find(l => l.id === voteProposal.leiId)}
          partidos={partidos}
          onClose={() => setVoteProposal(null)}
        />
      )}
    </div>
  );
}
