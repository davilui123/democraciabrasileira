# Fase 4.2 — Revisão de Ministérios

Esta revisão substitui a primeira entrega visual/mecânica da Fase 4.2 depois do primeiro teste de interface.

## Direção corrigida

A tela de Ministérios voltou a usar a **Esplanada como navegação lateral**, em vez de uma faixa horizontal de cards. A pasta escolhida ocupa o palco principal e possui três frentes claras: **Gabinete**, **Operações** e **Eventos**.

A antiga representação decorativa da “Sala de reunião” foi removida. O novo **Conselho de Governo** é uma cena funcional: existe uma pauta interministerial, ministros participantes, falas específicas e uma diretriz presidencial que altera relações conforme a afinidade de cada personagem.

## Personagens ministeriais

O elenco passou de perfis funcionais para personagens persistentes. São 52 personagens fictícios — quatro por cada um dos 13 ministérios — com:

- idade e origem;
- carreira e vínculo político/social;
- frase própria;
- biografia;
- agenda pessoal;
- rede de poder;
- vulnerabilidade;
- episódio de passado;
- ideologia;
- competência técnica e política;
- integridade, popularidade e ambição;
- pautas que apoiam e rejeitam.

O Ministério da **Cultura** foi adicionado para comportar cinema, patrimônio, artes, economia criativa e eventos culturais.

Não há mais geração de candidatos genéricos em `MinistroRepository.createCandidatosEspecificos`.

## Telefone Presidencial

O telefone agora é um objeto global e permanente da interface, no canto inferior direito.

Mesmo sem chamada ativa ele abre:

- contatos do gabinete;
- ligação direta para ouvir, cobrar ou prestigiar ministros;
- histórico de ligações.

Quando existe uma chamada ministerial, o aparelho muda de estado e sinaliza a ligação. Atender ou ignorar gera consequências e registra histórico.

## Grandes eventos nacionais

Foi criada uma camada própria de projetos especiais vinculados aos ministérios. O catálogo inicial possui 12 eventos/candidaturas, entre eles:

- candidatura à Copa do Mundo;
- candidatura aos Jogos Olímpicos;
- Jogos Pan-Americanos;
- Jogos Sul-Americanos Paradesportivos;
- Campanha Nacional de Vacinação;
- Temporada Internacional do Cinema Brasileiro;
- Festival Internacional de Cinema do Brasil;
- Bienal Pan-Amazônica de Artes;
- Feira Mundial do Livro e da Língua Portuguesa;
- Expo Brasil de Tecnologia e IA;
- Jogos Nacionais Escolares;
- Semana Nacional de Inclusão Digital.

Antes de iniciar um projeto o jogador escolhe uma estratégia:

- **Legado primeiro**;
- **Prestígio máximo**;
- **Orçamento contido**.

A estratégia altera custo, risco e prestígio. Os projetos avançam mês a mês, exigem ministério líder, recebem apoio de outras pastas e podem terminar em sucesso ou execução contestada.

A Casa Civil consegue visualizar o portfólio nacional inteiro.

## Operações / minigames

O catálogo agora possui 41 operações ministeriais.

Além de diagnóstico, priorização e montagem de pacotes sob limite, foi implementado um novo formato de minigame: **sequência operacional**. O jogador reorganiza etapas antes de confirmar a decisão.

Exemplos:

- primeiras seis horas de resposta a um surto;
- estratégia de campanha internacional de cinema.

As pistas podem ser marcadas visualmente para organizar o raciocínio antes da resposta.

## Conselho de Governo

Foram criadas quatro pautas interministeriais iniciais:

1. Pacto Nacional de Ensino Técnico;
2. Violência urbana e pressão hospitalar;
3. Candidatura brasileira a megaevento;
4. Economia criativa como política industrial.

Cada ministro presente apresenta sua posição. A escolha presidencial altera efeitos nacionais e a relação com os participantes conforme suas preferências ideológicas.

## Tela inicial

O jogo agora abre em uma página própria com:

- **Novo Jogo**;
- **Continuar Jogo**;
- resumo da campanha salva.

O save não é mais restaurado automaticamente. Isso facilita testes de campanha limpa e será importante na Fase 5.

A persistência foi elevada para save v5, preservando compatibilidade de leitura com versões anteriores. Saves antigos recebem o catálogo novo de ministérios/personagens durante o carregamento, incluindo o Ministério da Cultura.
