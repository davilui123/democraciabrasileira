import { partidosEleitoraisBase } from './partidos.js';
export const calendarioEleitoral2026 = [
  { id:'pre', data:'2026-01-01', titulo:'Pré-campanha', texto:'Articulação política, construção de chapa e posicionamento público.', fase:'pre_campanha' },
  { id:'janela', data:'2026-03-05', fim:'2026-04-03', titulo:'Janela partidária', texto:'Deputados podem trocar de partido; o tabuleiro legislativo entra em movimento.', fase:'janela_partidaria' },
  { id:'filiacao', data:'2026-04-04', titulo:'Prazo de filiação', texto:'Data-limite simulada para filiação e domicílio eleitoral dos futuros candidatos.', fase:'pre_campanha' },
  { id:'crowdfunding', data:'2026-05-15', titulo:'Financiamento coletivo', texto:'A pré-campanha pode ativar crowdfunding regular e transparente.', fase:'pre_campanha' },
  { id:'fefc', data:'2026-06-16', titulo:'Fundo eleitoral conhecido', texto:'O partido passa a trabalhar com sua cota e critérios internos de distribuição.', fase:'pre_campanha' },
  { id:'convencao', data:'2026-07-20', fim:'2026-08-05', titulo:'Convenções partidárias', texto:'Partidos oficializam candidaturas e coligações.', fase:'convencao' },
  { id:'registro', data:'2026-08-15', titulo:'Registro de candidatura', texto:'Prazo final para o registro das candidaturas.', fase:'registro' },
  { id:'campanha', data:'2026-08-16', titulo:'Campanha oficial', texto:'Começa a propaganda eleitoral geral.', fase:'campanha' },
  { id:'turno1', data:'2026-10-04', titulo:'1º turno', texto:'Dia da votação nacional e estadual.', fase:'primeiro_turno' },
  { id:'turno2', data:'2026-10-25', titulo:'2º turno', texto:'Segundo turno, quando necessário.', fase:'segundo_turno' },
];

export const partidosEleitoraisSeed = partidosEleitoraisBase;

export const viceAtualPorPartido = {
  esq:{ id:'vice_teresa_amaral', nome:'Teresa Amaral', cargo:'Vice-Presidente da República', partidoId:'esq', uf:'BA', ideologia:'centro-esquerda', regiao:'Nordeste', popularidade:55, lealdade:76, ambicao:58, pesoEleitoral:63, risco:18, visibilidade:48, avatar:'vice-teresa-amaral', carreira:'Ex-governadora e senadora', frase:'Lealdade não significa silêncio quando a coalizão começa a rachar.', agendaPessoal:'Fortalecer políticas sociais com responsabilidade federativa.', rede:'Governadores do Nordeste, bancada social e prefeitos médios.', vulnerabilidade:'Seu grupo político cobra espaço próprio e pode resistir a uma troca de chapa.', biografia:'Ex-governadora com boa relação entre prefeitos e Congresso. Entrou na chapa anterior para equilibrar experiência regional e densidade legislativa.' },
  centro:{ id:'vice_henrique_prado', nome:'Henrique Prado', cargo:'Vice-Presidente da República', partidoId:'centro', uf:'MG', ideologia:'centro', regiao:'Sudeste', popularidade:52, lealdade:67, ambicao:69, pesoEleitoral:70, risco:24, visibilidade:53, avatar:'vice-henrique-prado', carreira:'Ex-senador e empresário industrial', frase:'Um vice útil constrói pontes; um vice ignorado constrói alternativas.', agendaPessoal:'Pacto produtivo e descentralização de investimentos.', rede:'Empresariado mineiro, centro parlamentar e federações industriais.', vulnerabilidade:'Ambição alta e relação antiga com caciques do centro.', biografia:'Negociador habilidoso, ajudou a montar a coalizão eleitoral e preservou base própria no Congresso.' },
  dir:{ id:'vice_laura_mendonca', nome:'Laura Mendonça', cargo:'Vice-Presidente da República', partidoId:'dir', uf:'PR', ideologia:'centro-direita', regiao:'Sul', popularidade:59, lealdade:70, ambicao:62, pesoEleitoral:66, risco:20, visibilidade:56, avatar:'vice-laura-mendonca', carreira:'Ex-prefeita e economista', frase:'Estabilidade também é uma agenda política.', agendaPessoal:'Gestão, infraestrutura e equilíbrio fiscal.', rede:'Prefeitos do Sul, agroindústria e ala liberal moderada.', vulnerabilidade:'Pode perder conexão com a base mais ideológica do partido.', biografia:'Economista com perfil executivo; tornou-se vice para reduzir rejeição e ampliar diálogo com centro e setor produtivo.' },
  ind:{ id:'vice_sergio_barros', nome:'Sérgio Barros', cargo:'Vice-Presidente da República', partidoId:'ind', uf:'GO', ideologia:'centro', regiao:'Centro-Oeste', popularidade:48, lealdade:79, ambicao:43, pesoEleitoral:51, risco:12, visibilidade:39, avatar:'vice-sergio-barros', carreira:'Ex-reitor e ex-secretário estadual', frase:'Nem toda influência precisa de palanque.', agendaPessoal:'Educação técnica, federalismo e mediação política.', rede:'Universidades, gestores públicos e independentes.', vulnerabilidade:'Baixo peso eleitoral fora de sua rede institucional.', biografia:'Escolhido como vice por confiabilidade e trânsito técnico. Tem pouca rejeição, mas raramente move votos sozinho.' },
};

export const caciquesPartidariosSeed = [
  {id:'cac_ppg_ne',partidoId:'esq',nome:'Dalva Menezes',uf:'CE',regiao:'Nordeste',cargo:'Presidente regional do PPG',influencia:78,apoioInicial:42,avatar:'cac-dalva-menezes',demanda:'Prioridade regional',ofertas:['agenda_regional','programa_partidario','estrutura_local'],descricao:'Ex-senadora que controla diretórios municipais e cobra presença real no Nordeste.'},
  {id:'cac_ppg_se',partidoId:'esq',nome:'Márcio Fontoura',uf:'SP',regiao:'Sudeste',cargo:'Tesoureiro nacional do PPG',influencia:84,apoioInicial:38,avatar:'cac-marcio-fontoura',demanda:'Estrutura nacional',ofertas:['estrutura_local','programa_partidario','participacao_governo'],descricao:'Organizador metódico que mede viabilidade por bancada, orçamento legal de campanha e disciplina interna.'},
  {id:'cac_ppg_sul',partidoId:'esq',nome:'Irene Bastos',uf:'RS',regiao:'Sul',cargo:'Líder histórica do PPG',influencia:69,apoioInicial:50,avatar:'cac-irene-bastos',demanda:'Compromisso programático',ofertas:['programa_partidario','vice_regional','agenda_regional'],descricao:'Sindicalista histórica; prefere perder uma eleição a apoiar uma chapa sem identidade reconhecível.'},
  {id:'cac_moc_ne',partidoId:'centro',nome:'Artur Lemos',uf:'PE',regiao:'Nordeste',cargo:'Secretário-geral do MOC',influencia:90,apoioInicial:36,avatar:'cac-artur-lemos',demanda:'Governabilidade futura',ofertas:['participacao_governo','agenda_regional','estrutura_local'],descricao:'Especialista em montar maiorias e distribuí-las pelo território.'},
  {id:'cac_moc_co',partidoId:'centro',nome:'Mônica Rezende',uf:'GO',regiao:'Centro-Oeste',cargo:'Coordenadora de bancadas',influencia:82,apoioInicial:41,avatar:'cac-monica-rezende',demanda:'Espaço programático',ofertas:['programa_partidario','vice_regional','estrutura_local'],descricao:'Costura agro, prefeitos e centro urbano; não gosta de candidato que fala uma coisa para cada plateia.'},
  {id:'cac_moc_se',partidoId:'centro',nome:'Paulo Seabra',uf:'MG',regiao:'Sudeste',cargo:'Presidente do conselho político',influencia:86,apoioInicial:34,avatar:'cac-paulo-seabra',demanda:'Posição na coalizão',ofertas:['participacao_governo','vice_regional','agenda_regional'],descricao:'Ex-governador que preserva influência nacional e sempre negocia olhando o dia seguinte da eleição.'},
  {id:'cac_lib_se',partidoId:'dir',nome:'Eduardo Meirelles',uf:'SP',regiao:'Sudeste',cargo:'Presidente nacional do LIB',influencia:92,apoioInicial:31,avatar:'cac-eduardo-meirelles',demanda:'Programa econômico',ofertas:['programa_partidario','estrutura_local','participacao_governo'],descricao:'Liberal ortodoxo; quer coerência econômica e uma campanha competitiva no Sudeste.'},
  {id:'cac_lib_sul',partidoId:'dir',nome:'Patrícia Dornelles',uf:'SC',regiao:'Sul',cargo:'Coordenadora eleitoral',influencia:76,apoioInicial:44,avatar:'cac-patricia-dornelles',demanda:'Vice ou protagonismo regional',ofertas:['vice_regional','agenda_regional','estrutura_local'],descricao:'Organiza prefeitos e influenciadores conservadores, mas exige espaço regional claro.'},
  {id:'cac_lib_co',partidoId:'dir',nome:'Gilberto França',uf:'MT',regiao:'Centro-Oeste',cargo:'Líder da ala produtiva',influencia:74,apoioInicial:39,avatar:'cac-gilberto-franca',demanda:'Agenda produtiva',ofertas:['programa_partidario','agenda_regional','participacao_governo'],descricao:'Representa agro e empresários regionais; cobra infraestrutura e abertura comercial.'},
  {id:'cac_ind_n',partidoId:'ind',nome:'Nádia Macuxi',uf:'RR',regiao:'Norte',cargo:'Coordenadora do IND no Norte',influencia:62,apoioInicial:48,avatar:'cac-nadia-macuxi',demanda:'Federalismo real',ofertas:['agenda_regional','programa_partidario','vice_regional'],descricao:'Política municipalista que exige compromissos territoriais e autonomia local.'},
  {id:'cac_ind_se',partidoId:'ind',nome:'Luís Ferraz',uf:'RJ',regiao:'Sudeste',cargo:'Porta-voz nacional do IND',influencia:67,apoioInicial:46,avatar:'cac-luis-ferraz',demanda:'Chapa competitiva',ofertas:['vice_regional','estrutura_local','participacao_governo'],descricao:'Comunicador moderado, muito sensível a rejeição e qualidade do vice.'},
  {id:'cac_ind_ne',partidoId:'ind',nome:'Sandra Cavalcante',uf:'PB',regiao:'Nordeste',cargo:'Presidente do fórum municipalista',influencia:64,apoioInicial:45,avatar:'cac-sandra-cavalcante',demanda:'Prefeitos na mesa',ofertas:['agenda_regional','estrutura_local','programa_partidario'],descricao:'Ex-prefeita que só embarca quando a campanha oferece estratégia para cidades médias.'},
];

export const ofertasConvencaoSeed = {
  estrutura_local:{id:'estrutura_local',nome:'Estrutura partidária regional',texto:'Direcionar equipe, tempo e estrutura legal de campanha à região do cacique.',apoio:16,custo:7,coerencia:0,risco:2},
  programa_partidario:{id:'programa_partidario',nome:'Incorporar ponto programático',texto:'Assumir publicamente uma prioridade do grupo no programa eleitoral.',apoio:19,custo:2,coerencia:-3,risco:0},
  participacao_governo:{id:'participacao_governo',nome:'Participação em eventual governo',texto:'Comprometer espaço político futuro para o grupo, sem definir pessoa ou cargo específico.',apoio:23,custo:0,coerencia:-5,risco:5},
  vice_regional:{id:'vice_regional',nome:'Abrir negociação para o vice',texto:'Dar ao grupo influência sobre a composição regional da chapa.',apoio:26,custo:0,coerencia:-2,risco:4},
  agenda_regional:{id:'agenda_regional',nome:'Prioridade regional',texto:'Reservar compromissos e propostas específicas para a região.',apoio:15,custo:3,coerencia:0,risco:1},
};

const challenger=(uf,nome,partido,ideologia,perfil,avatar,base,agenda,vulnerabilidade)=>({uf,nome,partido,ideologia,perfil,avatar,base,agenda,vulnerabilidade,popularidade:44,ambicao:66,relacaoPlanalto:48});
export const adversariosGovernadoresSeed = [
  challenger('AC','Bruno Siqueira','Acre Liberal','centro-direita','empresarial','ele-ac-bruno-siqueira','Rio Branco e setor comercial','Segurança de fronteira e estradas','Baixa capilaridade no interior'),
  challenger('AL','Marina Tenório','Alagoas Popular','centro-esquerda','social','ele-al-marina-tenorio','Maceió e servidores públicos','Saúde, saneamento e emprego','Máquina partidária pequena'),
  challenger('AP','Henrique Souza','Amapá Produtivo','centro-direita','desenvolvimentista','ele-ap-henrique-souza','Comércio e setor portuário','Porto, energia e mineração','Rejeição ambiental'),
  challenger('AM','Joana Araripe','Frente Social Amazônica','centro-esquerda','territorial','ele-am-joana-araripe','Periferia de Manaus e interior','Saúde fluvial e proteção social','Dificuldade com indústria da ZFM'),
  challenger('BA','Eduardo Matos','Bahia Competitiva','centro-direita','gestor','ele-ba-eduardo-matos','Empresariado e cidades médias','Segurança, logística e turismo','Rejeição em movimentos sociais'),
  challenger('CE','Marina Holanda','Ceará Social','centro-esquerda','educadora','ele-ce-marina-holanda','Professores e periferia de Fortaleza','Educação, renda e saúde','Pouca experiência executiva'),
  challenger('DF','Caio Bittencourt','Brasília Cidadã','centro-esquerda','administrativo','ele-df-caio-bittencourt','Servidores e universidade','Serviços públicos e mobilidade','Baixo apelo fora do Plano Piloto'),
  challenger('ES','Lúcia Prado','Espírito Santo Verde','centro-esquerda','ambiental','ele-es-lucia-prado','Grande Vitória e juventude','Transição energética e cidades','Atrito com petróleo e portos'),
  challenger('GO','Helena Peixoto','Goiás para Todos','centro-esquerda','municipalista','ele-go-helena-peixoto','Goiânia, servidores e pequenas cidades','Saúde, educação e agricultura familiar','Resistência do agro exportador'),
  challenger('MA','Rafael Brandão','Maranhão Popular','centro-esquerda','social','ele-ma-rafael-brandao','Baixada e movimentos populares','Renda, saneamento e transporte','Estrutura financeira limitada'),
  challenger('MT','Aline Noronha','Mato Grosso Verde','centro-esquerda','ambientalista pragmática','ele-mt-aline-noronha','Cuiabá, universidade e produtores médios','Industrialização mineral e Pantanal','Desconfiança do agro tradicional'),
  challenger('MS','Roberto Sales','MS Liberal','direita','empresarial','ele-ms-roberto-sales','Agronegócio e fronteira','Segurança, logística e impostos','Baixa penetração urbana'),
  challenger('MG','Camila Nogueira','Minas Social','centro-esquerda','municipalista','ele-mg-camila-nogueira','Prefeitos, professores e RMBH','Saúde regional e infraestrutura','Menor arrecadação de campanha'),
  challenger('PA','Fábio Meireles','Pará Produtivo','centro-direita','desenvolvimentista','ele-pa-fabio-meireles','Mineração, sul do estado e empresários','Estradas, mineração e energia','Alta rejeição ambiental'),
  challenger('PB','Renata Lins','Paraíba Popular','centro-esquerda','social','ele-pb-renata-lins','Sindicatos e interior','Água, renda e saúde','Baixa exposição nacional'),
  challenger('PR','João Pacheco','Paraná Solidário','centro-esquerda','trabalhista','ele-pr-joao-pacheco','Região metropolitana e sindicatos','Indústria, emprego e transporte','Rejeição no agro'),
  challenger('PE','Ricardo Albuquerque','Pernambuco Livre','centro-direita','empresarial','ele-pe-ricardo-albuquerque','Empresários, agreste e oposição urbana','Segurança, porto e concessões','Baixa conexão com movimentos sociais'),
  challenger('PI','André Moura','Piauí Produtivo','centro-direita','gestor','ele-pi-andre-moura','Empresários e agro','Energia, rodovias e investimentos','Pouca capilaridade municipal'),
  challenger('RJ','Beatriz Cardoso','Rio Cidadão','centro-esquerda','promotora','ele-rj-beatriz-cardoso','Servidores, Zona Norte e universidade','Segurança com inteligência e serviços','Resistência de corporações policiais'),
  challenger('RN','Gustavo Medeiros','RN Competitivo','centro-direita','empresarial','ele-rn-gustavo-medeiros','Turismo e setor energético','Eólica, turismo e logística','Rejeição entre servidores'),
  challenger('RS','Fernanda Silveira','Rio Grande Social','centro-esquerda','reconstrutora','ele-rs-fernanda-silveira','Porto Alegre, sindicatos e afetados por enchentes','Reconstrução climática e indústria','Baixa conexão com agronegócio'),
  challenger('RO','Marcos Figueira','Rondônia Sustentável','centro-esquerda','territorial','ele-ro-marcos-figueira','Servidores e pequenos produtores','Saúde, regularização e infraestrutura','Rejeição entre grandes produtores'),
  challenger('RR','Ana Macedo','Roraima Desenvolvimento','centro','técnica','ele-rr-ana-macedo','Boa Vista e setor de serviços','Energia, imigração e saúde','Partido fragmentado'),
  challenger('SC','Luís Goulart','Santa Catarina Social','centro-esquerda','industrialista','ele-sc-luis-goulart','Trabalhadores urbanos e litoral','Indústria, habitação e mobilidade','Dificuldade no interior conservador'),
  challenger('SP','Miguel Prado','São Paulo Solidário','centro-esquerda','ex-prefeito','ele-sp-miguel-prado','Capital, sindicatos e universidades','Transporte, moradia e indústria','Alta rejeição no interior'),
  challenger('SE','Juliana Barreto','Sergipe Livre','centro-direita','gestora','ele-se-juliana-barreto','Empresariado e interior','Emprego, gás e segurança','Pouca estrutura na capital'),
  challenger('TO','Carlos Nery','Tocantins Popular','centro-esquerda','municipalista','ele-to-carlos-nery','Prefeitos e agricultura familiar','Saúde regional e estradas','Baixo financiamento'),
];

export const acoesCampanhaSeed = [
  {id:'caravana',nome:'Caravana estadual',icone:'bus',custo:2,energia:1,desc:'Concentrar presença física e imprensa em uma UF.',efeito:{estado:3,conhecimento:4,coerencia:0},grupos:{periferia:0.6,agro:0.3}},
  {id:'sabatina',nome:'Sabatina de imprensa',icone:'mic',custo:1,energia:1,desc:'Enfrentar perguntas difíceis e ampliar conhecimento do eleitorado.',efeito:{nacional:1,conhecimento:7,coerencia:2},grupos:{universitarios:0.6,mercado:0.3}},
  {id:'pulso',nome:'Ofensiva no Pulso',icone:'radio',custo:1,energia:1,desc:'Dominar tendências digitais com mensagem segmentada, sem garantia de converter voto.',efeito:{nacional:0.7,conhecimento:6,coerencia:-1},grupos:{periferia:0.5,universitarios:0.4,evangelicos:0.2}},
  {id:'programa',nome:'Apresentar compromisso',icone:'file',custo:1,energia:1,desc:'Explicar proposta concreta e reforçar coerência programática.',efeito:{nacional:0.8,conhecimento:3,coerencia:4},grupos:{mercado:0.3,universitarios:0.4,sindicalistas:0.3}},
  {id:'contraste',nome:'Contraste político',icone:'target',custo:2,energia:1,desc:'Comparar histórico e propostas com um adversário. Pode mobilizar rejeição dos dois lados.',efeito:{adversario:-2,nacional:0.5,conhecimento:4,coerencia:-1},grupos:{militares:0.2,evangelicos:0.2,universitarios:-0.2}},
  {id:'setorial',nome:'Encontro setorial',icone:'users',custo:1,energia:1,desc:'Falar diretamente com um grupo social, ganhando intensidade e também rejeição em grupos rivais.',efeito:{nacional:0.3,conhecimento:2,coerencia:0},grupos:{}},
  {id:'desinformacao',nome:'Operação de desinformação',icone:'alert',custo:3,energia:1,desc:'Ação ilícita e abstrata de alto risco. Baixa probabilidade de ganho e forte risco jurídico/eleitoral.',efeito:{adversario:-3,nacional:0,conhecimento:2,coerencia:-7},grupos:{}},
];

export const eventosCaptacaoSeed = [
  {id:'crowdfunding',nome:'Crowdfunding cidadão',texto:'Mobilizar pequenas doações de pessoas físicas pelas redes.',libera:'2026-05-15',base:5,dependencia:'pulso',risco:1},
  {id:'doadores',nome:'Encontro com doadores individuais',texto:'Evento transparente de captação com pessoas físicas e apoiadores.',libera:'2026-01-01',base:8,dependencia:'mercado',risco:5},
  {id:'jantar_regional',nome:'Jantar regional de apoiadores',texto:'Captar recursos e estrutura com lideranças locais e doadores individuais.',libera:'2026-01-01',base:6,dependencia:'governadores',risco:3},
  {id:'fundo_eleitoral',nome:'Negociar cota do FEFC',texto:'Disputar internamente uma fatia maior dos recursos partidários para a chapa presidencial.',libera:'2026-06-16',base:20,dependencia:'convencao',risco:0},
];

export const topicosDebateSeed = [
  {id:'economia',titulo:'Economia e custo de vida',opcoes:[
    {id:'resultado',texto:'Defender resultados e reconhecer problemas',coerencia:3,risco:1,ganho:2},
    {id:'ataque',texto:'Responsabilizar adversários e governos anteriores',coerencia:-1,risco:4,ganho:2.5},
    {id:'promessa',texto:'Anunciar nova promessa de grande impacto',coerencia:-4,risco:3,ganho:3},
  ]},
  {id:'seguranca',titulo:'Segurança pública',opcoes:[
    {id:'federalismo',texto:'Propor coordenação com governadores',coerencia:2,risco:1,ganho:2},
    {id:'duro',texto:'Adotar discurso de endurecimento imediato',coerencia:-2,risco:3,ganho:2.8},
    {id:'social',texto:'Conectar prevenção, inteligência e política social',coerencia:1,risco:2,ganho:2.2},
  ]},
  {id:'integridade',titulo:'Integridade e instituições',opcoes:[
    {id:'transparencia',texto:'Abrir dados e defender controles',coerencia:3,risco:1,ganho:2},
    {id:'confronto',texto:'Atacar a pergunta e questionar as instituições',coerencia:-3,risco:5,ganho:2.5},
    {id:'historico',texto:'Usar histórico de entregas e decisões do mandato',coerencia:2,risco:1,ganho:2.2},
  ]},
];
