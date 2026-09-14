// src/data/seed/cartasDiplomaticas.js

export const cartasDiplomaticasSeed = [
  // === NÍVEL 1 (BÁSICO) ===
  { 
    id: 'acordo_comercial', 
    titulo: 'Acordo Comercial', 
    tipo: 'economico', 
    desc: 'Redução tarifária mútua com nações parceiras.', 
    pressao: 10, 
    confianca: 10, 
    custo: 1, 
    icon: 'DollarSign', 
    cor: 'border-green-500 bg-green-50',
    nivelNecessario: 1,
    efeitos: {
      economia: { crescimentoPib: 0.2, comercioExterior: 5 },
      relacao: { aliados: 5, neutros: 3 }
    },
    desbloqueioCondicional: null 
  },
  { 
    id: 'banquete_oficial', 
    titulo: 'Banquete Oficial', 
    tipo: 'diplomatico', 
    desc: 'Jantar de gala para construir confiança e laços pessoais.', 
    pressao: -5, 
    confianca: 20, 
    custo: 1, 
    icon: 'Briefcase', 
    cor: 'border-purple-500 bg-purple-50',
    nivelNecessario: 1,
    efeitos: {
      relacao: { todos: 15 },
      capitalPolitico: 3
    }
  },
  { 
    id: 'pressao_politica', 
    titulo: 'Pressão Política', 
    tipo: 'geopolitica', 
    desc: 'Usa influência regional e alianças para pressionar.', 
    pressao: 20, 
    confianca: -5, 
    custo: 1, 
    icon: 'Globe', 
    cor: 'border-blue-500 bg-blue-50',
    nivelNecessario: 1,
    efeitos: {
      pressao: { alvo: 25, outros: 5 },
      risco: { instabilidade: 10 }
    }
  },
  { 
    id: 'trunfo_amazonico', 
    titulo: 'Trunfo Amazônico', 
    tipo: 'ambiental', 
    desc: 'Apelo climático e biodiversidade como moeda diplomática.', 
    pressao: 15, 
    confianca: 15, 
    custo: 1, 
    icon: 'Sprout', 
    cor: 'border-emerald-500 bg-emerald-50',
    nivelNecessario: 1,
    efeitos: {
      ambiental: { imagemExterna: 20, pressaoAmbiental: -15 },
      softPower: 10
    }
  },
  { 
    id: 'blefe_arriscado', 
    titulo: 'Blefe Arriscado', 
    tipo: 'especial', 
    desc: 'Alto risco, alta recompensa. Pode queimar pontes.', 
    pressao: 40, 
    confianca: -20, 
    custo: 2, 
    icon: 'AlertTriangle', 
    cor: 'border-yellow-500 bg-yellow-50',
    nivelNecessario: 1,
    efeitos: {
      pressao: { alvo: 40, risco: 30 },
      relacao: { aliados: -10, rivais: -15 }
    }
  },

  // === NÍVEL 2 (INTERMEDIÁRIO) ===
  { 
    id: 'diplomacia_cultural', 
    titulo: 'Diplomacia Cultural', 
    tipo: 'diplomatico', 
    desc: 'Samba, futebol e cultura brasileira como ponte internacional.', 
    pressao: 0, 
    confianca: 35, 
    custo: 1, 
    icon: 'Music', 
    cor: 'border-pink-500 bg-pink-50',
    nivelNecessario: 2,
    efeitos: {
      softPower: 25,
      relacao: { todos: 10 },
      turismo: 8
    }
  },
  { 
    id: 'ajuda_humanitaria', 
    titulo: 'Ajuda Humanitária', 
    tipo: 'diplomatico', 
    desc: 'Oferece ajuda médica e alimentos em crises internacionais.', 
    pressao: -10, 
    confianca: 25, 
    custo: 1, 
    icon: 'HeartHandshake', 
    cor: 'border-red-500 bg-red-50',
    nivelNecessario: 2,
    efeitos: {
      imagemExterna: 30,
      relacao: { recebedor: 35, vizinhos: 10 },
      custoOrcamento: 200
    }
  },
  { 
    id: 'veto_onu', 
    titulo: 'Veto no Conselho de Segurança', 
    tipo: 'geopolitica', 
    desc: 'Usa assento temporário no CS da ONU para bloquear resolução.', 
    pressao: 30, 
    confianca: -15, 
    custo: 2, 
    icon: 'ShieldAlert', 
    cor: 'border-gray-700 bg-gray-100',
    nivelNecessario: 2,
    efeitos: {
      pressao: { alvo: 40, aliadosAlvo: 15 },
      softPower: -10,
      risco: { retaliacao: 25 }
    },
    desbloqueioCondicional: { tipo: 'evento', id: 'brasil_cs_onu' } 
  },
  { 
    id: 'pressao_midia', 
    titulo: 'Pressão na Mídia Internacional', 
    tipo: 'geopolitica', 
    desc: 'Vazamentos estratégicos para a imprensa internacional.', 
    pressao: 30, 
    confianca: -20, 
    custo: 1, 
    icon: 'Radio', 
    cor: 'border-blue-400 bg-blue-50',
    nivelNecessario: 2,
    efeitos: {
      pressao: { alvo: 30, opiniaoPublica: 20 },
      risco: { escandalo: 15 }
    }
  },
  { 
    id: 'diplomacia_sanitaria', 
    titulo: 'Diplomacia Sanitária', 
    tipo: 'diplomatico', 
    desc: 'Vacinas e ajuda médica como moeda de influência.', 
    pressao: -15, 
    confianca: 40, 
    custo: 2, 
    icon: 'HeartPulse', 
    cor: 'border-red-400 bg-red-50',
    nivelNecessario: 2,
    efeitos: {
      relacao: { todos: 20, recebedor: 45 },
      saude: { prestigio: 25 },
      custoOrcamento: 150
    }
  },

  // === NÍVEL 3 (AVANÇADO) ===
  { 
    id: 'financiamento_bndes', 
    titulo: 'Financiamento BNDES para Obras', 
    tipo: 'economico', 
    desc: 'Crédito brasileiro para infraestrutura no exterior.', 
    pressao: 15, 
    confianca: 20, 
    custo: 1, 
    icon: 'Banknote', 
    cor: 'border-green-600 bg-green-100',
    nivelNecessario: 3,
    efeitos: {
      economia: { exportacoes: 15, influencia: 20 },
      custoOrcamento: 500,
      relacao: { recebedor: 30, credores: -10 }
    }
  },
  { 
    id: 'cooperacao_militar', 
    titulo: 'Cooperação Militar', 
    tipo: 'militar', 
    desc: 'Exercícios conjuntos, treinamento e transferência de know-how.', 
    pressao: 25, 
    confianca: 10, 
    custo: 2, 
    icon: 'Shield', 
    cor: 'border-gray-800 bg-gray-200',
    nivelNecessario: 3,
    efeitos: {
      militar: { capacidade: 15, inteligencia: 10 },
      relacao: { aliado: 25, rivais: -15 },
      risco: { escalada: 20 }
    }
  },
  { 
    id: 'transferencia_tecnologia', 
    titulo: 'Transferência de Tecnologia', 
    tipo: 'economico', 
    desc: 'Compartilha know-how agrícola ou industrial.', 
    pressao: 5, 
    confianca: 30, 
    custo: 2, 
    icon: 'Cpu', 
    cor: 'border-blue-600 bg-blue-100',
    nivelNecessario: 3,
    efeitos: {
      economia: { produtividade: 15, inovacao: 10 },
      relacao: { recebedor: 40 },
      softPower: 15
    }
  },
  { 
    id: 'crise_oportunidade', 
    titulo: 'Crise é Oportunidade', 
    tipo: 'geopolitica', 
    desc: 'Aproveita crise internacional para ganhar vantagem estratégica.', 
    pressao: 45, 
    confianca: -10, 
    custo: 2, 
    icon: 'AlertCircle', 
    cor: 'border-orange-500 bg-orange-50',
    nivelNecessario: 3,
    efeitos: {
      pressao: { alvo: 50, oportunidade: 30 },
      risco: { retaliacao: 40, instabilidade: 25 }
    },
    desbloqueioCondicional: { tipo: 'condicao', id: 'tensao_global_70' } 
  },

  // === NÍVEL 4 (ESTRATÉGICO) ===
  { 
    id: 'revolucao_agro', 
    titulo: 'Revolução Agro-Tecnológica', 
    tipo: 'economico', 
    desc: 'Exporta tecnologia de ponta em agricultura tropical.', 
    pressao: 20, 
    confianca: 15, 
    custo: 1, 
    icon: 'Sprout', 
    cor: 'border-emerald-600 bg-emerald-100',
    nivelNecessario: 4,
    efeitos: {
      economia: { agroExportacoes: 25, pib: 0.5 },
      softPower: 20,
      relacao: { importadores: 30 }
    }
  },
  { 
    id: 'alianca_ambiental', 
    titulo: 'Aliança Ambiental Bilateral', 
    tipo: 'ambiental', 
    desc: 'Pacto verde com metas compartilhadas de redução de carbono.', 
    pressao: 10, 
    confianca: 25, 
    custo: 1, 
    icon: 'Leaf', 
    cor: 'border-green-700 bg-green-50',
    nivelNecessario: 4,
    efeitos: {
      ambiental: { creditoCarbono: 200, imagemExterna: 35 },
      economia: { investimentoVerde: 15 },
      relacao: { aliado: 30, petroliferas: -20 }
    }
  },
  { 
    id: 'media_strategy', 
    titulo: 'Estratégia de Mídia Global', 
    tipo: 'diplomatico', 
    desc: 'Campanha internacional para melhorar imagem do Brasil.', 
    pressao: 5, 
    confianca: 20, 
    custo: 1, 
    icon: 'Newspaper', 
    cor: 'border-purple-600 bg-purple-100',
    nivelNecessario: 4,
    efeitos: {
      softPower: 30,
      turismo: 15,
      relacao: { opiniãoPublica: 25 }
    }
  },
  { 
    id: 'acordo_minerais', 
    titulo: 'Acordo de Minerais Estratégicos', 
    tipo: 'economico', 
    desc: 'Garante acesso a nióbio, lítio e terras raras.', 
    pressao: 25, 
    confianca: 15, 
    custo: 2, 
    icon: 'Gem', 
    cor: 'border-amber-600 bg-amber-100',
    nivelNecessario: 4,
    efeitos: {
      economia: { mineracao: 30, segurancaEnergetica: 25 },
      relacao: { parceiro: 35, concorrentes: -25 },
      militar: { recursosEstrategicos: 20 }
    }
  },

  // === NÍVEL 5 (ESPECIALISTA) ===
  { 
    id: 'lider_climatico', 
    titulo: 'Líder Climático Global', 
    tipo: 'ambiental', 
    desc: 'Posiciona Brasil como referência mundial em política verde.', 
    pressao: 30, 
    confianca: 30, 
    custo: 2, 
    icon: 'Wind', 
    cor: 'border-teal-500 bg-teal-50',
    nivelNecessario: 5,
    efeitos: {
      ambiental: { lideranca: 50, pressaoAmbiental: -40 },
      softPower: 40,
      economia: { investimentoSustentavel: 25 },
      relacao: { ambientalistas: 45, poluidores: -30 }
    }
  },
  { 
    id: 'acordo_petroleo', 
    titulo: 'Acordo Petrolífero Estratégico', 
    tipo: 'economico', 
    desc: 'Cooperação em exploração de petróleo em águas profundas.', 
    pressao: 35, 
    confianca: 5, 
    custo: 2, 
    icon: 'Droplet', 
    cor: 'border-black bg-gray-300',
    nivelNecessario: 5,
    efeitos: {
      economia: { petroleo: 30, energia: 25 },
      ambiental: { imagemExterna: -25, pressaoAmbiental: 30 },
      relacao: { produtores: 40, ambientalistas: -35 }
    },
    desbloqueioCondicional: { tipo: 'recurso', id: 'petroleo_pre_sal' } 
  },
  { 
    id: 'parceria_espacial', 
    titulo: 'Parceria Espacial', 
    tipo: 'tecnologico', 
    desc: 'Cooperação em satélites, foguetes e exploração espacial.', 
    pressao: 15, 
    confianca: 35, 
    custo: 3, 
    icon: 'Satellite', 
    cor: 'border-indigo-500 bg-indigo-50',
    nivelNecessario: 5,
    efeitos: {
      tecnologia: { espacial: 40, defesa: 25 },
      softPower: 35,
      relacao: { parceiro: 45, concorrentes: -20 }
    }
  },
  { 
    id: 'parceria_tecnologica', 
    titulo: 'Parceria Tecnológica Avançada', 
    tipo: 'tecnologico', 
    desc: 'Cooperação em IA, 5G e computação quântica.', 
    pressao: 20, 
    confianca: 30, 
    custo: 3, 
    icon: 'Cpu', 
    cor: 'border-indigo-600 bg-indigo-100',
    nivelNecessario: 5,
    efeitos: {
      tecnologia: { inovacao: 35, competitividade: 30 },
      economia: { pib: 0.8, exportacoesTec: 40 },
      seguranca: { cibernetica: 25 }
    }
  },

  // === NÍVEL 6 (MESTRE) ===
  { 
    id: 'submarino_nuclear', 
    titulo: 'Submarino Nuclear', 
    tipo: 'militar', 
    desc: 'Projeção de força naval no Atlântico Sul.', 
    pressao: 50, 
    confianca: -30, 
    custo: 3, 
    icon: 'Ship', 
    cor: 'border-red-700 bg-red-100',
    nivelNecessario: 6,
    efeitos: {
      militar: { dissuasao: 60, capacidadeNaval: 45 },
      relacao: { aliados: 20, rivais: -40, neutros: -15 },
      risco: { corridaArmamentista: 50, tensaoRegional: 35 }
    }
  },
  { 
    id: 'moeda_bilateral', 
    titulo: 'Moeda Bilateral', 
    tipo: 'economico', 
    desc: 'Acordo para usar moedas locais no comércio, contornando o dólar.', 
    pressao: 40, 
    confianca: 20, 
    custo: 3, 
    icon: 'Currency', 
    cor: 'border-yellow-600 bg-yellow-100',
    nivelNecessario: 6,
    efeitos: {
      economia: { independenciaFinanceira: 50, custoTransacao: -25 },
      relacao: { parceiro: 45, eua: -35 },
      risco: { retaliacaoFinanceira: 40 }
    }
  },
  { 
    id: 'tratado_defesa_mutua', 
    titulo: 'Tratado de Defesa Mútua', 
    tipo: 'militar', 
    desc: 'Compromisso de defesa militar em caso de ataque.', 
    pressao: 60, 
    confianca: 40, 
    custo: 4, 
    icon: 'ShieldCheck', 
    cor: 'border-blue-800 bg-blue-200',
    nivelNecessario: 6,
    efeitos: {
      militar: { alianca: 70, seguranca: 55 },
      relacao: { aliado: 60, rivais: -50 },
      custo: { defesa: 300, manutencao: 100 },
      risco: { envolvimentoConflito: 65 }
    }
  },

  // === CARTAS ESPECIAIS (DESBLOQUEIO CONDICIONAL) ===
  { 
    id: 'carta_lula', 
    titulo: 'Carisma Lula', 
    tipo: 'diplomatico', 
    desc: 'Carisma pessoal e histórico em negociações internacionais difíceis.', 
    pressao: 0, 
    confianca: 50, 
    custo: 1, 
    icon: 'User', 
    cor: 'border-rose-500 bg-rose-50',
    nivelNecessario: 0,
    efeitos: {
      relacao: { todos: 30, esquerda: 45 },
      softPower: 25,
      capitalPolitico: 20
    },
    desbloqueioCondicional: { tipo: 'evento', id: 'lula_presidencia' } 
  },
  { 
    id: 'soft_power_global', 
    titulo: 'Soft Power Global', 
    tipo: 'diplomatico', 
    desc: 'Prestígio internacional em jogo em negociações delicadas.', 
    pressao: 10, 
    confianca: 45, 
    custo: 2, 
    icon: 'Award', 
    cor: 'border-gold-500 bg-gold-50',
    nivelNecessario: 0,
    efeitos: {
      softPower: 50,
      imagemExterna: 40,
      relacao: { todos: 20 },
      economia: { turismo: 25, investimento: 20 }
    },
    desbloqueioCondicional: { tipo: 'status', id: 'soft_power_80' } 
  },
  { 
    id: 'carta_bolsonaro', 
    titulo: 'Polêmica Calculada', 
    tipo: 'geopolitica', 
    desc: 'Declarações polêmicas que mobilizam base, mas isolam internacionalmente.', 
    pressao: 35, 
    confianca: -40, 
    custo: 1, 
    icon: 'Megaphone', 
    cor: 'border-blue-500 bg-blue-50',
    nivelNecessario: 0,
    efeitos: {
      pressao: { alvo: 40, baseEleitoral: 25 },
      relacao: { aliados: -30, rivais: 15 },
      popularidade: { direita: 20, esquerda: -30, centro: -15 }
    },
    desbloqueioCondicional: { tipo: 'evento', id: 'bolsonaro_presidencia' } 
  },
  { 
    id: 'carta_dilma', 
    titulo: 'Diplomacia Sul-Sul', 
    tipo: 'diplomatico', 
    desc: 'Foco em relações com países em desenvolvimento e fóruns do Sul Global.', 
    pressao: 5, 
    confianca: 25, 
    custo: 1, 
    icon: 'Users', 
    cor: 'border-green-500 bg-green-50',
    nivelNecessario: 0,
    efeitos: {
      relacao: { sulGlobal: 40, brics: 35, ocidente: -10 },
      softPower: 20,
      economia: { comercioSul: 25 }
    },
    desbloqueioCondicional: { tipo: 'evento', id: 'dilma_presidencia' } 
  },
  { 
    id: 'carta_fhc', 
    titulo: 'Diplomacia Técnica', 
    tipo: 'diplomatico', 
    desc: 'Abordagem técnica e institucional nas relações internacionais.', 
    pressao: 0, 
    confianca: 35, 
    custo: 1, 
    icon: 'GraduationCap', 
    cor: 'border-purple-500 bg-purple-50',
    nivelNecessario: 0,
    efeitos: {
      relacao: { ocidente: 30, mercosul: 15, instituicoes: 40 },
      confiancaMercado: 25,
      riscoPais: -20
    },
    desbloqueioCondicional: { tipo: 'evento', id: 'fhc_presidencia' } 
  },
  { 
    id: 'carta_itaipu', 
    titulo: 'Trunfo Energético', 
    tipo: 'economico', 
    desc: 'Usa a influência na maior hidrelétrica do mundo como moeda.', 
    pressao: 25, 
    confianca: 20, 
    custo: 2, 
    icon: 'Zap', 
    cor: 'border-blue-500 bg-blue-50',
    nivelNecessario: 3,
    efeitos: {
      energia: { influencia: 40, receita: 300 },
      relacao: { paraguai: 35, argentina: 20, bolivia: 15 },
      pressao: { regiao: 30 }
    },
    desbloqueioCondicional: { tipo: 'recurso', id: 'controle_itaipu' } 
  }
];