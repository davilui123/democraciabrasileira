# QA — Fase 3

## Escopo validado

- Design system centralizado no Tailwind e `index.css`.
- Shell global redesenhado.
- Gabinete redesenhado.
- Sala de Situação integrada ao novo tema.
- Ministérios refinados.
- Congresso refinado.
- Hemiciclo com 513 cadeiras preservado.
- Economia redesenhada.
- Leis & Reformas redesenhado.
- Indicadores redesenhado.
- Geopolítica refinada sem trocar sua estrutura conceitual.
- Negociação diplomática integrada ao tema.
- Nomeação de ministros integrada ao tema.
- Modal de programa integrado ao tema.
- Notícias/notificações integradas ao tema.
- Centro eleitoral refinado.
- Conquistas refinadas.

## Validação de código

Foi realizado parsing sintático dos arquivos JavaScript/JSX da pasta `src` usando o parser TSX do TypeScript.

Resultado:

- 47 arquivos JS/JSX analisados;
- 0 erros sintáticos.

## Build neste ambiente

Foi tentada uma instalação limpa das dependências para executar o build do Vite. O ambiente de execução não concluiu o `npm ci` dentro do limite disponível e deixou `node_modules` parcialmente criado.

Esse diretório parcial não faz parte do pacote final.

A validação de build completa fica pendente para um ambiente com a instalação das dependências concluída. Isso não altera o escopo da Fase 3, que foi validado sintaticamente.

## Observação para a Fase 5

Não é necessário fazer uma campanha de teste agora. O teste de gameplay foi deliberadamente adiado para a Fase 5, conforme o roadmap combinado.
