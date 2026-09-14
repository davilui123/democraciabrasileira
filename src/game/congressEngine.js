const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const CONGRESSO_INICIAL = {
  poder: 42,
  poderMax: 100,
  riscoEscandalo: 6,
  vitorias: 0,
  derrotas: 0,
  acordos: [],
  ultimaMovimentacao: null,
  historico: [],
};

export const ACOES_ARTICULACAO = [
  {
    id: 'reuniao_lideres',
    titulo: 'Reunião de líderes',
    descricao: 'Casa Civil e liderança do governo fecham posição e reduzem dissidências.',
    custoPoder: 5,
    custoCapital: 2,
    apoio: 8,
    risco: 0,
    icone: 'users',
  },
  {
    id: 'negociar_texto',
    titulo: 'Negociar o texto',
    descricao: 'Aceita emenda ou substitutivo para ampliar a maioria e reduzir resistência.',
    custoPoder: 4,
    custoCapital: 1,
    apoio: 6,
    polarizacao: -10,
    risco: 0,
    icone: 'file-pen',
  },
  {
    id: 'emendas_bancada',
    titulo: 'Priorizar emendas de bancada',
    descricao: 'Coordena execução orçamentária transparente de emendas para destravar apoio regional.',
    custoPoder: 7,
    custoCapital: 2,
    custoOrcamento: 320,
    apoio: 12,
    foco: ['centro', 'ind'],
    risco: 3,
    icone: 'landmark',
  },
  {
    id: 'urgencia',
    titulo: 'Pedir urgência',
    descricao: 'Força a pauta para o Plenário e encurta o caminho, mas irrita comissões e aumenta a temperatura.',
    custoPoder: 10,
    custoCapital: 7,
    apoio: -3,
    polarizacao: 8,
    risco: 4,
    icone: 'zap',
  },
  {
    id: 'pressao_publica',
    titulo: 'Pressão pública',
    descricao: 'O Presidente usa capital popular e comunicação para tornar a votação politicamente custosa aos indecisos.',
    custoPoder: 5,
    custoCapital: 1,
    apoio: 5,
    risco: 2,
    usaPopularidade: true,
    icone: 'megaphone',
  },
  {
    id: 'bastidor',
    titulo: 'Operação de bastidor',
    descricao: 'Ativa relações, promessas de agenda e pressão reservada sobre lideranças. É poderosa — e deixa rastros.',
    custoPoder: 14,
    custoCapital: 4,
    apoio: 17,
    risco: 14,
    icone: 'key-round',
  },
];

const EVENTOS = [
  { id: 'pedido_vista', titulo: 'Pedido de vista', texto: 'Um parlamentar pede mais tempo e a comissão adia a decisão.', atraso: 1, apoio: -2, peso: 8 },
  { id: 'relator_aderiu', titulo: 'Relator compra a ideia', texto: 'O relator incorpora argumentos do governo e apresenta parecer favorável.', atraso: 0, apoio: 7, peso: 7 },
  { id: 'emenda_centro', titulo: 'Emenda de consenso', texto: 'Uma emenda negociada reduz resistência do centro e melhora a projeção.', atraso: 0, apoio: 5, polarizacao: -5, peso: 8 },
  { id: 'pressao_ruas', titulo: 'Pressão das ruas', texto: 'Mobilização externa aumenta o custo político para parlamentares indecisos.', atraso: 0, apoio: 4, peso: 5 },
  { id: 'bancada_rebelde', titulo: 'Bancada rebelde', texto: 'Uma ala partidária ameaça votar contra a orientação do líder.', atraso: 0, apoio: -8, peso: 6 },
  { id: 'governadores', titulo: 'Governadores entram no jogo', texto: 'Governadores pressionam suas bancadas por alterações e contrapartidas.', atraso: 0, apoio: 4, peso: 5 },
  { id: 'vazamento', titulo: 'Vazamento de bastidor', texto: 'Trechos das negociações chegam à imprensa e elevam a temperatura política.', atraso: 0, apoio: -4, risco: 8, peso: 4 },
  { id: 'parecer_tecnico', titulo: 'Parecer técnico favorável', texto: 'Nota técnica positiva melhora o ambiente entre parlamentares moderados.', atraso: 0, apoio: 4, peso: 6 },
];

export const getQuorumInfo = (instrumento) => {
  if (instrumento === 'PEC') {
    return { codigo: 'tres_quintos', rotulo: '3/5 dos deputados', votosMinimos: 308, turnos: 2 };
  }
  if (instrumento === 'PLP') {
    return { codigo: 'maioria_absoluta', rotulo: 'Maioria absoluta', votosMinimos: 257, turnos: 1 };
  }
  return { codigo: 'maioria_simples', rotulo: 'Maioria dos presentes', votosMinimos: null, turnos: 1, quorumPresenca: 257 };
};

export const calcularProjecao = (proposta, lei, partidos) => {
  const bonusGeral = proposta?.apoioBonus || 0;
  const bonusPorPartido = proposta?.bonusPorPartido || {};
  const polarizacao = proposta?.polarizacaoAtual ?? lei.polarizacao ?? 40;

  const bancadas = partidos.map((partido) => {
    const afinidade = lei.afinidade?.[partido.id] ?? 50;
    const governismo = partido.apoio ?? 50;
    const penalidadePolarizacao = polarizacao >= 75 && afinidade < 50 ? -8 : 0;
    const probabilidade = clamp(
      afinidade * 0.62 + governismo * 0.38 + bonusGeral + (bonusPorPartido[partido.id] || 0) + penalidadePolarizacao,
      4,
      97,
    );
    const sim = Math.round(partido.cadeiras * (probabilidade / 100));
    return {
      id: partido.id,
      sigla: partido.sigla,
      cadeiras: partido.cadeiras,
      probabilidade,
      sim,
      nao: partido.cadeiras - sim,
    };
  });

  const sim = bancadas.reduce((acc, item) => acc + item.sim, 0);
  const nao = 513 - sim;
  const quorum = getQuorumInfo(lei.instrumento);
  const meta = quorum.votosMinimos || 257;
  return { sim, nao, indecisos: Math.max(0, Math.round((100 - Math.abs(sim - 257) / 5) * 0.08)), meta, quorum, bancadas };
};

const atorParaComissao = (comissaoId, atores) => {
  const mapping = {
    ccjc: 'pres_ccjc', cft: 'pres_cft', cssf: 'pres_social', cspcco: 'pres_seguranca', cmads: 'pres_meioamb',
  };
  return atores.find((ator) => ator.id === mapping[comissaoId])
    || atores.find((ator) => ator.cargo?.toLowerCase().includes('líder'))
    || atores[0]
    || null;
};

export const criarProposta = ({ lei, turno, atores, partidos }) => {
  const primeiraComissao = lei.comissoes?.[0] || 'ccjc';
  const relator = atorParaComissao(primeiraComissao, atores);
  const proposta = {
    id: `prop_${lei.id}_${turno}_${Date.now()}`,
    leiId: lei.id,
    titulo: lei.titulo,
    descricao: lei.descricao,
    instrumento: lei.instrumento || 'PL',
    categoria: lei.categoria,
    origem: 'executivo',
    status: 'em_tramitacao',
    fase: 'comissao',
    comissaoIndex: 0,
    comissaoAtual: primeiraComissao,
    relatorId: relator?.id || null,
    turnosNaEtapa: 0,
    rodadaPlenario: 1,
    apoioBonus: 0,
    bonusPorPartido: {},
    polarizacaoAtual: lei.polarizacao ?? 40,
    urgencia: false,
    emendas: [],
    eventos: [],
    historico: [{ turno, tipo: 'protocolo', texto: 'Mensagem presidencial protocolada na Câmara dos Deputados.' }],
    dataEnvioTurno: turno,
  };
  proposta.projecao = calcularProjecao(proposta, lei, partidos);
  return proposta;
};

const sortearEvento = () => {
  const pool = EVENTOS.flatMap((evento) => Array.from({ length: evento.peso || 1 }, () => evento));
  return pool[Math.floor(Math.random() * pool.length)];
};

const avaliarComissao = ({ proposta, lei, partidos, atores }) => {
  const projecao = calcularProjecao(proposta, lei, partidos);
  const relator = atores.find((ator) => ator.id === proposta.relatorId);
  const relacao = relator?.relacao ?? 50;
  const score = projecao.sim / 5.13 + (relacao - 50) * 0.22 - (proposta.polarizacaoAtual - 50) * 0.08;
  const chance = clamp(score, 12, 94);
  return Math.random() * 100 <= chance;
};

export const processarCongressoTurno = ({ votacoes, leis, partidos, atores, congresso, turno }) => {
  let congressoNovo = { ...CONGRESSO_INICIAL, ...(congresso || {}) };
  const eventosGlobais = [];

  const novasVotacoes = votacoes.map((original) => {
    if (!['em_tramitacao', 'aguarda_segundo_turno', 'senado'].includes(original.status)) return original;
    const proposta = { ...original, historico: [...(original.historico || [])], eventos: [...(original.eventos || [])] };
    const lei = leis.find((item) => item.id === proposta.leiId);
    if (!lei) return proposta;

    if (proposta.status === 'aguarda_segundo_turno') {
      proposta.status = 'votacao_hoje';
      proposta.fase = 'plenario';
      proposta.historico.unshift({ turno, tipo: 'pauta', texto: 'Segundo turno incluído na Ordem do Dia.' });
      proposta.projecao = calcularProjecao(proposta, lei, partidos);
      return proposta;
    }

    if (proposta.status === 'senado') {
      const base = calcularProjecao(proposta, lei, partidos).sim / 513;
      const chanceSenado = clamp(base * 100 + (congressoNovo.poder - 50) * 0.12, 20, 92);
      if (Math.random() * 100 <= chanceSenado) {
        proposta.status = 'aguardando_sancao';
        proposta.fase = 'sancao';
        proposta.historico.unshift({ turno, tipo: 'senado', texto: 'Senado aprovou o texto. Projeto segue à sanção presidencial.' });
        eventosGlobais.push(`🏛️ ${proposta.titulo}: aprovado no Senado e enviado à Presidência.`);
      } else {
        proposta.status = 'em_tramitacao';
        proposta.fase = 'comissao';
        proposta.comissaoIndex = Math.max(0, (lei.comissoes?.length || 1) - 1);
        proposta.comissaoAtual = lei.comissoes?.[proposta.comissaoIndex] || 'ccjc';
        proposta.turnosNaEtapa = 0;
        proposta.apoioBonus = (proposta.apoioBonus || 0) - 3;
        proposta.historico.unshift({ turno, tipo: 'senado', texto: 'Senado alterou o texto. A matéria retorna à Câmara.' });
        eventosGlobais.push(`↩️ ${proposta.titulo}: Senado devolveu o texto à Câmara com alterações.`);
      }
      return proposta;
    }

    proposta.turnosNaEtapa = (proposta.turnosNaEtapa || 0) + 1;

    if (Math.random() < 0.46) {
      const evento = sortearEvento();
      proposta.apoioBonus = (proposta.apoioBonus || 0) + (evento.apoio || 0);
      proposta.polarizacaoAtual = clamp((proposta.polarizacaoAtual ?? lei.polarizacao ?? 40) + (evento.polarizacao || 0));
      proposta.turnosNaEtapa = Math.max(0, proposta.turnosNaEtapa - (evento.atraso || 0));
      if (evento.risco) congressoNovo.riscoEscandalo = clamp(congressoNovo.riscoEscandalo + evento.risco);
      proposta.eventos.unshift({ turno, ...evento });
      proposta.historico.unshift({ turno, tipo: 'evento', texto: `${evento.titulo}: ${evento.texto}` });
      eventosGlobais.push(`🗞️ ${proposta.titulo}: ${evento.titulo}.`);
    }

    if (proposta.fase === 'comissao' && proposta.turnosNaEtapa >= (proposta.urgencia ? 1 : 2)) {
      const passou = avaliarComissao({ proposta, lei, partidos, atores });
      const comissaoAtual = lei.comissoes?.[proposta.comissaoIndex];
      if (!passou) {
        proposta.apoioBonus = (proposta.apoioBonus || 0) - 5;
        proposta.turnosNaEtapa = 0;
        proposta.historico.unshift({ turno, tipo: 'comissao', texto: `${comissaoAtual || 'Comissão'} adiou ou rejeitou o parecer. O governo precisa recompor votos.` });
        eventosGlobais.push(`⚠️ ${proposta.titulo}: revés em comissão.`);
      } else {
        const proximoIndex = (proposta.comissaoIndex || 0) + 1;
        if (proximoIndex < (lei.comissoes?.length || 0)) {
          proposta.comissaoIndex = proximoIndex;
          proposta.comissaoAtual = lei.comissoes[proximoIndex];
          proposta.relatorId = atorParaComissao(proposta.comissaoAtual, atores)?.id || proposta.relatorId;
          proposta.turnosNaEtapa = 0;
          proposta.historico.unshift({ turno, tipo: 'comissao', texto: `Parecer aprovado. Matéria segue para ${proposta.comissaoAtual.toUpperCase()}.` });
        } else if (lei.apreciacao === 'conclusiva' && !proposta.urgencia) {
          proposta.status = 'senado';
          proposta.fase = 'senado';
          proposta.historico.unshift({ turno, tipo: 'comissao', texto: 'Aprovação conclusiva nas comissões. Projeto segue ao Senado.' });
          eventosGlobais.push(`✅ ${proposta.titulo}: Câmara concluiu análise nas comissões.`);
        } else {
          proposta.status = 'votacao_hoje';
          proposta.fase = 'plenario';
          proposta.turnosNaEtapa = 0;
          proposta.historico.unshift({ turno, tipo: 'pauta', texto: 'Projeto incluído na Ordem do Dia do Plenário.' });
          eventosGlobais.push(`🔔 ${proposta.titulo}: pronto para votação no Plenário.`);
        }
      }
    }

    proposta.projecao = calcularProjecao(proposta, lei, partidos);
    return proposta;
  });

  congressoNovo.riscoEscandalo = clamp(congressoNovo.riscoEscandalo - 1);
  const votosBase = partidos.reduce((acc, partido) => acc + Math.floor((partido.cadeiras || 0) * ((partido.apoio || 0) / 100)), 0);
  const regeneracaoPoder = votosBase >= 257 ? 5 : votosBase >= 220 ? 3 : 2;
  congressoNovo.poder = clamp(
    (congressoNovo.poder || 0) + regeneracaoPoder,
    0,
    congressoNovo.poderMax || 100,
  );
  return { votacoes: novasVotacoes, congresso: congressoNovo, eventos: eventosGlobais };
};

export const simularVotacao = ({ proposta, lei, partidos }) => {
  const projecao = calcularProjecao(proposta, lei, partidos);
  let sim = 0;
  let nao = 0;
  let abstencao = 0;

  projecao.bancadas.forEach((bancada) => {
    for (let i = 0; i < bancada.cadeiras; i += 1) {
      const variacao = (Math.random() * 16) - 8;
      const prob = clamp(bancada.probabilidade + variacao, 2, 98);
      const r = Math.random() * 100;
      if (r < prob) sim += 1;
      else if (r < prob + 4) abstencao += 1;
      else nao += 1;
    }
  });

  const presentes = sim + nao + abstencao;
  const quorum = getQuorumInfo(lei.instrumento);
  let aprovado = false;
  let meta = quorum.votosMinimos;
  if (quorum.codigo === 'maioria_simples') {
    meta = Math.floor((sim + nao) / 2) + 1;
    aprovado = presentes >= (quorum.quorumPresenca || 257) && sim >= meta;
  } else {
    aprovado = sim >= quorum.votosMinimos;
  }

  return { sim, nao, abstencao, presentes, aprovado, meta, quorum };
};

export const aplicarAcaoArticulacao = ({ acaoId, proposta, lei, congresso, capitalPolitico, orcamento = 0, popularidade }) => {
  const acao = ACOES_ARTICULACAO.find((item) => item.id === acaoId);
  if (!acao) return { ok: false, motivo: 'Ação inexistente.' };
  const estadoCongresso = { ...CONGRESSO_INICIAL, ...(congresso || {}) };
  if (estadoCongresso.poder < acao.custoPoder) return { ok: false, motivo: 'Poder de bastidor insuficiente.' };
  if (capitalPolitico < (acao.custoCapital || 0)) return { ok: false, motivo: 'Capital político insuficiente.' };
  if (acaoId === 'urgencia' && !lei.admiteUrgencia) return { ok: false, motivo: 'Este instrumento não admite o atalho de urgência neste modelo.' };

  const nova = {
    ...proposta,
    apoioBonus: (proposta.apoioBonus || 0) + (acao.apoio || 0),
    bonusPorPartido: { ...(proposta.bonusPorPartido || {}) },
    polarizacaoAtual: clamp((proposta.polarizacaoAtual ?? lei.polarizacao ?? 40) + (acao.polarizacao || 0)),
    historico: [...(proposta.historico || [])],
    emendas: [...(proposta.emendas || [])],
  };

  if (acao.foco) {
    acao.foco.forEach((partidoId) => {
      nova.bonusPorPartido[partidoId] = (nova.bonusPorPartido[partidoId] || 0) + 8;
    });
  }
  if (acao.usaPopularidade) {
    nova.apoioBonus += Math.round(((popularidade || 50) - 50) / 5);
  }
  if (acaoId === 'negociar_texto') {
    nova.emendas.push({ id: `emenda_${Date.now()}`, titulo: 'Substitutivo de consenso', efeito: 'Reduz polarização e amplia apoio moderado.' });
  }
  if (acaoId === 'urgencia') {
    nova.urgencia = true;
    nova.fase = 'plenario';
    nova.status = 'votacao_hoje';
    nova.comissaoAtual = null;
    nova.turnosNaEtapa = 0;
  }
  nova.historico.unshift({ turno: null, tipo: 'articulacao', texto: `${acao.titulo}: ${acao.descricao}` });

  const novoCongresso = {
    ...estadoCongresso,
    poder: clamp(estadoCongresso.poder - acao.custoPoder),
    riscoEscandalo: clamp(estadoCongresso.riscoEscandalo + (acao.risco || 0)),
    ultimaMovimentacao: acao.titulo,
    historico: [{ id: Date.now(), acao: acao.titulo }, ...(estadoCongresso.historico || [])].slice(0, 20),
  };

  return {
    ok: true,
    proposta: nova,
    congresso: novoCongresso,
    capitalPolitico: capitalPolitico - (acao.custoCapital || 0),
    orcamento,
    custoFiscal: acao.custoOrcamento || 0,
    acao,
  };
};
