# Assets das Unidades Federativas

Para cada UF, use a estrutura:

```
public/states/SP/capital.jpg
public/states/SP/bandeira.png
```

Repita trocando `SP` pela sigla das 27 UFs.

## Dimensões recomendadas

- `capital.jpg`: **1600 × 600 px** (proporção 8:3). Use fotografia horizontal da capital, sem texto embutido. O jogo aplica crop com `object-cover`.
- `bandeira.png`: **320 × 224 px** (proporção 10:7). PNG ou JPG funciona, mas mantenha o nome `bandeira.png` para não alterar o código.

O frontend possui fallback visual: se o arquivo não existir, a página continua funcionando e mostra uma composição neutra/sigla da UF.
