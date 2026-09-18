import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed } from '../src/data/seed/leis.js';
import { atoresCongressoSeed } from '../src/data/seed/atoresCongresso.js';
import { criarProposta, processarCongressoTurno } from '../src/game/congressEngine.js';
import { deliberarEmenda } from '../src/game/amendmentEngine.js';
import { gerarDispositivosVeto, resumirVetoParcial, calcularProjecaoDerrubadaVeto, simularAnaliseVeto } from '../src/game/vetoEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const partidos=[
  {id:'esq',sigla:'PPG',cadeiras:110,apoio:80},
  {id:'centro',sigla:'MOC',cadeiras:220,apoio:45},
  {id:'dir',sigla:'LIB',cadeiras:130,apoio:18},
  {id:'ind',sigla:'IND',cadeiras:53,apoio:52},
];

const lei=leisSeed.find(l=>l.id==='fundo_investimento')||leisSeed[0];
let proposta=criarProposta({lei,turno:1,atores:atoresCongressoSeed,partidos,origem:'congresso',autor:atoresCongressoSeed[0]});
const emenda=proposta.emendas.find(e=>e.status==='pendente');
if(emenda){
  const r=deliberarEmenda({proposta,lei,emendaId:emenda.id,decisao:'aceitar',turno:1});
  if(!r.ok) throw new Error('Falha ao preparar texto negociado para teste de veto.');
  proposta=r.proposta;
}
proposta.status='aguardando_sancao';
proposta.fase='sancao';

const dispositivos=gerarDispositivosVeto(proposta,lei);
if(dispositivos.length<2) throw new Error('Veto parcial sem dispositivos suficientes.');
if(dispositivos.some(d=>!d.id||!d.titulo||!(d.peso>0))) throw new Error('Dispositivo de veto incompleto.');
const parcial=resumirVetoParcial(proposta,lei,[dispositivos[0].id]);
if(!(parcial.fatorRetido>0.5&&parcial.fatorRetido<1)) throw new Error('Fator retido do veto parcial inválido.');

const vetoParcial={...proposta,status:'veto_congresso',fase:'veto',vetoPresidencial:{tipo:'parcial',turno:1,fatorRetido:parcial.fatorRetido,pesoVetado:parcial.pesoVetado,dispositivos:parcial.escolhidos,defesaBonus:0}};
const proj=calcularProjecaoDerrubadaVeto({proposta:vetoParcial,lei,partidos,congresso:{poder:45}});
if(!proj.camara?.necessario||!proj.senado?.necessario||!['derrubada','manutencao','disputado'].includes(proj.tendencia)) throw new Error('Projeção de derrubada incompleta.');
const defended={...vetoParcial,vetoPresidencial:{...vetoParcial.vetoPresidencial,defesaBonus:24}};
const projDefendida=calcularProjecaoDerrubadaVeto({proposta:defended,lei,partidos,congresso:{poder:45}});
if(projDefendida.camara.projetado>=proj.camara.projetado) throw new Error('Articulação pela manutenção não reduziu a projeção de derrubada.');
const sim=simularAnaliseVeto({proposta:vetoParcial,lei,partidos,congresso:{poder:45},random:()=>.5});
if(typeof sim.derrubado!=='boolean'||sim.necessarioCamara!==257||sim.necessarioSenado!==41) throw new Error('Simulação do veto inválida.');

const processed=processarCongressoTurno({votacoes:[vetoParcial],leis:[lei],partidos,atores:atoresCongressoSeed,congresso:{poder:45,poderMax:100,riscoEscandalo:0,vitorias:0,derrotas:0},turno:2});
if(!['veto_derrubado','veto_mantido'].includes(processed.votacoes[0].status)) throw new Error(`Veto não foi deliberado na virada: ${processed.votacoes[0].status}`);
if(!processed.votacoes[0].resultadoVeto) throw new Error('Resultado da sessão conjunta não foi armazenado.');

const store=read('src/store/useGameStore.js');
for(const marker of ['decidirSancaoProjeto','articularManutencaoVeto','aplicarResultadosVetosCongresso','veto_congresso','sancionada_veto_mantido']){
  if(!store.includes(marker)) throw new Error(`Store sem ${marker}`);
}
const congress=read('src/components/Congress.jsx');
for(const marker of ['Sanção e veto presidencial','Veto parcial','Veto total','Vetos sob análise do Congresso','Articular manutenção']){
  if(!congress.includes(marker)) throw new Error(`UI sem marcador 4.9.6.4: ${marker}`);
}

console.log(JSON.stringify({status:'ok',fase:'4.9.6.4',lei:lei.id,dispositivos:dispositivos.length,pesoVetado:parcial.pesoVetado,fatorRetido:parcial.fatorRetido,projecao:proj.tendencia,resultadoProcessado:processed.votacoes[0].status},null,2));
