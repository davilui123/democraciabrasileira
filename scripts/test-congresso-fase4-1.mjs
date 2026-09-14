import { leisSeed } from '../src/data/seed/leis.js';
import { comissoesSeed } from '../src/data/seed/comissoes.js';
import { atoresCongressoSeed } from '../src/data/seed/atoresCongresso.js';
import {
  CONGRESSO_INICIAL,
  ACOES_ARTICULACAO,
  getQuorumInfo,
  calcularProjecao,
  criarProposta,
  simularVotacao,
  aplicarAcaoArticulacao,
} from '../src/game/congressEngine.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const partidos = [
  { id: 'esq', sigla: 'PPG', cadeiras: 110, apoio: 80 },
  { id: 'centro', sigla: 'MOC', cadeiras: 220, apoio: 30 },
  { id: 'ind', sigla: 'IND', cadeiras: 53, apoio: 50 },
  { id: 'dir', sigla: 'LIB', cadeiras: 130, apoio: 10 },
];

assert(partidos.reduce((sum, p) => sum + p.cadeiras, 0) === 513, 'Bancadas não somam 513 cadeiras.');
assert(leisSeed.length >= 70, 'Banco de leis deveria ser amplo.');
assert(new Set(leisSeed.map((l) => l.id)).size === leisSeed.length, 'IDs de leis duplicados.');
assert(new Set(comissoesSeed.map((c) => c.id)).size === comissoesSeed.length, 'IDs de comissões duplicados.');
assert(atoresCongressoSeed.length >= 8, 'Cúpula parlamentar insuficiente.');

const comissoesValidas = new Set(comissoesSeed.map((c) => c.id));
for (const lei of leisSeed) {
  assert(['PL', 'PLP', 'PEC'].includes(lei.instrumento), `Instrumento inválido: ${lei.id}`);
  assert(lei.comissoes.length >= 1, `Lei sem comissão: ${lei.id}`);
  for (const cid of lei.comissoes) assert(comissoesValidas.has(cid), `Comissão ${cid} ausente em ${lei.id}`);
  assert(lei.afinidade && ['esq','centro','ind','dir'].every((id) => Number.isFinite(lei.afinidade[id])), `Afinidade incompleta: ${lei.id}`);
  if (lei.instrumento === 'PEC') assert(lei.admiteUrgencia === false, `PEC não deve usar atalho de urgência: ${lei.id}`);
}

assert(getQuorumInfo('PEC').votosMinimos === 308 && getQuorumInfo('PEC').turnos === 2, 'Quórum de PEC incorreto.');
assert(getQuorumInfo('PLP').votosMinimos === 257, 'Quórum de PLP incorreto.');
assert(getQuorumInfo('PL').quorumPresenca === 257, 'Presença mínima de PL incorreta.');

for (const lei of leisSeed.slice(0, 18)) {
  const proposta = criarProposta({ lei, turno: 1, atores: atoresCongressoSeed, partidos });
  const proj = calcularProjecao(proposta, lei, partidos);
  assert(proj.bancadas.reduce((sum, b) => sum + b.cadeiras, 0) === 513, `Projeção não cobre 513 cadeiras: ${lei.id}`);
  assert(proj.sim + proj.nao === 513, `Projeção quebrada: ${lei.id}`);
  const voto = simularVotacao({ proposta, lei, partidos });
  assert(voto.sim + voto.nao + voto.abstencao === 513, `Votação não totaliza 513: ${lei.id}`);
}

const leiTeste = leisSeed.find((l) => l.instrumento === 'PL' && l.admiteUrgencia) || leisSeed[0];
const propostaTeste = criarProposta({ lei: leiTeste, turno: 1, atores: atoresCongressoSeed, partidos });
const negociacao = aplicarAcaoArticulacao({
  acaoId: 'negociar_texto',
  proposta: propostaTeste,
  lei: leiTeste,
  congresso: CONGRESSO_INICIAL,
  capitalPolitico: 100,
  orcamento: 10000,
  popularidade: 55,
});
assert(negociacao.ok, 'Negociação de texto deveria ser executável.');
assert(negociacao.proposta.polarizacaoAtual <= propostaTeste.polarizacaoAtual, 'Negociação deveria reduzir polarização.');
assert(ACOES_ARTICULACAO.length >= 6, 'Poucas ações de articulação.');

const rowCounts = [35,39,43,47,50,53,56,60,63,67];
assert(rowCounts.reduce((a,b) => a+b,0) === 513, 'Hemiciclo compacto não soma 513 posições.');

console.log(JSON.stringify({
  status: 'ok',
  leis: leisSeed.length,
  comissoes: comissoesSeed.length,
  atores: atoresCongressoSeed.length,
  acoesArticulacao: ACOES_ARTICULACAO.length,
  cadeiras: 513,
  pec: getQuorumInfo('PEC'),
}, null, 2));
