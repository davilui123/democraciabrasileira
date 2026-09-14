import assert from 'node:assert/strict';
import { estadosSeed } from '../src/data/seed/estados.js';
import {
  adversariosGovernadoresSeed,
  caciquesPartidariosSeed,
  viceAtualPorPartido,
} from '../src/data/seed/eleicoes.js';
import {
  criarEstadoEleitoralInicial,
  faseEleitoralPorData,
  aplicarOfertaConvencao,
  finalizarConvencao,
  executarCaptacao,
  executarAcaoEleitoral,
  prepararVicePool,
  calcularViceFit,
  avaliarCandidaturasPersonagens,
  apoiarCorridaEstadual,
} from '../src/game/electionEngine.js';

const perfil={partidoId:'esq',ufOrigem:'SP',eixos:{economia:'desenvolvimentista',seguranca:'prevencao'}};
let eleicao=criarEstadoEleitoralInicial({perfil,estados:estadosSeed});

assert.equal(adversariosGovernadoresSeed.length,27,'deve haver um desafiante por UF');
assert.equal(new Set(adversariosGovernadoresSeed.map(x=>x.uf)).size,27,'UFs dos desafiantes devem ser únicas');
assert.equal(eleicao.corridasGovernadores.length,27,'deve haver 27 eleições estaduais');
assert.equal(caciquesPartidariosSeed.length,12,'deve haver 12 caciques de convenção');
assert.equal(Object.keys(viceAtualPorPartido).length,4,'deve haver vice atual por partido');
assert.ok(eleicao.pesquisa.indecisos>=50,'pesquisa inicial deve começar com muitos indecisos');

assert.equal(faseEleitoralPorData('2026-02-01'),'pre_campanha');
assert.equal(faseEleitoralPorData('2026-03-10'),'janela_partidaria');
assert.equal(faseEleitoralPorData('2026-07-25'),'convencao');
assert.equal(faseEleitoralPorData('2026-08-10'),'registro');
assert.equal(faseEleitoralPorData('2026-09-01'),'campanha');
assert.equal(faseEleitoralPorData('2026-10-01'),'primeiro_turno');

const dalva=caciquesPartidariosSeed.find(c=>c.id==='cac_ppg_ne');
const conv=aplicarOfertaConvencao(eleicao,dalva.id,'programa_partidario');
assert.equal(conv.ok,true);
assert.equal(conv.accepted,true,'oferta afinada deve conseguir apoio inicial');
assert.ok(conv.eleicao.convencao.apoioDelegados>eleicao.convencao.apoioDelegados);
const forced={...conv.eleicao,convencao:{...conv.eleicao.convencao,apoioDelegados:70}};
assert.equal(finalizarConvencao(forced).ok,true,'apoio suficiente deve oficializar convenção');

assert.equal(executarCaptacao(eleicao,'crowdfunding',{dataAtual:'2026-05-01'}).ok,false,'crowdfunding deve respeitar data');
const crowd=executarCaptacao(eleicao,'crowdfunding',{dataAtual:'2026-05-15',reputacaoDigital:70});
assert.equal(crowd.ok,true);
assert.ok(crowd.eleicao.recursos.caixa>eleicao.recursos.caixa);

let risky={...eleicao,recursos:{...eleicao.recursos,caixa:100},campanha:{...eleicao.campanha,energia:10,energiaMax:10}};
for(let i=0;i<4;i++){
  const r=executarAcaoEleitoral(risky,'desinformacao',{random:()=>0});
  assert.equal(r.ok,true);
  risky={...r.eleicao,recursos:{...r.eleicao.recursos,caixa:100},campanha:{...r.eleicao.campanha,energia:10,energiaMax:10}};
}
assert.equal(risky.desinformacao.usos,4);
assert.equal(risky.candidatura.desclassificado,true,'reincidência deve poder desclassificar de verdade');
assert.ok(risky.autenticidade<eleicao.autenticidade,'desinformação deve custar autenticidade');

const minister={id:'min_teste',nome:'Marina Teste',uf:'BA',ambicao:90,popularidade:76,partidoId:'esq',avatar:'min-marina-teste'};
const camara={id:'dep_teste',nome:'Rafael Teste',uf:'RJ',ambicao:90,influencia:89,partidoId:'centro',avatar:'dep-rafael-teste'};
const dynamic=avaliarCandidaturasPersonagens({nomeacoes:[minister],atoresCongresso:[camara],estados:estadosSeed,turno:40});
assert.ok(dynamic.some(c=>c.personagemId==='min_teste'&&c.office==='presidencia'));
assert.ok(dynamic.some(c=>c.personagemId==='dep_teste'&&c.office==='presidencia'));

const vicePool=prepararVicePool({eleicao,perfil,nomeacoes:[minister],atoresCongresso:[camara],estados:estadosSeed});
assert.ok(vicePool.length>=4,'pool de vice deve combinar elenco existente');
const fit=calcularViceFit(vicePool[0],perfil,eleicao);
assert.ok(Number.isFinite(fit.score));

const supported=apoiarCorridaEstadual(eleicao,'SP','challenger');
assert.equal(supported.corridasGovernadores.find(r=>r.uf==='SP').apoioPresidencial,'challenger');

console.log(JSON.stringify({
  corridasEstaduais:eleicao.corridasGovernadores.length,
  desafiantes:adversariosGovernadoresSeed.length,
  caciques:caciquesPartidariosSeed.length,
  viceAtual:Object.keys(viceAtualPorPartido).length,
  indecisosIniciais:eleicao.pesquisa.indecisos,
  riscoDesinformacaoApos4:risky.desinformacao.riscoJuridico,
  desclassificacaoPorReincidencia:risky.candidatura.desclassificado,
  candidaturasDinamicas:dynamic.length,
  vicePool:vicePool.length,
},null,2));
