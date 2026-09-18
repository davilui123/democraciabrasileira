# Fase 4.9.7.6 — Mini redesign, etapa 1

## Escopo aplicado

### 1. Partidos — Organização territorial
- Removida a altura mínima excessiva que alongava a tela.
- Mapa dos diretórios recebeu altura compacta e enquadramento mais controlado.
- Clique em qualquer UF continua selecionando imediatamente o diretório correspondente.
- Lista extensa de 27 diretórios foi substituída por um navegador compacto com duas UFs visíveis por vez.
- Adicionados controles anterior/próximo (`<` e `>`), com navegação circular entre os 27 diretórios.
- A seleção feita diretamente no mapa reposiciona automaticamente o navegador para a UF escolhida.

### 2. Gabinete Presidencial
- Refeito o dimensionamento vertical da página com layout flexível em vez de cálculo fixo de altura.
- Painel principal passa a ocupar apenas o espaço realmente disponível no viewport.
- A área de Coalizão Social ganhou rolagem interna apenas quando necessário, evitando que a parte inferior do Gabinete seja cortada.
- Mantida a proposta de dashboard em uma única tela, sem introduzir rolagem geral desnecessária.

### 3. Congresso — Projetos em tramitação
- A esteira legislativa passa a exibir somente dois projetos por vez.
- Adicionadas setas anterior/próximo e indicador de página/faixa de projetos.
- Ao mudar de página, o primeiro projeto daquele grupo passa a ser selecionado automaticamente.
- A coluna da esteira foi estreitada e o dossiê do projeto ampliado, reaproveitando o espaço que antes era consumido pela lista longa.
- Removida a rolagem vertical da lista de projetos nesta visualização.

## Observação de QA
O código foi revisado estruturalmente, mas o build local não pôde ser executado neste ambiente porque as dependências do projeto não estavam instaladas e a instalação via npm não concluiu dentro da sessão.
