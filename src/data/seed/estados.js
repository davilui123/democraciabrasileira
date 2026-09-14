import { dossiesGovernadores } from './dossiesPersonagens.js';

const grupos = {
  norte: { evangelicos: 22, sindicalistas: 8, agro: 16, periferia: 24, mercado: 8, militares: 8, universitarios: 14 },
  nordeste: { evangelicos: 20, sindicalistas: 12, agro: 11, periferia: 31, mercado: 7, militares: 6, universitarios: 13 },
  centroOeste: { evangelicos: 21, sindicalistas: 7, agro: 30, periferia: 16, mercado: 10, militares: 8, universitarios: 8 },
  sudeste: { evangelicos: 18, sindicalistas: 11, agro: 8, periferia: 25, mercado: 17, militares: 7, universitarios: 14 },
  sul: { evangelicos: 18, sindicalistas: 10, agro: 20, periferia: 16, mercado: 16, militares: 8, universitarios: 12 },
};

const gov = (nome, partido, ideologia, estilo, popularidade, relacao, ambicao, biografia) => ({ nome, partido, ideologia, estilo, popularidade, relacao, ambicao, biografia });

const estadosBase = [
  ['AC','Acre','Rio Branco','Norte',grupos.norte,gov('Helena Monteiro','Frente Cidadã','centro','negociadora',58,52,46,'Ex-prefeita de Rio Branco; construiu carreira em infraestrutura regional e saúde de fronteira.'),'Logística amazônica e saúde de fronteira'],
  ['AL','Alagoas','Maceió','Nordeste',grupos.nordeste,gov('Rafael Calheiros Lins','União Alagoana','centro','pragmático',55,48,62,'Advogado e ex-deputado estadual com forte rede municipalista e presença no setor sucroenergético.'),'Saneamento, turismo e segurança'],
  ['AP','Amapá','Macapá','Norte',grupos.norte,gov('Mirela Paes','Movimento Verde Social','centro-esquerda','técnica',61,64,38,'Engenheira ambiental que se projetou na gestão portuária e em políticas de bioeconomia.'),'Energia, porto e bioeconomia'],
  ['AM','Amazonas','Manaus','Norte',grupos.norte,gov('Caio Nascimento Braga','Aliança Amazônica','centro','empresarial',63,45,70,'Empresário industrial e ex-secretário de desenvolvimento; defensor da Zona Franca e de infraestrutura fluvial.'),'Indústria, conectividade e segurança fluvial'],
  ['BA','Bahia','Salvador','Nordeste',grupos.nordeste,gov('Lúcia Santana Reis','Partido Popular Baiano','centro-esquerda','carismática',66,68,57,'Ex-senadora e médica; forte presença no interior e entre movimentos de saúde pública.'),'Saúde, emprego e mobilidade'],
  ['CE','Ceará','Fortaleza','Nordeste',grupos.nordeste,gov('Ícaro Bezerra','Ceará em Frente','centro','gestor',64,60,51,'Economista com carreira em educação integral, tecnologia e atração de investimentos.'),'Educação, tecnologia e segurança'],
  ['DF','Distrito Federal','Brasília','Centro-Oeste',{ evangelicos:18,sindicalistas:14,agro:4,periferia:20,mercado:16,militares:14,universitarios:14 },gov('Tereza Albuquerque','Capital Livre','centro-direita','institucional',52,44,58,'Procuradora aposentada com base entre servidores públicos e setores de segurança.'),'Mobilidade, segurança e serviços públicos'],
  ['ES','Espírito Santo','Vitória','Sudeste',grupos.sudeste,gov('Otávio Valadares','Pacto Capixaba','centro-direita','gestor',62,55,48,'Administrador ligado à cadeia de petróleo, portos e comércio exterior.'),'Portos, indústria e defesa civil'],
  ['GO','Goiás','Goiânia','Centro-Oeste',grupos.centroOeste,gov('Mauro Siqueira','Goiás Forte','direita','popular',65,40,69,'Produtor rural e ex-prefeito; possui forte conexão com cooperativas e igrejas evangélicas.'),'Agro, rodovias e segurança'],
  ['MA','Maranhão','São Luís','Nordeste',grupos.nordeste,gov('Débora Sarney Nogueira','Renova Maranhão','centro','articuladora',57,50,73,'Advogada e ex-deputada federal; combina elite política tradicional com discurso de modernização logística.'),'Porto, pobreza e energia'],
  ['MT','Mato Grosso','Cuiabá','Centro-Oeste',grupos.centroOeste,gov('Leandro Pires','Mato Grosso Produtivo','direita','empresarial',67,38,64,'Empresário do agronegócio; defende infraestrutura pesada e licenciamento acelerado.'),'Agro, ferrovia e meio ambiente'],
  ['MS','Mato Grosso do Sul','Campo Grande','Centro-Oeste',grupos.centroOeste,gov('Patrícia Azevedo','Coalizão Pantanal','centro-direita','conciliadora',59,54,45,'Veterinária e ex-secretária de agricultura, com trânsito entre produtores e ambientalistas.'),'Pantanal, agro e fronteira'],
  ['MG','Minas Gerais','Belo Horizonte','Sudeste',grupos.sudeste,gov('Augusto Vilela','Minas Primeiro','centro-direita','presidenciável',68,35,88,'Ex-senador e governador de perfil nacional; forte rede empresarial e ambição presidencial explícita.'),'Mineração, rodovias e saúde'],
  ['PA','Pará','Belém','Norte',grupos.norte,gov('Joana Batista Pará','Frente Amazônica','centro-esquerda','territorial',60,62,44,'Assistente social e ex-prefeita; construiu base na região metropolitana e em municípios ribeirinhos.'),'Bioeconomia, portos e saneamento'],
  ['PB','Paraíba','João Pessoa','Nordeste',grupos.nordeste,gov('Henrique Lucena','Paraíba Inovadora','centro','acadêmico',63,66,41,'Professor de engenharia e ex-reitor; símbolo de uma agenda de tecnologia e educação superior.'),'Educação, água e tecnologia'],
  ['PR','Paraná','Curitiba','Sul',grupos.sul,gov('Marina Rios Kuster','Paraná Competitivo','centro-direita','gestora',64,46,61,'Executiva e ex-secretária de planejamento, próxima de cooperativas e indústria automotiva.'),'Logística, agroindústria e inovação'],
  ['PE','Pernambuco','Recife','Nordeste',grupos.nordeste,gov('André Vasconcelos','Pernambuco Popular','centro-esquerda','articulador',67,72,65,'Ex-prefeito do Recife e deputado federal; forte base urbana e relação histórica com sindicatos e setor criativo.'),'Emprego, cultura e mobilidade'],
  ['PI','Piauí','Teresina','Nordeste',grupos.nordeste,gov('Sofia Castelo Branco','Piauí do Futuro','centro','técnica',58,63,39,'Engenheira sanitarista; ganhou projeção com políticas de água, energia solar e ensino técnico.'),'Água, energia e educação'],
  ['RJ','Rio de Janeiro','Rio de Janeiro','Sudeste',grupos.sudeste,gov('Marcelo Fontes','Rio Seguro','centro-direita','midiático',54,36,78,'Ex-apresentador e deputado; domina comunicação, mas enfrenta base fragmentada e segurança pública crítica.'),'Segurança, petróleo e mobilidade'],
  ['RN','Rio Grande do Norte','Natal','Nordeste',grupos.nordeste,gov('Cecília Dantas','RN Sustentável','centro-esquerda','técnica',62,67,42,'Oceanógrafa e ex-secretária de energia; associada à expansão eólica e turismo sustentável.'),'Energia eólica, turismo e saúde'],
  ['RS','Rio Grande do Sul','Porto Alegre','Sul',grupos.sul,gov('Eduardo Fagundes','Pacto Gaúcho','centro','federalista',60,43,66,'Ex-deputado e advogado; defensor de autonomia federativa, indústria e reconstrução climática.'),'Indústria, clima e dívida estadual'],
  ['RO','Rondônia','Porto Velho','Norte',grupos.norte,gov('Silas Mendonça','Rondônia Forte','direita','ruralista',63,39,55,'Empresário da pecuária e ex-prefeito; forte base no interior e discurso duro em segurança.'),'Agro, energia e estradas'],
  ['RR','Roraima','Boa Vista','Norte',grupos.norte,gov('Nádia Macuxi Farias','Roraima Unido','centro','fronteiriça',56,58,40,'Defensora pública com carreira ligada a migração, fronteira e comunidades indígenas.'),'Fronteira, energia e migração'],
  ['SC','Santa Catarina','Florianópolis','Sul',grupos.sul,gov('Bruno Konder','Santa Catarina Livre','direita','empresarial',66,34,67,'Empresário de tecnologia e ex-prefeito; agenda liberal e forte inserção no setor industrial.'),'Indústria, portos e tecnologia'],
  ['SP','São Paulo','São Paulo','Sudeste',grupos.sudeste,gov('Isabela Ferraz','São Paulo em Movimento','centro-direita','presidenciável',69,41,91,'Ex-secretária de desenvolvimento e senadora; possui a maior máquina política estadual e planos nacionais.'),'Infraestrutura, saúde e produtividade'],
  ['SE','Sergipe','Aracaju','Nordeste',grupos.nordeste,gov('Vinícius Barreto','Sergipe Mais','centro','municipalista',59,61,47,'Ex-prefeito do interior e médico; construiu coalizão baseada em consórcios municipais.'),'Saúde, gás e saneamento'],
  ['TO','Tocantins','Palmas','Norte',{ evangelicos:21,sindicalistas:7,agro:27,periferia:18,mercado:8,militares:7,universitarios:12 },gov('Camila Araguaia','Tocantins Desenvolvimento','centro-direita','desenvolvimentista',61,50,52,'Engenheira civil e ex-secretária de infraestrutura; foco em integração logística e irrigação.'),'Logística, agro e água'],
].map(([uf,nome,capital,regiao,composicao,governador,prioridade],index)=>({
  id:uf.toLowerCase(), uf,nome,capital,regiao,composicao,governador,prioridade,
  aprovacao: 45 + ((index*7)%16), relacaoPlanalto: governador.relacao, investimentos:[],
  capitalImage:`/states/${uf}/capital.jpg`, flagImage:`/states/${uf}/bandeira.png`,
  eleitoradoPeso: [2,1,1,3,7,4,1,2,4,2,3,2,10,4,2,6,5,1,8,2,6,2,1,4,22,1,1][index],
}));


export const estadosSeed = estadosBase.map(estado => ({
  ...estado,
  governador: { ...estado.governador, ...(dossiesGovernadores[estado.uf] || {}), avatar: `gov-${estado.uf.toLowerCase()}-${estado.governador.nome}` },
}));
