# QA — Fase 4.9

## Automático

Execute:

```bash
node scripts/test-fase4-9.mjs
```

O teste valida:

- duas campanhas coexistindo no navegador;
- seleção e exclusão individual de campanha;
- registro dos 27 governadores no motor político;
- Isabela Ferraz como ator político `gov:SP`;
- memória persistente de personagem;
- geração de movimento autônomo;
- presença do Arquivo presidencial e da Memória política no front.

Também foram mantidos os testes de regressão das fases 4.8.1, 4.8.2 e 4.8.3.

## Validação manual recomendada

1. Abra o jogo atualizado com um save antigo da 4.8.3.
2. Confirme que ele aparece no **Arquivo presidencial** sem ser perdido.
3. Crie uma segunda campanha com outro nome presidencial.
4. Faça ao menos uma ação e encerre um mês.
5. Use **Trocar campanha** e confirme que as duas linhas do tempo aparecem separadas.
6. Abra a campanha antiga e verifique que seu mês, aprovação e gabinete permanecem intactos.
7. Em **Brasil & Estados → SP → Governador**, use Pacto, Prestigiar ou Pressionar.
8. Reabra o dossiê e confira a seção **Memória política**.
9. Encerre meses e acompanhe a Central de Notícias: movimentos autônomos podem aparecer como notificações políticas.

## Observação de build

Os testes Node de regressão e o teste específico da 4.9 passam. O build Vite completo não foi executado no ambiente de edição porque a instalação de dependências não concluiu dentro do limite do ambiente; execute `npm install` e `npm run build` no projeto local antes do deploy.
