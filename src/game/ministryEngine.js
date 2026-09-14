import { eventosMinisteriais } from '../data/seed/eventosMinisteriais.js';
import { desafiosMinisteriais } from '../data/seed/desafiosMinisteriais.js';

export const clampMinister = (v, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(v)));

export const desafiosDaPasta = (ministerioId) => desafiosMinisteriais.filter((d) => d.ministerioId === ministerioId);
export const eventosDaPasta = (ministerioId) => eventosMinisteriais.filter((e) => e.ministerioId === ministerioId);

export function afinidadeComTags(ministro, tags = []) {
  if (!ministro || !tags.length) return 0;
  const apoia = new Set(ministro.apoia || []);
  const rejeita = new Set(ministro.rejeita || []);
  return tags.reduce((score, tag) => score + (apoia.has(tag) ? 1 : 0) - (rejeita.has(tag) ? 1 : 0), 0);
}

export function avaliarMinistro(ministro) {
  if (!ministro) return { eficacia: 0, estabilidade: 0, riscoRival: 0, riscoEscandalo: 0 };
  const tecnica = ministro.habTecnica ?? ministro.habilidadeTecnica ?? 50;
  const politica = ministro.habPolitica ?? ministro.habilidadePolitica ?? 50;
  const lealdade = ministro.lealdade ?? ministro.lealdadeInicial ?? 50;
  const integridade = ministro.integridade ?? 60;
  const ambicao = ministro.ambicao ?? 30;
  const popularidade = ministro.popularidade ?? 50;
  const riscoCorrupcao = ministro.riscoCorrupcao ?? 20;
  return {
    eficacia: clampMinister(tecnica * 0.62 + politica * 0.18 + lealdade * 0.2),
    estabilidade: clampMinister(lealdade * 0.55 + integridade * 0.25 + (100 - ambicao) * 0.2),
    riscoRival: clampMinister(ambicao * 0.55 + popularidade * 0.35 - lealdade * 0.2),
    riscoEscandalo: clampMinister(riscoCorrupcao * 0.6 + (100 - integridade) * 0.35 + (100 - lealdade) * 0.1),
  };
}

export function sortearLigacao({ nomeacoes = [], resolvidos = [], turno = 1 }) {
  const idsNomeados = new Set(nomeacoes.map((n) => n.cargoId));
  const candidatas = eventosMinisteriais.filter((e) => idsNomeados.has(e.ministerioId) && !resolvidos.includes(`${e.id}:${turno}`));
  if (!candidatas.length) return null;
  return candidatas[Math.floor(Math.random() * candidatas.length)];
}

export function avaliarRespostaDesafio(desafio, selecionados = []) {
  const ids = Array.isArray(selecionados) ? selecionados : [selecionados];
  if (desafio.ordemIdeal) return ids.join('|') === desafio.ordemIdeal.join('|');
  if (desafio.resposta) return ids.includes(desafio.resposta) && ids.length === 1;
  if (desafio.respostasIdeais) {
    const a = [...ids].sort().join('|');
    const b = [...desafio.respostasIdeais].sort().join('|');
    return a === b;
  }
  return false;
}
