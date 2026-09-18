const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));

export const CONTROLE_LEIS_INICIAL = {
  casosSTF: [],
  auditoriasTCU: [],
  leisMonitoradas: [],
  historico: [],
};

export const STATUS_LEI_VIGENTE = new Set([
  'sancionada',
  'sancionada_veto_mantido',
  'sancionada_veto_derrubado',
  'promulgada_veto_derrubado',
]);

const hash = (text = '') => [...String(text)].reduce((acc, c) => ((acc * 33) + c.charCodeAt(0)) >>> 0, 11);
const pick = (arr = [], seed = 0) => arr.length ? arr[Math.abs(seed) % arr.length] : null;

const tagsOf = (lei = {}) => (lei.tags || []).map(tag => String(tag).toLowerCase());
const has = (tags, terms) => terms.some(term => tags.some(tag => tag.includes(term)));

export function calcularRiscoFinalLei(proposta = {}, lei = {}) {
  const texto = proposta.textoFinal || {};
  const riscos = { ...(lei.riscosControle || {}), ...(proposta.riscosTexto || {}), ...(texto.riscos || {}) };
  const impactoFiscal = Math.abs(Number(texto.impactoFiscal ?? proposta.impactoFiscalEmendas ?? 0));
  const alteracoes = (texto.alteracoes || proposta.alteracoesTexto || []).length;
  const veto = texto.veto || proposta.vetoPresidencial || null;
  const parcial = texto.vigencia === 'parcial' || (veto?.tipo === 'parcial' && veto?.resultado === 'mantido');
  const instrumento = lei.instrumento || proposta.instrumento || 'PL';
  const tags = tagsOf(lei);

  const bonusSTF = (has(tags, ['direitos', 'federalismo', 'dados', 'privacidade', 'armas', 'eleitoral', 'judici', 'terra', 'licenciamento']) ? 7 : 0)
    + Math.min(8, alteracoes * 1.5)
    + (instrumento === 'PEC' ? -10 : 0)
    + (parcial ? -5 : 0);
  const bonusTCU = Math.min(14, impactoFiscal / 1200)
    + (has(tags, ['fundo', 'crédito', 'credito', 'compras', 'investimento', 'concess', 'subsídio', 'subsidio', 'estatal', 'infraestrutura']) ? 9 : 0)
    + Math.min(6, alteracoes);

  return {
    stf: clamp(Math.round(Number(riscos.stf || 0) + bonusSTF)),
    tcu: clamp(Math.round(Number(riscos.tcu || 0) + bonusTCU)),
    federativo: clamp(Math.round(Number(riscos.federativo || 0))),
    implementacao: clamp(Math.round(Number(riscos.implementacao || 0))),
    impactoFiscal,
    alteracoes,
  };
}

const autorAcaoSTF = (lei, risco) => {
  const tags = tagsOf(lei);
  if ((risco.federativo || 0) >= 62 || has(tags, ['federalismo', 'icms', 'royalties', 'estados'])) return 'coalizão de governadores';
  if (has(tags, ['mercado', 'concorr', 'tribut', 'empresa', 'digital'])) return 'confederação setorial';
  if (has(tags, ['direitos', 'armas', 'segurança', 'seguranca', 'dados', 'privacidade'])) return 'partido com representação no Congresso';
  return 'Procuradoria-Geral da República';
};

const questionamentosSTF = (lei, risco) => {
  const tags = tagsOf(lei);
  const out = [];
  if ((risco.federativo || 0) >= 55 || has(tags, ['federalismo', 'icms', 'estados', 'municipios', 'royalties'])) out.push('competência federativa e autonomia dos entes');
  if (has(tags, ['direitos', 'privacidade', 'dados', 'armas', 'seguranca', 'segurança'])) out.push('proporcionalidade e proteção de direitos fundamentais');
  if (has(tags, ['empresa', 'mercado', 'concorr', 'tribut', 'subsidio', 'subsídio'])) out.push('isonomia, livre concorrência e tratamento econômico');
  if (has(tags, ['ambient', 'terra', 'licenciamento', 'mineração', 'mineracao'])) out.push('proteção ambiental e repartição de competências');
  if (lei.instrumento !== 'PEC') out.push('compatibilidade material com a Constituição');
  if (!out.length) out.push('separação de Poderes e limites da intervenção estatal');
  return [...new Set(out)].slice(0, 3);
};

const escopoTCU = (lei, risco) => {
  const tags = tagsOf(lei);
  const out = [];
  if (risco.impactoFiscal > 0 || has(tags, ['fundo', 'subsidio', 'subsídio', 'credito', 'crédito'])) out.push('impacto fiscal, fonte de recursos e sustentabilidade do gasto');
  if (has(tags, ['compras', 'concess', 'infraestrutura', 'estatal', 'investimento'])) out.push('governança, contratação e critérios de seleção');
  if (has(tags, ['estados', 'municipios', 'federalismo', 'saude', 'educacao', 'seguranca'])) out.push('transferências, metas e prestação de contas federativa');
  if ((risco.implementacao || 0) >= 55) out.push('capacidade de implementação e controles internos');
  if (!out.length) out.push('economicidade, transparência e mecanismos de monitoramento');
  return [...new Set(out)].slice(0, 3);
};

const relatorSTF = (corte = [], proposta = {}, turno = 1) => {
  const disponiveis = (corte || []).filter(m => m?.id);
  if (!disponiveis.length) return null;
  return disponiveis[(hash(`${proposta.id}:${turno}`)) % disponiveis.length];
};

export function criarCasoSTFLei({ proposta, lei, corte = [], turno = 1 }) {
  const risco = calcularRiscoFinalLei(proposta, lei);
  const relator = relatorSTF(corte, proposta, turno);
  const base = clamp(risco.stf + risco.federativo * 0.08 + (proposta.textoFinal?.vigencia === 'parcial' ? -4 : 0));
  return {
    id: `ctrl_stf_${proposta.id}_${turno}`,
    propostaId: proposta.id,
    leiId: lei.id,
    tituloLei: lei.titulo,
    tipo: lei.instrumento === 'PEC' ? 'ADI sobre emenda constitucional' : 'ADI',
    autor: autorAcaoSTF(lei, risco),
    relatorId: relator?.id || null,
    relator: relator?.nome || 'Relatoria a definir',
    questionamentos: questionamentosSTF(lei, risco),
    riscoBase: Math.round(base),
    riscoAtual: Math.round(base),
    status: 'distribuida',
    abertoNoTurno: turno,
    liminarNoTurno: turno + 1,
    julgamentoNoTurno: turno + 2,
    defesaBonus: 0,
    defesaApresentada: false,
    liminar: null,
    resultado: null,
    votos: [],
    textoVersao: proposta.textoFinal?.versao || proposta.versaoTexto || 1,
    vigenciaQuestionada: proposta.textoFinal?.vigencia || 'integral',
  };
}

export function criarAuditoriaTCULei({ proposta, lei, turno = 1 }) {
  const risco = calcularRiscoFinalLei(proposta, lei);
  const base = clamp(risco.tcu + risco.implementacao * 0.08 + Math.min(10, risco.impactoFiscal / 1600));
  return {
    id: `ctrl_tcu_${proposta.id}_${turno}`,
    propostaId: proposta.id,
    leiId: lei.id,
    tituloLei: lei.titulo,
    tipo: 'Acompanhamento de implementação',
    escopo: escopoTCU(lei, risco),
    riscoBase: Math.round(base),
    riscoAtual: Math.round(base),
    status: 'auditoria_aberta',
    abertoNoTurno: turno,
    achadosNoTurno: turno + 1,
    decisaoNoTurno: turno + 2,
    adequacaoBonus: 0,
    planoApresentado: false,
    achados: [],
    resultado: null,
    impactoFiscal: risco.impactoFiscal,
    textoVersao: proposta.textoFinal?.versao || proposta.versaoTexto || 1,
  };
}

const chanceAbertura = (risco, tipo) => {
  if (risco >= 75) return tipo === 'stf' ? 0.94 : 0.97;
  if (risco >= 60) return 0.78;
  if (risco >= 48) return 0.54;
  if (risco >= 35) return 0.28;
  return 0.10;
};

const statusEmVigencia = (proposta) => STATUS_LEI_VIGENTE.has(proposta?.status) && proposta?.textoFinal?.vigencia !== 'sem_vigencia';

export function abrirControlesNovos({ controle = CONTROLE_LEIS_INICIAL, votacoes = [], leis = [], corte = [], turno = 1, rng = Math.random }) {
  const next = {
    ...CONTROLE_LEIS_INICIAL,
    ...(controle || {}),
    casosSTF: [...(controle?.casosSTF || [])],
    auditoriasTCU: [...(controle?.auditoriasTCU || [])],
    leisMonitoradas: [...(controle?.leisMonitoradas || [])],
    historico: [...(controle?.historico || [])],
  };
  const monitoradas = new Map(next.leisMonitoradas.map(m => [m.propostaId, { ...m }]));
  const novasAberturas = [];
  let abriuSTF = false;
  let abriuTCU = false;

  const elegiveis = (votacoes || []).filter(statusEmVigencia).sort((a, b) => (b.textoFinal?.riscos?.stf || 0) + (b.textoFinal?.riscos?.tcu || 0) - ((a.textoFinal?.riscos?.stf || 0) + (a.textoFinal?.riscos?.tcu || 0)));
  for (const proposta of elegiveis) {
    const lei = leis.find(l => l.id === proposta.leiId);
    if (!lei) continue;
    const mark = monitoradas.get(proposta.id) || { propostaId: proposta.id, leiId: lei.id, stf: false, tcu: false, turnoPrimeiraAnalise: turno };
    const risco = calcularRiscoFinalLei(proposta, lei);

    if (!mark.stf && !abriuSTF) {
      mark.stf = true;
      if ((rng?.() ?? Math.random()) <= chanceAbertura(risco.stf, 'stf')) {
        const caso = criarCasoSTFLei({ proposta, lei, corte, turno });
        next.casosSTF.unshift(caso);
        next.historico.unshift({ turno, tipo: 'stf_abertura', leiId: lei.id, propostaId: proposta.id, texto: `STF recebe ${caso.tipo} contra ${lei.titulo}.` });
        novasAberturas.push({ instituicao: 'STF', item: caso });
        abriuSTF = true;
      }
    }

    if (!mark.tcu && !abriuTCU) {
      mark.tcu = true;
      if ((rng?.() ?? Math.random()) <= chanceAbertura(risco.tcu, 'tcu')) {
        const auditoria = criarAuditoriaTCULei({ proposta, lei, turno });
        next.auditoriasTCU.unshift(auditoria);
        next.historico.unshift({ turno, tipo: 'tcu_abertura', leiId: lei.id, propostaId: proposta.id, texto: `TCU abre acompanhamento da implementação de ${lei.titulo}.` });
        novasAberturas.push({ instituicao: 'TCU', item: auditoria });
        abriuTCU = true;
      }
    }
    monitoradas.set(proposta.id, mark);
    if (abriuSTF && abriuTCU) break;
  }

  next.leisMonitoradas = [...monitoradas.values()];
  next.historico = next.historico.slice(0, 80);
  return { controle: next, novasAberturas };
}

const achadosTCU = (auditoria) => {
  const base = auditoria.escopo || [];
  const achados = base.map((escopo, i) => ({
    id: `${auditoria.id}_ach_${i}`,
    gravidade: clamp(Math.round((auditoria.riscoAtual || 50) - i * 8)),
    texto: escopo,
  }));
  return achados.length ? achados : [{ id: `${auditoria.id}_ach_0`, gravidade: auditoria.riscoAtual || 50, texto: 'controles de execução e prestação de contas' }];
};

const simularVotosSTF = (caso, corte, rng) => {
  const ministros = (corte || []).filter(m => m?.id);
  const quorum = Math.floor(ministros.length / 2) + 1;
  const votos = ministros.map((m, idx) => {
    const perfil = String(m.perfil || '').toLowerCase();
    const ajustePerfil = perfil.includes('federal') && caso.questionamentos.some(q => q.includes('federativa')) ? 5
      : perfil.includes('liberal') && caso.questionamentos.some(q => q.includes('concorrência')) ? 4
        : perfil.includes('social') && caso.questionamentos.some(q => q.includes('direitos')) ? 4
          : perfil.includes('técn') ? -2 : 0;
    const ruido = ((rng?.() ?? Math.random()) - 0.5) * 20;
    const score = clamp((caso.riscoAtual || caso.riscoBase || 50) + ajustePerfil + ruido - (caso.defesaBonus || 0) * 0.45);
    const inconstitucional = score >= 58;
    return { ministroId: m.id, ministro: m.nome, voto: inconstitucional ? 'inconstitucional' : 'constitucional', score: Math.round(score), ordem: idx + 1 };
  });
  const invalidos = votos.filter(v => v.voto === 'inconstitucional').length;
  return { votos, invalidos, quorum };
};

export function processarControleLegislativo({ controle = CONTROLE_LEIS_INICIAL, votacoes = [], leis = [], corte = [], turno = 1, rng = Math.random }) {
  const abertura = abrirControlesNovos({ controle, votacoes, leis, corte, turno, rng });
  const next = { ...abertura.controle };
  const resolucoesNovas = [];
  const atualizacoes = [];

  next.casosSTF = next.casosSTF.map(original => {
    let caso = { ...original, votos: [...(original.votos || [])] };
    if (caso.status === 'distribuida' && (caso.liminarNoTurno || 999) <= turno) {
      const chance = clamp((caso.riscoAtual || 50) - (caso.defesaBonus || 0) * 0.65, 8, 92);
      const roll = (rng?.() ?? Math.random()) * 100;
      if (roll < chance * 0.42) caso.liminar = { resultado: 'deferida', alcance: 'total', turno };
      else if (roll < chance) caso.liminar = { resultado: 'deferida', alcance: 'parcial', turno };
      else caso.liminar = { resultado: 'indeferida', alcance: 'nenhum', turno };
      caso.status = 'aguardando_plenario';
      next.historico.unshift({ turno, tipo: 'stf_liminar', leiId: caso.leiId, propostaId: caso.propostaId, texto: caso.liminar.resultado === 'indeferida' ? `STF nega liminar contra ${caso.tituloLei}.` : `STF concede liminar ${caso.liminar.alcance} contra ${caso.tituloLei}.` });
      atualizacoes.push({ instituicao: 'STF', tipo: 'liminar', item: caso });
    }
    if (caso.status === 'aguardando_plenario' && (caso.julgamentoNoTurno || 999) <= turno) {
      const placar = simularVotosSTF(caso, corte, rng);
      caso.votos = placar.votos;
      caso.status = 'julgado';
      caso.julgadoNoTurno = turno;
      if (placar.invalidos >= placar.quorum) {
        const total = (caso.riscoAtual || 0) >= 78 && placar.invalidos >= Math.min(placar.votos.length, placar.quorum + 2);
        caso.resultado = total ? 'inconstitucional_total' : 'inconstitucional_parcial';
      } else caso.resultado = 'constitucional';
      caso.placar = { inconstitucional: placar.invalidos, constitucional: placar.votos.length - placar.invalidos, quorum: placar.quorum };
      next.historico.unshift({ turno, tipo: 'stf_julgamento', leiId: caso.leiId, propostaId: caso.propostaId, texto: `STF conclui controle de ${caso.tituloLei}: ${caso.resultado.replaceAll('_', ' ')}.` });
      resolucoesNovas.push({ instituicao: 'STF', item: caso });
    }
    return caso;
  });

  next.auditoriasTCU = next.auditoriasTCU.map(original => {
    let auditoria = { ...original, achados: [...(original.achados || [])] };
    if (auditoria.status === 'auditoria_aberta' && (auditoria.achadosNoTurno || 999) <= turno) {
      auditoria.achados = achadosTCU(auditoria);
      auditoria.status = 'achados_preliminares';
      next.historico.unshift({ turno, tipo: 'tcu_achados', leiId: auditoria.leiId, propostaId: auditoria.propostaId, texto: `TCU apresenta achados preliminares sobre ${auditoria.tituloLei}.` });
      atualizacoes.push({ instituicao: 'TCU', tipo: 'achados', item: auditoria });
    }
    if (auditoria.status === 'achados_preliminares' && (auditoria.decisaoNoTurno || 999) <= turno) {
      const score = clamp((auditoria.riscoAtual || 50) - (auditoria.adequacaoBonus || 0) + (((rng?.() ?? Math.random()) - 0.5) * 18));
      if (score >= 78) auditoria.resultado = 'suspensao_despesas';
      else if (score >= 62) auditoria.resultado = 'determinacao_ajustes';
      else if (score >= 44) auditoria.resultado = 'ressalvas';
      else auditoria.resultado = 'regularidade';
      auditoria.scoreFinal = Math.round(score);
      auditoria.status = 'decidida';
      auditoria.decididaNoTurno = turno;
      next.historico.unshift({ turno, tipo: 'tcu_decisao', leiId: auditoria.leiId, propostaId: auditoria.propostaId, texto: `TCU conclui acompanhamento de ${auditoria.tituloLei}: ${auditoria.resultado.replaceAll('_', ' ')}.` });
      resolucoesNovas.push({ instituicao: 'TCU', item: auditoria });
    }
    return auditoria;
  });

  next.historico = next.historico.slice(0, 80);
  return { controle: next, novasAberturas: abertura.novasAberturas, atualizacoes, resolucoesNovas };
}

export function prepararDefesaSTF(controle, casoId) {
  const caso = (controle?.casosSTF || []).find(c => c.id === casoId);
  if (!caso) return { ok: false, motivo: 'Processo não encontrado.' };
  if (caso.status === 'julgado') return { ok: false, motivo: 'O julgamento já foi concluído.' };
  if (caso.defesaApresentada) return { ok: false, motivo: 'A defesa institucional já foi apresentada.' };
  const casosSTF = controle.casosSTF.map(c => c.id === casoId ? { ...c, defesaApresentada: true, defesaBonus: clamp((c.defesaBonus || 0) + 18), riscoAtual: clamp((c.riscoAtual || c.riscoBase || 50) - 8) } : c);
  return { ok: true, controle: { ...controle, casosSTF }, custoCapital: 3 };
}

export function prepararPlanoTCU(controle, auditoriaId) {
  const auditoria = (controle?.auditoriasTCU || []).find(a => a.id === auditoriaId);
  if (!auditoria) return { ok: false, motivo: 'Auditoria não encontrada.' };
  if (auditoria.status === 'decidida') return { ok: false, motivo: 'A auditoria já foi concluída.' };
  if (auditoria.planoApresentado) return { ok: false, motivo: 'O plano de adequação já foi apresentado.' };
  const auditoriasTCU = controle.auditoriasTCU.map(a => a.id === auditoriaId ? { ...a, planoApresentado: true, adequacaoBonus: clamp((a.adequacaoBonus || 0) + 20), riscoAtual: clamp((a.riscoAtual || a.riscoBase || 50) - 7) } : a);
  return { ok: true, controle: { ...controle, auditoriasTCU }, custoCapital: 2 };
}
