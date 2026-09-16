# QA — Fase 4.9.5

## Teste automatizado

Executar:

```bash
node scripts/test-fase4-9-5.mjs
```

O teste valida:

- 18+ itens estratégicos com campos visuais e de dependência;
- migração de comércio de saves antigos;
- logos reservados para privadas, estatais e mídia;
- novos concorrentes de mobilidade elétrica;
- 26+ medidas econômicas;
- medidas sob escrutínio de TCU/STF;
- preferência comercial China × EUA;
- criação de tensão geopolítica por acordo de EV;
- cascata sistêmica ligada à concorrência;
- eventos autônomos de TCU/STF;
- presença de fallback visual;
- scroll interno no Mapa de relações prioritárias.

## Roteiro manual recomendado

1. Abra **Economia & Fazenda → Comércio Exterior**.
2. Confira as abas **Estratégicos** e **Mercados**.
3. Sem adicionar imagens, confirme que nenhum card exibe ícone de imagem quebrada e que o fallback aparece.
4. Abra oportunidades comerciais e aceite **Plataforma chinesa de veículos elétricos**.
5. Verifique em **Mercados** a preferência por China e a tensão com EUA.
6. Avance meses e observe possíveis desdobramentos no motor de histórias emergentes.
7. Teste uma parceria com **DragonVolt Mobility**, **Liberty Motors** e **EuroDrive Mobility** em campanhas distintas.
8. Em **Economia & Fazenda**, execute medidas de política industrial e confirme custo em CP e indicadores TCU/STF.
9. Avance o mês e confira se TCU/STF podem produzir reação autônoma quando as condições forem atendidas.
10. Abra **Geopolítica → Visão** em resolução de notebook e confirme que **Mapa de relações prioritárias** rola internamente sem vazar para baixo.
11. Abra **Central de Notícias** e confirme o fallback de logo das mídias.
12. Abra **Empresas** e confirme o fallback de logo das estatais e privadas.

## Artes futuras

Copie os arquivos para os caminhos já cadastrados no seed. Não é necessário alterar JSX.

- produtos: `public/trade/items/*.webp`
- logos de empresas: `public/logos/companies/*.webp`
- imagens de empresas: `public/companies/*.webp`
- logos de mídia: `public/logos/media/*.webp`
