# QA — Fase 4.8.2 Cutscenes

## Fluxo piloto

1. Inicie um novo jogo.
2. Clique em **Encerrar mês**.
3. Na agenda mensal, clique em **Processar mês**.
4. Antes do relatório, deve abrir a cutscene **Confronto fiscal com Brasília**.
5. O GIF `gov-sp-i1f.gif` deve tocar em loop sem deformação.
6. Clique em **Continuar**.
7. A cutscene deve ser marcada como vista e o relatório mensal deve aparecer.
8. A mesma cena não deve repetir nas viradas seguintes.

## Persistência

- Se a janela for fechada durante a cutscene, ela deve continuar pendente.
- Ao abrir novamente **Encerrar mês**, a cutscene pendente deve reaparecer antes de qualquer novo processamento.
- Saves v14 e anteriores devem continuar carregando, assumindo listas vazias para as novas chaves.

## Expansão

Use `enfileirarCutscene('id-da-cena')` para ligar futuras cenas a condições de jogo. O catálogo já contém as quatro cenas de Isabela.
