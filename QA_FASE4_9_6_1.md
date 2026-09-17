# QA — Fase 4.9.6.1

## Validação automatizada

Executar:

```bash
node scripts/test-fase4-9-6-1.mjs
```

O teste verifica:

- 156 leis e 156 IDs únicos;
- 13 categorias com 12 propostas em cada;
- cadeia de consequências em todas as leis;
- matriz de riscos STF/TCU/Federação/Implementação;
- estrutura de regulamentação;
- origens futuras de iniciativa legislativa;
- atores afetados;
- enriquecimento das leis antigas;
- presença de leis novas em todas as áreas;
- novos filtros e painel de consequências no Banco de Leis.

## Regressão executada

Foram executados com sucesso:

- `test-congresso-fase4-1.mjs`
- `test-fase4-8-3.mjs`
- `test-fase4-9.mjs`
- `test-fase4-9-1.mjs`
- `test-fase4-9-2.mjs`
- `test-fase4-9-3.mjs`
- `test-fase4-9-4.mjs`
- `test-fase4-9-5.mjs`
- `test-fase4-9-6-1.mjs`

## QA manual recomendado

1. Abrir **Congresso Nacional → Banco de Leis**.
2. Confirmar o total de **156 propostas**.
3. Testar busca e filtros de categoria/instrumento/impacto.
4. Abrir `Ver cadeia` em leis antigas e novas.
5. Confirmar riscos STF/TCU/Federação/Execução.
6. Confirmar exibição de regulamentação e programa derivado quando aplicável.
7. Protocolar uma lei antiga e uma nova para validar compatibilidade com o motor de tramitação existente.
8. Carregar uma campanha antiga e confirmar que o catálogo novo aparece sem apagar o save.

## Build

A instalação local de dependências no ambiente de geração não foi concluída dentro do limite disponível; `npm run build` não pôde ser validado porque o executável do Vite não foi instalado. Rodar `npm install`/`npm ci` e `npm run build` no ambiente local antes do deploy.
