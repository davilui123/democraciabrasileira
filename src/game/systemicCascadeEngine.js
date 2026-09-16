const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,Number(v)||0));

const pressure=(state,id)=>[
  ...(state.geopolitica?.historicoPressoes||[]),
  ...(state.geopolitica?.pressoesDiplomaticas||[]),
].find(p=>p.baseId===id && ['respondida','ignorada'].includes(p.status));

const historyIds=(state)=>new Set((state.historicoCascatas||[]).map(x=>x.baseId||x.id));
const pendingIds=(state)=>new Set((state.consequenciasPendentes||[]).map(x=>x.baseId||x.id));
const already=(state,id)=>historyIds(state).has(id)||pendingIds(state).has(id);

const strategic=(state,id)=>state.comercioExterior?.itensEstrategicos?.[id]||null;
const tradePreference=(state,id)=>Number(state.comercioExterior?.concorrenciaGeopolitica?.preferencias?.[id]||state.comercioExterior?.parceiros?.[id]?.preferencia||0);
const tradeTension=(state,id)=>Math.max(0,...(state.comercioExterior?.concorrenciaGeopolitica?.tensoes||[]).filter(t=>t.paisId===id&&t.status!=='encerrada').map(t=>Number(t.intensidade||0)));

const consequence=(id,turno,titulo,descricao,efeitos,delay=1,origem='cascata')=>({
  id:`cascade_${id}_${turno}`,
  baseId:id,
  origem,
  titulo,
  descricao,
  criadoNoTurno:turno,
  turnoAlvo:turno+delay,
  status:'pendente',
  efeitos,
});

export function gerarCascataSistemica(state={}){
  const turno=Number(state.turno||1);
  const historico=state.historicoCascatas||[];
  const ultima=historico[0];
  if(ultima && turno-(ultima.criadoNoTurno||0)<1) return null;

  const us=pressure(state,'us_tarifaco');
  if(us && ['retaliar','silencio'].includes(us.respostaId) && !already(state,'tarifaco_agro_exportacao')){
    return consequence('tarifaco_agro_exportacao',turno,'Tarifaço chega ao campo e à indústria exportadora','A escalada comercial reduz pedidos externos, aperta margens do agro e da indústria e transforma uma disputa diplomática em pressão sobre governadores exportadores.',{
      capitalPolitico:-2,
      economia:{confiancaMercado:-2,riscoPais:5,crescimentoPib:-.04},
      comercio:{exportacoes:{agro:-.08,industria:-.06,aeroespacial:-.04},parceiros:{us:-12},preferencias:{us:-4},tensoes:{us:12},itens:{aco:{valorPct:-.12,potencial:-6},carne_bovina:{valorPct:-.05,potencial:-3},cafe:{valorPct:-.035}}},
      grupos:{agro:-2,mercado:-1.4,sindicalistas:-.5},
      estados:{ufs:['MT','GO','PR','MS','SP'],aprovacao:-1.5,relacao:-2},
      oposicao:1.5,
    },1);
  }

  const cn=pressure(state,'cn_terras_raras');
  if(cn?.respostaId==='preferencia' && !already(state,'minerais_dependencia_tcu')){
    return consequence('minerais_dependencia_tcu',turno,'Acordo mineral acende alerta de dependência estratégica','O pacote de minerais críticos acelera investimentos, mas TCU, indústria e parceiros estrangeiros questionam concentração, governança e cláusulas de preferência.',{
      capitalPolitico:-1,
      institucional:{riscoJuridico:4,tensaoInstitucional:2},
      economia:{confiancaMercado:-.5},
      grupos:{mercado:-.6,universitarios:-.7},
      relacoes:{us:-2,jp:-2,kr:-2},
      comercio:{preferencias:{cn:4},tensoes:{us:8,jp:4},itens:{terras_raras:{potencial:8,capacidadeDomestica:3},litio:{potencial:5},niobio:{potencial:4}}},
    },2);
  }

  const ru=pressure(state,'ru_apoio_guerra');
  if(ru && ru.respostaId==='rejeitar' && !already(state,'fertilizantes_russia')){
    return consequence('fertilizantes_russia',turno,'Atrito com Moscou encarece fertilizantes','Fornecedores reduzem condições comerciais e o choque chega ao custo da safra, pressionando alimentos e governadores do Centro-Oeste.',{
      capitalPolitico:-1,
      economia:{inflacao:.14,confiancaMercado:-1},
      comercio:{importacoes:{fertilizantes:.11},tensoes:{ru:6},itens:{fertilizantes:{valorPct:.14,dependencia:5,potencial:-3}}},
      grupos:{agro:-1.8,periferia:-.5},
      estados:{ufs:['MT','GO','MS','PR'],aprovacao:-1,relacao:-1.5},
    },1);
  }

  const de=pressure(state,'de_amazonia');
  if(de?.respostaId==='rejeitar' && !already(state,'capital_verde_europa')){
    return consequence('capital_verde_europa',turno,'Capital verde europeu recua','A rejeição ao mecanismo de rastreabilidade afeta financiamentos e contratos, ligando política ambiental a investimento, exportação e reputação externa.',{
      economia:{confiancaMercado:-2,crescimentoPib:-.025},
      comercio:{exportacoes:{agro:-.025,mineracao:-.035},tensoes:{de:5},itens:{soja:{valorPct:-.035,potencial:-4},carne_bovina:{valorPct:-.03,potencial:-4},minerio_ferro:{valorPct:-.025,potencial:-2}}},
      grupos:{mercado:-1,universitarios:-1.2,agro:.4},
      mundo:{softPowerBrasil:-2,liderancaAmbiental:-2},
    },2);
  }

  const prefCn=tradePreference(state,'cn');
  const prefUs=tradePreference(state,'us');
  const tensaoUs=tradeTension(state,'us');
  const tensaoCn=tradeTension(state,'cn');
  if(prefCn-prefUs>=8 && tensaoUs>=28 && !already(state,'corrida_eletricos_cn_us')){
    return consequence('corrida_eletricos_cn_us',turno,'Preferência por mobilidade chinesa vira disputa industrial','A aproximação com fornecedores chineses de veículos elétricos e baterias começa a reorganizar investimentos no Brasil. Empresas americanas cobram isonomia e Washington sinaliza que tecnologia e compras públicas entrarão na conta bilateral.',{
      capitalPolitico:-1,
      economia:{confiancaMercado:.4,crescimentoPib:.015},
      comercio:{preferencias:{cn:2,us:-2},tensoes:{us:10},itens:{veiculos_eletricos:{valorPct:.1,dependencia:5,potencial:5},baterias:{valorPct:.06,dependencia:4,potencial:4}}},
      relacoes:{us:-2,cn:1},grupos:{mercado:.3,sindicalistas:-.6},
      estados:{ufs:['SP','MG','PR','BA'],aprovacao:-.3,relacao:-.4},
    },1);
  }
  if(prefUs-prefCn>=8 && tensaoCn>=28 && !already(state,'corrida_eletricos_us_cn')){
    return consequence('corrida_eletricos_us_cn',turno,'Aliança tecnológica com os EUA irrita fornecedores asiáticos','A preferência por padrões e capital americanos melhora acesso a tecnologia, mas fabricantes chineses reduzem ofertas agressivas e reavaliam investimentos na cadeia de baterias.',{
      economia:{confiancaMercado:.5},capitalPolitico:-1,
      comercio:{preferencias:{us:2,cn:-2},tensoes:{cn:10},itens:{baterias:{valorPct:.05,dependencia:3,potencial:-2},veiculos_eletricos:{valorPct:.04,potencial:-2}}},
      relacoes:{cn:-2,us:1},grupos:{mercado:.2},
    },1);
  }

  const fertilizante=strategic(state,'fertilizantes');
  if((fertilizante?.dependencia||0)>=92 && (fertilizante?.valor||0)>=1350 && !already(state,'fertilizante_abastecimento')){
    return consequence('fertilizante_abastecimento',turno,'Dependência de fertilizantes vira risco de abastecimento','A combinação de dependência externa elevada e custo crescente de fertilizantes deixa de ser apenas um problema comercial. Produtores revêm margens, alimentos começam a incorporar o choque e governadores agrícolas cobram uma estratégia nacional de insumos.',{
      capitalPolitico:-1,economia:{inflacao:.12,crescimentoPib:-.015},
      comercio:{itens:{fertilizantes:{dependencia:2,potencial:-2},soja:{valorPct:-.025,potencial:-2},carne_bovina:{valorPct:-.015}}},
      grupos:{agro:-1.4,periferia:-.6},estados:{ufs:['MT','GO','MS','PR','RS'],aprovacao:-.8,relacao:-1},oposicao:1,
    },1);
  }

  const ifa=strategic(state,'ifa_farmaceutico');
  if((ifa?.dependencia||0)>=88 && (ifa?.valor||0)>=980 && !already(state,'ifa_sus_industria')){
    return consequence('ifa_sus_industria',turno,'Dependência farmacêutica pressiona SUS e indústria','Custos e dependência de IFAs importados começam a atingir compras públicas e laboratórios nacionais. Saúde pede estoques, Fazenda avalia crédito e parceiros estrangeiros ganham poder de barganha.',{
      capitalPolitico:-1,economia:{inflacao:.05,confiancaMercado:-.5},
      comercio:{itens:{ifa_farmaceutico:{valorPct:.06,dependencia:2,potencial:-2}}},
      grupos:{periferia:-.7,universitarios:-.4,mercado:-.3},oposicao:.5,
    },1);
  }

  const minerais=strategic(state,'terras_raras');
  if(Math.abs(prefCn-prefUs)>=14 && (minerais?.potencial||0)>=88 && !already(state,'minerais_blocos_rivais')){
    const favorecido=prefCn>prefUs?'China':'Estados Unidos';
    const rival=prefCn>prefUs?'us':'cn';
    return consequence('minerais_blocos_rivais',turno,'Minerais críticos entram na disputa entre potências',`A concentração de preferência comercial em ${favorecido} transforma terras raras, lítio e nióbio em ativo diplomático. O parceiro rival passa a cobrar garantias de acesso e órgãos de controle questionam exclusividade e governança.`,{
      capitalPolitico:-1,institucional:{riscoJuridico:3,tensaoInstitucional:1},
      comercio:{tensoes:{[rival]:10},itens:{terras_raras:{potencial:3},litio:{potencial:2},niobio:{potencial:2}}},
      grupos:{mercado:-.3,universitarios:-.4},
    },2);
  }

  const tensao=Number(state.mundo?.tensaoGlobal??30);
  const inflacao=Number(state.economia?.inflacao??4.5);
  if(tensao>=72 && !already(state,'diesel_global') && !(historico||[]).some(x=>x.baseId==='diesel_global'&&turno-(x.criadoNoTurno||0)<8)){
    return consequence('diesel_global',turno,'Choque internacional de diesel atravessa a economia','Ataques e restrições sobre infraestrutura energética apertam a oferta mundial de derivados. Frete, agro e indústria sentem o custo antes do consumidor final.',{
      economia:{inflacao:.18,confiancaMercado:-1.2,riscoPais:3,crescimentoPib:-.025},
      comercio:{importacoes:{combustiveis:.12},itens:{diesel:{valorPct:.15,dependencia:4,potencial:-2}}},
      grupos:{agro:-1,mercado:-.8,periferia:-.7},
      estados:{ufs:['SP','MG','PR','RS','MT'],aprovacao:-.6,relacao:-.5},
    },1);
  }

  const primario=Number(state.economia?.resultadoPrimario??0);
  const ativos=(state.programas||[]).filter(p=>['ativo','implantacao','atrasado'].includes(p.status));
  if(primario<=-18000 && ativos.length>=3 && !already(state,'fiscal_controle_externo')){
    return consequence('fiscal_controle_externo',turno,'Expansão fiscal chama controle externo e Congresso','Déficit elevado combinado a uma carteira ampla de programas leva TCU e parlamentares a pedir cronogramas, metas e demonstração de sustentabilidade.',{
      capitalPolitico:-2,
      institucional:{riscoJuridico:4,tensaoInstitucional:1.5},
      congresso:-2,
      oposicao:2,
      economia:{confiancaMercado:-1.5,riscoPais:4},
    },1);
  }

  if(inflacao>=8 && !already(state,'inflacao_governadores') && !(historico||[]).some(x=>x.baseId==='inflacao_governadores'&&turno-(x.criadoNoTurno||0)<6)){
    return consequence('inflacao_governadores',turno,'Inflação vira crise local nos estados','Alta de alimentos, transporte e energia chega às capitais. Governadores cobram desoneração, estoques e medidas de abastecimento, transferindo o choque macroeconômico para o pacto federativo.',{
      capitalPolitico:-2,
      grupos:{periferia:-1.7,agro:-.6,mercado:-.7},
      estados:{ufs:['SP','RJ','MG','BA','PE','CE','RS','PR'],aprovacao:-1.2,relacao:-1.5},
      oposicao:1.5,
    },1);
  }

  const cp=Number(state.capitalPolitico??50);
  if(cp<15 && Number(state.congresso?.poder??50)<40 && !already(state,'paralisia_governabilidade')){
    return consequence('paralisia_governabilidade',turno,'Baixo capital político paralisa a pauta','O Planalto tenta manter muitas frentes abertas sem votos e sem margem de negociação. Lideranças passam a cobrar mais por cada acordo e projetos perdem velocidade.',{
      capitalPolitico:-1,
      congresso:-4,
      oposicao:2,
      climaGoverno:-2,
    },1);
  }

  const criticos=['m_casacivil','m_fazenda','m_justica','m_exteriores'];
  const vagas=criticos.filter(id=>!(state.nomeacoes||[]).some(n=>n.cargoId===id)).length;
  if(turno>=4 && vagas>=3 && !already(state,'vazio_comando_estrategico')){
    return consequence('vazio_comando_estrategico',turno,'Vazio no núcleo do governo começa a produzir falhas em cadeia','Sem titulares em áreas estratégicas, decisões chegam tarde, crises atravessam pastas e interlocutores externos e parlamentares passam a contornar o Planalto.',{
      capitalPolitico:-3,
      climaGoverno:-4,
      congresso:-2,
      economia:{confiancaMercado:-1.5,riscoPais:3},
      institucional:{tensaoInstitucional:2},
    },1);
  }

  const estatal=(state.estatais||[]).find(e=>(e.exposicaoPolitica||0)>=82 && (e.governanca||50)<58);
  if(estatal && !already(state,`estatal_controle_${estatal.id}`)){
    return consequence(`estatal_controle_${estatal.id}`,turno,`Governança da ${estatal.sigla} vira caso de controle`,`Exposição política alta e governança frágil levam órgãos de controle a pedir contratos, atas e justificativas da ${estatal.sigla}.`,{
      capitalPolitico:-2,
      institucional:{riscoJuridico:5,tensaoInstitucional:2},
      oposicao:2,
      economia:{confiancaMercado:-1},
    },1);
  }

  const governadoresHostis=(state.estados||[]).filter(e=>(e.relacaoPlanalto??e.governador?.relacao??50)<35);
  if(governadoresHostis.length>=6 && !already(state,'frente_governadores')){
    return consequence('frente_governadores',turno,'Governadores formam frente para negociar em bloco','A deterioração simultânea de relações estaduais deixa de ser um conjunto de conflitos locais. Governadores articulam posição comum e levam a pressão para suas bancadas no Congresso.',{
      capitalPolitico:-2,congresso:-3,oposicao:2,climaGoverno:-1,
      estados:{ufs:governadoresHostis.slice(0,10).map(e=>e.uf),aprovacao:-.5,relacao:-1},
    },1);
  }

  const atrasados=(state.programas||[]).filter(p=>p.status==='atrasado');
  if(atrasados.length>=2 && !already(state,'programas_atrasados_territorio')){
    return consequence('programas_atrasados_territorio',turno,'Atrasos federais viram cobrança nos estados','Dois ou mais programas estruturantes acumulam atraso. Prefeitos, governadores e bancadas passam a cobrar cronogramas, e a falha de execução vira problema político territorial.',{
      capitalPolitico:-2,congresso:-2,oposicao:2,climaGoverno:-2,
      economia:{confiancaMercado:-.7},grupos:{periferia:-1,mercado:-.5,universitarios:-.4},
    },1);
  }

  const desemprego=Number(state.economia?.desemprego??8.4);
  if(desemprego>=11 && !already(state,'desemprego_capitais')){
    return consequence('desemprego_capitais',turno,'Desemprego pressiona grandes regiões metropolitanas','A fraqueza do mercado de trabalho deixa de ser apenas um indicador macro. Estados populosos cobram obras, crédito e políticas de emprego enquanto a oposição nacionaliza o tema.',{
      capitalPolitico:-2,oposicao:2,economia:{confiancaMercado:-1},
      grupos:{periferia:-2,sindicalistas:-1.5,mercado:-.6},
      estados:{ufs:['SP','RJ','MG','BA','PE','CE'],aprovacao:-1.3,relacao:-.8},
    },1);
  }

  const comercio=state.comercioExterior||{};
  const balanca=Number(comercio.balanca??((comercio.exportacoesMensais||0)-(comercio.importacoesMensais||0)));
  if(balanca<=-3000 && !already(state,'balanca_industria')){
    return consequence('balanca_industria',turno,'Déficit comercial chega à indústria e ao câmbio','Importações superam exportações por margem relevante. A pressão aparece em cadeias industriais, expectativas cambiais e governos estaduais dependentes de manufaturas.',{
      capitalPolitico:-1,economia:{riscoPais:4,confiancaMercado:-1.5,crescimentoPib:-.025},
      grupos:{mercado:-1.2,sindicalistas:-.8},
      estados:{ufs:['SP','PR','SC','MG','RS'],aprovacao:-.7,relacao:-.5},
    },1);
  }

  const chips=Number(comercio.importacoesPorSetor?.chips?.valor??0);
  const semicondutores=(state.projetosEspeciais||[]).some(p=>p.id==='semicondutores'&&['ativo','concluido'].includes(p.status));
  if(chips>=4800 && !semicondutores && !already(state,'dependencia_chips')){
    return consequence('dependencia_chips',turno,'Dependência de semicondutores trava cadeias produtivas','A conta de importação de chips sobe enquanto o país ainda não possui resposta industrial de escala. Automotivo, máquinas e serviços digitais começam a cobrar estratégia nacional.',{
      capitalPolitico:-1,economia:{confiancaMercado:-1,crescimentoPib:-.02},
      comercio:{importacoes:{chips:.05},itens:{semicondutores:{valorPct:.08,dependencia:4,potencial:-3},baterias:{valorPct:.04,dependencia:2}}},grupos:{mercado:-1,universitarios:-.5},
      estados:{ufs:['SP','PR','SC','MG'],aprovacao:-.5,relacao:-.5},
    },2);
  }

  const liderancaAmbiental=Number(state.mundo?.liderancaAmbiental??40);
  if(liderancaAmbiental<25 && !already(state,'reputacao_ambiental_comercio')){
    return consequence('reputacao_ambiental_comercio',turno,'Reputação ambiental começa a custar contratos','A perda de credibilidade ambiental passa da diplomacia para o comércio. Compradores elevam exigências, investidores reavaliam projetos e estados exportadores sentem a pressão.',{
      capitalPolitico:-1,mundo:{softPowerBrasil:-2},economia:{confiancaMercado:-1.2},
      comercio:{exportacoes:{agro:-.025,mineracao:-.025},itens:{soja:{valorPct:-.025,potencial:-3},carne_bovina:{valorPct:-.025,potencial:-3},minerio_ferro:{valorPct:-.02,potencial:-2}}},grupos:{agro:-1,mercado:-.8,universitarios:-1},
      estados:{ufs:['PA','MT','RO','AM','GO'],aprovacao:-.6,relacao:-.5},
    },2);
  }

  return null;
}

export function registrarCascata(state,cascata){
  if(!cascata) return {consequenciasPendentes:state.consequenciasPendentes||[],historicoCascatas:state.historicoCascatas||[]};
  return {
    consequenciasPendentes:[...(state.consequenciasPendentes||[]),cascata],
    historicoCascatas:[{...cascata,status:'agendada'},...(state.historicoCascatas||[])].slice(0,40),
  };
}

export function pressaoSistemica(state={}){
  const cp=Number(state.capitalPolitico??50);
  const inflacao=Number(state.economia?.inflacao??4.5);
  const risco=Number(state.economia?.riscoPais??250);
  const tensao=Number(state.institucional?.tensaoInstitucional??10);
  return clamp((100-cp)*.28+Math.max(0,inflacao-4)*4+Math.max(0,risco-250)*.04+tensao*.2);
}
