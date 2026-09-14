# QA — Fase 4.2 Ministérios

- 12 ministérios carregados.
- 48 candidatos: exatamente 4 por ministério.
- 36 operações: exatamente 3 por ministério.
- 12 eventos telefônicos: 1 por ministério.
- Todas as 36 respostas ideais são reconhecidas pelo motor de desafios.
- Store e ministryEngine passam no parser do Node.
- 57 arquivos JS/JSX passam pela análise sintática do TypeScript com JSX habilitado.
- 117 imports relativos verificados, sem arquivos ausentes.

## Limitação de ambiente
A instalação npm completa excedeu o limite do ambiente e deixou `node_modules` incompleto. O diretório foi removido antes do empacotamento. Por isso o `vite build` completo não foi usado como critério final desta subfase.
