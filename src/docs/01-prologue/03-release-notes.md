# Notas de Lançamento

## Como o Lançamento é Gerenciado?
O AdonisJs é uma combinação de vários pacotes npm chamados *Provedores de Serviços*. Todos os pacotes são livres para ter seu próprio ciclo de lançamento e versões. A combinação desses pacotes forma um lançamento para o AdonisJs. Em resumo, você deve verificar o número da versão no arquivo `package.json` do seu projeto para saber a versão atual.

## AdonisJs 3.2
O lançamento v3.2 é uma atualização menor com algumas correções de bugs e atualizações incrementais da API. Todos os recursos/métodos da *v3.1* são totalmente suportados e compatíveis com a *v3.2*. Abaixo está o changelog para módulos individuais.

#### adonis-framework (3.0.4 - 3.0.9)
Não há alterações notáveis ​​para este repositório e todos os recursos existentes da 3.1 continuarão a funcionar. Confira o [git changelog](https://github.com/adonisjs/adonis-framework/blob/develop/CHANGELOG.md)

#### adonis-lucid (3.0.8 - 3.0.13)
Abaixo está a lista de mudanças notáveis:

1. Adicione suporte para atualização e tabela dinâmica `belongsToMany` e busque colunas adicionais usando o método `withPivot`. [Confirmação relacionada](https://github.com/adonisjs/adonis-lucid/commit/1d00425)
2. A interface estática do modelo agora tem os métodos `first` e `last` para extrair a primeira e a última linhas de uma tabela relacionada a um modelo. [Commit relacionado](https://github.com/adonisjs/adonis-lucid/commit/2a74d6e)

```js
yield User.first()
yield User.last()
```

Confira o [git chanagelog](https://github.com/adonisjs/adonis-lucid/blob/develop/CHANGELOG.md) inteiro.

#### adonis-auth(1.0.5)
Abaixo está a lista de mudanças notáveis:

1. Agora você pode passar um objeto personalizado para o token JWT ao gerá-lo. Pode ser útil adicionar algumas meta informações ao token para serem lidas no lado do cliente. [Commit relacionado](https://github.com/adonisjs/adonis-auth/commit/2e413fe).

```js
// Salvar carga útil personalizada
yield request.auth.generate(user, {
  isAdmin: true
})

// Obter carga útil personalizada
const payload = yield request.auth.getPayload()
```

Confira o [git changelog](https://github.com/adonisjs/adonis-auth/blob/develop/CHANGELOG.md)

#### adonis-commands(2.1.5)
Não há mudanças notáveis ​​para este repositório e todos os recursos existentes do 3.1 continuarão funcionando. Confira o
Confira o [git chanagelog](https://github.com/adonisjs/adonis-commands/blob/develop/CHANGELOG.md) inteiro.
