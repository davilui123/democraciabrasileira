import assert from 'node:assert/strict';
import fs from 'node:fs';
import { cutscenesSeed, cutscenePorId, cutscenePorEvento } from '../src/data/seed/cutscenes.js';

assert.equal(cutscenesSeed.length, 4, 'deve haver quatro acontecimentos audiovisuais piloto de Isabela');
assert.equal(new Set(cutscenesSeed.map(c => c.id)).size, 4, 'ids devem ser únicos');
assert.equal(cutscenePorId('gov-sp-i1')?.eventoRelacionado, 'sp_icms');
assert.equal(cutscenePorEvento('sp_icms')?.id, 'gov-sp-i1');
assert.ok(fs.existsSync(new URL('../public/cutscene/gov-sp-i1f.gif', import.meta.url)), 'GIF do ICMS deve existir no pacote');
for (const scene of cutscenesSeed) {
  assert.ok(scene.personagem && scene.titulo && scene.imagem && scene.fala, `metadados incompletos em ${scene.id}`);
  assert.ok(scene.cobertura?.veiculo && scene.cobertura?.programa && scene.cobertura?.manchete, `cobertura jornalística incompleta em ${scene.id}`);
}
console.log(JSON.stringify({cutscenes:cutscenesSeed.map(c=>c.id),gatilhoICMS:'sp_icms',assetICMS:true}, null, 2));
