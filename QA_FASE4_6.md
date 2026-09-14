# QA — Fase 4.6 Conquistas

## Catálogo
- 23 conquistas.
- IDs únicos.
- Todas possuem recompensa explícita.
- Categorias: governo, política, sociedade, economia, desenvolvimento, soberania, exterior, instituições e legado.

## Recompensas testadas
- Capacidade `presidencia_popular` é concedida ao desbloquear Mandato Popular.
- EBTN possui 3 diretrizes próprias.
- CEITEC expandida possui 3 diretrizes próprias.
- PL especial de criação da EBTN usa comissões existentes do Congresso.
- Investimento produtivo/humano passa a ser acumulado pelo motor fiscal.

## Teste de cenário
O script `scripts/test-fase4-6.mjs` cria um governo de alto desempenho e verifica:
- aprovação de 70%;
- investimento de R$ 50 bi;
- domínio nuclear;
- diplomacia de Estado;
- aplicação de capacidade permanente.
Resultado esperado: `status: ok`.

## Código
- 91 arquivos JS/JSX analisados com parser TypeScript/JSX.
- 0 erros sintáticos.
- 198 imports relativos verificados.
- 0 imports quebrados.

## Build
Não foi executado `vite build` nesta validação porque o pacote final não inclui `node_modules`. Rodar localmente:

```bash
npm install
npm run dev
```

## Pontos de teste manual
1. Abrir Conquistas e conferir progresso numérico.
2. Atingir/forçar aprovação >70 e observar toast dedicado.
3. Confirmar aumento de alcance no Pulso após Mandato Popular.
4. Desbloquear Primário no Azul e implantar Fundo de Estabilização.
5. Concluir Nuclear 2040 + usar diretriz nuclear na ENBPar; enviar PL da EBTN ao Congresso; sancionar e confirmar surgimento em Estatais.
6. Concluir semicondutores; ativar CEITEC e conferir nova empresa/diretrizes.
7. Recarregar save v9 e confirmar persistência de capacidades e empresas desbloqueadas.
8. Verificar que País em Obras marca o requisito para a Fase 4.7.
