# Fase 4.8.2 — Cutscenes

> **Atualização 4.8.3:** o teste determinístico da primeira virada foi encerrado. As cenas agora são disparadas pelo acontecimento político correspondente e a interface deixou de exibir o rótulo técnico “Cutscene”.

## Objetivo

Introduzir uma camada cinematográfica reutilizável para acontecimentos de alta saliência. Isabela Ferraz, governadora de São Paulo, é a personagem-piloto.

## Implementação

- Catálogo central em `src/data/seed/cutscenes.js`.
- Componente genérico `src/components/CutsceneView.jsx`.
- Fila persistente no Zustand: `cutscenesPendentes` e `cutscenesVistas`.
- Ações públicas `enfileirarCutscene(id)` e `concluirCutscene(id)` para futuras integrações com eventos, crises, eleições e personagens.
- Save atualizado para v15, com migração dos saves anteriores.
- A transição mensal agora aceita a fase `cutscene`, exibida entre o processamento do mês e o relatório mensal.
- Teste piloto determinístico: na primeira virada de mês (turno 1 → 2), `gov-sp-i1` é colocada na fila.
- Fechar a janela durante uma cutscene não a perde: ao reabrir a transição, a cena pendente reaparece.

## Catálogo inicial — Isabela Ferraz

1. `gov-sp-i1` — confronto do ICMS.
2. `gov-sp-i2` — inauguração do metrô em Guarulhos.
3. `gov-sp-i3` — apagão e telefonema ao Presidente.
4. `gov-sp-i4` — fábrica de semicondutores.

As cenas 2–4 ficam cadastradas para disparo futuro por condições narrativas. Nesta etapa apenas a cena 1 é forçada para validação da mecânica.

## Assets

Caminho esperado: `public/cutscene/`.

- `gov-sp-i1f.gif`
- `gov-sp-i2f.gif`
- `gov-sp-i3f.gif`
- `gov-sp-i4f.gif`

O componente exibe um fallback informativo caso um asset ainda não esteja presente no pacote.
