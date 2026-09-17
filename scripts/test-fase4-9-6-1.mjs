import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed, categoriasLeis, leisMetadata } from '../src/data/seed/leis.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

if(leisSeed.length!==156) throw new Error(`Catálogo deveria ter 156 leis, encontrou ${leisSeed.length}`);
if(new Set(leisSeed.map(l=>l.id)).size!==leisSeed.length) throw new Error('Há IDs legislativos duplicados.');
if(categoriasLeis.filter(c=>c.id!=='todas').length!==13) throw new Error('Categorias legislativas incompletas.');

const dist=leisSeed.reduce((a,l)=>(a[l.categoria]=(a[l.categoria]||0)+1,a),{});
for(const [cat,count] of Object.entries(dist)) if(count!==12) throw new Error(`Categoria ${cat} deveria ter 12 leis, encontrou ${count}`);
if(leisMetadata.totalLeis!==156) throw new Error('Metadata do catálogo não acompanha a expansão.');

for(const lei of leisSeed){
  if(!Array.isArray(lei.cadeiaConsequencias)||lei.cadeiaConsequencias.length<4) throw new Error(`${lei.id} sem cadeia de consequências completa.`);
  if(!lei.riscosControle||['stf','tcu','federativo','implementacao'].some(k=>typeof lei.riscosControle[k]!=='number')) throw new Error(`${lei.id} sem matriz de riscos.`);
  if(!lei.regulamentacao||typeof lei.regulamentacao.necessaria!=='boolean') throw new Error(`${lei.id} sem desenho de regulamentação.`);
  if(!Array.isArray(lei.origensPermitidas)||!lei.origensPermitidas.includes('executivo')) throw new Error(`${lei.id} sem origens futuras de iniciativa.`);
  if(!Array.isArray(lei.atoresAfetados)||!lei.atoresAfetados.length) throw new Error(`${lei.id} sem atores afetados.`);
}

for(const id of ['reindustrializacao_verde','semana_quatro_dias','ifas_nacionais','reforma_policias','fertilizantes_nacionais','metro_trens','auditoria_algoritmica','emendas_transparentes','investimento_estrangeiro_estrategico']){
  if(!leisSeed.some(l=>l.id===id)) throw new Error(`Lei nova ausente: ${id}`);
}

for(const id of ['arcabouco_fiscal','igf','plataformas','licenciamento','armas','carbono','ia','semicondutores','minerais_criticos','fim_reeleicao','reforma_adm']){
  const lei=leisSeed.find(l=>l.id===id);
  if(!lei||lei.cadeiaConsequencias.some(x=>!x.titulo||!x.descricao)) throw new Error(`Lei legada não recebeu cadeia aprofundada: ${id}`);
}

const congress=read('src/components/Congress.jsx');
for(const marker of ['Depois da aprovação','Ver cadeia','Risco STF ≥ 60','Risco TCU ≥ 60','Exige regulamentação']) if(!congress.includes(marker)) throw new Error(`Banco de leis sem UI 4.9.6.1: ${marker}`);

const exp=read('src/data/seed/leisExpansao4961.js');
if(!exp.includes('leisExpansao4961')) throw new Error('Arquivo da expansão legislativa ausente/inválido.');

console.log(JSON.stringify({status:'ok',fase:'4.9.6.1',leis:leisSeed.length,categorias:Object.keys(dist).length,porCategoria:dist,regulamentaveis:leisSeed.filter(l=>l.regulamentacao?.necessaria).length,altoRiscoSTF:leisSeed.filter(l=>(l.riscosControle?.stf||0)>=60).length,altoRiscoTCU:leisSeed.filter(l=>(l.riscosControle?.tcu||0)>=60).length},null,2));
