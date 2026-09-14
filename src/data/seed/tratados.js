// src/data/seed/tratados.js

export const tratadosSeed = [
  {
    id: 'cn',
    paisId: 'cn',
    titulo: "ACORDO ESTRATÉGICO BRASIL-CHINA",
    duracao: 10,
    revisao: "Anual",
    clausulaSaida: 12,
    beneficiosBrasil: [
      "Acesso ao Novo Banco BRICS (US$ 5B em crédito)",
      "Transferência de tecnologia solar (eficiência +20%)",
      "Preferência em contratos de infraestrutura"
    ],
    compromissosBrasil: [
      "Silêncio diplomático sobre Taiwan",
      "Cotas de soja garantidas",
      "Participação em projetos da Rota da Seda"
    ],
    efeitos: {
      relacao: +25,
      orcamento: 5000,
      economiaCrescimento: +0.8,
      softPower: +15,
      imagemExterna: +10
    },
    reacoes: {
      aliados: ['ru', 'in', 'za', 'sa'],
      rivais: ['us', 'jp', 'tw'],
      partidosCriticos: ['dir']
    }
  },
  
  {
    id: 'us',
    paisId: 'us',
    titulo: "PARCERIA ESTRATÉGICA BRASIL-EUA",
    duracao: 8,
    revisao: "Bianual",
    clausulaSaida: 6,
    beneficiosBrasil: [
      "Acesso a tecnologia de defesa (F-39 Gripen)",
      "Linha de crédito do FMI em condições especiais",
      "Cooperação em inteligência cibernética"
    ],
    compromissosBrasil: [
      "Alinhamento em votações na OEA",
      "Abertura setor telecomunicações",
      "Padrões ambientais OCDE"
    ],
    efeitos: {
      relacao: +20,
      orcamento: 3000,
      tecnologiaMilitar: +15,
      confiancaMercado: +25,
      riscoPais: -30
    },
    reacoes: {
      aliados: ['ca', 'gb', 'de', 'fr', 'jp'],
      rivais: ['ru', 'ir', 've'],
      partidosCriticos: ['esq']
    }
  },
  
  {
    id: 'default',
    paisId: null,
    titulo: "ACORDO DE COOPERAÇÃO BILATERAL",
    duracao: 5,
    revisao: "Anual",
    clausulaSaida: 6,
    beneficiosBrasil: [
      "Incremento comercial bilateral",
      "Cooperação técnica",
      "Facilitação de vistos"
    ],
    compromissosBrasil: [
      "Reciprocidade em acordos",
      "Diálogo político regular",
      "Cooperação em fóruns multilaterais"
    ],
    efeitos: {
      relacao: +15,
      orcamento: 1000,
      comercio: +10,
      softPower: +5
    },
    reacoes: {
      aliados: [],
      rivais: [],
      partidosCriticos: []
    }
  }
];