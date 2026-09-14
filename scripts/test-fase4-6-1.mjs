import { empresasPrivadasSeed, modalidadesParceriaSeed } from '../src/data/seed/empresasPrivadas.js';
import { promessasPosseSeed, eixosPerfilSeed } from '../src/data/seed/perfilPresidencial.js';
import { eventosNacionaisSeed } from '../src/data/seed/eventosNacionais.js';
import { criarConsequenciasAgenda, criarConsequenciaFederativa } from '../src/game/turnConsequenceEngine.js';
import { calcularTendenciasPulso } from '../src/game/mediaEngine.js';

const assert=(cond,msg)=>{if(!cond)throw new Error(msg)};
assert(new Set(empresasPrivadasSeed.map(x=>x.id)).size===empresasPrivadasSeed.length,'IDs duplicados em empresas privadas');
assert(empresasPrivadasSeed.length>=12,'Catálogo empresarial pequeno');
assert(modalidadesParceriaSeed.length===4,'Esperadas 4 modalidades de parceria');
assert(promessasPosseSeed.length>=9,'Promessas de posse insuficientes');
assert(Object.keys(eixosPerfilSeed).length===5,'Esperados 5 eixos presidenciais');
const expo=eventosNacionaisSeed.find(e=>e.id==='evt_expoagro');
assert(expo?.ministerioId==='m_agro','ExpoAgro não está ligada à Agricultura');
assert(expo.apoios.includes('m_exteriores'),'ExpoAgro deve conversar com Relações Exteriores');
const agenda=criarConsequenciasAgenda(['ruas','producao','governadores','ciencia','imprensa'],6);
assert(agenda.length===5,'Agenda não gerou todas as consequências');
assert(agenda.every(c=>c.turnoAlvo>=8&&c.turnoAlvo<=10),'Consequência de agenda fora de 2–4 meses');
const fed=criarConsequenciaFederativa({id:'mt_rr',instanceId:'mt_rr_1',uf:'MT',titulo:'Terras raras em Mato Grosso'},{id:'consorcio',texto:'Criar consórcio',fiscal:-800,crescimento:.05,oposicao:2,tensao:1},8);
assert(fed.turnoAlvo>=10&&fed.turnoAlvo<=12,'Consequência federativa fora de 2–4 meses');
assert(fed.efeitos.fiscal===800,'Impacto fiscal federativo incorreto');
const trends=calcularTendenciasPulso([
  {texto:'#ExpoAgro é prioridade',tema:'agro',alcance:3000000},
  {texto:'Debate sobre #ExpoAgro',tema:'agro',alcance:1800000},
  {texto:'Economia em foco',tema:'economia',alcance:1200000},
]);
assert(trends.some(t=>t.toLowerCase().includes('expoagro')),'Pulso não detectou tendência');
console.log(JSON.stringify({status:'ok',empresas:empresasPrivadasSeed.length,modalidades:modalidadesParceriaSeed.length,promessas:promessasPosseSeed.length,eixos:Object.keys(eixosPerfilSeed).length,eventosNacionais:eventosNacionaisSeed.length,expoAgro:expo.titulo,consequenciasAgenda:agenda.map(c=>c.turnoAlvo),consequenciaFederativa:fed.turnoAlvo,tendencias:trends},null,2));
