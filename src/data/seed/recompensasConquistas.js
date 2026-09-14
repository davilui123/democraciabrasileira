// Recompensas estruturais liberadas por conquistas da Fase 4.6.
// EBTN é fictícia e complementar à estrutura nuclear existente no jogo.

export const estatalNuclearAvancada = {
  id:'ebtn',nome:'Empresa Brasileira de Tecnologia Nuclear',sigla:'EBTN',setor:'Tecnologia nuclear',eixo:'soberania',valorMercado:18000,lucroAnual:-600,eficiencia:61,missaoPublica:98,governanca:76,exposicaoPolitica:84,empregos:31,capacidadeInvestimento:88,
  descricao:'Subsidiária estratégica fictícia para engenharia nuclear avançada, combustível de nova geração, radioisótopos e tecnologias duais sob controle civil.',
  tensao:'Autonomia tecnológica × custo fiscal × salvaguardas internacionais × risco de proliferação.',tags:['nuclear','tecnologia','soberania'],origemConquista:'dominio_nuclear',
  diretrizes:[
    {id:'ebtn_combustivel',nome:'Combustível avançado e enriquecimento',texto:'Priorizar domínio industrial do combustível e componentes críticos.',impactoFiscal:-950,missao:4,governanca:1,grupos:{militares:3,universitarios:2,mercado:1},crescimento:.04,riscoInstitucional:1},
    {id:'ebtn_medicina',nome:'Radioisótopos e medicina nuclear',texto:'Direcionar capacidade tecnológica para saúde, diagnóstico e tratamento.',impactoFiscal:-620,missao:4,eficiencia:1,grupos:{periferia:2,universitarios:3,mercado:1},crescimento:.02},
    {id:'ebtn_exportacao',nome:'Engenharia e serviços internacionais',texto:'Exportar serviços especializados sob salvaguardas e acordos internacionais.',impactoFiscal:480,eficiencia:2,missao:1,grupos:{mercado:3,militares:1,universitarios:1},crescimento:.02},
  ]
};

export const ceitecExpandida = {
  id:'ceitec',nome:'CEITEC',sigla:'CEITEC',setor:'Semicondutores',eixo:'dados',valorMercado:6200,lucroAnual:-420,eficiencia:58,missaoPublica:97,governanca:79,exposicaoPolitica:72,empregos:24,capacidadeInvestimento:86,
  descricao:'Empresa pública de microeletrônica reposicionada no jogo para chips de potência, identificação, aplicações estratégicas e formação de pessoal.',
  tensao:'Escala industrial × dependência tecnológica × custo público × soberania em chips.',tags:['semicondutores','tecnologia','industria'],origemConquista:'soberania_chips',
  diretrizes:[
    {id:'ceitec_sic',nome:'Chips de potência e SiC',texto:'Priorizar semicondutores para veículos elétricos, energia e indústria de potência.',impactoFiscal:-780,eficiencia:3,missao:3,grupos:{universitarios:3,mercado:2,sindicalistas:1},crescimento:.06},
    {id:'ceitec_estado',nome:'Chips para infraestrutura pública',texto:'Identidade, rastreabilidade, defesa, saúde e equipamentos públicos.',impactoFiscal:-520,missao:4,grupos:{militares:2,universitarios:2,periferia:1},crescimento:.03},
    {id:'ceitec_foundry',nome:'Foundry aberta à indústria',texto:'Usar a capacidade pública para prototipagem e lotes de empresas nacionais.',impactoFiscal:-640,eficiencia:2,missao:2,grupos:{mercado:3,universitarios:2,sindicalistas:1},crescimento:.05},
  ]
};

export const leiCriacaoEBTN = {
  id:'criacao_ebtn',
  titulo:'Criação da Empresa Brasileira de Tecnologia Nuclear',
  categoria:'institucional',instrumento:'PL',descricao:'Autoriza a União a estruturar empresa pública voltada a engenharia nuclear avançada, radioisótopos, combustível e tecnologias estratégicas sob salvaguardas e governança reforçada.',
  comissoes:['ccti','cme','cft','ccjc'],apreciacao:'plenario',admiteUrgencia:true,custoPolitico:54,complexidade:82,polarizacao:69,tempoTramitacao:8,
  afinidade:{esq:58,centro:62,ind:55,dir:48},tags:['soberania','tecnologia','defesa','investimento'],efeitos:{capitalPolitico:1,imagemExterna:1},origem:'conquista',risco:'alto'
};
