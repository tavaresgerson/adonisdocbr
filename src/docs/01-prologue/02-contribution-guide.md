# Guia de Contribuição

Todos os projetos de código aberto são mantidos e apoiados por uma comunidade vibrante de usuários e colaboradores. Incentivamos você a participar ativamente no desenvolvimento e no futuro do AdonisJS, seja contribuindo com o código-fonte, melhorando a documentação ou relatando possíveis bugs.

## Canais

1. [Repositórios do GitHub](https://github.com/adonisjs) - Compartilhe os erros no repositório dedicado do AdonisJS. Tente nos ajudar com o problema exato e os requisitos para reproduzi-lo.
2. [Gitter](https://gitter.im/adonisjs/adonis-framework) - Faça perguntas ou discuta tópicos comuns com a gente aqui. Sinta-se à vontade para pular e compartilhar suas opiniões.
3. [Trello](https://trello.com/b/yzpqCgdl/adonis-for-humans) - O roteiro do AdonisJs. Tentamos mantê-lo atualizado com os planos e recursos que estão prestes a vir para o AdonisJs.
4. [Twitter](https://twitter.com/adonisframework) - A conta oficial do Twitter para ficar por dentro dos avanços que fazemos diariamente.

## Relatar Bugs

Sempre tente ser descritivo ao enviar problemas. Você deve fornecer contexto e informações suficientes para reproduzir o problema.

1. Compartilhe a versão do framework que você está usando. O AdonisJS é uma combinação de vários sub-módulos, e você pode encontrar as versões desses sub-módulos dentro do arquivo package.json do seu projeto.
2. Compartilhe um trecho de código em vez de dizer que "X" não está funcionando.
3. Será ótimo se você puder nos ajudar com um repositório de amostra com o código para reproduzir o problema.

## Estilo de codificação

JavaScript tem uma mão cheia de linters para manter seu estilo de codificação consistente. Nós usamos [JavaScript Standard Style](http://standardjs.com/) que é um módulo não configurável, tornando mais fácil aderir a um estilo de código consistente.

Cada módulo do AdonisJS instala o *Linter de Estilo Padrão* como dependência de desenvolvimento. Então, antes de enviar seu PR certifique-se de lintar seu código.

```bash
npm run lint
```

## Compartilhando PR's & Git Flow

Utilizamos o [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) para trabalhar em novos recursos e gerenciar lançamentos.

Abaixo estão as regras que seguimos todos os dias.

1. Quando começar a trabalhar, pense em um recurso ou problema que você está tentando resolver.
2. Fork o repositório.
3. Crie um novo branch de recurso do *branch de desenvolvimento*.
4. Trabalhe nele até se sentir confortável para criar um pull request.
5. Termine este recurso e envie-o para o seu repositório bifurcado
6. Crie um pull request de seu recurso para o repositório AdonisJs *branch develop*.
7. Se tudo estiver correto, vamos mesclar as alterações e agradecer a sua contribuição.

## Commitizen

Nós utilizamos o [Commitizen](https://commitizen.github.io/cz-cli) para seguir convenções de nomenclatura para mensagens de commit.
