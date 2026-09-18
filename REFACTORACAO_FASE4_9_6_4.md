# Fase 4.9.6.4 — Sanção, Veto e Derrubada de Veto

## Objetivo

Fechar o ciclo político entre aprovação bicameral e vigência da lei. O texto negociado na 4.9.6.3 passa a chegar efetivamente à mesa presidencial e o Presidente pode sancionar, vetar parcialmente ou vetar integralmente. Vetos retornam ao Congresso e deixam de ser uma decisão final unilateral.

## Implementado

### 1. Três decisões presidenciais
- **Sanção integral:** o texto final aprovado entra em vigor e produz 100% dos efeitos negociados.
- **Veto parcial:** o jogador escolhe dispositivos acessórios específicos. O núcleo da matéria entra em vigor imediatamente e apenas os trechos vetados seguem para o Congresso.
- **Veto total:** a matéria fica sem vigência enquanto o Congresso analisa o veto.

### 2. Dispositivos de veto parcial
O jogo constrói uma lista dinâmica a partir do texto final:
- execução e regulamentação;
- dispositivo fiscal/incentivos quando aplicável;
- arranjo federativo quando aplicável;
- emendas parlamentares e ajustes incorporados durante a 4.9.6.3.

Cada dispositivo possui um peso estimado de impacto. O veto parcial nunca pode apagar todo o projeto; o núcleo legislativo permanece.

### 3. Sessão conjunta e projeção
Vetos ganham o estado `veto_congresso` e ficam pelo menos um mês disponíveis para articulação. A tela exibe:
- projeção na Câmara;
- projeção no Senado;
- quantidade necessária para derrubada;
- tendência de manutenção, disputa ou derrubada.

A simulação considera apoio à matéria, origem do projeto, relação das bancadas com o governo, poder de bastidor e articulação específica para sustentar o veto.

### 4. Articulação presidencial
O botão **Articular manutenção** custa:
- 3 pontos de Capital Político;
- 5 pontos de Poder de Bastidor.

A ação fortalece a defesa do veto, pode ser usada mais de uma vez e fica registrada no histórico da proposta.

### 5. Resultado do veto
Na virada mensal, o Congresso pode:
- **manter veto total:** projeto não entra em vigor;
- **derrubar veto total:** projeto é promulgado e passa a produzir seus efeitos;
- **manter veto parcial:** a lei continua vigente sem os dispositivos retirados;
- **derrubar veto parcial:** os dispositivos são restaurados e o restante dos efeitos passa a valer.

Os resultados são persistidos no `textoFinal`, no histórico parlamentar e nos eventos recentes.

### 6. Programas derivados
Programas vinculados a leis acompanham o ciclo:
- aguardam sanção;
- podem ficar sob veto;
- continuam parcialmente em implantação em caso de veto parcial;
- são ativados/restaurados se o veto cair;
- são cancelados se um veto total for mantido.

## Arquivos principais
- `src/game/vetoEngine.js`
- `src/game/congressEngine.js`
- `src/store/useGameStore.js`
- `src/components/Congress.jsx`
- `src/game/legislativeAgendaEngine.js`
- `scripts/test-fase4-9-6-4.mjs`

## Próxima etapa planejada
**4.9.6.5 — Judicialização e Controle:** STF, TCU, ações de constitucionalidade, cautelares, auditorias e controle pós-sanção reagindo ao texto efetivamente aprovado.
