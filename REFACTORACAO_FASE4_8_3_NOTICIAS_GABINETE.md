# Refatoração — Fase 4.8.3

A 4.8.3 consolida quatro correções após o teste das cutscenes.

## STF

A composição das Turmas foi redistribuída sem criar ou remover ministros. A 1ª Turma deixa de ser exclusivamente feminina, e o selo de Vice-Presidência passa a ocupar uma linha própria dentro do card para não invadir cadeiras vizinhas.

## Central de Notícias

A faixa **Radar** no topo agora é uma entrada navegável. Ela abre a **Central de Notícias**, com três visões: Plantão, Pendências e Notificações. A Central reaproveita os quatro veículos ficcionais do jogo e suas ramificações editoriais para dar autoria às manchetes. Pendências reais podem ser resolvidas ali quando já existe ação correspondente no sistema.

## Gabinete incompleto

A montagem ministerial deixa de ser opcional sem custo. Janeiro funciona como janela de formação; a partir do segundo mês, vagas ministeriais geram desgaste progressivo. Casa Civil e Fazenda possuem penalidades adicionais por seu papel de coordenação e credibilidade.

## Federação e cenas narrativas

São Paulo deixa de ser o primeiro evento federativo obrigatório. O sorteio volta ao pool completo. A cena de Isabela ligada ao ICMS passa a ser disparada apenas se o evento `sp_icms` realmente ocorrer. O rótulo técnico “Cutscene” foi removido da interface: a apresentação agora assume linguagem de cobertura jornalística, com manchete, veículo, programa/editoria e localização.
