import { agendaPresidencialOpcoesSeed, AGENDA_SLOTS_MENSAIS } from '../src/data/seed/agendaPresidencial.js';
import { empresasVisitasSeed } from '../src/data/seed/empresasVisitas.js';
import { COMERCIO_INICIAL, criarOportunidadeVisita, processarComercioMensal, ajustarTarifaSetorial } from '../src/game/tradeEngine.js';
import { criarConsequenciasAgenda } from '../src/game/turnConsequenceEngine.js';

const assert=(c,m)=>{if(!c)throw new Error(m)};
assert(AGENDA_SLOTS_MENSAIS===4,'Agenda deve ter 4 janelas mensais');
assert(agendaPresidencialOpcoesSeed.length>=8,'Agenda precisa de variedade');
assert(empresasVisitasSeed.length>=10,'Banco de empresas de visita pequeno');
assert(new Set(empresasVisitasSeed.map(e=>e.id)).size===empresasVisitasSeed.length,'IDs de empresas repetidos');
const cons=criarConsequenciasAgenda(['congresso','empresas','gabinete'],3);
assert(cons.length===3,'Novas agendas precisam gerar memória futura');
const opp=criarOportunidadeVisita({paisId:'us',turno:2,comercio:COMERCIO_INICIAL});
assert(opp?.paisId==='us','Visita deveria abrir oportunidade comercial');
const tariff=ajustarTarifaSetorial(COMERCIO_INICIAL,'chips',2);
assert(tariff.ok&&tariff.item.tarifa===10,'Tarifa setorial não foi ajustada');
const mes=processarComercioMensal(COMERCIO_INICIAL,{dolar:5.2,crescimentoPib:1.5,riscoPais:260,turno:2},{});
assert(Number.isFinite(mes.balanca),'Balança inválida');
console.log(JSON.stringify({status:'ok',agenda:agendaPresidencialOpcoesSeed.length,slots:AGENDA_SLOTS_MENSAIS,empresasVisitas:empresasVisitasSeed.length,consequencias:cons.length,oportunidade:opp.titulo,balanca:mes.balanca},null,2));
