# Fase 4.9.7.1 — Identidade & Dossiê Partidário

## Objetivo
Transformar os quatro partidos centrais do jogo em entidades políticas completas, preparando a expansão eleitoral futura. A legenda deixa de ser apenas sigla/cor/cadeiras e passa a possuir direção, história, alas, máquina e organização territorial.

## Entregas

### Catálogo partidário unificado
Novo `src/data/seed/partidos.js` com:
- identidade, ideologia, número e slogan fictícios;
- campo de logo com fallback;
- presidência e Executiva Nacional;
- história e base social;
- prioridades e linhas vermelhas;
- três alas internas por partido;
- indicadores de máquina, disciplina, capilaridade, militância, quadros, digital e operação parlamentar;
- 27 diretórios estaduais por legenda.

### Diretórios estaduais
Cada diretório possui:
- presidência estadual;
- força da máquina;
- autonomia em relação à direção nacional;
- relação com a direção nacional;
- ala dominante;
- delegados;
- filiados estimados;
- prioridade eleitoral;
- estado interno estável/disputado.

A estrutura é determinística e persistível, pronta para convenções, distribuição de fundo, candidaturas, intervenções e alianças estaduais.

### Sete pilares de governança partidária
O dossiê já descreve a infraestrutura futura de:
1. convenção;
2. fundo partidário;
3. diretórios estaduais;
4. distribuição de recursos;
5. alianças;
6. intervenção em diretórios;
7. escolha de candidaturas.

Nesta fase os sete elementos são leitura estrutural; as ações jogáveis serão ativadas nas próximas etapas da DLC partidária.

### Nova área Partidos
Novo item `Política > Partidos`, com quatro visões:
- Identidade;
- Alas internas;
- Diretórios estaduais;
- Como o partido decide.

A aba de diretórios inclui mapa partidário clicável das 27 UFs, intensidade da máquina estadual e ficha completa do diretório selecionado.

### Compatibilidade
O catálogo eleitoral (`partidosEleitoraisSeed`) agora deriva da mesma fonte. Saves antigos continuam válidos: `mergePartyCatalog` preserva cadeiras, apoio e indicadores evolutivos enquanto injeta a nova estrutura institucional.

## Assets
Reservados em `public/logos/parties/`:
- `ppg.webp`
- `moc.webp`
- `lib.webp`
- `ind.webp`

O componente `PartyLogo` fornece fallback automático até as artes serem produzidas.
