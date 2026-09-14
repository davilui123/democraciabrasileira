# Retratos de personagens — Democracia Brasileira

Este diretório é o ponto único para substituir os avatares ilustrados por imagens próprias do jogo.

## Como funciona

1. Coloque a imagem em `public/characters/`.
2. Use **preferencialmente WEBP** com o nome exato listado abaixo.
3. O jogo também tenta automaticamente `.png`, `.jpg` e `.jpeg` com a mesma chave.
4. Se nenhum arquivo local existir, o componente usa o avatar ilustrado DiceBear. Se esse fallback também falhar, exibe as iniciais do personagem.

### Recomendações de imagem

- Retratos: **512 × 512 px**, proporção 1:1.
- Rosto/ombros centralizados e margem de segurança de ~12%.
- Fundo simples; o jogo aplica corte `object-cover`.
- Não renomeie a chave depois que a campanha existir; vários personagens usam a mesma imagem em Ministérios, Pulso, crises e negociações.

### Presidente criado pelo jogador

Use sempre:

`public/characters/presidente.webp`

Esse retrato aparece na criação do perfil, no save e no Pulso.

## Arquivos atuais

Total de chaves únicas cadastradas no catálogo visual: **205**.

### Presidência

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Presidente da República | `presidente.webp` | Retrato do personagem criado pelo jogador |

### Ministros e candidatos

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Lídia Monteiro | `cc-lidia.webp` | m_casacivil · Ex-senadora e negociadora de crises |
| Hélio Furtado | `cc-helio.webp` | m_casacivil · Gestor público e ex-secretário executivo |
| Raquel Paes | `cc-raquel.webp` | m_casacivil · Deputada federal e líder de bancada |
| Otávio Nobre | `cc-otavio.webp` | m_casacivil · Advogado empresarial e mediador |
| Inês Valverde | `fz-ines.webp` | m_fazenda · Economista e ex-diretora do Banco Central |
| Caio Mendonça | `fz-caio.webp` | m_fazenda · Banqueiro de investimentos |
| Samira Couto | `fz-samira.webp` | m_fazenda · Professora de economia e desenvolvimentista |
| Mauro Peixoto | `fz-mauro.webp` | m_fazenda · Deputado e ex-secretário estadual de Fazenda |
| Dra. Ana Siqueira | `sa-ana.webp` | m_saude · Epidemiologista do SUS |
| Fausto Lacerda | `sa-fausto.webp` | m_saude · Deputado médico e ex-prefeito |
| Lívia Amaral | `sa-livia.webp` | m_saude · Executiva de rede hospitalar |
| Paulo Araripe | `sa-paulo.webp` | m_saude · Líder de movimento de pacientes |
| Marta Junqueira | `ed-marta.webp` | m_educacao · Reitora e pesquisadora |
| Leandro Bastos | `ed-leandro.webp` | m_educacao · Deputado ligado a prefeitos |
| Sônia Prado | `ed-sonia.webp` | m_educacao · Fundadora de rede de escolas técnicas |
| Raul Menezes | `ed-raul.webp` | m_educacao · Professor e dirigente sindical |
| Teresa Noronha | `ju-teresa.webp` | m_justica · Desembargadora aposentada |
| Daniel Tavares | `ju-daniel.webp` | m_justica · Delegado federal |
| Elisa Moura | `ju-elisa.webp` | m_justica · Advogada de direitos humanos |
| Ricardo Falcão | `ju-ricardo.webp` | m_justica · Senador e ex-secretário de Segurança |
| Augusto Salles | `df-augusto.webp` | m_defesa · General da reserva e logístico |
| Marina Vasques | `df-marina.webp` | m_defesa · Diplomata especialista em defesa |
| Celso Ferraz | `df-ferraz.webp` | m_defesa · Almirante da reserva |
| Victor Nascimento | `df-victor.webp` | m_defesa · Executivo aeroespacial |
| Jorge Alencar | `tr-jorge.webp` | m_transp · Engenheiro ferroviário |
| Helena Prado | `tr-helena.webp` | m_transp · Executiva de logística |
| Abel Ribeiro | `tr-abel.webp` | m_transp · Deputado de bancada regional |
| Bianca Torres | `tr-bianca.webp` | m_transp · Urbanista e especialista em mobilidade |
| Luiza Arantes | `ma-luiza.webp` | m_meioamb · Bióloga e pesquisadora amazônica |
| Renato Vale | `ma-renato.webp` | m_meioamb · Ex-governador amazônico |
| Camila Dourado | `ma-camila.webp` | m_meioamb · Executiva de energia renovável |
| Roberto Sampaio | `ma-roberto.webp` | m_meioamb · Produtor rural e conservacionista |
| Vitória Campos | `ag-vitoria.webp` | m_agro · Engenheira agrônoma e pesquisadora |
| Breno Assunção | `ag-breno.webp` | m_agro · Presidente de cooperativa |
| Joana Nascimento | `ag-joana.webp` | m_agro · Líder de agricultura familiar |
| César Brandão | `ag-cesar.webp` | m_agro · Senador do agro |
| Maria Dantas | `so-maria.webp` | m_social · Pesquisadora em políticas sociais |
| Nádia Reis | `so-nadia.webp` | m_social · Gestora de ONG nacional |
| Gilberto Nunes | `so-gilberto.webp` | m_social · Ex-prefeito de capital |
| Alice Serpa | `so-alice.webp` | m_social · Empresária de impacto social |
| Akemi Tavares | `ct-akemi.webp` | m_ciencia · Física e gestora de laboratório nacional |
| Igor Freire | `ct-igor.webp` | m_ciencia · Fundador de empresa de IA |
| Lucas Antunes | `ct-lucas.webp` | m_ciencia · Deputado da frente digital |
| Regina Cabral | `ct-regina.webp` | m_ciencia · Executiva de telecomunicações |
| Renan Batista | `es-renan.webp` | m_esportes · Ex-jogador e campeão mundial |
| Clara Meireles | `es-clara.webp` | m_esportes · Gestora olímpica |
| Talita Rocha | `es-talita.webp` | m_esportes · Ex-atleta e ativista do esporte feminino |
| Eduardo Mota | `es-eduardo.webp` | m_esportes · Deputado e dirigente esportivo |
| Beatriz Leme | `cu-beatriz.webp` | m_cultura · Cineasta premiada e produtora independente |
| Antônio Valença | `cu-antonio.webp` | m_cultura · Senador e ex-secretário estadual de Cultura |
| Malika Nascimento | `cu-malika.webp` | m_cultura · Curadora, historiadora e diretora de museu |
| Dante Vilar | `cu-dante.webp` | m_cultura · Empresário da música e fundador de plataforma de streaming |
| Helena Sampaio | `re-helena.webp` | m_exteriores · Embaixadora e ex-representante em organismos multilaterais |
| Marcelo Vilar | `re-marcelo.webp` | m_exteriores · Senador e ex-presidente da Comissão de Relações Exteriores |
| Amina Barreto | `re-amina.webp` | m_exteriores · Professora de relações internacionais e negociadora climática |
| Danilo Ferraz | `re-danilo.webp` | m_exteriores · Especialista em inteligência econômica e ex-adido estratégico |

### Governadores

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Helena Monteiro | `gov-ac-helena-monteiro.webp` | AC · Frente Cidadã |
| Rafael Calheiros Lins | `gov-al-rafael-calheiros-lins.webp` | AL · União Alagoana |
| Mirela Paes | `gov-ap-mirela-paes.webp` | AP · Movimento Verde Social |
| Caio Nascimento Braga | `gov-am-caio-nascimento-braga.webp` | AM · Aliança Amazônica |
| Lúcia Santana Reis | `gov-ba-lucia-santana-reis.webp` | BA · Partido Popular Baiano |
| Ícaro Bezerra | `gov-ce-icaro-bezerra.webp` | CE · Ceará em Frente |
| Tereza Albuquerque | `gov-df-tereza-albuquerque.webp` | DF · Capital Livre |
| Otávio Valadares | `gov-es-otavio-valadares.webp` | ES · Pacto Capixaba |
| Mauro Siqueira | `gov-go-mauro-siqueira.webp` | GO · Goiás Forte |
| Débora Sarney Nogueira | `gov-ma-debora-sarney-nogueira.webp` | MA · Renova Maranhão |
| Leandro Pires | `gov-mt-leandro-pires.webp` | MT · Mato Grosso Produtivo |
| Patrícia Azevedo | `gov-ms-patricia-azevedo.webp` | MS · Coalizão Pantanal |
| Augusto Vilela | `gov-mg-augusto-vilela.webp` | MG · Minas Primeiro |
| Joana Batista Pará | `gov-pa-joana-batista-para.webp` | PA · Frente Amazônica |
| Henrique Lucena | `gov-pb-henrique-lucena.webp` | PB · Paraíba Inovadora |
| Marina Rios Kuster | `gov-pr-marina-rios-kuster.webp` | PR · Paraná Competitivo |
| André Vasconcelos | `gov-pe-andre-vasconcelos.webp` | PE · Pernambuco Popular |
| Sofia Castelo Branco | `gov-pi-sofia-castelo-branco.webp` | PI · Piauí do Futuro |
| Marcelo Fontes | `gov-rj-marcelo-fontes.webp` | RJ · Rio Seguro |
| Cecília Dantas | `gov-rn-cecilia-dantas.webp` | RN · RN Sustentável |
| Eduardo Fagundes | `gov-rs-eduardo-fagundes.webp` | RS · Pacto Gaúcho |
| Silas Mendonça | `gov-ro-silas-mendonca.webp` | RO · Rondônia Forte |
| Nádia Macuxi Farias | `gov-rr-nadia-macuxi-farias.webp` | RR · Roraima Unido |
| Bruno Konder | `gov-sc-bruno-konder.webp` | SC · Santa Catarina Livre |
| Isabela Ferraz | `gov-sp-isabela-ferraz.webp` | SP · São Paulo em Movimento |
| Vinícius Barreto | `gov-se-vinicius-barreto.webp` | SE · Sergipe Mais |
| Camila Araguaia | `gov-to-camila-araguaia.webp` | TO · Tocantins Desenvolvimento |

### Comunidade do Pulso

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Beatriz Nascimento | `pulso-bia-usp.webp` | @bia.no.campus · Estudante de engenharia · SP |
| Célia dos Santos | `pulso-celia-rj.webp` | @celiadavila · Técnica de enfermagem · RJ |
| João Pedro Arantes | `pulso-joao-mt.webp` | @joaodocampo · Produtor rural · MT |
| Luciana Andrade | `pulso-lu-go.webp` | @pastoraluciana · Pastora e assistente social · GO |
| Rafael Monte | `pulso-rafa-rs.webp` | @rafa.chao · Metalúrgico e dirigente sindical · RS |
| Lara Menezes | `pulso-lara-sp.webp` | @laramercados · Analista de investimentos · SP |
| Paulo Henrique Nunes | `pulso-phn-df.webp` | @phn_defesa · Suboficial da reserva · DF |
| Mariana Lobo | `pulso-maju-pe.webp` | @profmaju · Professora de escola pública · PE |
| Edson Vieira | `pulso-edson-ba.webp` | @edsonentrega · Entregador por aplicativo · BA |
| Nina Aruá | `pulso-nina-pa.webp` | @ninafloresta · Bióloga e comunicadora · PA |
| Marta Figueiredo | `pulso-marta-pr.webp` | @marta.coop · Dirigente de cooperativa · PR |
| Diego Sato | `pulso-diego-sc.webp` | @dsato.tech · Fundador de startup · SC |
| Ana Paula Reis | `pulso-ana-es.webp` | @anapaulareis · Empreendedora e líder comunitária · ES |
| Lucas Barreto | `pulso-lucas-mg.webp` | @lucas.seg · Policial militar · MG |

### Oposição

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Caio Valente | `op-caio-valente.webp` | Candidato derrotado à Presidência |
| Renata Morais | `op-renata.webp` | Líder da oposição na Câmara |
| Vicente Nobre | `op-vicente.webp` | Senador e estrategista jurídico |
| Mila Torres | `op-mila.webp` | Porta-voz digital |

### STF — Corte inicial

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Aurora Nogueira | `stf-aurora.webp` | Magistratura · institucionalista |
| Breno Vasconcelos | `stf-breno.webp` | Ministério Público · punitivista moderado |
| Celina Prado | `stf-celina.webp` | Academia · progressista |
| Domingos Ferraz | `stf-domingos.webp` | Advocacia · federalista |
| Elisa Tanaka | `stf-elisa.webp` | Magistratura · técnica |
| Flávio Lacerda | `stf-flavio.webp` | Advocacia pública · estatalista |
| Gabriela Diniz | `stf-gabriela.webp` | Ministério Público · anticorrupção |
| Henrique Paiva | `stf-henrique.webp` | Academia · liberal constitucional |
| Íris Albuquerque | `stf-iris.webp` | Defensoria Pública · social |
| Joaquim Torres | `stf-joaquim.webp` | Magistratura · conservador institucional |

### STF — Candidatos

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Marina Fontes | `cand-stf-marina.webp` | Superior Tribunal de Justiça · técnica institucional |
| Otávio Gama | `cand-stf-otavio.webp` | Procuradoria-Geral · anticorrupção |
| Helena Duarte | `cand-stf-helena.webp` | Universidade Federal · progressista garantista |
| Ricardo Mendonça | `cand-stf-ricardo.webp` | Advocacia empresarial · liberal econômico |
| Sônia Ribeiro | `cand-stf-sonia.webp` | Defensoria Pública · social federalista |
| Paulo Neri | `cand-stf-paulo.webp` | Senado / Advocacia · político conciliador |

### Congresso

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Augusto Valença | `augusto-valenca.webp` | Presidente da Câmara · PE |
| Helena Prado | `helena-prado.webp` | Líder do Governo · BA |
| Renato Vasconcelos | `renato-vasconcelos.webp` | Líder do Bloco de Centro · GO |
| Camila Ferraz | `camila-ferraz.webp` | Líder Liberal · SP |
| Otávio Nogueira | `otavio-nogueira.webp` | Coordenador dos Independentes · MG |
| Teresa Montenegro | `teresa-montenegro.webp` | Presidente da CCJC · PR |
| Eduardo Salles | `eduardo-salles.webp` | Presidente da CFT · SC |
| Marta Luz | `marta-luz.webp` | Presidente da Comissão de Saúde · CE |
| Rafael Mendonça | `rafael-mendonca.webp` | Presidente da Comissão de Segurança · RJ |
| Lívia Azevedo | `livia-azevedo.webp` | Presidente da Comissão de Meio Ambiente · AM |

### Dossiês narrativos — Fase 4.7.1

Além do retrato, Câmara, STF, Governadores e líderes internacionais agora usam dossiês narrativos persistentes. Os textos ficam em:

`src/data/seed/dossiesPersonagens.js`

Cada dossiê pode conter trajetória, agenda própria, rede de poder, vulnerabilidade, episódio definidor, ambição/legado e uma leitura de **como lidar** com o personagem. Você pode editar esses textos sem mexer na mecânica do personagem.

### Líderes estrangeiros

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Eleanor Ward | `us-ward.webp` | US · Presidente |
| Liang Wei | `cn-liang.webp` | CN · Presidente |
| Viktor Sokolov | `ru-sokolov.webp` | RU · Presidente |
| Hannah Keller | `de-keller.webp` | DE · Chanceler |
| Julien Moreau | `fr-moreau.webp` | FR · Presidente |
| Amelia Grant | `gb-grant.webp` | GB · Primeira-ministra |
| Tomás Echeverría | `ar-echeverria.webp` | AR · Presidente |
| Aarav Malhotra | `in-malhotra.webp` | IN · Primeiro-ministro |
| Naoko Ishida | `jp-ishida.webp` | JP · Primeira-ministra |
| Park Min-seo | `kr-park.webp` | KR · Presidente |
| Faisal Al-Rashid | `sa-faisal.webp` | SA · Príncipe-presidente do Conselho |
| Reza Farhadi | `ir-farhadi.webp` | IR · Presidente |
| Noam Ben-Ami | `il-benami.webp` | IL · Primeiro-ministro |
| Selin Demir | `tr-demir.webp` | TR · Presidente |
| Mansour Al-Nahyan | `ae-mansour.webp` | AE · Presidente |
| Naledi Khumalo | `za-khumalo.webp` | ZA · Presidente |
| Karim El-Masry | `eg-karim.webp` | EG · Presidente |
| Lucía Cárdenas | `mx-cardenas.webp` | MX · Presidenta |
| Marc Bélanger | `ca-belanger.webp` | CA · Primeiro-ministro |
| Oleksandr Kovalenko | `ua-kovalenko.webp` | UA · Presidente |

| Giulia Moretti | `it-moretti.webp` | IT · Primeira-ministra |
| Álvaro Serrano | `es-serrano.webp` | ES · Presidente do Governo |
| Madalena Costa | `pt-costa.webp` | PT · Primeira-ministra |
| Erik Solheim | `no-solheim.webp` | NO · Primeiro-ministro |
| Valentina Rojas | `cl-rojas.webp` | CL · Presidenta |
| Mateo Restrepo | `co-restrepo.webp` | CO · Presidente |
| Alejandro Suárez | `ve-suarez.webp` | VE · Presidente |
| Martín Echevarría | `uy-echevarria.webp` | UY · Presidente |
| Sofía Benítez | `py-benitez.webp` | PY · Presidenta |
| Arif Pranoto | `id-pranoto.webp` | ID · Presidente |
| Adaeze Okonkwo | `ng-okonkwo.webp` | NG · Presidenta |
| Manuel Tavares | `ao-tavares.webp` | AO · Presidente |
| Amélia Nhantumbo | `mz-nhantumbo.webp` | MZ · Presidenta |
| Sophie McAllister | `au-mcallister.webp` | AU · Primeira-ministra |

## Observação

A lista acima acompanha os personagens que já usam `PoliticalAvatar` ou que foram cadastrados como personagens persistentes do jogo. Quando novos personagens forem adicionados, mantenha a mesma regra: defina um `seed/avatar` estável e use a chave sanitizada em `public/characters/`.


## Eleições 2026 — Vice-Presidência

| Personagem | Arquivo recomendado | Contexto |
|---|---|---|
| Teresa Amaral | `vice-teresa-amaral.webp` | Vice atual quando o Presidente inicia pelo PPG |
| Henrique Prado | `vice-henrique-prado.webp` | Vice atual quando o Presidente inicia pelo MOC |
| Laura Mendonça | `vice-laura-mendonca.webp` | Vice atual quando o Presidente inicia pelo LIB |
| Sérgio Barros | `vice-sergio-barros.webp` | Vice atual quando o Presidente inicia pelo IND |

## Eleições 2026 — Caciques partidários

| Personagem | Arquivo recomendado | Partido / função |
|---|---|---|
| Dalva Menezes | `cac-dalva-menezes.webp` | PPG · Nordeste |
| Márcio Fontoura | `cac-marcio-fontoura.webp` | PPG · estrutura nacional |
| Irene Bastos | `cac-irene-bastos.webp` | PPG · Sul |
| Artur Lemos | `cac-artur-lemos.webp` | MOC · secretário-geral |
| Mônica Rezende | `cac-monica-rezende.webp` | MOC · Centro-Oeste |
| Paulo Seabra | `cac-paulo-seabra.webp` | MOC · conselho político |
| Eduardo Meirelles | `cac-eduardo-meirelles.webp` | LIB · presidente nacional |
| Patrícia Dornelles | `cac-patricia-dornelles.webp` | LIB · Sul |
| Gilberto França | `cac-gilberto-franca.webp` | LIB · ala produtiva |
| Nádia Macuxi | `cac-nadia-macuxi.webp` | IND · Norte |
| Luís Ferraz | `cac-luis-ferraz.webp` | IND · porta-voz nacional |
| Sandra Cavalcante | `cac-sandra-cavalcante.webp` | IND · municipalistas |

## Eleições 2026 — Adversários dos governadores

Esses personagens ficam em segundo plano desde o início do mandato e ganham protagonismo quando a eleição estadual se aproxima. O jogador pode apoiar o governador atual ou seu adversário.

| UF | Personagem | Arquivo recomendado |
|---|---|---|
| AC | Bruno Siqueira | `ele-ac-bruno-siqueira.webp` |
| AL | Marina Tenório | `ele-al-marina-tenorio.webp` |
| AP | Henrique Souza | `ele-ap-henrique-souza.webp` |
| AM | Joana Araripe | `ele-am-joana-araripe.webp` |
| BA | Eduardo Matos | `ele-ba-eduardo-matos.webp` |
| CE | Marina Holanda | `ele-ce-marina-holanda.webp` |
| DF | Caio Bittencourt | `ele-df-caio-bittencourt.webp` |
| ES | Lúcia Prado | `ele-es-lucia-prado.webp` |
| GO | Helena Peixoto | `ele-go-helena-peixoto.webp` |
| MA | Rafael Brandão | `ele-ma-rafael-brandao.webp` |
| MT | Aline Noronha | `ele-mt-aline-noronha.webp` |
| MS | Roberto Sales | `ele-ms-roberto-sales.webp` |
| MG | Camila Nogueira | `ele-mg-camila-nogueira.webp` |
| PA | Fábio Meireles | `ele-pa-fabio-meireles.webp` |
| PB | Renata Lins | `ele-pb-renata-lins.webp` |
| PR | João Pacheco | `ele-pr-joao-pacheco.webp` |
| PE | Ricardo Albuquerque | `ele-pe-ricardo-albuquerque.webp` |
| PI | André Moura | `ele-pi-andre-moura.webp` |
| RJ | Beatriz Cardoso | `ele-rj-beatriz-cardoso.webp` |
| RN | Gustavo Medeiros | `ele-rn-gustavo-medeiros.webp` |
| RS | Fernanda Silveira | `ele-rs-fernanda-silveira.webp` |
| RO | Marcos Figueira | `ele-ro-marcos-figueira.webp` |
| RR | Ana Macedo | `ele-rr-ana-macedo.webp` |
| SC | Luís Goulart | `ele-sc-luis-goulart.webp` |
| SP | Miguel Prado | `ele-sp-miguel-prado.webp` |
| SE | Juliana Barreto | `ele-se-juliana-barreto.webp` |
| TO | Carlos Nery | `ele-to-carlos-nery.webp` |

### Observação sobre candidaturas dinâmicas

Ministros, governadores e integrantes da Cúpula da Câmara podem virar candidatos durante a simulação. Nesses casos, **o jogo reutiliza a mesma chave de imagem já cadastrada para o personagem**, portanto você não precisa criar um segundo retrato só porque ele mudou de cargo.
