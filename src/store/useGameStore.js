import { create } from 'zustand';
import { repositories } from '../data/index.js';
import { saveGame, loadGame, clearSave, exportSave, parseImportedSave } from '../services/saveService.js';
import { getPresidentialAction } from '../game/presidentialActions.js';
import {
  CONGRESSO_INICIAL,
  criarProposta,
  calcularProjecao,
  processarCongressoTurno,
  simularVotacao,
  aplicarAcaoArticulacao,
} from '../game/congressEngine.js';
import { desafiosDaPasta, eventosDaPasta, afinidadeComTags, avaliarMinistro, sortearLigacao, avaliarRespostaDesafio, clampMinister } from '../game/ministryEngine.js';
import { desafiosMinisteriais } from '../data/seed/desafiosMinisteriais.js';
import { eventosMinisteriais } from '../data/seed/eventosMinisteriais.js';
import { eventosNacionaisSeed } from '../data/seed/eventosNacionais.js';
import { conselhosMinisteriais } from '../data/seed/conselhosMinisteriais.js';
import { estadosSeed } from '../data/seed/estados.js';
import { midiasSeed, postsIniciais } from '../data/seed/midias.js';
import { projetosEspeciaisSeed } from '../data/seed/projetosEspeciais.js';
import { FISCAL_INICIAL, registrarMovimentoFiscal, processarFiscalMensal } from '../game/fiscalEngine.js';
import { GRUPOS_INICIAIS, aplicarImpactoGrupos, aprovacaoNacional, calcularAprovacaoEstado, impactosGruposPorTags } from '../game/opinionEngine.js';
import { impactoPost, gerarRepercussao, gerarConviteMidia, gerarPostsComunidade, calcularTendenciasPulso } from '../game/mediaEngine.js';
import { organizacoesInternacionaisSeed, doutrinasBrasilSeed, acoesSoberanasSeed } from '../data/seed/geopolitica.js';
import { GEOPOLITICA_INICIAL, criarFeedInicial, processarMesGeopolitico, podeAbrirNegociacao, abrirJanela, impactoAcaoSoberana } from '../game/geopoliticsEngine.js';
import { programasGovernamentaisSeed } from '../data/seed/programasGovernamentais.js';
import { construirPrograma, programaParaLei, avaliarMesPrograma, simularDesenhoPrograma } from '../game/programEngine.js';
import { comunidadePulsoSeed } from '../data/seed/comunidadePulso.js';
import { oposicaoSeed } from '../data/seed/oposicao.js';
import { instituicoesSeed, candidatosSTFSeed } from '../data/seed/instituicoes.js';
import { eventosFederativosSeed } from '../data/seed/eventosFederativos.js';
import { montarEventoFederativo, sortearEventoFederativo, criarProcessoSTF, julgarProcessosSTF, projetarVotosSTF } from '../game/institutionEngine.js';
import { tributosExecutivosSeed, reformasTributariasSeed, medidasEconomicasSeed, financiamentosEconomicosSeed, estrategiasDividaSeed } from '../data/seed/economiaPolitica.js';
import { POLITICA_ECONOMICA_INICIAL, aplicarMudancaTributaria, calcularPressaoTributaria, detectarSituacaoEconomica, custoMedioDivida } from '../game/economyPolicyEngine.js';
import { conquistasSeed } from '../data/seed/conquistas.js';
import { avaliarConquistas, aplicarBonusConquista, progressoConquista } from '../game/achievementEngine.js';
import { estatalNuclearAvancada, ceitecExpandida, leiCriacaoEBTN } from '../data/seed/recompensasConquistas.js';
import { empresasPrivadasSeed, modalidadesParceriaSeed } from '../data/seed/empresasPrivadas.js';
import { promessasPosseSeed } from '../data/seed/perfilPresidencial.js';
import { criarConsequenciasAgenda, criarConsequenciaFederativa } from '../game/turnConsequenceEngine.js';
import { empresasVisitasSeed } from '../data/seed/empresasVisitas.js';
import { COMERCIO_INICIAL, criarOportunidadeVisita, processarComercioMensal, ajustarTarifaSetorial } from '../game/tradeEngine.js';
import { criarAgendaCalendarioInicial, criarConviteVisitaInternacional, criarConviteMidiaCalendario, criarConviteGovernadorCalendario, criarConviteEmpresarialCalendario, compromissosNoTurno, dataDoTurno, isoData } from '../game/agendaEngine.js';
import { criarEstadoEleitoralInicial, faseEleitoralPorData, diasParaPrimeiroTurno, processarMesEleitoral, atualizarPesquisaEleitoral as recalcularPesquisaEleitoral, prepararVicePool, escolherVice, aplicarOfertaConvencao, finalizarConvencao, mudarFiliacaoEleitoral, executarCaptacao, executarAcaoEleitoral, apoiarCorridaEstadual, resolverDebate, alterarPosicaoEleitoral, simularPrimeiroTurno, simularSegundoTurno, getParty } from '../game/electionEngine.js';
import { cutscenePorId } from '../data/seed/cutscenes.js';

// =================================================================================
// 1. CONSTANTES GLOBAIS
// =================================================================================
const DATA_INICIO = new Date(2023, 0, 1);
const DATA_ELEICAO = new Date(2026, 9, 4);

const ESTADOS_INSTITUCIONAIS = {
  NORMALIDADE: 'normalidade',
  ALERTA: 'alerta',
  CONFLITO: 'conflito',
  CRISE: 'crise',
  RUPTURA: 'ruptura'
};

const clamp = (valor, min = 0, max = 100) => Math.min(max, Math.max(min, valor));

const aplicarImpactos = (state, impacto = {}, fator = 1) => {
  const popularidade = { ...state.popularidade };
  let economia = { ...state.economia };
  const institucional = { ...state.institucional };
  const mundo = { ...state.mundo };
  let partidos = state.partidos.map(p => ({ ...p }));
  let capitalPolitico = state.capitalPolitico;
  let climaGoverno = state.climaGoverno;
  const orcamento = state.orcamento; // legado: não é mais usado como "saldo" presidencial.
  let oposicao = { ...state.oposicao };

  Object.entries(impacto || {}).forEach(([chave, valorBase]) => {
    if (typeof valorBase !== 'number') return;
    const valor = valorBase * fator;
    if (chave === 'popularidade') popularidade.geral = clamp(popularidade.geral + valor);
    else if (chave === 'capitalPolitico') capitalPolitico = clamp(capitalPolitico + valor);
    else if (chave === 'climaGoverno') climaGoverno = clamp(climaGoverno + valor);
    else if (chave === 'confiancaMercado') economia.confiancaMercado = clamp(economia.confiancaMercado + valor);
    else if (chave === 'riscoPais') economia.riscoPais = Math.max(0, economia.riscoPais + valor);
    else if (chave === 'dolar') economia.dolar = Math.max(1, economia.dolar + valor);
    else if (chave === 'inflacao') economia.inflacao = Math.max(0.5, economia.inflacao + valor);
    else if (chave === 'crescimentoPib') economia.crescimentoPib = Number((economia.crescimentoPib + valor).toFixed(2));
    else if (chave === 'riscoInstitucional') institucional.tensaoInstitucional = clamp(institucional.tensaoInstitucional + valor);
    else if (chave === 'imagemExterna') mundo.softPowerBrasil = clamp(mundo.softPowerBrasil + valor);
    else if (chave === 'orcamento') economia = registrarMovimentoFiscal(economia, -valor, valor < 0 ? 'custeio' : 'receita');
    else if (chave === 'apoioCongressual') partidos = partidos.map(p => ({ ...p, apoio: clamp(p.apoio + valor * 0.25) }));
    else if (chave === 'riscoImpeachment' || chave === 'riscoCPI') oposicao.forca = clamp(oposicao.forca + valor * 0.35);
    else if (/^(gastos|custos)/i.test(chave) && valor > 0) economia = registrarMovimentoFiscal(economia, valor, 'custeio');
  });
  return { popularidade, economia, institucional, mundo, partidos, capitalPolitico, climaGoverno, orcamento, oposicao };
};

const mergeActorCatalog = (catalog=[], saved=[]) => catalog.map(base => {
  const old=saved.find(item=>item.id===base.id)||{};
  return { ...old, ...base,
    relacao: old.relacao ?? base.relacao,
    influencia: old.influencia ?? base.influencia,
    ambicao: old.ambicao ?? base.ambicao,
    lealdade: old.lealdade ?? base.lealdade,
    risco: old.risco ?? base.risco,
  };
});

const mergeStateCatalog = (catalog=[], saved=[]) => catalog.map(base => {
  const old=saved.find(item=>item.uf===base.uf)||{};
  const oldGov=old.governador||{};
  return { ...base, ...old,
    governador:{ ...oldGov, ...base.governador,
      relacao: oldGov.relacao ?? base.governador.relacao,
      popularidade: oldGov.popularidade ?? base.governador.popularidade,
    },
  };
});

const mergeCourtCatalog = (catalog=[], saved=[]) => saved.length
  ? saved.map(old => ({ ...(catalog.find(base=>base.id===old.id)||{}), ...old, ...(catalog.find(base=>base.id===old.id)||{}) }))
  : catalog;

const AGENDA_INICIAL = {
  pontosMax: 3,
  pontosRestantes: 3,
  acoesUsadas: [],
  historico: [],
  ultimaReacao: null,
  impulsoPib: 0,
};

// =================================================================================
// 2. STORE PRINCIPAL
// =================================================================================
const useGameStore = create((set, get) => ({
  // === ESTADO DE CONTROLE (NOVO) ===
  isLoading: true, 

  // === ESTADO BÁSICO ===
  turno: 1,
  dataAtual: DATA_INICIO,
  dataString: "Janeiro 2023",
  faseEleitoral: 'governo',
  diasParaEleicao: 1300,
  mandato: "2023-2026",
  manchetes: [
    "Presidente assume com promessas de mudança.", 
    "Mercado aguarda primeiros nomes da equipe econômica."
  ],

  // === CUTSCENES (FASE 4.8.2) ===
  cutscenesPendentes: [],
  cutscenesVistas: [],

  // === RECURSOS DO JOGADOR ===
  orcamento: 15000,
  capitalPolitico: 80,
  climaGoverno: 60,
  agendaPresidencial: AGENDA_INICIAL,
  popularidade: { 
    geral: 50, 
    classeBaixa: 60, 
    classeMedia: 45, 
    empresarios: 55, 
    sindicatos: 40 
  },

  // === ESTADO GEOPOLÍTICO ===
  mundo: {
    tensaoGlobal: 30,
    commodities: {}, 
    guerrasAtivas: [
      { 
        id: 'ucrania', 
        nome: 'Guerra na Ucrânia', 
        envolvidos: ['ru', 'ua', 'us', 'de', 'fr'], 
        intensidade: 70, 
        impactoEconomico: 'alto' 
      },
      { 
        id: 'gaza', 
        nome: 'Conflito em Gaza', 
        envolvidos: ['il', 'ir', 'us', 'eg'], 
        intensidade: 85, 
        impactoEconomico: 'medio' 
      }
    ],
    eventosGlobais: [],
    softPowerBrasil: 50,
    liderancaAmbiental: 40,
    alinhamento: { eua: 50, china: 50, ue: 50 },
    tratadosAtivos: [],
  },

  // === DADOS CARREGADOS DO BANCO (Inicializados vazios para evitar erro de undefined) ===
  blocos: [],
  paises: [],
  cartasDiplomaticas: [],
  leisDisponiveis: [],
  estatais: [],
  ministrosSTF: [],
  cargos: [],
  problemasEstruturais: {},
  comissoes: [],
  atoresCongresso: [],

  // === SISTEMA DIPLOMÁTICO ===
  diplomacia: {
    nivel: 1,
    xp: 0,
    xpParaProximoNivel: 100,
    cartasDesbloqueadas: [
      'acordo_comercial', 
      'banquete_oficial', 
      'pressao_politica', 
      'trunfo_amazonico', 
      'blefe_arriscado'
    ],
    deckPersonalizado: null,
  },
  geopolitica: { ...GEOPOLITICA_INICIAL, feed: criarFeedInicial(1) },
  organizacoesInternacionais: organizacoesInternacionaisSeed,
  doutrinasGeopoliticas: doutrinasBrasilSeed,
  acoesSoberanas: acoesSoberanasSeed,
  tributosExecutivos: tributosExecutivosSeed,
  reformasTributarias: reformasTributariasSeed,
  medidasEconomicas: medidasEconomicasSeed,
  financiamentosEconomicos: financiamentosEconomicosSeed,
  estrategiasDivida: estrategiasDividaSeed,
  politicaEconomica: { ...POLITICA_ECONOMICA_INICIAL },

  // === ESTADOS INTERNOS ===
  economia: {
    pib: 10000000,
    crescimentoPib: 0.5,
    inflacao: 4.5,
    dividaPublica: 75.0,
    dividaValor: 7500000,
    selic: 13.75,
    dolar: 5.00,
    aliquotas: { ir: 27.5, ipi: 15.0, csll: 9.0 },
    cargaTributaria: 33.0,
    arrecadacaoMensal: 275000,
    gastosMensais: 270000,
    resultadoPrimario: 5000,
    rating: 'BB',
    riscoPais: 250,
    confiancaMercado: 50,
    desemprego: 8.4,
    ...FISCAL_INICIAL
  },

  institucional: {
    estadoAtual: ESTADOS_INSTITUCIONAIS.NORMALIDADE,
    tensaoInstitucional: 10,
    respeitoConstitucional: 90,
    credibilidadeDemocratica: 80,
    bufferAtos: [],
    riscoJuridico: 10,
    instabilidadePolitica: 5,
    previsibilidadeEconomica: 90
  },

  stf: {
    tensaoInstitucional: 15,
    processosEmCurso: [],
    historicoDecisoes: [],
    corte: [],
    indicacaoPendente: null,
    historicoIndicacoes: []
  },
  instituicoes: instituicoesSeed,
  candidatosSTF: candidatosSTFSeed,

  // === SISTEMA DE MINISTÉRIOS ===
  nomeacoes: [],
  historicoMinisterios: {
    m_saude: {
      vezesIgnorado: 0,
      vezesIntervindo: 0,
      crisesSuperadas: 0,
      totalProblemas: 0,
      climaInterno: 'normal',
      confiancaEquipe: 70,
      relacionamentoEstados: 60,
      imagemPublica: 50
    },
    m_fazenda: {
      vezesIgnorado: 0,
      vezesIntervindo: 0,
      crisesSuperadas: 0,
      totalProblemas: 0,
      climaInterno: 'normal',
      confiancaMercado: 40,
      relacionamentoBC: 50,
      credibilidadeFiscal: 60
    },
    m_educacao: {
      vezesIgnorado: 0,
      vezesIntervindo: 0,
      crisesSuperadas: 0,
      totalProblemas: 0,
      climaInterno: 'normal',
      confiancaProfessores: 50,
      qualidadeEnsino: 45,
      investimentoPD: 30
    }
  },

  conflitosMinisteriais: [],
  ligacaoMinisterial: null,
  eventosMinisteriaisResolvidos: [],
  desafiosMinisteriaisResolvidos: [],
  historicoRelacoesMinisteriais: [],
  historicoLigacoesMinisteriais: [],
  eventosNacionais: [],

  // === FEDERAÇÃO, OPINIÃO, MÍDIA E PROJETOS ESPECIAIS (4.2.1) ===
  gruposSociais: GRUPOS_INICIAIS,
  estados: estadosSeed,
  estadoSelecionado: 'SP',
  midias: midiasSeed,
  comunidadePulso: comunidadePulsoSeed,
  redeSocial: { posts: postsIniciais, historicoPresidencial: [], seguidores: 18500000, tendencia: 0, reputacaoDigital:50, tendencias:['#NovoGoverno','#Economia','#Congresso'], notificacoes:[], interacoesPresidenciais:[] },
  perfilPresidencial: { nome:'Presidente da República', nomePublico:'Presidente', handle:'@Presidencia', partidoId:'esq', ufOrigem:'DF', eixos:{economia:'equilibrio',costumes:'moderado',seguranca:'equilibrio',ambiente:'equilibrio',exterior:'autonomia'}, promessas:[] },
  eleicao: criarEstadoEleitoralInicial({ perfil:{partidoId:'esq',ufOrigem:'DF'}, estados:estadosSeed }),
  empresasPrivadas: empresasPrivadasSeed,
  modalidadesParceria: modalidadesParceriaSeed,
  parceriasEmpresariais: [],
  ultimaParceriaTurno: null,
  consequenciasPendentes: [],
  historicoConsequencias: [],
  comercioExterior: COMERCIO_INICIAL,
  eventosEstatais: [],
  eventoFederativoAtivo: null,
  historicoEventosFederativos: [],
  projetosEspeciais: [],
  catalogoProjetosEspeciais: projetosEspeciaisSeed,
  agendaMensal: { selecionados: [], conviteMidia: null },
  agendaCalendario: criarAgendaCalendarioInicial(DATA_INICIO),
  relatorioTurno: null,

  // === DADOS POLÍTICOS ===
  oposicao: { ...oposicaoSeed, forca: 34, folego: 100, estrategiaAtual: null, historico: [] },

  partidos: [
    { 
      id: 'esq', 
      nome: 'Partido Progressista', 
      sigla: 'PPG', 
      cadeiras: 110, 
      apoio: 80, 
      cor: 'bg-red-600', 
      lider: 'Dep. Silva', 
      personalidade: 'Ideológico', 
      dialogo: 'Precisamos focar no social, Presidente.' 
    },
    { 
      id: 'centro', 
      nome: 'Movimento Central', 
      sigla: 'MOC', 
      cadeiras: 220, 
      apoio: 30, 
      cor: 'bg-gray-500', 
      lider: 'Dep. Cunha', 
      personalidade: 'Pragmático', 
      dialogo: 'A governabilidade tem seu preço...' 
    },
    { 
      id: 'dir', 
      nome: 'Liberais Unidos', 
      sigla: 'LIB', 
      cadeiras: 130, 
      apoio: 10, 
      cor: 'bg-blue-600', 
      lider: 'Dep. Mendes', 
      personalidade: 'Opositor', 
      dialogo: 'O mercado não está feliz.' 
    },
    { 
      id: 'ind', 
      nome: 'Independentes', 
      sigla: 'IND', 
      cadeiras: 53, 
      apoio: 50, 
      cor: 'bg-yellow-500', 
      lider: 'Dep. Alves', 
      personalidade: 'Moderado', 
      dialogo: 'Analisaremos caso a caso.' 
    },
  ],

  // === ARRAYS DE ESTADO ===
  historico: {
    aprovacao: [48, 49, 50, 50],
    pib: [0.2, 0.3, 0.4, 0.5],
    inflacao: [5.0, 4.8, 4.6, 4.5]
  },
  conquistasDesbloqueadas: [],
  capacidadesDesbloqueadas: [],
  recompensasEstruturaisAtivadas: [],
  conquistasCatalogo: conquistasSeed,
  eventosRecentes: [],
  promessasPoliticas: [],
  votacoes: [],
  programas: [],
  catalogoProgramasGovernamentais: programasGovernamentaisSeed,
  leisEmTramitacao: [],
  leisAprovadas: [],
  congresso: CONGRESSO_INICIAL,

  // =================================================================================
  // 3. ACTIONS DE INICIALIZAÇÃO (ATUALIZADO)
  // =================================================================================

  carregarDadosIniciais: async () => {
    try {
      console.log('🔄 Carregando catálogos locais...');
      
      // Carregar catálogos estáticos em paralelo
      const [
        blocos,
        paises,
        cartasDiplomaticas,
        leisDisponiveis,
        estatais,
        ministrosSTF,
        cargos,
        commodities,
        ministrosDisponiveis,
        problemasCatalogo,
        comissoes,
        atoresCongresso
      ] = await Promise.all([
        repositories.bloco?.getAll() || Promise.resolve([]), // Fallback seguro
        repositories.pais.findAll(),
        repositories.carta.getAll(),
        repositories.lei.findAll(), // Corrigido para findAll() conforme o repo
        repositories.estatal.findAll(), // Corrigido para findAll() conforme o repo
        repositories.stf.findAll(), // Corrigido para findAll() conforme o repo
        repositories.ministerio.findAll(),
        repositories.commodity.findAll(),
        repositories.ministro.findAll(),
        repositories.problema.findAll(),
        repositories.comissao.findAll(),
        repositories.atorCongresso.findAll()
      ]);

      // Transformar commodities em objeto para acesso rápido
      const commoditiesObj = {};
      if (commodities && Array.isArray(commodities)) {
        commodities.forEach(commodity => {
          commoditiesObj[commodity.id] = commodity;
        });
      }

      const problemasPorMinisterio = {};
      (problemasCatalogo || []).forEach(problema => {
        const ministerioId = problema.ministerioId;
        const origem = problema.origem || 'geral';
        problemasPorMinisterio[ministerioId] ||= {};
        problemasPorMinisterio[ministerioId][origem] ||= [];
        problemasPorMinisterio[ministerioId][origem].push(problema);
      });

      const candidatosPorMinisterio = {};
      (ministrosDisponiveis || []).forEach(ministro => {
        if (!ministro.ministerioBase) return;
        candidatosPorMinisterio[ministro.ministerioBase] ||= [];
        candidatosPorMinisterio[ministro.ministerioBase].push(ministro);
      });

      // Atualizar estado
      set({
        blocos: blocos || [],
        paises: paises || [],
        cartasDiplomaticas: cartasDiplomaticas || [],
        leisDisponiveis: leisDisponiveis || [],
        estatais: estatais || [],
        ministrosSTF: (ministrosSTF || []).map(ministro => ({
          ...ministro,
          id: ministro.id || `stf_${Date.now()}`
        })),
        stf: { ...get().stf, corte: (ministrosSTF || []).map(ministro => ({ ...ministro, id: ministro.id || `stf_${Date.now()}` })) },
        instituicoes: instituicoesSeed,
        candidatosSTF: candidatosSTFSeed,
        comunidadePulso: comunidadePulsoSeed,
        oposicao: { ...oposicaoSeed, ...(get().oposicao||{}), lider: oposicaoSeed.lider, nucleo: oposicaoSeed.nucleo, estrategias: oposicaoSeed.estrategias },
        eventoFederativoAtivo: get().eventoFederativoAtivo || null,
        cargos: (cargos || []).map(cargo => ({
          ...cargo,
          candidatosEspecificos: candidatosPorMinisterio[cargo.id] || [],
          vago: true,
          prioridade: cargo.prioridadePadrao || 'normal',
          status: 'normal',
          demandaAtual: null,
          problemas: [],
          conselhoAtual: null
        })),
        problemasEstruturais: problemasPorMinisterio,
        comissoes: comissoes || [],
        atoresCongresso: atoresCongresso || [],
        mundo: {
          ...get().mundo,
          commodities: commoditiesObj
        },
        isLoading: false // <--- DADOS CARREGADOS, LIBERA A TELA
      });

      // O save não é mais restaurado automaticamente. A tela inicial permite
      // escolher explicitamente entre Novo Jogo e Continuar Jogo.
      console.log('✅ Dados locais carregados com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      // Libera o loading mesmo com erro para não travar a tela branca
      set({ isLoading: false }); 
      return false;
    }
  },

  // Compatibilidade: não existe mais banco para inicializar.
  inicializarBanco: async () => get().carregarDadosIniciais(),

  salvarJogo: () => saveGame(get()),

  carregarJogo: () => {
    const save = loadGame();
    if (!save?.gameState) return false;
    const current = get();
    const saved = save.gameState;
    const cargos = current.cargos.map((catalogCargo) => {
      const old = (saved.cargos || []).find((c) => c.id === catalogCargo.id);
      return old ? { ...catalogCargo, ...old, candidatosEspecificos: catalogCargo.candidatosEspecificos } : catalogCargo;
    });
    const allCandidates = cargos.flatMap((c) => c.candidatosEspecificos || []);
    const nomeacoes = (saved.nomeacoes || []).map((n) => ({ ...(allCandidates.find((c) => c.id === n.id) || {}), ...n }));
    const stf = { ...current.stf, ...(saved.stf || {}), corte: mergeCourtCatalog(current.stf.corte||[], saved.stf?.corte||[]) };
    const atoresCongresso = mergeActorCatalog(current.atoresCongresso||[], saved.atoresCongresso||[]);
    const estados = mergeStateCatalog(current.estados||[], saved.estados||[]);
    const eleicao = saved.eleicao || criarEstadoEleitoralInicial({perfil:saved.perfilPresidencial||current.perfilPresidencial,estados});
    const oposicao = { ...oposicaoSeed, ...(saved.oposicao || {}), lider: oposicaoSeed.lider, nucleo: oposicaoSeed.nucleo, estrategias: oposicaoSeed.estrategias };
    const politicaEconomica = { ...POLITICA_ECONOMICA_INICIAL, ...(saved.politicaEconomica || {}), tributos: { ...POLITICA_ECONOMICA_INICIAL.tributos, ...(saved.politicaEconomica?.tributos || {}) }, dividaComposicao: { ...POLITICA_ECONOMICA_INICIAL.dividaComposicao, ...(saved.politicaEconomica?.dividaComposicao || {}) } };
    const economia = { ...FISCAL_INICIAL, ...current.economia, ...(saved.economia || {}), dividaComposicao: { ...POLITICA_ECONOMICA_INICIAL.dividaComposicao, ...(saved.economia?.dividaComposicao || politicaEconomica.dividaComposicao || {}) } };
    const estatais = saved.estatais?.length ? [...current.estatais.map(base=>({...base,...(saved.estatais.find(e=>e.id===base.id)||{})})), ...saved.estatais.filter(e=>!current.estatais.some(base=>base.id===e.id))] : current.estatais;
    const idsConquistasAtuais=new Set(conquistasSeed.map(c=>c.id));
    const conquistasDesbloqueadas=(saved.conquistasDesbloqueadas||[]).filter(c=>idsConquistasAtuais.has(typeof c==='string'?c:c.id));
    const leisDisponiveis=(saved.votacoes||[]).some(v=>v.leiId===leiCriacaoEBTN.id)&&!current.leisDisponiveis.some(l=>l.id===leiCriacaoEBTN.id)?[...current.leisDisponiveis,leiCriacaoEBTN]:current.leisDisponiveis;
    const redeSocial={...current.redeSocial,...(saved.redeSocial||{}),posts:saved.redeSocial?.posts||current.redeSocial.posts,tendencias:saved.redeSocial?.tendencias||current.redeSocial.tendencias,notificacoes:saved.redeSocial?.notificacoes||[],interacoesPresidenciais:saved.redeSocial?.interacoesPresidenciais||[]};
    set({ ...saved, cutscenesPendentes:saved.cutscenesPendentes||[], cutscenesVistas:saved.cutscenesVistas||[], economia, politicaEconomica, estatais, leisDisponiveis, redeSocial, perfilPresidencial:saved.perfilPresidencial||current.perfilPresidencial, eleicao, empresasPrivadas:[...empresasPrivadasSeed,...((saved.empresasPrivadas||[]).filter(e=>!empresasPrivadasSeed.some(b=>b.id===e.id)))], modalidadesParceria:modalidadesParceriaSeed, parceriasEmpresariais:saved.parceriasEmpresariais||[], ultimaParceriaTurno:saved.ultimaParceriaTurno||null, consequenciasPendentes:saved.consequenciasPendentes||[], historicoConsequencias:saved.historicoConsequencias||[], comercioExterior:saved.comercioExterior||current.comercioExterior||COMERCIO_INICIAL, agendaCalendario:saved.agendaCalendario||current.agendaCalendario||criarAgendaCalendarioInicial(DATA_INICIO), conquistasDesbloqueadas, capacidadesDesbloqueadas:saved.capacidadesDesbloqueadas||[], recompensasEstruturaisAtivadas:saved.recompensasEstruturaisAtivadas||[], cargos, nomeacoes, stf, atoresCongresso, estados, oposicao, instituicoes: instituicoesSeed, candidatosSTF: candidatosSTFSeed, comunidadePulso: comunidadePulsoSeed, eventosNacionais: saved.eventosNacionais || [], eventosEstatais: saved.eventosEstatais || [], historicoEventosFederativos: saved.historicoEventosFederativos || [], eventoFederativoAtivo: saved.eventoFederativoAtivo || null, historicoLigacoesMinisteriais: saved.historicoLigacoesMinisteriais || [], congresso: { ...CONGRESSO_INICIAL, ...(saved.congresso || {}) }, isLoading: false });
    return true;
  },

  limparSave: () => {
    clearSave();
    return true;
  },

  configurarPerfilPresidencial: (perfil={}) => {
    const state=get();
    const promessas=(perfil.promessas||[]).slice(0,3).map(id=>{const base=promessasPosseSeed.find(p=>p.id===id);return base?{...base,status:'prometida',turnoPromessa:1}:null}).filter(Boolean);
    const eixos={economia:'equilibrio',costumes:'moderado',seguranca:'equilibrio',ambiente:'equilibrio',exterior:'autonomia',...(perfil.eixos||{})};
    const impacto={};
    if(eixos.economia==='social'){impacto.periferia=2;impacto.sindicalistas=2;impacto.mercado=-2;} else if(eixos.economia==='liberal'){impacto.mercado=3;impacto.agro=1;impacto.sindicalistas=-2;} else {impacto.mercado=1;impacto.periferia=1;}
    if(eixos.costumes==='conservador'){impacto.evangelicos=(impacto.evangelicos||0)+3;impacto.universitarios=(impacto.universitarios||0)-2;} else if(eixos.costumes==='progressista'){impacto.universitarios=(impacto.universitarios||0)+3;impacto.evangelicos=(impacto.evangelicos||0)-2;}
    if(eixos.seguranca==='linha_dura'){impacto.militares=(impacto.militares||0)+3;impacto.evangelicos=(impacto.evangelicos||0)+1;impacto.universitarios=(impacto.universitarios||0)-1;} else if(eixos.seguranca==='garantista'){impacto.universitarios=(impacto.universitarios||0)+2;impacto.militares=(impacto.militares||0)-2;}
    if(eixos.ambiente==='verde'){impacto.universitarios=(impacto.universitarios||0)+2;impacto.agro=(impacto.agro||0)-2;} else if(eixos.ambiente==='desenvolvimento'){impacto.agro=(impacto.agro||0)+2;impacto.mercado=(impacto.mercado||0)+1;impacto.universitarios=(impacto.universitarios||0)-1;}
    const gruposSociais=aplicarImpactoGrupos(state.gruposSociais,impacto);
    const nome=String(perfil.nome||'Presidente da República').trim()||'Presidente da República';
    const nomePublico=String(perfil.nomePublico||nome.split(' ')[0]||'Presidente').trim();
    const handle=`@${String(perfil.handle||nomePublico).replace(/[^\p{L}\p{N}_]+/gu,'').slice(0,18)||'Presidencia'}`;
    const perfilFinal={nome,nomePublico,handle,partidoId:perfil.partidoId||'esq',ufOrigem:perfil.ufOrigem||'DF',eixos,promessas:promessas.map(p=>p.id)};
    const eleicaoInicial=criarEstadoEleitoralInicial({perfil:perfilFinal,estados:state.estados||estadosSeed});
    const partidos=state.partidos.map(p=>({...p,apoio:clamp(p.apoio+(p.id===perfilFinal.partidoId?10:p.id==='ind'?1:-1))}));
    const posse={id:`posse_${Date.now()}`,autorId:'presidente',autor:nomePublico,handle,texto:`Assumo a Presidência com três compromissos centrais: ${promessas.map(p=>p.titulo).join(', ')}. O governo será cobrado por entrega, não por slogan.`,tema:'governo',alcance:6200000,turno:1};
    const oposicaoPost={id:`op_posse_${Date.now()}`,autorId:state.oposicao?.lider?.id||'oposicao',autor:state.oposicao?.lider?.nome||'Caio Valente',handle:'@CaioValente',grupo:'oposicao',texto:`Parabéns a ${nomePublico}. Nós estaremos aqui para lembrar cada promessa de campanha — especialmente ${promessas[0]?.titulo||'as que o novo governo preferir esquecer'}.`,tema:'oposicao',sentimento:-1,alcance:3100000,turno:1};
    const comunidade=gerarPostsComunidade({gruposSociais,turno:1,evento:'Posse',quantidade:4,respostaA:posse.id});
    set({perfilPresidencial:perfilFinal,eleicao:eleicaoInicial,promessasPoliticas:promessas,gruposSociais,popularidade:{...state.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},partidos,redeSocial:{...state.redeSocial,posts:[posse,oposicaoPost,...comunidade,...(state.redeSocial.posts||[])].slice(0,100),tendencias:['#Posse','#NovoGoverno',...promessas.map(p=>`#${p.id}`)],notificacoes:[{id:`not_posse_${Date.now()}`,texto:`${eleicaoInicial.viceAtual.nome} assume a Vice-Presidência. Seu perfil presidencial foi criado e a oposição já começou a cobrar promessas.`,tipo:'politica'}]}});
    saveGame(get()); return {ok:true,perfil:perfilFinal};
  },

  exportarSave: () => exportSave(get()),

  importarSave: (texto) => {
    const save = parseImportedSave(texto);
    const current = get();
    const saved = save.gameState;
    const cargos = current.cargos.map((catalogCargo) => {
      const old = (saved.cargos || []).find((c) => c.id === catalogCargo.id);
      return old ? { ...catalogCargo, ...old, candidatosEspecificos: catalogCargo.candidatosEspecificos } : catalogCargo;
    });
    const allCandidates = cargos.flatMap((c) => c.candidatosEspecificos || []);
    const nomeacoes = (saved.nomeacoes || []).map((n) => ({ ...(allCandidates.find((c) => c.id === n.id) || {}), ...n }));
    const politicaEconomica = { ...POLITICA_ECONOMICA_INICIAL, ...(saved.politicaEconomica || {}), tributos: { ...POLITICA_ECONOMICA_INICIAL.tributos, ...(saved.politicaEconomica?.tributos || {}) }, dividaComposicao: { ...POLITICA_ECONOMICA_INICIAL.dividaComposicao, ...(saved.politicaEconomica?.dividaComposicao || {}) } };
    const economia = { ...FISCAL_INICIAL, ...current.economia, ...(saved.economia || {}), dividaComposicao: { ...POLITICA_ECONOMICA_INICIAL.dividaComposicao, ...(saved.economia?.dividaComposicao || politicaEconomica.dividaComposicao || {}) } };
    const estatais = saved.estatais?.length ? [...current.estatais.map(base=>({...base,...(saved.estatais.find(e=>e.id===base.id)||{})})), ...saved.estatais.filter(e=>!current.estatais.some(base=>base.id===e.id))] : current.estatais;
    const idsConquistasAtuais=new Set(conquistasSeed.map(c=>c.id));
    const conquistasDesbloqueadas=(saved.conquistasDesbloqueadas||[]).filter(c=>idsConquistasAtuais.has(typeof c==='string'?c:c.id));
    const leisDisponiveis=(saved.votacoes||[]).some(v=>v.leiId===leiCriacaoEBTN.id)&&!current.leisDisponiveis.some(l=>l.id===leiCriacaoEBTN.id)?[...current.leisDisponiveis,leiCriacaoEBTN]:current.leisDisponiveis;
    const redeSocial={...current.redeSocial,...(saved.redeSocial||{}),posts:saved.redeSocial?.posts||current.redeSocial.posts,tendencias:saved.redeSocial?.tendencias||current.redeSocial.tendencias,notificacoes:saved.redeSocial?.notificacoes||[],interacoesPresidenciais:saved.redeSocial?.interacoesPresidenciais||[]};
    const stf = { ...current.stf, ...(saved.stf || {}), corte: mergeCourtCatalog(current.stf.corte||[], saved.stf?.corte||[]) };
    const atoresCongresso = mergeActorCatalog(current.atoresCongresso||[], saved.atoresCongresso||[]);
    const estados = mergeStateCatalog(current.estados||[], saved.estados||[]);
    const eleicao = saved.eleicao || criarEstadoEleitoralInicial({perfil:saved.perfilPresidencial||current.perfilPresidencial,estados});
    set({ ...saved, economia, politicaEconomica, estatais, leisDisponiveis, redeSocial, perfilPresidencial:saved.perfilPresidencial||current.perfilPresidencial, eleicao, empresasPrivadas:[...empresasPrivadasSeed,...((saved.empresasPrivadas||[]).filter(e=>!empresasPrivadasSeed.some(b=>b.id===e.id)))], modalidadesParceria:modalidadesParceriaSeed, parceriasEmpresariais:saved.parceriasEmpresariais||[], ultimaParceriaTurno:saved.ultimaParceriaTurno||null, consequenciasPendentes:saved.consequenciasPendentes||[], historicoConsequencias:saved.historicoConsequencias||[], comercioExterior:saved.comercioExterior||current.comercioExterior||COMERCIO_INICIAL, conquistasDesbloqueadas, capacidadesDesbloqueadas:saved.capacidadesDesbloqueadas||[], recompensasEstruturaisAtivadas:saved.recompensasEstruturaisAtivadas||[], cargos, nomeacoes, stf, atoresCongresso, estados, instituicoes:instituicoesSeed, candidatosSTF:candidatosSTFSeed, comunidadePulso:comunidadePulsoSeed, eventosNacionais: saved.eventosNacionais || [], historicoLigacoesMinisteriais: saved.historicoLigacoesMinisteriais || [], congresso: { ...CONGRESSO_INICIAL, ...(saved.congresso || {}) }, isLoading: false });
    saveGame(get());
    return true;
  },

  // =================================================================================
  // ACTIONS RESTANTES (MANTIDAS IGUAIS)
  // =================================================================================

  gerarProblemaEstrutural: (ministerioId, origem) => {
    const s = get();
    const problemasMinisterio = s.problemasEstruturais[ministerioId];
    if (!problemasMinisterio || !problemasMinisterio[origem]) return null;
    
    const pool = problemasMinisterio[origem];
    const problemaBase = pool[Math.floor(Math.random() * pool.length)];
    
    return {
      ...problemaBase,
      ministerioId,
      origem,
      nivelAtual: 1,
      turnosNoNivel: 0,
      velocidadeMaturacao: 1.0,
      fatoresAceleracao: [],
      dataCriacao: s.turno
    };
  },

  processarTurnoMinisterios: () => {
    set(state => {
      let efeitos = {
        popularidade: state.popularidade,
        economia: state.economia,
        institucional: state.institucional,
        mundo: state.mundo,
        partidos: state.partidos,
        capitalPolitico: state.capitalPolitico,
        climaGoverno: state.climaGoverno,
        orcamento: state.orcamento,
        oposicao: state.oposicao,
      };
      const novosEventos = [];

      const cargos = state.cargos.map(cargo => {
        const ministro = state.nomeacoes.find(n => n.cargoId === cargo.id);
        let problemas = [...(cargo.problemas || [])].map(p => ({ ...p }));

        // Novos problemas nascem nos bastidores. Pastas sem ministro e de baixa
        // prioridade deterioram mais rápido, fazendo a gestão ministerial importar.
        const chanceBase = cargo.prioridade === 'alta' ? 0.18 : cargo.prioridade === 'baixa' ? 0.38 : 0.27;
        const bonusResilienciaSaude = cargo.id==='m_saude' && (state.capacidadesDesbloqueadas||[]).includes('rede_biotecnologia') ? -0.12 : 0;
        const chanceNovoProblema = Math.max(0.05,Math.min(0.55, chanceBase + (!ministro ? 0.14 : 0) + bonusResilienciaSaude));
        if (problemas.length < 2 && Math.random() < chanceNovoProblema) {
          const origens = cargo.problemasBase || Object.keys(state.problemasEstruturais[cargo.id] || {});
          if (origens.length > 0) {
            const origem = origens[Math.floor(Math.random() * origens.length)];
            const pool = state.problemasEstruturais[cargo.id]?.[origem] || [];
            const disponiveis = pool.filter(base => !problemas.some(p => p.id === base.id));
            if (disponiveis.length > 0) {
              const base = disponiveis[Math.floor(Math.random() * disponiveis.length)];
              problemas.push({
                ...base,
                nivelAtual: 1,
                turnosNoNivel: 0,
                dataCriacao: state.turno,
                impactoAplicadoNivel: 0,
              });
            }
          }
        }

        const limiteTurnos = (cargo.prioridade === 'alta' ? 3 : cargo.prioridade === 'baixa' ? 1 : 2) + (cargo.id==='m_saude' && (state.capacidadesDesbloqueadas||[]).includes('rede_biotecnologia') ? 1 : 0);
        problemas = problemas.map(problema => {
          const copia = { ...problema, turnosNoNivel: (problema.turnosNoNivel || 0) + 1 };
          const limite = Math.max(1, limiteTurnos - (!ministro ? 1 : 0));
          if (copia.turnosNoNivel >= limite && (copia.nivelAtual || 1) < 4) {
            copia.nivelAtual = (copia.nivelAtual || 1) + 1;
            copia.turnosNoNivel = 0;
          }

          const estagio = copia.estagios?.[(copia.nivelAtual || 1) - 1];
          if (estagio?.visivel && copia.impactoAplicadoNivel !== copia.nivelAtual) {
            efeitos = aplicarImpactos({ ...state, ...efeitos }, estagio.impacto || {}, 0.35);
            copia.impactoAplicadoNivel = copia.nivelAtual;
            novosEventos.push(`${copia.icone || '⚠️'} ${cargo.nome}: ${copia.titulo} chegou ao nível ${copia.nivelAtual}.`);
          }
          return copia;
        });

        const problemaVisivel = [...problemas]
          .filter(p => p.estagios?.[(p.nivelAtual || 1) - 1]?.visivel)
          .sort((a, b) => (b.nivelAtual || 1) - (a.nivelAtual || 1))[0];

        let demandaAtual = null;
        let status = 'normal';
        if (problemaVisivel) {
          const estagio = problemaVisivel.estagios[(problemaVisivel.nivelAtual || 1) - 1];
          demandaAtual = {
            id: problemaVisivel.id,
            problemaId: problemaVisivel.id,
            titulo: problemaVisivel.titulo,
            texto: estagio.texto || problemaVisivel.descricao,
            origem: problemaVisivel.origem || 'técnica',
            custo: estagio.custoResolucao || 250,
            acao: problemaVisivel.nivelAtual >= 4 ? 'Comandar resposta nacional' : 'Autorizar resposta',
            nivel: problemaVisivel.nivelAtual,
            icone: problemaVisivel.icone || '⚠️',
          };
          status = problemaVisivel.nivelAtual >= 4 ? 'crise' : 'alerta';
        }

        return { ...cargo, problemas, demandaAtual, status };
      });

      let nomeacoes = state.nomeacoes.map((m) => {
        const clima = state.climaGoverno >= 65 ? 1 : state.climaGoverno < 40 ? -2 : 0;
        const riscoRival = avaliarMinistro(m).riscoRival;
        const derivaAmbicao = riscoRival >= 65 ? -1 : 0;
        const lealdade = clampMinister((m.lealdade ?? 50) + clima + derivaAmbicao);
        const eficacia = avaliarMinistro({ ...m, lealdade }).eficacia;
        if (riscoRival >= 72 && Math.random() < 0.16) novosEventos.push(`♟️ ${m.nome} passou a cultivar protagonismo próprio dentro do governo.`);
        if (avaliarMinistro(m).riscoEscandalo >= 65 && Math.random() < 0.10) {
          novosEventos.push(`🕯️ Rumores de irregularidades cercam a equipe de ${m.nome}.`);
          efeitos.climaGoverno = clamp(efeitos.climaGoverno - 2);
        }
        return { ...m, lealdade, eficacia };
      });

      const novaLigacao = state.ligacaoMinisterial || (Math.random() < 0.48
        ? sortearLigacao({ nomeacoes, resolvidos: state.eventosMinisteriaisResolvidos || [], turno: state.turno })
        : null);

      return {
        cargos,
        nomeacoes,
        ligacaoMinisterial: novaLigacao,
        ...efeitos,
        eventosRecentes: [...novosEventos.reverse(), ...state.eventosRecentes].slice(0, 18),
      };
    });
  },

  resolverDemanda: (id, aceitou, opcaoEspecial = null) => {
    const estado = get();
    const cargo = estado.cargos.find(c => c.id === id);
    if (!cargo?.demandaAtual) return { ok: false, motivo: 'Não há demanda ativa nesta pasta.' };

    const demanda = cargo.demandaAtual;
    set(state => {
      let efeitos = {
        popularidade: state.popularidade,
        economia: state.economia,
        institucional: state.institucional,
        mundo: state.mundo,
        partidos: state.partidos,
        capitalPolitico: state.capitalPolitico,
        climaGoverno: state.climaGoverno,
        orcamento: state.orcamento,
        oposicao: state.oposicao,
      };
      let nomeacoes = state.nomeacoes.map(n => ({ ...n }));
      let historicoMinisterios = { ...state.historicoMinisterios };

      const cargos = state.cargos.map(item => {
        if (item.id !== id) return item;
        const problema = item.problemas?.find(p => p.id === demanda.problemaId);
        if (!problema) return { ...item, demandaAtual: null };

        if (aceitou) {
          efeitos.economia = registrarMovimentoFiscal(efeitos.economia, demanda.custo, ['m_saude','m_educacao'].includes(id) ? 'humano' : 'custeio');
          efeitos.popularidade = { ...efeitos.popularidade, geral: clamp(efeitos.popularidade.geral + (demanda.nivel >= 4 ? 2 : 1)) };
          efeitos.climaGoverno = clamp(efeitos.climaGoverno + 2);
          nomeacoes = nomeacoes.map(n => n.cargoId === id ? { ...n, lealdade: clamp((n.lealdade || 50) + 3) } : n);

          const hist = historicoMinisterios[id] || { vezesIgnorado: 0, vezesIntervindo: 0, crisesSuperadas: 0, totalProblemas: 0 };
          historicoMinisterios = {
            ...historicoMinisterios,
            [id]: { ...hist, crisesSuperadas: (hist.crisesSuperadas || 0) + 1, totalProblemas: (hist.totalProblemas || 0) + 1 }
          };

          return {
            ...item,
            problemas: (item.problemas || []).filter(p => p.id !== problema.id),
            demandaAtual: null,
            status: 'normal',
          };
        }

        const nivelAtual = problema.nivelAtual || 1;
        const estagioAtual = problema.estagios?.[nivelAtual - 1];
        const proximoNivel = Math.min(4, nivelAtual + 1);
        const proximoEstagio = problema.estagios?.[proximoNivel - 1];
        efeitos = aplicarImpactos(
          { ...state, ...efeitos },
          estagioAtual?.penalidadeAtraso || { popularidade: -Math.max(2, nivelAtual * 2), climaGoverno: -3 },
          0.65
        );

        const problemas = (item.problemas || []).map(p => p.id === problema.id
          ? { ...p, nivelAtual: proximoNivel, turnosNoNivel: 0, impactoAplicadoNivel: nivelAtual }
          : p
        );
        const hist = historicoMinisterios[id] || { vezesIgnorado: 0, vezesIntervindo: 0, crisesSuperadas: 0, totalProblemas: 0 };
        historicoMinisterios = {
          ...historicoMinisterios,
          [id]: { ...hist, vezesIgnorado: (hist.vezesIgnorado || 0) + 1, totalProblemas: (hist.totalProblemas || 0) + 1 }
        };
        nomeacoes = nomeacoes.map(n => n.cargoId === id ? { ...n, lealdade: clamp((n.lealdade || 50) - 4) } : n);
        return { ...item, problemas, demandaAtual: null, status: proximoNivel >= 4 ? 'crise' : 'alerta' };
      });

      return {
        cargos,
        ...efeitos,
        nomeacoes,
        historicoMinisterios,
        eventosRecentes: [
          aceitou
            ? `✅ ${cargo.nome}: Presidência autorizou resposta para “${demanda.titulo}”.`
            : `⏳ ${cargo.nome}: “${demanda.titulo}” foi adiada e ganhou gravidade.`,
          ...state.eventosRecentes
        ].slice(0, 18),
      };
    });

    saveGame(get());
    return { ok: true, opcaoEspecial };
  },

  intervirMinisterio: (id, tipoIntervencao = 'padrao') => {
    if (get().capitalPolitico < 6) return { ok: false, motivo: 'Capital político insuficiente.' };
    set(state => {
      const cargo = state.cargos.find(c => c.id === id);
      if (!cargo) return state;

      const problemasOrdenados = [...(cargo.problemas || [])].sort((a, b) => (b.nivelAtual || 1) - (a.nivelAtual || 1));
      const alvo = problemasOrdenados[0];
      const cargos = state.cargos.map(c => {
        if (c.id !== id || !alvo) return c;
        const problemas = c.problemas.map(p => p.id === alvo.id
          ? { ...p, nivelAtual: Math.max(1, (p.nivelAtual || 1) - 1), turnosNoNivel: 0 }
          : p
        );
        return { ...c, problemas, demandaAtual: null, status: 'normal' };
      });
      const nomeacoes = state.nomeacoes.map(n => n.cargoId === id ? { ...n, lealdade: clamp((n.lealdade || 50) - 8) } : n);
      const hist = state.historicoMinisterios[id] || { vezesIgnorado: 0, vezesIntervindo: 0, crisesSuperadas: 0, totalProblemas: 0 };

      return {
        cargos,
        nomeacoes,
        capitalPolitico: state.capitalPolitico - 6,
        climaGoverno: clamp(state.climaGoverno - 2),
        historicoMinisterios: {
          ...state.historicoMinisterios,
          [id]: { ...hist, vezesIntervindo: (hist.vezesIntervindo || 0) + 1 }
        },
        eventosRecentes: [`⚡ Intervenção presidencial direta em ${cargo.nome}.`, ...state.eventosRecentes].slice(0, 18),
      };
    });
    saveGame(get());
    return { ok: true, tipoIntervencao };
  },

  definirPrioridade: (id, novaPrioridade) => {
    set(state => ({
      cargos: state.cargos.map(cargo => 
        cargo.id === id ? { ...cargo, prioridade: novaPrioridade } : cargo
      )
    }));
  },

  conversarComMinistro: (cargoId, tom = 'ouvir') => {
    const custo = tom === 'prestigiar' ? 2 : 0;
    if (get().capitalPolitico < custo) return { ok:false, motivo:'Capital político insuficiente.' };
    let resumo = '';
    set(state => ({
      capitalPolitico: state.capitalPolitico - custo,
      nomeacoes: state.nomeacoes.map((m) => {
        if (m.cargoId !== cargoId) return m;
        if (tom === 'cobrar') { resumo = 'Você cobrou resultado e reduziu o espaço político do ministro.'; return { ...m, lealdade: clampMinister((m.lealdade||50)-3), eficacia: clampMinister((m.eficacia||50)+3), ambicao: clampMinister((m.ambicao||30)-2) }; }
        if (tom === 'prestigiar') { resumo = 'O ministro saiu fortalecido — e mais consciente do próprio peso.'; return { ...m, lealdade: clampMinister((m.lealdade||50)+6), popularidade: clampMinister((m.popularidade||50)+2), ambicao: clampMinister((m.ambicao||30)+3) }; }
        resumo = 'Você ouviu o ministro em reservado e reduziu a tensão.'; return { ...m, lealdade: clampMinister((m.lealdade||50)+3), tensao: clampMinister((m.tensao||0)-5) };
      }),
      historicoRelacoesMinisteriais: [{ turno:state.turno, cargoId, tom }, ...(state.historicoRelacoesMinisteriais||[])].slice(0,40),
      eventosRecentes: [`☕ Conversa reservada no gabinete: ${resumo}`, ...state.eventosRecentes].slice(0,18),
    }));
    saveGame(get());
    return { ok:true, resumo };
  },

  atenderLigacaoMinisterial: (eventoId, opcaoId) => {
    const evento = eventosMinisteriais.find((e) => e.id === eventoId);
    const opcao = evento?.opcoes.find((o) => o.id === opcaoId);
    if (!evento || !opcao) return { ok:false, motivo:'Ligação inválida.' };
    let reacao = '';
    set(state => {
      const ministroAtual = state.nomeacoes.find((m) => m.cargoId === evento.ministerioId);
      const afinidade = afinidadeComTags(ministroAtual, opcao.tags || []);
      const requerOk = !(opcao.requer||[]).length || opcao.requer.every((id) => state.nomeacoes.some((m) => m.cargoId === id));
      const impacto = opcao.impacto || {};
      const deltaLealdade = (impacto.lealdade || 0) + afinidade * 2 + (requerOk ? 1 : -3);
      reacao = afinidade > 0 ? 'A resposta coincide com a visão do ministro.' : afinidade < 0 ? 'O ministro executará a ordem, mas discorda da direção.' : 'O ministro registra a decisão sem entusiasmo especial.';
      const impactoTags = impactosGruposPorTags(opcao.tags || [], 0.85);
      if (impacto.popularidade) Object.keys(state.gruposSociais || {}).forEach((id) => { impactoTags[id] = (impactoTags[id] || 0) + impacto.popularidade * 0.18; });
      const gruposSociais = aplicarImpactoGrupos(state.gruposSociais, impactoTags);
      const popularidade = { ...state.popularidade, geral: clamp(aprovacaoNacional(gruposSociais)) };
      const estados = state.estados.map((e) => ({ ...e, aprovacao: calcularAprovacaoEstado(e, gruposSociais) }));
      let economia = { ...state.economia, confiancaMercado: clamp((state.economia.confiancaMercado||50) + (impacto.mercado||0)) };
      if (impacto.orcamento) economia = registrarMovimentoFiscal(economia, -(impacto.orcamento||0), ['m_saude','m_educacao','m_ciencia'].includes(evento.ministerioId) ? 'humano' : 'custeio');
      const institucional = { ...state.institucional, tensaoInstitucional: clamp((state.institucional.tensaoInstitucional||0) - (impacto.institucional||0)) };
      const congresso = { ...state.congresso, poder: clamp((state.congresso?.poder||0) + (impacto.congressoPoder||0)), riscoEscandalo: clamp((state.congresso?.riscoEscandalo||0) + (impacto.riscoEscandalo||0)) };
      return {
        popularidade, gruposSociais, estados, economia, institucional, congresso,
        orcamento: state.orcamento,
        capitalPolitico: clamp(state.capitalPolitico + (impacto.capitalPolitico||0)),
        climaGoverno: clamp(state.climaGoverno + (impacto.clima||0)),
        nomeacoes: state.nomeacoes.map((m)=>m.cargoId===evento.ministerioId?{...m,lealdade:clampMinister((m.lealdade||50)+deltaLealdade),tensao:clampMinister((m.tensao||0)+(afinidade<0?5:-2))}:m),
        ligacaoMinisterial:null,
        eventosMinisteriaisResolvidos:[`${evento.id}:${state.turno}`,...(state.eventosMinisteriaisResolvidos||[])].slice(0,60),
        historicoLigacoesMinisteriais:[{turno:state.turno,ministroId:ministroAtual?.id,cargoId:evento.ministerioId,titulo:evento.titulo,resultado:opcao.texto,status:'atendida'},...(state.historicoLigacoesMinisteriais||[])].slice(0,40),
        eventosRecentes:[`📞 ${ministroAtual?.nome||'Ministro'}: ${evento.titulo} — ${opcao.texto}`, ...state.eventosRecentes].slice(0,18),
      };
    });
    saveGame(get());
    return { ok:true, reacao };
  },

  ignorarLigacaoMinisterial: () => {
    const evento = get().ligacaoMinisterial;
    if (!evento) return { ok:false };
    set(state => ({
      ligacaoMinisterial:null,
      nomeacoes:state.nomeacoes.map((m)=>m.cargoId===evento.ministerioId?{...m,lealdade:clampMinister((m.lealdade||50)-5),tensao:clampMinister((m.tensao||0)+8)}:m),
      eventosMinisteriaisResolvidos:[`${evento.id}:${state.turno}`,...(state.eventosMinisteriaisResolvidos||[])].slice(0,60),
      historicoLigacoesMinisteriais:[{turno:state.turno,cargoId:evento.ministerioId,titulo:evento.titulo,status:'ignorada'},...(state.historicoLigacoesMinisteriais||[])].slice(0,40),
      eventosRecentes:[`📵 A Presidência ignorou uma ligação ministerial sobre “${evento.titulo}”.`,...state.eventosRecentes].slice(0,18),
    }));
    saveGame(get());
    return { ok:true };
  },

  resolverDesafioMinisterial: (ministerioId, desafioId, selecionados) => {
    const desafio = desafiosMinisteriais.find((d) => d.id === desafioId && d.ministerioId === ministerioId);
    if (!desafio) return { ok:false, acertou:false };
    const acertou = avaliarRespostaDesafio(desafio, selecionados);
    const efeito = acertou ? (desafio.recompensa||{}) : (desafio.penalidade||{});
    let reacaoMinistro='';
    set(state => {
      const ministro = state.nomeacoes.find((m)=>m.cargoId===ministerioId);
      const afinidade = afinidadeComTags(ministro, desafio.tags||[]);
      reacaoMinistro = afinidade>0?'Seu ministro gostou do método e assume a execução.':afinidade<0?'Seu ministro contesta o método, mesmo com o resultado.':'A equipe registra a decisão e segue para execução.';
      const impactoTags = impactosGruposPorTags(desafio.tags || [], acertou ? 0.55 : -0.35);
      const gruposSociais = aplicarImpactoGrupos(state.gruposSociais, impactoTags);
      const estados = state.estados.map((e)=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      return {
        gruposSociais, estados,
        popularidade:{...state.popularidade,geral:clamp(aprovacaoNacional(gruposSociais)+(efeito.popularidade||0)*0.25)},
        economia:{...state.economia,confiancaMercado:clamp((state.economia.confiancaMercado||50)+(efeito.mercado||0))},
        institucional:{...state.institucional,tensaoInstitucional:clamp((state.institucional.tensaoInstitucional||0)-(efeito.institucional||0))},
        climaGoverno:clamp(state.climaGoverno+(efeito.clima||0)),
        congresso:{...state.congresso,riscoEscandalo:clamp((state.congresso?.riscoEscandalo||0)+(efeito.riscoEscandalo||0))},
        nomeacoes:state.nomeacoes.map((m)=>m.cargoId===ministerioId?{...m,lealdade:clampMinister((m.lealdade||50)+(efeito.lealdade||0)+afinidade),eficacia:clampMinister((m.eficacia||avaliarMinistro(m).eficacia)+(efeito.eficacia||0))}:m),
        desafiosMinisteriaisResolvidos:[{id:desafioId,turno:state.turno,acertou},...(state.desafiosMinisteriaisResolvidos||[])].slice(0,80),
        eventosRecentes:[`${acertou?'🧠':'⚠️'} ${desafio.titulo}: ${acertou?'resposta sólida':'resultado contestado'}.`,...state.eventosRecentes].slice(0,18),
      };
    });
    saveGame(get());
    return { ok:true, acertou, reacaoMinistro };
  },

  resolverConselhoMinisterial: (cenarioId, opcaoId) => {
    const cenario = conselhosMinisteriais.find((c) => c.id === cenarioId);
    const opcao = cenario?.opcoes.find((o) => o.id === opcaoId);
    if (!cenario || !opcao) return { ok:false, motivo:'Pauta do Conselho não encontrada.' };
    const state = get();
    const presentes = cenario.participantes.filter((id)=>state.nomeacoes.some((m)=>m.cargoId===id));
    if (presentes.length < 2) return { ok:false, motivo:'Nomeie ao menos dois dos ministros envolvidos antes de convocar esta pauta.' };
    set((current)=>{
      const base = aplicarImpactos(current, opcao.impacto || {}, 1);
      const nomeacoes = current.nomeacoes.map((m)=>{
        if(!cenario.participantes.includes(m.cargoId)) return m;
        const afinidade=afinidadeComTags(m,opcao.tags||[]);
        return {...m,lealdade:clampMinister((m.lealdade||50)+afinidade*3+(afinidade===0?1:0)),tensao:clampMinister((m.tensao||0)+(afinidade<0?5:-2))};
      });
      const congresso = { ...current.congresso, riscoEscandalo: clamp((current.congresso?.riscoEscandalo || 0) + (opcao.impacto?.riscoEscandalo || 0)) };
      const gruposSociais = aplicarImpactoGrupos(current.gruposSociais, impactosGruposPorTags(opcao.tags || [], 0.8));
      const estados = current.estados.map((e)=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      return {...base,nomeacoes,congresso,gruposSociais,estados,popularidade:{...base.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},eventosRecentes:[`🗂️ Conselho de Governo: ${cenario.titulo} — ${opcao.texto}`,...current.eventosRecentes].slice(0,18)};
    });
    saveGame(get());
    return {ok:true};
  },

  iniciarEventoNacional: (eventoId, estrategia = 'legado') => {
    const baseEvento = eventosNacionaisSeed.find((e) => e.id === eventoId);
    const ajustes = {
      legado: { custo:1.05, risco:-10, prestigio:1, label:'Legado primeiro' },
      prestigio: { custo:1.20, risco:8, prestigio:6, label:'Prestígio máximo' },
      austero: { custo:.82, risco:4, prestigio:-3, label:'Orçamento contido' },
    };
    const ajuste = ajustes[estrategia] || ajustes.legado;
    const evento = baseEvento ? { ...baseEvento, custo:Math.round(baseEvento.custo*ajuste.custo), risco:clamp((baseEvento.risco||20)+ajuste.risco), prestigio:Math.max(1,(baseEvento.prestigio||1)+ajuste.prestigio), estrategia, estrategiaLabel:ajuste.label } : null;
    if (!evento) return { ok:false, motivo:'Evento não encontrado.' };
    const state = get();
    if (state.eventosNacionais.some((e) => e.id === eventoId && !['concluido','cancelado'].includes(e.status))) return { ok:false, motivo:'Este evento já está em preparação.' };
    if (!state.nomeacoes.some((m) => m.cargoId === evento.ministerioId)) return { ok:false, motivo:'Nomeie o ministério líder antes de iniciar este projeto.' };
    const faltantes = (evento.apoios || []).filter((id) => !state.nomeacoes.some((m) => m.cargoId === id));
    const entrada = Math.round(evento.custo * 0.18);
    const novo = { ...evento, status:'preparacao', progresso:0, mesesRestantes:evento.duracao, investimento:entrada, faltantes, iniciadoNoTurno:state.turno };
    set((current) => ({
      economia: registrarMovimentoFiscal(current.economia, entrada, evento.natureza === 'sediar' ? 'infraestrutura' : 'custeio'),
      eventosNacionais:[novo,...current.eventosNacionais],
      eventosRecentes:[`🎟️ Projeto nacional iniciado: ${evento.titulo}.`,...current.eventosRecentes].slice(0,18),
    }));
    saveGame(get());
    return { ok:true, evento:novo, faltantes };
  },

  cancelarEventoNacional: (eventoId) => {
    let cancelado=false;
    set((state)=>({
      eventosNacionais:state.eventosNacionais.map((e)=>{ if(e.id!==eventoId||['concluido','cancelado'].includes(e.status)) return e; cancelado=true; return {...e,status:'cancelado'}; }),
      popularidade:{...state.popularidade,geral:clamp((state.popularidade.geral||50)-(cancelado?1:0))},
      eventosRecentes:cancelado?[`🛑 Projeto de evento cancelado: ${state.eventosNacionais.find(e=>e.id===eventoId)?.titulo||eventoId}.`,...state.eventosRecentes].slice(0,18):state.eventosRecentes,
    }));
    if(cancelado) saveGame(get());
    return {ok:cancelado};
  },

  processarEventosNacionais: () => {
    set((state)=>{
      let economia={...state.economia};
      let popularidade={...state.popularidade};
      let mundo={...state.mundo};
      let gruposSociais={...state.gruposSociais};
      let geopolitica={...state.geopolitica};
      let eventosRecentes=[...state.eventosRecentes];
      const nomeados=new Set(state.nomeacoes.map((m)=>m.cargoId));
      const eventosNacionais=state.eventosNacionais.map((evento)=>{
        if(['concluido','cancelado'].includes(evento.status)) return evento;
        const faltantes=(evento.apoios||[]).filter((id)=>!nomeados.has(id));
        const apoioRatio=(evento.apoios||[]).length ? ((evento.apoios.length-faltantes.length)/evento.apoios.length) : 1;
        const incremento=Math.max(2,Math.round(100/evento.duracao*(0.7+apoioRatio*.5)));
        const parcela=Math.max(8,Math.round((evento.custo-evento.investimento)/Math.max(1,evento.mesesRestantes)));
        const pago=parcela;
        economia=registrarMovimentoFiscal(economia,pago,evento.natureza==='sediar'?'infraestrutura':'custeio');
        const progresso=Math.min(100,(evento.progresso||0)+incremento);
        const mesesRestantes=Math.max(0,(evento.mesesRestantes||1)-1);
        const concluido=progresso>=100||mesesRestantes===0;
        if(concluido){
          const sucesso=Math.random()*100 > (evento.risco||20)*0.38 + faltantes.length*6;
          if(sucesso){
            popularidade.geral=clamp(popularidade.geral+Math.max(1,Math.round((evento.prestigio||4)/4)));
            mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+(evento.prestigio||4));
            if(evento.id==='evt_expoagro'){
              gruposSociais=aplicarImpactoGrupos(gruposSociais,{agro:4,mercado:2,periferia:.5,universitarios:-.5});
              economia.crescimentoPib=Number(((economia.crescimentoPib||0)+.04).toFixed(2));
              ['cn','jp','ae'].forEach(pid=>{geopolitica=abrirJanela(geopolitica,pid,state.turno,2)});
              eventosRecentes=[`🌾 ExpoAgro Brasil fecha negócios e abre novas janelas comerciais internacionais.`,...eventosRecentes];
            }
            eventosRecentes=[`🏟️ ${evento.titulo} foi concluído com forte repercussão e legado.`,...eventosRecentes];
            return {...evento,status:'concluido',resultado:'sucesso',progresso:100,mesesRestantes:0,investimento:(evento.investimento||0)+pago,faltantes};
          }
          popularidade.geral=clamp(popularidade.geral-2);
          eventosRecentes=[`⚠️ ${evento.titulo} terminou sob críticas de custo, execução ou legado.`,...eventosRecentes];
          return {...evento,status:'concluido',resultado:'contestado',progresso:100,mesesRestantes:0,investimento:(evento.investimento||0)+pago,faltantes};
        }
        return {...evento,progresso,mesesRestantes,investimento:(evento.investimento||0)+pago,faltantes};
      });
      return {eventosNacionais,economia,popularidade:{...popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},mundo,gruposSociais,geopolitica,eventosRecentes:eventosRecentes.slice(0,18)};
    });
  },

  // =================================================================================
  // CONGRESSO 4.1 — TRAMITAÇÃO, ARTICULAÇÃO E PODER
  // =================================================================================

  enviarLeiParaCongresso: (leiId) => {
    const state = get();
    const lei = state.leisDisponiveis.find(item => item.id === leiId);
    if (!lei) return { ok: false, motivo: 'Proposta não encontrada no catálogo.' };
    if (state.leisAprovadas.includes(leiId)) return { ok: false, motivo: 'Esta matéria já virou lei.' };
    if (state.votacoes.some(v => v.leiId === leiId && !['arquivada', 'vetada', 'sancionada'].includes(v.status))) {
      return { ok: false, motivo: 'Esta matéria já está em tramitação.' };
    }

    const custoEnvio = Math.max(2, Math.min(10, Math.ceil((lei.custoPolitico || 20) / 9)));
    if (state.capitalPolitico < custoEnvio) return { ok: false, motivo: `São necessários ${custoEnvio} CP para protocolar esta agenda.` };

    const proposta = criarProposta({
      lei,
      turno: state.turno,
      atores: state.atoresCongresso,
      partidos: state.partidos,
    });

    set(current => ({
      votacoes: [proposta, ...current.votacoes],
      leisEmTramitacao: [...new Set([...current.leisEmTramitacao, leiId])],
      capitalPolitico: current.capitalPolitico - custoEnvio,
      eventosRecentes: [`📜 ${lei.instrumento} enviado à Câmara: ${lei.titulo}.`, ...current.eventosRecentes].slice(0, 18),
    }));
    saveGame(get());
    return { ok: true, propostaId: proposta.id, custo: custoEnvio };
  },

  executarArticulacaoCongresso: (propostaId, acaoId) => {
    const state = get();
    const proposta = state.votacoes.find(v => v.id === propostaId);
    if (!proposta) return { ok: false, motivo: 'Proposta não encontrada.' };
    if (!['em_tramitacao', 'votacao_hoje', 'aguarda_segundo_turno'].includes(proposta.status)) {
      return { ok: false, motivo: 'Esta matéria não aceita articulação nesta fase.' };
    }
    const lei = state.leisDisponiveis.find(item => item.id === proposta.leiId);
    if (!lei) return { ok: false, motivo: 'Dados legislativos indisponíveis.' };

    const resultado = aplicarAcaoArticulacao({
      acaoId,
      proposta,
      lei,
      congresso: state.congresso,
      capitalPolitico: state.capitalPolitico,
      orcamento: state.orcamento,
      popularidade: state.popularidade.geral,
    });
    if (!resultado.ok) return resultado;

    if (lei.instrumento === 'PEC' && (state.capacidadesDesbloqueadas||[]).includes('ponte_constitucional') && state.congresso?.ponteConstitucionalUsadaTurno !== state.turno) {
      const economiaPoder=Math.max(1,Math.ceil((resultado.acao?.custoPoder||0)*0.25));
      resultado.congresso={...resultado.congresso,poder:clamp((resultado.congresso.poder||0)+economiaPoder),ponteConstitucionalUsadaTurno:state.turno};
    }
    resultado.proposta.projecao = calcularProjecao(resultado.proposta, lei, state.partidos);
    resultado.proposta.historico = resultado.proposta.historico.map((item, index) => (
      index === 0 && item.turno == null ? { ...item, turno: state.turno } : item
    ));

    set(current => ({
      votacoes: current.votacoes.map(v => v.id === propostaId ? resultado.proposta : v),
      congresso: resultado.congresso,
      capitalPolitico: resultado.capitalPolitico,
      orcamento: current.orcamento,
      economia: resultado.custoFiscal ? registrarMovimentoFiscal(current.economia, resultado.custoFiscal, 'custeio') : current.economia,
      eventosRecentes: [`♟️ Congresso: ${resultado.acao.titulo} em “${proposta.titulo}”.`, ...current.eventosRecentes].slice(0, 18),
    }));
    saveGame(get());
    return { ok: true, acao: resultado.acao, proposta: resultado.proposta };
  },

  negociarAtorCongresso: (atorId, estrategia = 'conversa') => {
    const state = get();
    const ator = state.atoresCongresso.find(item => item.id === atorId);
    if (!ator) return { ok: false, motivo: 'Liderança não encontrada.' };
    const custos = {
      conversa: { poder: 2, capital: 0, relacao: 5, risco: 0, label: 'Conversa reservada' },
      protagonismo: { poder: 6, capital: 2, relacao: 11, risco: 1, label: 'Dar protagonismo na agenda' },
      promessa_pauta: { poder: 9, capital: 3, relacao: 16, risco: 4, label: 'Firmar compromisso de pauta' },
    };
    const acao = custos[estrategia] || custos.conversa;
    if ((state.congresso?.poder || 0) < acao.poder) return { ok: false, motivo: 'Poder de bastidor insuficiente.' };
    if (state.capitalPolitico < acao.capital) return { ok: false, motivo: 'Capital político insuficiente.' };

    set(current => {
      const bonusAgenda = estrategia === 'promessa_pauta' ? 6 : estrategia === 'protagonismo' ? 4 : 2;
      const votacoes = current.votacoes.map(proposta => {
        if (!['em_tramitacao', 'votacao_hoje', 'aguarda_segundo_turno'].includes(proposta.status)) return proposta;
        const lei = current.leisDisponiveis.find(item => item.id === proposta.leiId);
        if (!lei) return proposta;
        const bonusPorPartido = { ...(proposta.bonusPorPartido || {}) };
        if (ator.partidoId) {
          bonusPorPartido[ator.partidoId] = clamp((bonusPorPartido[ator.partidoId] || 0) + bonusAgenda, -25, 25);
        }
        const atualizada = { ...proposta, bonusPorPartido };
        atualizada.projecao = calcularProjecao(atualizada, lei, current.partidos);
        return atualizada;
      });

      return {
        atoresCongresso: current.atoresCongresso.map(item => item.id === atorId
          ? { ...item, relacao: clamp((item.relacao || 50) + acao.relacao) }
          : item
        ),
        votacoes,
        congresso: {
          ...current.congresso,
          poder: clamp((current.congresso?.poder || 0) - acao.poder),
          riscoEscandalo: clamp((current.congresso?.riscoEscandalo || 0) + acao.risco),
          acordos: estrategia === 'promessa_pauta'
            ? [{ id: `${atorId}_${current.turno}`, atorId, partidoId: ator.partidoId, titulo: 'Compromisso de pauta', turno: current.turno }, ...(current.congresso?.acordos || [])]
            : (current.congresso?.acordos || []),
          ultimaMovimentacao: `${acao.label} com ${ator.nome}`,
        },
        capitalPolitico: current.capitalPolitico - acao.capital,
        eventosRecentes: [`🤝 ${acao.label} com ${ator.nome}.`, ...current.eventosRecentes].slice(0, 18),
      };
    });
    saveGame(get());
    return { ok: true, acao };
  },

  votarProposta: (propostaId, somenteSimular = false) => {
    const state = get();
    const proposta = state.votacoes.find(v => v.id === propostaId);
    if (!proposta) return { votosFavor: 0, votosContra: 0, abstencoes: 0, aprovado: false, motivo: 'Proposta não encontrada.' };
    const lei = state.leisDisponiveis.find(item => item.id === proposta.leiId);
    if (!lei) return { votosFavor: 0, votosContra: 0, abstencoes: 0, aprovado: false, motivo: 'Lei não encontrada.' };

    // Para a animação do placar, mantemos um resultado pré-calculado por proposta durante a sessão.
    let resultado = proposta.resultadoPendente;
    if (!resultado) {
      resultado = simularVotacao({ proposta, lei, partidos: state.partidos });
      if (somenteSimular) {
        set(current => ({
          votacoes: current.votacoes.map(v => v.id === propostaId ? { ...v, resultadoPendente: resultado } : v),
        }));
      }
    }

    const retorno = {
      votosFavor: resultado.sim,
      votosContra: resultado.nao,
      abstencoes: resultado.abstencao,
      presentes: resultado.presentes,
      aprovado: resultado.aprovado,
      apoioNecessario: resultado.meta,
      quorum: resultado.quorum,
    };
    if (somenteSimular) return retorno;

    set(current => {
      const atual = current.votacoes.find(v => v.id === propostaId);
      const eventos = [];
      let congresso = { ...current.congresso };
      let nova = { ...atual, resultadoPendente: null, ultimoResultado: resultado, historico: [...(atual.historico || [])] };

      if (resultado.aprovado) {
        if (lei.instrumento === 'PEC' && (atual.rodadaPlenario || 1) === 1) {
          nova.status = 'aguarda_segundo_turno';
          nova.fase = 'plenario';
          nova.rodadaPlenario = 2;
          nova.historico.unshift({ turno: current.turno, tipo: 'votacao', texto: `1º turno aprovado por ${resultado.sim} votos. Segundo turno será agendado.` });
          eventos.push(`✅ ${lei.titulo}: 1º turno aprovado (${resultado.sim} × ${resultado.nao}).`);
          congresso.poder = clamp((congresso.poder || 0) + 3);
        } else {
          nova.status = 'senado';
          nova.fase = 'senado';
          nova.historico.unshift({ turno: current.turno, tipo: 'votacao', texto: `Câmara aprovou por ${resultado.sim} votos favoráveis. Matéria segue ao Senado.` });
          eventos.push(`✅ Câmara aprova ${lei.titulo} por ${resultado.sim} a ${resultado.nao}.`);
          congresso.poder = clamp((congresso.poder || 0) + 5);
          congresso.vitorias = (congresso.vitorias || 0) + 1;
        }
      } else {
        nova.status = 'arquivada';
        nova.fase = 'encerrada';
        nova.historico.unshift({ turno: current.turno, tipo: 'votacao', texto: `Projeto rejeitado: ${resultado.sim} a ${resultado.nao}.` });
        eventos.push(`❌ Câmara rejeita ${lei.titulo}: ${resultado.sim} a ${resultado.nao}.`);
        congresso.poder = clamp((congresso.poder || 0) - 7);
        congresso.derrotas = (congresso.derrotas || 0) + 1;
      }

      return {
        votacoes: current.votacoes.map(v => v.id === propostaId ? nova : v),
        congresso,
        leisEmTramitacao: resultado.aprovado
          ? current.leisEmTramitacao
          : current.leisEmTramitacao.filter(id => id !== lei.id),
        eventosRecentes: [...eventos, ...current.eventosRecentes].slice(0, 18),
      };
    });
    saveGame(get());
    return retorno;
  },

  sancionarProjeto: (propostaId, sancionar = true) => {
    const state = get();
    const proposta = state.votacoes.find(v => v.id === propostaId);
    if (!proposta || proposta.status !== 'aguardando_sancao') return { ok: false, motivo: 'Projeto não está aguardando decisão presidencial.' };
    const lei = state.leisDisponiveis.find(item => item.id === proposta.leiId);
    if (!lei) return { ok: false, motivo: 'Lei não encontrada.' };

    set(current => {
      if (!sancionar) {
        return {
          votacoes: current.votacoes.map(v => v.id === propostaId ? {
            ...v, status: 'vetada', fase: 'encerrada',
            historico: [{ turno: current.turno, tipo: 'veto', texto: 'Presidente vetou integralmente o projeto.' }, ...(v.historico || [])],
          } : v),
          leisEmTramitacao: current.leisEmTramitacao.filter(id => id !== lei.id),
          programas: lei.programaId ? (current.programas||[]).map(p=>p.id===lei.programaId?{...p,status:'vetado',atualizadoNoTurno:current.turno}:p) : current.programas,
          eventosRecentes: [`🖋️ Veto presidencial: ${lei.titulo}.`, ...current.eventosRecentes].slice(0, 18),
        };
      }

      const efeitos = aplicarImpactos(current, lei.efeitos || {}, 1);
      let impactoGrupos = impactosGruposPorTags(lei.tags || [], 0.75);
      if (!Object.values(impactoGrupos).some((v)=>v<0)) {
        const contrapeso = lei.categoria === 'tributacao' ? 'mercado' : lei.categoria === 'seguranca' ? 'universitarios' : lei.categoria === 'meio_ambiente' ? 'agro' : 'mercado';
        impactoGrupos = {...impactoGrupos,[contrapeso]:(impactoGrupos[contrapeso]||0)-Math.max(1,(lei.polarizacao||30)/35)};
      }
      const gruposSociais = aplicarImpactoGrupos(current.gruposSociais, impactoGrupos);
      const estados = current.estados.map((e)=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      let economiaFinal=efeitos.economia;
      let mundoFinal=efeitos.mundo;
      let institucionalFinal=efeitos.institucional;
      let estataisFinal=current.estatais;
      let recompensasEstruturaisAtivadas=current.recompensasEstruturaisAtivadas||[];
      if(lei.id===leiCriacaoEBTN.id&&!current.estatais.some(e=>e.id===estatalNuclearAvancada.id)){
        economiaFinal=registrarMovimentoFiscal(economiaFinal,6500,'infraestrutura');
        mundoFinal={...mundoFinal,softPowerBrasil:clamp((mundoFinal.softPowerBrasil||50)+4)};
        institucionalFinal={...institucionalFinal,tensaoInstitucional:clamp((institucionalFinal.tensaoInstitucional||10)+2)};
        estataisFinal=[...current.estatais,{...estatalNuclearAvancada,criadaNoTurno:current.turno}];
        recompensasEstruturaisAtivadas=[...new Set([...recompensasEstruturaisAtivadas,'empresa_nuclear_avancada'])];
      }
      return {
        ...efeitos,
        economia:economiaFinal,mundo:mundoFinal,institucional:institucionalFinal,estatais:estataisFinal,recompensasEstruturaisAtivadas,
        gruposSociais, estados,
        popularidade:{...efeitos.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},
        votacoes: current.votacoes.map(v => v.id === propostaId ? {
          ...v, status: 'sancionada', fase: 'encerrada',
          historico: [{ turno: current.turno, tipo: 'sancao', texto: 'Projeto sancionado e convertido em lei.' }, ...(v.historico || [])],
        } : v),
        leisAprovadas: [...new Set([...current.leisAprovadas, lei.id])],
        leisEmTramitacao: current.leisEmTramitacao.filter(id => id !== lei.id),
        congresso: { ...current.congresso, poder: clamp((current.congresso?.poder || 0) + 3) },
        programas: lei.programaId ? (current.programas||[]).map(p=>p.id===lei.programaId?(p.provisoria?{...p,status:'ativo',provisoria:false,conversaoStatus:'convertida',leiSancionadaNoTurno:current.turno,atualizadoNoTurno:current.turno}:{...p,status:'implantacao',implantacaoRestante:2,leiSancionadaNoTurno:current.turno,atualizadoNoTurno:current.turno}):p) : current.programas,
        eventosRecentes: [lei.id===leiCriacaoEBTN.id?'⚛️ Lei sancionada: nasce a Empresa Brasileira de Tecnologia Nuclear, com implantação fiscal e institucional imediata.':lei.programaId?`🇧🇷 Marco legal sancionado: ${lei.titulo}. O programa entra em implantação.`:`🇧🇷 Lei sancionada: ${lei.titulo}.`, ...current.eventosRecentes].slice(0, 18),
      };
    });
    saveGame(get());
    return { ok: true, sancionada: sancionar };
  },

  processarTurnoCongresso: () => {
    const state = get();
    const resultado = processarCongressoTurno({
      votacoes: state.votacoes,
      leis: state.leisDisponiveis,
      partidos: state.partidos,
      atores: state.atoresCongresso,
      congresso: state.congresso,
      turno: state.turno + 1,
    });
    set(current => ({
      votacoes: resultado.votacoes,
      congresso: resultado.congresso,
      programas:(current.programas||[]).map(programa=>{
        if(!programa.leiId)return programa;
        const v=resultado.votacoes.find(x=>x.leiId===programa.leiId);
        if(!v)return programa;
        if(v.status==='arquivada')return {...programa,status:'rejeitado',provisoria:false,atualizadoNoTurno:current.turno};
        if(v.status==='aguardando_sancao')return programa.provisoria?{...programa,conversaoStatus:'aguardando_sancao',atualizadoNoTurno:current.turno}:{...programa,status:'aguardando_sancao',atualizadoNoTurno:current.turno};
        if(['em_tramitacao','senado','aguarda_segundo_turno','votacao_hoje'].includes(v.status))return programa.provisoria?{...programa,conversaoStatus:v.status,atualizadoNoTurno:current.turno}:{...programa,status:'aguardando_congresso',atualizadoNoTurno:current.turno};
        return programa;
      }),
      eventosRecentes: [...resultado.eventos, ...current.eventosRecentes].slice(0, 18),
    }));
  },

  // =================================================================================
  // FASE 4.7 — PROGRAMAS GOVERNAMENTAIS
  // =================================================================================
  simularProgramaGovernamental: (config) => simularDesenhoPrograma(config,{...get(),nomeacoes:get().nomeacoes,estados:get().estados,parceriasEmpresariais:get().parceriasEmpresariais}),

  criarPrograma: (config) => {
    const state=get();
    const template=programasGovernamentaisSeed.find(p=>p.id===config.templateId);
    if(!template)return {ok:false,motivo:'Arquétipo de programa não encontrado.'};
    if(template.requiresCapacity&&!(state.capacidadesDesbloqueadas||[]).includes(template.requiresCapacity))return {ok:false,motivo:'Seu governo ainda não construiu capacidade para este programa.'};
    if((state.programas||[]).filter(p=>['ativo','implantacao','aguardando_congresso'].includes(p.status)).length>=5)return {ok:false,motivo:'A Presidência já coordena cinco programas prioritários. Conclua, suspenda ou reduza a carteira antes de lançar outro.'};
    let programa;
    try{programa=construirPrograma(config,{...state,turno:state.turno});}catch(error){return {ok:false,motivo:error.message};}
    const sim=simularDesenhoPrograma(programa,{...state,nomeacoes:state.nomeacoes,estados:state.estados,parceriasEmpresariais:state.parceriasEmpresariais});
    const custoPolitico=Math.max(3,Math.round(3+(programa.orcamentoMensal/700)+(programa.viaLegal==='decreto'?0:2)));
    if(state.capitalPolitico<custoPolitico)return {ok:false,motivo:`São necessários ${custoPolitico} pontos de capital político para lançar esta agenda.`};
    const exigeCongresso=['pl','mp','plp'].includes(programa.viaLegal)||programa.orcamentoMensal>1200||programa.duracao>30;
    if(programa.viaLegal==='decreto'&&(programa.orcamentoMensal>1200||programa.duracao>30))return {ok:false,motivo:'Um programa desta escala precisa de autorização legislativa. Escolha PL/MP ou reduza orçamento/duração.'};
    if(exigeCongresso){
      const lei=programaParaLei(programa);
      const proposta=criarProposta({lei,turno:state.turno,atores:state.atoresCongresso,partidos:state.partidos});
      const provisoria=programa.viaLegal==='mp';
      programa={...programa,status:provisoria?'ativo':'aguardando_congresso',provisoria,leiId:lei.id,propostaId:proposta.id,execucao:sim.eficiencia,riscoExecucao:sim.risco,custoFederalMensal:sim.custoFederalMensal};
      set(current=>({
        programas:[programa,...(current.programas||[])],
        leisDisponiveis:[lei,...current.leisDisponiveis],
        votacoes:[proposta,...current.votacoes],
        leisEmTramitacao:[...new Set([...current.leisEmTramitacao,lei.id])],
        capitalPolitico:current.capitalPolitico-custoPolitico,
        eventosRecentes:[`📋 ${programa.nome} lançado politicamente e enviado ao Congresso.`,...current.eventosRecentes].slice(0,18),
        redeSocial:{...current.redeSocial,posts:[{id:`prog_${programa.id}`,autorId:'presidente',autor:current.perfilPresidencial?.nomePublico||'Presidente da República',handle:current.perfilPresidencial?.handle||'@Presidencia',texto:`Apresentamos ${programa.nome}: metas públicas, execução mensurável e cobrança por resultados.`,tema:'programa',alcance:2600000,turno:current.turno},...(current.redeSocial?.posts||[])].slice(0,120)},
      }));
    }else{
      programa={...programa,status:'implantacao',implantacaoRestante:1,execucao:sim.eficiencia,riscoExecucao:sim.risco,custoFederalMensal:sim.custoFederalMensal};
      set(current=>({programas:[programa,...(current.programas||[])],capitalPolitico:current.capitalPolitico-custoPolitico,eventosRecentes:[`🚀 Programa lançado por ato executivo: ${programa.nome}. Implantação começa neste mês.`,...current.eventosRecentes].slice(0,18)}));
    }
    saveGame(get());
    return {ok:true,programa,congresso:exigeCongresso,custoPolitico};
  },

  enviarProgramaParaCongresso: (programaId) => {
    const state=get();
    const programa=(state.programas||[]).find(p=>p.id===programaId);
    if(!programa)return {ok:false,motivo:'Programa não encontrado.'};
    if(programa.leiId)return {ok:false,motivo:'O marco legal deste programa já foi protocolado.'};
    const lei=programaParaLei({...programa,viaLegal:'pl'});
    const proposta=criarProposta({lei,turno:state.turno,atores:state.atoresCongresso,partidos:state.partidos});
    set(current=>({programas:current.programas.map(p=>p.id===programaId?{...p,status:'aguardando_congresso',leiId:lei.id,propostaId:proposta.id}:p),leisDisponiveis:[lei,...current.leisDisponiveis],votacoes:[proposta,...current.votacoes],leisEmTramitacao:[...new Set([...current.leisEmTramitacao,lei.id])],eventosRecentes:[`📨 Marco do ${programa.nome} enviado ao Congresso.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get());return {ok:true};
  },

  alterarPrioridadePrograma: (programaId,prioridade) => {
    if(!['baixa','media','alta'].includes(prioridade))return {ok:false};
    set(state=>({programas:(state.programas||[]).map(p=>p.id===programaId?{...p,prioridade,atualizadoNoTurno:state.turno}:p)}));saveGame(get());return {ok:true};
  },

  intervirPrograma: (programaId,acao) => {
    const state=get(); const p=(state.programas||[]).find(x=>x.id===programaId);
    if(!p||!['ativo','atrasado','implantacao'].includes(p.status))return {ok:false,motivo:'Programa não está em execução.'};
    if((p.ultimaIntervencaoTurno||0)>=state.turno-1)return {ok:false,motivo:'A equipe acabou de sofrer uma intervenção presidencial. Aguarde pelo menos um mês.'};
    const custos={auditoria:2,acelerar:4,recalibrar:3}; const custo=custos[acao]||3;
    if(state.capitalPolitico<custo)return {ok:false,motivo:'Capital político insuficiente.'};
    set(current=>{
      let economia={...current.economia}; let institucional={...current.institucional}; let gruposSociais={...current.gruposSociais};
      const programas=current.programas.map(x=>{if(x.id!==programaId)return x;let n={...x,ultimaIntervencaoTurno:current.turno};
        if(acao==='auditoria'){n.riscoExecucao=Math.max(3,(n.riscoExecucao||30)-12);n.execucao=Math.max(20,(n.execucao||60)-3);institucional.riscoJuridico=Math.max(0,(institucional.riscoJuridico||10)-3);}
        if(acao==='acelerar'){n.execucao=Math.min(100,(n.execucao||60)+9);n.riscoExecucao=Math.min(95,(n.riscoExecucao||30)+7);economia=registrarMovimentoFiscal(economia,Math.round(n.orcamentoMensal*.35),n.fiscalTipo);}
        if(acao==='recalibrar'){n.qualidade=Math.min(100,(n.qualidade||50)+5);n.riscoExecucao=Math.max(3,(n.riscoExecucao||30)-4);gruposSociais=aplicarImpactoGrupos(gruposSociais,{mercado:1,universitarios:1,periferia:-.5});}
        return n;});
      return {programas,economia,institucional,gruposSociais,capitalPolitico:current.capitalPolitico-custo,eventosRecentes:[`🧭 Presidência intervém no ${p.nome}: ${acao}.`,...current.eventosRecentes].slice(0,18)};
    });saveGame(get());return {ok:true};
  },

  suspenderPrograma: (programaId) => {
    const p=(get().programas||[]).find(x=>x.id===programaId);if(!p)return {ok:false};
    set(state=>({programas:state.programas.map(x=>x.id===programaId?{...x,status:'suspenso',suspensoNoTurno:state.turno}:x),oposicao:{...state.oposicao,forca:clamp((state.oposicao?.forca||30)+2)},eventosRecentes:[`⏸️ Governo suspende ${p.nome}. Oposição cobra explicações sobre recursos e metas.`,...state.eventosRecentes].slice(0,18)}));saveGame(get());return {ok:true};
  },

  processarProgramasGovernamentais: () => {
    set(state=>{
      let economia={...state.economia}; let gruposSociais={...state.gruposSociais}; let estados=(state.estados||[]).map(e=>({...e})); let institucional={...state.institucional}; let oposicao={...state.oposicao}; let redeSocial={...state.redeSocial,posts:[...(state.redeSocial?.posts||[])]}; let eventos=[...state.eventosRecentes]; let promessas=(state.promessasPoliticas||[]).map(p=>({...p}));
      const programas=(state.programas||[]).map(original=>{
        if(original.status==='implantacao'){
          const restante=Math.max(0,(original.implantacaoRestante??1)-1);
          if(restante===0){eventos=[`🏁 ${original.nome} conclui implantação e entra em execução.`,...eventos];return {...original,status:'ativo',implantacaoRestante:0};}
          return {...original,implantacaoRestante:restante};
        }
        if(!['ativo','atrasado'].includes(original.status))return original;
        const r=avaliarMesPrograma(original,{...state,nomeacoes:state.nomeacoes,estados,parceriasEmpresariais:state.parceriasEmpresariais,roll:Math.random()*100});
        economia=registrarMovimentoFiscal(economia,r.custoFederal,original.fiscalTipo);
        economia.crescimentoPib=Number(((economia.crescimentoPib||0)+(original.macro?.crescimentoPib||0)*(r.execucao/100)).toFixed(3));
        economia.desemprego=Math.max(3,Number(((economia.desemprego||8.4)+(original.macro?.desemprego||0)*(r.execucao/100)).toFixed(2)));
        gruposSociais=aplicarImpactoGrupos(gruposSociais,Object.fromEntries(Object.entries(original.grupos||{}).map(([k,v])=>[k,v*.09*(r.execucao/70)])));
        const alvo=original.territorio==='nacional'?null:new Set(original.ufs||[]);
        estados=estados.map(e=>!alvo||alvo.has(e.uf)?{...e,aprovacao:clamp((e.aprovacao||50)+.12*(r.execucao/70)),relacaoPlanalto:clamp((e.relacaoPlanalto||50)+.08)}:e);
        let risco=r.riscoExecucao; let alertas=[...(original.alertas||[])]; let marcos=[...(original.marcos||[])];
        if(r.evento){alertas=[{turno:state.turno,tipo:r.evento.tipo,titulo:r.evento.titulo,texto:r.evento.texto},...alertas].slice(0,8);eventos=[`📊 ${original.nome}: ${r.evento.titulo}.`,...eventos];if(r.evento.judicial){institucional.riscoJuridico=clamp((institucional.riscoJuridico||10)+r.evento.judicial);oposicao.forca=clamp((oposicao.forca||30)+1);}}
        const progressoAnterior=original.progresso||0;[25,50,75].forEach(m=>{if(progressoAnterior<m&&r.progresso>=m){marcos=[{turno:state.turno,progresso:m,texto:`${m}% das entregas pactuadas`},...marcos];redeSocial.posts=[{id:`prog_marco_${original.id}_${m}_${state.turno}`,autorId:'presidente',autor:state.perfilPresidencial?.nomePublico||'Presidente',handle:state.perfilPresidencial?.handle||'@Presidencia',texto:`${original.nome} chega a ${m}% das entregas previstas. Metas e execução seguem públicas.`,tema:'programa',alcance:1400000+m*18000,turno:state.turno},...redeSocial.posts];}});
        const metas=(original.metas||[]).map(m=>({...m,valor:Number((m.meta*(r.progresso/100)*(r.qualidade/70)).toFixed(1))}));
        let status=r.atrasado?'atrasado':'ativo';
        if(r.concluido){status='concluido';eventos=[`✅ Programa concluído: ${original.nome} · qualidade ${Math.round(r.qualidade)}%.`,...eventos];gruposSociais=aplicarImpactoGrupos(gruposSociais,Object.fromEntries(Object.entries(original.grupos||{}).map(([k,v])=>[k,v*.65])));if(original.promessaId)promessas=promessas.map(pr=>pr.id===original.promessaId?{...pr,status:'cumprida',cumpridaNoTurno:state.turno,programaId:original.id}:pr);redeSocial.posts=[{id:`prog_final_${original.id}`,autorId:'presidente',autor:state.perfilPresidencial?.nomePublico||'Presidente',handle:state.perfilPresidencial?.handle||'@Presidencia',texto:`Concluímos ${original.nome}. Agora o país pode comparar promessa, meta e entrega.`,tema:'programa',alcance:3900000,turno:state.turno},...redeSocial.posts];}
        else if(original.promessaId&&r.progresso>=40)promessas=promessas.map(pr=>pr.id===original.promessaId&&pr.status!=='cumprida'?{...pr,status:'em_cumprimento',programaId:original.id}:pr);
        return {...original,status,progresso:r.progresso,qualidade:r.qualidade,execucao:r.execucao,riscoExecucao:risco,custoFederalMensal:r.custoFederal,gastoAcumulado:(original.gastoAcumulado||0)+r.custoFederal,mesesExecutados:(original.mesesExecutados||0)+1,atrasoMeses:r.atrasado?(original.atrasoMeses||0)+1:(original.atrasoMeses||0),alertas,marcos,metas,atualizadoNoTurno:state.turno};
      });
      return {programas,economia,gruposSociais,estados,institucional,oposicao,redeSocial:{...redeSocial,posts:redeSocial.posts.slice(0,120)},promessasPoliticas:promessas,eventosRecentes:eventos.slice(0,18)};
    });
  },

  negociarApoio: (partidoId, tipo = 'dialogo', custo = 5) => {
    const state = get();
    if (state.capitalPolitico < custo) return false;
    const ganho = tipo === 'cargo' ? 12 : 7;
    set(current => ({
      partidos: current.partidos.map(p => p.id === partidoId ? { ...p, apoio: clamp(p.apoio + ganho) } : p),
      capitalPolitico: current.capitalPolitico - custo,
      promessasPoliticas: tipo === 'cargo'
        ? [{ id: `${partidoId}_${Date.now()}`, partidoId, tipo, turno: current.turno }, ...current.promessasPoliticas]
        : current.promessasPoliticas,
    }));
    return true;
  },

  usarCartaDiplomatica: async (cartaId, paisId) => {
    try {
      const s = get();
      const carta = s.cartasDiplomaticas.find(c => c.id === cartaId);
      const pais = s.paises.find(p => p.id === paisId);

      if (!carta || !pais) return false;
      if (!s.diplomacia.cartasDesbloqueadas.includes(cartaId)) return false;

      const novosPaises = [...s.paises];
      const paisIndex = novosPaises.findIndex(p => p.id === paisId);
      
      novosPaises[paisIndex] = {
        ...novosPaises[paisIndex],
        relacao: Math.min(100, Math.max(0, novosPaises[paisIndex].relacao + carta.confianca))
      };

      const xpGanho = Math.max(10, carta.custo * 5);
      await get().ganharXpDiplomacia(xpGanho);

      set(state => ({
        paises: novosPaises,
        eventosRecentes: [
          `🎴 Carta "${carta.titulo}" usada em ${pais.nome}. Relação: ${carta.confianca > 0 ? '+' : ''}${carta.confianca}`,
          ...state.eventosRecentes
        ]
      }));

      return true;
    } catch (error) {
      console.error('Erro ao usar carta diplomática:', error);
      return false;
    }
  },

  ganharXpDiplomacia: async (qtd) => {
    set(state => {
      let { nivel, xp, xpParaProximoNivel, cartasDesbloqueadas } = state.diplomacia;
      xp += qtd;
      let msg = "";
      let novasCartasIds = [];

      while (xp >= xpParaProximoNivel && nivel < 6) {
        nivel++;
        xp = xp - xpParaProximoNivel;
        xpParaProximoNivel = Math.round(xpParaProximoNivel * 1.5);
        
        const cartasDoNivel = state.cartasDiplomaticas.filter(c => 
          c.nivelNecessario === nivel && !cartasDesbloqueadas.includes(c.id)
        );
        
        if (cartasDoNivel.length > 0) {
          cartasDoNivel.forEach(c => {
            cartasDesbloqueadas.push(c.id);
            novasCartasIds.push(c.id);
          });
        }
      }

      if (novasCartasIds.length > 0) {
        const nomesCartas = novasCartasIds.map(id => 
          state.cartasDiplomaticas.find(c => c.id === id)?.titulo || id
        );
        msg = `🎉 Nível Diplomático ${nivel}! Novas cartas: ${nomesCartas.join(', ')}`;
      }

      return {
        diplomacia: { ...state.diplomacia, nivel, xp, xpParaProximoNivel, cartasDesbloqueadas },
        eventosRecentes: msg ? [msg, ...state.eventosRecentes] : state.eventosRecentes
      };
    });
  },

  gerarTratado: (paisId) => {
    const s = get();
    const pais = s.paises.find(p => p.id === paisId);
    if (!pais) return null;

    const novoTratado = {
      id: `tratado_${paisId}_${Date.now()}`,
      paisId,
      paisNome: pais.nome,
      dataAssinatura: s.dataAtual,
      dataExpiracao: new Date(s.dataAtual.getFullYear() + 5, s.dataAtual.getMonth(), s.dataAtual.getDate()),
      titulo: `Acordo de Cooperação com ${pais.nome}`,
      duracao: 5,
      revisao: "Anual",
      clausulaSaida: 6,
      beneficiosBrasil: ["Cooperação técnica", "Incremento comercial"],
      compromissosBrasil: ["Reciprocidade", "Diálogo regular"],
      efeitos: { relacao: +15, orcamento: 1000, comercio: +10, softPower: +5 }
    };

    set(state => ({
      mundo: { ...state.mundo, tratadosAtivos: [...state.mundo.tratadosAtivos, novoTratado] },
      economia: registrarMovimentoFiscal(state.economia, -novoTratado.efeitos.orcamento, 'receita'),
      eventosRecentes: [`📜 Tratado assinado com ${pais.nome}: entrada externa estimada em R$ ${novoTratado.efeitos.orcamento} mi.`, ...state.eventosRecentes]
    }));

    return novoTratado;
  },

  processarTurnoInternacional: () => {
    set(state => {
      const variacaoTensao = Math.floor(Math.random() * 7) - 2;
      const novaTensao = clamp(state.mundo.tensaoGlobal + variacaoTensao);
      const novasCommodities = Object.fromEntries(Object.entries(state.mundo.commodities || {}).map(([key, value]) => {
        const variacao = (Math.random() * 2 - 1) * (value.volatilidade || 1);
        return [key, { ...value, preco: Math.max(1, value.preco + variacao) }];
      }));
      let geopolitica = processarMesGeopolitico({ geopolitica: state.geopolitica, paises: state.paises, turno: state.turno + 1, tensaoGlobal: novaTensao });
      const sancoesPersistentes=Math.min(3,(geopolitica.sancoesAtivas||[]).length);
      if(sancoesPersistentes && Math.random()<0.22*sancoesPersistentes){
        const alvo=state.paises.find(p=>p.id===geopolitica.sancoesAtivas[0]?.paisId);
        geopolitica={...geopolitica,feed:[{id:`san_reperc_${state.turno+1}_${Date.now()}`,titulo:`Sanções contra ${alvo?.nome||'país estrangeiro'} geram retaliação comercial e alerta humanitário`,tema:'sancoes',paises:alvo?[alvo.id]:[],gravidade:62,fonte:'Mundi Exterior',turno:state.turno+1,idade:0},...(geopolitica.feed||[])].slice(0,90)};
      }
      const evento = geopolitica.feed?.[0];
      const fonteParaMidia = {
        'Global Internacional':'global',
        'N1 Mundo':'n1',
        'Mundi Exterior':'mundi',
        'Canal Geral Mundo':'canal_geral',
      };
      const autorId = fonteParaMidia[evento?.fonte] || ['global','n1','mundi','canal_geral'][Math.floor(Math.random()*4)];
      const midia = (state.midias||[]).find(m=>m.id===autorId);
      const postInternacional = evento ? {
        id:`int_${state.turno+1}_${Date.now()}`,
        autorId,
        texto:evento.titulo,
        tema:'internacional',
        sentimento:evento.gravidade>=70?-2:evento.gravidade>=50?-1:0,
        alcance:Math.round((midia?.alcance||70)*100000),
        turno:state.turno+1,
      } : null;
      return {
        mundo: { ...state.mundo, tensaoGlobal: novaTensao, commodities: novasCommodities },
        economia: sancoesPersistentes ? { ...state.economia, inflacao:Math.max(.5,state.economia.inflacao+.03*sancoesPersistentes), riscoPais:Math.max(80,state.economia.riscoPais+2*sancoesPersistentes) } : state.economia,
        geopolitica,
        redeSocial: postInternacional ? { ...state.redeSocial, posts:[postInternacional,...(state.redeSocial?.posts||[])].slice(0,100) } : state.redeSocial,
        eventosRecentes: evento ? [`🌍 ${evento.titulo}`, ...state.eventosRecentes].slice(0,18) : state.eventosRecentes,
      };
    });
  },

  podeNegociarCom: (paisId) => podeAbrirNegociacao(get().geopolitica, paisId, get().turno),

  prepararVisitaEstado: (paisId) => {
    const s = get();
    const pais = s.paises.find(p => p.id === paisId);
    if (!pais) return { ok:false, motivo:'País não encontrado.' };
    if ((s.geopolitica.visitasEstado||[]).some(v=>v.paisId===paisId&&['agendada','preparada','confirmada'].includes(v.status))) return {ok:false,motivo:'Esta visita já está em preparação ou confirmada na Agenda Presidencial.'};
    if (s.capitalPolitico < 2) return { ok:false, motivo:'Capital político insuficiente para preparar a visita.' };
    const convite=criarConviteVisitaInternacional({pais,turnoAtual:s.turno,dataInicio:DATA_INICIO});
    set(state => ({
      capitalPolitico: state.capitalPolitico - 2,
      geopolitica: { ...state.geopolitica, visitasEstado:[{paisId,turno:state.turno,status:'preparada',conviteAgendaId:convite.id,turnoProposto:convite.turnoProposto,diaProposto:convite.dia,dataProposta:convite.dataISO},...(state.geopolitica.visitasEstado||[])].slice(0,24) },
      agendaCalendario:{...(state.agendaCalendario||criarAgendaCalendarioInicial(DATA_INICIO)),convites:[convite,...(state.agendaCalendario?.convites||[])].slice(0,80)},
      eventosRecentes:[`✈️ Itamaraty preparou visita a ${pais.nome}. A chancelaria propôs ${convite.dataISO}; responda na Agenda Presidencial.`,...state.eventosRecentes].slice(0,18),
    }));
    saveGame(get()); return {ok:true,convite};
  },

  executarVisitaPresidencial: (paisId) => {
    const s=get(); const pais=s.paises.find(p=>p.id===paisId); if(!pais)return {ok:false,motivo:'País não encontrado.'};
    const visita=(s.geopolitica.visitasEstado||[]).find(v=>v.paisId===paisId&&['agendada','confirmada','preparada'].includes(v.status)); if(!visita)return {ok:false,motivo:'Não há visita preparada.'};
    const candidatas=empresasVisitasSeed.filter(e=>e.paisId===paisId && !(s.empresasPrivadas||[]).some(x=>x.id===e.id));
    const descoberta=candidatas.length?candidatas[(s.turno+candidatas.length)%candidatas.length]:null;
    const oportunidade=criarOportunidadeVisita({paisId,turno:s.turno,comercio:s.comercioExterior});
    set(state=>{
      let comercio={...(state.comercioExterior||COMERCIO_INICIAL), parceiros:{...(state.comercioExterior?.parceiros||{})}, oportunidades:[...(state.comercioExterior?.oportunidades||[])]};
      const parceiro=comercio.parceiros[paisId]||{nome:pais.nome,exportacoes:300,importacoes:300,acesso:45};
      comercio.parceiros[paisId]={...parceiro,acesso:clamp((parceiro.acesso||45)+6)};
      if(oportunidade && !comercio.oportunidades.some(o=>o.id===oportunidade.id)) comercio.oportunidades=[oportunidade,...comercio.oportunidades].slice(0,20);
      const empresas=descoberta?[descoberta,...state.empresasPrivadas]:state.empresasPrivadas;
      return {
        geopolitica:{...abrirJanela(state.geopolitica,paisId,state.turno,3),visitasEstado:(state.geopolitica.visitasEstado||[]).map(v=>v.paisId===paisId&&['agendada','confirmada','preparada'].includes(v.status)?{...v,status:'realizada',realizadaNoTurno:state.turno}:v),credibilidadeDiplomatica:clamp((state.geopolitica.credibilidadeDiplomatica||50)+2)},
        paises:state.paises.map(p=>p.id===paisId?{...p,relacao:clamp(p.relacao+4)}:p),
        mundo:{...state.mundo,softPowerBrasil:clamp((state.mundo.softPowerBrasil||50)+2)},
        empresasPrivadas:empresas,
        comercioExterior:comercio,
        redeSocial:{...state.redeSocial,posts:[{id:`visita_${paisId}_${state.turno}_${Date.now()}`,autorId:'mundi',autor:'Mundi',texto:`Visita presidencial a ${pais.nome} termina com agenda econômica${descoberta?`; ${descoberta.nome} confirma prospecção no Brasil`:''}${oportunidade?` e abre negociação em ${oportunidade.titulo}`:''}.`,tema:'economia',alcance:5400000,turno:state.turno},...(state.redeSocial?.posts||[])].slice(0,120)},
        eventosRecentes:[`🌐 Visita presidencial a ${pais.nome}: mercado aberto${descoberta?`, ${descoberta.nome} iniciou prospecção`:''}${oportunidade?' e surgiu uma oportunidade comercial':''}.`,...state.eventosRecentes].slice(0,18),
      };
    });
    return {ok:true,empresa:descoberta,oportunidade};
  },

  registrarNegociacaoDiplomatica: (paisId, resultado={}) => {
    const atual=get(); const pais=atual.paises.find(p=>p.id===paisId); if(!pais)return {ok:false};
    set(state=>({
      paises:state.paises.map(p=>p.id===paisId?{...p,relacao:clamp(p.relacao+(resultado.sucesso?10:-6))}:p),
      geopolitica:{...state.geopolitica,mesUltimaNegociacao:{...(state.geopolitica.mesUltimaNegociacao||{}),[paisId]:state.turno},credibilidadeDiplomatica:clamp((state.geopolitica.credibilidadeDiplomatica||50)+(resultado.sucesso?3:-2))},
      mundo:{...state.mundo,softPowerBrasil:clamp(state.mundo.softPowerBrasil+(resultado.sucesso?3:-1))},
      eventosRecentes:[`${resultado.sucesso?'🤝':'🧊'} Negociação presidencial com ${pais.nome} ${resultado.sucesso?'produziu entendimento':'terminou sem acordo'}.`,...state.eventosRecentes].slice(0,18),
    }));
    if(resultado.sucesso)get().ganharXpDiplomacia(35); saveGame(get()); return {ok:true};
  },

  executarAcaoSoberana: (acaoId,paisId) => {
    const state=get(); const acao=acoesSoberanasSeed.find(a=>a.id===acaoId); const pais=state.paises.find(p=>p.id===paisId);
    if(!acao||!pais)return {ok:false,motivo:'Ação ou país inválido.'};
    if(state.capitalPolitico<acao.custoPolitico)return {ok:false,motivo:'Capital político insuficiente.'};
    if(['mobilizacao','forca'].includes(acaoId) && state.nomeacoes.every(n=>n.cargoId!=='m_defesa'))return {ok:false,motivo:'Nomeie um ministro da Defesa antes de escalar militarmente.'};
    if(acaoId==='forca' && !state.geopolitica.estadoEmergencia)return {ok:false,motivo:'Mobilize o país e ative o estado de emergência antes de autorizar o uso da força.'};
    const custoCongresso={tratado_estrategico:6,mobilizacao:12,forca:18}[acaoId]||0;
    if(custoCongresso && (state.congresso?.poder||0)<custoCongresso)return {ok:false,motivo:`A decisão exige autorização/referendo político. Faltam ${custoCongresso-(state.congresso?.poder||0)} pontos de Poder de Bastidor no Congresso.`};
    const i=impactoAcaoSoberana(acaoId,pais,state.geopolitica,state.mundo,state.economia);
    const vazou=acaoId==='operacao_encoberta' && Math.random()<Math.min(.82,((state.geopolitica.riscoVazamento||8)+i.vazamento)/100);
    set(s=>{
      let grupos={...s.gruposSociais};
      const rally=i.rally||0;
      if(rally) grupos=aplicarImpactoGrupos(grupos,{militares:rally,evangelicos:rally*.35,mercado:-rally*.25,universitarios:-rally*.35,periferia:rally*.2});
      if(acaoId==='sancoes') grupos=aplicarImpactoGrupos(grupos,{mercado:-1.5,agro:-1,universitarios:.5,militares:1});
      let g={...s.geopolitica};
      const item={id:`${acaoId}_${paisId}_${s.turno}_${Date.now()}`,paisId,acaoId,turno:s.turno,vazou};
      if(acaoId==='sancoes')g.sancoesAtivas=[item,...(g.sancoesAtivas||[])];
      if(acaoId==='operacao_encoberta')g.operacoesEncobertas=[{...item,status:vazou?'exposta':'ativa'},...(g.operacoesEncobertas||[])];
      if(acaoId==='reconhecimento')g.reconhecimentos=[item,...(g.reconhecimentos||[])];
      if(acaoId==='tratado_estrategico')g.tratadosEstrategicos=[item,...(g.tratadosEstrategicos||[])];
      g={...g,estadoEmergencia:['mobilizacao','forca'].includes(acaoId)||g.estadoEmergencia,mesesEmergencia:['mobilizacao','forca'].includes(acaoId)?3:g.mesesEmergencia,prontidaoMilitar:clamp((g.prontidaoMilitar||36)+i.prontidao),capacidadeInteligencia:clamp((g.capacidadeInteligencia||48)+i.inteligencia),riscoVazamento:clamp((g.riscoVazamento||8)+i.vazamento),historicoSoberano:[item,...(g.historicoSoberano||[])].slice(0,50)};
      const economia={...s.economia,riscoPais:Math.max(80,s.economia.riscoPais+i.riscoPais),inflacao:Math.max(.5,s.economia.inflacao+i.inflacao),desemprego:Math.max(1,(s.economia.desemprego||8)+i.desemprego)};
      const mundo={...s.mundo,softPowerBrasil:clamp(s.mundo.softPowerBrasil+i.softPower),tensaoGlobal:clamp(s.mundo.tensaoGlobal+i.tensao)};
      const paises=s.paises.map(p=>{
        if(p.id!==paisId)return p;
        const extra={};
        if(acaoId==='sancoes')extra.pressaoSancoes=clamp((p.pressaoSancoes||0)+18);
        if(acaoId==='reconhecimento')extra.reconhecidoPeloBrasil=true;
        if(acaoId==='tratado_estrategico')extra.parceriaEstrategicaBrasil=true;
        if(acaoId==='forca')extra.emConflitoBrasil=true;
        return {...p,...extra,relacao:clamp(p.relacao+i.relacao)};
      });
      const evento=vazou?`🚨 Operação encoberta no relacionamento com ${pais.nome} foi exposta. Escândalo internacional em curso.`:`${acao.icone} Presidência autorizou ${acao.nome} em relação a ${pais.nome}.`;
      const congresso=custoCongresso?{...s.congresso,poder:clamp((s.congresso?.poder||0)-custoCongresso),ultimaMovimentacao:`Autorização externa: ${acao.nome}`,historico:[{id:Date.now(),acao:`Autorização externa: ${acao.nome}`},...(s.congresso?.historico||[])].slice(0,20)}:s.congresso;
      return {capitalPolitico:s.capitalPolitico-acao.custoPolitico,congresso,geopolitica:g,economia,mundo,paises,gruposSociais:grupos,popularidade:{...s.popularidade,geral:clamp(aprovacaoNacional(grupos))},eventosRecentes:[evento,...s.eventosRecentes].slice(0,18)};
    });
    saveGame(get()); return {ok:true,vazou};
  },

  definirDoutrinaGeopolitica: (doutrinaId) => {
    const d=doutrinasBrasilSeed.find(x=>x.id===doutrinaId); if(!d)return {ok:false};
    if(get().geopolitica.doutrina && get().geopolitica.doutrina!==doutrinaId)return {ok:false,motivo:'A doutrina de legado já foi consolidada neste mandato.'};
    set(s=>({geopolitica:{...s.geopolitica,doutrina:doutrinaId},gruposSociais:aplicarImpactoGrupos(s.gruposSociais,d.grupos||{}),eventosRecentes:[`${d.icone} Doutrina externa consolidada: ${d.nome}.`,...s.eventosRecentes].slice(0,18)})); saveGame(get());return {ok:true};
  },

  agirOrganizacaoInternacional: (orgId,instrumento) => {
    const org=organizacoesInternacionaisSeed.find(o=>o.id===orgId); if(!org)return {ok:false};
    const atual=get();
    if(atual.capitalPolitico<org.custo)return {ok:false,motivo:'Capital político insuficiente.'};
    const efeitos={
      onu:{soft:3,cred:4,tensao:-2,risco:-1,mercado:0,paises:[],grupos:{universitarios:1}},
      csnu:{soft:4,cred:3,tensao:-4,risco:-1,mercado:0,paises:[],grupos:{militares:1,universitarios:1}},
      brics:{soft:2,cred:1,tensao:0,risco:-2,mercado:1,paises:['cn','in','za','ae','sa','eg','ir','id'],grupos:{mercado:1,agro:1}},
      mercosul:{soft:2,cred:2,tensao:-1,risco:-2,mercado:1,paises:['ar','uy','py'],grupos:{agro:1,sindicalistas:.5}},
      g20:{soft:3,cred:2,tensao:-1,risco:-3,mercado:2,paises:['us','cn','de','fr','in','jp'],grupos:{mercado:1,universitarios:.5}},
      omc:{soft:1,cred:2,tensao:-1,risco:-2,mercado:2,paises:[],grupos:{agro:1,mercado:1}},
      oea:{soft:2,cred:3,tensao:-2,risco:-1,mercado:0,paises:['ar','cl','co','uy','py','ve'],grupos:{universitarios:1}},
      otan:{soft:0,cred:0,tensao:2,risco:1,mercado:1,paises:['us','gb','de','fr','it','es','pt','no','ca'],grupos:{militares:2,universitarios:-.5}},
    }[orgId]||{soft:1,cred:1,tensao:0,risco:0,mercado:0,paises:[],grupos:{}};
    set(s=>{
      let geopolitica={...s.geopolitica,organizacoes:{...(s.geopolitica.organizacoes||{}),[orgId]:clamp((s.geopolitica.organizacoes?.[orgId]??org.capital)+4)},credibilidadeDiplomatica:clamp((s.geopolitica.credibilidadeDiplomatica||50)+efeitos.cred)};
      (efeitos.paises||[]).forEach(pid=>{geopolitica=abrirJanela(geopolitica,pid,s.turno,2)});
      let crises=geopolitica.crises||[];
      if(['onu','csnu','oea'].includes(orgId)){
        let usado=false;
        crises=crises.map(c=>{if(!usado&&c.status==='ativa'){usado=true;return {...c,gravidade:Math.max(5,c.gravidade-(orgId==='csnu'?10:6)),ultimaArena:org.sigla}};return c;});
        geopolitica={...geopolitica,crises};
      }
      if(orgId==='otan')geopolitica={...geopolitica,prontidaoMilitar:clamp((geopolitica.prontidaoMilitar||36)+4),capacidadeInteligencia:clamp((geopolitica.capacidadeInteligencia||48)+2)};
      const paises=s.paises.map(p=>(efeitos.paises||[]).includes(p.id)?{...p,relacao:clamp(p.relacao+2)}:p);
      const economia={...s.economia,riscoPais:Math.max(80,(s.economia.riscoPais||250)+efeitos.risco),confiancaMercado:clamp((s.economia.confiancaMercado||50)+efeitos.mercado)};
      const mundo={...s.mundo,softPowerBrasil:clamp(s.mundo.softPowerBrasil+efeitos.soft),tensaoGlobal:clamp(s.mundo.tensaoGlobal+efeitos.tensao)};
      const gruposSociais=aplicarImpactoGrupos(s.gruposSociais,efeitos.grupos||{});
      return {capitalPolitico:s.capitalPolitico-org.custo,geopolitica,mundo,economia,paises,gruposSociais,popularidade:{...s.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},eventosRecentes:[`🏛️ ${org.sigla}: Brasil movimentou “${instrumento}”. ${efeitos.paises?.length?`${efeitos.paises.length} canal(is) diplomático(s) ganharam prioridade.`:'A posição brasileira ganhou repercussão multilateral.'}`,...s.eventosRecentes].slice(0,18)};
    });
    saveGame(get());return {ok:true};
  },

  resolverCriseInternacional: (criseId,opcao) => {
    const crise=get().geopolitica.crises.find(c=>c.id===criseId); if(!crise)return {ok:false};
    const media=String(opcao).toLowerCase().includes('media')||String(opcao).toLowerCase().includes('onu');
    set(s=>({geopolitica:{...s.geopolitica,crises:s.geopolitica.crises.map(c=>c.id===criseId?{...c,status:'respondida',resposta:opcao,gravidade:Math.max(5,c.gravidade-(media?18:10))}:c),credibilidadeDiplomatica:clamp((s.geopolitica.credibilidadeDiplomatica||50)+(media?3:1))},mundo:{...s.mundo,softPowerBrasil:clamp(s.mundo.softPowerBrasil+(media?3:1))},eventosRecentes:[`🌐 Crise internacional: Planalto escolheu “${opcao}”.`,...s.eventosRecentes].slice(0,18)})); saveGame(get());return {ok:true};
  },

  processarInstitucional: () => {
    set(state => {
      const novoInstitucional = { ...state.institucional };
      novoInstitucional.tensaoInstitucional = Math.max(0, novoInstitucional.tensaoInstitucional - 1);
      
      if (novoInstitucional.tensaoInstitucional > 70) novoInstitucional.estadoAtual = ESTADOS_INSTITUCIONAIS.CRISE;
      else if (novoInstitucional.tensaoInstitucional > 40) novoInstitucional.estadoAtual = ESTADOS_INSTITUCIONAIS.CONFLITO;
      else if (novoInstitucional.tensaoInstitucional > 20) novoInstitucional.estadoAtual = ESTADOS_INSTITUCIONAIS.ALERTA;
      else novoInstitucional.estadoAtual = ESTADOS_INSTITUCIONAIS.NORMALIDADE;

      return {
        institucional: novoInstitucional,
        eventosRecentes: ['⚖️ Sistema institucional atualizado', ...state.eventosRecentes]
      };
    });
  },

  processarTurnoJudiciario: () => {
    set(state => {
      const atual = { ...state.stf, corte:[...(state.stf?.corte||[])] };
      atual.tensaoInstitucional = Math.max(0, (atual.tensaoInstitucional||0) - 2);
      const julgamento=julgarProcessosSTF(atual,state.turno);
      atual.processosEmCurso=julgamento.processos;
      atual.historicoDecisoes=[...julgamento.julgados,...(atual.historicoDecisoes||[])].slice(0,30);
      let institucional={...state.institucional};
      let popularidade={...state.popularidade};
      let eventos=[...state.eventosRecentes];
      julgamento.julgados.forEach(j=>{
        if(j.resultado==='governo_derrotado'){
          institucional.tensaoInstitucional=clamp((institucional.tensaoInstitucional||0)+3);
          popularidade.geral=clamp((popularidade.geral||50)-1);
          eventos=[`⚖️ STF derruba posição do governo em ${j.titulo}.`,...eventos];
        }else{
          institucional.respeitoConstitucional=clamp((institucional.respeitoConstitucional||80)+1);
          eventos=[`⚖️ STF valida posição do governo em ${j.titulo}.`,...eventos];
        }
      });
      return {stf:atual,institucional,popularidade,eventosRecentes:eventos.slice(0,18)};
    });
  },


  nomearParaCargo: (cargoId, candidato) => {
    const antes = get();
    const primeiraNomeacao = !antes.nomeacoes.some(n => n.cargoId === cargoId);
    const custoNomeacao = antes.turno <= 6 && primeiraNomeacao ? 0 : 10;
    if (antes.capitalPolitico < custoNomeacao) return false;

    set(state => {
      const base = {
        cargoId,
        ...candidato,
        lealdade: candidato.lealdadeInicial ?? 70,
        habTecnica: candidato.habilidadeTecnica ?? 50,
        habPolitica: candidato.habilidadePolitica ?? 50,
        eficacia: avaliarMinistro({ ...candidato, lealdade: candidato.lealdadeInicial ?? 70, habTecnica:candidato.habilidadeTecnica, habPolitica:candidato.habilidadePolitica }).eficacia,
        tensao: 0,
        nomeadoNoTurno: state.turno,
      };
      const ganhoCongresso = Math.max(-2, Math.min(6, Math.round(((candidato.habilidadePolitica||50)-50)/10) + (candidato.perfil==='politico'?2:0)));
      const novosPartidos = state.partidos.map((p)=>candidato.perfil==='politico' && ['centro','ind'].includes(p.id)?{...p,apoio:clamp(p.apoio+3)}:p);
      return {
        nomeacoes: [...state.nomeacoes.filter(n => n.cargoId !== cargoId), base],
        capitalPolitico: state.capitalPolitico - custoNomeacao,
        partidos: novosPartidos,
        congresso: { ...state.congresso, poder: clamp((state.congresso?.poder||0)+ganhoCongresso) },
        eventosRecentes: [`👔 ${candidato.nome} nomeado para ${state.cargos.find(c=>c.id===cargoId)?.nome||cargoId}${custoNomeacao === 0 ? ' usando o capital de montagem' : ''}.`, ...state.eventosRecentes].slice(0,18)
      };
    });
    saveGame(get());
    return true;
  },

  executarAcaoPresidencial: (acaoId) => {
    const acao = getPresidentialAction(acaoId);
    if (!acao) return { ok: false, motivo: 'Ação presidencial inexistente.' };

    const atual = get();
    const agendaAtual = atual.agendaPresidencial || AGENDA_INICIAL;
    if (agendaAtual.acoesUsadas.includes(acaoId)) {
      return { ok: false, motivo: 'Esta ação já foi usada neste mês.' };
    }
    if (agendaAtual.pontosRestantes < acao.pontos) {
      return { ok: false, motivo: 'Atenção presidencial insuficiente neste mês.' };
    }
    if ((acao.custoCapital || 0) > atual.capitalPolitico) {
      return { ok: false, motivo: 'Capital político insuficiente.' };
    }

    let reacaoFinal = null;

    set(state => {
      const popularidade = { ...state.popularidade };
      let economia = { ...state.economia };
      const institucional = { ...state.institucional };
      const stf = { ...state.stf };
      const mundo = { ...state.mundo };
      let partidos = state.partidos.map(p => ({ ...p }));
      let orcamento = state.orcamento;
      if (acao.custoOrcamento) {
        const tipoFiscal = acaoId === 'plano_infraestrutura' ? 'infraestrutura' : acaoId === 'mutirao_social' ? 'humano' : 'custeio';
        economia = registrarMovimentoFiscal(economia, acao.custoOrcamento, tipoFiscal);
      }
      let capitalPolitico = state.capitalPolitico - (acao.custoCapital || 0);
      let climaGoverno = state.climaGoverno;
      let conflitosMinisteriais = [...state.conflitosMinisteriais];
      const impactos = [];

      switch (acaoId) {
        case 'mutirao_social':
          popularidade.classeBaixa = clamp(popularidade.classeBaixa + 6);
          popularidade.classeMedia = clamp(popularidade.classeMedia + 1);
          popularidade.empresarios = clamp(popularidade.empresarios - 2);
          popularidade.geral = clamp(popularidade.geral + 2);
          economia.confiancaMercado = clamp(economia.confiancaMercado - 3);
          impactos.push('+6 baixa renda', '+2 aprovação', '-3 mercado');
          break;

        case 'pronunciamento_nacional': {
          const efeito = climaGoverno >= 65 ? 4 : climaGoverno >= 45 ? 2 : -1;
          popularidade.geral = clamp(popularidade.geral + efeito);
          popularidade.classeMedia = clamp(popularidade.classeMedia + Math.max(-1, efeito - 1));
          impactos.push(`${efeito >= 0 ? '+' : ''}${efeito} aprovação`);
          if (efeito < 0) climaGoverno = clamp(climaGoverno - 2);
          break;
        }

        case 'ancora_fiscal':
          economia.confiancaMercado = clamp(economia.confiancaMercado + 7);
          economia.inflacao = Math.max(0.5, economia.inflacao - 0.2);
          popularidade.sindicatos = clamp(popularidade.sindicatos - 2);
          popularidade.classeBaixa = clamp(popularidade.classeBaixa - 1);
          economia.economiaTurno = (economia.economiaTurno || 0) + 400;
          impactos.push('+7 mercado', '-0,2 inflação', '+R$ 400 mi');
          break;

        case 'plano_infraestrutura':
          economia.crescimentoPib = Number((economia.crescimentoPib + 0.18).toFixed(2));
          economia.confiancaMercado = clamp(economia.confiancaMercado + 3);
          popularidade.geral = clamp(popularidade.geral + 2);
          popularidade.classeBaixa = clamp(popularidade.classeBaixa + 3);
          popularidade.classeMedia = clamp(popularidade.classeMedia + 2);
          impactos.push('+0,18 PIB', '+2 aprovação', '+3 mercado');
          break;

        case 'rodada_lideres':
          partidos = partidos.map(p => {
            if (p.id === 'centro') return { ...p, apoio: clamp(p.apoio + 9) };
            if (p.id === 'ind') return { ...p, apoio: clamp(p.apoio + 5) };
            return p;
          });
          climaGoverno = clamp(climaGoverno + 2);
          impactos.push('+9 centro', '+5 independentes', '+2 governabilidade');
          break;

        case 'pacto_institucional':
          stf.tensaoInstitucional = clamp(stf.tensaoInstitucional - 12);
          institucional.tensaoInstitucional = clamp(institucional.tensaoInstitucional - 9);
          institucional.respeitoConstitucional = clamp(institucional.respeitoConstitucional + 3);
          institucional.riscoJuridico = clamp(institucional.riscoJuridico - 4);
          impactos.push('-12 tensão STF', '-9 tensão institucional', '+3 constitucionalidade');
          break;

        case 'choque_gestao':
          climaGoverno = clamp(climaGoverno + 7);
          conflitosMinisteriais = conflitosMinisteriais.slice(0, Math.max(0, conflitosMinisteriais.length - 1));
          impactos.push('+7 clima interno', conflitosMinisteriais.length < state.conflitosMinisteriais.length ? '1 atrito contido' : 'coordenação reforçada');
          break;

        case 'operacao_integridade':
          institucional.credibilidadeDemocratica = clamp(institucional.credibilidadeDemocratica + 4);
          institucional.riscoJuridico = clamp(institucional.riscoJuridico - 3);
          popularidade.classeMedia = clamp(popularidade.classeMedia + 2);
          popularidade.geral = clamp(popularidade.geral + 1);
          climaGoverno = clamp(climaGoverno - 5);
          impactos.push('+4 credibilidade', '+2 classe média', '-5 clima interno');
          break;

        case 'ofensiva_diplomatica':
          mundo.softPowerBrasil = clamp(mundo.softPowerBrasil + 9);
          economia.confiancaMercado = clamp(economia.confiancaMercado + 2);
          impactos.push('+9 soft power', '+2 mercado');
          break;

        default:
          break;
      }

      const gruposPorAcao = {
        mutirao_social:{periferia:4,sindicalistas:2,evangelicos:1,mercado:-3,agro:-1},
        pronunciamento_nacional:{periferia:1,evangelicos:1,mercado:-1,universitarios:-1},
        ancora_fiscal:{mercado:5,agro:1,sindicalistas:-3,periferia:-2,universitarios:-1},
        plano_infraestrutura:{periferia:3,agro:3,mercado:2,universitarios:1,sindicalistas:-1},
        rodada_lideres:{mercado:1,agro:1,universitarios:-1,periferia:-1},
        pacto_institucional:{universitarios:3,mercado:2,militares:-1,evangelicos:-1},
        choque_gestao:{mercado:2,universitarios:1,sindicalistas:-1},
        operacao_integridade:{universitarios:3,mercado:2,evangelicos:1,agro:-1,militares:-1},
        ofensiva_diplomatica:{mercado:2,universitarios:2,militares:1,evangelicos:-1},
      };
      const gruposSociais = aplicarImpactoGrupos(state.gruposSociais, gruposPorAcao[acaoId] || {});
      const estados = state.estados.map((e)=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      popularidade.geral = clamp(aprovacaoNacional(gruposSociais));

      const reacao = {
        id: `${acaoId}_${state.turno}_${Date.now()}`,
        acaoId,
        titulo: acao.titulo,
        area: acao.area,
        impactos,
        turno: state.turno,
      };
      reacaoFinal = reacao;

      const agendaAnterior = state.agendaPresidencial || AGENDA_INICIAL;
      const novoHistorico = [reacao, ...(agendaAnterior.historico || [])].slice(0, 18);
      const impulsoPib = agendaAnterior.impulsoPib + (acaoId === 'plano_infraestrutura' ? 0.18 : 0);

      return {
        popularidade,
        gruposSociais,
        estados,
        economia,
        institucional,
        stf,
        mundo,
        partidos,
        orcamento,
        capitalPolitico,
        climaGoverno,
        conflitosMinisteriais,
        agendaPresidencial: {
          ...agendaAnterior,
          pontosRestantes: agendaAnterior.pontosRestantes - acao.pontos,
          acoesUsadas: [...agendaAnterior.acoesUsadas, acaoId],
          historico: novoHistorico,
          ultimaReacao: reacao,
          impulsoPib,
        },
        eventosRecentes: [`🎯 Ordem presidencial: ${acao.titulo}`, ...state.eventosRecentes].slice(0, 12),
      };
    });

    saveGame(get());
    return { ok: true, reacao: reacaoFinal };
  },

  // =================================================================================
  // FASE 4.4.1 — ESTATAIS, INSTITUIÇÕES, OPOSIÇÃO E FEDERALISMO
  // =================================================================================
  definirDiretrizEstatal: (estatalId,diretrizId) => {
    const state=get(); const empresa=state.estatais.find(e=>e.id===estatalId);
    if(!empresa)return {ok:false,motivo:'Estatal não encontrada.'};
    if(empresa.ultimaDiretrizTurno===state.turno)return {ok:false,motivo:'A diretriz desta estatal já foi definida neste mês.'};
    const diretriz=(empresa.diretrizes||[]).find(d=>d.id===diretrizId); if(!diretriz)return {ok:false,motivo:'Diretriz inválida.'};
    set(current=>{
      let economia={...current.economia};
      if(diretriz.impactoFiscal) economia=registrarMovimentoFiscal(economia,-diretriz.impactoFiscal,diretriz.impactoFiscal>0?'receita':diretriz.crescimento?'infraestrutura':'custeio');
      if(diretriz.crescimento)economia.crescimentoPib=Number(((economia.crescimentoPib||0)+diretriz.crescimento).toFixed(2));
      if(diretriz.inflacao)economia.inflacao=Math.max(.5,Number(((economia.inflacao||0)+diretriz.inflacao).toFixed(2)));
      if(diretriz.riscoPais)economia.riscoPais=Math.max(80,Math.round((economia.riscoPais||250)+diretriz.riscoPais));
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,diretriz.grupos||{});
      const estados=current.estados.map(e=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      const estatais=current.estatais.map(e=>e.id!==estatalId?e:{...e,diretrizAtual:diretriz.id,diretrizAtualNome:diretriz.nome,ultimaDiretrizTurno:current.turno,eficiencia:clamp((e.eficiencia||50)+(diretriz.eficiencia||0)),missaoPublica:clamp((e.missaoPublica||50)+(diretriz.missao||0)),governanca:clamp((e.governanca||50)+(diretriz.governanca||0))});
      const institucional={...current.institucional,tensaoInstitucional:clamp((current.institucional?.tensaoInstitucional||0)+(diretriz.riscoInstitucional||0)),riscoJuridico:clamp((current.institucional?.riscoJuridico||0)+(diretriz.riscoInstitucional||0)*.8)};
      const evento={id:`est_${estatalId}_${current.turno}_${Date.now()}`,estatalId,titulo:`${empresa.sigla}: ${diretriz.nome}`,turno:current.turno,impactoFiscal:diretriz.impactoFiscal||0};
      return {economia,gruposSociais,estados,estatais,institucional,eventosEstatais:[evento,...(current.eventosEstatais||[])].slice(0,30),popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},eventosRecentes:[`🏛️ ${empresa.sigla}: ${diretriz.nome}.`,...current.eventosRecentes].slice(0,18)};
    });
    saveGame(get());return {ok:true};
  },

  processarTurnoEstatais: () => {
    set(state=>{
      let economia={...state.economia}; let institucional={...state.institucional}; let oposicao={...state.oposicao}; let eventos=[...state.eventosRecentes];
      const estatais=state.estatais.map(e=>{
        let gov=e.governanca||50; let efic=e.eficiencia||50;
        if(e.diretrizAtual){gov=clamp(gov+(gov<70?.4:.15)); efic=clamp(efic+(e.capacidadeInvestimento||50)/500);}
        if((e.exposicaoPolitica||0)>85&&gov<58){institucional.riscoJuridico=clamp((institucional.riscoJuridico||0)+1.5);oposicao.forca=clamp((oposicao.forca||30)+1);eventos=[`🔎 TCU e oposição elevam pressão sobre a governança da ${e.sigla}.`,...eventos];}
        return {...e,governanca:gov,eficiencia:efic};
      });
      return {estatais,economia,institucional,oposicao,eventosRecentes:eventos.slice(0,18)};
    });
  },

  firmarParceriaEmpresarial: (empresaId, modalidadeId='investimento') => {
    const state=get();
    if(state.ultimaParceriaTurno===state.turno)return {ok:false,motivo:'A Presidência já fechou uma nova parceria empresarial neste mês.'};
    const empresa=(state.empresasPrivadas||empresasPrivadasSeed).find(e=>e.id===empresaId); const modalidade=(state.modalidadesParceria||modalidadesParceriaSeed).find(m=>m.id===modalidadeId);
    if(!empresa||!modalidade)return {ok:false,motivo:'Empresa ou modalidade não encontrada.'};
    if(state.capitalPolitico<(modalidade.capital||1))return {ok:false,motivo:'Capital político insuficiente para estruturar a parceria.'};
    const projetoAtivo=(state.projetosEspeciais||[]).find(p=>empresa.projetos?.includes(p.id)&&['ativo','concluido'].includes(p.status));
    const expo=(state.eventosNacionais||[]).find(e=>e.id===empresa.eventoPreferido&&!['cancelado'].includes(e.status));
    const sinergia=(projetoAtivo?1.25:1)*(expo?1.15:1);
    const nova={id:`par_${empresa.id}_${state.turno}_${Date.now()}`,empresaId:empresa.id,empresaNome:empresa.nome,modalidadeId:modalidade.id,modalidadeNome:modalidade.nome,tipoEmpresa:empresa.tipo,paisId:empresa.paisId,iniciadaNoTurno:state.turno,mesesRestantes:6,status:'ativa',sinergia:Number(sinergia.toFixed(2)),projetoId:projetoAtivo?.id||null};
    set(current=>{
      let economia=registrarMovimentoFiscal(current.economia,Math.round((modalidade.impactoFiscal||0)*sinergia),'infraestrutura');
      economia.crescimentoPib=Number(((economia.crescimentoPib||0)+(modalidade.crescimento||0)*sinergia).toFixed(3));
      economia.confiancaMercado=clamp((economia.confiancaMercado||50)+1.2+(empresa.reputacao||50)/120);
      let geopolitica={...current.geopolitica}; let paises=current.paises.map(p=>({...p}));
      if(empresa.tipo==='multinacional'&&empresa.paisId&&empresa.paisId!=='br'){
        geopolitica=abrirJanela(geopolitica,empresa.paisId,current.turno,2);
        paises=paises.map(p=>p.id===empresa.paisId?{...p,relacao:clamp((p.relacao||50)+2)}:p);
      }
      const gruposBase=empresa.eixo==='agro'?{agro:2,mercado:1,sindicalistas:-.5}:empresa.eixo==='tecnologia'?{universitarios:2,mercado:2,sindicalistas:.4}:empresa.eixo==='infraestrutura'?{mercado:2,periferia:1,agro:1}:empresa.eixo==='saude'?{universitarios:1,periferia:1,mercado:1}:{mercado:1.5,sindicalistas:.5};
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,gruposBase);
      const post={id:`emp_${nova.id}`,autorId:empresa.id,autor:empresa.nome,handle:`@${empresa.sigla.toLowerCase()}`,grupo:'empresas',texto:`${empresa.nome} anuncia ${modalidade.nome.toLowerCase()} com o governo brasileiro${projetoAtivo?` vinculada ao projeto ${projetoAtivo.titulo}`:''}.`,tema:empresa.eixo,alcance:900000+empresa.influencia*18000,turno:current.turno};
      const posts=[post,...(current.redeSocial.posts||[])].slice(0,120);
      return {economia,geopolitica,paises,gruposSociais,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},capitalPolitico:clamp(current.capitalPolitico-(modalidade.capital||1)),parceriasEmpresariais:[nova,...(current.parceriasEmpresariais||[])].slice(0,40),ultimaParceriaTurno:current.turno,redeSocial:{...current.redeSocial,posts,tendencias:calcularTendenciasPulso(posts)},eventosRecentes:[`🏢 Parceria: ${empresa.nome} · ${modalidade.nome}.`,...current.eventosRecentes].slice(0,18)};
    }); saveGame(get()); return {ok:true,parceria:nova};
  },

  processarParceriasEmpresariais: () => {
    set(state=>{
      let economia={...state.economia}; let mundo={...state.mundo}; let eventos=[...state.eventosRecentes];
      const parcerias=(state.parceriasEmpresariais||[]).map(p=>{
        if(p.status!=='ativa')return p;
        const meses=Math.max(0,(p.mesesRestantes||1)-1);
        economia.crescimentoPib=Number(((economia.crescimentoPib||0)+.004*(p.sinergia||1)).toFixed(3));
        if(meses===0){economia.confiancaMercado=clamp((economia.confiancaMercado||50)+1.5*(p.sinergia||1));mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+(p.tipoEmpresa==='multinacional'?1:0));eventos=[`✅ Parceria empresarial entregou ciclo inicial: ${p.empresaNome}.`,...eventos];return {...p,status:'concluida',mesesRestantes:0};}
        return {...p,mesesRestantes:meses};
      });
      return {parceriasEmpresariais:parcerias,economia,mundo,eventosRecentes:eventos.slice(0,18)};
    });
  },

  indicarMinistroSTF: (candidatoId) => {
    const state=get(); if((state.stf?.corte||[]).length>=11)return {ok:false,motivo:'Não há vaga no STF.'};
    if(state.stf?.indicacaoPendente)return {ok:false,motivo:'Já existe uma indicação em tramitação no Senado.'};
    const candidato=state.candidatosSTF.find(c=>c.id===candidatoId);if(!candidato)return {ok:false,motivo:'Candidato não encontrado.'};
    const votosProjetados=projetarVotosSTF({candidato,congresso:state.congresso,oposicao:state.oposicao});
    set(s=>({stf:{...s.stf,indicacaoPendente:{...candidato,votosProjetados,indicadaNoTurno:s.turno,status:'sabatina'}},eventosRecentes:[`⚖️ ${candidato.nome} é indicado ao STF e seguirá para sabatina no Senado.`,...s.eventosRecentes].slice(0,18)}));saveGame(get());return {ok:true,votosProjetados};
  },

  votarIndicacaoSTF: () => {
    const state=get();const c=state.stf?.indicacaoPendente;if(!c)return {ok:false,motivo:'Não há indicação pendente.'};
    const base=projetarVotosSTF({candidato:c,congresso:state.congresso,oposicao:state.oposicao});
    const variacao=((state.turno*11+c.id.length*3)%9)-4; const votos=clamp(base+variacao,18,70); const aprovado=votos>=41;
    set(s=>{const registro={...c,votos,aprovado,turno:s.turno};const corte=aprovado?[...(s.stf.corte||[]),{...c,id:`stf_${c.id}_${s.turno}`,indicadoPor:'Seu governo',funcao:'Ministro',turma:(s.stf.corte||[]).filter(m=>m.turma==='1ª Turma').length<5?'1ª Turma':'2ª Turma',posse:String(new Date(s.dataAtual).getFullYear()),antiguidade:(s.stf.corte||[]).length+1}]:(s.stf.corte||[]);return {stf:{...s.stf,corte,indicacaoPendente:null,historicoIndicacoes:[registro,...(s.stf.historicoIndicacoes||[])].slice(0,12)},capitalPolitico:clamp(s.capitalPolitico-(aprovado?4:7)),congresso:{...s.congresso,poder:clamp((s.congresso?.poder||0)+(aprovado?1:-4))},oposicao:{...s.oposicao,forca:clamp((s.oposicao?.forca||30)+(aprovado?-1:4))},eventosRecentes:[`🏛️ Senado ${aprovado?'aprova':'rejeita'} ${c.nome} para o STF por ${votos} votos.`,...s.eventosRecentes].slice(0,18)}});saveGame(get());return {ok:true,aprovado,votos};
  },

  resolverEventoFederativo: (opcaoId) => {
    const state=get();const ev=state.eventoFederativoAtivo;if(!ev)return {ok:false,motivo:'Não há evento federativo pendente.'};const op=(ev.opcoes||[]).find(o=>o.id===opcaoId);if(!op)return {ok:false,motivo:'Resposta inválida.'};
    set(current=>{
      const fator=ev.multiplicador||1;
      const impactos=Object.fromEntries(Object.entries(op.grupos||{}).map(([k,v])=>[k,v*fator]));
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,impactos);
      let economia={...current.economia};
      let stf={...current.stf,processosEmCurso:[...(current.stf?.processosEmCurso||[])]}; if(op.stf)stf.processosEmCurso=[criarProcessoSTF({evento:ev,opcao:op,corte:stf.corte,turno:current.turno}),...stf.processosEmCurso];
      const estados=current.estados.map(e=>e.uf===ev.uf?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+(op.relacao||0)),governador:{...e.governador,relacao:clamp((e.governador?.relacao||50)+(op.relacao||0))},aprovacao:calcularAprovacaoEstado({...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+(op.relacao||0))},gruposSociais)}:{...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)});
      const oposicao={...current.oposicao,forca:clamp((current.oposicao?.forca||30)+(op.oposicao||0)*fator*.45)};
      const institucional={...current.institucional,tensaoInstitucional:clamp((current.institucional?.tensaoInstitucional||0)+(op.tensao||0))};
      const congresso={...current.congresso,poder:clamp((current.congresso?.poder||0)+(op.bastidor||0))};
      const govPost={id:`gov_${ev.instanceId}`,autorId:`gov_${ev.uf}`,autor:ev.governador?.nome||`Governador de ${ev.estado}`,handle:`@governo${String(ev.uf).toLowerCase()}`,grupo:'governadores',uf:ev.uf,avatar:`gov-${ev.uf}-${ev.governador?.nome}`,texto:`${ev.governador?.nome||'O governo estadual'} reage à decisão do Planalto: ${op.texto}.`,tema:ev.tema,sentimento:(op.relacao||0)>=0?1:-1,alcance:1200000+ev.gravidade*22000,turno:current.turno};
      const comunidade=gerarPostsComunidade({gruposSociais,turno:current.turno,evento:ev.tema,quantidade:4,respostaA:govPost.id});
      const consequencia=criarConsequenciaFederativa(ev,op,current.turno);
      const posts=[govPost,...comunidade,...(current.redeSocial.posts||[])].slice(0,120);
      return {gruposSociais,economia,stf,estados,oposicao,institucional,congresso,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},redeSocial:{...current.redeSocial,posts,tendencias:calcularTendenciasPulso(posts)},consequenciasPendentes:consequencia?[...(current.consequenciasPendentes||[]),consequencia]:(current.consequenciasPendentes||[]),eventoFederativoAtivo:null,historicoEventosFederativos:[{...ev,status:'respondida',resposta:op.texto,resolvidoNoTurno:current.turno,consequenciaId:consequencia?.id},...(current.historicoEventosFederativos||[])].slice(0,30),eventosRecentes:[`🇧🇷 ${ev.estado}: Planalto responde “${op.texto}” (impacto ×${fator.toFixed(2)}). Desdobramentos seguirão nos próximos meses.`,...current.eventosRecentes].slice(0,18)};
    }); saveGame(get());return {ok:true};
  },

  processarEventosFederativos: () => {
    const state=get();
    const primeiro=!(state.historicoEventosFederativos||[]).length;
    if(state.eventoFederativoAtivo||(!primeiro&&state.turno%2===0))return;
    const ev=primeiro?montarEventoFederativo(eventosFederativosSeed[0],state.estados,state.nomeacoes,state.cargos):sortearEventoFederativo({turno:state.turno,estados:state.estados,historico:state.historicoEventosFederativos,nomeacoes:state.nomeacoes,cargos:state.cargos});
    if(ev)set(s=>({eventoFederativoAtivo:{...ev,criadoNoTurno:s.turno+1},eventosRecentes:[`🚨 Crise federativa em ${ev.estado}: ${ev.titulo}`,...s.eventosRecentes].slice(0,18)}));
  },

  processarTurnoOposicao: () => {
    set(state=>{
      const estrategias=state.oposicao?.estrategias||oposicaoSeed.estrategias;
      let id='pulso';
      if((state.institucional?.tensaoInstitucional||0)>45)id='judicializar';
      else if((state.oposicao?.forca||0)>58)id='cpi';
      else if((state.popularidade?.geral||50)<42)id='ruas';
      else if((state.congresso?.poder||50)<42)id='obstrucao';
      else if(state.eventoFederativoAtivo)id='governadores';
      const estrategia=estrategias.find(e=>e.id===id)||estrategias[0];
      const delta=id==='cpi'||id==='governadores'?2:1;
      const nomePresidente=state.perfilPresidencial?.nomePublico||'o Presidente';
      const promessa=(state.promessasPoliticas||[])[state.turno%Math.max(1,(state.promessasPoliticas||[]).length)];
      const cobranca=promessa&&state.turno>=4?` e cobra a promessa de ${promessa.titulo.toLowerCase()}`:'';
      const texto={obstrucao:`A oposição anuncia obstrução e diz que ${nomePresidente} terá de negociar cada voto${cobranca}.`,judicializar:`A oposição prepara nova frente jurídica contra atos de ${nomePresidente}${cobranca}.`,ruas:`A Frente de Renovação convoca atos e tenta transformar rejeição ao governo de ${nomePresidente} em mobilização${cobranca}.`,pulso:`Caio Valente lança ofensiva no Pulso contra ${nomePresidente}${cobranca}.`,governadores:`A oposição tenta unir governadores insatisfeitos contra ${nomePresidente}${cobranca}.`,cpi:`Líderes oposicionistas recolhem assinaturas e ameaçam abrir nova CPI contra o governo de ${nomePresidente}${cobranca}.`}[id];
      const post={id:`op_${state.turno}_${id}`,autorId:state.oposicao?.lider?.id||'oposicao',autor:state.oposicao?.lider?.nome||'Líder da oposição',handle:'@CaioValente',grupo:'oposicao',uf:state.oposicao?.lider?.uf||'MG',avatar:state.oposicao?.lider?.avatar,texto,tema:'oposicao',sentimento:-1,alcance:2400000+Math.round((state.oposicao?.forca||30)*28000),turno:state.turno};
      return {oposicao:{...state.oposicao,forca:clamp((state.oposicao?.forca||30)+delta),estrategiaAtual:estrategia,historico:[{turno:state.turno,estrategia:id},...(state.oposicao?.historico||[])].slice(0,20)},redeSocial:{...state.redeSocial,posts:[post,...(state.redeSocial.posts||[])].slice(0,100)},eventosRecentes:[`♟️ Oposição: ${estrategia.nome}.`,...state.eventosRecentes].slice(0,18)};
    });
  },

  // =================================================================================
  // FASE 4.5 — ECONOMIA & FAZENDA
  // =================================================================================
  ajustarTributoExecutivo: (tributoId, direcao=1) => {
    const state=get();
    const meta=state.tributosExecutivos.find(t=>t.id===tributoId);
    if(!meta)return {ok:false,motivo:'Instrumento tributário não encontrado.'};
    const politica={...POLITICA_ECONOMICA_INICIAL,...state.politicaEconomica,tributosAlteradosTurno:[...(state.politicaEconomica?.tributosAlteradosTurno||[])]};
    if(politica.tributosAlteradosTurno.includes(tributoId)) return {ok:false,motivo:'Este instrumento já foi alterado neste mês.'};
    if(politica.tributosAlteradosTurno.length>=2) return {ok:false,motivo:'A equipe econômica recomenda no máximo duas alterações tributárias executivas por mês.'};
    const r=aplicarMudancaTributaria(politica,tributoId,meta.step*(direcao>=0?1:-1));
    if(!r.ok)return r;
    const pressao=calcularPressaoTributaria(r.politica.tributos);
    const gruposImpacto=Object.fromEntries(Object.entries(r.subiu?meta.grupoAlta:meta.grupoBaixa).map(([k,v])=>[k,v*.65]));
    set(current=>{
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,gruposImpacto);
      const estados=current.estados.map(e=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      const economia={...current.economia,indiceReceitaTributaria:pressao.indiceReceita,arrastoTributario:pressao.arrastoCrescimento,impulsoInflacaoTributaria:pressao.impulsoInflacao,confiancaMercado:clamp((current.economia.confiancaMercado||50)+(tributoId==='iof'?(r.subiu?1:-1):0))};
      const evento=`Fazenda ${r.subiu?'eleva':'reduz'} ${meta.sigla} para ${r.novo}${meta.unidade==='%'?'%':''}.`;
      const media=gerarRepercussao({evento,turno:current.turno});
      const comunidade=gerarPostsComunidade({gruposSociais,turno:current.turno,evento:meta.sigla,quantidade:3,respostaA:media.id});
      return {
        politicaEconomica:{...r.politica,tributosAlteradosTurno:[...r.politica.tributosAlteradosTurno,tributoId],historico:[{tipo:'tributo',id:tributoId,de:r.atual,para:r.novo,turno:current.turno},...(r.politica.historico||[])].slice(0,40)},
        economia,gruposSociais,estados,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},
        redeSocial:{...current.redeSocial,posts:[media,...comunidade,...(current.redeSocial.posts||[])].slice(0,100)},
        eventosRecentes:[`🧾 ${evento}`,...current.eventosRecentes].slice(0,18)
      };
    });
    saveGame(get());
    return {ok:true,meta,novo:r.novo,pressao};
  },

  enviarReformaTributaria: (leiId) => {
    const lei=get().leisDisponiveis.find(l=>l.id===leiId);
    if(!lei)return {ok:false,motivo:'A reforma ainda não está disponível no banco legislativo.'};
    return get().enviarLeiParaCongresso(leiId);
  },

  executarMedidaEconomica: (medidaId) => {
    const state=get();
    const medida=state.medidasEconomicas.find(m=>m.id===medidaId);
    if(!medida)return {ok:false,motivo:'Medida econômica inexistente.'};
    const ultima=(state.politicaEconomica?.medidasUsadas||[]).find(m=>m.id===medidaId);
    if(ultima && state.turno-ultima.turno < (medida.cooldown||3)) return {ok:false,motivo:`Esta medida ainda está em cooldown por ${Math.max(1,(medida.cooldown||3)-(state.turno-ultima.turno))} mês(es).`};
    if(medida.estatal && !state.estatais.some(e=>e.id===medida.estatal)) return {ok:false,motivo:'A estatal necessária não está sob controle federal.'};
    set(current=>{
      const ministroFazenda=current.nomeacoes.find(n=>n.cargoId==='m_fazenda');
      const eficienciaFazenda=ministroFazenda?clamp(.78+((ministroFazenda.habTecnica||ministroFazenda.habilidadeTecnica||50)/100)*.28+((ministroFazenda.lealdade||60)/100)*.09,.78,1.15):.72;
      let economia=registrarMovimentoFiscal(current.economia,medida.impactoFiscal,medida.tipoFiscal||'custeio');
      Object.entries(medida.economia||{}).forEach(([k,v])=>{
        v=v*eficienciaFazenda;
        if(k==='confiancaMercado')economia.confiancaMercado=clamp((economia.confiancaMercado||50)+v);
        else if(k==='riscoPais')economia.riscoPais=Math.max(80,(economia.riscoPais||250)+v);
        else if(k==='inflacao')economia.inflacao=Math.max(.5,(economia.inflacao||4.5)+v);
        else if(k==='crescimentoPib')economia.crescimentoPib=Number(((economia.crescimentoPib||0)+v).toFixed(2));
        else if(k==='desemprego')economia.desemprego=clamp((economia.desemprego||8.4)+v,3,24);
      });
      if(!ministroFazenda)economia.confiancaMercado=clamp((economia.confiancaMercado||50)-2);
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,Object.fromEntries(Object.entries(medida.grupos||{}).map(([k,v])=>[k,v*eficienciaFazenda])));
      const estados=current.estados.map(e=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      const evento=`Governo anuncia ${medida.nome}.`;
      const media=gerarRepercussao({evento,turno:current.turno});
      const comunidade=gerarPostsComunidade({gruposSociais,turno:current.turno,evento:medida.categoria,quantidade:4,respostaA:media.id});
      const politica={...POLITICA_ECONOMICA_INICIAL,...current.politicaEconomica};
      return {economia,gruposSociais,estados,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},politicaEconomica:{...politica,medidasUsadas:[{id:medidaId,turno:current.turno},...(politica.medidasUsadas||[]).filter(x=>x.id!==medidaId)].slice(0,30),historico:[{tipo:'medida',id:medidaId,turno:current.turno,eficacia:Number(eficienciaFazenda.toFixed(2))},...(politica.historico||[])].slice(0,40)},redeSocial:{...current.redeSocial,posts:[media,...comunidade,...(current.redeSocial.posts||[])].slice(0,100)},oposicao:{...current.oposicao,forca:clamp((current.oposicao.forca||30)+(Math.abs(medida.impactoFiscal)>10000?1:0))},eventosRecentes:[`💼 Fazenda: ${medida.nome}.`,...current.eventosRecentes].slice(0,18)};
    });
    saveGame(get());return {ok:true,medida};
  },

  contratarFinanciamentoEconomico: (financiamentoId) => {
    const state=get(); const oferta=state.financiamentosEconomicos.find(f=>f.id===financiamentoId);
    if(!oferta)return {ok:false,motivo:'Linha de financiamento não encontrada.'};
    const politica={...POLITICA_ECONOMICA_INICIAL,...state.politicaEconomica};
    const anterior=(politica.financiamentos||[]).find(f=>f.id===financiamentoId && state.turno-f.turno<12);
    if(anterior)return {ok:false,motivo:'Esta fonte já foi mobilizada recentemente. Aguarde nova janela financeira.'};
    set(current=>{
      let economia=registrarMovimentoFiscal(current.economia,oferta.valor,oferta.tipoFiscal);
      Object.entries(oferta.economia||{}).forEach(([k,v])=>{
        const creditoSoberano=(current.capacidadesDesbloqueadas||[]).includes('credito_soberano') && financiamentoId!=='mercado_domestico_extra';
        const ajustado=creditoSoberano&&k==='riscoPais'?v*.55:creditoSoberano&&k==='confiancaMercado'?v+1:v;
        if(k==='confiancaMercado')economia.confiancaMercado=clamp((economia.confiancaMercado||50)+ajustado);
        else if(k==='riscoPais')economia.riscoPais=Math.max(80,(economia.riscoPais||250)+ajustado);
        else if(k==='crescimentoPib')economia.crescimentoPib=Number(((economia.crescimentoPib||0)+ajustado).toFixed(2));
      });
      const p={...POLITICA_ECONOMICA_INICIAL,...current.politicaEconomica};
      const shift=oferta.id==='mercado_domestico_extra'?0:1.5;
      const comp={...(p.dividaComposicao||POLITICA_ECONOMICA_INICIAL.dividaComposicao)};
      if(shift){comp.cambial=Number((comp.cambial+shift).toFixed(1));comp.selic=Math.max(0,Number((comp.selic-shift).toFixed(1)));}
      economia.dividaComposicao=comp;
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,oferta.grupos||{});
      const mundo={...current.mundo,softPowerBrasil:clamp((current.mundo.softPowerBrasil||50)+(oferta.mundo?.softPowerBrasil||0))};
      const evento=`Fazenda fecha ${oferta.nome} para financiar investimento de R$ ${(oferta.valor/1000).toFixed(1)} bi.`;
      const media=gerarRepercussao({evento,turno:current.turno});
      const comunidade=gerarPostsComunidade({gruposSociais,turno:current.turno,evento:'financiamento',quantidade:3,respostaA:media.id});
      return {economia,mundo,gruposSociais,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},politicaEconomica:{...p,dividaComposicao:comp,financiamentos:[{...oferta,turno:current.turno,status:'contratado'},...(p.financiamentos||[])].slice(0,20),historico:[{tipo:'financiamento',id:oferta.id,turno:current.turno},...(p.historico||[])].slice(0,40)},redeSocial:{...current.redeSocial,posts:[media,...comunidade,...(current.redeSocial.posts||[])].slice(0,100)},eventosRecentes:[`🏦 ${evento}`,...current.eventosRecentes].slice(0,18)};
    });
    saveGame(get());return {ok:true,oferta};
  },

  definirEstrategiaDivida: (estrategiaId) => {
    const state=get(); const est=state.estrategiasDivida.find(e=>e.id===estrategiaId);
    if(!est)return {ok:false,motivo:'Estratégia de dívida não encontrada.'};
    if(state.politicaEconomica?.estrategiaAlteradaTurno===state.turno)return {ok:false,motivo:'A estratégia de dívida já foi alterada neste mês.'};
    set(current=>{
      const politica={...POLITICA_ECONOMICA_INICIAL,...current.politicaEconomica,estrategiaDivida:est.id,dividaComposicao:{...est.composicao},prazoMedioDivida:est.prazo,riscoRolagem:est.riscoRolagem,estrategiaAlteradaTurno:current.turno,historico:[{tipo:'divida',id:est.id,turno:current.turno},...(current.politicaEconomica?.historico||[])].slice(0,40)};
      const economia={...current.economia,dividaComposicao:{...est.composicao},prazoMedioDivida:est.prazo,riscoRolagem:est.riscoRolagem,confiancaMercado:clamp((current.economia.confiancaMercado||50)+(est.confianca||0))};
      economia.custoMedioDivida=custoMedioDivida({economia,composicao:est.composicao});
      return {politicaEconomica:politica,economia,eventosRecentes:[`📊 Tesouro adota estratégia: ${est.nome}.`,...current.eventosRecentes].slice(0,18)};
    });
    saveGame(get());return {ok:true,estrategia:est};
  },

  // =================================================================================
  // FASE 4.2.1 — FEDERAÇÃO, PULSO, AGENDA E PROJETOS ESTRATÉGICOS
  // =================================================================================
  publicarNaRede: (texto, respostaA = null) => {
    const limpo = String(texto || '').trim().slice(0, 420);
    if (limpo.length < 3) return { ok:false, motivo:'Escreva uma mensagem antes de publicar.' };
    const state=get();
    const alvo=(state.redeSocial?.posts||[]).find(p=>p.id===respostaA);
    const efeitoBase=impactoPost({texto:limpo,popularidade:state.popularidade.geral,resposta:!!respostaA});
    const bonusPulso=(state.capacidadesDesbloqueadas||[]).includes('presidencia_popular')?1.15:1;
    const bonusDireto=alvo?.grupo&&state.gruposSociais?.[alvo.grupo]?1.18:1;
    const efeito={...efeitoBase,alcance:Math.round(efeitoBase.alcance*bonusPulso*bonusDireto),grupos:{...efeitoBase.grupos}};
    if(alvo?.grupo&&state.gruposSociais?.[alvo.grupo]) efeito.grupos[alvo.grupo]=(efeito.grupos[alvo.grupo]||0)+1.2;
    if(alvo?.grupo==='oposicao'&&efeito.analise.tom>70){efeito.grupos.universitarios=(efeito.grupos.universitarios||0)-.5;efeito.grupos.mercado=(efeito.grupos.mercado||0)-.4;}
    const perfil=state.perfilPresidencial||{};
    const post={id:`pres_${state.turno}_${Date.now()}`,autorId:'presidente',autor:perfil.nomePublico||'Presidente da República',handle:perfil.handle||'@Presidencia',texto:limpo,tema:efeito.analise.temas[0],alcance:efeito.alcance,turno:state.turno,respostaA,curtidas:Math.round(efeito.alcance*.045),reposts:Math.round(efeito.alcance*.009),comentarios:Math.round(efeito.alcance*.006)};
    set(current=>{
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,efeito.grupos);
      const geral=aprovacaoNacional(gruposSociais);
      const estados=current.estados.map(e=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      const comunidade=gerarPostsComunidade({gruposSociais,turno:current.turno,evento:efeito.analise.temas[0],quantidade:3,respostaA:post.id});
      const repercussao=efeito.alcance>4200000?gerarRepercussao({evento:`${perfil.nomePublico||'Presidente'} publica no Pulso: ${limpo.slice(0,110)}`,turno:current.turno}):null;
      const posts=[post,...comunidade,...(repercussao?[repercussao]:[]),...(current.redeSocial.posts||[])].slice(0,120);
      const seguidores=Math.max(0,(current.redeSocial.seguidores||0)+Math.round(efeito.alcance*(efeito.analise.tom>78?-0.004:0.002)));
      const reputacaoDigital=clamp((current.redeSocial.reputacaoDigital||50)+(alvo?.grupo?1.2:.3)+(efeito.analise.tom>82?-1:0));
      return {
        gruposSociais, estados,
        popularidade:{...current.popularidade,geral:clamp(geral)},
        redeSocial:{...current.redeSocial,posts,historicoPresidencial:[post,...(current.redeSocial.historicoPresidencial||[])].slice(0,40),seguidores,reputacaoDigital,tendencias:calcularTendenciasPulso(posts),notificacoes:[{id:`not_${post.id}`,tipo:'pulso',texto:`Sua publicação gerou ${Math.round(post.comentarios/1000)} mil comentários.`},...(current.redeSocial.notificacoes||[])].slice(0,20)},
        eventosRecentes:[`📱 Pulso: publicação presidencial alcançou ${(efeito.alcance/1000000).toFixed(1)} mi de contas.`,...current.eventosRecentes].slice(0,18),
      };
    });
    saveGame(get());
    return {ok:true,post,efeito};
  },

  interagirPulso: (postId, acao='repost') => {
    const state=get(); const post=(state.redeSocial?.posts||[]).find(p=>p.id===postId);
    if(!post||post.autorId==='presidente')return {ok:false,motivo:'Publicação indisponível para esta ação.'};
    if((state.redeSocial?.interacoesPresidenciais||[]).some(i=>i.postId===postId&&i.acao===acao))return {ok:false,motivo:'Você já realizou esta interação.'};
    const perfil=state.perfilPresidencial||{};
    set(current=>{
      let gruposSociais={...current.gruposSociais};
      let oposicao={...current.oposicao};
      const interacao={id:`int_${Date.now()}`,postId,acao,turno:current.turno};
      const origemGrupo=post.grupo;
      if(origemGrupo&&current.gruposSociais?.[origemGrupo]) gruposSociais=aplicarImpactoGrupos(gruposSociais,{[origemGrupo]:acao==='repost'?1.4:.6});
      if(post.grupo==='oposicao'){oposicao={...oposicao,forca:clamp((oposicao.forca||30)+(acao==='repost'?-1:.5))};}
      const prefix=acao==='repost'?'🔁':'♥';
      const texto=acao==='repost'?`${prefix} ${perfil.nomePublico||'Presidente'} repercutiu: “${String(post.texto).slice(0,180)}”`:`${prefix} A Presidência curtiu uma publicação de ${post.autor||post.handle||'um usuário'}.`;
      const repost=acao==='repost'?{id:`repost_${current.turno}_${Date.now()}`,autorId:'presidente',autor:perfil.nomePublico||'Presidente',handle:perfil.handle||'@Presidencia',texto,tema:post.tema||'governo',alcance:Math.round((post.alcance||900000)*.72),turno:current.turno,respostaA:post.id,tipo:'repost'}:null;
      const posts=repost?[repost,...(current.redeSocial.posts||[])]:current.redeSocial.posts;
      return {gruposSociais,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},oposicao,redeSocial:{...current.redeSocial,posts,tendencias:calcularTendenciasPulso(posts),interacoesPresidenciais:[interacao,...(current.redeSocial.interacoesPresidenciais||[])].slice(0,50)}};
    }); saveGame(get()); return {ok:true};
  },

  investirEstado: (uf, tipo='infraestrutura') => {
    const custos={infraestrutura:900,saude:520,educacao:480,seguranca:420,tecnologia:650};
    const custo=custos[tipo]||500;
    const impactos={
      // Nenhum investimento agrada a todos: cada escolha desloca a coalizão social.
      infraestrutura:{periferia:2,agro:2,mercado:1,universitarios:-0.5},
      saude:{periferia:3,evangelicos:1,mercado:-1},
      educacao:{universitarios:3,sindicalistas:1,periferia:1,mercado:-1},
      seguranca:{militares:2,evangelicos:2,periferia:1,universitarios:-1.5},
      tecnologia:{universitarios:3,mercado:2,agro:-0.75,sindicalistas:-0.5},
    }[tipo]||{};
    let achou=false;
    set(state=>{
      let economia=registrarMovimentoFiscal(state.economia,custo,['infraestrutura','tecnologia'].includes(tipo)?'infraestrutura':['saude','educacao'].includes(tipo)?'humano':'custeio');
      let gruposSociais=aplicarImpactoGrupos(state.gruposSociais,Object.fromEntries(Object.entries(impactos).map(([k,v])=>[k,v*0.25])));
      const estados=state.estados.map(e=>{
        if(e.uf!==uf)return {...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)};
        achou=true;
        const inv={id:`${uf}_${tipo}_${Date.now()}`,tipo,custo,turno:state.turno,aprovacao:2};
        const atualizado={...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+5),investimentos:[inv,...(e.investimentos||[])].slice(0,12)};
        return {...atualizado,aprovacao:calcularAprovacaoEstado(atualizado,gruposSociais)};
      });
      return {economia,gruposSociais,estados,congresso:{...state.congresso,poder:clamp((state.congresso?.poder||0)+2)},eventosRecentes:achou?[`🏗️ Investimento federal em ${uf}: ${tipo} · impacto fiscal R$ ${custo} mi.`,...state.eventosRecentes].slice(0,18):state.eventosRecentes};
    });
    if(achou)saveGame(get());
    return {ok:achou,custo};
  },

  conversarGovernador: (uf, estrategia='pacto') => {
    const delta={pacto:7,pressionar:-5,prestigiar:10}[estrategia]??5;
    let governador=null;
    set(state=>({
      estados:state.estados.map(e=>{if(e.uf!==uf)return e;governador=e.governador;return {...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+delta),governador:{...e.governador,relacao:clamp((e.governador.relacao||50)+delta)}}}),
      capitalPolitico:clamp(state.capitalPolitico+(estrategia==='pacto'?-2:estrategia==='pressionar'?1:-3)),
      congresso:{...state.congresso,poder:clamp((state.congresso?.poder||0)+(estrategia==='pacto'?3:estrategia==='prestigiar'?2:-1))},
      eventosRecentes:governador?[`🤝 Relação federativa: ${estrategia} com ${governador.nome}.`,...state.eventosRecentes].slice(0,18):state.eventosRecentes,
    }));
    saveGame(get()); return {ok:!!governador};
  },

  iniciarProjetoEspecial: (projetoId, uf=null) => {
    const state=get(); const base=state.catalogoProjetosEspeciais.find(p=>p.id===projetoId);
    if(!base)return {ok:false,motivo:'Projeto não encontrado.'};
    if(state.projetosEspeciais.some(p=>p.id===projetoId&&p.status==='ativo'))return {ok:false,motivo:'Este projeto já está em andamento.'};
    const faltantes=base.ministerios.filter(id=>!state.nomeacoes.some(n=>n.cargoId===id));
    if(faltantes.length>1)return {ok:false,motivo:'Faltam ministros essenciais para liderar este projeto.'};
    const destino=uf||base.estadoSugerido;
    const novo={...base,estado:destino,status:'ativo',progresso:0,mesesRestantes:base.duracao,iniciadoNoTurno:state.turno};
    const parceiros={nuclear_2040:['fr','ru','us'],terras_raras:['us','cn','jp','de'],semicondutores:['us','jp','kr','de'],bio_vacinas:['in','za','de'],ia_brasil:['us','gb','cn'],ferrovia_integracao:['cn','ae','de'],espacial:['us','fr','in'],amazonia_sat:['de','no','fr']}[base.id]||[];
    set(current=>{let geopolitica={...current.geopolitica};parceiros.forEach(pid=>{geopolitica=abrirJanela(geopolitica,pid,current.turno,3)});return {projetosEspeciais:[novo,...current.projetosEspeciais],geopolitica,economia:registrarMovimentoFiscal(current.economia,Math.round(base.custoMensal*.7),'infraestrutura'),eventosRecentes:[`🧭 Projeto especial lançado: ${base.titulo} em ${destino}. Itamaraty abriu ${parceiros.length} canal(is) estratégico(s).`,...current.eventosRecentes].slice(0,18)}});
    saveGame(get());return {ok:true,projeto:novo};
  },

  processarProjetosEspeciais: () => {
    set(state=>{
      let economia={...state.economia};let mundo={...state.mundo};let gruposSociais={...state.gruposSociais};let eventosRecentes=[...state.eventosRecentes];
      let estados=state.estados.map(e=>({...e}));
      const projetosEspeciais=state.projetosEspeciais.map(p=>{
        if(p.status!=='ativo')return p;
        economia=registrarMovimentoFiscal(economia,p.custoMensal,'infraestrutura');
        const incremento=Math.max(3,Math.round(100/p.duracao));const progresso=Math.min(100,(p.progresso||0)+incremento);const mesesRestantes=Math.max(0,(p.mesesRestantes||1)-1);
        estados=estados.map(e=>e.uf===p.estado?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+0.5),aprovacao:clamp((e.aprovacao||50)+0.35)}:e);
        if(progresso>=100||mesesRestantes===0){
          economia.crescimentoPib=Number(((economia.crescimentoPib||0)+(p.impacto?.pib||0)).toFixed(2));
          mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+(p.impacto?.softPower||0));
          const coalizoesProjeto={
            nuclear_2040:{militares:3,mercado:2,universitarios:-1,periferia:1},
            terras_raras:{mercado:3,agro:1,universitarios:-2,periferia:1},
            semicondutores:{mercado:2,universitarios:3,sindicalistas:1,agro:-1},
            bio_vacinas:{periferia:3,universitarios:2,evangelicos:-1,mercado:-1},
            ia_brasil:{universitarios:3,mercado:2,sindicalistas:-1,evangelicos:-0.5},
            ferrovia_integracao:{agro:3,periferia:2,mercado:2,universitarios:-1},
            espacial:{militares:3,universitarios:2,mercado:1,periferia:-0.5},
            amazonia_sat:{militares:2,universitarios:3,agro:-2,mercado:-0.5},
          };
          gruposSociais=aplicarImpactoGrupos(gruposSociais,coalizoesProjeto[p.id]||{mercado:2,universitarios:2,periferia:1,agro:-1});
          eventosRecentes=[`🚀 Projeto especial concluído: ${p.titulo}.`,...eventosRecentes];
          return {...p,status:'concluido',progresso:100,mesesRestantes:0};
        }
        return {...p,progresso,mesesRestantes};
      });
      return {economia,mundo,gruposSociais,estados,projetosEspeciais,eventosRecentes:eventosRecentes.slice(0,18)};
    });
  },

  aceitarConviteAgenda: (conviteId) => {
    const state=get();
    const convite=(state.agendaCalendario?.convites||[]).find(c=>c.id===conviteId&&c.status==='pendente');
    if(!convite)return {ok:false,motivo:'Convite não está mais disponível.'};
    const compromisso={...convite,id:`comp_${convite.id}`,status:'confirmado',turno:convite.turnoProposto,confirmadoNoTurno:state.turno};
    set(current=>({
      agendaCalendario:{
        ...(current.agendaCalendario||{}),
        convites:(current.agendaCalendario?.convites||[]).map(c=>c.id===conviteId?{...c,status:'aceito',respondidoNoTurno:current.turno}:c),
        compromissos:[compromisso,...(current.agendaCalendario?.compromissos||[])].slice(0,80),
      },
      geopolitica: convite.tipo==='internacional' ? {...current.geopolitica,visitasEstado:(current.geopolitica.visitasEstado||[]).map(v=>v.paisId===convite.paisId&&['agendada','preparada'].includes(v.status)?{...v,status:'confirmada',turnoAgendado:convite.turnoProposto,diaAgendado:convite.dia,dataAgendada:convite.dataISO}:v)} : current.geopolitica,
      eventosRecentes:[`📅 Compromisso confirmado: ${convite.titulo} · ${convite.dataISO}.`,...current.eventosRecentes].slice(0,18),
    }));
    saveGame(get()); return {ok:true,compromisso};
  },

  recusarConviteAgenda: (conviteId) => {
    const state=get(); const convite=(state.agendaCalendario?.convites||[]).find(c=>c.id===conviteId&&c.status==='pendente');
    if(!convite)return {ok:false,motivo:'Convite não está mais disponível.'};
    set(current=>{
      let paises=current.paises; let estados=current.estados; let economia=current.economia; let oposicao=current.oposicao; let redeSocial=current.redeSocial; let mundo=current.mundo;
      if(convite.tipo==='internacional'){
        paises=current.paises.map(p=>p.id===convite.paisId?{...p,relacao:clamp((p.relacao||50)-2)}:p);
        mundo={...current.mundo,softPowerBrasil:clamp((current.mundo.softPowerBrasil||50)-1)};
      }
      if(convite.tipo==='governador'){
        estados=current.estados.map(e=>e.uf===convite.uf?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)-5),governador:{...e.governador,relacao:clamp((e.governador?.relacao||50)-5)}}:e);
        oposicao={...current.oposicao,forca:clamp((current.oposicao?.forca||30)+2)};
      }
      if(convite.tipo==='midia'){
        redeSocial={...current.redeSocial,reputacaoDigital:clamp((current.redeSocial?.reputacaoDigital||50)-1),posts:[{id:`agenda_recusa_${Date.now()}`,autorId:convite.midiaId||'n1',autor:convite.origem,texto:`${convite.origem}: Planalto recusou convite para ${convite.formato||'entrevista presidencial'}.`,tema:'governo',alcance:2600000,turno:current.turno},...(current.redeSocial?.posts||[])].slice(0,120)};
        oposicao={...oposicao,forca:clamp((oposicao?.forca||30)+1)};
      }
      if(convite.tipo==='empresa') economia={...current.economia,confiancaMercado:clamp((current.economia?.confiancaMercado||50)-.5)};
      return {paises,estados,economia,oposicao,redeSocial,mundo,agendaCalendario:{...(current.agendaCalendario||{}),convites:(current.agendaCalendario?.convites||[]).map(c=>c.id===conviteId?{...c,status:'recusado',respondidoNoTurno:current.turno}:c),historico:[{...convite,status:'recusado',turno:current.turno},...(current.agendaCalendario?.historico||[])].slice(0,80)},eventosRecentes:[`❌ Convite recusado: ${convite.titulo}.`,...current.eventosRecentes].slice(0,18)};
    });
    saveGame(get()); return {ok:true};
  },

  remarcarCompromissoAgenda: (compromissoId, deslocamento=1) => {
    const state=get(); const c=(state.agendaCalendario?.compromissos||[]).find(x=>x.id===compromissoId&&x.status==='confirmado');
    if(!c)return {ok:false,motivo:'Compromisso não encontrado.'};
    if(!c.flexivel)return {ok:false,motivo:'Esta data é protocolar ou internacionalmente bloqueada e não pode ser remarcada livremente.'};
    const novoTurno=Math.max(state.turno,c.turno+Math.sign(deslocamento||1));
    if(novoTurno===c.turno)return {ok:false,motivo:'Escolha outro mês.'};
    const novaData=dataDoTurno(DATA_INICIO,novoTurno,c.dia||12);
    const custo=c.remarcacoes?2:1;
    if(state.capitalPolitico<custo)return {ok:false,motivo:`São necessários ${custo} pontos de capital político para remarcar.`};
    set(current=>({
      capitalPolitico:current.capitalPolitico-custo,
      agendaCalendario:{...(current.agendaCalendario||{}),compromissos:(current.agendaCalendario?.compromissos||[]).map(x=>x.id===compromissoId?{...x,turno:novoTurno,dataISO:isoData(novaData),remarcacoes:(x.remarcacoes||0)+1}:x)},
      geopolitica:c.tipo==='internacional'?{...current.geopolitica,visitasEstado:(current.geopolitica.visitasEstado||[]).map(v=>v.paisId===c.paisId&&v.status==='confirmada'?{...v,turnoAgendado:novoTurno,diaAgendado:c.dia||12}:v)}:current.geopolitica,
      eventosRecentes:[`🗓️ ${c.titulo} remarcado para ${isoData(novaData)}.`,...current.eventosRecentes].slice(0,18),
    }));
    saveGame(get()); return {ok:true,turno:novoTurno};
  },

  cancelarCompromissoAgenda: (compromissoId) => {
    const state=get(); const c=(state.agendaCalendario?.compromissos||[]).find(x=>x.id===compromissoId&&x.status==='confirmado');
    if(!c)return {ok:false,motivo:'Compromisso não encontrado.'};
    if(!c.flexivel)return {ok:false,motivo:'Compromisso protocolar: só pode ser perdido, não cancelado pela agenda comum.'};
    set(current=>({
      capitalPolitico:Math.max(0,current.capitalPolitico-2),
      paises:c.tipo==='internacional'?current.paises.map(p=>p.id===c.paisId?{...p,relacao:clamp((p.relacao||50)-4)}:p):current.paises,
      estados:c.tipo==='governador'?current.estados.map(e=>e.uf===c.uf?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)-6)}:e):current.estados,
      oposicao:{...current.oposicao,forca:clamp((current.oposicao?.forca||30)+(c.prioridade==='urgente'?3:1))},
      agendaCalendario:{...(current.agendaCalendario||{}),compromissos:(current.agendaCalendario?.compromissos||[]).map(x=>x.id===compromissoId?{...x,status:'cancelado',canceladoNoTurno:current.turno}:x),historico:[{...c,status:'cancelado',turno:current.turno},...(current.agendaCalendario?.historico||[])].slice(0,80)},
      eventosRecentes:[`🚫 Compromisso cancelado: ${c.titulo}.`,...current.eventosRecentes].slice(0,18),
    }));
    saveGame(get()); return {ok:true};
  },

  gerarConvitesAgendaMensal: () => {
    const state=get(); const agenda=state.agendaCalendario||criarAgendaCalendarioInicial(DATA_INICIO); const existentes=new Set([...(agenda.convites||[]),...(agenda.compromissos||[])].map(x=>x.id)); const novos=[];
    const conviteMidia=gerarConviteMidia({turno:state.turno,popularidade:state.popularidade.geral});
    const midia=criarConviteMidiaCalendario({convite:conviteMidia,turnoAtual:state.turno,dataInicio:DATA_INICIO}); if(midia&&!existentes.has(midia.id))novos.push(midia);
    const gov=criarConviteGovernadorCalendario({evento:state.eventoFederativoAtivo,turnoAtual:state.turno,dataInicio:DATA_INICIO}); if(gov&&!existentes.has(gov.id))novos.push(gov);
    if(state.turno%3===0){
      const empresa=(state.empresasPrivadas||[]).filter(e=>e.status!=='parceira')[(state.turno*5)%Math.max(1,(state.empresasPrivadas||[]).filter(e=>e.status!=='parceira').length)];
      const emp=criarConviteEmpresarialCalendario({turnoAtual:state.turno,dataInicio:DATA_INICIO,empresa}); if(emp&&!existentes.has(emp.id))novos.push(emp);
    }
    if(novos.length)set(current=>({agendaCalendario:{...(current.agendaCalendario||{}),convites:[...novos,...(current.agendaCalendario?.convites||[])].slice(0,80)},eventosRecentes:[`📨 Agenda Presidencial recebeu ${novos.length} novo(s) convite(s).`,...current.eventosRecentes].slice(0,18)}));
    return novos;
  },

  processarAgendaCalendario: () => {
    const state=get(); const turno=state.turno; const agenda=state.agendaCalendario||{}; const devidos=compromissosNoTurno(agenda,turno); const expirados=(agenda.convites||[]).filter(c=>c.status==='pendente'&&(c.prazoTurno??999)<=turno);
    const internacionais=devidos.filter(c=>c.tipo==='internacional'&&c.paisId);
    set(current=>{
      let economia={...current.economia}; let congresso={...current.congresso}; let gruposSociais={...current.gruposSociais}; let estados=current.estados.map(e=>({...e})); let mundo={...current.mundo}; let oposicao={...current.oposicao}; let redeSocial={...current.redeSocial,posts:[...(current.redeSocial?.posts||[])]}; let capitalPolitico=current.capitalPolitico; const eventos=[];
      devidos.forEach(c=>{
        if(c.tipo==='institucional'){congresso.poder=clamp((congresso.poder||0)+2);capitalPolitico=clamp(capitalPolitico+1);}
        if(c.id==='agenda_expoagro'){gruposSociais=aplicarImpactoGrupos(gruposSociais,{agro:2,mercado:1,periferia:.3});economia.crescimentoPib=Number(((economia.crescimentoPib||0)+.02).toFixed(2));}
        if(c.tipo==='governador'){estados=estados.map(e=>e.uf===c.uf?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+7),aprovacao:clamp((e.aprovacao||50)+1.5)}:e);economia=registrarMovimentoFiscal(economia,140,'custeio');}
        if(c.tipo==='midia'){redeSocial.seguidores=(redeSocial.seguidores||0)+220000;redeSocial.reputacaoDigital=clamp((redeSocial.reputacaoDigital||50)+1.2);}
        if(c.tipo==='empresa'){economia.confiancaMercado=clamp((economia.confiancaMercado||50)+1.2);}
        if(c.tipo==='internacional'&&!c.paisId){mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)+2);}
        eventos.push(`📍 Compromisso cumprido: ${c.titulo}.`);
      });
      expirados.forEach(c=>{if(c.tipo==='midia'){redeSocial.reputacaoDigital=clamp((redeSocial.reputacaoDigital||50)-1);oposicao.forca=clamp((oposicao.forca||30)+1);}if(c.tipo==='governador'){estados=estados.map(e=>e.uf===c.uf?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)-4)}:e);oposicao.forca=clamp((oposicao.forca||30)+1);}if(c.tipo==='internacional')mundo.softPowerBrasil=clamp((mundo.softPowerBrasil||50)-1);eventos.push(`⌛ Convite expirou: ${c.titulo}.`);});
      const popularidade={...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))};
      return {economia,congresso,gruposSociais,estados,mundo,oposicao,redeSocial,capitalPolitico,popularidade,agendaCalendario:{...agenda,compromissos:(agenda.compromissos||[]).map(c=>devidos.some(d=>d.id===c.id)?{...c,status:'realizado',realizadoNoTurno:turno}:c),convites:(agenda.convites||[]).map(c=>expirados.some(e=>e.id===c.id)?{...c,status:'expirado',expirouNoTurno:turno}:c),historico:[...devidos.map(c=>({...c,status:'realizado',turno})),...expirados.map(c=>({...c,status:'expirado',turno})),...(agenda.historico||[])].slice(0,100)},eventosRecentes:[...eventos,...current.eventosRecentes].slice(0,24)};
    });
    internacionais.forEach(c=>get().executarVisitaPresidencial(c.paisId));
    return {realizados:devidos.length,expirados:expirados.length};
  },

  aceitarConviteMidia: (resposta='') => {
    const state=get();
    const convite=state.agendaMensal?.conviteMidia;
    if(!convite) return {ok:false,motivo:'Não há convite de mídia em aberto.'};
    const texto=String(resposta||'').trim();
    const analise=impactoPost({texto:texto||convite.pergunta,popularidade:state.popularidade.geral,resposta:true});
    set(current=>{
      const gruposSociais=aplicarImpactoGrupos(current.gruposSociais,analise.grupos);
      const estados=current.estados.map(e=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      const post={id:`entrevista_${current.turno}_${Date.now()}`,autorId:convite.midiaId,texto:`${convite.formato}: ${texto||'O Presidente compareceu e defendeu a agenda do governo.'}`,tema:analise.analise.temas[0],alcance:Math.round(analise.alcance*1.45),turno:current.turno};
      return {
        gruposSociais,estados,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},
        redeSocial:{...current.redeSocial,posts:[post,...(current.redeSocial.posts||[])].slice(0,80),seguidores:(current.redeSocial.seguidores||0)+Math.round(post.alcance*.008)},
        agendaMensal:{...(current.agendaMensal||{}),conviteMidia:null},
        eventosRecentes:[`🎙️ ${convite.midia}: participação presidencial em ${convite.formato}.`,...current.eventosRecentes].slice(0,18),
      };
    });
    saveGame(get());return {ok:true};
  },

  recusarConviteMidia: () => {
    const convite=get().agendaMensal?.conviteMidia;
    if(!convite)return {ok:false};
    set(state=>({agendaMensal:{...(state.agendaMensal||{}),conviteMidia:null},redeSocial:{...state.redeSocial,posts:[{id:`recusa_${state.turno}_${Date.now()}`,autorId:convite.midiaId,texto:`${convite.midia}: Planalto recusou convite para ${convite.formato}.`,tema:'governo',sentimento:-1,turno:state.turno},...(state.redeSocial.posts||[])].slice(0,80)},eventosRecentes:[`📺 Convite de ${convite.midia} recusado.`,...state.eventosRecentes].slice(0,18)}));
    saveGame(get());return {ok:true};
  },

  definirAgendaMensal: (selecionados=[]) => {
    const ids=selecionados.slice(0,4);
    set(state=>{
      const novas=criarConsequenciasAgenda(ids,state.turno).filter(n=>!(state.consequenciasPendentes||[]).some(c=>c.id===n.id));
      return {agendaMensal:{...(state.agendaMensal||{}),selecionados:ids,historico:[{turno:state.turno,selecionados:ids},...(state.agendaMensal?.historico||[])].slice(0,24)},consequenciasPendentes:[...(state.consequenciasPendentes||[]),...novas]};
    }); return {ok:true};
  },

  processarConsequenciasPendentes: () => {
    set(state=>{
      const turnoExecucao=state.turno+1;
      const vencidas=(state.consequenciasPendentes||[]).filter(c=>c.status==='pendente'&&c.turnoAlvo<=turnoExecucao);
      if(!vencidas.length)return {};
      let economia={...state.economia}; let institucional={...state.institucional}; let oposicao={...state.oposicao}; let congresso={...state.congresso}; let gruposSociais={...state.gruposSociais}; let eventosRecentes=[...state.eventosRecentes]; let redeSocial={...state.redeSocial,posts:[...(state.redeSocial?.posts||[])]};
      const resolvidas=[];
      vencidas.forEach(c=>{
        const e=c.efeitos||{};
        if(e.fiscal) economia=registrarMovimentoFiscal(economia,e.fiscal,e.tipoFiscal||'custeio');
        if(e.crescimento) economia.crescimentoPib=Number(((economia.crescimentoPib||0)+e.crescimento).toFixed(2));
        if(e.riscoJuridico) institucional.riscoJuridico=clamp((institucional.riscoJuridico||0)+e.riscoJuridico);
        if(e.oposicao) oposicao.forca=clamp((oposicao.forca||30)+e.oposicao);
        if(e.congresso) congresso.poder=clamp((congresso.poder||0)+e.congresso);
        if(e.grupos) gruposSociais=aplicarImpactoGrupos(gruposSociais,e.grupos);
        const noticia=gerarRepercussao({evento:`Desdobramento de decisão presidencial: ${c.titulo}`,turno:turnoExecucao});
        redeSocial.posts=[noticia,...gerarPostsComunidade({gruposSociais,turno:turnoExecucao,evento:c.origem==='federacao'?'federalismo':'governo',quantidade:2,respostaA:noticia.id}),...redeSocial.posts].slice(0,120);
        eventosRecentes=[`⏳ Consequência amadureceu: ${c.titulo}.`,...eventosRecentes];
        resolvidas.push({...c,status:'resolvida',resolvidoNoTurno:turnoExecucao});
      });
      const pendentes=(state.consequenciasPendentes||[]).filter(c=>!vencidas.some(v=>v.id===c.id));
      return {economia,institucional,oposicao,congresso,gruposSociais,popularidade:{...state.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))},redeSocial:{...redeSocial,tendencias:calcularTendenciasPulso(redeSocial.posts)},consequenciasPendentes:pendentes,historicoConsequencias:[...resolvidas,...(state.historicoConsequencias||[])].slice(0,50),eventosRecentes:eventosRecentes.slice(0,18)};
    });
  },

  ajustarTarifaComercial: (setor, delta) => {
    const r=ajustarTarifaSetorial(get().comercioExterior,setor,delta); if(!r.ok)return r;
    set(state=>{let economia={...state.economia};economia.inflacao=Math.max(.5,economia.inflacao+(delta>0 ? .05 : -.04));economia.confiancaMercado=clamp(economia.confiancaMercado+(delta>0?-1:.5));return {comercioExterior:r.comercio,economia,eventosRecentes:[`🚢 Tarifa de ${r.item.nome} ajustada para ${r.item.tarifa}%.`,...state.eventosRecentes].slice(0,18)}});saveGame(get());return r;
  },

  estimularExportacao: (setorId) => {
    const s=get(); const setor=s.comercioExterior?.exportacoesPorSetor?.[setorId]; if(!setor)return {ok:false,motivo:'Setor exportador inexistente.'};
    if(s.capitalPolitico<1)return {ok:false,motivo:'Capital político insuficiente.'};
    set(state=>{const comercio=JSON.parse(JSON.stringify(state.comercioExterior));comercio.exportacoesPorSetor[setorId].potencial=clamp((comercio.exportacoesPorSetor[setorId].potencial||50)+5);comercio.politica={...(comercio.politica||{}),creditoExportador:(comercio.politica?.creditoExportador||0)+1};return {comercioExterior:comercio,economia:registrarMovimentoFiscal(state.economia,180,'garantia'),capitalPolitico:state.capitalPolitico-1,eventosRecentes:[`📦 Crédito à exportação reforçado em ${setor.nome}.`,...state.eventosRecentes].slice(0,18)}});saveGame(get());return {ok:true,setor};
  },

  aceitarOportunidadeComercial: (id) => {
    const s=get(); const op=(s.comercioExterior?.oportunidades||[]).find(o=>o.id===id); if(!op)return {ok:false,motivo:'Oportunidade não encontrada.'};
    if(s.capitalPolitico<1)return {ok:false,motivo:'Capital político insuficiente para fechar o acordo.'};
    set(state=>{const comercio=JSON.parse(JSON.stringify(state.comercioExterior));comercio.oportunidades=(comercio.oportunidades||[]).filter(o=>o.id!==id);comercio.acordos=[{id:`ac_${id}_${state.turno}`,origemId:id,paisId:op.paisId,titulo:op.titulo,setor:op.setor,valor:op.valor,turno:state.turno},...(comercio.acordos||[])].slice(0,30);if(op.tipo==='exportacao'&&comercio.exportacoesPorSetor[op.setor])comercio.exportacoesPorSetor[op.setor].valor+=Math.round(op.valor*.25);return {comercioExterior:comercio,capitalPolitico:state.capitalPolitico-1,paises:state.paises.map(p=>p.id===op.paisId?{...p,relacao:clamp(p.relacao+3)}:p),eventosRecentes:[`🤝 Acordo comercial: ${op.titulo}.`,...state.eventosRecentes].slice(0,18)}});saveGame(get());return {ok:true};
  },

  obterVicePoolEleitoral: () => prepararVicePool({
    eleicao:get().eleicao,
    nomeacoes:get().nomeacoes,
    atoresCongresso:get().atoresCongresso,
    estados:get().estados,
  }),

  negociarConvencao: (caciqueId,ofertaId) => {
    const r=aplicarOfertaConvencao(get().eleicao,caciqueId,ofertaId);
    if(!r.ok)return r;
    set(state=>({
      eleicao:r.eleicao,
      capitalPolitico:Math.max(0,state.capitalPolitico-(r.offer?.risco||0)*.25),
      eventosRecentes:[`🗳️ Convenção: ${r.cacique.nome} ${r.accepted?'aceitou':'resistiu à'} proposta “${r.offer.nome}”.`,...state.eventosRecentes].slice(0,18),
    }));
    saveGame(get()); return r;
  },

  oficializarConvencao: () => {
    const state=get(); const data=new Date(state.dataAtual).toISOString().slice(0,10);
    if(data<'2026-07-20'||data>'2026-08-05')return {ok:false,motivo:'A candidatura só pode ser oficializada durante a janela de convenções (20/07 a 05/08).'};
    const r=finalizarConvencao(state.eleicao); if(!r.ok)return r;
    set(state=>({eleicao:r.eleicao,eventosRecentes:[`🏛️ Convenção: ${state.perfilPresidencial.nomePublico} é oficializado candidato à Presidência.`,...state.eventosRecentes].slice(0,18)}));
    saveGame(get()); return r;
  },

  trocarPartidoEleitoral: (partidoId) => {
    const state=get(); const r=mudarFiliacaoEleitoral(state.eleicao,partidoId,state.dataAtual); if(!r.ok)return r;
    const antigo=state.eleicao.partidoAtual; const p=getParty(partidoId);
    const partidos=state.partidos.map(x=>x.id===antigo?{...x,apoio:clamp(x.apoio-12)}:x.id===partidoId?{...x,apoio:clamp(x.apoio+12)}:x);
    set(current=>({eleicao:r.eleicao,perfilPresidencial:{...current.perfilPresidencial,partidoId},partidos,oposicao:{...current.oposicao,forca:clamp((current.oposicao.forca||30)+4)},eventosRecentes:[`🔄 Filiação eleitoral: ${current.perfilPresidencial.nomePublico} migra para ${p.sigla}. A coerência da candidatura será cobrada.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return r;
  },

  escolherViceEleitoral: (vice) => {
    const state=get(); const r=escolherVice(state.eleicao,vice,state.perfilPresidencial); if(!r.ok)return r;
    const manteve=vice.id===state.eleicao.viceAtual?.id;
    const eleicao={...r.eleicao,viceAtual:{...r.eleicao.viceAtual,relacao:clamp((r.eleicao.viceAtual?.relacao||70)+(manteve?8:-26)),status:manteve?'confirmado_na_chapa':'preterido'}};
    set(current=>({eleicao,oposicao:{...current.oposicao,forca:clamp((current.oposicao.forca||30)+(manteve?-1:2))},eventosRecentes:[`🤝 Chapa: ${vice.nome} é escolhido(a) para a Vice-Presidência · equilíbrio ${r.fit.score}/100.${manteve?' Continuidade preservada.':` ${state.eleicao.viceAtual?.nome} foi retirado(a) da chapa e reagiu mal.`}`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return {...r,eleicao};
  },

  captarRecursoEleitoral: (tipo) => {
    const state=get();
    const relGov=(state.estados||[]).reduce((s,e)=>s+(e.relacaoPlanalto||50),0)/Math.max(1,state.estados.length);
    const r=executarCaptacao(state.eleicao,tipo,{reputacaoDigital:state.redeSocial?.reputacaoDigital||50,relacaoGovernadores:relGov,dataAtual:state.dataAtual}); if(!r.ok)return r;
    set(current=>({eleicao:r.eleicao,redeSocial:tipo==='crowdfunding'?{...current.redeSocial,posts:[{id:`crowd_${current.turno}_${Date.now()}`,autorId:'presidente',autor:current.perfilPresidencial.nomePublico,handle:current.perfilPresidencial.handle,texto:'Abrimos financiamento coletivo transparente da pré-campanha. Cada apoio precisa estar identificado e dentro das regras eleitorais.',tema:'eleicoes',alcance:2300000,turno:current.turno},...(current.redeSocial.posts||[])].slice(0,120)}:current.redeSocial,eventosRecentes:[`💳 Pré-campanha: ${tipo} arrecadou ${r.ganho.toFixed(1)} unidades eleitorais.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return r;
  },

  executarAcaoCampanha: (acaoId,{uf=null,grupo=null}={}) => {
    const state=get(); const r=executarAcaoEleitoral(state.eleicao,acaoId,{uf,grupo}); if(!r.ok)return r;
    let grupos=state.gruposSociais;
    if(acaoId!=='desinformacao'){
      const impactos={...(r.acao?.grupos||{})};
      if(grupo&&impactos[grupo]===undefined)impactos[grupo]=2.2;
      const rivais={agro:'universitarios',universitarios:'agro',mercado:'sindicalistas',sindicalistas:'mercado',evangelicos:'universitarios',militares:'universitarios',periferia:'mercado'};
      if(grupo&&rivais[grupo])impactos[rivais[grupo]]=(impactos[rivais[grupo]]||0)-.7;
      grupos=aplicarImpactoGrupos(grupos,Object.fromEntries(Object.entries(impactos).map(([k,v])=>[k,v*1.35])));
    }
    const post={id:`camp_${state.turno}_${acaoId}_${Date.now()}`,autorId:'presidente',autor:state.perfilPresidencial.nomePublico,handle:state.perfilPresidencial.handle,texto:r.resultado,tema:'eleicoes',alcance:acaoId==='pulso'?4200000:2100000,turno:state.turno};
    set(current=>({
      eleicao:r.eleicao,
      gruposSociais:grupos,
      popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(grupos))},
      institucional:r.juridico?{...current.institucional,riscoJuridico:clamp((current.institucional.riscoJuridico||0)+8)}:current.institucional,
      oposicao:{...current.oposicao,forca:clamp((current.oposicao.forca||30)+(acaoId==='desinformacao'?5:acaoId==='contraste'?1:0))},
      redeSocial:{...current.redeSocial,posts:[post,...gerarPostsComunidade({gruposSociais:grupos,turno:current.turno,evento:'eleicoes',quantidade:3,respostaA:post.id}),...(current.redeSocial.posts||[])].slice(0,120)},
      eventosRecentes:[`${r.juridico?'⚠️':'📣'} Campanha: ${r.resultado}`,...current.eventosRecentes].slice(0,18),
    }));
    saveGame(get()); return r;
  },

  apoiarEleicaoGovernador: (uf,lado) => {
    const state=get(); const race=(state.eleicao.corridasGovernadores||[]).find(r=>r.uf===uf); if(!race)return {ok:false,motivo:'Disputa estadual não encontrada.'};
    const eleicao=apoiarCorridaEstadual(state.eleicao,uf,lado);
    const govRel=(state.estados.find(e=>e.uf===uf)?.relacaoPlanalto||50);
    const delta=lado==='incumbent'?(govRel>=55?1.8:-.7):(govRel<48?1.2:-1.2);
    eleicao.modificadoresEstados={...(eleicao.modificadoresEstados||{}),[uf]:clamp((eleicao.modificadoresEstados?.[uf]||0)+delta,-12,14)};
    set(current=>({eleicao,estados:current.estados.map(e=>e.uf===uf?{...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+(lado==='incumbent'?3:-4))}:e),eventosRecentes:[`🗺️ Eleição estadual: Planalto apoia ${lado==='incumbent'?race.incumbent.nome:race.challenger.nome} em ${uf}.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return {ok:true};
  },

  realizarDebateEleitoral: (escolhas) => {
    const state=get(); const r=resolverDebate(state.eleicao,escolhas); if(!r.ok)return r;
    const eleicao={...r.eleicao,modificadoresEstados:Object.fromEntries(Object.entries(r.eleicao.modificadoresEstados||{}).map(([uf,v])=>[uf,clamp(v+r.ganho*.22,-12,14)]))};
    set(current=>({eleicao,redeSocial:{...current.redeSocial,posts:[{id:`debate_${current.turno}_${Date.now()}`,autorId:'global',autor:'Global',texto:`Debate presidencial: desempenho de ${current.perfilPresidencial.nomePublico} repercute nas redes.`,tema:'eleicoes',alcance:8400000,turno:current.turno},...(current.redeSocial.posts||[])].slice(0,120)},eventosRecentes:[`🎙️ Debate concluído · efeito eleitoral ${r.ganho>=0?'+':''}${r.ganho.toFixed(1)}.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return r;
  },

  atualizarPesquisaEleitoral: (bonus=6) => {
    const state=get(); const eleicao=recalcularPesquisaEleitoral({eleicao:state.eleicao,estados:state.estados,gruposSociais:state.gruposSociais,perfil:state.perfilPresidencial,oposicao:state.oposicao,forcarDescoberta:bonus,turno:state.turno});
    set(current=>({eleicao,eventosRecentes:[`📊 Nova pesquisa: ${eleicao.pesquisa.voce.toFixed(1)}% · não sabe/não respondeu ${eleicao.pesquisa.indecisos.toFixed(1)}%.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return {ok:true,pesquisa:eleicao.pesquisa};
  },

  alterarPosicaoCampanha: (eixo,valor) => {
    const state=get(); const r=alterarPosicaoEleitoral(state.eleicao,eixo,valor,state.perfilPresidencial); if(!r.ok)return r;
    const impactos={};
    if(eixo==='economia'){if(valor==='social'){impactos.periferia=1.5;impactos.sindicalistas=1.3;impactos.mercado=-1.5;}if(valor==='liberal'){impactos.mercado=1.7;impactos.agro=.6;impactos.sindicalistas=-1.3;}}
    if(eixo==='costumes'){if(valor==='progressista'){impactos.universitarios=1.4;impactos.evangelicos=-1.4;}if(valor==='conservador'){impactos.evangelicos=1.6;impactos.universitarios=-1.5;}}
    if(eixo==='seguranca'){if(valor==='linha_dura'){impactos.militares=1.5;impactos.evangelicos=.6;impactos.universitarios=-.8;}if(valor==='garantista'){impactos.universitarios=1;impactos.militares=-1.1;}}
    if(eixo==='ambiente'){if(valor==='verde'){impactos.universitarios=1.3;impactos.agro=-1.2;}if(valor==='desenvolvimento'){impactos.agro=1.5;impactos.universitarios=-1.1;}}
    const grupos=aplicarImpactoGrupos(state.gruposSociais,impactos);
    set(current=>({eleicao:r.eleicao,gruposSociais:grupos,popularidade:{...current.popularidade,geral:clamp(aprovacaoNacional(grupos))},eventosRecentes:[`🧭 Campanha reposiciona discurso em ${eixo}. Coerência -${r.custo}.`,...current.eventosRecentes].slice(0,18)}));
    saveGame(get()); return r;
  },

  realizarPrimeiroTurnoEleitoral: () => {
    const state=get(); const r=simularPrimeiroTurno(state.eleicao); if(!r.ok)return r;
    const races=(r.eleicao.corridasGovernadores||[]).map(x=>{const inc=(x.pesquisa?.incumbent||40)+(Math.random()*4-2);const cha=(x.pesquisa?.challenger||40)+(Math.random()*4-2);return {...x,vencedor:inc>=cha?'incumbent':'challenger'};});
    const eleicao={...r.eleicao,corridasGovernadores:races};
    const msg=r.eleito?'reeleito no primeiro turno':r.classificado?'classificado para o segundo turno':'eliminado no primeiro turno';
    set(current=>({eleicao,faseEleitoral:eleicao.fase,eventosRecentes:[`🗳️ Eleição presidencial: ${current.perfilPresidencial.nomePublico} ${msg}.`,...current.eventosRecentes].slice(0,24)}));
    saveGame(get()); return {...r,eleicao};
  },

  realizarSegundoTurnoEleitoral: () => {
    const state=get(); const r=simularSegundoTurno(state.eleicao); if(!r.ok)return r;
    set(current=>({eleicao:r.eleicao,faseEleitoral:r.eleicao.fase,eventosRecentes:[`🏁 Segundo turno: ${current.perfilPresidencial.nomePublico} ${r.eleito?'vence a eleição':'é derrotado nas urnas'}.`,...current.eventosRecentes].slice(0,24)}));
    saveGame(get()); return r;
  },

  processarTurnoEleitoral: () => {
    const state=get();
    let eleicao=processarMesEleitoral({eleicao:state.eleicao||criarEstadoEleitoralInicial({perfil:state.perfilPresidencial,estados:state.estados}),estados:state.estados,gruposSociais:state.gruposSociais,perfil:state.perfilPresidencial,oposicao:state.oposicao,nomeacoes:state.nomeacoes,atoresCongresso:state.atoresCongresso,turno:state.turno,dataAtual:state.dataAtual});
    let nomeacoes=[...state.nomeacoes]; let atores=[...state.atoresCongresso]; const eventos=[];
    // A IA pode retirar figuras do governo quando elas decidem disputar outro cargo.
    const candMin=(eleicao.candidaturasPersonagens||[]).filter(c=>c.origem==='ministro'&&['presidencia','governo_estadual'].includes(c.office)&&!c.saiuDoGoverno);
    if(faseEleitoralPorData(state.dataAtual)!=='governo'&&candMin.length&&Math.random()<.28){
      const c=candMin[0]; const min=nomeacoes.find(n=>n.id===c.personagemId);
      if(min){nomeacoes=nomeacoes.filter(n=>n.id!==c.personagemId);eleicao={...eleicao,candidaturasPersonagens:eleicao.candidaturasPersonagens.map(x=>x.personagemId===c.personagemId?{...x,saiuDoGoverno:true,status:'candidato'}:x)};eventos.push(`🚪 ${min.nome} deixa o ministério para disputar ${c.office==='presidencia'?'a Presidência':'um governo estadual'}.`);}
    }
    // Durante a janela, lideranças da Câmara podem realmente mudar de legenda.
    const janela=(eleicao.movimentosIA||[]).filter(m=>m.turno===state.turno&&m.tipo==='janela');
    janela.slice(0,1).forEach(m=>{const idx=atores.findIndex(a=>a.id===m.personagemId);if(idx>=0){const atual=atores[idx];const opcoes=['esq','centro','dir','ind'].filter(id=>id!==atual.partidoId);const destino=opcoes[(state.turno+idx)%opcoes.length];atores[idx]={...atual,partidoId:destino,relacao:clamp((atual.relacao||50)-2)};eventos.push(`🔁 ${atual.nome} troca de legenda e passa a integrar ${getParty(destino).sigla}.`);}});
    // Personagens que se lançam ao Planalto entram na lista presidencial dinâmica.
    const novos=(eleicao.candidaturasPersonagens||[]).filter(c=>c.office==='presidencia'&&!eleicao.adversarios.some(a=>a.id===c.personagemId||a.id===c.id)&&c.popularidade>=68).slice(0,1);
    if(novos.length){const c=novos[0];eleicao={...eleicao,adversarios:[...eleicao.adversarios,{id:c.personagemId,nome:c.nome,origem:c.cargoAtual,uf:c.uf,ideologia:'centro',avatar:c.avatar,pesoEleitoral:c.popularidade,conhecimento:48,intencaoLatente:8,medido:0,recursos:16,focoEstados:[],estrategia:'lancamento',coerencia:74,ativo:true}]};eventos.push(`🚨 ${c.nome} entra na disputa presidencial.`);}
    if(eleicao.viceAtual?.status==='preterido'&&!eleicao.viceAtual?.reagiu&&Math.random()<.42){eleicao={...eleicao,viceAtual:{...eleicao.viceAtual,reagiu:true,relacao:clamp((eleicao.viceAtual.relacao||45)-6)}};eventos.push(`⚡ ${eleicao.viceAtual.nome}, vice atual fora da nova chapa, cobra publicamente lealdade e espaço político.`);}
    set(current=>({eleicao,nomeacoes,atoresCongresso:atores,faseEleitoral:eleicao.fase,diasParaEleicao:diasParaPrimeiroTurno(current.dataAtual),relatorioTurno:current.relatorioTurno?{...current.relatorioTurno,eleicao:eleicao.fase==='governo'?null:{fase:eleicao.fase,voce:eleicao.pesquisa?.voce||0,indecisos:eleicao.pesquisa?.indecisos||0,coerencia:eleicao.coerencia,recursos:eleicao.recursos?.caixa||0,vice:eleicao.chapa?.vice?.nome||eleicao.viceAtual?.nome,noticia:eleicao.noticiaMes}}:current.relatorioTurno,eventosRecentes:[...eventos,...(eleicao.noticiaMes?[`♟️ IA política: ${eleicao.noticiaMes}`]:[]),...current.eventosRecentes].slice(0,24)}));
    return {ok:true,eleicao};
  },

  enfileirarCutscene: (id) => {
    const scene=cutscenePorId(id);
    if(!scene) return {ok:false,erro:'Cutscene não encontrada.'};
    const state=get();
    if((state.cutscenesVistas||[]).includes(id) || (state.cutscenesPendentes||[]).some(c=>c.id===id)) return {ok:false,erro:'Cutscene já exibida ou pendente.'};
    set(current=>({cutscenesPendentes:[...(current.cutscenesPendentes||[]),scene]}));
    saveGame(get());
    return {ok:true,scene};
  },

  concluirCutscene: (id) => {
    if(!id) return;
    set(current=>({
      cutscenesPendentes:(current.cutscenesPendentes||[]).filter(c=>c.id!==id),
      cutscenesVistas:[...new Set([...(current.cutscenesVistas||[]),id])],
    }));
    saveGame(get());
  },

  proximoTurno: () => {
    const antes = get();
    const snapshot = {
      aprovacao: antes.popularidade.geral,
      pib: antes.economia.pib,
      inflacao: antes.economia.inflacao,
      desemprego: antes.economia.desemprego ?? 8.4,
      divida: antes.economia.dividaPublica,
      risco: antes.economia.riscoPais,
      primario: antes.economia.resultadoPrimario,
      selic: antes.economia.selic,
      apoioEleitoral: (()=>{ const den=(antes.estados||[]).reduce((a,e)=>a+(e.eleitoradoPeso||1),0)||1; return (antes.estados||[]).reduce((a,e)=>a+(e.aprovacao||50)*(e.eleitoradoPeso||1),0)/den; })(),
    };

    // Compatibilidade com agendas antigas que ainda guardavam visitas como pauta mensal.
    (antes.agendaMensal?.selecionados||[]).filter(id=>String(id).startsWith('visita:')).forEach(id=>get().executarVisitaPresidencial(String(id).split(':')[1]));
    // A partir da 4.6.2.1 compromissos datados são executados pelo calendário presidencial.
    get().processarAgendaCalendario();

    get().processarTurnoMinisterios();
    get().processarTurnoInternacional();
    get().processarInstitucional();
    get().processarTurnoJudiciario();
    get().processarTurnoCongresso();
    get().processarEventosNacionais();
    get().processarProjetosEspeciais();
    get().processarTurnoEstatais();
    get().processarTurnoOposicao();
    get().processarEventosFederativos();
    get().processarConsequenciasPendentes();
    get().processarParceriasEmpresariais();
    get().processarProgramasGovernamentais();

    set(state => {
      let economia={...state.economia};
      let gruposSociais={...state.gruposSociais};
      let estados=state.estados.map(e=>({...e}));
      let congresso={...state.congresso};
      let redeSocial={...state.redeSocial,posts:[...(state.redeSocial?.posts||[])]};
      const agenda=state.agendaMensal?.selecionados||[];
      if(agenda.includes('ruas')) gruposSociais=aplicarImpactoGrupos(gruposSociais,{periferia:1.6,evangelicos:.6,sindicalistas:.5,mercado:-.4});
      if(agenda.includes('producao')) gruposSociais=aplicarImpactoGrupos(gruposSociais,{agro:1.3,mercado:1.2,universitarios:.3});
      if(agenda.includes('governadores')) { estados=estados.map(e=>({...e,relacaoPlanalto:clamp((e.relacaoPlanalto||50)+1.5)})); congresso.poder=clamp((congresso.poder||0)+3); }
      if(agenda.includes('ciencia')) gruposSociais=aplicarImpactoGrupos(gruposSociais,{universitarios:1.8,mercado:.5});
      if(agenda.includes('imprensa')) { redeSocial.seguidores=(redeSocial.seguidores||0)+180000; gruposSociais=aplicarImpactoGrupos(gruposSociais,{periferia:.5,mercado:.4,universitarios:.5}); }
      if(agenda.includes('congresso')) congresso.poder=clamp((congresso.poder||0)+5);
      if(agenda.includes('empresas')) { economia.confiancaMercado=clamp((economia.confiancaMercado||50)+2); gruposSociais=aplicarImpactoGrupos(gruposSociais,{mercado:1.2,agro:.4,sindicalistas:-.3}); }
      if(agenda.includes('gabinete')) { gruposSociais=aplicarImpactoGrupos(gruposSociais,{mercado:.4,universitarios:.4}); }

      const fiscal=processarFiscalMensal(economia,state.institucional,state.turno);
      economia=fiscal.economia;
      economia.pib=Math.round((economia.pib||10000000)*(1+(economia.crescimentoPib||0)/1200));
      const comercioExterior=processarComercioMensal(state.comercioExterior||COMERCIO_INICIAL,{...economia,turno:state.turno+1},{...state.mundo,sancoesAtivas:state.geopolitica?.sancoesAtivas||[]});
      if((comercioExterior.balanca||0)>5000) economia.confiancaMercado=clamp((economia.confiancaMercado||50)+.4);
      if((comercioExterior.balanca||0)<0) economia.riscoPais=Math.max(80,(economia.riscoPais||250)+2);

      const macro=fiscal.impactoAprovacao||0;
      gruposSociais=aplicarImpactoGrupos(gruposSociais,{
        periferia:macro, sindicalistas:macro*.7, mercado:macro*.45 + (economia.riscoPais<250?.6:economia.riscoPais>400?-1:0),
        agro:macro*.45, evangelicos:macro*.65, militares:macro*.35, universitarios:macro*.55,
      });
      const popularidade={...state.popularidade,geral:clamp(aprovacaoNacional(gruposSociais))};
      estados=estados.map(e=>({...e,aprovacao:calcularAprovacaoEstado(e,gruposSociais)}));
      const pesoEleitoral=estados.reduce((s,e)=>s+(e.eleitoradoPeso||1),0)||1;
      const apoioEleitoral=estados.reduce((s,e)=>s+(e.aprovacao||50)*(e.eleitoradoPeso||1),0)/pesoEleitoral;
      const relacaoGovernadores=estados.reduce((s,e)=>s+(e.relacaoPlanalto||50)*(e.eleitoradoPeso||1),0)/pesoEleitoral;
      congresso.poder=clamp((congresso.poder||0)+(relacaoGovernadores-50)*0.035);

      const novaData=new Date(state.dataAtual); novaData.setMonth(novaData.getMonth()+1);
      const meses=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const agendaAtual=state.agendaPresidencial||AGENDA_INICIAL;
      const pontosNaoUsados=agendaAtual.pontosRestantes;
      const ajusteClima=pontosNaoUsados===0?1:pontosNaoUsados>=2?-1:0;
      const headlineBase=state.eventosRecentes[0]||'O governo fecha mais um mês sob disputa de agenda.';
      const repercussao=gerarRepercussao({evento:headlineBase,turno:state.turno+1});
      const comunidadeMes=gerarPostsComunidade({gruposSociais,turno:state.turno+1,evento:headlineBase,quantidade:4,respostaA:repercussao.id});
      redeSocial.posts=[repercussao,...comunidadeMes,...redeSocial.posts].slice(0,120);
      redeSocial.tendencias=calcularTendenciasPulso(redeSocial.posts);
      const recentesPulso=redeSocial.posts.slice(0,24);
      const alcancePresidencia=recentesPulso.filter(p=>p.autorId==='presidente').reduce((s,p)=>s+(p.alcance||0),0);
      const alcanceOposicao=recentesPulso.filter(p=>p.grupo==='oposicao').reduce((s,p)=>s+(p.alcance||0),0);
      const balancoDigital=Math.max(-1.2,Math.min(1.2,(alcancePresidencia-alcanceOposicao)/8000000));
      if(Math.abs(balancoDigital)>.15){
        gruposSociais=aplicarImpactoGrupos(gruposSociais,{periferia:balancoDigital*.45,universitarios:balancoDigital*.35,mercado:balancoDigital*.2,evangelicos:balancoDigital*.2});
        popularidade.geral=clamp(aprovacaoNacional(gruposSociais));
        redeSocial.reputacaoDigital=clamp((redeSocial.reputacaoDigital||50)+balancoDigital*1.4);
      }
      const manchetes=[
        String(headlineBase).replace(/^[^\wÀ-ÿ]+/,''),
        fiscal.resumo.resultadoPrimario>=0?`Primário fecha com superávit de R$ ${(fiscal.resumo.resultadoPrimario/1000).toFixed(1)} bi.`:`Déficit primário chega a R$ ${(Math.abs(fiscal.resumo.resultadoPrimario)/1000).toFixed(1)} bi.`,
        `Risco-país em ${economia.riscoPais} pontos; desemprego em ${economia.desemprego.toFixed(1)}%.`,
        estados.slice().sort((a,b)=>Math.abs((b.aprovacao||50)-50)-Math.abs((a.aprovacao||50)-50))[0] ? `Mapa político: ${estados.slice().sort((a,b)=>(b.aprovacao||0)-(a.aprovacao||0))[0].nome} lidera aprovação regional.` : 'Mapa político permanece estável.',
      ];
      const conviteMidia=null;
      const situacaoEconomica=detectarSituacaoEconomica(economia);
      const politicaEconomica={...POLITICA_ECONOMICA_INICIAL,...state.politicaEconomica,tributosAlteradosTurno:[],situacaoAtiva:situacaoEconomica};
      if(situacaoEconomica) manchetes.splice(1,0,`Fazenda alerta: ${situacaoEconomica.nome} · gravidade ${situacaoEconomica.gravidade}.`);
      const relatorioTurno={
        turno:state.turno+1,data:`${meses[novaData.getMonth()]} ${novaData.getFullYear()}`,manchetes,
        antes:snapshot,
        depois:{aprovacao:popularidade.geral,apoioEleitoral,pib:economia.pib,inflacao:economia.inflacao,desemprego:economia.desemprego,divida:economia.dividaPublica,risco:economia.riscoPais,primario:economia.resultadoPrimario,selic:economia.selic},
        grupos:Object.values(gruposSociais).map(g=>({id:g.id,nome:g.nome,aprovacao:g.aprovacao})),
        oposicao:{forca:state.oposicao?.forca||0,estrategia:state.oposicao?.estrategiaAtual?.nome||'Reorganização'},
        eventoFederativo:state.eventoFederativoAtivo?{titulo:state.eventoFederativoAtivo.titulo,uf:state.eventoFederativoAtivo.uf,multiplicador:state.eventoFederativoAtivo.multiplicador}:null,
        consequenciasResolvidas:(state.historicoConsequencias||[]).filter(c=>c.resolvidoNoTurno===state.turno+1).slice(0,4),
        compromissosPendentes:(state.consequenciasPendentes||[]).slice().sort((a,b)=>a.turnoAlvo-b.turnoAlvo).slice(0,4).map(c=>({id:c.id,titulo:c.titulo,turnoAlvo:c.turnoAlvo,origem:c.origem})),
        pulso:{tendencias:redeSocial.tendencias||[],reputacaoDigital:redeSocial.reputacaoDigital||50,balanco:balancoDigital},
        comercio:{exportacoes:comercioExterior.exportacoesMensais,importacoes:comercioExterior.importacoesMensais,balanca:comercioExterior.balanca,acordos:(comercioExterior.acordos||[]).length,oportunidades:(comercioExterior.oportunidades||[]).length},
        agendaRealizada:(state.agendaCalendario?.historico||[]).filter(h=>h.status==='realizado'&&h.turno===state.turno).slice(0,6).map(h=>({id:h.id,titulo:h.titulo,tipo:h.tipo,local:h.local,dataISO:h.dataISO})),
        programas:(state.programas||[]).filter(p=>['ativo','atrasado','implantacao','concluido'].includes(p.status)).slice(0,5).map(p=>({id:p.id,nome:p.nome,status:p.status,progresso:p.progresso||0,execucao:p.execucao||0,risco:p.riscoExecucao||0,gasto:p.gastoAcumulado||0})),
      };
      return {
        turno:state.turno+1,dataAtual:novaData,dataString:`${meses[novaData.getMonth()]} ${novaData.getFullYear()}`,
        diasParaEleicao:Math.max(0,state.diasParaEleicao-30),economia,popularidade,gruposSociais,estados,congresso,redeSocial,politicaEconomica,comercioExterior,relatorioTurno,manchetes,
        climaGoverno:clamp(state.climaGoverno+ajusteClima),agendaMensal:{...(state.agendaMensal||{}),selecionados:[],conviteMidia},
        agendaPresidencial:{...agendaAtual,pontosRestantes:agendaAtual.pontosMax||3,acoesUsadas:[],ultimaReacao:null,impulsoPib:0},
        historico:{aprovacao:[...state.historico.aprovacao,popularidade.geral].slice(-12),pib:[...state.historico.pib,economia.crescimentoPib].slice(-12),inflacao:[...state.historico.inflacao,economia.inflacao].slice(-12)},
        eventosRecentes:[`📅 ${meses[novaData.getMonth()]} ${novaData.getFullYear()} · relatório presidencial fechado`,...(pontosNaoUsados>=2?[`⚠️ ${pontosNaoUsados} pontos de atenção ficaram sem uso.`]:[]),...state.eventosRecentes].slice(0,18),
      };
    });

    // Fase 4.8.2 — teste piloto: a primeira virada mensal abre a cutscene do ICMS de Isabela.
    // As demais cenas já estão catalogadas e podem ser disparadas por condições/eventos futuros.
    const aposVirada=get();
    if(aposVirada.turno===2 && !(aposVirada.cutscenesVistas||[]).includes('gov-sp-i1') && !(aposVirada.cutscenesPendentes||[]).some(c=>c.id==='gov-sp-i1')){
      const cenaPiloto=cutscenePorId('gov-sp-i1');
      if(cenaPiloto) set(current=>({cutscenesPendentes:[...(current.cutscenesPendentes||[]),cenaPiloto]}));
    }

    get().processarTurnoEleitoral();
    get().gerarConvitesAgendaMensal();
    saveGame(get());
    return get().relatorioTurno;
  },

  obterVisualMinistro: (ministerioId, contexto) => {
    const s = get();
    const ministro = s.nomeacoes.find(n => n.cargoId === ministerioId);
    if (!ministro || !ministro.assets) return null;
    
    switch(contexto) {
      case 'normal': return ministro.assets.normal;
      case 'preocupado': return ministro.assets.preocupado;
      case 'crise': return ministro.assets.crise;
      case 'evento': return ministro.assets.evento;
      default: return ministro.assets.normal;
    }
  },

  verificarRiscoCPI: (ministerioId) => {
    const s = get();
    const historico = s.historicoMinisterios[ministerioId];
    if (!historico) return 0;
    
    let risco = 0;
    if (historico.vezesIgnorado > 3) risco += 20;
    if (historico.crisesSuperadas > 5) risco += 15;
    if (historico.vezesIntervindo > 2) risco += 25;
    risco += (100 - s.climaGoverno) * 0.2;
    if (s.oposicao.forca > 60) risco += 10;
    
    return Math.min(100, risco);
  },

  obterProgressoConquista: (id) => progressoConquista(get(),id),

  ativarRecompensaConquista: (conquistaId) => {
    const state=get();
    const conquista=conquistasSeed.find(c=>c.id===conquistaId);
    if(!conquista)return {ok:false,motivo:'Conquista inexistente.'};
    const desbloqueada=(state.conquistasDesbloqueadas||[]).some(c=>(typeof c==='string'?c:c.id)===conquistaId);
    if(!desbloqueada)return {ok:false,motivo:'Esta recompensa ainda não foi desbloqueada.'};
    const rid=conquista.recompensa?.id;
    if(!rid||conquista.recompensa?.tipo!=='estrutural')return {ok:false,motivo:'Esta conquista não exige implantação adicional.'};
    if((state.recompensasEstruturaisAtivadas||[]).includes(rid))return {ok:false,motivo:'Esta recompensa estrutural já foi implantada.'};

    if(rid==='fundo_estabilizacao'){
      if(state.capitalPolitico<4)return {ok:false,motivo:'São necessários 4 pontos de capital político.'};
      set(current=>({
        capitalPolitico:current.capitalPolitico-4,
        economia:{...current.economia,fundoEstabilizacao:true,riscoPais:Math.max(80,(current.economia.riscoPais||250)-15),confiancaMercado:clamp((current.economia.confiancaMercado||50)+4)},
        recompensasEstruturaisAtivadas:[...(current.recompensasEstruturaisAtivadas||[]),rid],
        eventosRecentes:['🏦 Fundo de Estabilização Fiscal instituído. O Tesouro ganhou um amortecedor adicional de confiança.',...current.eventosRecentes].slice(0,18),
      }));
    } else if(rid==='empresa_nuclear_avancada'){
      if(state.capitalPolitico<8)return {ok:false,motivo:'São necessários 8 pontos de capital político para protocolar a criação da empresa.'};
      if(state.estatais.some(e=>e.id===estatalNuclearAvancada.id))return {ok:false,motivo:'A empresa já integra a rede estatal.'};
      const emTramitacao=(state.votacoes||[]).some(v=>v.leiId===leiCriacaoEBTN.id&&!['arquivada','vetada','sancionada'].includes(v.status));
      if(emTramitacao)return {ok:false,motivo:'O projeto de criação da empresa já está em tramitação.'};
      const lei=state.leisDisponiveis.find(l=>l.id===leiCriacaoEBTN.id)||leiCriacaoEBTN;
      const proposta=criarProposta({lei,turno:state.turno,atores:state.atoresCongresso,partidos:state.partidos});
      set(current=>({
        capitalPolitico:current.capitalPolitico-8,
        leisDisponiveis:current.leisDisponiveis.some(l=>l.id===lei.id)?current.leisDisponiveis:[...current.leisDisponiveis,lei],
        votacoes:[proposta,...current.votacoes],
        leisEmTramitacao:[...new Set([...current.leisEmTramitacao,lei.id])],
        eventosRecentes:['⚛️ Governo envia ao Congresso o projeto de criação da Empresa Brasileira de Tecnologia Nuclear.',...current.eventosRecentes].slice(0,18),
      }));
    } else if(rid==='ceitec_expansao'){
      if(state.capitalPolitico<6)return {ok:false,motivo:'São necessários 6 pontos de capital político para a expansão estratégica.'};
      if(state.estatais.some(e=>e.id===ceitecExpandida.id))return {ok:false,motivo:'A CEITEC já integra a rede estratégica.'};
      set(current=>({
        capitalPolitico:current.capitalPolitico-6,
        economia:{...registrarMovimentoFiscal(current.economia,2400,'tecnologia'),crescimentoPib:Number(((current.economia.crescimentoPib||0)+.08).toFixed(2))},
        estatais:[...current.estatais,{...ceitecExpandida,criadaNoTurno:current.turno}],
        recompensasEstruturaisAtivadas:[...(current.recompensasEstruturaisAtivadas||[]),rid],
        eventosRecentes:['🔬 CEITEC entra na rede estratégica com mandato de expansão em semicondutores e eletrônica de potência.',...current.eventosRecentes].slice(0,18),
      }));
    } else if(rid==='comite_governanca_estatais'){
      if(state.capitalPolitico<5)return {ok:false,motivo:'São necessários 5 pontos de capital político.'};
      set(current=>({
        capitalPolitico:current.capitalPolitico-5,
        estatais:current.estatais.map(e=>({...e,governanca:clamp((e.governanca||50)+3)})),
        institucional:{...current.institucional,riscoJuridico:clamp((current.institucional.riscoJuridico||10)-6),comiteGovernancaEstatais:true},
        recompensasEstruturaisAtivadas:[...(current.recompensasEstruturaisAtivadas||[]),rid],
        eventosRecentes:['🏢 Comitê de Governança das Estatais implantado com auditoria reforçada e padrões comuns de integridade.',...current.eventosRecentes].slice(0,18),
      }));
    } else return {ok:false,motivo:'Recompensa estrutural ainda não possui ação nesta versão.'};
    saveGame(get());
    return {ok:true,recompensa:rid};
  },

  verificarConquistas: () => {
    const state=get();
    const novas=avaliarConquistas(state);
    if(!novas.length)return [];
    let acumulado=state;
    const registros=[];
    novas.forEach(conquista=>{
      acumulado=aplicarBonusConquista(acumulado,conquista);
      registros.push({id:conquista.id,desbloqueadaEm:state.turno,recompensaId:conquista.recompensa?.id||null,recompensaTipo:conquista.recompensa?.tipo||'bonus'});
    });
    set({
      popularidade:acumulado.popularidade,
      economia:acumulado.economia,
      mundo:acumulado.mundo,
      institucional:acumulado.institucional,
      stf:acumulado.stf,
      congresso:acumulado.congresso,
      oposicao:acumulado.oposicao,
      capitalPolitico:acumulado.capitalPolitico,
      climaGoverno:acumulado.climaGoverno,
      estados:acumulado.estados,
      gruposSociais:acumulado.gruposSociais,
      capacidadesDesbloqueadas:acumulado.capacidadesDesbloqueadas,
      conquistasDesbloqueadas:[...(state.conquistasDesbloqueadas||[]),...registros],
      eventosRecentes:[...novas.map(c=>`🏆 Conquista: ${c.titulo} — ${c.recompensa?.nome||'novo marco de governo'}.`),...state.eventosRecentes].slice(0,18),
    });
    saveGame(get());
    return novas;
  },
}));

export default useGameStore;