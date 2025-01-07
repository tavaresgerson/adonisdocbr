# Processo de lançamento

AdonisJS é uma coleção de vários pacotes first-party construídos em torno do [núcleo do framework](https://github.com/adonisjs/core). Sempre que você nos ouvir mencionando a versão do AdonisJS, assuma que estamos falando sobre a versão do núcleo do framework.

Todos os outros pacotes como `@adonisjs/lucid` ou `@adonisjs/mail` têm suas versões independentes e são livres para ter seu ciclo de lançamento.

## Seguindo semver
Seguimos rigorosamente [o versionamento semântico](https://semver.org/) e atualizamos a versão principal após cada mudança drástica. Isso significa que o que é AdonisJS 5 hoje pode rapidamente se tornar AdonisJS 8 em poucos meses.

- Atualizaremos a versão do patch ao lançar **correções críticas de bugs** (ex: 5.2.0 para 5.2.1).
- A versão secundária inclui **novos recursos** ou **correções de bugs não críticos**. Além disso, descontinuaremos APIs durante um lançamento secundário. (ex: 5.2.0 para 5.3.0)
- Ao lançar mudanças drásticas, nós elevamos a versão principal (ex: 5.2.0 para 6.0.0).

## Apresentando mudanças drásticas
À medida que o AdonisJS está amadurecendo, assumimos mais responsabilidade por não introduzir mudanças drásticas de vez em quando, e todas as mudanças drásticas **devem passar por uma fase de depreciação e RFC**.

Antes de introduzir qualquer mudança drástica, publicaremos um [RFC](https://github.com/adonisjs/rfcs) discutindo as motivações por trás da mudança. Se não houver uma resistência significativa, prosseguiremos com a mudança.

A fase inicial da mudança descontinuará as APIs existentes durante uma versão secundária. Executar seu aplicativo após essa mudança receberá muitos avisos, mas nada quebrará e continuará funcionando como está.

Após uma fase de resfriamento de no mínimo 4 semanas, removeremos as APIs descontinuadas durante a próxima versão principal. Remover o código antigo/morto é essencial para garantir que a base de código do framework seja bem mantida e não inchada com variações passadas.

As seguintes alterações não estão sujeitas a alterações drásticas.

- **APIs não documentadas e estruturas de dados internas** podem ser alteradas durante qualquer lançamento. Então, se você estiver contando com APIs não documentadas ou membros de classe privada, você estará por sua conta quando os alterarmos ou reestruturarmos.
- **Versões alfa e seguintes do AdonisJS** podem receber alterações drásticas sem um aumento de versão importante. Isso ocorre porque queremos a liberdade criativa para iterar rapidamente com base em nossos aprendizados no período alfa.

## Ciclo de lançamento
O AdonisJS segue aproximadamente um ciclo de lançamento de 8 semanas para enviar novos recursos ou publicar alterações drásticas. No entanto, correções críticas de bugs e patches de segurança geralmente são lançados imediatamente.

Você pode conferir nosso [roteiro no Trello](https://trello.com/b/3klaHbfP/adonisjs-roadmap) e [o que há no próximo cartão de lançamento](https://trello.com/c/y8PCAodY/47-september-planning-2021) para saber sobre as próximas mudanças.