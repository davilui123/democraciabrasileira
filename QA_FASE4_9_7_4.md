# QA — Fase 4.9.7.4

## Teste automatizado

Executar:

```bash
node scripts/test-fase4-9-7-4.mjs
```

O teste valida:
- reconhecimento da janela partidária;
- filiação nacional dos governadores;
- migração em cenário de ruptura;
- preservação do total de 513 cadeiras;
- aceitação de federação e custo de Capital Político;
- intervenção em diretório estadual;
- persistência de `sistemaPartidario`;
- presença da nova UI em Partidos e Central de Notícias.

## Roteiro manual

1. Inicie ou carregue uma campanha.
2. Abra **Política → Partidos → Janela & alianças**.
3. Avance meses e observe histórico de migrações e propostas de composição.
4. Em proposta que envolva seu partido, teste **Aceitar** e **Recusar**.
5. Em Diretórios estaduais, selecione uma UF com risco de intervenção elevado e execute uma intervenção.
6. Confira caixa partidário, Capital Político, satisfação local e histórico.
7. Em março de 2026, confirme que a janela aparece como aberta e que migrações passam a ser mais prováveis.
8. Confira se alterações de bancada aparecem no número de cadeiras dos partidos sem alterar o total da Câmara.
9. Verifique a Central de Notícias para propostas de aliança/federação pendentes.
10. Salve, recarregue a campanha e confirme que migrações, alianças e intervenções permanecem.

## Regressão

A suíte completa de testes `scripts/test-*.mjs` deve continuar passando.
