// Fase 4.2 — chamadas e microdecisões ministeriais.
export const eventosMinisteriais = [
  { id:'sa_compra_vacina', ministerioId:'m_saude', titulo:'Lote extraordinário de vacinas', fala:'Presidente, o fornecedor segura o preço por 24 horas. Eu preciso saber se priorizamos risco ou cobertura ampla.', urgencia:'alta', opcoes:[
    {id:'risco',texto:'Priorize grupos de risco.',tags:['vacina','sus'], impacto:{lealdade:4,popularidade:1,orcamento:-220}},
    {id:'todos',texto:'Compre cobertura universal.',tags:['social','gasto_social'], impacto:{lealdade:2,popularidade:3,orcamento:-760,mercado:-2}},
    {id:'adiar',texto:'Não decida agora.',tags:['austeridade'], impacto:{lealdade:-6,popularidade:-2}},
  ]},
  { id:'ed_greve_call', ministerioId:'m_educacao', titulo:'Greve ganha adesão', fala:'A paralisação passou de 60%. Se não abrirmos mesa hoje, amanhã vira crise nacional.', urgencia:'alta', opcoes:[
    {id:'mesa',texto:'Abra negociação e traga Fazenda.',tags:['professores','negociacao'], requer:['m_fazenda'], impacto:{lealdade:4,clima:3,capitalPolitico:-1}},
    {id:'ceder',texto:'Conceda reajuste emergencial.',tags:['professores','gasto_social'], impacto:{lealdade:6,popularidade:2,orcamento:-480}},
    {id:'forca',texto:'Judicialize e corte ponto.',tags:['forca'], impacto:{lealdade:-7,popularidade:-3,clima:-4}},
  ]},
  { id:'ju_pf', ministerioId:'m_justica', titulo:'PF pede autonomia operacional', fala:'Há uma investigação que pode atingir gente próxima da base. Preciso saber se tenho carta branca para seguir evidências.', urgencia:'media', opcoes:[
    {id:'autonomia',texto:'Siga a lei. Não quero relatórios políticos.',tags:['integridade','institucional'], impacto:{lealdade:6,institucional:3}},
    {id:'informar',texto:'Siga, mas me mantenha informado.',tags:['investigacao','politica'], impacto:{lealdade:1,riscoEscandalo:2}},
    {id:'segurar',texto:'Evite crises desnecessárias agora.',tags:['pressao_pf'], impacto:{lealdade:-10,institucional:-5,riscoEscandalo:8}},
  ]},
  { id:'df_sigilo', ministerioId:'m_defesa', titulo:'Programa classificado', fala:'O Estado-Maior quer autorização para iniciar a fase reservada. O custo é alto e o Congresso ainda não sabe do escopo.', urgencia:'media', opcoes:[
    {id:'auditoria',texto:'Aprove com auditoria reservada.',tags:['defesa','integridade'], impacto:{lealdade:3,orcamento:-320}},
    {id:'sigilo',texto:'Aprove integralmente sob sigilo.',tags:['forcas_armadas','sigilo_excessivo'], impacto:{lealdade:6,orcamento:-420,riscoEscandalo:7}},
    {id:'negar',texto:'Não neste momento.',tags:['corte_defesa'], impacto:{lealdade:-7}},
  ]},
  { id:'fz_corte', ministerioId:'m_fazenda', titulo:'Contingenciamento', fala:'Ou seguramos R$ 900 milhões agora ou a meta fiscal vai virar pauta diária. Qual pasta eu corto?', urgencia:'alta', opcoes:[
    {id:'linear',texto:'Faça corte linear e temporário.',tags:['fiscal'], impacto:{lealdade:3,mercado:4,clima:-3,orcamento:450}},
    {id:'invest',texto:'Preserve investimento e corte custeio.',tags:['fiscal','investimento'], impacto:{lealdade:5,mercado:3,orcamento:300}},
    {id:'nada',texto:'Segure. Quero crescer primeiro.',tags:['investimento','gasto_social'], impacto:{lealdade:-5,mercado:-5}},
  ]},
  { id:'ma_embargo', ministerioId:'m_meioamb', titulo:'Operação contra desmatamento', fala:'Temos imagem de satélite e equipes prontas. A operação vai atingir aliados regionais e pode provocar reação no Congresso.', urgencia:'alta', opcoes:[
    {id:'total',texto:'Execute a operação completa.',tags:['fiscalizacao','amazonia'], impacto:{lealdade:6,popularidade:1,congressoPoder:-3}},
    {id:'foco',texto:'Foque nos cinco maiores alvos.',tags:['fiscalizacao','negociacao'], impacto:{lealdade:3}},
    {id:'adiar',texto:'Espere a votação no Congresso.',tags:['politica'], impacto:{lealdade:-8,riscoEscandalo:3}},
  ]},
  { id:'tr_concessao', ministerioId:'m_transp', titulo:'Leilão sob risco', fala:'Dois grupos desistiram. Podemos flexibilizar o edital ou adiar seis meses.', urgencia:'media', opcoes:[
    {id:'flex',texto:'Flexibilize garantias, preserve metas.',tags:['concessoes','negociacao'], impacto:{lealdade:3,mercado:2}},
    {id:'adiar',texto:'Adie e redesenhe o projeto.',tags:['planejamento'], impacto:{lealdade:2,popularidade:-1}},
    {id:'forcar',texto:'Mantenha o edital. O mercado decide.',tags:['mercado'], impacto:{lealdade:-2,mercado:-1}},
  ]},
  { id:'cc_rebeliao', ministerioId:'m_casacivil', titulo:'Rebelião na base', fala:'Três líderes querem votar contra o governo amanhã. Posso negociar texto, liberar agenda regional ou deixar sangrar.', urgencia:'alta', opcoes:[
    {id:'texto',texto:'Negocie o texto da proposta.',tags:['negociacao','congresso'], impacto:{lealdade:4,congressoPoder:-2,capitalPolitico:-1}},
    {id:'agenda',texto:'Monte uma agenda federativa pública.',tags:['federalismo','coalizao'], impacto:{lealdade:5,congressoPoder:4,orcamento:-180}},
    {id:'confrontar',texto:'Vá a público e confronte os líderes.',tags:['confronto'], impacto:{lealdade:-4,clima:-3,riscoEscandalo:3}},
  ]},

  { id:'ag_exportacao_call', ministerioId:'m_agro', titulo:'Mercado externo ameaça fechar', fala:'Presidente, o parceiro comercial quer garantias sanitárias hoje. Se errarmos a mão, perdemos mercado por meses.', urgencia:'alta', opcoes:[
    {id:'regional',texto:'Negocie regionalização e abra dados sanitários.',tags:['exportacao','sanidade'], impacto:{lealdade:4,mercado:2}},
    {id:'retaliar',texto:'Ameace retaliação comercial.',tags:['confronto'], impacto:{lealdade:-2,mercado:-2}},
    {id:'ceder',texto:'Aceite embargo nacional temporário.',tags:['cautela'], impacto:{lealdade:-3,mercado:-3}},
  ]},
  { id:'so_fome_call', ministerioId:'m_social', titulo:'Fila alimentar cresce', fala:'Temos cidades com insegurança severa subindo rápido. Posso ampliar restaurantes populares, mas preciso de orçamento agora.', urgencia:'alta', opcoes:[
    {id:'ampliar',texto:'Amplie onde a cobertura é menor.',tags:['fome','social'], impacto:{lealdade:5,popularidade:2,orcamento:-240}},
    {id:'dados',texto:'Faça expansão focalizada com dados municipais.',tags:['dados','social'], impacto:{lealdade:4,popularidade:1,orcamento:-140}},
    {id:'adiar',texto:'Espere a próxima revisão fiscal.',tags:['austeridade'], impacto:{lealdade:-7,popularidade:-2}},
  ]},
  { id:'ct_ia_call', ministerioId:'m_ciencia', titulo:'Projeto nacional de IA', fala:'Uma equipe brasileira pode ficar no país, mas quer infraestrutura e contrato público em poucas semanas.', urgencia:'media', opcoes:[
    {id:'piloto',texto:'Financie piloto com metas e auditoria.',tags:['ia','integridade'], impacto:{lealdade:4,orcamento:-180,mercado:1}},
    {id:'cheque',texto:'Dê financiamento amplo e rápido.',tags:['startups'], impacto:{lealdade:3,orcamento:-360,riscoEscandalo:3}},
    {id:'deixar',texto:'Deixe o mercado resolver.',tags:['mercado'], impacto:{lealdade:-4}},
  ]},
  { id:'es_federacao_call', ministerioId:'m_esportes', titulo:'Federação sob suspeita', fala:'Há denúncia de favorecimento em repasses. Se eu suspender verba agora, compro uma guerra com cartolas e alguns deputados.', urgencia:'media', opcoes:[
    {id:'auditar',texto:'Suspenda o lote e audite contratos.',tags:['integridade'], impacto:{lealdade:5,riscoEscandalo:-2,congressoPoder:-1}},
    {id:'acompanhar',texto:'Mantenha verba sob fiscalização especial.',tags:['negociacao','integridade'], impacto:{lealdade:2}},
    {id:'ignorar',texto:'Não abra essa frente agora.',tags:['cartolas'], impacto:{lealdade:-6,riscoEscandalo:5}},
  ]},

  { id:'cu_premio_call', ministerioId:'m_cultura', titulo:'Filme brasileiro ganha tração internacional', fala:'Presidente, o longa entrou no radar da imprensa e dos distribuidores. Se quisermos disputar a temporada de prêmios, precisamos decidir agora o tamanho da campanha.', urgencia:'media', opcoes:[
    {id:'cirurgica',texto:'Campanha focada em festivais, crítica e votantes.',tags:['cinema','integridade'], impacto:{lealdade:4,orcamento:-90,popularidade:1}},
    {id:'massiva',texto:'Faça uma grande campanha internacional de imagem.',tags:['eventos','marketing'], impacto:{lealdade:2,orcamento:-210,popularidade:2,riscoEscandalo:2}},
    {id:'nao',texto:'Não use dinheiro público na campanha.',tags:['mercado'], impacto:{lealdade:-5}},
  ]},

  { id:'re_crise_call', ministerioId:'m_exteriores', titulo:'Linha vermelha diplomática', fala:'Presidente, duas capitais querem uma posição pública nossa antes da reunião de amanhã. Posso ganhar espaço para o Brasil ou fechar uma porta importante.', urgencia:'alta', opcoes:[
    {id:'mediar',texto:'Ofereça mediação e evite alinhamento automático.',tags:['mediacao','autonomia','onu'], impacto:{lealdade:4,imagemExterna:3,capitalPolitico:-1}},
    {id:'alinhar',texto:'Apoie o parceiro com quem temos mais interesses concretos.',tags:['comercio','realismo'], impacto:{lealdade:1,imagemExterna:-1,mercado:2}},
    {id:'silencio',texto:'Não antecipe posição presidencial.',tags:['cautela'], impacto:{lealdade:-3,imagemExterna:-1}},
  ]},
];
