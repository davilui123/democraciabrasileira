// src/data/seed/problemas.js

export const problemasSeed = [
  // ============================================
  // MINISTÉRIO DA SAÚDE (8 problemas)
  // ============================================
  {
    id: 'fila_sus',
    ministerioId: 'm_saude',
    origem: 'tecnica',
    titulo: 'Superlotação Hospitalar',
    descricao: 'Capacidade insuficiente no SUS para atender demanda crescente.',
    estagios: [
      { 
        nivel: 1, 
        texto: 'Relatórios internos indicam ocupação hospitalar em 92%', 
        visivel: false,
        impactoOculto: { eficienciaSUS: -5 }
      },
      { 
        nivel: 2, 
        texto: 'Diretores de hospitais alertam para colapso iminente em 3 estados', 
        visivel: false,
        impactoOculto: { confiancaSistema: -10, custosEmergenciais: +50 }
      },
      { 
        nivel: 3, 
        texto: 'FILA INFINITA: Pacientes aguardam até 3 dias por leitos em UTIs', 
        visivel: true, 
        tipo: 'crise_humanitaria', 
        custoResolucao: 400, 
        impacto: { 
          popularidade: -8, 
          climaGoverno: -15,
          apoioEstados: -10
        },
        prazo: 2,
        penalidadeAtraso: { popularidade: -15 }
      },
      { 
        nivel: 4, 
        texto: 'COLAPSO DO SUS: Pacientes morrem em macas nos corredores; mídia internacional noticia', 
        visivel: true, 
        tipo: 'crise_nacional', 
        custoResolucao: 800, 
        impacto: { 
          popularidade: -20, 
          capitalPolitico: -25,
          imagemExterna: -15,
          riscoCPI: +40
        },
        prazo: 1,
        penalidadeAtraso: { popularidade: -30, capitalPolitico: -20 }
      }
    ],
    fatores: ['orçamento_baixo', 'gestao_ineficiente', 'demanda_crescente'],
    tendencia: 'crescente',
    categoria: 'infraestrutura',
    icone: '🏥'
  },
  {
    id: 'falta_insumos',
    ministerioId: 'm_saude',
    origem: 'tecnica',
    titulo: 'Escassez de Insumos Hospitalares',
    descricao: 'Falta crônica de materiais básicos para procedimentos.',
    estagios: [
      { nivel: 1, texto: 'Estoque de agulhas e seringas abaixo do mínimo em 3 estados', visivel: false },
      { nivel: 2, texto: 'Hospitais reutilizam materiais descartáveis por falta de reposição', visivel: false },
      { nivel: 3, texto: 'FALTA DE INSUMOS: Cirurgias eletivas canceladas por falta de material básico', visivel: true, tipo: 'crise_operacional', custoResolucao: 350, impacto: { popularidade: -6, confiancaSUS: -20 } },
      { nivel: 4, texto: 'SURTO DE INFECÇÃO: Reutilização causa aumento de 300% em infecções hospitalares', visivel: true, tipo: 'crise_sanitaria', custoResolucao: 700, impacto: { popularidade: -15, capitalPolitico: -20, gastos: +200 } }
    ],
    fatores: ['dependencia_importacao', 'corrupcao_licitacoes', 'logistica_falha'],
    tendencia: 'estavel',
    categoria: 'suprimentos',
    icone: '💉'
  },
  {
    id: 'medicamentos_sumindo',
    ministerioId: 'm_saude',
    origem: 'tecnica',
    titulo: 'Desabastecimento de Medicamentos Essenciais',
    descricao: 'Falta de remédios para doenças crônicas na Farmácia Popular.',
    estagios: [
      { nivel: 1, texto: '12 medicamentos essenciais com estoque abaixo de 30 dias', visivel: false },
      { nivel: 2, texto: 'Farmácias populares limitam entrega a 1 remédio por paciente', visivel: false },
      { nivel: 3, texto: 'DESESPERO: Pacientes diabéticos e hipertensos peregrinam por medicamentos', visivel: true, tipo: 'crise_assistencial', custoResolucao: 250, impacto: { popularidade: -10, apoioEstados: -15 } },
      { nivel: 4, texto: 'MORTES EVITÁVEIS: Falta de insulina causa óbitos; famílias processam União', visivel: true, tipo: 'crise_humanitaria', custoResolucao: 500, impacto: { popularidade: -25, capitalPolitico: -30, gastosJudiciais: +300 } }
    ],
    fatores: ['industria_farmaceutica', 'precos_baixos', 'gestao_estoques'],
    tendencia: 'crescente',
    categoria: 'medicamentos',
    icone: '💊'
  },
  {
    id: 'conflito_federativo_saude',
    ministerioId: 'm_saude',
    origem: 'politica',
    titulo: 'Guerra de Governadores pela Saúde',
    descricao: 'Estados brigam por recursos e acusam União de má distribuição.',
    estagios: [
      { nivel: 1, texto: 'Governadores cobram repasses atrasados em reunião reservada', visivel: false },
      { nivel: 2, texto: 'Secretários estaduais se recusam a participar de reunião técnica', visivel: false },
      { nivel: 3, texto: 'GOVERNADORES AMEAÇAM PROCESSAR UNIÃO POR DESCUMprimento constitucional', visivel: true, tipo: 'conflito_federativo', custoResolucao: 300, impacto: { apoioEstados: -20, climaGoverno: -10 } },
      { nivel: 4, texto: 'ESTADOS DECRETAM EMERGÊNCIA UNILATERAL E SUSPENDEM REPASSES', visivel: true, tipo: 'ruptura_federativa', custoResolucao: 600, impacto: { popularidade: -15, riscoInstitucional: +30, apoioCongressual: -25 } }
    ],
    fatores: ['disputa_recursos', 'eleicoes_estaduais', 'partidos_oposicao'],
    tendencia: 'crescente',
    categoria: 'relacoes_federativas',
    icone: '⚖️'
  },
  {
    id: 'medicos_estrangeiros',
    ministerioId: 'm_saude',
    origem: 'politica',
    titulo: 'Crise com Médicos Estrangeiros',
    descricao: 'Conflito diplomático por condições de trabalho de profissionais estrangeiros.',
    estagios: [
      { nivel: 1, texto: 'Embaixadas questionam condições de trabalho de seus médicos', visivel: false },
      { nivel: 2, texto: 'Conselho de Medicina brasileiro pressiona por revalidação mais rigorosa', visivel: false },
      { nivel: 3, texto: 'PAÍSES RETIRAM MÉDICOS: Cuba e outros países anunciam retirada de profissionais', visivel: true, tipo: 'crise_diplomatica', custoResolucao: 400, impacto: { relacaoCuba: -40, coberturaSUS: -15 } },
      { nivel: 4, texto: 'COLAPSO NO INTERIOR: 800 municípios ficam sem qualquer médico; prefeitos fecham postos', visivel: true, tipo: 'crise_nacional', custoResolucao: 800, impacto: { popularidade: -20, apoioPrefeitos: -35, riscoEleitoral: +25 } }
    ],
    fatores: ['nacionalismo', 'condicoes_trabalho', 'diplomacia'],
    tendencia: 'variavel',
    categoria: 'recursos_humanos',
    icone: '👨‍⚕️'
  },
  {
    id: 'campanha_antivacina',
    ministerioId: 'm_saude',
    origem: 'midia',
    titulo: 'Movimento Antivacina Ganha Força',
    descricao: 'Desinformação sobre vacinas reduz cobertura vacinal a níveis perigosos.',
    estagios: [
      { nivel: 1, texto: 'Grupos antivacina crescem 300% nas redes sociais', visivel: false },
      { nivel: 2, texto: 'Cobertura vacinal da poliomielite cai para 67%, abaixo do mínimo seguro', visivel: false },
      { nivel: 3, texto: 'SURTO DE SARAMPO: 5 estados registram epidemia; hospitais lotam', visivel: true, tipo: 'crise_sanitaria', custoResolucao: 300, impacto: { popularidade: -12, gastosEmergenciais: +250 } },
      { nivel: 4, texto: 'POLIOMIELITE RETORNA: Primeiro caso em 30 anos causa pânico nacional', visivel: true, tipo: 'crise_nacional', custoResolucao: 600, impacto: { popularidade: -30, imagemExterna: -25, turismo: -20 } }
    ],
    fatores: ['fake_news', 'polarizacao_politica', 'desconfianca_governo'],
    tendencia: 'crescente',
    categoria: 'comunicacao',
    icone: '📱'
  },
  {
    id: 'corrupcao_fraude',
    ministerioId: 'm_saude',
    origem: 'midia',
    titulo: 'Escândalo de Fraudes em Licitações',
    descricao: 'Investigação revela esquema de superfaturamento em equipamentos hospitalares.',
    estagios: [
      { nivel: 1, texto: 'TCU identifica irregularidades em 15% das licitações de equipamentos', visivel: false },
      { nivel: 2, texto: 'MPF abre investigação contra 3 secretários estaduais da saúde', visivel: false },
      { nivel: 3, texto: 'VÍDEO VAZA: Executivo grava conversa sobre propina de 30% em respiradores', visivel: true, tipo: 'escandalo_corrupcao', custoResolucao: 200, impacto: { capitalPolitico: -25, credibilidadeGoverno: -30 } },
      { nivel: 4, texto: 'CPI DA SAÚDE: Congresso instaura CPI após morte por equipamento defeituoso', visivel: true, tipo: 'crise_politica', custoResolucao: 500, impacto: { capitalPolitico: -40, apoioCongressual: -35, riscoImpeachment: +15 } }
    ],
    fatores: ['corrupcao_estrutural', 'fiscalizacao_fraca', 'contratos_emergenciais'],
    tendencia: 'estavel',
    categoria: 'governanca',
    icone: '💰'
  },
  {
    id: 'esgotamento_profissionais',
    ministerioId: 'm_saude',
    origem: 'tecnica',
    titulo: 'Esgotamento dos Profissionais de Saúde',
    descricao: 'Burnout em massa após pandemia leva a greves e abandonos de profissão.',
    estagios: [
      { nivel: 1, texto: 'Pesquisa interna mostra 65% dos médicos com sintomas de burnout', visivel: false },
      { nivel: 2, texto: 'Sindicatos alertam para falta de 80 mil enfermeiros no país', visivel: false },
      { nivel: 3, texto: 'GREVE NACIONAL: Profissionais param por melhores condições; 40% dos hospitais afetados', visivel: true, tipo: 'crise_operacional', custoResolucao: 450, impacto: { popularidade: -8, gastos: +180 } },
      { nivel: 4, texto: 'ÊXODO DA SAÚDE: 15 mil médicos emigram em 6 meses; formação não repõe perdas', visivel: true, tipo: 'crise_estrutural', custoResolucao: 900, impacto: { popularidade: -18, qualidadeSUS: -25, custosContratacao: +300 } }
    ],
    fatores: ['sobrecarga_pos_pandemia', 'remuneracao_baixa', 'condicoes_trabalho'],
    tendencia: 'crescente',
    categoria: 'recursos_humanos',
    icone: '😷'
  },

  // ============================================
  // MINISTÉRIO DA FAZENDA (6 problemas)
  // ============================================
  {
    id: 'risco_fiscal',
    ministerioId: 'm_fazenda',
    origem: 'tecnica',
    titulo: 'Descontrole Orçamentário',
    descricao: 'Despesas superam receitas de forma estrutural, pressionando o teto de gastos.',
    estagios: [
      { nivel: 1, texto: 'Projeções internas indicam déficit primário de 1,2% do PIB', visivel: false },
      { nivel: 2, texto: 'Tesouro alerta para risco de descumprimento do teto constitucional', visivel: false },
      { nivel: 3, texto: 'MERCADO COBRA AJUSTE FISCAL IMEDIATO: spreads sobem e dólar dispara', visivel: true, tipo: 'crise_economica', custoResolucao: 500, impacto: { confiancaMercado: -30, riscoPais: +40 } },
      { nivel: 4, texto: 'REBAIXAMENTO DE RATING: Agências retiram grau de investimento; fuga de capitais', visivel: true, tipo: 'crise_financeira', custoResolucao: 1000, impacto: { riscoPais: +50, dolar: +1.5, investimentoDireto: -25 } }
    ],
    fatores: ['gastos_obrigatorios', 'queda_arrecadacao', 'pressao_social'],
    tendencia: 'crescente',
    categoria: 'fiscal',
    icone: '📉'
  },
  {
    id: 'divida_explodindo',
    ministerioId: 'm_fazenda',
    origem: 'tecnica',
    titulo: 'Espiral da Dívida Pública',
    descricao: 'Juros da dívida consomem parcela crescente do orçamento, criando círculo vicioso.',
    estagios: [
      { nivel: 1, texto: 'Rolagem da dívida consome 45% da arrecadação mensal', visivel: false },
      { nivel: 2, texto: 'Tesouro emite títulos a 14% a.a. para cobrir vencimentos', visivel: false },
      { nivel: 3, texto: 'ESPIRAL: Dívida/PIB ultrapassa 90%; juros comprometem investimentos', visivel: true, tipo: 'crise_fiscal', custoResolucao: 600, impacto: { crescimentoPib: -0.8, rating: -2 } },
      { nivel: 4, texto: 'DÉFICIT GÊMEO: Déficit fiscal e comercial simultâneos geram ataque especulativo', visivel: true, tipo: 'crise_cambial', custoResolucao: 1200, impacto: { dolar: +2.5, inflacao: +3, reservasInternacionais: -20 } }
    ],
    fatores: ['juros_altos', 'crescimento_baixo', 'desvalorizacao_cambio'],
    tendencia: 'crescente',
    categoria: 'divida',
    icone: '💸'
  },
  {
    id: 'reforma_tributaria_travada',
    ministerioId: 'm_fazenda',
    origem: 'politica',
    titulo: 'Reforma Tributária Paralisada',
    descricao: 'Congresso emperra votação do novo sistema tributário por disputas setoriais.',
    estagios: [
      { nivel: 1, texto: 'Líderes partidários pedem mais tempo para análise do projeto', visivel: false },
      { nivel: 2, texto: 'Setores industrial e de serviços brigam por tratamento diferenciado', visivel: false },
      { nivel: 3, texto: 'CONGRESSO TRAVA VOTAÇÃO: Estados temem perda de receita e fazem lobby', visivel: true, tipo: 'conflito_federativo', custoResolucao: 350, impacto: { apoioCongressual: -20, previsibilidadeEconomica: -25 } },
      { nivel: 4, texto: 'PROJETO MORRE: Prazo constitucional vence; reforma adiada por 2 anos', visivel: true, tipo: 'fracasso_legislativo', custoResolucao: 500, impacto: { crescimentoPib: -1.2, confiancaMercado: -35, capitalPolitico: -30 } }
    ],
    fatores: ['interesses_setoriais', 'disputa_federativa', 'complexidade_tecnica'],
    tendencia: 'estavel',
    categoria: 'tributacao',
    icone: '📜'
  },
  {
    id: 'sonegação_industrializada',
    ministerioId: 'm_fazenda',
    origem: 'tecnica',
    titulo: 'Evasão Fiscal Sistêmica',
    descricao: 'Grandes corporações usam paraísos fiscais para evitar tributação no Brasil.',
    estagios: [
      { nivel: 1, texto: 'Relatório da Receita identifica subfaturamento de exportações em 15%', visivel: false },
      { nivel: 2, texto: 'Investigação mostra transferência de lucros para holding no exterior', visivel: false },
      { nivel: 3, texto: 'VAZAMENTO DOS PAPÉIS DO PARAÍSO: 50 empresas brasileiras em lista global', visivel: true, tipo: 'escandalo_corporativo', custoResolucao: 400, impacto: { arrecadacao: -800, imagemEmpresarios: -20 } },
      { nivel: 4, texto: 'FALÊNCIA FISCAL: União perde ação bilionária; precedente abre rombo permanente', visivel: true, tipo: 'crise_arrecadatoria', custoResolucao: 800, impacto: { dividaPublica: +5, credibilidadeFiscal: -30, gastos: +500 } }
    ],
    fatores: ['globalizacao_financeira', 'legislacao_fraca', 'capacidade_fiscalizacao'],
    tendencia: 'crescente',
    categoria: 'fiscalizacao',
    icone: '🌍'
  },
  {
    id: 'guerra_cambio',
    ministerioId: 'm_fazenda',
    origem: 'politica',
    titulo: 'Guerra Cambial com Argentina',
    descricao: 'Desvalorização competitiva do peso argentino ameaça indústria brasileira.',
    estagios: [
      { nivel: 1, texto: 'Peso argentino desvaloriza 25% em 3 meses', visivel: false },
      { nivel: 2, texto: 'Indústria de calçados e têxteis perde competitividade', visivel: false },
      { nivel: 3, texto: 'CRISE NO MERCOSUL: Brasil ameaça barreiras comerciais; Argentina retalia', visivel: true, tipo: 'conflito_comercial', custoResolucao: 300, impacto: { exportacoes: -12, relacaoArgentina: -30 } },
      { nivel: 4, texto: 'GUERRA CAMBIAL: Ambos os países desvalorizam moedas; indústria nacional quebra', visivel: true, tipo: 'crise_economica', custoResolucao: 700, impacto: { pib: -1.5, desemprego: +3, inflacao: +2 } }
    ],
    fatores: ['crise_argentina', 'protecionismo', 'dependencia_comercial'],
    tendencia: 'variavel',
    categoria: 'comercio_exterior',
    icone: '💱'
  },
  {
    id: 'inflação_alimentar',
    ministerioId: 'm_fazenda',
    origem: 'midia',
    titulo: 'Inflação dos Alimentos Descontrolada',
    descricao: 'Preços da cesta básica sobem 3x mais que inflação geral, pressionando populares.',
    estagios: [
      { nivel: 1, texto: 'IPCA alimentos atinge 12% anual', visivel: false },
      { nivel: 2, texto: 'Feirantes relatam aumento de 40% no preço do tomate e cebola', visivel: false },
      { nivel: 3, texto: 'PANELAÇOS: Protestos nas periferias por preço abusivo dos alimentos', visivel: true, tipo: 'crise_social', custoResolucao: 400, impacto: { popularidade: -15, apoioEstados: -10 } },
      { nivel: 4, texto: 'FOME VOLTA: 10 milhões retornam à insegurança alimentar; FAO emite alerta', visivel: true, tipo: 'crise_humanitaria', custoResolucao: 800, impacto: { popularidade: -35, imagemExterna: -20, gastosSociais: +600 } }
    ],
    fatores: ['seca', 'custos_logistica', 'especulacao'],
    tendencia: 'crescente',
    categoria: 'precos',
    icone: '🍅'
  },

  // ============================================
  // MINISTÉRIO DA EDUCAÇÃO (6 problemas)
  // ============================================
  {
    id: 'evasao_escolar',
    ministerioId: 'm_educacao',
    origem: 'tecnica',
    titulo: 'Evasão Escolar Pós-Pandemia',
    descricao: '3 milhões de alunos abandonaram a escola após pandemia, muitos para trabalhar.',
    estagios: [
      { nivel: 1, texto: 'Dados internos mostram evasão de 15% no ensino médio', visivel: false },
      { nivel: 2, texto: 'Professores relatam salas de aula pela metade em zonas rurais', visivel: false },
      { nivel: 3, texto: 'GERAÇÃO PERDIDA: 2 milhões de jovens fora da escola viram mão-de-obra infantil', visivel: true, tipo: 'crise_social', custoResolucao: 500, impacto: { popularidade: -12, desigualdade: +10 } },
      { nivel: 4, texto: 'ANALFABETISMO FUNCIONAL CRESCE: 40% dos jovens não interpretam texto simples', visivel: true, tipo: 'crise_estrutural', custoResolucao: 1000, impacto: { produtividadeFutura: -20, criminalidade: +15, competitividade: -25 } }
    ],
    fatores: ['pobreza', 'trabalho_infantil', 'deficiencia_digital'],
    tendencia: 'crescente',
    categoria: 'acesso',
    icone: '📚'
  },
  {
    id: 'professores_greve',
    ministerioId: 'm_educacao',
    origem: 'politica',
    titulo: 'Greve Nacional dos Professores',
    descricao: 'Categoria paralisa por reajuste salarial e melhores condições de trabalho.',
    estagios: [
      { nivel: 1, texto: 'Sindicatos rejeitam proposta de aumento de 5%', visivel: false },
      { nivel: 2, texto: 'Assembleias estaduais aprovam greve por tempo indeterminado', visivel: false },
      { nivel: 3, texto: 'PARALISAÇÃO NACIONAL: 22 estados com aulas suspensas; 18 milhões de alunos afetados', visivel: true, tipo: 'greve_setorial', custoResolucao: 600, impacto: { popularidade: -10, apoioEstados: -20 } },
      { nivel: 4, texto: 'ANO LETIVO PERDIDO: Greve ultrapassa 60 dias; reposição é impossível', visivel: true, tipo: 'crise_educacional', custoResolucao: 1200, impacto: { popularidade: -25, capitalPolitico: -30, paisFuturo: -40 } }
    ],
    fatores: ['salarios_baixos', 'condicoes_trabalho', 'desvalorizacao_profissao'],
    tendencia: 'ciclica',
    categoria: 'recursos_humanos',
    icone: '👩‍🏫'
  },
  {
    id: 'universidades_falindo',
    ministerioId: 'm_educacao',
    origem: 'tecnica',
    titulo: 'Crise Financeira das Universidades Federais',
    descricao: 'Corte de verbas ameaça funcionamento básico e pesquisa científica.',
    estagios: [
      { nivel: 1, texto: '20 universidades federais operam com menos de 70% do orçamento necessário', visivel: false },
      { nivel: 2, texto: 'Laboratórios de pesquisa fecham por falta de insumos básicos', visivel: false },
      { nivel: 3, texto: 'UNIVERSIDADES PARALISAM: Corte de luz e água em 8 campi por inadimplência', visivel: true, tipo: 'crise_operacional', custoResolucao: 450, impacto: { popularidade: -8, pesquisaCientifica: -25 } },
      { nivel: 4, texto: 'ÊXODO DE CÉREBROS: 5 mil pesquisadores emigram; ranking mundial despenca', visivel: true, tipo: 'crise_estrutural', custoResolucao: 900, impacto: { inovacao: -30, soberaniaTecnologica: -35, imagemExterna: -20 } }
    ],
    fatores: ['corte_orcamentario', 'custeio_baixo', 'priorizacao_outras_areas'],
    tendencia: 'crescente',
    categoria: 'ensino_superior',
    icone: '🎓'
  },
  {
    id: 'ideologizacao_escola',
    ministerioId: 'm_educacao',
    origem: 'midia',
    titulo: 'Guerra Cultural nas Escolas',
    descricao: 'Disputa ideológica sobre conteúdo curricular paralisa reformas educacionais.',
    estagios: [
      { nivel: 1, texto: 'Grupos conservadores e progressistas brigam sobre educação sexual', visivel: false },
      { nivel: 2, texto: 'Prefeitos suspendem livros didáticos por "doutrinação ideológica"', visivel: false },
      { nivel: 3, texto: 'GUERRA CULTURAL: Conselhos de educação são invadidos; professores ameaçados', visivel: true, tipo: 'conflito_social', custoResolucao: 300, impacto: { apoioReligioso: -15, apoioProgressistas: -15 } },
      { nivel: 4, texto: 'EDUCAÇÃO BIPARTIDÁRIADA: Estados aprovam currículos opostos; sistema nacional fragmentado', visivel: true, tipo: 'ruptura_educacional', custoResolucao: 600, impacto: { coesaoNacional: -20, qualidadeEducacao: -15, mobilidadeEstudantil: -30 } }
    ],
    fatores: ['polarizacao_politica', 'ativismo_midias', 'disputa_geracional'],
    tendencia: 'crescente',
    categoria: 'curriculo',
    icone: '⚔️'
  },
  {
    id: 'tecnologia_atrasada',
    ministerioId: 'm_educacao',
    origem: 'tecnica',
    titulo: 'Fossilização Tecnológica nas Escolas',
    descricao: 'Infraestrutura digital obsoleta impede educação do século XXI.',
    estagios: [
      { nivel: 1, texto: '60% das escolas públicas sem internet banda larga', visivel: false },
      { nivel: 2, texto: 'Computadores obsoletos (10+ anos) em 45% dos laboratórios', visivel: false },
      { nivel: 3, texto: 'ANALFABETISMO DIGITAL: Alunos formados sem habilidades básicas para mercado 4.0', visivel: true, tipo: 'crise_competitividade', custoResolucao: 700, impacto: { produtividadeFutura: -20, empregoTecnologico: -15 } },
      { nivel: 4, texto: 'BRASIL PERDE REVOLUÇÃO 4.0: Gap tecnológico condena geração à subempregos', visivel: true, tipo: 'crise_estrutural', custoResolucao: 1500, impacto: { crescimentoPibFuturo: -1.8, competitividadeGlobal: -35, dependenciaTecnologica: +30 } }
    ],
    fatores: ['investimento_baixo', 'burocracia_licitacao', 'manutencao_deficiente'],
    tendencia: 'crescente',
    categoria: 'infraestrutura',
    icone: '💻'
  },
  {
    id: 'enem_fraude',
    ministerioId: 'm_educacao',
    origem: 'midia',
    titulo: 'Escândalo de Fraudes no ENEM',
    descricao: 'Sistema de vazamento de questões e fraudes em correção abala credibilidade do exame.',
    estagios: [
      { nivel: 1, texto: 'Professores identificam padrões suspeitos em questões do ENEM', visivel: false },
      { nivel: 2, texto: 'MP investiga contratação irregular de empresa de correção', visivel: false },
      { nivel: 3, texto: 'VAZAMENTO COMPROVADO: Prova vaza 48h antes; 8 milhões de estudantes afetados', visivel: true, tipo: 'escandalo_corrupcao', custoResolucao: 400, impacto: { credibilidadeSistema: -40, justicaSocial: -25 } },
      { nivel: 4, texto: 'ENEM CANCELADO: Exame perde validade; acesso ao ensino superior entra em caos', visivel: true, tipo: 'crise_institucional', custoResolucao: 800, impacto: { capitalPolitico: -35, confiancaPublica: -45, acessoUniversidade: -30 } }
    ],
    fatores: ['terceirizacao', 'fiscalizacao_falha', 'pressao_resultados'],
    tendencia: 'estavel',
    categoria: 'avaliacao',
    icone: '📝'
  },

  // ============================================
  // MINISTÉRIO DA JUSTIÇA (6 problemas)
  // ============================================
  {
    id: 'superlotacao_carceraria',
    ministerioId: 'm_justica',
    origem: 'tecnica',
    titulo: 'Superlotação Carcerária Crítica',
    descricao: 'Sistema penitenciário opera com 200% da capacidade, gerando rebeliões constantes.',
    estagios: [
      { nivel: 1, texto: 'Relatórios mostram lotação de 180% em presídios federais', visivel: false },
      { nivel: 2, texto: 'Rebeliões localizadas ocorrem em 3 estados simultaneamente', visivel: false },
      { nivel: 3, texto: 'MASSACRE EM PRESÍDIO: 30 mortos em rebelião; vídeos chocantes viralizam', visivel: true, tipo: 'crise_humanitaria', custoResolucao: 500, impacto: { popularidade: -15, direitosHumanos: -30 } },
      { nivel: 4, texto: 'SISTEMA PENITENCIÁRIO COLAPSA: Presos fogem em massa; facções assumem controle', visivel: true, tipo: 'crise_seguranca', custoResolucao: 1000, impacto: { segurancaPublica: -40, criminalidade: +25, imagemExterna: -35 } }
    ],
    fatores: ['encarceramento_massivo', 'falta_investimento', 'politicas_duras'],
    tendencia: 'crescente',
    categoria: 'sistema_prisional',
    icone: '🔒'
  },
  {
    id: 'facções_transnacionais',
    ministerioId: 'm_justica',
    origem: 'tecnica',
    titulo: 'Facções Criminosas Transnacionais',
    descricao: 'Organizações brasileiras se expandem para outros países, criando rede internacional.',
    estagios: [
      { nivel: 1, texto: 'Inteligência identifica células do PCC em 3 países vizinhos', visivel: false },
      { nivel: 2, texto: 'Tráfico internacional usa fronteiras brasileiras como hub', visivel: false },
      { nivel: 3, texto: 'CRIME ORGANIZADO INTERNACIONAL: EUA classificam PCC como organização terrorista', visivel: true, tipo: 'crise_seguranca', custoResolucao: 600, impacto: { relacaoEUA: -20, turismo: -15 } },
      { nivel: 4, texto: 'GUERRA TRANSFRONTEIRIÇA: Facções controlam rotas em 5 países; exércitos são acionados', visivel: true, tipo: 'crise_internacional', custoResolucao: 1200, impacto: { segurancaFronteiras: -50, relacaoVizinhos: -35, comércioRegional: -20 } }
    ],
    fatores: ['fronteiras_porosas', 'cooperacao_internacional_fraca', 'mercado_drogas'],
    tendencia: 'crescente',
    categoria: 'crime_organizado',
    icone: '🌐'
  },
  {
    id: 'violencia_policial',
    ministerioId: 'm_justica',
    origem: 'politica',
    titulo: 'Crise de Violência Policial',
    descricao: 'Aumento de letalidade policial gera protestos e tensões raciais.',
    estagios: [
      { nivel: 1, texto: 'Mortes em operações policiais aumentam 40% em 6 meses', visivel: false },
      { nivel: 2, texto: 'Organizações de direitos humanos preparam denúncia à OEA', visivel: false },
      { nivel: 3, texto: 'PROTESTO NACIONAL: "Vidas Negras Importam" toma as ruas após morte de adolescente', visivel: true, tipo: 'conflito_social', custoResolucao: 400, impacto: { popularidade: -20, coesaoSocial: -25 } },
      { nivel: 4, texto: 'SANÇÕES INTERNACIONAIS: ONU recomenda embargo de armas; empresas boicotam Brasil', visivel: true, tipo: 'crise_internacional', custoResolucao: 800, impacto: { imagemExterna: -40, investimentoDireto: -30, relacaoEUA: -25 } }
    ],
    fatores: ['militarizacao_policia', 'racismo_estrutural', 'impunidade'],
    tendencia: 'crescente',
    categoria: 'seguranca_publica',
    icone: '👮'
  },
  {
    id: 'lavajato_revanchismo',
    ministerioId: 'm_justica',
    origem: 'politica',
    titulo: 'Revanchismo Pós-Lava Jato',
    descricao: 'Antigos investigados buscam anulação de processos e retaliação contra juízes.',
    estagios: [
      { nivel: 1, texto: 'Ex-presidente entra com ação para anular todas as condenações', visivel: false },
      { nivel: 2, texto: 'Juízes da Lava Jato recebem ameaças de morte organizadas', visivel: false },
      { nivel: 3, texto: 'GUERRA JUDICIÁRIA: STF anula provas por "vícios"; 70% das condenações caem', visivel: true, tipo: 'crise_institucional', custoResolucao: 300, impacto: { credibilidadeJustica: -35, impunidade: +30 } },
      { nivel: 4, texto: 'SISTEMA ANTICORRUPÇÃO DESMONTADO: Agentes pedem exoneração; corrupção volta aos níveis de 2013', visivel: true, tipo: 'crise_estrutural', custoResolucao: 600, impacto: { transparencia: -40, custoBrasil: +15, investimento: -20 } }
    ],
    fatores: ['polarizacao_politica', 'ativismo_judicial', 'fadiga_anticorrupcao'],
    tendencia: 'crescente',
    categoria: 'justica',
    icone: '⚖️'
  },
  {
    id: 'hackers_estatais',
    ministerioId: 'm_justica',
    origem: 'tecnica',
    titulo: 'Ataques Cibernéticos a Infraestrutura',
    descricao: 'Grupos hacker atacam sistemas governamentais, incluindo eleitorais e energéticos.',
    estagios: [
      { nivel: 1, texto: 'Sistemas do TSE sofrem tentativas de invasão diárias', visivel: false },
      { nivel: 2, texto: 'Dados de 50 milhões de brasileiros vazam na dark web', visivel: false },
      { nivel: 3, texto: 'ATAQUE À ENERGIA: Hackers desligam subestações em 3 estados; apagões regionais', visivel: true, tipo: 'crise_seguranca_nacional', custoResolucao: 700, impacto: { segurancaEnergetica: -25, confiancaInstituicoes: -20 } },
      { nivel: 4, texto: 'GUERRA CIBERNÉTICA: Eleições são hackeadas; resultados são contestados internacionalmente', visivel: true, tipo: 'crise_constitucional', custoResolucao: 1500, impacto: { estabilidadeDemocratica: -50, credibilidadeEleitoral: -45, riscoGolpe: +30 } }
    ],
    fatores: ['dependencia_digital', 'defesas_fracas', 'conflitos_internacionais'],
    tendencia: 'crescente',
    categoria: 'ciber_seguranca',
    icone: '💻'
  },
  {
    id: 'milícias_urbanas',
    ministerioId: 'm_justica',
    origem: 'politica',
    titulo: 'Milícias Controlam Territórios',
    descricao: 'Grupos paramilitares dominam periferias e infiltram o poder público.',
    estagios: [
      { nivel: 1, texto: 'MP identifica 120 bairros sob controle de milícias no RJ', visivel: false },
      { nivel: 2, texto: 'Vereadores e policiais são presos por ligação com milícias', visivel: false },
      { nivel: 3, texto: 'ESTADO PARALELO: Milícias cobram impostos e administram serviços em 3 capitais', visivel: true, tipo: 'crise_seguranca', custoResolucao: 600, impacto: { soberaniaEstatal: -30, direitosHumanos: -25 } },
      { nivel: 4, texto: 'GUERRA CIVIL URBANA: Milícias enfrentam exército; 500 mortos em 1 semana', visivel: true, tipo: 'conflito_armado', custoResolucao: 1200, impacto: { segurancaPublica: -60, economiaLocal: -40, turismo: -50 } }
    ],
    fatores: ['vazio_poder', 'corrupcao_policial', 'exclusao_social'],
    tendencia: 'crescente',
    categoria: 'seguranca_publica',
    icone: '🏙️'
  },

  // ============================================
  // MINISTÉRIO DA DEFESA (6 problemas)
  // ============================================
  {
    id: 'equipamento_obsoleto',
    ministerioId: 'm_defesa',
    origem: 'tecnica',
    titulo: 'Forças Armadas com Equipamento Obsoleto',
    descricao: 'Frota aérea e naval envelhecida compromete capacidade de defesa e soberania.',
    estagios: [
      { nivel: 1, texto: '40% dos caças da FAB têm mais de 30 anos de serviço', visivel: false },
      { nivel: 2, texto: 'Submarinos operam com restrições por falta de peças', visivel: false },
      { nivel: 3, texto: 'AMAZÔNIA DESPROTEGIDA: Satélites militares falham; narcotráfico avança', visivel: true, tipo: 'crise_seguranca_nacional', custoResolucao: 800, impacto: { soberaniaAmazonia: -25, narcotrafico: +20 } },
      { nivel: 4, texto: 'BRASIL INCAPAZ DE DEFESA: Potências testam limites em águas territoriais; humilhação internacional', visivel: true, tipo: 'crise_soberania', custoResolucao: 1600, impacto: { imagemExterna: -35, riscoConflito: +25, influenciaRegional: -30 } }
    ],
    fatores: ['orcamento_baixo', 'burocracia_aquisicao', 'dependencia_externa'],
    tendencia: 'crescente',
    categoria: 'modernizacao',
    icone: '✈️'
  },
  {
    id: 'amazonia_invasores',
    ministerioId: 'm_defesa',
    origem: 'tecnica',
    titulo: 'Invasão Estrangeira na Amazônia',
    descricao: 'Garimpeiros, madeireiros e narcotraficantes internacionais operam impunes.',
    estagios: [
      { nivel: 1, texto: 'Satélites identificam 300 pistas de pouso clandestinas na floresta', visivel: false },
      { nivel: 2, texto: 'Comunidades indígenas são atacadas por grupos armados estrangeiros', visivel: false },
      { nivel: 3, texto: 'TERRITÓRIO PERDIDO: 50 mil km² sob controle de facções internacionais', visivel: true, tipo: 'crise_soberania', custoResolucao: 700, impacto: { soberaniaTerritorial: -30, imagemExterna: -20 } },
      { nivel: 4, texto: 'INTERVENÇÃO INTERNACIONAL: ONU discursa "responsabilidade de proteger"; países ameaçam ação', visivel: true, tipo: 'crise_internacional', custoResolucao: 1400, impacto: { soberania: -50, relacaoMundo: -40, riscoIntervencao: +35 } }
    ],
    fatores: ['fronteiras_porosas', 'corrupcao_local', 'recursos_valiosos'],
    tendencia: 'crescente',
    categoria: 'soberania',
    icone: '🌳'
  },
  {
    id: 'militares_politizacao',
    ministerioId: 'm_defesa',
    origem: 'politica',
    titulo: 'Politização das Forças Armadas',
    descricao: 'Alta oficialidade se envolve em disputas partidárias, ameaçando neutralidade.',
    estagios: [
      { nivel: 1, texto: 'Generais fazem discursos públicos criticando políticas governamentais', visivel: false },
      { nivel: 2, texto: 'Ministério é acusado de usar estrutura militar para propaganda política', visivel: false },
      { nivel: 3, texto: 'CRISE INSTITUCIONAL: Comandantes se recusam a cumprir ordens do presidente civil', visivel: true, tipo: 'crise_constitucional', custoResolucao: 500, impacto: { estabilidadeDemocratica: -30, credibilidadeForcasArmadas: -25 } },
      { nivel: 4, texto: 'RUPTURA: Militares emitem "ultimato" ao governo; risco de golpe é real', visivel: true, tipo: 'crise_institucional', custoResolucao: 1000, impacto: { democracia: -60, investimento: -40, riscoGuerraCivil: +25 } }
    ],
    fatores: ['tradicao_intervencionista', 'polarizacao_politica', 'crise_legitimidade'],
    tendencia: 'crescente',
    categoria: 'relacoes_civis_militares',
    icone: '🎖️'
  },
  {
    id: 'ciberguerra_estatal',
    ministerioId: 'm_defesa',
    origem: 'tecnica',
    titulo: 'Guerra Cibernética entre Potências no Brasil',
    descricao: 'EUA, China e Rússia travam guerra cibernética usando infraestrutura brasileira.',
    estagios: [
      { nivel: 1, texto: 'Servidores governamentais são atacados por IPs de múltiplos países', visivel: false },
      { nivel: 2, texto: 'Dados estratégicos de petróleo e mineração são roubados', visivel: false },
      { nivel: 3, texto: 'BRASIL CAMPO DE BATALHA: Ataques desativam controle aéreo por 8 horas', visivel: true, tipo: 'crise_seguranca_nacional', custoResolucao: 900, impacto: { segurancaNacional: -35, relacaoEUA: -15, relacaoChina: -15 } },
      { nivel: 4, texto: 'GUERRA PROXY: Potências usam malware brasileiro para atacar umas às outras; Brasil é sancionado por todos', visivel: true, tipo: 'crise_internacional', custoResolucao: 1800, impacto: { isolamentoDiplomatico: +40, comercioExterior: -30, investimento: -35 } }
    ],
    fatores: ['posicao_geostrategica', 'infraestrutura_vulneravel', 'conflito_eua_china'],
    tendencia: 'crescente',
    categoria: 'ciber_defesa',
    icone: '🖥️'
  },
  {
    id: 'industria_defesa_falencia',
    ministerioId: 'm_defesa',
    origem: 'tecnica',
    titulo: 'Falência da Indústria Nacional de Defesa',
    descricao: 'Embraer e outras empresas estratégicas à beira do colapso financeiro.',
    estagios: [
      { nivel: 1, texto: 'Embraer demite 30% da força de trabalho qualificada', visivel: false },
      { nivel: 2, texto: 'Projeto do submarino nuclear atrasa 5 anos por falta de componentes', visivel: false },
      { nivel: 3, texto: 'SOBERANIA TECNOLÓGICA PERDIDA: China compra empresas estratégicas por preços simbólicos', visivel: true, tipo: 'crise_estratégica', custoResolucao: 600, impacto: { soberaniaTecnologica: -30, empregoQualificado: -20 } },
      { nivel: 4, texto: 'DEPENDÊNCIA TOTAL: Brasil precisa importar até munição básica; orçamento explode', visivel: true, tipo: 'crise_estrutural', custoResolucao: 1200, impacto: { balancaComercial: -800, segurancaNacional: -40, custoDefesa: +50 } }
    ],
    fatores: ['corte_orcamentario', 'concorrencia_externa', 'falta_demandasustentada'],
    tendencia: 'crescente',
    categoria: 'base_industrial',
    icone: '🏭'
  },
  {
    id: 'missao_paz_fracasso',
    ministerioId: 'm_defesa',
    origem: 'midia',
    titulo: 'Fracasso em Missão de Paz da ONU',
    descricao: 'Tropas brasileiras são surpreendidas e sofrem baixas em missão internacional.',
    estagios: [
      { nivel: 1, texto: 'Comando da ONU alerta sobre deterioração da segurança na missão', visivel: false },
      { nivel: 2, texto: 'Dois soldados brasileiros são feridos em emboscada', visivel: false },
      { nivel: 3, texto: 'DESASTRE HUMANITÁRIO: 15 militares brasileiros mortos; cerco dura 48 horas', visivel: true, tipo: 'crise_internacional', custoResolucao: 500, impacto: { popularidade: -25, moralForcasArmadas: -30 } },
      { nivel: 4, texto: 'RETIRADA VERGONHOSA: Brasil é forçado a evacuar; prestígio internacional desaba', visivel: true, tipo: 'crise_diplomatica', custoResolucao: 1000, impacto: { imagemExterna: -45, influenciaONU: -35, softPower: -40 } }
    ],
    fatores: ['preparacao_insuficiente', 'inteligencia_falha', 'subestimacao_conflito'],
    tendencia: 'variavel',
    categoria: 'operacoes_internacionais',
    icone: '🕊️'
  },

  // ============================================
  // MINISTÉRIO DOS TRANSPORTES (6 problemas)
  // ============================================
  {
    id: 'rodovias_esburacadas',
    ministerioId: 'm_transp',
    origem: 'tecnica',
    titulo: 'Colapso da Malha Rodoviária',
    descricao: '60% das rodovias federais em estado crítico, aumentando acidentes e custos logísticos.',
    estagios: [
      { nivel: 1, texto: 'DNIT classifica 25% das rodovias como "péssimas"', visivel: false },
      { nivel: 2, texto: 'Acidentes com caminhões aumentam 40% por buracos', visivel: false },
      { nivel: 3, texto: 'PARALISAÇÃO NACIONAL DOS CAMINHONEIROS: Greve por estradas dignas', visivel: true, tipo: 'greve_setorial', custoResolucao: 600, impacto: { inflacao: +2, abastecimento: -30 } },
      { nivel: 4, texto: 'ROTA DA MORTE: Colisão em cadeia mata 50; imagens chocam o país', visivel: true, tipo: 'crise_humanitaria', custoResolucao: 1200, impacto: { popularidade: -30, custoLogistico: +25, turismo: -20 } }
    ],
    fatores: ['manutencao_negligente', 'cargas_pesadas', 'corrupcao_contratos'],
    tendencia: 'crescente',
    categoria: 'infraestrutura',
    icone: '🛣️'
  },
  {
    id: 'privatizacao_portos_fracasso',
    ministerioId: 'm_transp',
    origem: 'politica',
    titulo: 'Privatização dos Portos em Colapso',
    descricao: 'Concessionários não investem; portos operam com 50% da capacidade.',
    estagios: [
      { nivel: 1, texto: 'TCU identifica descumprimento de metas em 8 dos 12 portos privatizados', visivel: false },
      { nivel: 2, texto: 'Fila de navios atinge 7 dias no Porto de Santos', visivel: false },
      { nivel: 3, texto: 'EXPORTAÇÕES PARALISADAS: Soja apodrece nos portos; prejuízo de US$ 2 bi', visivel: true, tipo: 'crise_economica', custoResolucao: 700, impacto: { exportacoes: -20, balancaComercial: -800 } },
      { nivel: 4, texto: 'REESTATIZAÇÃO FORÇADA: Governo retoma portos após falência das concessionárias', visivel: true, tipo: 'crise_contratual', custoResolucao: 1400, impacto: { confiancaInvestidores: -35, gastos: +1000, imagemGoverno: -25 } }
    ],
    fatores: ['modelo_concessao_falho', 'fiscalizacao_fraca', 'interesses_privados'],
    tendencia: 'crescente',
    categoria: 'portos',
    icone: '🚢'
  },
  {
    id: 'acidentes_aereos_seriados',
    ministerioId: 'm_transp',
    origem: 'tecnica',
    titulo: 'Série de Acidentes Aéreos',
    descricao: 'Falhas em fiscalização e manutenção levam a múltiplos acidentes em curto período.',
    estagios: [
      { nivel: 1, texto: 'ANAC identifica irregularidades em 15% das companhias aéreas', visivel: false },
      { nivel: 2, texto: 'Dois acidentes com aviões regionais em uma semana', visivel: false },
      { nivel: 3, texto: 'TRAGÉDIA AÉREA: Avião comercial cai com 180 pessoas; pior acidente em 15 anos', visivel: true, tipo: 'crise_humanitaria', custoResolucao: 800, impacto: { popularidade: -35, confiancaAviao: -50, turismo: -30 } },
      { nivel: 4, texto: 'EMBARGO INTERNACIONAL: UE e EUA proíbem voos de companhias brasileiras', visivel: true, tipo: 'crise_internacional', custoResolucao: 1600, impacto: { turismo: -60, comercioExterior: -25, imagemExterna: -40 } }
    ],
    fatores: ['corte_fiscalizacao', 'manutencão_precaria', 'pressao_lucros'],
    tendencia: 'variavel',
    categoria: 'aviacao',
    icone: '✈️'
  },
  {
    id: 'transporte_publico_colapso',
    ministerioId: 'm_transp',
    origem: 'midia',
    titulo: 'Colapso do Transporte Público nas Capitais',
    descricao: 'Metrôs e ônibus operam no limite, com superlotação e frequentes paralisações.',
    estagios: [
      { nivel: 1, texto: 'Pesquisa mostra que 80% dos usuários consideram serviço "ruim ou péssimo"', visivel: false },
      { nivel: 2, texto: 'Greves de metroviários causam caos em SP e RJ simultaneamente', visivel: false },
      { nivel: 3, texto: 'REVOLTA DO BUSÃO: Protestos violentos após aumento de tarifa; 200 ônibus queimados', visivel: true, tipo: 'conflito_social', custoResolucao: 500, impacto: { popularidade: -25, produtividadeUrbana: -20 } },
      { nivel: 4, texto: 'CIDADES PARALISADAS: Sistema entra em colapso total; trabalhadores não chegam aos empregos', visivel: true, tipo: 'crise_urbana', custoResolucao: 1000, impacto: { pib: -1.0, desemprego: +3, criminalidade: +15 } }
    ],
    fatores: ['tarifas_baixas', 'subsidio_insuficiente', 'gestao_ineficiente'],
    tendencia: 'crescente',
    categoria: 'mobilidade_urbana',
    icone: '🚌'
  },
  {
    id: 'trem_bala_fracassado',
    ministerioId: 'm_transp',
    origem: 'midia',
    titulo: 'Fracasso do Trem de Alta Velocidade',
    descricao: 'Projeto bilionário atrasa décadas e vira símbolo de desperdício e incompetência.',
    estagios: [
      { nivel: 1, texto: 'Estudo de viabilidade técnica é questionado por especialistas', visivel: false },
      { nivel: 2, texto: 'Orçamento inicial é superado em 300% sem obras iniciadas', visivel: false },
      { nivel: 3, texto: 'ESCÂNDALO DO TREM FANTASMA: Investigação revela desvio de R$ 2 bi em licitações', visivel: true, tipo: 'escandalo_corrupcao', custoResolucao: 400, impacto: { capitalPolitico: -30, credibilidadeGoverno: -25 } },
      { nivel: 4, texto: 'PROJETO CANCELADO: Brasil paga multas bilionárias a consórcios internacionais', visivel: true, tipo: 'fracasso_infrastructure', custoResolucao: 800, impacto: { gastos: -1200, imagemExterna: -30, credibilidadeProjetos: -40 } }
    ],
    fatores: ['complexidade_tecnologica', 'corrupcao', 'mudancas_governo'],
    tendencia: 'estavel',
    categoria: 'projetos_estrategicos',
    icone: '🚄'
  },
  {
    id: 'ferrovias_abandonadas',
    ministerioId: 'm_transp',
    origem: 'tecnica',
    titulo: 'Rede Ferroviária em Estado de Abandono',
    descricao: '8.000 km de ferrovias estão inoperantes, desperdiçando potencial logístico.',
    estagios: [
      { nivel: 1, texto: '25% das ferrovias estão interditadas por falta de manutenção', visivel: false },
      { nivel: 2, texto: 'Acidentes com trens de carga aumentam 60% em um ano', visivel: false },
      { nivel: 3, texto: 'DESASTRE AMBIENTAL: Trem carregado com produtos químicos descarrila e contamina rio', visivel: true, tipo: 'crise_ambiental', custoResolucao: 600, impacto: { meioAmbiente: -25, saudePublica: -20, gastosEmergenciais: +300 } },
      { nivel: 4, texto: 'MORTE DAS FERROVIAS: Setor sucateado força retorno total ao transporte rodoviário', visivel: true, tipo: 'crise_logistica', custoResolucao: 1200, impacto: { custoLogistico: +35, emissaoCO2: +20, competitividade: -25 } }
    ],
    fatores: ['desinvestimento_cronico', 'priorizacao_rodovias', 'concessoes_mal_geridas'],
    tendencia: 'crescente',
    categoria: 'ferrovias',
    icone: '🚂'
  },

  // ============================================
  // MINISTÉRIO DO MEIO AMBIENTE (6 problemas)
  // ============================================
  {
    id: 'desmatamento_record',
    ministerioId: 'm_meioamb',
    origem: 'tecnica',
    titulo: 'Desmatamento em Níveis Recordes',
    descricao: 'Amazônia perde área equivalente a 3 campos de futebol por minuto.',
    estagios: [
      { nivel: 1, texto: 'INPE registra aumento de 30% no desmatamento em 6 meses', visivel: false },
      { nivel: 2, texto: 'Queimadas atingem áreas protegidas e terras indígenas', visivel: false },
      { nivel: 3, texto: 'AMAZÔNIA EM CHAMAS: Fumaça chega a São Paulo; imagens de satélite chocam o mundo', visivel: true, tipo: 'crise_ambiental', custoResolucao: 700, impacto: { imagemExterna: -35, relacaoUE: -25 } },
      { nivel: 4, texto: 'PONTO DE NÃO RETORNO: Cientistas alertam que floresta pode virar savana; reações internacionais extremas', visivel: true, tipo: 'crise_internacional', custoResolucao: 1400, impacto: { imagemExterna: -60, sancoesComerciais: +40, turismo: -45 } }
    ],
    fatores: ['garimpo_ilegal', 'grilagem', 'fiscalizacao_insuficiente'],
    tendencia: 'crescente',
    categoria: 'florestas',
    icone: '🔥'
  },
  {
    id: 'acordo_clima_fraude',
    ministerioId: 'm_meioamb',
    origem: 'midia',
    titulo: 'Fraude em Metas Climáticas',
    descricao: 'Dados de emissões são manipulados para cumprir acordos internacionais ficticiamente.',
    estagios: [
      { nivel: 1, texto: 'Auditoria interna encontra inconsistências nos relatórios de emissões', visivel: false },
      { nivel: 2, texto: 'Cientistas denunciam pressão para alterar dados científicos', visivel: false },
      { nivel: 3, texto: 'ESCÂNDALO CLIMÁTICO: Jornal internacional revela "contabilidade criativa" do Brasil', visivel: true, tipo: 'escandalo_internacional', custoResolucao: 400, impacto: { credibilidadeAmbiental: -50, relacaoONU: -30 } },
      { nivel: 4, texto: 'PAÍS PÁRIA: Brasil é expulso de acordos climáticos; perde acesso a fundos verdes', visivel: true, tipo: 'crise_diplomatica', custoResolucao: 800, impacto: { imagemExterna: -55, financiamentoVerde: -800, comercioExportacao: -25 } }
    ],
    fatores: ['pressao_resultados', 'falta_transparencia', 'interesses_economicos'],
    tendencia: 'estavel',
    categoria: 'politica_climatica',
    icone: '📊'
  },
  {
    id: 'agro_toxicos_desregulacao',
    ministerioId: 'm_meioamb',
    origem: 'politica',
    titulo: 'Desregulamentação de Agrotóxicos',
    descricao: 'Aprovação recorde de pesticidas banidos em outros países contamina alimentos e água.',
    estagios: [
      { nivel: 1, texto: '300 novos agrotóxicos aprovados em um ano, muitos já banidos na UE', visivel: false },
      { nivel: 2, texto: 'Estudos detectam resíduos acima do limite em 40% das amostras de alimentos', visivel: false },
      { nivel: 3, texto: 'SURTO DE INTOXICAÇÃO: 200 pessoas internadas após consumir alimentos contaminados', visivel: true, tipo: 'crise_sanitaria', custoResolucao: 500, impacto: { saudePublica: -20, exportacaoAlimentos: -15 } },
      { nivel: 4, texto: 'EMBARGO INTERNACIONAL: UE e China barram importação de alimentos brasileiros', visivel: true, tipo: 'crise_comercial', custoResolucao: 1000, impacto: { agroexportacao: -35, balancaComercial: -1200, desempregoRural: +8 } }
    ],
    fatores: ['lobby_agro', 'flexibilizacao_leis', 'fiscalizacao_fraca'],
    tendencia: 'crescente',
    categoria: 'agrotoxicos',
    icone: '☠️'
  },
  {
    id: 'racismo_ambiental',
    ministerioId: 'm_meioamb',
    origem: 'politica',
    titulo: 'Racismo Ambiental em Comunidades Tradicionais',
    descricao: 'Populações negras e indígenas são desproporcionalmente afetadas por poluição.',
    estagios: [
      { nivel: 1, texto: 'Estudo mostra que áreas negras têm 3x mais poluição do ar', visivel: false },
      { nivel: 2, texto: 'Comunidades quilombolas sofrem com contaminação por mineração', visivel: false },
      { nivel: 3, texto: 'PROTESTO NACIONAL: Movimentos sociais ocupam sede do ministério', visivel: true, tipo: 'conflito_social', custoResolucao: 400, impacto: { coesaoSocial: -20, direitosHumanos: -25 } },
      { nivel: 4, texto: 'DENÚNCIA NA CORTE INTERAMERICANA: Brasil é condenado por violação de direitos; sanções pesadas', visivel: true, tipo: 'crise_internacional', custoResolucao: 800, impacto: { imagemExterna: -40, ajudaHumanitaria: +300, riscoProtestos: +30 } }
    ],
    fatores: ['injustica_territorial', 'discriminacao_estrutural', 'falta_participacao'],
    tendencia: 'crescente',
    categoria: 'justica_ambiental',
    icone: '⚖️'
  },
  {
    id: 'lixoes_urbanos',
    ministerioId: 'm_meioamb',
    origem: 'tecnica',
    titulo: 'Colapso na Gestão de Resíduos Urbanos',
    descricao: '2.500 lixões a céu aberto contaminam solo e água em todo o país.',
    estagios: [
      { nivel: 1, texto: '60% dos municípios ainda usam lixões irregulares', visivel: false },
      { nivel: 2, texto: 'Catadores sofrem acidentes graves em lixões sem proteção', visivel: false },
      { nivel: 3, texto: 'TRAGÉDIA DO LIXÃO: Deslizamento em aterro mata 50 pessoas; cenas chocantes', visivel: true, tipo: 'crise_humanitaria', custoResolucao: 600, impacto: { popularidade: -20, saudePublica: -15 } },
      { nivel: 4, texto: 'EPIDEMIA URBANA: Dengue, zika e chikungunya explodem devido a focos de mosquitos em lixões', visivel: true, tipo: 'crise_sanitaria', custoResolucao: 1200, impacto: { saudePublica: -30, gastosEmergenciais: +500, turismo: -20 } }
    ],
    fatores: ['falta_investimento', 'gestao_municipal_fraca', 'consumismo_descontrolado'],
    tendencia: 'crescente',
    categoria: 'residuos',
    icone: '🗑️'
  },
  {
    id: 'mercado_carbono_corrupcao',
    ministerioId: 'm_meioamb',
    origem: 'midia',
    titulo: 'Corrupção no Mercado de Carbono',
    descricao: 'Créditos de carbono fraudulentos são vendidos internacionalmente, desmoralizando sistema.',
    estagios: [
      { nivel: 1, texto: 'Auditoria encontra projetos de carbono inexistentes no sistema oficial', visivel: false },
      { nivel: 2, texto: 'Empresas fantasmas recebem milhões por créditos de carbono fictícios', visivel: false },
      { nivel: 3, texto: 'FRAUDE BILIONÁRIA: Investigação revela esquema de "carbono fantasma" em áreas já desmatadas', visivel: true, tipo: 'escandalo_corrupcao', custoResolucao: 500, impacto: { credibilidadeAmbiental: -45, mercadoCarbono: -35 } },
      { nivel: 4, texto: 'COLAPSO DO MERCADO: Brasil é banido de todos os sistemas internacionais de carbono', visivel: true, tipo: 'crise_financeira', custoResolucao: 1000, impacto: { financiamentoVerde: -1000, imagemExterna: -50, desenvolvimentoSustentavel: -40 } }
    ],
    fatores: ['regulacao_falha', 'ganancia_rapida', 'complexidade_tecnica'],
    tendencia: 'crescente',
    categoria: 'economia_verde',
    icone: '🌿'
  },

  { id:'re_crise_consular', ministerioId:'m_exteriores', origem:'tecnica', titulo:'Rede Consular Saturada', descricao:'Crise no exterior expõe capacidade insuficiente para localizar e retirar brasileiros.', estagios:[
    {nivel:1,texto:'Postos consulares relatam aumento súbito de pedidos de assistência.',visivel:false},
    {nivel:2,texto:'Famílias reclamam de demora para localizar brasileiros em zona de risco.',visivel:false},
    {nivel:3,texto:'EVACUAÇÃO SOB PRESSÃO: imprensa cobra plano para centenas de brasileiros.',visivel:true,tipo:'crise_consular',custoResolucao:180,impacto:{popularidade:-4,imagemExterna:-3},penalidadeAtraso:{popularidade:-6,imagemExterna:-4}},
    {nivel:4,texto:'CRISE CONSULAR: falhas de coordenação deixam brasileiros retidos em área de conflito.',visivel:true,tipo:'crise_internacional',custoResolucao:360,impacto:{popularidade:-10,capitalPolitico:-8,imagemExterna:-7},penalidadeAtraso:{popularidade:-12,riscoCPI:10}}
  ], fatores:['crise_externa','logistica','informacao'], tendencia:'crescente', categoria:'consular', icone:'🛂' },
  { id:'re_vazamento_cabos', ministerioId:'m_exteriores', origem:'midia', titulo:'Vazamento de Cabogramas', descricao:'Mensagens reservadas expõem avaliações duras sobre parceiros e lideranças estrangeiras.', estagios:[
    {nivel:1,texto:'Equipe detecta acesso anormal a arquivo diplomático.',visivel:false},
    {nivel:2,texto:'Trechos de mensagens circulam entre jornalistas estrangeiros.',visivel:false},
    {nivel:3,texto:'VAZAMENTO DIPLOMÁTICO: parceiro exige explicações públicas do Itamaraty.',visivel:true,tipo:'escandalo',custoResolucao:120,impacto:{imagemExterna:-7,climaGoverno:-3},penalidadeAtraso:{imagemExterna:-8}},
    {nivel:4,texto:'CRISE DE CONFIANÇA: embaixadores são chamados para consultas e negociações são suspensas.',visivel:true,tipo:'crise_diplomatica',custoResolucao:240,impacto:{imagemExterna:-14,capitalPolitico:-7,riscoInstitucional:3},penalidadeAtraso:{imagemExterna:-12}}
  ], fatores:['seguranca_digital','vazamento','sigilo'], tendencia:'crescente', categoria:'informacao', icone:'📨' },
  { id:'re_tratado_travado', ministerioId:'m_exteriores', origem:'politica', titulo:'Tratado sem Base no Congresso', descricao:'Acordo internacional relevante encontra resistência parlamentar e de setores afetados.', estagios:[
    {nivel:1,texto:'Líderes pedem esclarecimentos sobre concessões do acordo.',visivel:false},
    {nivel:2,texto:'Bancadas setoriais ameaçam bloquear a ratificação.',visivel:false},
    {nivel:3,texto:'TRATADO EMPACA: oposição e base divergem sobre compromissos internacionais.',visivel:true,tipo:'conflito_politico',custoResolucao:90,impacto:{apoioCongressual:-5,imagemExterna:-3},penalidadeAtraso:{apoioCongressual:-6}},
    {nivel:4,texto:'PARCEIRO SUSPENDE NEGOCIAÇÕES após meses sem ratificação brasileira.',visivel:true,tipo:'crise_politica',custoResolucao:180,impacto:{imagemExterna:-9,capitalPolitico:-6,confiancaMercado:-2},penalidadeAtraso:{imagemExterna:-8}}
  ], fatores:['congresso','setores','ratificacao'], tendencia:'estavel', categoria:'tratados', icone:'📜' },

];

// Metadados sobre os problemas para uso no sistema de balanceamento
export const problemasMetadata = {
  totalProblemas: 48,
  distribuicaoPorMinisterio: {
    m_saude: 8,
    m_fazenda: 6,
    m_educacao: 6,
    m_justica: 6,
    m_defesa: 6,
    m_transp: 6,
    m_meioamb: 6
  },
  distribuicaoPorOrigem: {
    tecnica: 24,
    politica: 12,
    midia: 12
  },
  distribuicaoPorSeveridade: {
    leve: 12,    // Nível 1-2
    moderada: 18, // Nível 3
    grave: 18     // Nível 4
  },
  problemasCriticos: [
    'fila_sus',
    'risco_fiscal',
    'superlotacao_carceraria',
    'desmatamento_record',
    'amazonia_invasores',
    'evasao_escolar'
  ],
  problemasCiclicos: [
    'professores_greve',
    'inflacao_alimentar',
    'violencia_policial'
  ],
  problemasEstruturais: [
    'esgotamento_profissionais',
    'divida_explodindo',
    'tecnologia_atrasada',
    'equipamento_obsoleto',
    'rodovias_esburacadas',
    'ferrovias_abandonadas'
  ],
  custoTotalResolucaoNivel3: 19450, // Soma dos custos de resolução em nível 3
  custoTotalResolucaoNivel4: 38900  // Soma dos custos de resolução em nível 4
};

// Funções auxiliares para trabalhar com problemas
export const agruparProblemas = {
  porMinisterio: (ministerioId) => problemasSeed.filter(p => p.ministerioId === ministerioId),
  
  porOrigem: (origem) => problemasSeed.filter(p => p.origem === origem),
  
  porCategoria: (categoria) => problemasSeed.filter(p => p.categoria === categoria),
  
  porTendencia: (tendencia) => problemasSeed.filter(p => p.tendencia === tendencia),
  
  getProblemasPrioritarios: () => problemasSeed.filter(p => 
    p.tendencia === 'crescente' && 
    problemasMetadata.problemasCriticos.includes(p.id)
  ),
  
  getProblemasCustoBaixo: (maxCusto) => {
    return problemasSeed.filter(p => {
      const custoNivel3 = p.estagios.find(e => e.nivel === 3)?.custoResolucao || 0;
      const custoNivel4 = p.estagios.find(e => e.nivel === 4)?.custoResolucao || 0;
      return Math.min(custoNivel3, custoNivel4) <= maxCusto;
    });
  },
  
  getProblemasImpactoAlto: () => {
    return problemasSeed.filter(p => {
      const impactoNivel4 = p.estagios.find(e => e.nivel === 4)?.impacto || {};
      const valores = Object.values(impactoNivel4).filter(v => v < 0);
      return valores.some(v => v <= -30);
    });
  },
  
  gerarProblemaAleatorio: (ministerioId, origem) => {
    const problemasFiltrados = problemasSeed.filter(p => 
      p.ministerioId === ministerioId && 
      p.origem === origem
    );
    
    if (problemasFiltrados.length === 0) return null;
    
    const problemaBase = problemasFiltrados[Math.floor(Math.random() * problemasFiltrados.length)];
    
    // Clonar o problema base para evitar referências
    return JSON.parse(JSON.stringify(problemaBase));
  }
};

// Sistema de interdependência entre problemas
export const interdependenciaProblemas = {
  // Problemas que agravam outros problemas
  relacoes: [
    {
      problemaOrigem: 'desmatamento_record',
      problemaDestino: 'amazonia_invasores',
      efeito: 'Aumenta nível em +1',
      descricao: 'Desmatamento facilita entrada de invasores'
    },
    {
      problemaOrigem: 'esgotamento_profissionais',
      problemaDestino: 'fila_sus',
      efeito: 'Acelera maturação em 50%',
      descricao: 'Falta de profissionais piora atendimento'
    },
    {
      problemaOrigem: 'rodovias_esburacadas',
      problemaDestino: 'inflacao_alimentar',
      efeito: 'Aumenta impacto em +5',
      descricao: 'Logística ruim aumenta preço dos alimentos'
    },
    {
      problemaOrigem: 'superlotacao_carceraria',
      problemaDestino: 'facções_transnacionais',
      efeito: 'Acelera maturação em 30%',
      descricao: 'Prisões lotadas fortalecem facções'
    },
    {
      problemaOrigem: 'evasao_escolar',
      problemaDestino: 'milícias_urbanas',
      efeito: 'Aumenta nível em +1',
      descricao: 'Jovens fora da escola são recrutados por milícias'
    }
  ],
  
  // Cadeias de problemas (efeito dominó)
  cadeias: [
    {
      nome: 'Cadeia da Saúde',
      problemas: ['esgotamento_profissionais', 'fila_sus', 'falta_insumos', 'medicamentos_sumindo'],
      descricao: 'Problemas no sistema de saúde se retroalimentam'
    },
    {
      nome: 'Cadeia da Segurança',
      problemas: ['superlotacao_carceraria', 'facções_transnacionais', 'violencia_policial', 'milícias_urbanas'],
      descricao: 'Crise no sistema de segurança gera ciclo vicioso'
    },
    {
      nome: 'Cadeia da Infraestrutura',
      problemas: ['rodovias_esburacadas', 'transporte_publico_colapso', 'ferrovias_abandonadas', 'acidentes_aereos_seriados'],
      descricao: 'Falta de manutenção causa colapso em múltiplas áreas'
    }
  ],
  
  // Verificar se um problema afeta outro
  verificarInterdependencia: (problemaId1, problemaId2) => {
    return interdependenciaProblemas.relacoes.some(rel => 
      (rel.problemaOrigem === problemaId1 && rel.problemaDestino === problemaId2) ||
      (rel.problemaOrigem === problemaId2 && rel.problemaDestino === problemaId1)
    );
  },
  
  // Obter todos os problemas relacionados
  getProblemasRelacionados: (problemaId) => {
    const relacionados = new Set();
    
    interdependenciaProblemas.relacoes.forEach(rel => {
      if (rel.problemaOrigem === problemaId) relacionados.add(rel.problemaDestino);
      if (rel.problemaDestino === problemaId) relacionados.add(rel.problemaOrigem);
    });
    
    return Array.from(relacionados);
  }
};

export default problemasSeed;