import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed } from '../src/data/seed/leis.js';
import { atoresCongressoSeed } from '../src/data/seed/atoresCongresso.js';
import { criarProposta, calcularProjecao } from '../src/game/congressEngine.js';
import { gerarEmendasIniciais, deliberarEmenda, incorporarAjusteGoverno, emendasResumo, consolidarTextoFinal } from '../src/game/amendmentEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const partidos=[
  {id:'esq',sigla:'PPG',cadeiras:110,apoio:80},
  {id:'centro',sigla:'MOC',cadeiras:220,apoio:48},
  {id:'dir',sigla:'LIB',cadeiras:130,apoio:22},
  {id:'ind',sigla:'IND',cadeiras:53,apoio:52},
];

let minEmendas=99,maxEmendas=0;
for(const lei of leisSeed){
  const emendas=gerarEmendasIniciais({lei,atores:atoresCongressoSeed,turno:1,origemProjeto:'executivo'});
  minEmendas=Math.min(minEmendas,emendas.length); maxEmendas=Math.max(maxEmendas,emendas.length);
  if(emendas.length<2) throw new Error(`Poucas emendas para ${lei.id}: ${emendas.length}`);
  if(emendas.some(e=>!e.autor?.nome||!e.efeito||!e.custo)) throw new Error(`Emenda incompleta em ${lei.id}`);
}

const lei=leisSeed.find(l=>l.id==='fundo_investimento') || leisSeed[0];
let proposta=criarProposta({lei,turno:1,atores:atoresCongressoSeed,partidos,origem:'executivo'});
if((proposta.emendas||[]).length<3) throw new Error('Proposta piloto não nasceu com mesa de emendas suficiente.');
if(proposta.versaoTexto!==1||proposta.textoBase!=='Texto original') throw new Error('Versionamento inicial do texto incorreto.');
const proj0=calcularProjecao(proposta,lei,partidos).sim;
const emenda=proposta.emendas[0];
const aceita=deliberarEmenda({proposta,lei,emendaId:emenda.id,decisao:'aceitar',turno:1});
if(!aceita.ok||aceita.proposta.versaoTexto!==2) throw new Error('Aceitação não criou nova versão do texto.');
if(!aceita.proposta.alteracoesTexto?.length) throw new Error('Histórico de alterações não foi criado.');
if(aceita.proposta.emendas.find(e=>e.id===emenda.id)?.status!=='aceita') throw new Error('Status da emenda aceita incorreto.');
const proj1=calcularProjecao(aceita.proposta,lei,partidos).sim;
if(proj1===proj0) throw new Error('Emenda aceita não alterou projeção de votos.');
const final=consolidarTextoFinal(aceita.proposta,lei);
if(final.versao!==2||!final.alteracoes.length) throw new Error('Consolidação do texto final falhou.');

const pendente=aceita.proposta.emendas.find(e=>e.status==='pendente');
if(!pendente) throw new Error('Sem emenda pendente para testar contraproposta.');
const counter=deliberarEmenda({proposta:aceita.proposta,lei,emendaId:pendente.id,decisao:'contrapropor',turno:2});
if(!counter.ok||counter.proposta.versaoTexto!==3) throw new Error('Contraproposta não avançou versão do texto.');
if(counter.proposta.emendas.find(e=>e.id===pendente.id)?.status!=='aceita_negociada') throw new Error('Contraproposta sem status negociado.');

const gov=incorporarAjusteGoverno({proposta:counter.proposta,lei,atores:atoresCongressoSeed,tipoId:'governanca',turno:2});
if(!gov.ok) throw new Error(`Ajuste da base falhou: ${gov.motivo}`);
if(!gov.proposta.emendas.some(e=>e.status==='incorporada_governo')) throw new Error('Ajuste do governo não foi registrado como emenda.');
const summary=emendasResumo(gov.proposta);
if(summary.aceitas<3||summary.versao<4) throw new Error('Resumo de emendas não reflete negociação acumulada.');

const congress=read('src/components/Congress.jsx');
for(const marker of ['Mesa de negociação','Emenda da base do governo','Histórico do texto','Contraproposta fechada']){
  if(!congress.includes(marker)) throw new Error(`UI sem marcador 4.9.6.3: ${marker}`);
}
const store=read('src/store/useGameStore.js');
for(const marker of ['deliberarEmendaProjeto','incorporarAjusteGovernoProjeto','consolidarTextoFinal','modificadoresEfeitos']){
  if(!store.includes(marker)) throw new Error(`Store sem ${marker}`);
}

console.log(JSON.stringify({status:'ok',fase:'4.9.6.3',catalogo:leisSeed.length,emendasPorProjeto:[minEmendas,maxEmendas],leiTeste:lei.id,votosAntes:proj0,votosDepois:proj1,versaoFinal:gov.proposta.versaoTexto,emendasIncorporadas:summary.aceitas,impactoFiscal:summary.impactoFiscal},null,2));
