# QA — Fase 4.2 Revisada

## Validações concluídas

- Todos os arquivos JS/JSX de `src` foram submetidos ao parser do TypeScript em modo JSX (`--jsx preserve`) sem erro sintático.
- 132 imports relativos foram verificados programaticamente; nenhum aponta para arquivo inexistente.
- 13 ministérios no catálogo.
- 52 candidatos ministeriais.
- Exatamente 4 candidatos para cada ministério.
- Todos os 52 candidatos possuem os campos narrativos principais do novo dossiê.
- 41 operações/minigames ministeriais.
- Todas as respostas ideais cadastradas foram testadas contra `avaliarRespostaDesafio` e reconhecidas corretamente.
- 13 eventos de telefone ministerial.
- 12 projetos de grandes eventos nacionais.
- Todas as pastas líderes e de apoio dos grandes eventos existem no catálogo.
- 4 pautas do Conselho de Governo.
- Todos os participantes das pautas do Conselho correspondem a ministérios existentes.
- Save atualizado para versão 5 e lista de campos persistidos ampliada para telefone, operações ministeriais e eventos nacionais.

## Build Vite

A instalação completa via `npm install` foi tentada, mas excedeu o limite do ambiente de execução e deixou um `node_modules` parcial. Para não distribuir dependências incompletas, ele foi removido do pacote final.

Portanto, o `vite build` completo não foi considerado validado nesta entrega. Em ambiente local:

```bash
npm install
npm run dev
```

## Pontos indicados para a gameplay da Fase 5

- frequência das ligações ministeriais;
- ritmo e custo dos grandes eventos;
- legibilidade do risco de rival e escândalo;
- variedade percebida dos minigames;
- valor real de convocar Conselho de Governo;
- se quatro candidatos por pasta são suficientes durante uma campanha longa.
