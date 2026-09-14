export const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));

export const MANDATOS_ESTATAIS = {
  rentabilidade:{id:'rentabilidade',nome:'Rentabilidade',descricao:'Prioriza caixa, retorno e eficiência.',delta:{eficiencia:2,coberturaSocial:-1,exposicaoPolitica:-1}},
  equilibrio:{id:'equilibrio',nome:'Equilíbrio',descricao:'Combina retorno, investimento e função pública.',delta:{governanca:1}},
  universalizacao:{id:'universalizacao',nome:'Universalização',descricao:'Expande cobertura mesmo com menor retorno.',delta:{coberturaSocial:3,eficiencia:-1,exposicaoPolitica:1}},
  desenvolvimento:{id:'desenvolvimento',nome:'Desenvolvimento',descricao:'Usa a empresa como vetor de investimento e política industrial.',delta:{capacidadeInvestimento:2,valorEstrategico:2,exposicaoPolitica:2}},
  soberania:{id:'soberania',nome:'Soberania estratégica',descricao:'Privilegia autonomia tecnológica e segurança nacional.',delta:{valorEstrategico:3,governanca:1,exposicaoPolitica:1}},
  social:{id:'social',nome:'Função social',descricao:'Foca acesso, inclusão e serviço público.',delta:{coberturaSocial:4,eficiencia:-1,exposicaoPolitica:1}},
  integracao:{id:'integracao',nome:'Integração nacional',descricao:'Conecta regiões e cadeias produtivas.',delta:{coberturaSocial:2,valorEstrategico:2}},
  publico:{id:'publico',nome:'Serviço público independente',descricao:'Protege missão pública e governança editorial.',delta:{governanca:3,exposicaoPolitica:-2}},
};

export function aplicarMandato(estatal,mandatoId){
  const m=MANDATOS_ESTATAIS[mandatoId]||MANDATOS_ESTATAIS.equilibrio;
  const next={...estatal,mandato:mandatoId};
  Object.entries(m.delta||{}).forEach(([k,v])=>{next[k]=clamp((next[k]||50)+v)});
  return next;
}

export function aplicarDividendos(estatal,politica){
  const next={...estatal,dividendos:politica};
  if(politica==='alto'){next.capacidadeInvestimento=clamp(next.capacidadeInvestimento-3);next.exposicaoPolitica=clamp(next.exposicaoPolitica+1)}
  if(politica==='reinvestir'){next.capacidadeInvestimento=clamp(next.capacidadeInvestimento+3);next.eficiencia=clamp(next.eficiencia+1)}
  return next;
}

export function efeitoFiscalDividendos(estatal,politica){
  const base=Math.max(0,estatal.lucroAnual||0)/12;
  if(politica==='alto')return Math.round(base*.65);
  if(politica==='reinvestir')return Math.round(base*.12);
  return Math.round(base*.35);
}

export function riscoEstatal(estatal){
  return clamp((100-(estatal.governanca||50))*.45+(estatal.exposicaoPolitica||50)*.25+(estatal.pressaoSindical||50)*.12+(estatal.endividamento||30)*.18);
}
