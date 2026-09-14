const clamp=(v,min=-4,max=4)=>Math.min(max,Math.max(min,v));
const TEMA_GRUPO={
  economia:{mercado:2,periferia:-1,sindicalistas:-1},saude:{periferia:2,sindicalistas:1,universitarios:1},educacao:{universitarios:2,sindicalistas:1},
  seguranca:{militares:2,evangelicos:1,universitarios:-1},agro:{agro:3,universitarios:-1},social:{periferia:3,sindicalistas:1,mercado:-1},
  clima:{universitarios:3,agro:-2},defesa:{militares:3,universitarios:-1},governo:{mercado:1,periferia:1}
};
export function gerarComentariosComunidade({post,personagens=[],turno=1}){
  const mapa=TEMA_GRUPO[post.tema]||TEMA_GRUPO.governo;
  const ordenados=[...personagens].sort((a,b)=>Math.abs(mapa[b.grupo]||0)-Math.abs(mapa[a.grupo]||0));
  return ordenados.slice(0,4).map((p,i)=>{
    const sentimento=clamp((mapa[p.grupo]||0)+(i%2===0?1:-1));
    const positivo=sentimento>0;
    const frasesPos=[`Finalmente alguém falando de algo que chega na vida real.`,`Se entregar o que prometeu, tem meu apoio.`,`Isso faz sentido para quem vive esse problema todo dia.`,`Boa direção. Agora quero ver execução.`];
    const frasesNeg=[`Bonito no post. Quero saber quem paga a conta.`,`Isso ajuda um grupo e joga o custo em outro.`,`Não compro essa narrativa. Os efeitos vão aparecer depois.`,`Parece decisão pensada para manchete, não para resultado.`];
    return {id:`coment_${turno}_${p.id}_${i}_${Date.now()}`,autorId:p.id,autor:p.nome,autorTipo:'comunidade',grupo:p.grupo,uf:p.uf,profissao:p.profissao,seed:p.seed,texto:(positivo?frasesPos:frasesNeg)[(turno+i)%4],sentimento,respostaA:post.id};
  });
}
