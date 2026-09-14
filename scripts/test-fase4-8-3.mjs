import assert from 'node:assert/strict';
import fs from 'node:fs';
import { corteSTFSeed } from '../src/data/seed/instituicoes.js';
import { sortearEventoFederativo } from '../src/game/institutionEngine.js';
import { cutscenePorEvento } from '../src/data/seed/cutscenes.js';

const turma1 = corteSTFSeed.filter(m => m.turma === '1ª Turma').map(m => m.nome);
const turma2 = corteSTFSeed.filter(m => m.turma === '2ª Turma').map(m => m.nome);
assert.deepEqual(turma1.sort(), ['Breno Vasconcelos','Celina Prado','Domingos Ferraz','Elisa Tanaka'].sort(), '1ª Turma deve misturar ministros e ministras');
assert.deepEqual(turma2.sort(), ['Flávio Lacerda','Gabriela Diniz','Henrique Paiva','Joaquim Torres','Íris Albuquerque'].sort(), '2ª Turma deve permanecer equilibrada');


const institutions = fs.readFileSync(new URL('../src/components/Institutions.jsx', import.meta.url), 'utf8');
assert.match(institutions, /ChevronLeft/);
assert.match(institutions, /ChevronRight/);
assert.match(institutions, /turmaAtiva/);
assert.match(institutions, /As Turmas são exibidas uma por vez/);
const turmaRenderCount = (institutions.match(/<Turma\s/g) || []).length;
assert.equal(turmaRenderCount, 1, 'o STF deve renderizar somente uma Turma por vez');
assert.doesNotMatch(institutions, /truncate text-xs font-black text-text/, 'nomes dos ministros não devem usar o truncamento antigo');

const newsCenter = fs.readFileSync(new URL('../src/components/NewsCenter.jsx', import.meta.url), 'utf8');
const ticker = fs.readFileSync(new URL('../src/components/NewsTicker.jsx', import.meta.url), 'utf8');
const transition = fs.readFileSync(new URL('../src/components/TurnTransitionModal.jsx', import.meta.url), 'utf8');
const store = fs.readFileSync(new URL('../src/store/useGameStore.js', import.meta.url), 'utf8');
assert.match(newsCenter, /Central de Notícias/);
assert.match(newsCenter, /Pendências/);
assert.match(ticker, /Abrir central/);
assert.doesNotMatch(transition, />Cutscene</, 'rótulo técnico não deve aparecer ao jogador');
assert.doesNotMatch(store, /eventosFederativosSeed\[0\]/, 'SP não pode ser evento inicial obrigatório');
assert.doesNotMatch(store, /turno===2.*gov-sp-i1/s, 'cutscene do ICMS não pode ser forçada na primeira virada');
assert.match(store, /Governo incompleto:/, 'gabinete incompleto deve gerar consequência explícita');

const estados = [
  {uf:'SP',nome:'São Paulo',governador:{nome:'Isabela Ferraz',partido:'SPM'}},
  {uf:'MT',nome:'Mato Grosso',governador:{nome:'Governador MT',partido:'MOC'}},
];
const primeiro = sortearEventoFederativo({turno:1,estados,historico:[],nomeacoes:[],cargos:[],rng:()=>0});
const outro = sortearEventoFederativo({turno:1,estados,historico:[],nomeacoes:[],cargos:[],rng:()=>0.99});
assert.ok(primeiro && outro);
assert.notEqual(primeiro.baseId, outro.baseId, 'rng diferente deve conseguir selecionar eventos diferentes');
assert.equal(cutscenePorEvento('sp_icms')?.id, 'gov-sp-i1');

console.log(JSON.stringify({turma1,turma2,newsCenter:true,eventosAleatorios:[primeiro.baseId,outro.baseId],gabineteComConsequencias:true}, null, 2));
