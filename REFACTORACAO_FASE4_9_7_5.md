# Refatoração 4.9.7.5 — Convenção & Eleição

## Objetivo

Fechar a DLC partidária ligando a vida interna criada nas fases 4.9.7.1–4.9.7.4 diretamente ao ciclo eleitoral. A convenção deixa de usar apenas um percentual abstrato e passa a depender dos 27 diretórios, alas, máquina, alianças, distribuição de recursos e escolhas estaduais.

## Entregas

### 1. Convenção baseada nos diretórios
O novo `partyElectionEngine` converte os 27 diretórios estaduais em delegados reais. Cada diretório pesa conforme:
- número de delegados;
- satisfação local;
- relação com a Executiva Nacional;
- ala dominante;
- autonomia;
- força da máquina;
- presença de governador filiado;
- relação Planalto–partido;
- coerência programática;
- acordos feitos nos bastidores.

A tela eleitoral mostra apoio por região, apoio das alas, delegados favoráveis/contrários/indecisos e eventual candidatura interna rival.

### 2. Disputa interna real
A candidatura presidencial não é automática. Quando a unidade partidária está baixa e alas estão insatisfeitas, pode surgir um rival interno. A homologação exige o apoio mínimo da convenção e só pode ocorrer entre 20/07 e 05/08.

Os acordos com caciques da versão anterior continuam existindo, mas agora alteram o comportamento dos delegados regionais em vez de apenas somar pontos abstratos.

### 3. Fundo eleitoral distribuído pelo partido
O fundo projetado agora nasce da combinação de:
- fundo-base;
- caixa e prestígio da organização;
- máquina;
- bancada;
- alianças e federações.

A direção distribui 100% entre:
- Presidência;
- Governadores;
- Câmara;
- Senado.

O jogador pode deslocar recursos em blocos de 5 pontos percentuais, respeitando mínimos e máximos. Concentrar recursos na chapa presidencial reduz espaço para palanques e bancadas.

A cota presidencial efetivamente liberada pelo FEFC passa a ser a cota definida pelo partido e só pode ser captada uma vez.

### 4. Candidaturas estaduais
Cada um dos 27 diretórios passa a carregar uma estratégia de candidatura:
- homologar o nome local;
- compor com uma legenda aliada;
- impor um nome da Executiva Nacional.

A escolha modifica satisfação/autonomia local e consome Capital Político quando há composição ou imposição. A decisão também fica registrada na corrida estadual correspondente.

### 5. Alianças e federações chegam à eleição
Alianças ativas da 4.9.7.4 agora entram no ecossistema eleitoral. Elas ampliam a capacidade financeira/operacional e influenciam a escolha do vice. Um vice de partido aliado recebe bônus de encaixe de chapa.

### 6. Máquina partidária vira vantagem eleitoral
A máquina eleitoral é calculada a partir de estrutura nacional, capilaridade, digital, disciplina, prestígio e alianças. Ela produz efeito discreto sobre reconhecimento e presença estadual, sem substituir aprovação ou campanha.

### 7. Integração com Central de Notícias
Durante a janela de convenção, uma candidatura ainda não homologada passa a aparecer como pendência presidencial na Central de Notícias, com acesso direto ao Comando Eleitoral.

### 8. Persistência e compatibilidade
O novo estado fica dentro de `eleicao.partidoEleitoral`, portanto usa o save já existente sem criar uma nova chave de persistência. Saves anteriores recebem o estado na próxima sincronização eleitoral.

## Encerramento da DLC Partidária

A cadeia 4.9.7 passa a ser:

**Identidade → vida interna → partido no poder → janela/migração/alianças → convenção/recursos/candidaturas.**

Essa estrutura fica pronta para a futura mega expansão eleitoral sem criar um segundo sistema de partidos paralelo.
