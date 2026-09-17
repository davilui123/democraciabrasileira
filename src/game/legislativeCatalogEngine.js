const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const CATEGORY_BLUEPRINTS = {
  economia: {
    eixo: 'atividade econômica e investimento',
    primeiraReacao: 'Empresas, mercado e Congresso recalculam investimento, crédito e custo de adaptação.',
    segundaReacao: 'Os efeitos chegam a emprego, arrecadação e cadeias produtivas estaduais.',
    longoPrazo: 'A produtividade e a estrutura competitiva passam a refletir a nova regra.',
    grupos: ['mercado', 'industria', 'trabalhadores'],
    programa: 'Agenda Nacional de Produtividade',
  },
  tributacao: {
    eixo: 'arrecadação, distribuição da carga e incentivos',
    primeiraReacao: 'Contribuintes, setores afetados e governadores reorganizam estratégias e pressão política.',
    segundaReacao: 'A mudança altera preços, investimento, arrecadação e repartição federativa.',
    longoPrazo: 'O desenho tributário muda incentivos econômicos e a capacidade fiscal do Estado.',
    grupos: ['mercado', 'classe_media', 'governadores'],
    programa: 'Programa de Transição Tributária',
  },
  trabalho: {
    eixo: 'relações de trabalho, renda e produtividade',
    primeiraReacao: 'Empresas, sindicatos e trabalhadores ajustam contratos e expectativas.',
    segundaReacao: 'Custos, emprego formal e renda disponível começam a responder à nova regra.',
    longoPrazo: 'O mercado de trabalho incorpora novos padrões de proteção e produtividade.',
    grupos: ['sindicalistas', 'mercado', 'periferia'],
    programa: 'Pacto Nacional do Trabalho',
  },
  saude: {
    eixo: 'capacidade do SUS e acesso a serviços',
    primeiraReacao: 'Estados, municípios, hospitais e fornecedores disputam recursos e critérios de execução.',
    segundaReacao: 'Filas, cobertura e custos assistenciais passam a refletir a implantação.',
    longoPrazo: 'A rede pública ganha ou perde capacidade conforme financiamento e gestão.',
    grupos: ['periferia', 'governadores', 'mercado'],
    programa: 'Programa de Implementação do SUS',
  },
  educacao: {
    eixo: 'aprendizagem, formação e capacidade científica',
    primeiraReacao: 'Redes estaduais, municípios, universidades e profissionais reagem ao desenho da política.',
    segundaReacao: 'Execução orçamentária e capacidade local determinam a velocidade de expansão.',
    longoPrazo: 'Indicadores educacionais e oferta de capital humano passam a refletir a medida.',
    grupos: ['universitarios', 'governadores', 'periferia'],
    programa: 'Plano Nacional de Implementação Educacional',
  },
  seguranca: {
    eixo: 'segurança pública, justiça e capacidade estatal',
    primeiraReacao: 'Governadores, corporações e sistema de justiça disputam competências e recursos.',
    segundaReacao: 'Operações, prisões, investigação e percepção de segurança começam a mudar.',
    longoPrazo: 'A política redefine coordenação federativa e resultados de segurança.',
    grupos: ['militares', 'governadores', 'periferia'],
    programa: 'Plano Integrado de Segurança e Justiça',
  },
  sociedade: {
    eixo: 'direitos, proteção social e acesso a oportunidades',
    primeiraReacao: 'Grupos sociais, estados, municípios e setor privado reagem aos novos direitos e obrigações.',
    segundaReacao: 'A execução pressiona orçamento, serviços públicos e fiscalização.',
    longoPrazo: 'O alcance real da lei depende de adesão local, financiamento e capacidade administrativa.',
    grupos: ['periferia', 'universitarios', 'governadores'],
    programa: 'Programa Nacional de Garantia de Direitos',
  },
  ambiental: {
    eixo: 'clima, uso do solo e transição produtiva',
    primeiraReacao: 'Agro, indústria, estados e investidores reavaliam custos, licenças e oportunidades.',
    segundaReacao: 'Exportações, investimentos verdes e conflitos territoriais respondem à implementação.',
    longoPrazo: 'O país altera emissões, reputação externa e competitividade ambiental.',
    grupos: ['agro', 'mercado', 'universitarios'],
    programa: 'Plano Nacional de Transição Verde',
  },
  agro: {
    eixo: 'produção agropecuária, crédito e segurança alimentar',
    primeiraReacao: 'Produtores, tradings e governadores agrícolas ajustam investimento e pressão sobre Brasília.',
    segundaReacao: 'Safra, preços de alimentos, exportações e logística começam a responder.',
    longoPrazo: 'A competitividade rural muda conforme produtividade, risco climático e acesso a mercados.',
    grupos: ['agro', 'mercado', 'governadores'],
    programa: 'Plano Nacional de Competitividade Agropecuária',
  },
  infraestrutura: {
    eixo: 'logística, energia e serviços de infraestrutura',
    primeiraReacao: 'Governadores, concessionárias e investidores disputam prioridades e modelagens.',
    segundaReacao: 'Obras, tarifas, emprego e gargalos regionais começam a responder.',
    longoPrazo: 'Custos logísticos e produtividade nacional refletem a qualidade da execução.',
    grupos: ['mercado', 'governadores', 'periferia'],
    programa: 'Carteira Nacional de Infraestrutura',
  },
  digital: {
    eixo: 'tecnologia, dados e soberania digital',
    primeiraReacao: 'Plataformas, empresas de tecnologia e órgãos de controle reagem às novas obrigações.',
    segundaReacao: 'Investimento, inovação, privacidade e competição digital começam a mudar.',
    longoPrazo: 'O país redefine sua autonomia tecnológica e posição nas cadeias globais.',
    grupos: ['mercado', 'universitarios', 'industria'],
    programa: 'Agenda Brasil Digital',
  },
  institucional: {
    eixo: 'governança, equilíbrio de poderes e integridade',
    primeiraReacao: 'Congresso, órgãos de controle e instituições reavaliam competências e incentivos.',
    segundaReacao: 'A nova regra altera comportamento político, fiscalização e estabilidade decisória.',
    longoPrazo: 'O arranjo institucional passa a produzir novos custos e limites para governar.',
    grupos: ['congresso', 'instituicoes', 'mercado'],
    programa: 'Plano de Implementação Institucional',
  },
  geopolitica: {
    eixo: 'defesa, comércio estratégico e política externa',
    primeiraReacao: 'Parceiros externos, Forças Armadas e setores exportadores recalculam posições.',
    segundaReacao: 'Acordos, investimentos e relações bilaterais reagem à nova orientação.',
    longoPrazo: 'O Brasil reposiciona autonomia, influência e dependências estratégicas.',
    grupos: ['militares', 'mercado', 'agro'],
    programa: 'Estratégia Nacional de Inserção Internacional',
  },
};

const SPECIFIC_CHAINS = {
  arcabouco_fiscal: [
    ['Sanção', 'Mercado e Congresso testam a credibilidade dos novos limites fiscais.'],
    ['Execução', 'Pressão por despesas e exceções testa os gatilhos de correção.'],
    ['Federação', 'Estados e bancadas cobram espaço para investimentos fora das restrições.'],
    ['Legado', 'Juros, risco-país e capacidade de investimento passam a refletir a disciplina fiscal.'],
  ],
  igf: [
    ['Sanção', 'Grandes patrimônios reorganizam ativos e intensificam lobby por exceções.'],
    ['Arrecadação', 'Receita potencial depende de fiscalização e desenho antielisão.'],
    ['Judicialização', 'Entidades econômicas podem questionar base de cálculo e tratamento isonômico.'],
    ['Legado', 'A medida altera distribuição da carga e pode influenciar fuga ou repatriação de capitais.'],
  ],
  plataformas: [
    ['Sanção', 'Aplicativos redesenham contratos, preços e algoritmos de distribuição de corridas.'],
    ['Trabalho', 'Proteção previdenciária cresce, mas custos operacionais pressionam preços e oferta.'],
    ['Congresso', 'Bancadas empresariais e trabalhistas tentam revisar pontos da regulamentação.'],
    ['Legado', 'A formalização redefine competição e renda no trabalho por plataformas.'],
  ],
  licenciamento: [
    ['Sanção', 'Estados, setor produtivo e organizações ambientais disputam critérios de licenciamento.'],
    ['Investimento', 'Projetos podem acelerar, mas decisões controversas elevam risco jurídico.'],
    ['STF/TCU', 'Conflitos de competência e qualidade dos estudos atraem controle institucional.'],
    ['Legado', 'Infraestrutura, reputação ambiental e exportações passam a refletir o novo regime.'],
  ],
  armas: [
    ['Sanção', 'Estados e forças de segurança ajustam registros, fiscalização e protocolos.'],
    ['Sociedade', 'A medida polariza opinião pública e mobiliza grupos favoráveis e contrários.'],
    ['Judicialização', 'Regras de competência e restrições podem ser levadas ao STF.'],
    ['Legado', 'Indicadores de segurança e percepção pública determinam a continuidade da política.'],
  ],
  carbono: [
    ['Sanção', 'Empresas precificam emissões e começam a demandar regras de mercado.'],
    ['Produção', 'Setores intensivos em carbono enfrentam custo de adaptação e investimento tecnológico.'],
    ['Comércio exterior', 'Rastreabilidade e credenciais ambientais afetam acesso a mercados.'],
    ['Legado', 'A competitividade verde e a trajetória de emissões passam a responder ao mercado.'],
  ],
  ia: [
    ['Sanção', 'Empresas e órgãos públicos classificam sistemas e ajustam práticas de transparência.'],
    ['Regulação', 'Autoridades definem auditoria, responsabilidade e tratamento de sistemas de alto risco.'],
    ['Mercado', 'Custos de conformidade disputam espaço com investimento e inovação.'],
    ['Legado', 'Confiança digital, produtividade e soberania tecnológica refletem o equilíbrio regulatório.'],
  ],
  semicondutores: [
    ['Sanção', 'Empresas globais disputam incentivos e localização de novas plantas.'],
    ['Geopolítica', 'China, EUA e parceiros tecnológicos acompanham critérios de preferência e acesso.'],
    ['TCU', 'Benefícios fiscais e compras públicas passam por escrutínio de contrapartidas.'],
    ['Legado', 'Capacidade doméstica reduz dependência externa e altera cadeias industriais.'],
  ],
  minerais_criticos: [
    ['Sanção', 'Estados mineradores e empresas disputam concessões, royalties e processamento local.'],
    ['Geopolítica', 'Grandes potências buscam acordos preferenciais para minerais estratégicos.'],
    ['STF/TCU', 'Contratos, licenciamento e territórios sensíveis podem gerar controle e judicialização.'],
    ['Legado', 'O país pode subir na cadeia de valor ou permanecer exportador de matéria-prima.'],
  ],
  fim_reeleicao: [
    ['Promulgação', 'Partidos reorganizam carreiras e sucessões para o novo calendário político.'],
    ['Federação', 'Governadores e prefeitos recalculam alianças e lançamentos de sucessores.'],
    ['Congresso', 'Lideranças tentam ajustar regras de transição e duração dos mandatos.'],
    ['Legado', 'O sistema partidário passa a responder a ciclos eleitorais diferentes.'],
  ],
  reforma_adm: [
    ['Sanção', 'Órgãos federais e carreiras negociam transição, avaliação e novas regras de gestão.'],
    ['Execução', 'Economia fiscal depende de implementação e capacidade gerencial.'],
    ['Judicialização', 'Carreiras podem questionar pontos de transição, estabilidade e direitos adquiridos.'],
    ['Legado', 'Qualidade do serviço e folha de pessoal revelam o efeito real da reforma.'],
  ],
};

const categoryRiskBias = {
  economia: [22, 38], tributacao: [38, 42], trabalho: [30, 34], saude: [20, 38], educacao: [18, 34],
  seguranca: [42, 25], sociedade: [38, 24], ambiental: [44, 35], agro: [26, 34], infraestrutura: [24, 48],
  digital: [38, 30], institucional: [48, 36], geopolitica: [24, 28],
};

const hasAny = (tags, candidates) => candidates.some((tag) => tags.includes(tag));

const createGenericChain = (lei, blueprint) => [
  { etapa: 'sanção', titulo: 'Reação imediata', descricao: blueprint.primeiraReacao },
  { etapa: 'implementação', titulo: 'Efeito operacional', descricao: blueprint.segundaReacao },
  { etapa: 'controle', titulo: 'Teste político e institucional', descricao: `TCU, STF, Congresso e atores federativos podem reagir se a execução de “${lei.titulo}” gerar conflito, gasto ou tratamento desigual.` },
  { etapa: 'legado', titulo: 'Efeito estrutural', descricao: blueprint.longoPrazo },
];

const deriveRegulation = (lei) => {
  const tags = lei.tags || [];
  const alwaysOperational = ['saude', 'educacao', 'seguranca', 'ambiental', 'agro', 'infraestrutura', 'digital'].includes(lei.categoria);
  const executionTags = ['fundo', 'programa', 'credito', 'investimento', 'compras', 'subsidio', 'estados', 'municipios', 'industria', 'energia', 'dados', 'defesa', 'tratado', 'estoques', 'concessao'];
  const operational = lei.instrumento !== 'PEC' && (alwaysOperational || hasAny(tags, executionTags));
  const etapas = [];
  if (operational) etapas.push('Decreto presidencial de implementação');
  if (['saude', 'educacao', 'seguranca', 'infraestrutura', 'agro'].includes(lei.categoria)) etapas.push('Pactuação federativa e normas setoriais');
  if (hasAny(tags, ['fundo', 'credito', 'subsidio', 'investimento', 'compras', 'infraestrutura'])) etapas.push('Dotação orçamentária e critérios de execução');
  if (['digital', 'ambiental', 'economia', 'tributacao'].includes(lei.categoria)) etapas.push('Regulamentação técnica por autoridade competente');
  return {
    necessaria: operational,
    prazoTurnos: lei.complexidade === 'alta' ? 4 : lei.complexidade === 'media' ? 3 : 2,
    etapas: [...new Set(etapas)].slice(0, 4),
    riscoInercia: clamp((lei.complexidade === 'alta' ? 58 : lei.complexidade === 'media' ? 42 : 28) + Math.round((lei.polarizacao || 40) / 8)),
  };
};

const deriveRisks = (lei) => {
  const [stfBase, tcuBase] = categoryRiskBias[lei.categoria] || [25, 25];
  const tags = lei.tags || [];
  const pec = lei.instrumento === 'PEC' ? -12 : 0;
  const stfTag = hasAny(tags, ['direitos', 'federalismo', 'armas', 'dados', 'privacidade', 'judiciario', 'eleitoral', 'licenciamento', 'terra']) ? 18 : 0;
  const tcuTag = hasAny(tags, ['fundo', 'credito', 'compras', 'investimento', 'concessao', 'infraestrutura', 'subsidio', 'estatal']) ? 18 : 0;
  return {
    stf: clamp(stfBase + Math.round((lei.polarizacao || 40) * 0.35) + stfTag + pec),
    tcu: clamp(tcuBase + Math.round((lei.complexidade === 'alta' ? 22 : lei.complexidade === 'media' ? 12 : 6)) + tcuTag),
    federativo: clamp((hasAny(tags, ['federalismo', 'estados', 'municipios', 'icms', 'royalties']) ? 70 : 22) + (['saude','educacao','seguranca','infraestrutura'].includes(lei.categoria) ? 15 : 0)),
    implementacao: clamp((lei.complexidade === 'alta' ? 68 : lei.complexidade === 'media' ? 48 : 30) + Math.round((lei.polarizacao || 40) / 10)),
  };
};

const deriveOrigins = (lei) => {
  const origins = ['executivo'];
  if (!hasAny(lei.tags || [], ['tratado', 'defesa'])) origins.push('congresso');
  if (hasAny(lei.tags || [], ['federalismo', 'estados', 'municipios', 'divida_estadual', 'icms', 'royalties', 'saneamento', 'seguranca', 'educacao', 'saude', 'infraestrutura'])) origins.push('governadores');
  return [...new Set(origins)];
};

export const enriquecerLeiLegislativa = (lei) => {
  const blueprint = CATEGORY_BLUEPRINTS[lei.categoria] || CATEGORY_BLUEPRINTS.institucional;
  const specific = SPECIFIC_CHAINS[lei.id];
  const cadeiaConsequencias = lei.cadeiaConsequencias || (specific
    ? specific.map(([titulo, descricao], index) => ({ etapa: ['sanção','implementação','controle','legado'][index] || `etapa_${index+1}`, titulo, descricao }))
    : createGenericChain(lei, blueprint));
  const regulamentacao = { ...deriveRegulation(lei), ...(lei.regulamentacao || {}) };
  const riscosControle = { ...deriveRisks(lei), ...(lei.riscosControle || {}) };
  const programasDerivados = lei.programasDerivados || (regulamentacao.necessaria ? [blueprint.programa] : []);

  return {
    ...lei,
    eixoEstrategico: lei.eixoEstrategico || blueprint.eixo,
    cadeiaConsequencias,
    regulamentacao,
    riscosControle,
    programasDerivados,
    atoresAfetados: lei.atoresAfetados || blueprint.grupos,
    origensPermitidas: lei.origensPermitidas || deriveOrigins(lei),
    legadoPotencial: lei.legadoPotencial || blueprint.longoPrazo,
    versaoCatalogo: '4.9.6.1',
  };
};

export const resumoRiscoLegislativo = (lei) => ({
  stf: lei?.riscosControle?.stf ?? 0,
  tcu: lei?.riscosControle?.tcu ?? 0,
  federativo: lei?.riscosControle?.federativo ?? 0,
  implementacao: lei?.riscosControle?.implementacao ?? 0,
});

export default enriquecerLeiLegislativa;
