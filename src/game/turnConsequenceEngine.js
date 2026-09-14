const hash=(s='')=>[...String(s)].reduce((a,c)=>a+c.charCodeAt(0),0);
const delayFor=(id,turno,min=1,max=3)=>min+((hash(id)+turno)%Math.max(1,max-min+1));

export const agendaConsequenceMeta={
  ruas:{titulo:'Cobranças da agenda popular',publico:'As visitas criaram compromissos e expectativas que voltarão à mesa do governo.',grupo:'periferia',efeitos:{fiscal:280,tipoFiscal:'custeio',grupos:{periferia:1.5,sindicalistas:.5},oposicao:-.5}},
  producao:{titulo:'Contrapartidas da agenda produtiva',publico:'Empresários e produtores esperam crédito, logística e previsibilidade após a agenda presidencial.',grupo:'agro',efeitos:{fiscal:220,tipoFiscal:'garantia',crescimento:.025,grupos:{mercado:1.2,agro:1.4},riscoJuridico:.5}},
  governadores:{titulo:'Pactos federativos viram execução',publico:'Governadores começam a cobrar cronograma, repasses e entregas pactuadas com o Planalto.',grupo:'governadores',efeitos:{fiscal:420,tipoFiscal:'infraestrutura',congresso:2.5,grupos:{periferia:.6,mercado:.4},riscoJuridico:1}},
  ciencia:{titulo:'Compromissos com ciência chegam ao orçamento',publico:'Universidades e centros de pesquisa apresentam a conta dos anúncios feitos pela Presidência.',grupo:'universitarios',efeitos:{fiscal:300,tipoFiscal:'humano',crescimento:.03,grupos:{universitarios:1.7,mercado:.4}}},
  imprensa:{titulo:'Entrevista volta ao debate público',publico:'Trechos da entrevista reaparecem quando decisões do governo são confrontadas com o que foi prometido ao vivo.',grupo:'midia',efeitos:{oposicao:1.5,grupos:{universitarios:.4,mercado:.3},riscoJuridico:0}},
  congresso:{titulo:'Acordos do café de líderes chegam à pauta',publico:'Líderes cobram espaço, relatorias e prioridade para pautas discutidas com o Presidente.',grupo:'congresso',efeitos:{congresso:3,oposicao:.5,riscoJuridico:.5}},
  empresas:{titulo:'Investidores cobram ambiente para executar anúncios',publico:'Empresas querem licenças, financiamento e previsibilidade após o encontro com o Planalto.',grupo:'mercado',efeitos:{fiscal:160,tipoFiscal:'garantia',crescimento:.02,grupos:{mercado:1.2,agro:.4},riscoJuridico:.8}},
  gabinete:{titulo:'Cobrança de execução chega aos ministérios',publico:'A Presidência concentrou coordenação e agora cobra entregas mensuráveis das pastas.',grupo:'governo',efeitos:{oposicao:-.4,grupos:{mercado:.3,universitarios:.3}}},
};

export function criarConsequenciasAgenda(ids=[],turno=1){
  return ids.map(id=>{const m=agendaConsequenceMeta[id];if(!m)return null;const atraso=delayFor(id,turno,2,4);return {id:`agenda_${id}_${turno}`,origem:'agenda',origemId:id,titulo:m.titulo,descricao:m.publico,criadoNoTurno:turno,turnoAlvo:turno+atraso,status:'pendente',efeitos:m.efeitos};}).filter(Boolean);
}

export function criarConsequenciaFederativa(evento,opcao,turno=1){
  if(!evento||!opcao)return null;
  const atraso=delayFor(`${evento.id}_${opcao.id}`,turno,2,4);
  return {id:`fed_${evento.instanceId||evento.id}_${opcao.id}`,origem:'federacao',origemId:evento.id,uf:evento.uf,titulo:`Desdobramento: ${evento.titulo}`,descricao:`A decisão “${opcao.texto}” continua produzindo efeitos administrativos, fiscais e políticos.`,criadoNoTurno:turno,turnoAlvo:turno+atraso,status:'pendente',efeitos:{fiscal:Math.abs(opcao.fiscal||0),tipoFiscal:(opcao.crescimento||0)>0?'infraestrutura':'custeio',crescimento:opcao.crescimento||0,oposicao:(opcao.oposicao||0)*.7,riscoJuridico:(opcao.tensao||0)*.7,congresso:(opcao.bastidor||0)*.5,grupos:{}}};
}
