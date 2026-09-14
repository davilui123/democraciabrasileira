import { dossiesCongresso } from './dossiesPersonagens.js';

const atoresCongressoBase = [
  {
    id: 'pres_camara', nome: 'Augusto Valença', cargo: 'Presidente da Câmara', partidoId: 'centro', uf: 'PE',
    perfil: 'Pragmático', influencia: 92, relacao: 46, ambicao: 88, lealdade: 35, risco: 28,
    pauta: ['federalismo', 'economia'], frase: 'Sem pauta, não existe governo. Sem maioria, não existe pauta.', avatarSeed: 'Augusto Valenca'
  },
  {
    id: 'lider_governo', nome: 'Helena Prado', cargo: 'Líder do Governo', partidoId: 'esq', uf: 'BA',
    perfil: 'Articuladora', influencia: 82, relacao: 72, ambicao: 61, lealdade: 81, risco: 18,
    pauta: ['sociedade', 'saude', 'educacao'], frase: 'Eu consigo os votos, mas preciso saber até onde o Planalto pode ceder.', avatarSeed: 'Helena Prado'
  },
  {
    id: 'lider_centro', nome: 'Renato Vasconcelos', cargo: 'Líder do Bloco de Centro', partidoId: 'centro', uf: 'GO',
    perfil: 'Negociador', influencia: 87, relacao: 42, ambicao: 84, lealdade: 34, risco: 43,
    pauta: ['infraestrutura', 'agro', 'federalismo'], frase: 'O texto é importante. O calendário e a relatoria também.', avatarSeed: 'Renato Vasconcelos'
  },
  {
    id: 'lider_liberal', nome: 'Camila Ferraz', cargo: 'Líder Liberal', partidoId: 'dir', uf: 'SP',
    perfil: 'Opositora técnica', influencia: 79, relacao: 24, ambicao: 76, lealdade: 22, risco: 16,
    pauta: ['economia', 'tributacao', 'digital'], frase: 'Dê previsibilidade fiscal e talvez exista conversa.', avatarSeed: 'Camila Ferraz'
  },
  {
    id: 'lider_ind', nome: 'Otávio Nogueira', cargo: 'Coordenador dos Independentes', partidoId: 'ind', uf: 'MG',
    perfil: 'Moderado', influencia: 64, relacao: 55, ambicao: 47, lealdade: 48, risco: 11,
    pauta: ['institucional', 'saude', 'educacao'], frase: 'Meu grupo não fecha questão sem ler o relatório.', avatarSeed: 'Otavio Nogueira'
  },
  {
    id: 'pres_ccjc', nome: 'Teresa Montenegro', cargo: 'Presidente da CCJC', partidoId: 'centro', uf: 'PR',
    perfil: 'Jurista', influencia: 76, relacao: 44, ambicao: 58, lealdade: 43, risco: 9,
    pauta: ['institucional'], frase: 'A política passa. O parecer fica nos autos.', avatarSeed: 'Teresa Montenegro'
  },
  {
    id: 'pres_cft', nome: 'Eduardo Salles', cargo: 'Presidente da CFT', partidoId: 'dir', uf: 'SC',
    perfil: 'Fiscalista', influencia: 73, relacao: 31, ambicao: 52, lealdade: 29, risco: 8,
    pauta: ['economia', 'tributacao'], frase: 'Mostre a fonte de custeio e eu mostro o caminho.', avatarSeed: 'Eduardo Salles'
  },
  {
    id: 'pres_social', nome: 'Marta Luz', cargo: 'Presidente da Comissão de Saúde', partidoId: 'esq', uf: 'CE',
    perfil: 'Social', influencia: 58, relacao: 68, ambicao: 43, lealdade: 72, risco: 7,
    pauta: ['saude', 'sociedade'], frase: 'Sem impacto social mensurável, não há relatório favorável.', avatarSeed: 'Marta Luz'
  },
  {
    id: 'pres_seguranca', nome: 'Rafael Mendonça', cargo: 'Presidente da Comissão de Segurança', partidoId: 'dir', uf: 'RJ',
    perfil: 'Linha dura', influencia: 67, relacao: 28, ambicao: 65, lealdade: 25, risco: 21,
    pauta: ['seguranca'], frase: 'Segurança não se negocia com slogan.', avatarSeed: 'Rafael Mendonca'
  },
  {
    id: 'pres_meioamb', nome: 'Lívia Azevedo', cargo: 'Presidente da Comissão de Meio Ambiente', partidoId: 'ind', uf: 'AM',
    perfil: 'Ambientalista pragmática', influencia: 61, relacao: 57, ambicao: 49, lealdade: 51, risco: 6,
    pauta: ['ambiental', 'energia'], frase: 'Se o texto trouxer transição e compensação, eu construo maioria.', avatarSeed: 'Livia Azevedo'
  },
];

export const atoresCongressoSeed = atoresCongressoBase.map(ator => ({ ...ator, ...(dossiesCongresso[ator.id] || {}) }));

export default atoresCongressoSeed;
