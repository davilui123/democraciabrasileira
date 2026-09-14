export const GRUPOS_INICIAIS = {
  evangelicos:{id:'evangelicos',nome:'Evangélicos',aprovacao:49,peso:0.18,interesses:['família','segurança','religião','renda']},
  sindicalistas:{id:'sindicalistas',nome:'Sindicalistas',aprovacao:55,peso:0.10,interesses:['trabalho','salário','serviço público']},
  agro:{id:'agro',nome:'Agro',aprovacao:47,peso:0.12,interesses:['agro','crédito','logística','propriedade']},
  periferia:{id:'periferia',nome:'Periferia',aprovacao:58,peso:0.25,interesses:['renda','emprego','saúde','segurança','transporte']},
  mercado:{id:'mercado',nome:'Mercado',aprovacao:52,peso:0.11,interesses:['fiscal','juros','regulação','crescimento']},
  militares:{id:'militares',nome:'Militares',aprovacao:46,peso:0.08,interesses:['defesa','ordem','soberania']},
  universitarios:{id:'universitarios',nome:'Universitários',aprovacao:54,peso:0.16,interesses:['educação','ciência','direitos','clima']},
};
const clamp=(v,min=0,max=100)=>Math.min(max,Math.max(min,v));
export const aplicarImpactoGrupos=(grupos,impactos={})=>Object.fromEntries(Object.entries(grupos||GRUPOS_INICIAIS).map(([id,g])=>[id,{...g,aprovacao:clamp((g.aprovacao??50)+(impactos[id]||0))}]));
export const aprovacaoNacional=(grupos)=>{const vals=Object.values(grupos||GRUPOS_INICIAIS);const den=vals.reduce((s,g)=>s+(g.peso||1),0)||1;return vals.reduce((s,g)=>s+(g.aprovacao??50)*(g.peso||1),0)/den;};
export const calcularAprovacaoEstado=(estado,grupos)=>{const comp=estado.composicao||{};const den=Object.values(comp).reduce((a,b)=>a+b,0)||100;let total=0;Object.entries(comp).forEach(([id,p])=>total+=(grupos[id]?.aprovacao??50)*p);const gov=(estado.relacaoPlanalto??50)-50;return clamp(total/den+gov*0.08+(estado.investimentos?.reduce((s,i)=>s+(i.aprovacao||0),0)||0));};


const TAG_IMPACT = {
  social:{periferia:2,sindicalistas:1,mercado:-1}, renda:{periferia:2,sindicalistas:1}, fome:{periferia:3,evangelicos:1},
  sus:{periferia:2,sindicalistas:1,universitarios:1,mercado:-1}, vacina:{periferia:2,universitarios:2,evangelicos:-1}, saude:{periferia:2,universitarios:1},
  educacao:{universitarios:2,periferia:1,sindicalistas:1}, professores:{sindicalistas:3,universitarios:2,mercado:-1}, educacao_tecnica:{mercado:2,periferia:2,agro:1,universitarios:1},
  ciencia:{universitarios:3,mercado:1}, ia:{universitarios:2,mercado:2}, tecnologia:{universitarios:2,mercado:2}, startups:{mercado:2,universitarios:1},
  mercado:{mercado:3,sindicalistas:-2,periferia:-1}, fiscal:{mercado:3,sindicalistas:-2,periferia:-1}, privatizacao:{mercado:3,sindicalistas:-3,periferia:-1}, credito:{mercado:2,agro:1,periferia:1},
  investimento:{mercado:1,periferia:2,universitarios:1}, infraestrutura:{agro:2,mercado:2,periferia:2}, transporte:{periferia:2,mercado:1,agro:1},
  agro:{agro:4,mercado:1,universitarios:-1}, propriedade:{agro:3,mercado:1}, clima:{universitarios:3,agro:-2}, ambiental:{universitarios:3,agro:-2}, amazonia:{universitarios:3,agro:-1,militares:1},
  defesa:{militares:4,evangelicos:1,universitarios:-1}, forcas_armadas:{militares:4,universitarios:-1}, soberania:{militares:3,agro:1,universitarios:1},
  seguranca:{evangelicos:2,militares:2,periferia:1,universitarios:-1}, forca:{militares:3,evangelicos:2,universitarios:-3,periferia:-1}, lei_ordem:{militares:3,evangelicos:2,universitarios:-2}, investigacao:{universitarios:2,mercado:1,evangelicos:1}, integridade:{mercado:2,universitarios:2,evangelicos:1},
  cultura:{universitarios:3,periferia:1,evangelicos:-1}, cinema:{universitarios:2,periferia:1}, diversidade:{universitarios:3,evangelicos:-3},
  trabalho:{sindicalistas:3,periferia:2,mercado:-1}, salario:{sindicalistas:3,periferia:2,mercado:-1}, emprego:{periferia:3,mercado:1,sindicalistas:1},
  religiao:{evangelicos:4,universitarios:-1}, familia:{evangelicos:3,universitarios:-1},
  eventos:{periferia:1,mercado:1,universitarios:1}, marketing:{mercado:-1,universitarios:-1},
  federalismo:{agro:1,mercado:1,periferia:1}, coalizao:{mercado:1},
};

export const impactosGruposPorTags = (tags=[], intensidade=1) => {
  const out={};
  (tags||[]).forEach(tag=>{
    const key=String(tag||'').toLowerCase().replaceAll(' ','_');
    const impacto=TAG_IMPACT[key];
    if(!impacto) return;
    Object.entries(impacto).forEach(([id,v])=>{ out[id]=(out[id]||0)+v*intensidade; });
  });
  Object.keys(out).forEach(id=>{ out[id]=Math.max(-6,Math.min(6,Math.round(out[id]*10)/10)); });
  return out;
};
