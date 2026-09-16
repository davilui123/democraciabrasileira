import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { itensEstrategicosSeed, oportunidadesComerciaisSeed, comercioExteriorInicial } from '../src/data/seed/comercioExterior.js';
import { empresasPrivadasSeed } from '../src/data/seed/empresasPrivadas.js';
import { estataisSeed } from '../src/data/seed/estatais.js';
import { midiasSeed } from '../src/data/seed/midias.js';
import { medidasEconomicasSeed } from '../src/data/seed/economiaPolitica.js';
import { eventosInstitucionaisAutonomos } from '../src/game/institutionalAutonomyEngine.js';
import { normalizarComercio, aplicarPreferenciaComercial } from '../src/game/tradeEngine.js';
import { gerarCascataSistemica } from '../src/game/systemicCascadeEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const itens=Object.values(itensEstrategicosSeed);
if(itens.length<18) throw new Error(`Poucos itens estratégicos: ${itens.length}`);
for(const item of itens){
  for(const campo of ['imagem','sensibilidade','dependencia','capacidadeDomestica']) if(item[campo]===undefined||item[campo]===null) throw new Error(`${item.id} sem ${campo}`);
}
for(const id of ['fertilizantes','semicondutores','terras_raras','litio','niobio','veiculos_eletricos','ifa_farmaceutico','diesel']) if(!itensEstrategicosSeed[id]) throw new Error(`Item estratégico ausente: ${id}`);

if(empresasPrivadasSeed.length<15) throw new Error('Catálogo empresarial não foi ampliado.');
if(empresasPrivadasSeed.some(e=>!e.logo)) throw new Error('Empresa privada sem campo de logo.');
if(estataisSeed.some(e=>!e.logo)) throw new Error('Estatal sem campo de logo.');
if(midiasSeed.some(m=>!m.logo||!m.logosCanais)) throw new Error('Mídia sem identidade visual reservada.');
for(const id of ['dragonvolt_mobility','liberty_motors','eurodrive_mobility']) if(!empresasPrivadasSeed.some(e=>e.id===id)) throw new Error(`Concorrente de mobilidade ausente: ${id}`);

if(medidasEconomicasSeed.length<26) throw new Error(`Poucas medidas econômicas: ${medidasEconomicasSeed.length}`);
if(medidasEconomicasSeed.filter(m=>m.controle?.tcu>=60).length<4) throw new Error('TCU tem poucas medidas de alto escrutínio.');
if(medidasEconomicasSeed.filter(m=>m.controle?.stf>=60).length<3) throw new Error('STF tem poucas medidas judicializáveis.');

const oldSave={...comercioExteriorInicial}; delete oldSave.itensEstrategicos; delete oldSave.concorrenciaGeopolitica;
const normalized=normalizarComercio(oldSave);
if(Object.keys(normalized.itensEstrategicos||{}).length<18) throw new Error('Migração de save antigo não injeta itens estratégicos.');

const ev=oportunidadesComerciaisSeed.find(o=>o.id==='opp_cn_ev');
const favored=aplicarPreferenciaComercial(normalized,ev,4);
if((favored.concorrenciaGeopolitica.preferencias.cn||0)<8) throw new Error('Acordo chinês não aumenta preferência comercial.');
if((favored.concorrenciaGeopolitica.preferencias.us||0)>-4) throw new Error('Rival americano não reage à preferência comercial.');
if(!(favored.concorrenciaGeopolitica.tensoes||[]).some(t=>t.paisId==='us'&&t.intensidade>=40)) throw new Error('Acordo de EV não cria tensão competitiva com EUA.');

const cascade=gerarCascataSistemica({turno:5,comercioExterior:favored,geopolitica:{historicoPressoes:[]},mundo:{tensaoGlobal:30,liderancaAmbiental:50},economia:{inflacao:4.5,resultadoPrimario:0,desemprego:8,riscoPais:250},programas:[],nomeacoes:[{cargoId:'m_casacivil'},{cargoId:'m_fazenda'},{cargoId:'m_justica'},{cargoId:'m_exteriores'}],congresso:{poder:55},capitalPolitico:60,estados:[],estatais:[],projetosEspeciais:[]});
if(cascade?.baseId!=='corrida_eletricos_cn_us') throw new Error(`Concorrência China-EUA não virou cascata sistêmica: ${cascade?.baseId}`);
if(!cascade.efeitos?.comercio?.itens?.veiculos_eletricos) throw new Error('Cascata geopolítica não atinge produto estratégico.');

for(const id of ['tcu_politica_industrial','stf_politica_economica','tcu_minerais_criticos','stf_concorrencia_externa']) if(!eventosInstitucionaisAutonomos.some(e=>e.id===id)) throw new Error(`Controle autônomo ausente: ${id}`);

const visual=read('src/components/VisualAsset.jsx');
const trade=read('src/components/TradeCenter.jsx');
const companies=read('src/components/StateCompanies.jsx');
const news=read('src/components/NewsCenter.jsx');
const geo=read('src/components/Geopolitics.jsx');
const store=read('src/store/useGameStore.js');
for(const marker of ['arte pendente','LogoMark','IllustratedAsset']) if(!visual.includes(marker)) throw new Error(`Fallback visual incompleto: ${marker}`);
for(const marker of ['Estratégicos','Concorrência geopolítica','Dependências críticas']) if(!trade.includes(marker)) throw new Error(`Comércio sem UI estratégica: ${marker}`);
if(!companies.includes('LogoMark')||!companies.includes('sensibilidadeConcorrencial')) throw new Error('Empresas sem logo/concorrência na interface.');
if(!news.includes('LogoMark')) throw new Error('Central de Notícias não usa logo/fallback da mídia.');
if(!geo.includes('Mapa de relações prioritárias')||!geo.includes('overflow-y-auto pr-1')) throw new Error('Mapa de relações prioritárias sem scroll interno.');
for(const marker of ['aplicarComercioDaPressao','tcu','stf','normalizarComercio']) if(!store.includes(marker)) throw new Error(`Store sem conexão 4.9.5: ${marker}`);

console.log(JSON.stringify({status:'ok',fase:'4.9.5',itensEstrategicos:itens.length,empresasPrivadas:empresasPrivadasSeed.length,estatais:estataisSeed.length,midias:midiasSeed.length,medidasEconomicas:medidasEconomicasSeed.length,eventosControle:eventosInstitucionaisAutonomos.length,cascata:cascade.baseId},null,2));
