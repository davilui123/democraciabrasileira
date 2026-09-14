# QA — Fase 4.1 Congresso

## Validações executadas

### Sintaxe

- 52 arquivos `.js/.jsx` analisados pelo parser JavaScript/JSX do TypeScript.
- 0 erros sintáticos encontrados.
- Todos os imports relativos do diretório `src` resolvem para arquivos existentes.

### Motor legislativo

Script: `scripts/test-congresso-fase4-1.mjs`

Resultado:

- banco de leis: **78**;
- comissões: **14**;
- atores-chave: **10**;
- ações de articulação: **6**;
- cadeiras: **513**;
- IDs de leis e comissões sem duplicidade;
- todas as leis apontam para comissões existentes;
- todas possuem afinidade para os quatro blocos;
- PECs não aceitam o atalho de urgência do modelo;
- PEC: 308 votos / 2 turnos;
- PLP: 257 votos;
- PL: maioria dos presentes com presença mínima modelada em 257;
- simulações testadas sempre totalizam 513 deputados entre SIM/NÃO/ABSTENÇÃO;
- negociação de texto reduz polarização;
- hemiciclo compacto soma exatamente 513 posições.

### Hemiciclo

As linhas-guia e os pontos das cadeiras são derivados dos mesmos `rx`, `ry`, ângulo e margem. Isso elimina o desalinhamento geométrico observado na Fase 3.

## Limitação da validação neste ambiente

Não foi possível executar `vite build` porque a instalação completa das dependências do projeto excedeu o tempo disponível no ambiente e deixou de ser usada como critério de QA. O diretório `node_modules` não faz parte do pacote final.

A validação desta fase foi feita por:

1. parser JSX/JS;
2. resolução estática de imports relativos;
3. `node --check` nos módulos puros;
4. smoke test funcional do motor legislativo.

No Windows, a validação final de bundle pode ser feita com:

```bash
npm install
npm run build
```
