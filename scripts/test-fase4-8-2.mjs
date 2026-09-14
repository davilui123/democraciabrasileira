import assert from 'node:assert/strict';
import fs from 'node:fs';
import { cutscenesSeed, cutscenePorId } from '../src/data/seed/cutscenes.js';

assert.equal(cutscenesSeed.length, 4, 'deve haver quatro cutscenes piloto de Isabela');
assert.equal(new Set(cutscenesSeed.map(c => c.id)).size, 4, 'ids de cutscene devem ser únicos');
assert.equal(cutscenePorId('gov-sp-i1')?.testePrimeiraVirada, true, 'ICMS deve ser a cena de teste da primeira virada');
assert.equal(cutscenePorId('gov-sp-i1')?.eventoRelacionado, 'sp_icms');
assert.ok(fs.existsSync(new URL('../public/cutscene/gov-sp-i1f.gif', import.meta.url)), 'GIF piloto deve existir no pacote');
for (const scene of cutscenesSeed) {
  assert.ok(scene.personagem && scene.titulo && scene.imagem && scene.fala, `metadados incompletos em ${scene.id}`);
}
console.log(JSON.stringify({cutscenes:cutscenesSeed.map(c=>c.id),piloto:'gov-sp-i1',assetPiloto:true}, null, 2));
