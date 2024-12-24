# Guia de Contribuição

Todos os projetos Open Source são mantidos e apoiados por uma *comunidade vibrante* de usuários e colaboradores. Nós encorajamos você a participar ativamente do desenvolvimento e do futuro do AdonisJs, seja contribuindo com o código-fonte, melhorando a documentação ou relatando possíveis bugs.

## Canais

1. [Repositórios do Github](https://github.com/adonisjs) - Compartilhe bugs no repositório dedicado do AdonisJs. Tente nos ajudar com o problema exato e os requisitos para reproduzir esse problema.
2. [Gitter](https://gitter.im/adonisjs/adonis-framework) - Faça perguntas ou discuta tópicos comuns conosco aqui. Sinta-se à vontade para participar e compartilhar suas opiniões.
3. [Trello](https://trello.com/b/yzpqCgdl/adonis-for-humans) - O Roteiro do AdonisJs. Tentamos mantê-lo atualizado com os planos e recursos que estão prestes a entrar no AdonisJs.
4. [Twitter](https://twitter.com/adonisframework) - A conta oficial do Twitter para se manter atualizado com o progresso que fazemos a cada dia.

## Relatando bugs

Sempre tente ser descritivo ao enviar problemas. Você deve fornecer contexto e informações suficientes para reproduzir o problema.

1. Compartilhe a versão do framework em que você está. O AdonisJs é uma combinação de vários submódulos, e você pode encontrar as versões desses submódulos dentro do arquivo `package.json` do seu projeto.
2. Compartilhe um trecho de código em vez de dizer que `X` não está funcionando.
3. Seria ótimo se você pudesse nos ajudar com um repositório de amostra com o código para reproduzir o problema.

## Estilo de codificação

O JavaScript tem um punhado de linters para manter seu estilo de codificação consistente. Usamos o link:http://standardjs.com[JavaScript Standard Style, window="_blank"] que é um módulo não configurável, facilitando a manutenção de um estilo de código consistente.

Cada módulo do AdonisJs instala o *Standard Style Linter* como uma dependência de desenvolvimento. Portanto, antes de enviar seu PR, certifique-se de fazer o lint do seu código.

```bash
npm run lint
```

## Compartilhando PRs e Git Flow

Usamos o [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) para trabalhar em novos recursos e gerenciar lançamentos.

Abaixo estão as regras que seguimos todos os dias.

1. Quando começar a trabalhar, pense em um recurso ou problema que você está tentando corrigir.
2. Bifurque o repositório.
3. Crie uma nova ramificação de recurso a partir do *develop branch*.
4. Trabalhe nisso até se sentir confortável para criar uma solicitação de pull.
5. Finalize este recurso e envie para seu repositório bifurcado
6. Crie uma solicitação de pull do seu recurso para o repositório AdonisJs *develop branch*.
7. Se tudo estiver bem, mesclaremos as alterações e agradeceremos por sua contribuição.

## Commitizen

Usamos [Commitizen](https://commitizen.github.io/cz-cli) para seguir as convenções de nomenclatura para mensagens de commit.
