# Fase 4.6.1 — Ajustes sistêmicos

## 1. Memória das decisões e consequências defasadas
- A Agenda Mensal continua dando um pequeno posicionamento político imediato.
- Cada agenda escolhida agora cria um compromisso persistente em `consequenciasPendentes`.
- O efeito material amadurece entre 2 e 4 meses depois e pode atingir fiscal, crescimento, risco jurídico, oposição, Congresso e grupos sociais.
- Respostas a crises federativas também criam desdobramentos futuros. Judicialização pode abrir processo imediatamente, mas o julgamento e os efeitos econômicos/administrativos permanecem defasados.
- O relatório mensal mostra consequências que amadureceram e compromissos que ainda estão em aberto, sem revelar antecipadamente todos os números.

## 2. Pulso como arena política
- Pulso segue sendo a rede social do jogo, dentro do celular presidencial.
- Feed agora possui filtros: Para você, Política, Comunidade e Mídia.
- Tendências são calculadas a partir dos posts recentes.
- Presidência tem força/reputação digital e o balanço mensal de alcance contra a oposição interfere levemente no ambiente político.
- Posts mostram alcance e métricas de curtidas, reposts e comentários.
- O Presidente pode responder, repercutir ou curtir posts. Responder diretamente personagens de um grupo cria efeito político mais forte nesse grupo.
- Publicações presidenciais relevantes geram comentários comunitários e podem pautar a mídia imediatamente.

## 3. Estatais evoluem para Empresas
- A navegação passa a chamar o módulo de **Empresas**.
- Aba Públicas preserva a lógica de orientação estratégica das estatais.
- Aba Privadas & multinacionais adiciona 12 empresas fictícias de setores relevantes.
- O jogador não controla empresas privadas: negocia atração de investimento, PPP/concessão, transferência tecnológica ou acordo de exportação.
- Parcerias duram seis meses e podem ter sinergia com Projetos Especiais e eventos como a ExpoAgro.
- Multinacionais abrem janelas diplomáticas com o país de origem e melhoram relações bilaterais, ligando Empresas à Geopolítica.

## 4. ExpoAgro Brasil
- Novo grande evento próprio do Ministério da Agricultura.
- Envolve Fazenda, Transportes, Relações Exteriores e Ciência & Tecnologia.
- Pode abrir novas janelas comerciais internacionais e fortalecer Agro/Mercado quando bem executada.
- Empresas privadas do agronegócio recebem sinergia de parceria quando a ExpoAgro está ativa.

## 5. Perfil presidencial
- Novo jogo agora abre criação de perfil antes da posse.
- Campos: nome, nome público, partido, UF de origem, cinco eixos políticos e três promessas de posse.
- O perfil altera expectativas iniciais dos grupos e apoio partidário.
- Posse gera postagem presidencial, reação da oposição e comentários da comunidade no Pulso.
- Promessas ficam persistidas para cobrança posterior da oposição e integração com a Fase 4.7 — Programas Governamentais.

## Save
- Versão: v10.
- Mantém leitura de saves v9 e anteriores.

## Ajuste posterior — criação presidencial e retratos
A tela inicial de criação do Presidente foi convertida em wizard de duas páginas para eliminar a dependência de scroll em desktop. A primeira concentra identidade e posições públicas; a segunda concentra exclusivamente as três promessas de posse. O botão de continuidade permanece visível no rodapé da etapa.

Os retratos de personagens foram centralizados em `public/characters/`. Todo componente `PoliticalAvatar` tenta carregar uma imagem local usando uma chave estável e, na ausência do arquivo, utiliza DiceBear e depois iniciais. A relação completa dos arquivos esperados está em `public/characters/README.md`.
