import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { partidosSeed } from '../src/data/seed/partidos.js';
import { criarEstadoEleitoralInicial, executarCaptacao } from '../src/game/electionEngine.js';
import {
  sincronizarPartidoEleitoral,
  ajustarDistribuicaoFundo,
  decidirCandidaturaEstadual,
  finalizarConvencaoPartidaria,
  aplicarEfeitoMaquinaEleitoral,
} from '../src/game/partyElectionEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');

const party=partidosSeed.find(p=>p.id==='esq');
const estados=party.diretorios.map((d,i)=>({
  uf:d.uf,nome:d.nomeEstado,regiao:d.regiao,eleitoradoPeso:Math.max(1,Math.round((d.delegados||4)/2)),
  governador:{nome:`Governador ${d.uf}`,partidoId:i%7===0?'esq':'centro',popularidade:55+(i%9),relacao:50},
}));
let eleicao=criarEstadoEleitoralInicial({perfil:{partidoId:'esq',ufOrigem:'SP'},estados});
const sistema={aliancas:[{id:'fed_esq_ind',tipo:'federacao',partidos:['esq','ind'],status:'ativa',inicioTurno:39}]};
let pe=sincronizarPartidoEleitoral({eleicao,partido:party,sistemaPartidario:sistema,estados,turno:40});
if(pe.delegados.porDiretorio.length!==27)throw new Error('Convenção não usa os 27 diretórios.');
if(pe.delegados.total<=100||pe.delegados.apoioPct<=0)throw new Error('Mapa real de delegados inválido.');
if(pe.alas.length!==3)throw new Error('Alas partidárias não chegaram à convenção.');
if(pe.aliancas.length!==1||pe.aliancas[0].tipo!=='federacao')throw new Error('Federação ativa não chegou ao ecossistema eleitoral.');
if(pe.candidaturasEstaduais.length!==27)throw new Error('Mapa de candidaturas estaduais incompleto.');
const sum=Object.values(pe.fundo.distribuicao).reduce((a,b)=>a+b,0);
if(sum!==100)throw new Error(`Distribuição do fundo não soma 100: ${sum}`);

const oldPres=pe.fundo.distribuicao.presidencia;
const fund=ajustarDistribuicaoFundo({partidoEleitoral:pe,categoria:'presidencia',delta:5,turno:40});
if(!fund.ok||fund.partidoEleitoral.fundo.distribuicao.presidencia!==oldPres+5)throw new Error('Redistribuição do fundo falhou.');
if(Object.values(fund.partidoEleitoral.fundo.distribuicao).reduce((a,b)=>a+b,0)!==100)throw new Error('Redistribuição quebrou o total de 100%.');
pe=fund.partidoEleitoral;

const local=decidirCandidaturaEstadual({partidoEleitoral:pe,partido:party,sistemaPartidario:sistema,uf:'SP',estrategia:'homologar_local',capitalPolitico:50,turno:40});
if(!local.ok||local.item.status!=='homologada'||local.capitalPolitico!==50)throw new Error('Homologação local falhou.');
const alliance=decidirCandidaturaEstadual({partidoEleitoral:local.partidoEleitoral,partido:local.partido,sistemaPartidario:sistema,uf:'MG',estrategia:'compor_alianca',capitalPolitico:50,turno:40});
if(!alliance.ok||alliance.item.status!=='composicao'||alliance.capitalPolitico!==49)throw new Error('Composição estadual com aliado falhou.');
const imposed=decidirCandidaturaEstadual({partidoEleitoral:alliance.partidoEleitoral,partido:alliance.partido,sistemaPartidario:sistema,uf:'RJ',estrategia:'impor_nacional',capitalPolitico:49,turno:40});
if(!imposed.ok||imposed.item.status!=='imposta'||imposed.capitalPolitico!==47)throw new Error('Imposição nacional de candidatura falhou.');

pe=sincronizarPartidoEleitoral({eleicao:{...eleicao,partidoEleitoral:imposed.partidoEleitoral},partido:imposed.partido,sistemaPartidario:sistema,estados,turno:40});
const conv=finalizarConvencaoPartidaria({eleicao:{...eleicao,partidoEleitoral:pe},partidoEleitoral:pe,partido:imposed.partido,turno:40});
if(!conv.ok)throw new Error(`Convenção deveria ser homologável no cenário de teste: ${conv.motivo}`);
if(!conv.eleicao.convencao.oficializado||!conv.eleicao.partidoEleitoral.convencao.homologada)throw new Error('Homologação não persistiu nos dois estados eleitorais.');
if(conv.eleicao.recursos.fefcProjetado!==conv.partidoEleitoral.fundo.valores.presidencia)throw new Error('Cota presidencial não veio da distribuição do fundo.');

const beforeRecognition=conv.eleicao.reconhecimento;
const boosted=aplicarEfeitoMaquinaEleitoral(conv.eleicao);
if(boosted.reconhecimento===beforeRecognition&&Math.round(pe.maquinaEleitoral)!==50)throw new Error('Máquina partidária não impactou a campanha.');

const fundRelease=executarCaptacao(conv.eleicao,'fundo_eleitoral',{dataAtual:'2026-08-01',fefcCota:conv.eleicao.recursos.fefcProjetado});
if(!fundRelease.ok||fundRelease.ganho!==conv.eleicao.recursos.fefcProjetado)throw new Error('Liberação do FEFC não respeitou cota definida pelo partido.');
const duplicate=executarCaptacao(fundRelease.eleicao,'fundo_eleitoral',{dataAtual:'2026-08-01',fefcCota:conv.eleicao.recursos.fefcProjetado});
if(duplicate.ok)throw new Error('FEFC pode ser captado mais de uma vez.');

const store=read('src/store/useGameStore.js');
for(const marker of ['ajustarFundoPartidarioEleitoral','decidirCandidaturaPartidariaEstadual','finalizarConvencaoPartidaria','sincronizarPartidoEleitoral'])if(!store.includes(marker))throw new Error(`Store sem ${marker}.`);
const ui=read('src/components/ElectionCenter.jsx');
for(const marker of ['A candidatura precisa vencer o próprio partido','Fundo & recursos','Candidaturas estaduais','Impor nome nacional'])if(!ui.includes(marker))throw new Error(`Comando Eleitoral sem ${marker}.`);

console.log(JSON.stringify({status:'ok',fase:'4.9.7.5',delegados:pe.delegados.total,apoio:pe.delegados.apoioPct,maquina:pe.maquinaEleitoral,fundo:pe.fundo.totalProjetado,cotaPresidencia:conv.eleicao.recursos.fefcProjetado,candidaturas:pe.candidaturasEstaduais.length,federacoes:pe.aliancas.length},null,2));
