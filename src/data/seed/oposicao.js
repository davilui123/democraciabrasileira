export const oposicaoSeed = {
  coalizao:'Frente de Renovação Nacional',
  sigla:'FRN',
  lider:{id:'caio_valente',nome:'Caio Valente',cargo:'Candidato derrotado à Presidência',partido:'Liberais Unidos',uf:'MG',avatar:'op-caio-valente',ideologia:'centro-direita',ambicao:94,popularidade:57,agressividade:68,descricao:'Ex-governador e senador. Perdeu a eleição por margem estreita e decidiu permanecer em campanha permanente, tentando transformar cada crise do governo em plebiscito sobre a eleição passada.'},
  nucleo:[
    {id:'renata_morais',nome:'Renata Morais',cargo:'Líder da oposição na Câmara',partido:'LIB',uf:'PR',avatar:'op-renata',especialidade:'obstrução e CPI',influencia:84,descricao:'Deputada de seis mandatos, domina o regimento e prefere derrotar o governo em votações simbólicas.'},
    {id:'vicente_nobre',nome:'Vicente Nobre',cargo:'Senador e estrategista jurídico',partido:'LIB',uf:'GO',avatar:'op-vicente',especialidade:'STF e sabatinas',influencia:78,descricao:'Ex-procurador, transforma disputas políticas em contencioso constitucional e atua fortemente no Senado.'},
    {id:'mila_torres',nome:'Mila Torres',cargo:'Porta-voz digital',partido:'FRN',uf:'RJ',avatar:'op-mila',especialidade:'Pulso e mídia',influencia:72,descricao:'Comunicadora de linguagem agressiva; testa slogans no Pulso antes de a oposição adotá-los oficialmente.'},
    {id:'isabela_ferraz',nome:'Isabela Ferraz',cargo:'Governadora de São Paulo',partido:'São Paulo em Movimento',uf:'SP',avatar:'gov-SP-Isabela-Ferraz',especialidade:'federação e ambição nacional',influencia:93,descricao:'Governadora de maior projeção nacional. Nem sempre age com a oposição formal, mas disputa o centro do tabuleiro e pode liderar governadores contra o Planalto.'},
  ],
  estrategias:[
    {id:'obstrucao',nome:'Obstrução parlamentar',texto:'Travar pauta e elevar o custo de cada votação.',alvo:'congresso'},
    {id:'judicializar',nome:'Judicialização',texto:'Levar atos controversos ao STF e à PGR.',alvo:'instituicoes'},
    {id:'ruas',nome:'Pressão social',texto:'Convocar manifestações e ativar bases estaduais.',alvo:'popularidade'},
    {id:'pulso',nome:'Ofensiva no Pulso',texto:'Dominar a narrativa digital e forçar respostas presidenciais.',alvo:'rede'},
    {id:'governadores',nome:'Frente de governadores',texto:'Transformar disputa federativa em bloco político nacional.',alvo:'federacao'},
    {id:'cpi',nome:'CPI e fiscalização',texto:'Explorar escândalos, estatais e contratos para abrir investigação.',alvo:'controle'},
  ],
};
