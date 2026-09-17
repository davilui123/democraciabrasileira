const SAVE_VERSION = 16;
const CAMPAIGN_PREFIX = 'democracia-brasileira:campaign:v16:';
const CAMPAIGN_INDEX_KEY = 'democracia-brasileira:campaign-index:v16';
const ACTIVE_CAMPAIGN_KEY = 'democracia-brasileira:active-campaign:v16';
const LEGACY_MIGRATION_KEY = 'democracia-brasileira:legacy-migrated:v16';
// Compatibilidade nominal com versões anteriores do serviço.
const SAVE_KEY = CAMPAIGN_PREFIX;
const LEGACY_SAVE_KEYS = [
  'democracia-brasileira:save:v15', 'democracia-brasileira:save:v14', 'democracia-brasileira:save:v13',
  'democracia-brasileira:save:v12', 'democracia-brasileira:save:v11', 'democracia-brasileira:save:v10',
  'democracia-brasileira:save:v9', 'democracia-brasileira:save:v8', 'democracia-brasileira:save:v7',
  'democracia-brasileira:save:v6', 'democracia-brasileira:save:v5', 'democracia-brasileira:save:v4',
  'democracia-brasileira:save:v3', 'democracia-brasileira:save:v2'
];

const STATE_KEYS = [
  'turno', 'dataAtual', 'dataString', 'faseEleitoral', 'diasParaEleicao', 'mandato',
  'manchetes', 'orcamento', 'capitalPolitico', 'climaGoverno', 'popularidade',
  'mundo', 'diplomacia', 'economia', 'institucional', 'stf', 'nomeacoes',
  'historicoMinisterios', 'conflitosMinisteriais', 'oposicao', 'partidos', 'historico',
  'conquistasDesbloqueadas', 'capacidadesDesbloqueadas', 'recompensasEstruturaisAtivadas', 'eventosRecentes', 'promessasPoliticas', 'votacoes',
  'programas', 'leisDisponiveis', 'leisEmTramitacao', 'leisAprovadas', 'agendaPresidencial', 'cargos',
  'congresso', 'atoresCongresso', 'comissoes', 'agendaLegislativa',
  'ligacaoMinisterial', 'eventosMinisteriaisResolvidos', 'desafiosMinisteriaisResolvidos',
  'historicoRelacoesMinisteriais', 'historicoLigacoesMinisteriais', 'eventosNacionais',
  'gruposSociais', 'estados', 'estadoSelecionado', 'midias', 'redeSocial', 'projetosEspeciais',
  'agendaMensal', 'agendaCalendario', 'relatorioTurno', 'geopolitica', 'instituicoes', 'candidatosSTF', 'comunidadePulso',
  'estatais', 'eventosEstatais', 'eventoFederativoAtivo', 'historicoEventosFederativos', 'politicaEconomica',
  'perfilPresidencial', 'eleicao', 'empresasPrivadas', 'parceriasEmpresariais', 'ultimaParceriaTurno', 'consequenciasPendentes', 'historicoConsequencias', 'comercioExterior',
  'cutscenesPendentes', 'cutscenesVistas',
  // 4.9: estado da IA política global e memória dos personagens.
  'politicalAI',
  // 4.9.3: governabilidade e histórico das consequências sistêmicas.
  'governabilidade', 'historicoCascatas',
  // 4.9.4: orquestração de histórias emergentes e escalada política.
  'politicalOrchestrator'
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

const safeParse = (raw, fallback = null) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

const campaignKey = (campaignId) => `${CAMPAIGN_PREFIX}${campaignId}`;
const makeCampaignId = () => `camp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const readIndex = () => {
  if (typeof window === 'undefined') return [];
  const value = safeParse(localStorage.getItem(CAMPAIGN_INDEX_KEY), []);
  return Array.isArray(value) ? value : [];
};

const writeIndex = (items) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CAMPAIGN_INDEX_KEY, JSON.stringify(items));
};

const payloadSummary = (payload, campaignId, fallback = {}) => {
  const s = payload?.gameState || {};
  return {
    campaignId,
    createdAt: fallback.createdAt || payload?.createdAt || payload?.savedAt || new Date().toISOString(),
    savedAt: payload?.savedAt || fallback.savedAt || new Date().toISOString(),
    dataString: s.dataString || fallback.dataString || 'Mandato em andamento',
    turno: s.turno || fallback.turno || 1,
    mandato: s.mandato || fallback.mandato || '2023–2026',
    aprovacao: Math.round(s.popularidade?.geral ?? fallback.aprovacao ?? 50),
    nomeados: Array.isArray(s.nomeacoes) ? s.nomeacoes.length : (fallback.nomeados || 0),
    leis: Array.isArray(s.leisAprovadas) ? s.leisAprovadas.length : (fallback.leis || 0),
    presidente: s.perfilPresidencial?.nomePublico || s.perfilPresidencial?.nome || fallback.presidente || 'Nova campanha',
    partidoId: s.perfilPresidencial?.partidoId || fallback.partidoId || null,
    ufOrigem: s.perfilPresidencial?.ufOrigem || fallback.ufOrigem || null,
  };
};

const upsertIndex = (summary) => {
  const next = readIndex().filter(x => x.campaignId !== summary.campaignId);
  next.unshift(summary);
  next.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
  writeIndex(next);
  return next;
};

const parsePayload = (raw) => {
  try {
    const payload = reviveDates(JSON.parse(raw));
    if (!payload?.gameState) return null;
    if (typeof payload.gameState.dataAtual === 'string') payload.gameState.dataAtual = new Date(payload.gameState.dataAtual);
    return payload;
  } catch (error) {
    console.error('Save local inválido:', error);
    return null;
  }
};

// Migra o save único da 4.8.x para uma campanha sem apagar o original.
const migrateLegacySaveIfNeeded = () => {
  if (typeof window === 'undefined') return null;
  if (localStorage.getItem(LEGACY_MIGRATION_KEY)) return null;
  const legacyKey = LEGACY_SAVE_KEYS.find(key => localStorage.getItem(key));
  if (!legacyKey) {
    localStorage.setItem(LEGACY_MIGRATION_KEY, 'none');
    return null;
  }
  const raw = localStorage.getItem(legacyKey);
  const payload = parsePayload(raw);
  if (!payload?.gameState) {
    localStorage.setItem(LEGACY_MIGRATION_KEY, 'invalid');
    return null;
  }
  const id = `legacy_${Date.now()}`;
  const migrated = { ...payload, version: SAVE_VERSION, campaignId: id, migratedFrom: legacyKey };
  localStorage.setItem(campaignKey(id), JSON.stringify(migrated, replacer));
  upsertIndex(payloadSummary(migrated, id));
  localStorage.setItem(ACTIVE_CAMPAIGN_KEY, id);
  localStorage.setItem(LEGACY_MIGRATION_KEY, id);
  return id;
};

export const createSavePayload = (state, campaignId = null) => {
  const gameState = {};
  STATE_KEYS.forEach(key => {
    if (state[key] !== undefined) gameState[key] = state[key];
  });
  if (state.dataAtual instanceof Date) gameState.dataAtual = state.dataAtual.toISOString();
  return {
    version: SAVE_VERSION,
    campaignId,
    savedAt: new Date().toISOString(),
    gameState,
  };
};

export const getActiveCampaignId = () => {
  if (typeof window === 'undefined') return null;
  migrateLegacySaveIfNeeded();
  return localStorage.getItem(ACTIVE_CAMPAIGN_KEY) || null;
};

export const setActiveCampaign = (campaignId) => {
  if (typeof window === 'undefined' || !campaignId) return false;
  if (!localStorage.getItem(campaignKey(campaignId)) && !readIndex().some(x => x.campaignId === campaignId)) return false;
  localStorage.setItem(ACTIVE_CAMPAIGN_KEY, campaignId);
  return true;
};

export const createCampaign = (profile = {}) => {
  if (typeof window === 'undefined') return null;
  migrateLegacySaveIfNeeded();
  const campaignId = makeCampaignId();
  const now = new Date().toISOString();
  const placeholder = {
    campaignId,
    createdAt: now,
    savedAt: now,
    dataString: 'Jan 2023',
    turno: 1,
    mandato: '2023–2026',
    aprovacao: 50,
    nomeados: 0,
    leis: 0,
    presidente: profile.nomePublico || profile.nome || 'Nova campanha',
    partidoId: profile.partidoId || null,
    ufOrigem: profile.ufOrigem || null,
  };
  upsertIndex(placeholder);
  localStorage.setItem(ACTIVE_CAMPAIGN_KEY, campaignId);
  return campaignId;
};

export const saveGame = (state) => {
  if (typeof window === 'undefined') return false;
  migrateLegacySaveIfNeeded();
  let campaignId = localStorage.getItem(ACTIVE_CAMPAIGN_KEY);
  if (!campaignId) campaignId = createCampaign(state?.perfilPresidencial || {});
  const existingMeta = readIndex().find(x => x.campaignId === campaignId) || {};
  const payload = { ...createSavePayload(state, campaignId), createdAt: existingMeta.createdAt || new Date().toISOString() };
  localStorage.setItem(campaignKey(campaignId), JSON.stringify(payload, replacer));
  upsertIndex(payloadSummary(payload, campaignId, existingMeta));
  return payload;
};

export const loadGame = (campaignId = null) => {
  if (typeof window === 'undefined') return null;
  migrateLegacySaveIfNeeded();
  const index = readIndex();
  const target = campaignId || localStorage.getItem(ACTIVE_CAMPAIGN_KEY) || index[0]?.campaignId;
  if (!target) return null;
  const raw = localStorage.getItem(campaignKey(target));
  if (!raw) return null;
  const payload = parsePayload(raw);
  if (!payload) return null;
  localStorage.setItem(ACTIVE_CAMPAIGN_KEY, target);
  return { ...payload, campaignId: target };
};

export const getCampaignSummaries = () => {
  if (typeof window === 'undefined') return [];
  migrateLegacySaveIfNeeded();
  const activeId = localStorage.getItem(ACTIVE_CAMPAIGN_KEY);
  const cleaned = readIndex().filter(item => localStorage.getItem(campaignKey(item.campaignId)) || item.presidente === 'Nova campanha');
  if (cleaned.length !== readIndex().length) writeIndex(cleaned);
  return cleaned.map(item => ({ ...item, active: item.campaignId === activeId }));
};

export const deleteCampaign = (campaignId) => {
  if (typeof window === 'undefined' || !campaignId) return false;
  localStorage.removeItem(campaignKey(campaignId));
  const next = readIndex().filter(x => x.campaignId !== campaignId);
  writeIndex(next);
  if (localStorage.getItem(ACTIVE_CAMPAIGN_KEY) === campaignId) {
    if (next[0]?.campaignId) localStorage.setItem(ACTIVE_CAMPAIGN_KEY, next[0].campaignId);
    else localStorage.removeItem(ACTIVE_CAMPAIGN_KEY);
  }
  return true;
};

// Compatibilidade: agora limpa somente a campanha indicada/ativa, não todos os mandatos.
export const clearSave = (campaignId = null) => {
  if (typeof window === 'undefined') return;
  const target = campaignId || localStorage.getItem(ACTIVE_CAMPAIGN_KEY);
  if (target) deleteCampaign(target);
};

export const getSaveSummary = (campaignId = null) => {
  const payload = loadGame(campaignId);
  if (!payload?.gameState) return null;
  const meta = readIndex().find(x => x.campaignId === payload.campaignId) || {};
  return payloadSummary(payload, payload.campaignId, meta);
};

export const exportSave = (state) => JSON.stringify(createSavePayload(state, getActiveCampaignId()), null, 2);

export const parseImportedSave = (text) => {
  const payload = reviveDates(JSON.parse(text));
  if (!payload?.gameState) throw new Error('Arquivo de save inválido.');
  if (typeof payload.gameState.dataAtual === 'string') payload.gameState.dataAtual = new Date(payload.gameState.dataAtual);
  return payload;
};

export {
  SAVE_KEY, SAVE_VERSION, CAMPAIGN_PREFIX, CAMPAIGN_INDEX_KEY, ACTIVE_CAMPAIGN_KEY,
};
