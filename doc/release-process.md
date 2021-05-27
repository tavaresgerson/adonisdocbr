# Processo de Versionamento

AdonisJS é uma coleção de vários pacotes originais desenvolvidos em torno do núcleo da estrutura. Sempre que você nos ouvir mencionando 
a versão do AdonisJS, basta supor que estamos falando sobre a versão do núcleo do framework.

Todos os outros pacotes como `@adonisjs/lucid` ou `@adonisjs/mail` têm suas próprias versões independentes e são livres para ter 
seu próprio ciclo de lançamento.

### Versionamento Semântico
Seguiremos estritamente o [versionamento semântico](https://semver.org/). Isso também significa que o que é o Adonis 5 hoje, pode rapidamente se tornar o 
Adonis 8 em alguns meses, se introduzirmos e publicarmos novas alterações inovadoras.

+ Iremos alterar a versão do patch, ao lançar correções de bugs críticos (ex: 5.2.0 a 5.2.1).
+ A versão secundária inclui novos recursos ou correções de bugs não críticos . Além disso, suspenderemos o uso de APIs durante uma 
  versão secundária. (ex: 5.2.0 a 5.3.0)
+ Ao liberar as alterações importantes, aumentamos a versão principal (ex: 5.2.0 para 6.0.0).

### Apresentando mudanças importantes

À medida que o AdonisJS está amadurecendo, assumimos a responsabilidade de não introduzir alterações interruptivas de vez em quando e 
todas as alterações significativas devem passar por uma fase de suspensão de uso e [RFC](https://github.com/adonisjs/rfcs).

Antes de apresentar qualquer alteração significativa, publicaremos um RFC discutindo as motivações por trás da alteração. Se não houver um grande 
retrocesso, prosseguiremos com a mudança.

A fase inicial da mudança tornará obsoleta as APIs existentes durante uma versão secundária. Executar seu aplicativo após essa alteração receberá 
muitos avisos, mas nada irá quebrar e continuará a funcionar como está.

Após uma fase de resfriamento de no mínimo 4 semanas, durante a próxima versão principal, removeremos as APIs obsoletas. Remover o código 
antigo/depreciado é importante para garantir que a base de código do framework seja bem mantida e não inchada com todas as variações anteriores.

As seguintes alterações não estão sujeitas a alterações significativas.

+ APIs não documentadas e estruturas de dados internas podem ser alteradas durante qualquer versão. Portanto, se você está contando com 
  APIs não documentadas ou membros de classe privada, então você estará por conta própria quando os mudarmos ou reestruturarmos.
+ O Alpha e as próximas versões do AdonisJS podem receber alterações importantes sem um aumento na versão principal. Queremos a liberdade
  criativa para iterar rapidamente com base em nossos aprendizados no período alfa.
  
### Ciclo de liberação
O AdonisJS segue um ciclo de lançamento de 8 semanas para o envio de novos recursos ou publicação de mudanças importantes. As correções 
de bugs críticos e patches de segurança geralmente são lançados imediatamente.

Você pode conferir nosso roteiro no [Trello](https://trello.com/b/3klaHbfP/adonisjs-roadmap) e o que está no [próximo cartão de lançamento](https://trello.com/c/1qTLaVPl/44-may-2021) 
para saber sobre as próximas mudanças.
