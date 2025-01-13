---
summary: Contribuir para projetos AdonisJS é uma ótima maneira de retribuir à comunidade. Este guia fornece uma visão geral de como você pode contribuir para qualquer projeto AdonisJS.
---

# Contribuindo
Este é um guia geral de contribuição para todos os repositórios [AdonisJS](https://github.com/adonisjs). Leia este guia cuidadosamente antes de contribuir para qualquer um dos repositórios 🙏

O código não é a única maneira de contribuir. A seguir estão algumas maneiras de contribuir e se tornar parte da comunidade.

- Corrigindo erros de digitação na documentação
- Melhorando documentos existentes
- Escrevendo livros de receitas ou postagens de blog para educar outras pessoas na comunidade
- Triagem de problemas
- Compartilhando sua opinião sobre problemas existentes
- Ajude a comunidade no Discord e no fórum de discussões

## Relatando bugs
Muitos problemas relatados em projetos de código aberto geralmente são perguntas ou configurações incorretas do lado do relator. Portanto, recomendamos fortemente que você solucione seus problemas adequadamente antes de relatá-los.

Se você estiver relatando um bug, inclua o máximo de informações possível com os exemplos de código que você escreveu. A escala de problemas bons para ruins é a seguinte.

* **PROBLEMA PERFEITO**: Você isola o bug subjacente. Cria um teste com falha no repositório e abre um problema do Github em torno dele. [Por que as reproduções são necessárias](https://antfu.me/posts/why-reproductions-are-required).
* **PROBLEMA DECENTE**: Você declara corretamente seu problema. Compartilhe o código que produz o problema em primeiro lugar. Além disso, inclua os arquivos de configuração relacionados e a versão do pacote que você usa.

Por último, mas não menos importante, é formatar cada bloco de código corretamente seguindo o [guia de sintaxe de markdown do Github](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

*-* **PROBLEMA RUIM**: Você descarta a pergunta que tem na esperança de que a outra pessoa faça as perguntas relevantes e o ajude. Esses tipos de problemas são fechados automaticamente sem nenhuma explicação.

## Tendo uma discussão
Você geralmente quer discutir um tópico ou talvez compartilhar algumas ideias. Nesse caso, crie uma discussão no fórum de discussões na categoria **💡Ideias**.

## Educando outros
Educar outros é uma das melhores maneiras de contribuir para qualquer comunidade e ganhar reconhecimento.

Você pode usar a categoria **📚 Cookbooks** em nosso fórum de discussão para compartilhar um artigo com outras pessoas. A seção de cookbooks NÃO é estritamente moderada, exceto que o conhecimento compartilhado deve ser relevante para o projeto.

## Criando solicitações de pull
Nunca é uma boa experiência ter sua solicitação de pull recusada depois de investir muito tempo e esforço escrevendo o código. Portanto, recomendamos fortemente que você [inicie uma discussão](https://github.com/orgs/adonisjs/discussions) antes de começar qualquer novo trabalho do seu lado.

Basta iniciar uma discussão e explicar o que você está planejando contribuir?

- **Você está tentando criar um PR para corrigir um bug**: PRs para bugs são aceitos principalmente depois que o bug foi confirmado.
- **Você está planejando adicionar um novo recurso**: Explique detalhadamente por que esse recurso é necessário e compartilhe links para o material de aprendizagem que podemos ler para nos educar.

  Por exemplo: Se você estiver adicionando suporte para testes de snapshot para Japa ou AdonisJS. Então compartilhe os links que eu posso usar para aprender mais sobre testes de snapshot em geral.

> Nota: Você também deve estar disponível para abrir PRs adicionais para documentar o recurso ou melhoria contribuídos.

## Configuração do repositório

1. Comece clonando o repositório em sua máquina local.

    ```sh
    git clone <REPO_URL>
    ```

2. Instale dependências no seu local. Não atualize nenhuma dependência junto com uma solicitação de recurso. Se você encontrar dependências obsoletas, crie um PR separado para atualizá-las.

   Usamos `npm` para gerenciar dependências, portanto não use `yarn` ou qualquer outra ferramenta.

    ```sh
    npm install
    ```

3. Execute os testes executando o seguinte comando.

    ```sh
    npm test
    ```

## Ferramentas em uso
A seguir está a lista de ferramentas em uso.

| Ferramenta             | Uso                                                                                                                                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TypeScript             | Todos os repositórios são criados em TypeScript. O JavaScript compilado e as definições de tipo são publicados no npm. |
| TS Node                | Usamos [ts-node](https://typestrong.org/ts-node/) para executar testes ou scripts sem compilar TypeScript. O objetivo principal do ts-node é ter um loop de feedback mais rápido durante o desenvolvimento |
| SWC                    | [SWC](https://swc.rs/) é um compilador TypeScript baseado em Rust. O TS Node vem com suporte de primeira classe para usar SWC em vez do compilador oficial TypeScript. O principal motivo para usar SWC é o ganho de velocidade. |
| Release-It             | Usamos [release-it](https://github.com/release-it/release-it) para publicar nossos pacotes no npm. Ele faz todo o trabalho pesado de criar uma versão e publica no npm e no Github. Sua configuração é definida no arquivo `package.json`. |
| ESLint                 | O ESLint nos ajuda a impor um estilo de codificação consistente em todos os repositórios com vários colaboradores. Todas as nossas regras ESLint são publicadas no pacote [eslint-plugin-adonis](https://github.com/adonisjs-community/eslint-plugin-adonis). |
| Prettier               | Usamos o prettier para formatar a base de código para uma saída visual consistente. Se você está confuso sobre o motivo de usarmos o ESLint e o Prettier, leia o documento [Prettier vs. Linters](https://prettier.io/docs/en/comparison.html) no site do Prettier. |
| EditorConfig           | O arquivo `.editorconfig` na raiz de cada projeto configura seu editor de código para usar um conjunto de regras para recuo e gerenciamento de espaços em branco. Novamente, o Prettier é usado para pós-formatar seu código, e o Editorconfig é usado para configurar o editor com antecedência. |
| Conventional Changelog | Todos os commits em todos os repositórios usam [commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint) para impor mensagens de commit consistentes. |
| Husky                  | Usamos [husky](https://typicode.github.io/husky/#/) para impor convenções de commit ao fazer commit do código. Husky é um sistema de hooks git escrito em Node |

## Comandos

| Comando               | Descrição                         |
|-----------------------|-----------------------------------|
| `npm run test`        | Execute testes de projeto usando `ts-node` |
| `npm run compile`     | Compile o projeto TypeScript para JavaScript. A saída compilada é escrita dentro do diretório `build` |
| `npm run release`     | Inicie o processo de lançamento usando `np` |
| `npm run lint`        | Lint a base de código usando ESlint |
| `npm run format`      | Formate a base de código usando Prettier| 
| `npm run sync-labels` | Sincronize os rótulos definidos dentro do arquivo `.github/labels.json` com o Github. Este comando é somente para o administrador do projeto. |

## Estilo de codificação
Todos os nossos projetos são escritos em TypeScript e estão migrando para ESM puro.

[meu estilo de codificação aqui](https://github.com/thetutlage/meta/discussions/3)
[ESM e TypeScript aqui](https://github.com/thetutlage/meta/discussions/2)

Além disso, certifique-se de executar os seguintes comandos antes de enviar o código.

```sh
# Formatos usando prettier
npm run format

# Lints usando Eslint
npm run lint
```

## Sendo reconhecido como um colaborador
Contamos com o GitHub para listar todos os colaboradores do repositório no painel do lado direito do repositório. A seguir, um exemplo do mesmo.

Além disso, usamos o recurso [geração automática de notas de versão](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes#about-automatically-generated-release-notes) do Github, que adiciona uma referência ao perfil do colaborador nas notas de versão.
