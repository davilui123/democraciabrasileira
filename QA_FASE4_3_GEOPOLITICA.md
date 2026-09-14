# QA — Fase 4.3 Geopolítica

## Validações executadas

### Sintaxe JS/JSX
Todos os arquivos `.js` e `.jsx` de `src` foram processados pelo TypeScript em modo `allowJs`, `jsx preserve`, `noEmit` e `noResolve`, sem erros sintáticos.

Também passaram por `node --check` os principais arquivos novos/alterados do motor e do store.

### Imports relativos
159 imports relativos foram resolvidos programaticamente; nenhum aponta para arquivo inexistente.

### Integridade de dados
- 14 ministérios;
- 56 candidatos ministeriais;
- exatamente 4 candidatos por ministério;
- Relações Exteriores: 4 candidatos, 3 desafios, 1 evento telefônico e 3 problemas estruturais;
- 34 países;
- 8 organizações internacionais;
- 60 acontecimentos internacionais;
- 18 ativos de negociação;
- 10 matrizes de crise;
- 4 doutrinas de legado;
- 20 países com líder ficcional escrito individualmente e 14 com fallback determinístico;
- nenhum Projeto Especial aponta para ID de ministério inexistente.

### Mesa de negociação
Foi testada abertura de janela diplomática e um pacote forte de negociação. O motor reconhece janela válida e diferencia força da oferta/resistência.

### Regras soberanas verificadas no código
- uso da força exige Defesa nomeada;
- uso da força exige emergência/mobilização prévia;
- tratado estratégico, mobilização e uso da força exigem Poder de Bastidor no Congresso;
- sanções geram custo doméstico e persistência bilateral;
- operações encobertas possuem risco de vazamento;
- reconhecimento, tratado e conflito deixam marcas persistentes no país-alvo.

## Build Vite
A instalação completa das dependências não terminou dentro do limite disponível no ambiente. O `node_modules` parcial foi removido do pacote final. Por isso o `vite build` não foi usado como validação final.

Para teste local:

```bash
npm install
npm run dev
```
