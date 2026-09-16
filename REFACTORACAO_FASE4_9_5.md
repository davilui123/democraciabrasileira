# Fase 4.9.5 — Comércio Estratégico, Concorrência & Regulação

## Objetivo

Aprofundar Importação × Exportação e conectá-la ao motor de histórias emergentes. A balança comercial deixa de ser apenas um agregado por setor: produtos estratégicos, preferências por parceiros, concorrência empresarial, relações diplomáticas e controle institucional passam a conversar entre si.

## 1. Itens estratégicos

O comércio agora mantém 18 itens com estado próprio, entre eles soja, carne, café, minério, petróleo, aço, nióbio, lítio, terras raras, fertilizantes, semicondutores, baterias, IFAs, máquinas industriais, veículos elétricos e diesel.

Cada item possui:

- fluxo predominante (exportação, importação ou misto);
- setor;
- valor mensal abstrato;
- potencial;
- dependência externa;
- capacidade doméstica;
- sensibilidade geopolítica;
- parceiros críticos;
- descrição;
- caminho reservado para ilustração.

O painel **Comércio Exterior → Estratégicos** permite acompanhar esses indicadores individualmente.

## 2. Preferência e concorrência geopolítica

Acordos comerciais e parcerias com multinacionais passam a alterar um mapa persistente de preferências e tensões.

Exemplos:

- favorecer uma plataforma chinesa de veículos elétricos fortalece a relação comercial com a China, mas pode gerar desconforto nos EUA e na Europa;
- uma aliança tecnológica americana pode reduzir o espaço de fornecedores chineses;
- contratos concentrados de minerais críticos ampliam potencial de investimento, mas aumentam o escrutínio sobre exclusividade e autonomia;
- decisões em pressões diplomáticas sobre tarifas, minerais, fertilizantes e rastreabilidade agora atingem diretamente itens e setores do comércio.

Essas mudanças alimentam cascatas sistêmicas. A concorrência China × EUA em mobilidade, por exemplo, pode virar uma história própria do motor autônomo.

## 3. Empresas

Estatais e empresas privadas receberam campos de identidade visual:

- `logo`;
- `imagem` institucional;
- contexto/sensibilidade concorrencial.

O catálogo privado também recebeu concorrentes internacionais de mobilidade elétrica para criar uma disputa concreta entre capital chinês, americano e europeu.

As parcerias empresariais com grupos estrangeiros passam a afetar preferências comerciais, relações bilaterais e tensões com concorrentes.

## 4. Mídia

Os quatro grupos de mídia receberam:

- `logo` principal;
- `logosCanais` para suas ramificações.

A Central de Notícias já utiliza o logo principal. Enquanto o arquivo visual não existir, a interface mostra um fallback com ícone e iniciais, sem quebrar o layout.

## 5. Fallbacks visuais

O componente `VisualAsset.jsx` centraliza dois comportamentos:

- `LogoMark`: logos de empresas e mídia;
- `IllustratedAsset`: arte de commodities/produtos estratégicos.

Se o arquivo não existir ou falhar ao carregar, o jogo usa um placeholder consistente.

Pastas reservadas:

- `public/trade/items/`
- `public/logos/companies/`
- `public/companies/`
- `public/logos/media/`

## 6. Novas medidas econômicas

O catálogo passou a 26 medidas. Foram adicionados instrumentos como:

- estoques reguladores;
- equalização de crédito rural;
- plano nacional de fertilizantes;
- programa de semicondutores;
- cadeia de baterias;
- conteúdo local;
- salvaguarda industrial;
- seguro cambial ao exportador;
- compras públicas para inovação;
- política de IFAs nacionais;
- revisão de subsídios;
- fundo de estabilização do frete;
- depreciação acelerada;
- fundo de minerais críticos.

As medidas podem alterar diretamente exportações, importações, dependência de setores e itens estratégicos.

## 7. Custo político e controle

Cada nova medida pode carregar:

- custo em Capital Político;
- impacto fiscal;
- cooldown;
- risco TCU;
- risco STF;
- impacto comercial e social.

Medidas com risco alto geram alertas imediatamente e também podem provocar movimentos autônomos posteriores do TCU ou STF.

Foram acrescentados eventos de controle específicos para política industrial, política econômica judicializável, minerais críticos e preferência comercial a fornecedores estrangeiros.

## 8. Efeito dominó comercial

O `systemicCascadeEngine` ganhou efeitos por item estratégico e novas cadeias, incluindo:

- tarifaço → aço/agro → estados exportadores;
- atrito com Rússia → fertilizantes → safra → inflação/alimentos;
- preferência por mobilidade chinesa → reação americana → cadeia de veículos/baterias;
- preferência tecnológica americana → reação chinesa;
- IFAs caros e dependentes → compras públicas/SUS/indústria;
- concentração em minerais críticos → rivalidade entre potências + controle institucional;
- choque global de diesel → frete/agro/indústria;
- dependência de semicondutores → cadeias industriais.

## 9. Geopolítica — correção de layout

O card **Mapa de relações prioritárias** agora preserva a altura/proporção do painel e usa rolagem interna. A lista não empurra mais o restante da interface para baixo.

## Compatibilidade

Saves antigos continuam sendo carregados. `normalizarComercio()` injeta os novos itens e estruturas ausentes sem exigir que o jogador apague campanhas anteriores.
