import assert from 'node:assert/strict';
import { tributosExecutivosSeed, medidasEconomicasSeed, financiamentosEconomicosSeed, estrategiasDividaSeed, situacoesEconomicasSeed } from '../src/data/seed/economiaPolitica.js';
import { POLITICA_ECONOMICA_INICIAL, aplicarMudancaTributaria, calcularPressaoTributaria, detectarSituacaoEconomica, custoMedioDivida } from '../src/game/economyPolicyEngine.js';
import { processarFiscalMensal, registrarMovimentoFiscal } from '../src/game/fiscalEngine.js';

assert.equal(tributosExecutivosSeed.length,4);
assert.ok(medidasEconomicasSeed.length>=10);
assert.ok(financiamentosEconomicosSeed.length>=5);
assert.ok(estrategiasDividaSeed.length>=5);
assert.ok(situacoesEconomicasSeed.length>=6);

let pol={...POLITICA_ECONOMICA_INICIAL};
const tax=aplicarMudancaTributaria(pol,'iof',.5);
assert.equal(tax.ok,true);
const pressure=calcularPressaoTributaria(tax.politica.tributos);
assert.ok(pressure.indiceReceita>1);
assert.ok(pressure.pressaoCredito>0);

let economy={pib:10000000,crescimentoPib:.5,inflacao:4.5,dividaPublica:75,dividaValor:7500000,selic:13.75,dolar:5,confiancaMercado:50,riscoPais:250,desemprego:8.4,indiceReceitaTributaria:pressure.indiceReceita,arrastoTributario:pressure.arrastoCrescimento,impulsoInflacaoTributaria:pressure.impulsoInflacao,dividaComposicao:POLITICA_ECONOMICA_INICIAL.dividaComposicao,riscoRolagem:36};
economy=registrarMovimentoFiscal(economy,12000,'infraestrutura');
const month=processarFiscalMensal(economy,{tensaoInstitucional:10},1).economia;
assert.ok(Number.isFinite(month.resultadoPrimario));
assert.ok(Number.isFinite(month.custoMedioDivida));
assert.ok(month.dividaPublica>0);
assert.ok(Math.abs(month.impulsoInflacaoTributaria) < Math.abs(pressure.impulsoInflacao));

const crisis=detectarSituacaoEconomica({...month,inflacao:8});
assert.equal(crisis.id,'inflacao');
const cost=custoMedioDivida({economia:month,composicao:{prefixado:30,selic:35,ipca:31,cambial:4}});
assert.ok(cost>0);

console.log(JSON.stringify({
  tributos:tributosExecutivosSeed.length,
  medidas:medidasEconomicasSeed.length,
  financiamentos:financiamentosEconomicosSeed.length,
  estrategiasDivida:estrategiasDividaSeed.length,
  situacoes:situacoesEconomicasSeed.length,
  exemplo:{indiceReceita:pressure.indiceReceita,custoMedioDivida:cost,resultadoPrimario:month.resultadoPrimario,divida:month.dividaPublica}
},null,2));
