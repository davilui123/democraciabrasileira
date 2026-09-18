import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed } from '../src/data/seed/leis.js';
import { LEGADO_LEGISLATIVO_INICIAL, construirLegadoLegislativo, processarLegadoLegislativoMensal, alternarBandeiraLegado } from '../src/game/legislativeLegacyEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const lei=leisSeed.find(l=>l.regulamentacao?.necessaria)||leisSeed[0];
if(!lei)throw new Error('Catálogo legislativo vazio.');
const proposta={id:'prop_legacy_qa',leiId:lei.id,titulo:lei.titulo,status:'sancionada',origem:'executivo',posicaoGoverno:'autoria',versaoTexto:3,textoFinal:{versao:3,vigencia:'integral',alteracoes:[{id:'a1'},{id:'a2'}]},historico:[{turno:1,tipo:'protocolo',texto:'Projeto protocolado.'},{turno:3,tipo:'votacao',texto:'Aprovado na Câmara.'},{turno:4,tipo:'sancao',texto:'Sancionado.'}]};
const regulacao={processos:[{id:'reg1',propostaId:proposta.id,leiId:lei.id,status:'regulamentada',criadoNoTurno:4,regulamentadaNoTurno:5,notaDesenho:88}]};
const programas=[{id:'prog1',nome:'Programa QA',leiOrigemId:lei.id,propostaOrigemId:proposta.id,derivadoDeLei:true,status:'concluido',progresso:100,qualidade:82,execucao:90,riscoExecucao:18,criadoNoTurno:5}];
const controle={casosSTF:[{id:'stf1',propostaId:proposta.id,leiId:lei.id,status:'julgado',resultado:'constitucional',abertoNoTurno:6,julgadoNoTurno:8}],auditoriasTCU:[{id:'tcu1',propostaId:proposta.id,leiId:lei.id,status:'decidida',resultado:'regularidade',abertoNoTurno:6,decididaNoTurno:7}]};
const state={turno:8,votacoes:[proposta],leisDisponiveis:[lei],regulamentacaoLeis:regulacao,programas,controleLeis:controle,legadoLegislativo:{...LEGADO_LEGISLATIVO_INICIAL,bandeiras:[lei.id]}};
const resumo=construirLegadoLegislativo(state);
if(resumo.vigentes!==1||resumo.entradas.length!==1)throw new Error('Lei vigente não entrou no legado.');
if(resumo.indice<60)throw new Error(`Índice de legado muito baixo para cenário positivo: ${resumo.indice}`);
if(resumo.programasDerivados!==1||resumo.taxaRegulacao!==100)throw new Error('Integração programa/regulamentação falhou.');
const monthly=processarLegadoLegislativoMensal({legado:{...LEGADO_LEGISLATIVO_INICIAL,bandeiras:[lei.id]},state});
if(monthly.legado.indice!==resumo.indice||monthly.legado.ultimaAvaliacaoTurno!==8)throw new Error('Processamento mensal do legado falhou.');
let flags={...LEGADO_LEGISLATIVO_INICIAL};
for(const id of ['a','b','c']){const r=alternarBandeiraLegado(flags,id,true);if(!r.ok)throw new Error('Não foi possível adicionar bandeira.');flags=r.legado;}
if(alternarBandeiraLegado(flags,'d',true).ok)throw new Error('Limite de três bandeiras não foi respeitado.');

const store=read('src/store/useGameStore.js');
for(const marker of ['legadoLegislativo','alternarBandeiraLegislativa','processarLegadoLegislativo','obterResumoLegadoLegislativo'])if(!store.includes(marker))throw new Error(`Store sem ${marker}`);
const congress=read('src/components/Congress.jsx');
if(!congress.includes('Legado Legislativo')||!congress.includes('LegislativeLegacy'))throw new Error('Congresso sem aba de legado.');
const ui=read('src/components/LegislativeLegacy.jsx');
for(const marker of ['Índice de legado','Bandeiras legislativas da Presidência','Jornada da lei','Pegada legislativa do mandato','Arquivo legislativo'])if(!ui.includes(marker))throw new Error(`UI sem marcador ${marker}`);
const save=read('src/services/saveService.js');
if(!save.includes("'legadoLegislativo'"))throw new Error('Legado não persistido no save.');
const election=read('src/game/electionEngine.js');
if(!election.includes('legadoLegislativo'))throw new Error('Legado não conversa com eleição.');
const report=read('src/components/TurnTransitionModal.jsx');
if(!report.includes('Legado legislativo'))throw new Error('Relatório mensal sem legado legislativo.');

console.log(JSON.stringify({status:'ok',fase:'4.9.6.7',lei:lei.id,indice:resumo.indice,score:resumo.entradas[0].score,tier:resumo.entradas[0].tier.label,marcos:monthly.novosMarcos.length},null,2));
