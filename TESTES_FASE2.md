# Testes — Fase 2

## Testes executados

### Parse de código
Todos os arquivos `.js` e `.jsx` em `src/` foram analisados com `@babel/parser` usando suporte JSX.

Resultado: **OK**.

### Store
A store foi importada diretamente em Node e os catálogos locais foram carregados.

Resultados observados no teste:

- 8 ministérios carregados;
- 34 países carregados;
- catálogo de problemas associado a 7 pastas;
- agenda inicial com 3 AP.

### Mesa Presidencial
Cenário testado:

- Rodada com Líderes: consumiu 1 AP, 8 de capital político e elevou apoio do centro;
- Plano Nacional de Infraestrutura: consumiu 2 AP e R$ 1,2 bi;
- agenda chegou a 0 AP;
- ao encerrar o mês, AP voltou a 3;
- impulso econômico da infraestrutura entrou no cálculo do turno e foi zerado depois do processamento.

### Ministérios
Foram simulados múltiplos turnos para verificar:

- criação de problemas;
- maturação de estágios;
- aparecimento de demandas;
- custos de resolução;
- remoção do problema resolvido.

Também foi testado cenário com ministros nomeados durante a lua de mel. A montagem inicial não consumiu capital político e a velocidade de deterioração das pastas caiu em relação ao cenário sem ministros.

## Build

O build não pode ser concluído neste ambiente Linux porque o `node_modules` original enviado no ZIP contém o binding nativo do Rolldown para Windows. Esse é um problema de dependência binária do pacote original, não um erro de sintaxe detectado nas alterações da Fase 2.

Em Windows, a recomendação continua sendo instalar as dependências limpas antes de executar:

```bash
npm install
npm run dev
```
