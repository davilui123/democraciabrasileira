import { estadosSeed } from '../src/data/seed/estados.js';
import { midiasSeed } from '../src/data/seed/midias.js';
import { projetosEspeciaisSeed } from '../src/data/seed/projetosEspeciais.js';
import { FISCAL_INICIAL, registrarMovimentoFiscal, processarFiscalMensal } from '../src/game/fiscalEngine.js';
import { GRUPOS_INICIAIS, aplicarImpactoGrupos, calcularAprovacaoEstado } from '../src/game/opinionEngine.js';
import { impactoPost, gerarConviteMidia } from '../src/game/mediaEngine.js';

const assert=(c,m)=>{if(!c)throw new Error(m)};
const institucional={tensaoInstitucional:10};
const economiaBase={
  pib:10000000,crescimentoPib:.5,inflacao:4.5,dividaPublica:75,dividaValor:7500000,
  selic:13.75,dolar:5,riscoPais:250,confiancaMercado:50,desemprego:8.4,...FISCAL_INICIAL,
};

assert(estadosSeed.length===27,'Devem existir 27 UFs (26 estados + DF).');
assert(new Set(estadosSeed.map(e=>e.uf)).size===27,'UFs duplicadas.');
assert(new Set(estadosSeed.map(e=>e.governador?.nome)).size===27,'Governadores devem ser personagens distintos.');
for(const e of estadosSeed){
  assert(e.governador?.nome,`Governador ausente em ${e.uf}`);
  const soma=Object.values(e.composicao||{}).reduce((a,b)=>a+b,0);
  assert(Math.abs(soma-100)<.001,`Composição social de ${e.uf} soma ${soma}.`);
  assert(e.capitalImage===`/states/${e.uf}/capital.jpg`,`Asset de capital inconsistente em ${e.uf}`);
  assert(e.flagImage===`/states/${e.uf}/bandeira.png`,`Asset de bandeira inconsistente em ${e.uf}`);
}

assert(midiasSeed.length===4,'Devem existir quatro grandes grupos de mídia.');
for(const m of midiasSeed){
  assert((m.formatos||[]).length>=3,`Poucos formatos em ${m.nome}.`);
  assert((m.debates||[]).length>=2,`Formatos de debate ausentes em ${m.nome}.`);
  assert(m.perfil?.startsWith('@'),`Perfil social inválido em ${m.nome}.`);
}
assert(projetosEspeciaisSeed.length>=8,'Projetos Especiais insuficientes.');
assert(projetosEspeciaisSeed.every(p=>p.ganchoGeopolitica),'Todo projeto deve preparar uma conexão com a Geopolítica 4.3.');

const base=processarFiscalMensal(economiaBase,institucional,1).economia;
const custeio=processarFiscalMensal(registrarMovimentoFiscal(economiaBase,20000,'custeio'),institucional,1).economia;
const infra=processarFiscalMensal(registrarMovimentoFiscal(economiaBase,20000,'infraestrutura'),institucional,1).economia;
const humano=processarFiscalMensal(registrarMovimentoFiscal(economiaBase,20000,'humano'),institucional,1).economia;
assert(custeio.resultadoPrimario<base.resultadoPrimario,'Despesa adicional deveria piorar o primário.');
assert(custeio.dividaPublica>=base.dividaPublica,'Déficit não deveria reduzir a dívida/PIB imediatamente.');
assert(custeio.riscoPais>=base.riscoPais,'Piora fiscal deveria elevar ou preservar o risco-país.');
assert(infra.crescimentoPib>custeio.crescimentoPib,'Infraestrutura deve gerar mais crescimento que custeio puro.');
assert(humano.crescimentoPib>custeio.crescimentoPib,'Capital humano deve gerar mais crescimento que custeio puro.');
assert(Number.isFinite(infra.selic)&&infra.selic>=5,'Selic endógena inválida.');

const gruposPos=aplicarImpactoGrupos(GRUPOS_INICIAIS,{periferia:4,mercado:-3,agro:2});
const pe=estadosSeed.find(e=>e.uf==='PE');
const rs=estadosSeed.find(e=>e.uf==='RS');
assert(Math.abs(calcularAprovacaoEstado(pe,gruposPos)-calcularAprovacaoEstado(rs,gruposPos))>.1,'Composição estadual deveria gerar mapas políticos diferentes.');

const rede=impactoPost({texto:'Vamos ampliar universidades e educação pública, com responsabilidade fiscal.',popularidade:52});
assert(rede.alcance>1000000,'Publicação deveria gerar alcance relevante.');
assert(Object.keys(rede.grupos).length>0,'Publicação temática deveria impactar grupos.');
assert(gerarConviteMidia({turno:2,popularidade:50}),'Turno par deveria poder gerar convite de mídia.');
assert(gerarConviteMidia({turno:3,popularidade:50})===null,'Convites não devem aparecer todo mês.');

console.log(JSON.stringify({
  status:'ok',
  ufs:estadosSeed.length,
  governadores:new Set(estadosSeed.map(e=>e.governador.nome)).size,
  midias:midiasSeed.length,
  debates:midiasSeed.reduce((s,m)=>s+(m.debates?.length||0),0),
  projetos:projetosEspeciaisSeed.length,
  fiscal:{basePrimario:base.resultadoPrimario,custeioPrimario:custeio.resultadoPrimario,riscoBase:base.riscoPais,riscoCusteio:custeio.riscoPais,crescimentoCusteio:custeio.crescimentoPib,crescimentoInfra:infra.crescimentoPib,crescimentoHumano:humano.crescimentoPib,selicInfra:infra.selic},
  pulso:{alcance:rede.alcance,grupos:rede.grupos},
},null,2));
