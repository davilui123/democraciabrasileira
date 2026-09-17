# Fase 4.9.6.3 — Emendas e Negociação do Texto

## Objetivo

Transformar a tramitação legislativa em negociação de conteúdo, não apenas contagem de votos. Projetos passam a nascer com demandas de bancadas e presidentes de comissão, acumulam versões de texto e podem chegar ao Plenário diferentes do protocolo original.

## Implementação

### 1. Motor de emendas

Novo `src/game/amendmentEngine.js` com 12 famílias de emendas:

- responsabilidade fiscal;
- contrapartida federativa;
- transição gradual;
- salvaguarda de direitos;
- exceção setorial;
- rastreabilidade e controle;
- conteúdo local;
- revisão legislativa;
- proteção social;
- rastreabilidade socioambiental;
- segurança operacional;
- cláusula de expiração.

A relevância depende de categoria, tags, polarização e riscos STF/TCU/federativos da lei. Cada nova proposta recebe 3 ou 4 demandas iniciais e novas emendas podem surgir durante a passagem pelas comissões.

### 2. Decisões presidenciais

Para cada emenda pendente o jogador pode:

- **Aceitar** — incorpora integralmente ao texto, compra apoio e assume os custos/riscos da concessão;
- **Ajustar** — fecha uma contraproposta intermediária, com aproximadamente metade dos efeitos da demanda;
- **Rejeitar** — mantém o texto, mas desgasta a relação e a projeção da bancada autora.

A negociação consome Capital Político e/ou Poder de Bastidor conforme a emenda.

### 3. Emendas da base do governo

O Planalto pode oferecer quatro ajustes próprios:

- salvaguarda fiscal;
- transição negociada;
- governança e revisão;
- pacto federativo de execução.

Isso permite que um projeto da oposição ou dos governadores seja convertido em texto negociado, desde que o governo esteja apoiando ou negociando a matéria.

### 4. Versionamento do texto

Cada incorporação gera uma nova versão:

`Texto original → v2 → v3 → Substitutivo negociado`

O Congresso exibe a versão atual no card e no dossiê da matéria. O histórico informa autor, tipo de acordo e mês da alteração. Alterações do Senado também criam uma nova versão.

### 5. Consequência real da emenda

Emendas alteram, conforme o caso:

- projeção de votos por bancada;
- polarização;
- impacto fiscal do texto;
- riscos STF, TCU, federativo e de implementação;
- efeitos econômicos e políticos que serão aplicados se a lei for sancionada;
- relação com o parlamentar autor da emenda.

Portanto, aceitar uma emenda não é um bônus gratuito de votos. O texto final pode ficar mais caro, mais protegido juridicamente, menos polarizado ou mais complexo.

### 6. Sanção preserva o texto negociado

Ao sancionar, a proposta guarda `textoFinal`, incluindo:

- versão;
- alterações incorporadas;
- riscos finais;
- impacto fiscal acumulado;
- modificadores de efeitos.

A sanção usa os efeitos do texto efetivamente aprovado, não apenas os atributos originais do catálogo.

## Arquivos principais

- `src/game/amendmentEngine.js`
- `src/game/congressEngine.js`
- `src/store/useGameStore.js`
- `src/components/Congress.jsx`
- `scripts/test-fase4-9-6-3.mjs`

## Próxima etapa

A estrutura está preparada para a 4.9.6.4: sanção, veto parcial/integral e derrubada de veto pelo Congresso.
