# QA — Fase 4.8.3

## 1. STF

- Abra **Instituições > STF**.
- Confirme que o selo **Vice-Presidente** de Elisa Tanaka cabe dentro do card sem sobrepor a cadeira vizinha.
- 1ª Turma: Celina Prado, Elisa Tanaka, Breno Vasconcelos e Domingos Ferraz + 1 vaga.
- 2ª Turma: Gabriela Diniz, Íris Albuquerque, Flávio Lacerda, Henrique Paiva e Joaquim Torres.

## 2. Central de Notícias

- Clique em **Radar** ou **Abrir central** na faixa de notícias superior.
- A aba **Plantão** deve guardar os eventos recentes e indicar o veículo/editoria.
- A aba **Pendências** deve reunir crise federativa, demandas ministeriais, convites de agenda, indicação ao STF e aviso de gabinete incompleto.
- Resolva uma pendência diretamente pela Central e confirme que o estado do jogo muda.
- A aba **Notificações** deve exibir as notificações do Pulso e permitir marcá-las como lidas.

## 3. Gabinete incompleto

- Inicie um jogo sem nomear ministros.
- Na primeira virada deve existir aviso de montagem, sem punição numérica forte.
- A partir da segunda virada, confirme queda progressiva em clima/confiança/popularidade e aumento de instabilidade/risco quando pastas seguem vagas.
- Fazenda e Casa Civil vagas devem produzir efeitos adicionais.

## 4. Federação e acontecimentos audiovisuais

- O primeiro evento federativo não deve ser obrigatoriamente São Paulo.
- Os eventos federativos continuam surgindo no ritmo previsto, mas o estado/tema é sorteado no pool elegível.
- Se o evento sorteado for `sp_icms`, o acontecimento audiovisual `gov-sp-i1` deve entrar na fila.
- A tela não deve usar a palavra **Cutscene** para o jogador. O cabeçalho deve aparecer como uma manchete de um veículo do jogo.
- A tag de localização deve continuar visível.

## Patch visual — STF / Turmas
- [ ] Apenas uma Turma é exibida por vez no painel do STF.
- [ ] Setas esquerda/direita alternam entre 1ª e 2ª Turma em loop.
- [ ] Nomes completos dos ministros aparecem sem truncamento horizontal.
- [ ] Funções especiais (Vice-Presidente e Decano) permanecem dentro dos cards.
- [ ] Perfil, posse e independência continuam legíveis.
- [ ] A cadeira vaga permanece visível na 1ª Turma.
- [ ] Clique no card continua abrindo o dossiê do ministro.
