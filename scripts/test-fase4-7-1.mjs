import assert from 'node:assert/strict';
import { atoresCongressoSeed } from '../src/data/seed/atoresCongresso.js';
import { estadosSeed } from '../src/data/seed/estados.js';
import { corteSTFSeed, candidatosSTFSeed } from '../src/data/seed/instituicoes.js';
import { lideresPorPais } from '../src/data/seed/geopolitica.js';
import { paisesSeed } from '../src/data/seed/paises.js';

const rich=['agendaPessoal','rede','vulnerabilidade'];
const check=(arr,label)=>arr.forEach(p=>rich.forEach(k=>assert.ok(p[k],`${label}: ${p.nome} sem ${k}`)));

assert.equal(atoresCongressoSeed.length,10);
check(atoresCongressoSeed,'Câmara');
assert.equal(estadosSeed.length,27);
check(estadosSeed.map(e=>e.governador),'Governador');
assert.equal(corteSTFSeed.length,10);
check(corteSTFSeed,'STF');
assert.equal(candidatosSTFSeed.length,6);
check(candidatosSTFSeed,'Candidato STF');
assert.equal(paisesSeed.length,34);
assert.equal(Object.keys(lideresPorPais).length,34);
paisesSeed.forEach(p=>assert.ok(lideresPorPais[p.id],`País sem líder: ${p.id}`));
check(Object.values(lideresPorPais),'Líder estrangeiro');
assert.equal(corteSTFSeed.filter(m=>m.funcao==='Presidente').length,1);
assert.equal(corteSTFSeed.filter(m=>m.funcao==='Vice-Presidente').length,1);
assert.equal(corteSTFSeed.filter(m=>m.funcao==='Decano').length,1);
assert.equal(corteSTFSeed.filter(m=>m.turma==='1ª Turma').length,4);
assert.equal(corteSTFSeed.filter(m=>m.turma==='2ª Turma').length,5);

console.log(JSON.stringify({camara:10,governadores:27,lideres:34,stf:10,candidatosSTF:6,turma1:4,turma2:5,vagaInicial:1},null,2));
