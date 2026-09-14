const SAVE_KEY = 'democracia-brasileira:save:v15';
const SAVE_VERSION = 15;
const LEGACY_SAVE_KEYS = ['democracia-brasileira:save:v14', 'democracia-brasileira:save:v13', 'democracia-brasileira:save:v12', 'democracia-brasileira:save:v11', 'democracia-brasileira:save:v10', 'democracia-brasileira:save:v9', 'democracia-brasileira:save:v8', 'democracia-brasileira:save:v7', 'democracia-brasileira:save:v6', 'democracia-brasileira:save:v5', 'democracia-brasileira:save:v4', 'democracia-brasileira:save:v3', 'democracia-brasileira:save:v2'];

const STATE_KEYS = [
  'turno', 'dataAtual', 'dataString', 'faseEleitoral', 'diasParaEleicao', 'mandato',
  'manchetes', 'orcamento', 'capitalPolitico', 'climaGoverno', 'popularidade',
  'mundo', 'diplomacia', 'economia', 'institucional', 'stf', 'nomeacoes',
  'historicoMinisterios', 'conflitosMinisteriais', 'oposicao', 'partidos', 'historico',
  'conquistasDesbloqueadas', 'capacidadesDesbloqueadas', 'recompensasEstruturaisAtivadas', 'eventosRecentes', 'promessasPoliticas', 'votacoes',
  'programas', 'leisDisponiveis', 'leisEmTramitacao', 'leisAprovadas', 'agendaPresidencial', 'cargos',
  'congresso', 'atoresCongresso', 'comissoes',
  'ligacaoMinisterial', 'eventosMinisteriaisResolvidos', 'desafiosMinisteriaisResolvidos',
  'historicoRelacoesMinisteriais', 'historicoLigacoesMinisteriais', 'eventosNacionais',
  'gruposSociais', 'estados', 'estadoSelecionado', 'midias', 'redeSocial', 'projetosEspeciais',
  'agendaMensal', 'agendaCalendario', 'relatorioTurno', 'geopolitica', 'instituicoes', 'candidatosSTF', 'comunidadePulso',
  'estatais', 'eventosEstatais', 'eventoFederativoAtivo', 'historicoEventosFederativos', 'politicaEconomica',
  'perfilPresidencial', 'eleicao', 'empresasPrivadas', 'parceriasEmpresariais', 'ultimaParceriaTurno', 'consequenciasPendentes', 'historicoConsequencias', 'comercioExterior',
  'cutscenesPendentes', 'cutscenesVistas'
];

const replacer = (_key, value) => value instanceof Date
  ? { __type: 'Date', value: value.toISOString() }
  : value;

const reviveDates = (value) => {
  if (!value || typeof value !== 'object') return value;
  if (value.__type === 'Date' && value.value) return new Date(value.value);
  if (Array.isArray(value)) return value.map(reviveDates);
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, reviveDates(v)]));
};

export const createSavePayload = (state) => {
  const gameState = {};
  STATE_KEYS.forEach(key => {
    if (state[key] !== undefined) gameState[key] = state[key];
  });

  // Date.prototype.toJSON roda antes do replacer, então normalizamos a data principal.
  if (state.dataAtual instanceof Date) gameState.dataAtual = state.dataAtual.toISOString();

  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    gameState,
  };
};

export const saveGame = (state) => {
  if (typeof window === 'undefined') return false;
  const payload = createSavePayload(state);
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload, replacer));
  return payload;
};

export const loadGame = () => {
  if (typeof window === 'undefined') return null;
  let raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    const legacyKey = LEGACY_SAVE_KEYS.find(key => localStorage.getItem(key));
    raw = legacyKey ? localStorage.getItem(legacyKey) : null;
  }
  if (!raw) return null;

  try {
    const payload = reviveDates(JSON.parse(raw));
    if (!payload?.gameState) return null;
    if (typeof payload.gameState.dataAtual === 'string') {
      payload.gameState.dataAtual = new Date(payload.gameState.dataAtual);
    }
    return payload;
  } catch (error) {
    console.error('Save local inválido:', error);
    return null;
  }
};

export const clearSave = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
  LEGACY_SAVE_KEYS.forEach((key) => localStorage.removeItem(key));
};


export const getSaveSummary = () => {
  const payload = loadGame();
  if (!payload?.gameState) return null;
  const s = payload.gameState;
  return {
    savedAt: payload.savedAt,
    dataString: s.dataString || 'Mandato em andamento',
    turno: s.turno || 1,
    mandato: s.mandato || '2023–2026',
    aprovacao: Math.round(s.popularidade?.geral ?? 50),
    nomeados: Array.isArray(s.nomeacoes) ? s.nomeacoes.length : 0,
    leis: Array.isArray(s.leisAprovadas) ? s.leisAprovadas.length : 0,
    presidente: s.perfilPresidencial?.nomePublico || s.perfilPresidencial?.nome || 'Presidente',
  };
};

export const exportSave = (state) => JSON.stringify(createSavePayload(state), null, 2);

export const parseImportedSave = (text) => {
  const payload = reviveDates(JSON.parse(text));
  if (!payload?.gameState) throw new Error('Arquivo de save inválido.');
  if (typeof payload.gameState.dataAtual === 'string') {
    payload.gameState.dataAtual = new Date(payload.gameState.dataAtual);
  }
  return payload;
};

export { SAVE_KEY, SAVE_VERSION };
