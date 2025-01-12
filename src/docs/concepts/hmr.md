---
summary: Atualize seu aplicativo AdonisJS sem reiniciar o processo usando a substituição de módulo a quente (HMR).
---

# Substituição de módulo a quente

A substituição de módulo a quente (HMR) se refere ao processo de recarregar módulos JavaScript após a modificação sem reiniciar todo o processo. O HMR geralmente resulta em um loop de feedback mais rápido, pois, após uma alteração de arquivo, você não precisa esperar que todo o processo reinicie.

O termo HMR é usado há muitos anos no ecossistema de front-end, onde ferramentas como o Vite podem recarregar módulos a quente e aplicar alterações a uma página da web, mantendo seu estado existente.

No entanto, o HMR realizado pelo AdonisJS é muito mais simples e difere muito de ferramentas como o Vite ou o Webpack. Nosso objetivo com o HMR é oferecer recarregamentos mais rápidos, e é isso.

## Conceitos-chave

### Nenhuma atualização é propagada para o navegador

Como o AdonisJS é uma estrutura de back-end, não somos responsáveis ​​por manter o estado de um aplicativo front-end ou aplicar CSS a uma página da web. Portanto, nossa integração HMR não pode se comunicar com seu aplicativo front-end e reconciliar seu estado.

Na verdade, nem todo aplicativo AdonisJS é um aplicativo da web renderizado pelo navegador. Muitos usam o AdonisJS para criar APIs JSON puras e também podem se beneficiar da nossa integração HMR.

### Funciona apenas com importações dinâmicas
A maioria das ferramentas HMR usa transformações de código para injetar código adicional na saída compilada. Na AdonisJS, não somos grandes fãs de transpiladores e sempre nos esforçamos para abraçar a plataforma como ela é. Portanto, nossa abordagem para HMR usa [ganchos de carregador Node.js](https://nodejs.org/api/module.html#customization-hooks) e funciona apenas com importações dinâmicas.

**A boa notícia é que todas as partes críticas do seu aplicativo AdonisJS são importadas dinamicamente por padrão**. Por exemplo, controladores, middleware e ouvintes de eventos são todos importados dinamicamente e, portanto, você pode aproveitar o HMR a partir de hoje sem alterar uma única linha de código em seu aplicativo.

Vale a pena mencionar que as importações de um módulo importado dinamicamente podem estar no nível superior. Por exemplo, um controlador (que é importado dinamicamente no arquivo de rotas) pode ter importações de nível superior para validadores, arquivos TSX, modelos e serviços, e todos eles se beneficiam do HMR.

## Uso
Todos os kits iniciais oficiais foram atualizados para usar o HMR por padrão. No entanto, se você tiver um aplicativo existente, poderá configurar o HMR da seguinte maneira.

Instale o pacote npm [hot-hook](https://github.com/Julien-R44/hot-hook) como uma dependência de desenvolvimento. A equipe principal do AdonisJS criou este pacote, que também pode ser usado fora de um aplicativo AdonisJS.

```sh
npm i -D hot-hook
```

Em seguida, copie e cole a seguinte configuração no arquivo `package.json`. A propriedade `boundaries` aceita uma matriz de padrões glob que devem ser considerados para o HMR.

```json
{
  "hotHook": {
    "boundaries": [
      "./app/controllers/**/*.ts",
      "./app/middleware/*.ts"
    ]
  }
}
```

Após a configuração, você pode iniciar o servidor de desenvolvimento com o sinalizador `--hmr`.

```sh
node ace serve --hmr
```

Além disso, você pode querer atualizar o script `dev` dentro do arquivo `package.json` para usar este novo sinalizador.

```json
{
  "scripts": {
    "dev": "node ace serve --hmr"
  }
}
```

## Recargas completas vs HMR

:::note
Esta seção explica o funcionamento subjacente do `hot-hook`. Sinta-se à vontade para ignorá-la se não estiver com vontade de ler teoria técnica estendida 🤓

Ou, leia o [arquivo README](https://github.com/Julien-R44/hot-hook) do pacote se quiser uma explicação ainda mais aprofundada.
:::

Vamos entender quando o AdonisJS executará uma recarga completa (reiniciando o processo) e quando ele recarregará o módulo a quente.

### Criando uma árvore de dependências
Ao usar o sinalizador `--hmr`, o AdonisJS usará `hot-hook` para criar uma árvore de dependências do seu aplicativo começando pelo arquivo `bin/server.ts` e observará todos os arquivos que fazem parte dessa árvore de dependências.

Isso significa que se você criar um arquivo TypeScript no código-fonte do seu aplicativo, mas nunca importá-lo em nenhum lugar do seu aplicativo, esse arquivo não acionará nenhuma recarga. Ele será ignorado como se o arquivo não existisse.

### Identificando limites
Em seguida, `hot-hook` usará o array `boundaries` da configuração para identificar os arquivos que se qualificam para HMR.

Como regra geral, você nunca deve registrar arquivos de configuração, provedores de serviço ou arquivos de pré-carregamento como limites. Isso ocorre porque esses arquivos geralmente resultam em algum efeito colateral que ocorrerá novamente se os recarregarmos sem limpar os efeitos colaterais. Aqui estão alguns exemplos:

- O arquivo `config/database.ts` estabelece uma conexão com o banco de dados. Recarregar este arquivo a quente significa fechar a conexão existente e recriá-la. O mesmo pode ser alcançado reiniciando todo o processo sem adicionar nenhuma complexidade adicional.

- O arquivo `start/routes.ts` é usado para registrar as rotas. Recarregar este arquivo a quente significa remover rotas existentes registradas com o framework e registrá-las novamente. Novamente, reiniciar o processo é simples.

Em outras palavras, podemos dizer que os módulos importados/executados durante uma solicitação HTTP devem fazer parte dos limites HMR, e os módulos necessários para inicializar o aplicativo não devem ser.

### Executando recarregamentos
Depois que o `hot-hook` identificar os limites, ele executará o HMR para módulos importados dinamicamente que fazem parte do limite e reiniciará o processo para o restante dos arquivos.

