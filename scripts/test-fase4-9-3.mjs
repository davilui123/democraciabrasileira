import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pressoesGeopoliticasSeed } from '../src/data/seed/pressoesGeopoliticas.js';
import { pressoesGeopoliticasExtrasSeed } from '../src/data/seed/pressoesGeopoliticasExtras.js';
import { eventosFederativosSeed } from '../src/data/seed/eventosFederativos.js';
import { eventosFederativosExtrasSeed } from '../src/data/seed/eventosFederativosExtras.js';
import { aplicarVariacaoMensalCapital, custoPoliticoEfetivo } from '../src/game/governabilityEngine.js';
import { gerarCascataSistemica } from '../src/game/systemicCascadeEngine.js';
import { eventosInstitucionaisAutonomos, processInstitutionalAutonomy } from '../src/game/institutionalAutonomyEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const totalGeo=pressoesGeopoliticasSeed.length+pressoesGeopoliticasExtrasSeed.length;
const totalFed=eventosFederativosSeed.length+eventosFederativosExtrasSeed.length;
if(totalGeo<24) throw new Error(`Repertório geopolítico pequeno: ${totalGeo}`);
if(totalFed<39) throw new Error(`Repertório federativo pequeno: ${totalFed}`);
if(eventosInstitucionaisAutonomos.length<12) throw new Error('Autonomia institucional precisa de pelo menos 12 situações.');

const good={turno:5,capitalPolitico:45,popularidade:{geral:66},congresso:{poder:72},climaGoverno:74,economia:{resultadoPrimario:12000},oposicao:{forca:30},institucional:{tensaoInstitucional:20},nomeacoes:[{cargoId:'m_casacivil'},{cargoId:'m_fazenda'},{cargoId:'m_justica'},{cargoId:'m_exteriores'}],cargos:[]};
const bad={turno:5,capitalPolitico:45,popularidade:{geral:28},congresso:{poder:22},climaGoverno:25,economia:{resultadoPrimario:-24000},oposicao:{forca:78},institucional:{tensaoInstitucional:72},nomeacoes:[],cargos:[]};
const g=aplicarVariacaoMensalCapital(good);
const b=aplicarVariacaoMensalCapital(bad);
if(g.registro.delta<=0) throw new Error('Bom cenário não recupera capital político.');
if(b.registro.delta>=0) throw new Error('Mau cenário não corrói capital político.');
if(custoPoliticoEfetivo(5,{capitalPolitico:10,climaGoverno:20,congresso:{poder:20}},'grande')<=5) throw new Error('Baixa governabilidade não encarece ação grande.');

const cascade=gerarCascataSistemica({
  turno:6,capitalPolitico:50,congresso:{poder:55},economia:{inflacao:5,resultadoPrimario:0},mundo:{tensaoGlobal:40},
  geopolitica:{historicoPressoes:[{baseId:'us_tarifaco',status:'respondida',respostaId:'retaliar'}]},
  historicoCascatas:[],consequenciasPendentes:[],programas:[],nomeacoes:[],estatais:[],
});
if(cascade?.baseId!=='tarifaco_agro_exportacao') throw new Error('Tarifaço não gerou cascata agro/exportação.');
if(!cascade.efeitos?.comercio?.exportacoes?.agro || !cascade.efeitos?.estados?.ufs?.includes('MT')) throw new Error('Cascata comercial não chegou a setor e estados.');

const inst=processInstitutionalAutonomy({
  turno:6,economia:{resultadoPrimario:-22000,inflacao:7,riscoPais:300},
  programas:[{status:'ativo'},{status:'ativo'},{status:'ativo'}],estatais:[],projetosEspeciais:[],parceriasEmpresariais:[],
  institucional:{tensaoInstitucional:30,movimentosAutonomos:[],cooldownsAutonomos:{}},
},()=>0);
if(!inst.evento || !['TCU','BC'].includes(inst.evento.instituicao)) throw new Error('Cenário elegível não disparou movimentação institucional autônoma.');

const app=read('src/App.jsx');
const store=read('src/store/useGameStore.js');
const modal=read('src/components/PoliticalCapitalModal.jsx');
const institutions=read('src/components/Institutions.jsx');
const save=read('src/services/saveService.js');
for(const marker of ['Capital político','PoliticalCapitalModal','showCapital']) if(!app.includes(marker)) throw new Error(`Capital político não está globalmente visível: ${marker}`);
for(const marker of ['processarAutonomiaInstitucional','processarCascatasSistemicas','processarGovernabilidadeMensal','custoPoliticoEfetivo']) if(!store.includes(marker)) throw new Error(`Store sem integração 4.9.3: ${marker}`);
for(const marker of ['Como recuperar CP','Como perder CP','Balanço do último mês']) if(!modal.includes(marker)) throw new Error(`Dossiê de governabilidade incompleto: ${marker}`);
if(!institutions.includes('Movimentação institucional autônoma')) throw new Error('Tela Instituições não mostra movimentos autônomos.');
if(!save.includes("'governabilidade', 'historicoCascatas'")) throw new Error('Novos estados não persistem no save.');
for(const marker of ['ultimaInteracaoPlanaltoTurno','Capital político insuficiente: esta articulação exige','capitalPolitico:clamp(current.capitalPolitico-custoPolitico)']) if(!store.includes(marker)) throw new Error(`Interação com governador ainda permite farm de CP: ${marker}`);
const cascadeSource=read('src/game/systemicCascadeEngine.js');
const cascadeIds=[...cascadeSource.matchAll(/consequence\('([^']+)'/g)].map(m=>m[1]);
if(cascadeIds.length<15) throw new Error(`Poucas rotas sistêmicas conectadas: ${cascadeIds.length}`);

console.log(JSON.stringify({
  status:'ok',fase:'4.9.3',
  capitalPolitico:{cenarioBom:g.registro.delta,cenarioRuim:b.registro.delta,custoCrise:custoPoliticoEfetivo(5,{capitalPolitico:10,climaGoverno:20,congresso:{poder:20}},'grande')},
  repertorio:{geopolitica:totalGeo,federacao:totalFed,institucional:eventosInstitucionaisAutonomos.length,cascatas:cascadeIds.length},
  cascata:cascade.baseId,instituicao:inst.evento.instituicao,
},null,2));
