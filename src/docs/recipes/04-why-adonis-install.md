# Por que instalar o Adonis?

O AdonisJs vem com um comando chamado `adonis install <pacote>`, que é o mesmo que `npm install` ou `yarn add`.

Na verdade, nos bastidores, `adonis install` usa npm ou yarn para instalar o pacote, mas também executa uma etapa extra após a instalação.

## Execução de comando

![imagem](/docs/assets/adonis-install-flow.png)

Cada provedor pode ter dois arquivos [instructions.js](https://github.com/adonisjs/adonis-lucid/blob/develop/instructions.js) e [instructions.md](https://github.com/adonisjs/adonis-lucid/blob/develop/instructions.md), que são usados ​​pelo adonis para executar etapas `pós-instalação`.

### instructions.js
O arquivo `.js` exporta uma função. Esta função pode ser usada para executar qualquer etapa, pois você pode escrever código funcional dentro dela.

As etapas mais comumente executadas são

- Copiar arquivos de configuração.
- Criar entidades como controladores, modelos e assim por diante.

### instructions.md
Os arquivos `.md` são o pequeno conjunto de instruções a serem seguidas manualmente pelo usuário do provedor. Então é um bom lugar para colocar algumas instruções de uso e configuração escritas em markdown com sabor do Github.
