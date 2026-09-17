# QA — Fase 4.9.6.3

## Teste automatizado

Executar:

```bash
node scripts/test-fase4-9-6-3.mjs
```

O teste valida:

- geração de emendas em todo o catálogo de 156 leis;
- propostas iniciando com 3–4 emendas quando aplicável;
- aceitação criando nova versão;
- alteração real da projeção de votos;
- contraproposta com efeito intermediário;
- emenda própria da base do governo;
- consolidação do texto final;
- presença da Mesa de Negociação no frontend;
- ações correspondentes no store.

Também foram executados todos os scripts `scripts/test-*.mjs` existentes sem regressão.

## Teste manual sugerido

1. Inicie uma campanha e abra **Congresso Nacional**.
2. Protocole uma lei com alta polarização ou alto risco de controle.
3. Abra **Comissões & Tramitação**.
4. Confira **Mesa de negociação** e as 3–4 emendas iniciais.
5. Aceite uma demanda e confirme:
   - mudança para Texto v2;
   - alteração da projeção de votos;
   - mudança em risco/fiscal quando aplicável;
   - alteração no histórico do texto.
6. Em outra emenda, use **Ajustar** e confirme uma versão adicional com efeito intermediário.
7. Rejeite uma terceira emenda e observe perda de apoio da bancada autora.
8. Use **Emenda da base do governo** e confira consumo de 2 CP e 3 de Poder de Bastidor.
9. Avance a matéria até sanção e confirme que `textoFinal` preserva as alterações negociadas.
10. Salve, feche e carregue a campanha; o versionamento e as emendas devem persistir.

## Observação de build

Os testes lógicos passaram. A tentativa de `npm ci` no ambiente de geração excedeu o tempo disponível e foi interrompida; execute `npm install` / `npm run build` no ambiente local antes do deploy ao Vercel.
