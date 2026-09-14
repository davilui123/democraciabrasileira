import { dossiesSTF, dossiesCandidatosSTF } from './dossiesPersonagens.js';

const corteSTFBase = [
  {id:'stf_aurora',nome:'Aurora Nogueira',idade:66,origem:'Magistratura',perfil:'institucionalista',indicadoPor:'Governo anterior I',avatar:'stf-aurora',independencia:91,garantismo:68,rigorFiscal:52,descricao:'Defende deferência institucional, mas reage duramente a atalhos processuais.'},
  {id:'stf_breno',nome:'Breno Vasconcelos',idade:61,origem:'Ministério Público',perfil:'punitivista moderado',indicadoPor:'Governo anterior I',avatar:'stf-breno',independencia:83,garantismo:42,rigorFiscal:58,descricao:'Forte em integridade pública e responsabilidade de agentes.'},
  {id:'stf_celina',nome:'Celina Prado',idade:59,origem:'Academia',perfil:'progressista',indicadoPor:'Governo anterior II',avatar:'stf-celina',independencia:88,garantismo:79,rigorFiscal:38,descricao:'Constitucionalista com foco em direitos fundamentais e políticas sociais.'},
  {id:'stf_domingos',nome:'Domingos Ferraz',idade:68,origem:'Advocacia',perfil:'federalista',indicadoPor:'Governo anterior II',avatar:'stf-domingos',independencia:74,garantismo:55,rigorFiscal:64,descricao:'Especialista em pacto federativo, competências e tributação entre entes.'},
  {id:'stf_elisa',nome:'Elisa Tanaka',idade:57,origem:'Magistratura',perfil:'técnica',indicadoPor:'Governo anterior III',avatar:'stf-elisa',independencia:94,garantismo:61,rigorFiscal:70,descricao:'Evita declarações públicas e decide com forte ênfase em texto constitucional e precedentes.'},
  {id:'stf_flavio',nome:'Flávio Lacerda',idade:64,origem:'Advocacia pública',perfil:'estatalista',indicadoPor:'Governo anterior III',avatar:'stf-flavio',independencia:77,garantismo:57,rigorFiscal:34,descricao:'Reconhece margem ampla para políticas públicas, desde que respeitado o processo legislativo.'},
  {id:'stf_gabriela',nome:'Gabriela Diniz',idade:54,origem:'Ministério Público',perfil:'anticorrupção',indicadoPor:'Governo anterior IV',avatar:'stf-gabriela',independencia:89,garantismo:46,rigorFiscal:62,descricao:'Muito sensível a conflitos de interesse, captura regulatória e uso político de estatais.'},
  {id:'stf_henrique',nome:'Henrique Paiva',idade:63,origem:'Academia',perfil:'liberal constitucional',indicadoPor:'Governo anterior IV',avatar:'stf-henrique',independencia:86,garantismo:72,rigorFiscal:78,descricao:'Protege liberdades civis, contratos e limites à intervenção econômica arbitrária.'},
  {id:'stf_iris',nome:'Íris Albuquerque',idade:58,origem:'Defensoria Pública',perfil:'social',indicadoPor:'Governo anterior V',avatar:'stf-iris',independencia:92,garantismo:87,rigorFiscal:31,descricao:'Prioriza acesso à Justiça, direitos sociais e proteção de grupos vulneráveis.'},
  {id:'stf_joaquim',nome:'Joaquim Torres',idade:69,origem:'Magistratura',perfil:'conservador institucional',indicadoPor:'Governo anterior V',avatar:'stf-joaquim',independencia:81,garantismo:39,rigorFiscal:69,descricao:'Conservador em costumes, rigoroso com separação de Poderes e competências constitucionais.'},
];

const candidatosSTFBase = [
  {id:'cand_stf_1',nome:'Marina Fontes',idade:49,origem:'Superior Tribunal de Justiça',perfil:'técnica institucional',avatar:'cand-stf-marina',independencia:92,garantismo:64,rigorFiscal:66,reputacao:91,apoioSenado:58,descricao:'Ministra de tribunal superior, baixa exposição partidária e ampla reputação técnica.'},
  {id:'cand_stf_2',nome:'Otávio Gama',idade:55,origem:'Procuradoria-Geral',perfil:'anticorrupção',avatar:'cand-stf-otavio',independencia:81,garantismo:44,rigorFiscal:61,reputacao:80,apoioSenado:52,descricao:'Procurador conhecido por investigações de alto impacto; agrada setores de controle e assusta a classe política.'},
  {id:'cand_stf_3',nome:'Helena Duarte',idade:46,origem:'Universidade Federal',perfil:'progressista garantista',avatar:'cand-stf-helena',independencia:94,garantismo:91,rigorFiscal:33,reputacao:86,apoioSenado:44,descricao:'Professora constitucionalista com forte apoio acadêmico e resistência de bancadas conservadoras.'},
  {id:'cand_stf_4',nome:'Ricardo Mendonça',idade:62,origem:'Advocacia empresarial',perfil:'liberal econômico',avatar:'cand-stf-ricardo',independencia:72,garantismo:69,rigorFiscal:90,reputacao:73,apoioSenado:61,descricao:'Advogado de grandes empresas, forte no Senado e questionado por vínculos corporativos.'},
  {id:'cand_stf_5',nome:'Sônia Ribeiro',idade:52,origem:'Defensoria Pública',perfil:'social federalista',avatar:'cand-stf-sonia',independencia:90,garantismo:84,rigorFiscal:42,reputacao:88,apoioSenado:49,descricao:'Defensora pública com experiência em conflitos federativos e direitos sociais.'},
  {id:'cand_stf_6',nome:'Paulo Neri',idade:59,origem:'Senado / Advocacia',perfil:'político conciliador',avatar:'cand-stf-paulo',independencia:58,garantismo:56,rigorFiscal:55,reputacao:62,apoioSenado:74,descricao:'Ex-senador e jurista. Facilmente aprovado, mas a independência futura é uma incógnita.'},
];

export const corteSTFSeed = corteSTFBase.map(ministro => { const d=dossiesSTF[ministro.id]||{}; return ({ ...ministro, ...d, agendaPessoal:d.agendaPessoal||d.teseCentral }); });

export const candidatosSTFSeed = candidatosSTFBase.map(candidato => ({ ...candidato, ...(dossiesCandidatosSTF[candidato.id] || {}) }));

export const instituicoesSeed = [
  {id:'stf',nome:'Supremo Tribunal Federal',sigla:'STF',tipo:'Judiciário',autonomia:94,tensao:15,descricao:'Guarda da Constituição e árbitro das grandes controvérsias institucionais.'},
  {id:'tcu',nome:'Tribunal de Contas da União',sigla:'TCU',tipo:'Controle externo',autonomia:88,tensao:18,descricao:'Fiscaliza contratos, governança, obras e uso de recursos federais.'},
  {id:'pgr',nome:'Procuradoria-Geral da República',sigla:'PGR',tipo:'Ministério Público',autonomia:86,tensao:20,descricao:'Pode investigar autoridades, questionar atos e levar controvérsias ao Supremo.'},
  {id:'bc',nome:'Banco Central',sigla:'BCB',tipo:'Autoridade monetária',autonomia:90,tensao:22,descricao:'Define a política monetária dentro de sua autonomia e reage à inflação, expectativas e risco.'},
];
