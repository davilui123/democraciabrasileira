import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leisSeed } from '../src/data/seed/leis.js';
import { REGULAMENTACAO_INICIAL, sincronizarRegulamentacoes, simularRegulamentacao, concluirRegulamentacao, processarRegulamentacaoMensal, calcularCapacidadeRegulatoria } from '../src/game/regulationEngine.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const lei=leisSeed.find(l=>l.regulamentacao?.necessaria&&l.categoria==='infraestrutura')||leisSeed.find(l=>l.regulamentacao?.necessaria);
if(!lei)throw new Error('Nenhuma lei regulamentável encontrada.');
const proposta={id:'prop_reg_qa',leiId:lei.id,titulo:lei.titulo,status:'sancionada',versaoTexto:2,textoFinal:{versao:2,vigencia:'integral'}};
let r=sincronizarRegulamentacoes({regulamentacao:{...REGULAMENTACAO_INICIAL},votacoes:[proposta],leis:[lei],turno:4});
if(r.novos.length!==1||r.regulamentacao.processos.length!==1)throw new Error('Regulamentação não entrou na fila.');
const processo=r.novos[0];
const state={turno:4,capitalPolitico:80,nomeacoes:[{cargoId:'m_casacivil'},{cargoId:'m_justica'},{cargoId:'m_fazenda'},{cargoId:'m_transp'}],estados:[{uf:'SP',relacaoPlanalto:60},{uf:'MG',relacaoPlanalto:54},{uf:'RJ',relacaoPlanalto:48}]};
if(calcularCapacidadeRegulatoria(state)!==4)throw new Error('Capacidade normativa não reconhece gabinete.');
r.regulamentacao.capacidadeMax=4;r.regulamentacao.capacidadeRestante=4;
const config={programaNome:'QA Implementa Brasil',ritmo:'equilibrado',escala:'estruturante',territorio:'estados',ufs:['SP','MG'],modeloExecucao:'federativo',fonte:'cofinanciamento',governanca:'reforcada',prioridade:'alta'};
const sim=simularRegulamentacao({processo,lei,config,state});
if(!(sim.nota>=0&&sim.nota<=100)||sim.custoMensal<=0||sim.duracao<9)throw new Error('Simulação regulatória inválida.');
const done=concluirRegulamentacao({regulamentacao:r.regulamentacao,processoId:processo.id,lei,config,state});
if(!done.ok||done.programa.status!=='implantacao'||done.programa.leiOrigemId!==lei.id)throw new Error('Programa derivado da lei não foi criado corretamente.');
if(done.programa.ufs.length!==2||done.programa.modeloExecucao!=='federativo')throw new Error('Escolhas territoriais/execução não chegaram ao programa.');
if(done.regulamentacao.capacidadeRestante>=4)throw new Error('Capacidade normativa não foi consumida.');

// Inércia: outra lei ultrapassa o prazo e deve produzir custo político.
const lei2=leisSeed.find(l=>l.id!==lei.id&&l.regulamentacao?.necessaria)||lei;
const prop2={id:'prop_reg_atraso',leiId:lei2.id,titulo:lei2.titulo,status:'sancionada',textoFinal:{versao:1,vigencia:'integral'}};
let q=sincronizarRegulamentacoes({regulamentacao:{...REGULAMENTACAO_INICIAL},votacoes:[prop2],leis:[lei2],turno:1}).regulamentacao;
q.processos=q.processos.map(p=>({...p,prazoNoTurno:2,riscoInercia:70}));
const monthly=processarRegulamentacaoMensal({regulamentacao:q,state:{...state,turno:4},leis:[lei2],votacoes:[prop2]});
if(!monthly.eventos.length||monthly.perdaCapital<1)throw new Error('Atraso regulatório não gerou consequência.');

const store=read('src/store/useGameStore.js');
for(const marker of ['regulamentacaoLeis','regulamentarLei','processarRegulamentacoesLeis','sincronizarRegulamentacoesLeis'])if(!store.includes(marker))throw new Error(`Store sem ${marker}`);
const ui=read('src/components/GovernmentPrograms.jsx');
for(const marker of ['Regulamentação','Capacidade normativa','Fila de implementação','A lei só vale politicamente quando entrega'])if(!ui.includes(marker))throw new Error(`Programas sem marcador ${marker}`);
const modal=read('src/components/RegulationModal.jsx');
for(const marker of ['Qualidade regulatória','Onde a lei vira política pública primeiro?','Publicar regulamentação','Capacidade disponível'])if(!modal.includes(marker))throw new Error(`Modal sem ${marker}`);
const save=read('src/services/saveService.js');
if(!save.includes("'regulamentacaoLeis'"))throw new Error('Regulamentação não persistida no save.');
const news=read('src/components/NewsCenter.jsx');
if(!news.includes('regulamentacoesPendentes'))throw new Error('Central de Notícias não recebeu pendências regulatórias.');

console.log(JSON.stringify({status:'ok',fase:'4.9.6.6',lei:lei.id,programa:done.programa.nome,nota:sim.nota,custoMensal:sim.custoMensal,capacidadeRestante:done.regulamentacao.capacidadeRestante,atraso:{eventos:monthly.eventos.length,perdaCapital:monthly.perdaCapital}},null,2));
