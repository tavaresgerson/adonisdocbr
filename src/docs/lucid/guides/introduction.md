# Introdução

O Lucid é um construtor de consultas SQL e um ORM do Active Record construído sobre o [Knex](https://knexjs.org/). O Lucid se esforça para alavancar o SQL em seu potencial máximo e oferece uma API limpa para muitas operações SQL avançadas.

A seguir estão alguns dos recursos selecionados do Lucid.

- Um construtor de consultas fluente construído sobre o Knex.
- Suporte para réplicas de leitura e gravação e gerenciamento de múltiplas conexões.
- Modelos baseados em classe que aderem ao padrão do Active Record.
- Sistema de migração para modificar o esquema do banco de dados usando conjuntos de alterações incrementais.
- Fábricas de modelos para gerar dados falsos para teste.
- Semeadores de banco de dados para inserir dados iniciais/fictícios no banco de dados.

## Um construtor de consultas fluente

A camada base do Lucid é um construtor de consultas fluente que você pode usar para construir consultas SQL usando uma API JavaScript. O construtor de consultas usa [Knex](https://knexjs.org/) por baixo dos panos e, portanto, ele suporta muitas operações SQL avançadas como **funções de janela**, **CTEs recursivas**, **operações JSON**, **bloqueios baseados em linha** e muito mais.

O Knex pode não ser o construtor de consultas mais moderno no ecossistema Node.js. No entanto, ele é maduro e testado em batalha.

Veja também: [Usando o construtor de consultas](./installation.md#basic-usage)

## Sistema de migração

Inspirado em frameworks como Laravel, Rails e Elixir Ecto, o AdonisJS não infere alterações de esquema de modelos. Em vez disso, ele faz você escrever os conjuntos de alterações incrementais para modificar o esquema do banco de dados. As migrações manuais podem parecer muita digitação. No entanto, a flexibilidade e o controle que elas fornecem são incomparáveis.

Temos experimentado que em aplicativos do mundo real, uma alteração de esquema não é apenas adicionar novas colunas. Às vezes, as alterações envolvem renomear colunas, preservar dados, criar uma nova tabela e copiar dados de uma tabela antiga. Tudo isso deve ser feito sem bloquear as tabelas por um longo período.

As migrações manuais garantem que você possa expressar alterações de esquema de acordo com os requisitos do seu aplicativo.

Veja também: [Criando migrações](../migrations/introduction.md)

## ORM de registro ativo

A camada ORM do AdonisJS usa classes JavaScript para definir modelos de dados. As classes podem definir ganchos de ciclo de vida, criar propriedades e métodos personalizados para encapsular a lógica de domínio e controlar o comportamento de serialização do modelo.

Você cria um modelo para cada tabela de banco de dados dentro do seu aplicativo e usa as APIs que os modelos oferecem para interagir com ele.

[Usando modelos](../models/introduction.md)

## Fábricas de modelos e seeders de banco de dados

As fábricas de modelos são usadas para gerar/persistir instâncias de modelo com dados falsos. Eles são úteis durante os testes, pois você pode encapsular a lógica de geração de dados fictícios em um só lugar e reutilizar fábricas nos testes.

Por outro lado, os seeders de banco de dados são usados ​​para semear o banco de dados com alguns valores iniciais. Esses valores podem ser dados fictícios que você deseja usar durante o desenvolvimento. Ou você pode usar seeders para configurar o estado inicial do seu aplicativo de produção com uma lista de países, usuários administradores e assim por diante.

[Fábricas de modelos](../models/model_factories.md)
[Seeders de banco de dados](./seeders.md)

## Lucid não é seguro para tipos

Lucid não é seguro para tipos. Vamos discutir o porquê.

A segurança de tipos com ORMs SQL é um tópico complexo, pois deve ser aplicado em várias camadas, como construção e saída de consultas.

Muitos construtores de consultas e ORMs são seguros para tipos apenas com a saída da consulta (às vezes, eles também limitam os recursos SQL), e apenas alguns são seguros para tipos com construção de consultas também. Kysely é um deles.

Eu [escrevi algumas centenas de palavras](https://github.com/thetutlage/meta/discussions/8) comparando Kysely e Drizzle ORM que podem ajudar você a entender corretamente as camadas de segurança de tipo.

Se tomarmos Kysely como o padrão ouro de segurança de tipo, perdemos muita flexibilidade com ele. Especialmente, de certa forma, estendemos e usamos Lucid em toda a base de código AdonisJS.

Na verdade, eu o usei para criar uma extensão para nosso módulo Auth e os auxiliares que os modelos Lucid podem usar. E falhei nas duas vezes. Os [criadores do Kysely também confirmaram](https://www.answeroverflow.com/m/1179612569774870548) que criar abstrações genéricas do Kysely é impossível.

Isso não quer dizer que Kysely seja limitante em primeiro lugar. Ele está limitando como queremos usar, ou seja, construir abstrações genéricas e integrá-las perfeitamente com o resto da estrutura. Kysely é uma ferramenta excelente para uso direto.

Dito isso, olhando para os recursos à nossa disposição e nossos objetivos, o Lucid não será tão seguro para tipos quanto o Kysely no futuro próximo. No entanto, podemos investir algum tempo para tornar certas partes do ORM seguras para tipos.
