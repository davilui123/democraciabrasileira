import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed } from '../src/data/seed/leis.js';
import { estadosSeed } from '../src/data/seed/estados.js';
import { atoresCongressoSeed } from '../src/data/seed/atoresCongresso.js';
import { oposicaoSeed } from '../src/data/seed/oposicao.js';
import { AGENDA_LEGISLATIVA_INICIAL, criarIniciativaLegislativaAutonoma } from '../src/game/legislativeAgendaEngine.js';
import { CONGRESSO_INICIAL, criarProposta, calcularProjecao, processarCongressoTurno } from '../src/game/congressEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const partidos=[
  {id:'esq',sigla:'PPG',cadeiras:110,apoio:80},
  {id:'centro',sigla:'MOC',cadeiras:220,apoio:30},
  {id:'dir',sigla:'LIB',cadeiras:130,apoio:10},
  {id:'ind',sigla:'IND',cadeiras:53,apoio:50},
];

for(const origem of ['oposicao','congresso','governadores']){
  const result=criarIniciativaLegislativaAutonoma({
    turno:2,leis:leisSeed,votacoes:[],leisAprovadas:[],atoresCongresso:atoresCongressoSeed,estados:estadosSeed,
    oposicao:{...oposicaoSeed,forca:55},partidos,perfilPresidencial:{partidoId:'esq'},agenda:{...AGENDA_LEGISLATIVA_INICIAL},
    origemForcada:origem,random:()=>0.05,
  });
  if(!result.ok) throw new Error(`Não gerou iniciativa de ${origem}: ${result.reason}`);
  if(result.origem!==origem||!result.lei||!result.autor) throw new Error(`Iniciativa ${origem} incompleta.`);
  if(origem==='governadores'&&!result.patrocinadores.length) throw new Error('Agenda dos governadores sem estados patrocinadores.');
}

const lei=leisSeed.find(l=>l.origensPermitidas?.includes('congresso')&&l.instrumento==='PL');
if(!lei) throw new Error('Nenhuma lei adequada para teste de agenda autônoma.');
const proposta=criarProposta({lei,turno:1,atores:atoresCongressoSeed,partidos,origem:'oposicao',autor:{id:'teste',nome:'Liderança Teste',cargo:'Oposição',partidoId:'dir'},patrocinadores:['LIB']});
const apoiar={...proposta,posicaoGoverno:'apoiar'};
const opor={...proposta,posicaoGoverno:'opor'};
const projApoiar=calcularProjecao(apoiar,lei,partidos).sim;
const projOpor=calcularProjecao(opor,lei,partidos).sim;
if(projApoiar<=projOpor) throw new Error('Posição do governo não altera a projeção na direção esperada.');

const pronta={...proposta,status:'votacao_hoje',fase:'plenario',pautaDesdeTurno:1};
const processed=processarCongressoTurno({votacoes:[pronta],leis:leisSeed,partidos,atores:atoresCongressoSeed,congresso:CONGRESSO_INICIAL,turno:2});
if(processed.votacoes[0].status==='votacao_hoje') throw new Error('Projeto autônomo ficou congelado na Ordem do Dia.');

const congress=read('src/components/Congress.jsx');
for(const marker of ['Agenda da Casa','Projetos que não nasceram no Planalto','Liberar base','Opor-se','Agenda legislativa autônoma']){
  if(!congress.includes(marker)) throw new Error(`UI do Congresso sem marcador 4.9.6.2: ${marker}`);
}
const news=read('src/components/NewsCenter.jsx');
if(!news.includes('Agenda própria')||!news.includes('responderAgendaLegislativa')) throw new Error('Central de Notícias não integrou agenda legislativa autônoma.');
const store=read('src/store/useGameStore.js');
for(const marker of ['definirPosicaoGovernoProjeto','criarIniciativaLegislativaAutonoma','agendaLegislativa']) if(!store.includes(marker)) throw new Error(`Store sem ${marker}`);

console.log(JSON.stringify({status:'ok',fase:'4.9.6.2',catalogo:leisSeed.length,fontes:['oposicao','congresso','governadores'],projecaoApoiar:projApoiar,projecaoOpor:projOpor,statusVotacaoAutonoma:processed.votacoes[0].status},null,2));
