import { custoMedioDivida } from './economyPolicyEngine.js';
const clamp = (v,min,max)=>Math.min(max,Math.max(min,v));

export const FISCAL_INICIAL = {
  receitaEstrutural: 275000,
  despesaEstrutural: 270000,
  receitaExtraTurno: 0,
  despesaExtraTurno: 0,
  investimentoProdutivoTurno: 0,
  investimentoHumanoTurno: 0,
  investimentoProdutivoAcumulado: 0,
  investimentoHumanoAcumulado: 0,
  economiaTurno: 0,
  desemprego: 8.4,
  jurosNominaisMensais: 0,
  resultadoNominal: 0,
  efeitosDefasados: [],
  historicoFiscal: [],
  indiceReceitaTributaria: 1,
  arrastoTributario: 0,
  impulsoInflacaoTributaria: 0,
  dividaComposicao: {prefixado:30,selic:35,ipca:31,cambial:4},
  prazoMedioDivida: 4.1,
  riscoRolagem: 36,
  custoMedioDivida: 13.75,
};

// valor positivo = despesa; valor negativo = receita extraordinária/economia de receita.
export const registrarMovimentoFiscal = (economia, valor, tipo='custeio') => {
  const e={...economia};
  if(valor>=0){
    e.despesaExtraTurno=(e.despesaExtraTurno||0)+valor;
    if(['infraestrutura','produtivo','tecnologia'].includes(tipo)) e.investimentoProdutivoTurno=(e.investimentoProdutivoTurno||0)+valor;
    if(['saude','educacao','humano'].includes(tipo)) e.investimentoHumanoTurno=(e.investimentoHumanoTurno||0)+valor;
  } else {
    e.receitaExtraTurno=(e.receitaExtraTurno||0)+Math.abs(valor);
  }
  return e;
};

export function processarFiscalMensal(economia, institucional, turno){
  const e={...FISCAL_INICIAL,...economia};
  const pib=Math.max(1,e.pib||10000000);
  const confianca=clamp(e.confiancaMercado??50,0,100);
  const crescimentoAnterior=e.crescimentoPib||0;

  // Bases estruturais não incorporam automaticamente receitas/despesas extraordinárias do mês.
  const receitaEstrutural=(e.receitaEstrutural||275000)*(1+crescimentoAnterior/1200);
  const despesaEstrutural=(e.despesaEstrutural||270000)*(1+Math.max(0,(e.inflacao||4.5)-4.5)/2400);
  const indiceTributario=clamp(e.indiceReceitaTributaria||1,.86,1.18);
  const receitaCiclica=receitaEstrutural*indiceTributario*(1 + crescimentoAnterior*0.0025 + Math.max(-0.012,Math.min(0.018,((e.inflacao||4.5)-4.5)*0.001)));
  const receita=Math.round(receitaCiclica+(e.receitaExtraTurno||0));
  const despesaPrimaria=Math.max(0,Math.round(despesaEstrutural+(e.despesaExtraTurno||0)-(e.economiaTurno||0)));
  const resultadoPrimario=receita-despesaPrimaria;

  // Juros são consequência do estoque de dívida e da taxa monetária vigente, não uma despesa discricionária presidencial.
  const custoDivida=custoMedioDivida({economia:e,composicao:e.dividaComposicao||{prefixado:30,selic:35,ipca:31,cambial:4}});
  const juros=Math.round((e.dividaValor||pib*0.75)*(custoDivida/100)/12);
  const resultadoNominal=resultadoPrimario-juros;
  const novaDividaValor=Math.max(0,(e.dividaValor||pib*0.75)-resultadoPrimario+juros);
  const novaDividaPct=(novaDividaValor/pib)*100;
  const primarioPct=(resultadoPrimario/pib)*100*12;
  const jurosPct=(juros*12/pib)*100;

  const tensao=(institucional?.tensaoInstitucional||10);
  const riscoRolagem=e.riscoRolagem??36;
  const exposicaoCambial=(e.dividaComposicao?.cambial||4);
  const riscoBase=105
    + Math.max(0,novaDividaPct-60)*4.5
    + Math.max(0,riscoRolagem-35)*1.25
    + Math.max(0,exposicaoCambial-4)*Math.max(0,(e.dolar||5)-5)*1.8
    + Math.max(0,-primarioPct)*24
    + Math.max(0,jurosPct-5)*7
    + tensao*1.35
    + Math.max(0,50-confianca)*2.1;
  const bonusCredibilidade=e.expectativasAncoradas?12:0;
  const bonusFundo=e.fundoEstabilizacao?10:0;
  const riscoPais=Math.round(clamp(riscoBase-bonusCredibilidade-bonusFundo,80,1200));

  const cambioPressao=(riscoPais-220)/900;
  const dolar=clamp((e.dolar||5)*(1+cambioPressao*0.055-(confianca-50)*0.0007),2.5,12);

  // Investimento produtivo retorna mais rápido; capital humano retorna mais lentamente, porém de forma persistente.
  const oferta=(e.investimentoProdutivoTurno||0)/10500 + (e.investimentoHumanoTurno||0)/19000;
  const impulsoDemanda=Math.max(-0.25,Math.min(0.45,(e.despesaExtraTurno||0)/17000));
  const pressaoFiscal=Math.max(0,-primarioPct);
  const inflacaoPre=clamp((e.inflacao||4.5) + pressaoFiscal*0.035 + cambioPressao*0.14 + impulsoDemanda*0.16 - oferta*0.08 + (e.impulsoInflacaoTributaria||0),0.5,25);

  // O BC reage com inércia. O jogador influencia a Selic indiretamente via inflação, risco e credibilidade.
  const selicAlvo=clamp(6.5 + inflacaoPre*0.82 + Math.max(0,riscoPais-220)*0.008 - (e.expectativasAncoradas?.25:0),5,28);
  const selic=Number(clamp((e.selic||13.75)*0.72+selicAlvo*0.28,5,28).toFixed(2));

  const crescimentoProximo=clamp(
    crescimentoAnterior*0.34 + oferta + impulsoDemanda
    - Math.max(0,selic-10)*0.027
    - Math.max(0,riscoPais-300)/2100
    - (e.arrastoTributario||0),
    -3.5,5.5
  );
  const inflacao=clamp(inflacaoPre - Math.max(0,selic-10)*0.028 - crescimentoProximo*0.015,0.5,25);
  const desemprego=clamp((e.desemprego??8.4)-crescimentoProximo*0.15+Math.max(0,selic-11)*0.03,3,24);

  // A opinião pública sente a economia real com dois meses de atraso.
  const impactoSocial=clamp(crescimentoProximo*0.65-Math.max(0,inflacao-4.5)*0.28-Math.max(0,desemprego-7)*0.38,-4,3);
  const efeitosDefasados=[...(e.efeitosDefasados||[]).filter(x=>x.turno>turno),{turno:turno+2,impacto:impactoSocial,motivo:'economia real'}];
  const impactoVencido=(e.efeitosDefasados||[]).filter(x=>x.turno<=turno).reduce((s,x)=>s+(x.impacto||0),0);
  const investimentoProdutivoAcumulado=(e.investimentoProdutivoAcumulado||0)+(e.investimentoProdutivoTurno||0);
  const investimentoHumanoAcumulado=(e.investimentoHumanoAcumulado||0)+(e.investimentoHumanoTurno||0);
  const historicoFiscal=[{
    turno, receita, despesaPrimaria, resultadoPrimario, juros, resultadoNominal,
    dividaPublica:novaDividaPct, riscoPais, desemprego, inflacao, selic,
    investimentoProdutivo:e.investimentoProdutivoTurno||0, investimentoHumano:e.investimentoHumanoTurno||0,
  },...(e.historicoFiscal||[])].slice(0,18);

  return {
    economia:{
      ...e,
      receitaEstrutural,
      despesaEstrutural,
      arrecadacaoMensal:receita,
      gastosMensais:despesaPrimaria,
      resultadoPrimario,
      jurosNominaisMensais:juros,
      custoMedioDivida:custoDivida,
      resultadoNominal,
      dividaValor:novaDividaValor,
      dividaPublica:Number(novaDividaPct.toFixed(1)),
      riscoPais,
      dolar:Number(dolar.toFixed(2)),
      crescimentoPib:Number(crescimentoProximo.toFixed(2)),
      inflacao:Number(inflacao.toFixed(2)),
      desemprego:Number(desemprego.toFixed(1)),
      selic,
      efeitosDefasados,
      historicoFiscal,
      investimentoProdutivoAcumulado,
      investimentoHumanoAcumulado,
      receitaExtraTurno:0,
      despesaExtraTurno:0,
      investimentoProdutivoTurno:0,
      investimentoHumanoTurno:0,
      economiaTurno:0,
      impulsoInflacaoTributaria:Number(((e.impulsoInflacaoTributaria||0)*0.45).toFixed(3)),
    },
    impactoAprovacao:impactoVencido,
    resumo:{receita,despesaPrimaria,resultadoPrimario,juros,resultadoNominal,riscoPais,desemprego,selic}
  };
}
