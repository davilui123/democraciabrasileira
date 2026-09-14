import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Landmark,
  LayoutDashboard,
  Trophy,
  UsersRound,
  Vote,
  MapPinned,
  Sparkles,
  Scale,
  Factory,
  ClipboardList,
} from 'lucide-react';
import useGameStore from './store/useGameStore';
import { Toaster, toast } from './components/sonner';

import Dashboard from './components/Dashboard';
import Ministries from './components/Ministries';
import Congress from './components/Congress';
import Geopolitics from './components/Geopolitics';
import Economy from './components/Economy';
import NewsTicker from './components/NewsTicker';
import NewsCenter from './components/NewsCenter';
import Achievements from './components/Achievements';
import ElectionCenter from './components/ElectionCenter';
import Indicators from './components/Indicators';
import GameIcon from './components/GameIcon';
import MinisterPhone from './components/MinisterPhone';
import StartScreen from './components/StartScreen';
import Federation from './components/Federation';
import SpecialProjects from './components/SpecialProjects';
import TurnTransitionModal from './components/TurnTransitionModal';
import StateCompanies from './components/StateCompanies';
import GovernmentPrograms from './components/GovernmentPrograms';
import Institutions from './components/Institutions';
import FederalCrisisModal from './components/FederalCrisisModal';
import { conquistaPorId } from './data/seed/conquistas.js';

const navigation = [
  { section: 'Governo', id: 'gabinete', label: 'Gabinete', icon: LayoutDashboard },
  { section: 'Governo', id: 'ministerios', label: 'Ministérios', icon: BriefcaseBusiness },
  { section: 'Política', id: 'congresso', label: 'Congresso Nacional', icon: UsersRound },
  { section: 'Política', id: 'federacao', label: 'Brasil & Estados', icon: MapPinned },
  { section: 'Política', id: 'oposicao', label: 'Oposição', icon: UsersRound },
  { section: 'Estratégia', id: 'economia', label: 'Economia & Fazenda', icon: CircleDollarSign },
  { section: 'Estratégia', id: 'estatais', label: 'Empresas', icon: Factory },
  { section: 'Estratégia', id: 'programas', label: 'Programas', icon: ClipboardList },
  { section: 'Estratégia', id: 'instituicoes', label: 'Instituições', icon: Scale },
  { section: 'Estratégia', id: 'projetos', label: 'Projetos Especiais', icon: Sparkles },
  { section: 'Estratégia', id: 'indicadores', label: 'Indicadores', icon: BarChart3 },
  { section: 'Estratégia', id: 'mapa', label: 'Geopolítica', icon: Globe2 },
];

const tabMeta = {
  gabinete: {
    eyebrow: 'Palácio do Planalto',
    title: 'Gabinete Presidencial',
    description: 'Síntese do poder, riscos do mês e prioridades da Presidência.',
  },
  ministerios: {
    eyebrow: 'Poder Executivo',
    title: 'Conselho de Ministros',
    description: 'Coordenação política, desempenho das pastas e crises de governo.',
  },
  congresso: {
    eyebrow: 'Praça dos Três Poderes',
    title: 'Congresso Nacional',
    description: 'Base parlamentar, negociações, tramitação e votações em plenário.',
  },
  federacao: {
    eyebrow: 'Pacto Federativo',
    title: 'Brasil & Estados',
    description: 'Governadores, investimentos regionais e mapa eleitoral do governo.',
  },
  oposicao: {
    eyebrow: 'Disputa de Poder',
    title: 'Oposição',
    description: 'O candidato derrotado, sua cúpula e a estratégia para bloquear ou desgastar o governo.',
  },
  economia: {
    eyebrow: 'Política Econômica',
    title: 'Economia & Fazenda',
    description: 'Tributos, dívida, crédito, medidas anticíclicas e gestão de crises macroeconômicas.',
  },
  estatais: {
    eyebrow: 'Capital & Estado',
    title: 'Empresas',
    description: 'Estatais, empresas privadas, parcerias estratégicas e investimento produtivo.',
  },
  programas: {
    eyebrow: 'Política Pública',
    title: 'Programas Governamentais',
    description: 'Promessas, metas, orçamento, território e execução de políticas estruturantes.',
  },
  instituicoes: {
    eyebrow: 'Equilíbrio de Poderes',
    title: 'Instituições',
    description: 'STF, TCU, PGR, Banco Central e os limites institucionais do poder presidencial.',
  },
  projetos: {
    eyebrow: 'Legado Presidencial',
    title: 'Projetos Especiais',
    description: 'Programas estratégicos de longo prazo que podem definir seu governo.',
  },
  indicadores: {
    eyebrow: 'Sala de Dados',
    title: 'Indicadores Nacionais',
    description: 'Leitura consolidada do país para orientar decisões de governo.',
  },
  eleicoes: {
    eyebrow: 'Eleições Gerais 2026',
    title: 'Comando Eleitoral',
    description: 'Pré-campanha, convenção, chapa, recursos, estados e campanha presidencial.',
  },
  mapa: {
    eyebrow: 'Itamaraty',
    title: 'Geopolítica & Diplomacia',
    description: 'Relações internacionais, blocos, tratados e projeção brasileira.',
  },
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
      active
        ? 'bg-card text-text border border-border shadow-elevation-1'
        : 'text-muted border border-transparent hover:bg-card/55 hover:text-text'
    }`}
  >
    <GameIcon icon={Icon} tone={active ? 'success' : 'neutral'} size="sm" />
    <span className="min-w-0 flex-1 truncate text-[13px] font-bold">{label}</span>
    {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />}
  </button>
);

const AttentionDots = ({ agenda }) => (
  <div className="flex items-center gap-1" aria-label={`${agenda?.pontosRestantes ?? 3} pontos de atenção disponíveis`}>
    {Array.from({ length: agenda?.pontosMax || 3 }).map((_, index) => (
      <span
        key={index}
        className={`h-2 w-5 rounded-full border ${index < (agenda?.pontosRestantes ?? 3) ? 'border-warning/60 bg-warning' : 'border-border bg-panel'}`}
      />
    ))}
  </div>
);

function App() {
  const {
    turno,
    dataString,
    diasParaEleicao,
    faseEleitoral,
    economia,
    popularidade,
    proximoTurno,
    verificarConquistas,
    eventosRecentes,
    mandato,
    carregarDadosIniciais,
    isLoading,
    agendaPresidencial,
    carregarJogo,
    limparSave,
    configurarPerfilPresidencial,
    perfilPresidencial, nomeacoes, partidos, estados, projetosEspeciais, eventosEstatais, stf, institucional, paises, geopolitica, estatais, gruposSociais,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('gabinete');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showTurn, setShowTurn] = useState(false);
  const [selectedUF, setSelectedUF] = useState('SP');

  const ultimoEventoRef = useRef(null);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  useEffect(() => {
    if (!eventosRecentes?.length) return;
    const eventoMaisNovo = eventosRecentes[0];
    if (eventoMaisNovo === ultimoEventoRef.current) return;

    if (eventoMaisNovo.startsWith('🏆 Conquista:')) {
      ultimoEventoRef.current = eventoMaisNovo;
      return;
    }

    if (eventoMaisNovo.includes('STF')) {
      if (eventoMaisNovo.includes('suspende') || eventoMaisNovo.includes('INCONSTITUCIONAL')) {
        toast.error(eventoMaisNovo, { duration: 6000 });
      } else {
        toast.success(eventoMaisNovo, { duration: 5000 });
      }
    } else if (eventoMaisNovo.includes('Inflação') || eventoMaisNovo.includes('CUIDADO')) {
      toast.warning(eventoMaisNovo);
    } else {
      toast(eventoMaisNovo);
    }
    ultimoEventoRef.current = eventoMaisNovo;
  }, [eventosRecentes]);

  useEffect(() => {
    if (!sessionStarted) return;
    const novas = verificarConquistas() || [];
    novas.forEach((conquista) => {
      const metaConquista = conquistaPorId(conquista.id) || conquista;
      toast.success(
        <div className="flex items-start gap-3">
          <div className="text-2xl">{metaConquista.icone || '🏆'}</div>
          <div>
            <p className="font-black">Conquista desbloqueada: {metaConquista.titulo}</p>
            <p className="mt-0.5 text-xs opacity-90">{metaConquista.recompensa?.nome}</p>
            <p className="mt-1 text-[11px] opacity-70">{metaConquista.recompensa?.texto}</p>
          </div>
        </div>,
        { duration: 7500 },
      );
    });
  }, [
    sessionStarted, turno, popularidade, economia, nomeacoes, partidos, estados, projetosEspeciais, eventosEstatais,
    stf, institucional, paises, geopolitica, estatais, gruposSociais, verificarConquistas,
  ]);

  const formatMoney = (val) => `R$ ${(val / 1000).toFixed(1)} bi`;
  const navigationItems = faseEleitoral !== 'governo'
    ? [...navigation, { section: 'Política', id: 'eleicoes', label: 'Eleições 2026', icon: Vote }]
    : navigation;
  const meta = tabMeta[activeTab] || tabMeta.gabinete;

  useEffect(() => {
    if (sessionStarted && faseEleitoral !== 'governo' && activeTab === 'gabinete') setActiveTab('eleicoes');
  }, [faseEleitoral, sessionStarted]);

  const iniciarNovoJogo = (perfil) => {
    const existeSave = !!localStorage.getItem('democracia-brasileira:save:v15') || !!localStorage.getItem('democracia-brasileira:save:v14') || !!localStorage.getItem('democracia-brasileira:save:v13') || !!localStorage.getItem('democracia-brasileira:save:v12') || !!localStorage.getItem('democracia-brasileira:save:v11') || !!localStorage.getItem('democracia-brasileira:save:v10') || !!localStorage.getItem('democracia-brasileira:save:v9') || !!localStorage.getItem('democracia-brasileira:save:v8') || !!localStorage.getItem('democracia-brasileira:save:v7') || !!localStorage.getItem('democracia-brasileira:save:v6') || !!localStorage.getItem('democracia-brasileira:save:v5') || !!localStorage.getItem('democracia-brasileira:save:v4');
    if (existeSave && !window.confirm('Iniciar um novo jogo apagará o save local atual. Continuar?')) return;
    limparSave();
    configurarPerfilPresidencial(perfil || {});
    setActiveTab('gabinete');
    setSessionStarted(true);
  };

  const continuarJogo = () => {
    if (carregarJogo()) {
      setActiveTab('gabinete');
      setSessionStarted(true);
    } else {
      toast.error('Nenhum jogo salvo foi encontrado.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-bg text-text">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card shadow-elevation-4">
          <Landmark className="text-success" size={30} />
          <span className="absolute inset-[-7px] animate-spin rounded-full border-2 border-transparent border-t-warning" />
        </div>
        <div className="text-center">
          <p className="ui-kicker">República Federativa do Brasil</p>
          <h2 className="mt-2 text-xl font-black">Preparando o governo</h2>
          <p className="mt-1 text-sm text-muted">Carregando ministérios, Congresso e cenário internacional.</p>
        </div>
      </div>
    );
  }

  if (!sessionStarted) {
    return <StartScreen onNewGame={iniciarNovoJogo} onContinue={continuarJogo} />;
  }


  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg font-sans text-text">
      <Toaster position="top-right" expand richColors />
      <NewsTicker onOpen={() => setShowNews(true)} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-[252px] shrink-0 flex-col border-r border-border bg-panel/95 lg:flex">
          <div className="border-b border-border px-5 pb-5 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-success shadow-elevation-1">
                <Landmark size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-warning">Presidência</p>
                <h1 className="truncate text-lg font-black tracking-[-0.03em] text-text">{perfilPresidencial?.nomePublico||'Planalto'}</h1><p className="truncate text-[9px] font-bold text-muted">{perfilPresidencial?.handle||'@Presidencia'}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-bg/50 px-3 py-2.5">
              <div>
                <p className="ui-data-label">Aprovação</p>
                <p className={`mt-0.5 text-lg font-black ${popularidade.geral >= 50 ? 'text-success' : popularidade.geral >= 30 ? 'text-warning' : 'text-danger'}`}>
                  {popularidade.geral.toFixed(0)}%
                </p>
              </div>
              <div className="w-20">
                <div className="h-1.5 overflow-hidden rounded-full bg-panel">
                  <div
                    className={`${popularidade.geral >= 50 ? 'bg-success' : popularidade.geral >= 30 ? 'bg-warning' : 'bg-danger'} h-full rounded-full`}
                    style={{ width: `${Math.max(0, Math.min(100, popularidade.geral))}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-[9px] font-bold uppercase tracking-wider text-muted">Nacional</p>
              </div>
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            {['Governo', 'Política', 'Estratégia'].map((section) => (
              <div key={section} className="mb-5">
                <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-muted/70">{section}</p>
                <div className="space-y-1">
                  {navigationItems.filter((item) => item.section === section).map((item) => (
                    <SidebarItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-3">
              <SidebarItem icon={Trophy} label="Conquistas" active={false} onClick={() => setShowAchievements(true)} />
            </div>
          </nav>

          <div className="border-t border-border p-4">
            <div className="rounded-xl border border-border bg-bg/55 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-muted">
                  <CalendarDays size={15} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Próxima eleição</span>
                </div>
                <span className="font-mono text-sm font-black text-warning">{diasParaEleicao}d</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="gov-shell-grid relative flex min-w-0 flex-1 flex-col bg-bg">
          <header className="shrink-0 border-b border-border bg-panel/80 backdrop-blur-xl">
            <div className="flex min-h-[82px] items-center justify-between gap-6 px-4 md:px-7 xl:px-9">
              <div className="min-w-0">
                <p className="ui-kicker">{meta.eyebrow}</p>
                <div className="mt-1 flex min-w-0 items-baseline gap-3">
                  <h2 className="truncate text-xl font-black tracking-[-0.03em] text-text md:text-2xl">{meta.title}</h2>
                  <span className="hidden truncate text-xs text-muted 2xl:inline">{meta.description}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <div className="hidden min-w-[112px] rounded-xl border border-border bg-card/65 px-3 py-2 xl:block">
                  <p className="ui-data-label">Atenção presidencial</p>
                  <div className="mt-2"><AttentionDots agenda={agendaPresidencial} /></div>
                </div>

                <div className="hidden min-w-[130px] rounded-xl border border-border bg-card/65 px-3 py-2 md:block">
                  <p className="ui-data-label">Resultado primário</p>
                  <p className={`mt-0.5 font-mono text-sm font-black ${(economia?.resultadoPrimario || 0) >= 0 ? 'text-success' : 'text-danger'}`}>{formatMoney(economia?.resultadoPrimario || 0)}</p>
                </div>

                <div className="hidden min-w-[116px] rounded-xl border border-border bg-card/65 px-3 py-2 2xl:block">
                  <p className="ui-data-label">Calendário</p>
                  <p className="mt-0.5 text-xs font-black text-text">{dataString}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Mandato {mandato}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTurn(true)}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary px-3.5 py-2.5 text-xs font-black uppercase tracking-[0.06em] text-white shadow-elevation-2 hover:bg-primary-hover md:px-5"
                >
                  <span className="hidden sm:inline">Encerrar mês</span>
                  <span className="sm:hidden">Mês</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto border-t border-border/70 px-3 py-2 lg:hidden">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${activeTab === item.id ? 'border-border bg-card text-text' : 'border-transparent text-muted'}`}
                  >
                    <Icon size={15} /> {item.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div className={`min-h-0 flex-1 ${['gabinete','ministerios','federacao','oposicao','economia','estatais','programas','instituicoes','projetos','mapa'].includes(activeTab) ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className="mx-auto h-full w-full max-w-[1520px] px-4 py-4 md:px-7 md:py-5 xl:px-9">
              {activeTab === 'gabinete' && <Dashboard onOpenState={(uf) => { setSelectedUF(uf); setActiveTab('federacao'); }} />}
              {activeTab === 'ministerios' && <Ministries />}
              {activeTab === 'congresso' && <Congress />}
              {activeTab === 'eleicoes' && <ElectionCenter />}
              {activeTab === 'federacao' && <Federation initialUF={selectedUF} />}
              {activeTab === 'oposicao' && <Institutions initialTab="oposicao" />}
              {activeTab === 'economia' && <Economy />}
              {activeTab === 'estatais' && <StateCompanies />}
              {activeTab === 'programas' && <GovernmentPrograms />}
              {activeTab === 'instituicoes' && <Institutions />}
              {activeTab === 'projetos' && <SpecialProjects />}
              {activeTab === 'mapa' && <Geopolitics />}
              {activeTab === 'indicadores' && <Indicators />}
            </div>
          </div>

          {showAchievements && <Achievements onClose={() => setShowAchievements(false)} />}
          {showNews && <NewsCenter onClose={() => setShowNews(false)} onNavigate={(tab) => { setActiveTab(tab); setShowNews(false); }} />}
          <MinisterPhone />
          <FederalCrisisModal />
          {showTurn && <TurnTransitionModal onClose={() => setShowTurn(false)} />}
        </main>
      </div>
    </div>
  );
}

export default App;
