---
title: Contribution Guide
category: Preface
---

# Guia de Contribuição

Projetos Open Source são mantidos e apoiados por uma **comunidade vibrante** de usuários e colaboradores.

Nós encorajamos você a participar ativamente do desenvolvimento e do futuro do AdonisJs, seja contribuindo com o código-fonte, melhorando a documentação, relatando possíveis bugs e/ou testando novos recursos.

## Canais

Há muitas maneiras de se comunicar com a equipe do AdonisJs.

1. [Repositórios do Github](https://github.com/adonisjs): Compartilhe bugs ou crie solicitações de recursos nos repositórios dedicados do AdonisJs.
2. [Fórum](https://forum.adonisjs.com): Faça perguntas, mostre seu projeto e participe da vida do AdonisJs Framework.
3. [Discord](https://discord.gg/vDcEjq6): Junte-se ao nosso servidor Discord para bater papo instantaneamente com outras pessoas na comunidade.
4. [Twitter](https://twitter.com/adonisframework): Fique em contato com o progresso que fazemos a cada dia e seja informado sobre projetos incríveis fornecidos pela comunidade.

## Relatórios de bugs

Fornecer um ótimo relatório de bugs pode parecer simples à primeira vista.

Sempre tente ser descritivo e fornecer contexto e informações suficientes para reproduzir o problema.

Relatórios de bugs também podem ser enviados na forma de uma solicitação de pull contendo um teste com falha.

1. Forneça um título e uma descrição claros do problema.
2. Compartilhe a versão do framework em que você está.
3. Adicione o máximo de amostras de código possível para demonstrar o problema. Você também pode fornecer um repositório completo para reproduzir o problema rapidamente.

Lembre-se, relatórios de bugs não significam que o bug será corrigido em uma hora!

Serve para você e para a comunidade em geral começar o caminho para corrigir o problema antes de relatá-lo.

## Estilo de codificação

Infelizmente, o JavaScript não tem nenhum estilo de codificação oficial.

Por esse motivo, o AdonisJs usa [StandardJS](https://standardjs.com/) para ajudar a manter uma base de código legível e consistente.

Certifique-se de fazer o lint do seu código antes de enviar solicitações de pull para qualquer repositório do AdonisJs:

```bash
npm run lint
```

## Documentação

Ao adicionar um novo recurso ao núcleo do framework, certifique-se de criar uma solicitação de pull paralela no [repositório de documentação](https://github.com/adonisjs/docs) e vinculá-los.

Isso ajudará a equipe do AdonisJs a entender seu recurso e manter a documentação atualizada.

## Testes

Antes de fornecer uma solicitação de pull, certifique-se de testar o recurso que você está adicionando ou crie um teste de regressão para mostrar como um pedaço de código falha em circunstâncias específicas ao fornecer uma correção de bug.
