import assert from 'node:assert/strict';
import { conquistasSeed } from '../src/data/seed/conquistas.js';
import { progressoConquista, avaliarConquistas, aplicarBonusConquista } from '../src/game/achievementEngine.js';
import { estatalNuclearAvancada, ceitecExpandida, leiCriacaoEBTN } from '../src/data/seed/recompensasConquistas.js';
import { comissoesSeed } from '../src/data/seed/comissoes.js';

assert.equal(conquistasSeed.length,23,'catálogo de conquistas');
assert.equal(new Set(conquistasSeed.map(c=>c.id)).size,conquistasSeed.length,'IDs únicos');
assert(conquistasSeed.every(c=>c.recompensa?.nome),'todas as conquistas têm recompensa');
assert.equal(estatalNuclearAvancada.diretrizes.length,3);
assert.equal(ceitecExpandida.diretrizes.length,3);
const idsComissoes=new Set(comissoesSeed.map(c=>c.id));
assert(leiCriacaoEBTN.comissoes.every(id=>idsComissoes.has(id)),'PL da EBTN usa comissões existentes');

const state={
  turno:12,popularidade:{geral:72},capitalPolitico:50,climaGoverno:60,
  capacidadesDesbloqueadas:[],conquistasDesbloqueadas:[],
  economia:{crescimentoPib:3.2,dividaPublica:66,riscoPais:180,confiancaMercado:70,investimentoProdutivoAcumulado:52000,investimentoHumanoAcumulado:27000,historicoFiscal:Array.from({length:6},(_,i)=>({turno:12-i,resultadoPrimario:5000,inflacao:3.4,desemprego:6.2}))},
  gruposSociais:Object.fromEntries(['evangelicos','sindicalistas','agro','periferia','mercado','militares','universitarios'].map((id,i)=>[id,{id,aprovacao:i<5?68:55,peso:1/7}])),
  partidos:[{cadeiras:110,apoio:90},{cadeiras:220,apoio:80},{cadeiras:130,apoio:45},{cadeiras:53,apoio:60}],
  estados:Array.from({length:27},(_,i)=>({uf:`U${i}`,relacaoPlanalto:i<20?65:45})),
  cargos:Array.from({length:14},(_,i)=>({id:`m${i}`})),nomeacoes:Array.from({length:14},(_,i)=>({cargoId:`m${i}`})),
  projetosEspeciais:[{id:'nuclear_2040',status:'concluido'},{id:'semicondutores',status:'concluido'},{id:'bio_vacinas',status:'concluido'}],
  estatais:[{id:'enbpar',diretrizAtual:'enb_nuclear',governanca:82},{id:'x',governanca:82}],eventosEstatais:Array.from({length:8},(_,i)=>({id:i})),
  paises:[{relacao:90},{relacao:86},{relacao:82}],geopolitica:{tratadosEstrategicos:[{},{}]},mundo:{softPowerBrasil:50},
  stf:{tensaoInstitucional:10,historicoIndicacoes:[{aprovada:true}]},institucional:{tensaoInstitucional:10,respeitoConstitucional:80,credibilidadeDemocratica:80},oposicao:{forca:30},congresso:{poder:40},
};

assert(progressoConquista(state,'aprovacao_70').ok);
assert(progressoConquista(state,'pais_em_obras').ok);
assert(progressoConquista(state,'dominio_nuclear').ok);
assert(progressoConquista(state,'diplomacia_estado').ok);
const novas=avaliarConquistas(state);
assert(novas.length>=15,'estado rico deve liberar muitas conquistas');
const after=aplicarBonusConquista(state,conquistasSeed.find(c=>c.id==='aprovacao_70'));
assert(after.capacidadesDesbloqueadas.includes('presidencia_popular'));
console.log(JSON.stringify({status:'ok',conquistas:conquistasSeed.length,desbloqueadasNoCenario:novas.length,empresaNuclear:estatalNuclearAvancada.nome,ceitec:ceitecExpandida.nome},null,2));
