// Camada de dados estáticos do jogo.
// Não há banco externo: o conteúdo-base vive versionado junto do projeto.

import { ministeriosSeed } from './seed/ministerios.js';
import { ministrosSeed } from './seed/ministros.js';
import { problemasSeed } from './seed/problemas.js';
import { paisesSeed } from './seed/paises.js';
import { blocosSeed } from './seed/blocos.js';
import { tratadosSeed } from './seed/tratados.js';
import { cartasDiplomaticasSeed } from './seed/cartasDiplomaticas.js';
import { leisSeed } from './seed/leis.js';
import { estataisSeed } from './seed/estatais.js';
import { commoditiesSeed } from './seed/commodities.js';
import { stfSeed } from './seed/stf.js';
import { comissoesSeed } from './seed/comissoes.js';
import { atoresCongressoSeed } from './seed/atoresCongresso.js';
import { tributosExecutivosSeed, reformasTributariasSeed, medidasEconomicasSeed, financiamentosEconomicosSeed, estrategiasDividaSeed, situacoesEconomicasSeed } from './seed/economiaPolitica.js';

const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

const collection = (items) => ({
  async getAll() { return clone(items); },
  async findAll() { return clone(items); },
  async getById(id) { return clone(items.find(item => item.id === id) || null); },
  async findById(id) { return clone(items.find(item => item.id === id) || null); },
});

export const catalog = Object.freeze({
  ministerios: ministeriosSeed,
  ministros: ministrosSeed,
  problemas: problemasSeed,
  paises: paisesSeed,
  blocos: blocosSeed,
  tratados: tratadosSeed,
  cartasDiplomaticas: cartasDiplomaticasSeed,
  leis: leisSeed,
  estatais: estataisSeed,
  commodities: commoditiesSeed,
  stf: stfSeed,
  comissoes: comissoesSeed,
  atoresCongresso: atoresCongressoSeed,
  tributosExecutivos: tributosExecutivosSeed,
  reformasTributarias: reformasTributariasSeed,
  medidasEconomicas: medidasEconomicasSeed,
  financiamentosEconomicos: financiamentosEconomicosSeed,
  estrategiasDivida: estrategiasDividaSeed,
  situacoesEconomicas: situacoesEconomicasSeed,
});

// Fachada compatível com o store atual. Em uma segunda etapa, pode ser substituída
// por serviços de domínio sem tocar nos arquivos de conteúdo.
export const repositories = {
  bloco: collection(blocosSeed),
  pais: collection(paisesSeed),
  carta: collection(cartasDiplomaticasSeed),
  lei: collection(leisSeed),
  estatal: collection(estataisSeed),
  stf: collection(stfSeed),
  ministerio: collection(ministeriosSeed),
  ministro: collection(ministrosSeed),
  problema: collection(problemasSeed),
  tratado: collection(tratadosSeed),
  commodity: collection(commoditiesSeed),
  comissao: collection(comissoesSeed),
  atorCongresso: collection(atoresCongressoSeed),
};

export const dataUtils = {
  getStats() {
    return Object.fromEntries(
      Object.entries(catalog).map(([key, items]) => [key, items.length])
    );
  },
  exportCatalog() {
    return clone(catalog);
  },
};

export default { catalog, repositories, dataUtils };
