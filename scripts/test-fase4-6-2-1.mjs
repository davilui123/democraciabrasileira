import {
  criarAgendaCalendarioInicial, criarConviteVisitaInternacional, criarConviteMidiaCalendario,
  criarConviteGovernadorCalendario, compromissosNoTurno, convitesAbertos
} from '../src/game/agendaEngine.js';

const assert=(c,m)=>{if(!c)throw new Error(m)};
const inicio=new Date(2023,0,1);
const agenda=criarAgendaCalendarioInicial(inicio);
assert(agenda.compromissos.length>=5,'Calendário inicial precisa de compromissos futuros');
assert(compromissosNoTurno(agenda,6).some(c=>c.id==='agenda_brics'),'BRICS deve constar como compromisso futuro');
const visita=criarConviteVisitaInternacional({pais:{id:'cn',nome:'China'},turnoAtual:1,dataInicio:inicio});
assert(visita.turnoProposto>=3&&visita.turnoProposto<=6,'Visita bilateral deve poder ser proposta 2-5 meses à frente');
assert(visita.status==='pendente'&&visita.dataISO,'Visita deve entrar como convite datado');
const midia=criarConviteMidiaCalendario({convite:{id:'x',midiaId:'global',midia:'Global',formato:'Sabatina GNOW',tensao:'alta',pergunta:'Teste',alcance:90},turnoAtual:2,dataInicio:inicio});
assert(midia.tipo==='midia'&&midia.turnoProposto===3,'Convite de imprensa deve virar compromisso proposto');
const gov=criarConviteGovernadorCalendario({evento:{id:'rs_teste',uf:'RS',estado:'Rio Grande do Sul',gravidade:88,titulo:'Enchentes',governador:{nome:'Governador Teste'}},turnoAtual:3,dataInicio:inicio});
assert(gov?.prioridade==='urgente','Crise grave deve gerar convite urgente de governador');
const agendaConv={...agenda,convites:[visita,midia,gov]};
assert(convitesAbertos(agendaConv,2).length===3,'Convites devem permanecer abertos antes do prazo');
console.log(JSON.stringify({status:'ok',compromissos:agenda.compromissos.length,brics:agenda.compromissos.find(c=>c.id==='agenda_brics')?.dataISO,visitaChina:visita.dataISO,midia:midia.dataISO,governador:gov.dataISO},null,2));
