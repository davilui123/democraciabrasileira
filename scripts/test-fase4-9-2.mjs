import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GEOPOLITICA_INICIAL, gerarPressaoGeopolitica, resolverPressaoGeopolitica, expirarPressoesGeopoliticas } from '../src/game/geopoliticsEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const paises=[
  {id:'us',nome:'Estados Unidos',relacao:60},
  {id:'cn',nome:'China',relacao:75},
  {id:'ru',nome:'Rússia',relacao:70,emGuerra:true},
  {id:'de',nome:'Alemanha',relacao:65},
  {id:'fr',nome:'França',relacao:50},
  {id:'ar',nome:'Argentina',relacao:60},
  {id:'uy',nome:'Uruguai',relacao:60},
  {id:'py',nome:'Paraguai',relacao:60},
  {id:'ae',nome:'Emirados Árabes Unidos',relacao:55},
  {id:'in',nome:'Índia',relacao:65},
  {id:'jp',nome:'Japão',relacao:60},
  {id:'kr',nome:'Coreia do Sul',relacao:60},
];
const mundo={tensaoGlobal:45,liderancaAmbiental:40,softPowerBrasil:50};
const economia={crescimentoPib:.5,confiancaMercado:55};

const generated=gerarPressaoGeopolitica({geopolitica:{...GEOPOLITICA_INICIAL},paises,mundo,economia,turno:2,rng:()=>0});
if(!generated.pressao) throw new Error('Nenhuma pressão geopolítica foi gerada no cenário determinístico.');
if(generated.pressao.baseId!=='cn_terras_raras') throw new Error(`Pressão prioritária inesperada: ${generated.pressao.baseId}`);
if(generated.pressao.opcoes.length<3) throw new Error('Pressão não oferece escolhas presidenciais suficientes.');

const resolved=resolverPressaoGeopolitica(generated.geopolitica,generated.pressao.id,'consorcio',2);
if(!resolved.ok || resolved.pressao.status!=='respondida') throw new Error('Resposta à pressão diplomática não foi registrada.');
if(!resolved.opcao.efeitos?.relacoes?.cn) throw new Error('Resposta geopolítica não carrega efeito bilateral.');

const expired=expirarPressoesGeopoliticas(generated.geopolitica,4);
if(expired.expiradas.length!==1 || expired.expiradas[0].pressao.status!=='ignorada') throw new Error('Pressão ignorada não amadureceu em consequência.');

const geo=read('src/components/Geopolitics.jsx');
const news=read('src/components/NewsCenter.jsx');
const store=read('src/store/useGameStore.js');
const seed=read('src/data/seed/pressoesGeopoliticas.js');
for(const marker of ["['pressoes',Radio,'Pressões']",'Pressões sobre o Planalto','historicoPressoes']) if(!geo.includes(marker)) throw new Error(`UI geopolítica sem marcador: ${marker}`);
if(!news.includes('pressoesDiplomaticas.map') || !news.includes('responderPressaoDiplomatica')) throw new Error('Central de Notícias não recebe decisões geopolíticas.');
if(!store.includes('gerarPressaoGeopolitica') || !store.includes('responderPressaoDiplomatica')) throw new Error('Store não integrou movimentação internacional autônoma.');
for(const marker of ['ru_apoio_guerra','cn_terras_raras','us_tarifaco','de_amazonia','ar_mercosul']) if(!seed.includes(marker)) throw new Error(`Cenário internacional ausente: ${marker}`);

console.log(JSON.stringify({status:'ok',fase:'4.9.2',pressaoGerada:generated.pressao.baseId,resposta:resolved.opcao.id,expiracao:expired.expiradas[0].pressao.status,cenariosMinimos:5,centralNoticias:true},null,2));
