# Fase 4.9.2 — Mundo em Movimento

A 4.9.2 estende a Movimentação Política Autônoma para a política externa. Países deixam de funcionar apenas como alvos de ações presidenciais e passam a criar demandas próprias conforme seus interesses, a conjuntura global e a relação bilateral com o Brasil.

## Núcleo da implementação

- Novo catálogo `pressoesGeopoliticasSeed` com cenários autônomos e ramificados.
- Novo estado persistente dentro de `geopolitica`:
  - `pressoesDiplomaticas`
  - `historicoPressoes`
  - `ultimaPressaoTurno`
  - `cooldownsPressao`
- Geração probabilística, com intervalo mínimo e cooldown por cenário.
- Até duas pressões podem ficar simultaneamente sobre a mesa presidencial.
- Cada pressão abre três respostas com efeitos bilaterais, domésticos, econômicos e institucionais.
- Não responder também produz consequência quando o prazo expira.
- A pressão abre automaticamente uma janela diplomática com o país envolvido.

## Cenários iniciais

1. Rússia cobra sinal político do Brasil em meio à guerra.
2. China pede preferência de longo prazo em minerais críticos e terras raras.
3. Estados Unidos ameaçam sobretaxas e cobram concessões comerciais.
4. Alemanha condiciona capital verde à rastreabilidade ambiental.
5. Argentina pressiona por flexibilização/reforma do Mercosul.
6. Emirados Árabes oferecem megainvestimento com condições estratégicas.
7. Índia propõe pacto de fármacos e transferência tecnológica.

Os cenários são ficcionais dentro da linha temporal do jogo e servem como gatilhos sistêmicos, não como reprodução de fatos reais específicos.

## Interface

### Geopolítica → Pressões

Nova aba para visualizar:

- país e chefe de governo;
- origem/local da cobrança;
- contexto estratégico;
- prazo para resposta;
- três opções presidenciais;
- histórico de respostas e demandas ignoradas.

### Central de Notícias

As pressões entram em `Pendências`, permitindo decisão presidencial sem depender de o jogador lembrar de abrir Geopolítica. As manchetes internacionais também direcionam corretamente para a área Mundo/Itamaraty.

## Integração mensal

Na virada de mês:

1. pressões antigas vencidas amadurecem em custo diplomático;
2. o motor geopolítico avalia se um novo ator estrangeiro fará uma cobrança;
3. a demanda entra no feed internacional, Pulso e Central de Notícias;
4. a resposta do jogador altera relações, economia, grupos sociais, soft power, autonomia e/ou organizações multilaterais;
5. a decisão fica arquivada no histórico diplomático.
