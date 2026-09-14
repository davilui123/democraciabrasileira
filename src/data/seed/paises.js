// src/data/seed/paises.js

export const paisesSeed = [
  // ============================================
  // POTÊNCIAS GLOBAIS (3)
  // ============================================
  { 
    id: 'us', 
    nome: 'Estados Unidos', 
    relacao: 60, 
    alinhamento: 'ocidente', 
    pib: 26000000000000, // 26 trilhões
    pibFormatado: '26T',
    regiao: 'america_norte', 
    blocos: ['otan', 'ocde'], 
    recursos: ['tecnologia', 'armas', 'financas'], 
    softPower: 95, 
    pressaoAmbiental: 50,
    moeda: 'USD',
    populacao: 331900000,
    icone: '🇺🇸',
    descricao: 'Potência global hegemônica. Lidera o bloco ocidental e possui influência militar, econômica e cultural global.',
    pontosFortes: ['Tecnologia', 'Força Militar', 'Mercado Financeiro'],
    pontosFracos: ['Dívida Pública', 'Polarização Política'],
    interessesNoBrasil: ['Mercado de Consumo', 'Recursos Naturais', 'Contenção da China']
  },
  { 
    id: 'cn', 
    nome: 'China', 
    relacao: 75, 
    alinhamento: 'brics', 
    pib: 19000000000000, // 19 trilhões
    pibFormatado: '19T',
    regiao: 'asia', 
    blocos: ['brics'], 
    recursos: ['manufatura', 'tecnologia', 'minerais'], 
    softPower: 80, 
    pressaoAmbiental: 40,
    moeda: 'CNY',
    populacao: 1412000000,
    icone: '🇨🇳',
    descricao: 'Potência em ascensão. Maior parceiro comercial do Brasil, com investimentos massivos em infraestrutura.',
    pontosFortes: ['Manufatura', 'Investimento Externo', 'Tecnologia 5G'],
    pontosFracos: ['Dependência de Exportação', 'Questões de Direitos Humanos'],
    interessesNoBrasil: ['Soja e Minério', 'Infraestrutura (Rota da Seda)', 'Influência na América Latina']
  },
  { 
    id: 'ru', 
    nome: 'Rússia', 
    relacao: 70, 
    alinhamento: 'brics', 
    pib: 1800000000000, // 1.8 trilhão
    pibFormatado: '1.8T',
    regiao: 'europa_leste', 
    blocos: ['brics'], 
    recursos: ['energia', 'armas', 'trigo'], 
    softPower: 40, 
    pressaoAmbiental: 10,
    emGuerra: true,
    moeda: 'RUB',
    populacao: 144100000,
    icone: '🇷🇺',
    descricao: 'Potência energética e militar. Parceiro tradicional em defesa e energia nuclear.',
    pontosFortes: ['Recursos Energéticos', 'Tecnologia Militar', 'Veto na ONU'],
    pontosFracos: ['Sanções Internacionais', 'Economia Monocêntrica'],
    interessesNoBrasil: ['Vendas de Armamentos', 'Cooperação Nuclear', 'Apoio em Fóruns Internacionais']
  },

  // ============================================
  // EUROPA OCIDENTAL (7)
  // ============================================
  { 
    id: 'de', 
    nome: 'Alemanha', 
    relacao: 65, 
    alinhamento: 'ocidente', 
    pib: 4200000000000, // 4.2 trilhões
    pibFormatado: '4.2T',
    regiao: 'europa', 
    blocos: ['ue', 'otan', 'ocde'], 
    recursos: ['tecnologia', 'industria'], 
    softPower: 85, 
    pressaoAmbiental: 90,
    moeda: 'EUR',
    populacao: 83200000,
    icone: '🇩🇪',
    descricao: 'Líder econômico da UE. Principal destino das exportações brasileiras de manufaturados na Europa.',
    pontosFortes: ['Engenharia de Precisão', 'Exportação de Máquinas', 'Energias Renováveis'],
    pontosFracos: ['Dependência de Gás Russo', 'Envelhecimento Populacional'],
    interessesNoBrasil: ['Commodities Agrícolas', 'Transição Energética', 'Projetos de Infraestrutura Verde']
  },
  { 
    id: 'fr', 
    nome: 'França', 
    relacao: 50, 
    alinhamento: 'ocidente', 
    pib: 2900000000000, // 2.9 trilhões
    pibFormatado: '2.9T',
    regiao: 'europa', 
    blocos: ['ue', 'otan', 'ocde'], 
    recursos: ['energia_nuclear', 'diplomacia'], 
    softPower: 90, 
    pressaoAmbiental: 95,
    moeda: 'EUR',
    populacao: 67400000,
    icone: '🇫🇷',
    descricao: 'Potência nuclear e diplomática. Influência cultural global e assento permanente no Conselho de Segurança.',
    pontosFortes: ['Energia Nuclear', 'Indústria de Defesa', 'Diplomacia'],
    pontosFracos: ['Protestos Sociais Frequentes', 'Déficit Comercial'],
    interessesNoBrasil: ['Venda de Submarinos', 'Cooperação Nuclear', 'Acordos Culturais']
  },
  { 
    id: 'gb', 
    nome: 'Reino Unido', 
    relacao: 55, 
    alinhamento: 'ocidente', 
    pib: 3100000000000, // 3.1 trilhões
    pibFormatado: '3.1T',
    regiao: 'europa', 
    blocos: ['otan', 'ocde'], 
    recursos: ['financas', 'inteligencia'], 
    softPower: 85, 
    pressaoAmbiental: 80,
    moeda: 'GBP',
    populacao: 67200000,
    icone: '🇬🇧',
    descricao: 'Centro financeiro global pós-Brexit. Forte tradição diplomática e serviços financeiros.',
    pontosFortes: ['Serviços Financeiros', 'Inteligência (MI6)', 'Universidades de Elite'],
    pontosFracos: ['Impactos do Brexit', 'Desigualdade Regional'],
    interessesNoBrasil: ['Investimentos Financeiros', 'Cooperação em Inteligência', 'Educação Superior']
  },
  { 
    id: 'it', 
    nome: 'Itália', 
    relacao: 70, 
    alinhamento: 'ocidente', 
    pib: 2100000000000, // 2.1 trilhões
    pibFormatado: '2.1T',
    regiao: 'europa', 
    blocos: ['ue', 'otan', 'ocde'], 
    recursos: ['cultura', 'luxo'], 
    softPower: 80, 
    pressaoAmbiental: 70,
    moeda: 'EUR',
    populacao: 59500000,
    icone: '🇮🇹',
    descricao: 'Potência cultural e industrial. Parceiro comercial importante e destino de imigrantes brasileiros.',
    pontosFortes: ['Moda e Design', 'Turismo', 'Indústria Automotiva'],
    pontosFracos: ['Dívida Pública Alta', 'Crescimento Econômico Lento'],
    interessesNoBrasil: ['Exportação de Máquinas', 'Turismo Brasileiro na Itália', 'Comunidade Italiana no Brasil']
  },
  { 
    id: 'es', 
    nome: 'Espanha', 
    relacao: 75, 
    alinhamento: 'ocidente', 
    pib: 1500000000000, // 1.5 trilhão
    pibFormatado: '1.5T',
    regiao: 'europa', 
    blocos: ['ue', 'otan', 'ocde'], 
    recursos: ['turismo', 'infra'], 
    softPower: 75, 
    pressaoAmbiental: 75,
    moeda: 'EUR',
    populacao: 47300000,
    icone: '🇪🇸',
    descricao: 'Principal porta de entrada do Brasil na Europa. Fortes laços culturais e linguísticos.',
    pontosFortes: ['Turismo', 'Infraestrutura', 'Língua Global'],
    pontosFracos: ['Desemprego Juvenil', 'Tensões Regionais (Catalunha)'],
    interessesNoBrasil: ['Bancos Espanhóis', 'Turismo', 'Influência Cultural']
  },
  { 
    id: 'pt', 
    nome: 'Portugal', 
    relacao: 95, 
    alinhamento: 'ocidente', 
    pib: 260000000000, // 260 bilhões
    pibFormatado: '260B',
    regiao: 'europa', 
    blocos: ['ue', 'otan', 'ocde'], 
    recursos: ['diplomacia', 'turismo'], 
    softPower: 60, 
    pressaoAmbiental: 70,
    moeda: 'EUR',
    populacao: 10300000,
    icone: '🇵🇹',
    descricao: 'Aliado histórico e cultural. Relação especial com o Brasil através da língua e história compartilhadas.',
    pontosFortes: ['Diplomacia', 'Turismo', 'Relações com Ex-Colônias'],
    pontosFracos: ['Economia Pequena', 'Dependência do Turismo'],
    interessesNoBrasil: ['Investimentos em Energia', 'Turismo', 'Diplomacia Cultural']
  },
  { 
    id: 'no', 
    nome: 'Noruega', 
    relacao: 60, 
    alinhamento: 'ocidente', 
    pib: 500000000000, // 500 bilhões
    pibFormatado: '500B',
    regiao: 'europa', 
    blocos: ['otan', 'ocde'], 
    recursos: ['energia', 'fundo_soberano'], 
    softPower: 90, 
    pressaoAmbiental: 100,
    moeda: 'NOK',
    populacao: 5400000,
    icone: '🇳🇴',
    descricao: 'Potência ambiental e energética. Maior fundo soberano do mundo e líder em energia limpa.',
    pontosFortes: ['Fundo Soberano (US$ 1.4T)', 'Energia Hidrelétrica', 'Qualidade de Vida'],
    pontosFracos: ['Dependência do Petróleo', 'População Pequena'],
    interessesNoBrasil: ['Investimentos Ambientais', 'Cooperação em Energia Limpa', 'Projetos na Amazônia']
  },

  // ============================================
  // AMÉRICA LATINA (7)
  // ============================================
  { 
    id: 'ar', 
    nome: 'Argentina', 
    relacao: 80, 
    alinhamento: 'mercosul', 
    pib: 600000000000, // 600 bilhões
    pibFormatado: '600B',
    regiao: 'america_sul', 
    blocos: ['mercosul'], 
    recursos: ['agro', 'gas'], 
    softPower: 50, 
    pressaoAmbiental: 30,
    moeda: 'ARS',
    populacao: 45800000,
    icone: '🇦🇷',
    descricao: 'Principal parceiro no Mercosul. Relação de cooperação e competição, especialmente no agronegócio.',
    pontosFortes: ['Agronegócio', 'Recursos Energéticos', 'Cultura'],
    pontosFracos: ['Instabilidade Econômica', 'Inflação Crônica'],
    interessesNoBrasil: ['Equilíbrio no Mercosul', 'Acesso ao Mercado Brasileiro', 'Cooperação Energética']
  },
  { 
    id: 'cl', 
    nome: 'Chile', 
    relacao: 85, 
    alinhamento: 'neutro', 
    pib: 350000000000, // 350 bilhões
    pibFormatado: '350B',
    regiao: 'america_sul', 
    blocos: ['ocde'], 
    recursos: ['cobre', 'litio'], 
    softPower: 60, 
    pressaoAmbiental: 60,
    moeda: 'CLP',
    populacao: 19100000,
    icone: '🇨🇱',
    descricao: 'País mais estável da América do Sul. Modelo econômico liberal e maior produtor de cobre do mundo.',
    pontosFortes: ['Estabilidade Institucional', 'Recursos Minerais', 'Tratados Livre Comércio'],
    pontosFracos: ['Dependência do Cobre', 'Desigualdade Social'],
    interessesNoBrasil: ['Acesso ao Mercado Brasileiro', 'Cooperação em Mineração', 'Integração Física']
  },
  { 
    id: 'co', 
    nome: 'Colômbia', 
    relacao: 80, 
    alinhamento: 'neutro', 
    pib: 360000000000, // 360 bilhões
    pibFormatado: '360B',
    regiao: 'america_sul', 
    blocos: [], 
    recursos: ['cafe', 'carvao'], 
    softPower: 50, 
    pressaoAmbiental: 70,
    moeda: 'COP',
    populacao: 51200000,
    icone: '🇨🇴',
    descricao: 'Aliado estratégico no combate ao narcotráfico. Importante parceiro comercial e de segurança.',
    pontosFortes: ['Segurança Interna (pós-conflito)', 'Exportação de Café', 'Localização Geográfica'],
    pontosFracos: ['Narcotráfico', 'Desigualdade Regional'],
    interessesNoBrasil: ['Cooperação em Segurança', 'Integração de Infraestrutura', 'Comércio Bilateral']
  },
  { 
    id: 've', 
    nome: 'Venezuela', 
    relacao: 40, 
    alinhamento: 'anti_imperialista', 
    pib: 100000000000, // 100 bilhões
    pibFormatado: '100B',
    regiao: 'america_sul', 
    blocos: [], 
    recursos: ['petroleo'], 
    softPower: 20, 
    pressaoAmbiental: 20,
    moeda: 'VES',
    populacao: 28400000,
    icone: '🇻🇪',
    descricao: 'País em crise humanitária. Relação complicada devido a divergências políticas e fluxo de refugiados.',
    pontosFortes: ['Maiores Reservas de Petróleo', 'Localização Estratégica'],
    pontosFracos: ['Colapso Econômico', 'Crise Humanitária', 'Isolamento Internacional'],
    interessesNoBrasil: ['Ajuda Humanitária', 'Mediação Política', 'Contenção da Migração']
  },
  { 
    id: 'mx', 
    nome: 'México', 
    relacao: 75, 
    alinhamento: 'neutro', 
    pib: 1600000000000, // 1.6 trilhão
    pibFormatado: '1.6T',
    regiao: 'america_norte', 
    blocos: ['ocde'], 
    recursos: ['manufatura', 'cultura'], 
    softPower: 70, 
    pressaoAmbiental: 50,
    moeda: 'MXN',
    populacao: 126700000,
    icone: '🇲🇽',
    descricao: 'Principal parceiro comercial da América Latina fora do Mercosul. Porta de entrada para o NAFTA.',
    pontosFortes: ['Indústria Manufatureira', 'Acordos Comerciais', 'Cultura Global'],
    pontosFracos: ['Violência do Narcotráfico', 'Dependência dos EUA'],
    interessesNoBrasil: ['Diversificação Comercial', 'Cooperação Cultural', 'Posição na América Latina']
  },
  { 
    id: 'uy', 
    nome: 'Uruguai', 
    relacao: 90, 
    alinhamento: 'mercosul', 
    pib: 60000000000, // 60 bilhões
    pibFormatado: '60B',
    regiao: 'america_sul', 
    blocos: ['mercosul'], 
    recursos: ['agro', 'estabilidade'], 
    softPower: 65, 
    pressaoAmbiental: 80,
    moeda: 'UYU',
    populacao: 3400000,
    icone: '🇺🇾',
    descricao: 'País mais estável da região. Modelo de democracia e transparência na América Latina.',
    pontosFortes: ['Estabilidade Política', 'Transparência', 'Agronegócio Tecnificado'],
    pontosFracos: ['Economia Pequena', 'Dependência de Vizinhos'],
    interessesNoBrasil: ['Integração Econômica', 'Cooperação em Tecnologia Agrícola', 'Turismo']
  },
  { 
    id: 'py', 
    nome: 'Paraguai', 
    relacao: 85, 
    alinhamento: 'mercosul', 
    pib: 40000000000, // 40 bilhões
    pibFormatado: '40B',
    regiao: 'america_sul', 
    blocos: ['mercosul'], 
    recursos: ['energia', 'agro'], 
    softPower: 40, 
    pressaoAmbiental: 40,
    moeda: 'PYG',
    populacao: 6700000,
    icone: '🇵🇾',
    descricao: 'Aliado estratégico na hidrelétrica de Itaipu. Importante para segurança energética do Brasil.',
    pontosFortes: ['Energia Hidrelétrica (Itaipu)', 'Custo Baixo de Produção'],
    pontosFracos: ['Corrupção', 'Economia Informal'],
    interessesNoBrasil: ['Renegociação de Itaipu', 'Acesso ao Porto de Paranaguá', 'Comércio de Reexportação']
  },

  // ============================================
  // ÁSIA E ORIENTE MÉDIO (11)
  // ============================================
  { 
    id: 'in', 
    nome: 'Índia', 
    relacao: 80, 
    alinhamento: 'brics', 
    pib: 3700000000000, // 3.7 trilhões
    pibFormatado: '3.7T',
    regiao: 'asia', 
    blocos: ['brics'], 
    recursos: ['tecnologia', 'farmacos'], 
    softPower: 70, 
    pressaoAmbiental: 40,
    moeda: 'INR',
    populacao: 1408000000,
    icone: '🇮🇳',
    descricao: 'País em rápido crescimento. Parceiro estratégico nos BRICS com complementaridade econômica.',
    pontosFortes: ['Tecnologia da Informação', 'Indústria Farmacêutica', 'Mão de Obra Qualificada'],
    pontosFracos: ['Infraestrutura Deficiente', 'Tensões com Paquistão'],
    interessesNoBrasil: ['Fertilizantes', 'Tecnologia da Informação', 'Apoio para Reforma da ONU']
  },
  { 
    id: 'jp', 
    nome: 'Japão', 
    relacao: 60, 
    alinhamento: 'ocidente', 
    pib: 4100000000000, // 4.1 trilhões
    pibFormatado: '4.1T',
    regiao: 'asia', 
    blocos: ['ocde'], 
    recursos: ['tecnologia', 'capital'], 
    softPower: 85, 
    pressaoAmbiental: 60,
    moeda: 'JPY',
    populacao: 125700000,
    icone: '🇯🇵',
    descricao: 'Tecnologia de ponta e investimentos de longo prazo. Importante financiador de projetos no Brasil.',
    pontosFortes: ['Tecnologia Avançada', 'Poupança Interna', 'Qualidade Industrial'],
    pontosFracos: ['Dívida Pública Alta', 'Envelhecimento Populacional'],
    interessesNoBrasil: ['Soja e Carne', 'Infraestrutura', 'Comunidade Japonesa no Brasil']
  },
  { 
    id: 'kr', 
    nome: 'Coreia do Sul', 
    relacao: 65, 
    alinhamento: 'ocidente', 
    pib: 1700000000000, // 1.7 trilhão
    pibFormatado: '1.7T',
    regiao: 'asia', 
    blocos: ['ocde'], 
    recursos: ['tecnologia', 'industria'], 
    softPower: 80, 
    pressaoAmbiental: 55,
    moeda: 'KRW',
    populacao: 51700000,
    icone: '🇰🇷',
    descricao: 'Potência tecnológica e cultural. Investimentos significativos na indústria brasileira.',
    pontosFortes: ['Tecnologia (Samsung, Hyundai)', 'Cultura Pop (K-Pop)', 'Educação'],
    pontosFracos: ['Tensões com Coreia do Norte', 'Baixa Taxa de Natalidade'],
    interessesNoBrasil: ['Minério de Ferro', 'Mercado Automotivo', 'Cooperação em Ciência']
  },
  { 
    id: 'id', 
    nome: 'Indonésia', 
    relacao: 70, 
    alinhamento: 'neutro', 
    pib: 1400000000000, // 1.4 trilhão
    pibFormatado: '1.4T',
    regiao: 'asia', 
    blocos: [], 
    recursos: ['niquel', 'agro'], 
    softPower: 60, 
    pressaoAmbiental: 30,
    moeda: 'IDR',
    populacao: 273500000,
    icone: '🇮🇩',
    descricao: 'Maior economia do sudeste asiático. Parceiro importante no G20 e em commodities.',
    pontosFortes: ['Recursos Naturais', 'População Jovem', 'Crescimento Econômico'],
    pontosFracos: ['Corrupção', 'Infraestrutura Deficiente'],
    interessesNoBrasil: ['Cooperação em Agropecuária', 'Diálogo Sul-Sul', 'Comércio de Commodities']
  },
  { 
    id: 'sa', 
    nome: 'Arábia Saudita', 
    relacao: 60, 
    alinhamento: 'neutro', 
    pib: 1100000000000, // 1.1 trilhão
    pibFormatado: '1.1T',
    regiao: 'oriente_medio', 
    blocos: ['brics'], 
    recursos: ['petroleo', 'capital'], 
    softPower: 50, 
    pressaoAmbiental: 10,
    moeda: 'SAR',
    populacao: 35800000,
    icone: '🇸🇦',
    descricao: 'Maior exportador de petróleo do mundo. Investidor estratégico com fundos soberanos gigantescos.',
    pontosFortes: ['Reservas de Petróleo', 'Fundo Soberano', 'Influência no Mundo Árabe'],
    pontosFracos: ['Dependência do Petróleo', 'Direitos Humanos'],
    interessesNoBrasil: ['Investimento em Infraestrutura', 'Exportação de Frango Halal', 'Apoio em Organizações Islâmicas']
  },
  { 
    id: 'ir', 
    nome: 'Irã', 
    relacao: 50, 
    alinhamento: 'anti_imperialista', 
    pib: 400000000000, // 400 bilhões
    pibFormatado: '400B',
    regiao: 'oriente_medio', 
    blocos: ['brics'], 
    recursos: ['energia', 'geoestratégia'], 
    softPower: 30, 
    pressaoAmbiental: 10,
    moeda: 'IRR',
    populacao: 87900000,
    icone: '🇮🇷',
    descricao: 'Potência regional sob sanções. Relação complicada devido a pressões internacionais.',
    pontosFortes: ['Reservas de Gás', 'Influência Regional', 'Capacidade Militar'],
    pontosFracos: ['Sanções Internacionais', 'Isolamento Diplomático'],
    interessesNoBrasil: ['Venda de Petróleo', 'Apoio em Fóruns Internacionais', 'Contorno de Sanções']
  },
  { 
    id: 'il', 
    nome: 'Israel', 
    relacao: 50, 
    alinhamento: 'ocidente', 
    pib: 550000000000, // 550 bilhões
    pibFormatado: '550B',
    regiao: 'oriente_medio', 
    blocos: [], 
    recursos: ['tecnologia', 'militar'], 
    softPower: 60, 
    pressaoAmbiental: 40,
    moeda: 'ILS',
    populacao: 9300000,
    icone: '🇮🇱',
    descricao: 'Potência tecnológica e militar. Relação tensa devido a posicionamentos no conflito Israel-Palestina.',
    pontosFortes: ['Tecnologia de Defesa', 'Inovação em Startups', 'Agricultura de Precisão'],
    pontosFracos: ['Conflito com Palestina', 'Isolamento Regional'],
    interessesNoBrasil: ['Venda de Tecnologia Militar', 'Cooperação em Agricultura', 'Apoio da Comunidade Judaica']
  },
  { 
    id: 'tr', 
    nome: 'Turquia', 
    relacao: 60, 
    alinhamento: 'neutro', 
    pib: 1000000000000, // 1 trilhão
    pibFormatado: '1T',
    regiao: 'europa', 
    blocos: ['otan'], 
    recursos: ['geografia', 'militar'], 
    softPower: 65, 
    pressaoAmbiental: 30,
    moeda: 'TRY',
    populacao: 84700000,
    icone: '🇹🇷',
    descricao: 'Potência regional em transição. Ponte entre Oriente e Ocidente com ambições globais.',
    pontosFortes: ['Localização Geográfica', 'Indústria de Defesa', 'Turismo'],
    pontosFracos: ['Inflação Alta', 'Tensões com Países Vizinhos'],
    interessesNoBrasil: ['Comércio Bilateral', 'Cooperação em Defesa', 'Diplomacia']
  },
  { 
    id: 'ae', 
    nome: 'Emirados Árabes', 
    relacao: 70, 
    alinhamento: 'neutro', 
    pib: 500000000000, // 500 bilhões
    pibFormatado: '500B',
    regiao: 'oriente_medio', 
    blocos: ['brics'], 
    recursos: ['petroleo', 'logistica'], 
    softPower: 60, 
    pressaoAmbiental: 20,
    moeda: 'AED',
    populacao: 9360000,
    icone: '🇦🇪',
    descricao: 'Hub financeiro e logístico do Oriente Médio. Investidor ávido em infraestrutura global.',
    pontosFortes: ['Hub de Conectividade', 'Fundo Soberano', 'Diversificação Econômica'],
    pontosFracos: ['Dependência de Trabalhadores Estrangeiros', 'Recursos Naturais Limitados'],
    interessesNoBrasil: ['Investimento em Portos e Aeroportos', 'Comércio de Commodities', 'Parcerias em Energia']
  },

  // ============================================
  // ÁFRICA (5)
  // ============================================
  { 
    id: 'za', 
    nome: 'África do Sul', 
    relacao: 85, 
    alinhamento: 'brics', 
    pib: 400000000000, // 400 bilhões
    pibFormatado: '400B',
    regiao: 'africa', 
    blocos: ['brics'], 
    recursos: ['minerais', 'lideranca_regional'], 
    softPower: 60, 
    pressaoAmbiental: 40,
    moeda: 'ZAR',
    populacao: 59300000,
    icone: '🇿🇦',
    descricao: 'Principal parceiro africano e colega nos BRICS. Economia mais industrializada da África.',
    pontosFortes: ['Recursos Minerais', 'Indústria Financeira', 'Influência Regional'],
    pontosFracos: ['Alta Desigualdade', 'Problemas de Governança'],
    interessesNoBrasil: ['Cooperação nos BRICS', 'Comércio Bilateral', 'Diplomacia Sul-Sul']
  },
  { 
    id: 'ng', 
    nome: 'Nigéria', 
    relacao: 70, 
    alinhamento: 'neutro', 
    pib: 480000000000, // 480 bilhões
    pibFormatado: '480B',
    regiao: 'africa', 
    blocos: [], 
    recursos: ['petroleo', 'populacao'], 
    softPower: 40, 
    pressaoAmbiental: 20,
    moeda: 'NGN',
    populacao: 211400000,
    icone: '🇳🇬',
    descricao: 'Maior economia e população da África. Potencial enorme de mercado e recursos naturais.',
    pontosFortes: ['População (maior da África)', 'Reservas de Petróleo', 'Indústria do Entretenimento (Nollywood)'],
    pontosFracos: ['Corrupção', 'Infraestrutura Deficiente', 'Conflitos Internos'],
    interessesNoBrasil: ['Cooperação em Petróleo e Gás', 'Intercâmbio Cultural', 'Comércio Bilateral']
  },
  { 
    id: 'eg', 
    nome: 'Egito', 
    relacao: 75, 
    alinhamento: 'neutro', 
    pib: 380000000000, // 380 bilhões
    pibFormatado: '380B',
    regiao: 'africa', 
    blocos: ['brics'], 
    recursos: ['geografia', 'turismo'], 
    softPower: 50, 
    pressaoAmbiental: 30,
    moeda: 'EGP',
    populacao: 104300000,
    icone: '🇪🇬',
    descricao: 'Potência cultural e estratégica no norte da África. Controle do Canal de Suez.',
    pontosFortes: ['Canal de Suez', 'Turismo', 'Influência no Mundo Árabe'],
    pontosFracos: ['Dependência do Nilo', 'Instabilidade Política'],
    interessesNoBrasil: ['Comércio através do Suez', 'Cooperação em Agricultura', 'Diálogo Sul-Sul']
  },
  { 
    id: 'ao', 
    nome: 'Angola', 
    relacao: 85, 
    alinhamento: 'neutro', 
    pib: 120000000000, // 120 bilhões
    pibFormatado: '120B',
    regiao: 'africa', 
    blocos: [], 
    recursos: ['petroleo', 'diamantes'], 
    softPower: 30, 
    pressaoAmbiental: 40,
    moeda: 'AOA',
    populacao: 32800000,
    icone: '🇦🇴',
    descricao: 'Principal destino de investimentos brasileiros na África. Fortes laços históricos e culturais.',
    pontosFortes: ['Recursos Petrolíferos', 'Diamantes', 'Relação Especial com Brasil'],
    pontosFracos: ['Dependência do Petróleo', 'Corrupção'],
    interessesNoBrasil: ['Investimento Brasileiro', 'Cooperação em Petróleo', 'Apoio em Infraestrutura']
  },
  { 
    id: 'mz', 
    nome: 'Moçambique', 
    relacao: 85, 
    alinhamento: 'neutro', 
    pib: 20000000000, // 20 bilhões
    pibFormatado: '20B',
    regiao: 'africa', 
    blocos: [], 
    recursos: ['gas', 'agro'], 
    softPower: 30, 
    pressaoAmbiental: 40,
    moeda: 'MZN',
    populacao: 30900000,
    icone: '🇲🇿',
    descricao: 'País com grandes reservas de gás natural. Parceiro em desenvolvimento com laços linguísticos.',
    pontosFortes: ['Grandes Reservas de Gás', 'Localização Estratégica', 'Língua Portuguesa'],
    pontosFracos: ['Pobreza', 'Instabilidade em Cabo Delgado'],
    interessesNoBrasil: ['Cooperação em Gás Natural', 'Apoio ao Desenvolvimento', 'Relações Culturais']
  },

  // ============================================
  // OUTROS (4)
  // ============================================
  { 
    id: 'ca', 
    nome: 'Canadá', 
    relacao: 65, 
    alinhamento: 'ocidente', 
    pib: 2200000000000, // 2.2 trilhões
    pibFormatado: '2.2T',
    regiao: 'america_norte', 
    blocos: ['otan', 'ocde'], 
    recursos: ['minerais', 'energia'], 
    softPower: 90, 
    pressaoAmbiental: 85,
    moeda: 'CAD',
    populacao: 38200000,
    icone: '🇨🇦',
    descricao: 'Aliado tradicional com valores compartilhados. Importante em mineração e recursos naturais.',
    pontosFortes: ['Recursos Naturais', 'Educação de Qualidade', 'Diplomacia Multilateral'],
    pontosFracos: ['Dependência dos EUA', 'Tensões Provinciais'],
    interessesNoBrasil: ['Mineração', 'Educação', 'Cooperação Ambiental']
  },
  { 
    id: 'au', 
    nome: 'Austrália', 
    relacao: 60, 
    alinhamento: 'ocidente', 
    pib: 1700000000000, // 1.7 trilhão
    pibFormatado: '1.7T',
    regiao: 'oceania', 
    blocos: ['ocde'], 
    recursos: ['minerais', 'agro'], 
    softPower: 80, 
    pressaoAmbiental: 60,
    moeda: 'AUD',
    populacao: 25600000,
    icone: '🇦🇺',
    descricao: 'Potência em recursos minerais. Competidor direto em commodities agrícolas e minerais.',
    pontosFortes: ['Recursos Minerais', 'Agronegócio Tecnificado', 'Qualidade de Vida'],
    pontosFracos: ['Dependência da China', 'Vulnerabilidade às Mudanças Climáticas'],
    interessesNoBrasil: ['Cooperação em Mineração', 'Comércio de Commodities', 'Diálogo no G20']
  },
  { 
    id: 'ua', 
    nome: 'Ucrânia', 
    relacao: 50, 
    alinhamento: 'ocidente', 
    pib: 150000000000, // 150 bilhões
    pibFormatado: '150B',
    regiao: 'europa_leste', 
    blocos: [], 
    recursos: ['trigo', 'simbolismo'], 
    softPower: 80, 
    pressaoAmbiental: 20,
    emGuerra: true,
    moeda: 'UAH',
    populacao: 41000000,
    icone: '🇺🇦',
    descricao: 'País em guerra com a Rússia. Importante produtor agrícola e símbolo da resistência à agressão.',
    pontosFortes: ['Terra Fértil (Celeiro da Europa)', 'Resistência Nacional', 'Reforma Democrática'],
    pontosFracos: ['Guerra em Andamento', 'Economia Destruída', 'Dependência de Ajuda Externa'],
    interessesNoBrasil: ['Ajuda Humanitária', 'Mediação de Paz', 'Comércio de Grãos']
  }
];

// Metadados sobre os países para uso no sistema de balanceamento
export const paisesMetadata = {
  totalPaises: 32,
  distribuicaoPorRegiao: {
    america_norte: 2,
    america_sul: 7,
    europa: 9,
    asia: 4,
    oriente_medio: 6,
    africa: 5,
    oceania: 1
  },
  distribuicaoPorAlinhamento: {
    ocidente: 9,
    brics: 5,
    mercosul: 3,
    neutro: 12,
    anti_imperialista: 2,
    regional: 1
  },
  paisesEmGuerra: ['ru', 'ua'],
  paisesComFundoSoberano: ['no', 'sa', 'ae'],
  paisesPotenciaNuclear: ['us', 'ru', 'cn', 'fr', 'gb', 'il'],
  lideresPorRegiao: {
    america_norte: 'us',
    america_sul: 'br',
    europa: 'de',
    asia: 'cn',
    oriente_medio: 'sa',
    africa: 'za',
    oceania: 'au'
  }
};

// Função auxiliar para agrupar países por características
export const agruparPaises = {
  porBloco: (blocoId) => paisesSeed.filter(pais => pais.blocos.includes(blocoId)),
  
  porRecurso: (recurso) => paisesSeed.filter(pais => pais.recursos.includes(recurso)),
  
  porFaixaRelacao: (min, max) => paisesSeed.filter(pais => pais.relacao >= min && pais.relacao <= max),
  
  getPotenciaisMundiais: () => paisesSeed.filter(pais => pais.pib > 1000000000000), // > 1 trilhão
  
  getPaisesEmergentes: () => paisesSeed.filter(pais => 
    ['cn', 'in', 'br', 'ru', 'za', 'sa', 'ae', 'tr', 'id', 'mx'].includes(pais.id)
  ),
  
  getPaisesRicosPerCapita: () => paisesSeed.filter(pais => 
    (pais.pib / (pais.populacao || 1)) > 40000 // PIB per capita > $40k
  ),
  
  getPaisesEstrategicos: () => paisesSeed.filter(pais => 
    ['us', 'cn', 'ru', 'de', 'fr', 'gb', 'jp', 'in', 'sa'].includes(pais.id)
  )
};