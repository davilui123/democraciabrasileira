# QA — Fase 4.7 Programas Governamentais

## Validações executadas
- Parser JS/JSX em toda a árvore `src`: **104 arquivos, sem erro sintático**.
- Imports relativos: **229 referências, 0 ausentes**.
- Smoke test do motor de programas: aprovado.
- **11** arquiteturas de programa.
- **33** metas mensuráveis no catálogo.
- **2** programas avançados condicionados a conquistas.
- Todos os ministérios referenciados existem no catálogo atual.
- Todas as promessas associadas existem no perfil presidencial.
- Todas as capacidades exigidas existem como recompensa de Conquistas.
- Lei dinâmica mantém vínculo `programaId`.
- Via MP preserva instrumento `MP` no motor.
- Progressão mensal avança com custo federal positivo e risco calculado.

## Build
A instalação completa por `npm ci` excedeu o limite do ambiente de execução. O `node_modules` parcial foi removido antes do empacotamento.

Portanto, foram validados sintaxe, imports e motores de domínio, mas **não se afirma que um build Vite completo foi concluído neste ambiente**.

## Teste local sugerido
```bash
npm install
npm run dev
```

Depois testar:
1. Criar programa executivo pequeno.
2. Criar programa via PL e acompanhar no Congresso.
3. Criar programa via MP e verificar execução provisória.
4. Encerrar meses e observar gasto, progresso, risco e marcos.
5. Associar uma promessa de posse e acompanhar mudança de status.
6. Forçar programa territorial em algumas UFs e comparar efeitos.
7. Salvar/recarregar durante tramitação legislativa e confirmar preservação da lei dinâmica.
