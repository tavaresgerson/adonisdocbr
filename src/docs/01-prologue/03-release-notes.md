# Notas de lançamento

## Como é Gerenciado o Lançamento?
AdonisJs é uma combinação de vários pacotes npm chamados *Provedores de serviço*. Todos os pacotes são livres para ter seu próprio ciclo de lançamento e versões. A combinação desses pacotes forma um lançamento para AdonisJs. Em resumo, você deve olhar para o número da versão no arquivo `package.json` do seu projeto para saber a versão atual.

## AdonisJs 3.2
A atualização v3.2 é uma atualização menor com algumas correções de bugs e atualizações incrementais da API. Todos os recursos/métodos do *v3.1* são totalmente suportados e compatíveis com o *v3.2*. Abaixo está o log de alterações para módulos individuais.

#### adonis-framework (3.0.4 - 3.0.9)
Não há alterações notáveis para este repositório e todos os recursos existentes do 3.1 continuarão a funcionar. Verifique o [log de alterações do git](https://github.com/adonisjs/adonis-framework/blob/develop/)

#### adonis-lucid (3.0.8 - 3.0.13)
Abaixo está a lista das alterações notáveis:

1. Adicione suporte para atualizar e `belongsToMany` tabela pivot e buscar colunas adicionais usando o método `withPivot`. [Commit relacionado](https://github.com/adonisjs/adonis-lucid/commit/1d00425)
2. O modelo de interface estática agora possui os métodos 'first' e 'last' para buscar as primeiras e últimas linhas de uma tabela relacionada a um modelo. [Commit relacionado](https://github.com/adonisjs/adonis-lucid/commit/2a74d6e)

```js
yield User.first()
yield User.last()
```

Confira o [changelog completo](https://github.com/adonisjs/adonis-lucid/blob/develop/) do repositório.

#### adonis-auth(1.0.5)
Abaixo está a lista das alterações notáveis:

Você pode passar objetos personalizados para o JWT quando ele está sendo gerado, isso pode ser útil para adicionar alguma informação meta ao token que será lida no lado do cliente. [Commit relacionado](https://github.com/adonisjs/adonis-auth/commit/2e413fe).

```js
// Save custom payload
yield request.auth.generate(user, {
  isAdmin: true
})

// Get custom payload
const payload = yield request.auth.getPayload()
```

Confira o [changelog completo](https://github.com/adonisjs/adonis-auth/blob/develop/)

### adonis-commands(2.1.5)
Não há alterações notáveis para este repositório e todos os recursos existentes do 3.1 continuarão a funcionar. Verifique o arquivo README.md na raiz deste repositório para obter mais detalhes sobre as alterações feitas nesta versão.

Confira o [log de alterações do git](https://github.com/adonisjs/adonis-commands/blob/develop/changelog.md).
