# Guia de Contribuição
Os projetos de código aberto são mantidos e apoiados por uma comunidade vibrante de usuários e colaboradores.

Nós encorajamos você a participar ativamente no desenvolvimento e no futuro da AdonisJs, seja contribuindo com o código-fonte, 
melhorando a documentação, reportando possíveis bugs e/ou testando novos recursos.

## Canais
Há muitas maneiras de se comunicar com a equipe do AdonisJs.

* [Repositórios do Github](https://github.com/adonisjs): Compartilhe bugs ou crie solicitações de recursos contra os repositórios do AdonisJs dedicados.
* [Fórum](https://forum.adonisjs.com/): Faça perguntas, mostre seu projeto e participe da vida do AdonisJs Framework.
* [Discord](https://discord.gg/vDcEjq6): Junte-se ao nosso Discord Server para conversar instantaneamente com outras pessoas da comunidade.
* [Twitter](https://twitter.com/adonisframework): Mantenha-se em contato com o progresso que fazemos todos os dias e ser informado sobre os incríveis projetos 
fornecidos pela comunidade.

## Reportando problemas
Fornecer um ótimo relatório de erros pode parecer simples à primeira vista.

Sempre tente ser descritivo e fornecer contexto e informações suficientes para reproduzir o problema.

Os relatórios de erros também podem ser enviados na forma de uma solicitação pull contendo um teste com falha.

* Forneça um título e uma descrição claros do problema.
* Compartilhe a versão do framework em que você está.
* Adicione o máximo de amostras de código possível para demonstrar o problema. Você também pode fornecer um repositório completo para reproduzir o problema rapidamente.

Lembre-se de que os relatórios de bugs não significam que o bug será corrigido em uma hora!

Ele serve a si mesmo e à comunidade mais ampla para iniciar o caminho da correção do problema antes de denunciá-lo.

## Estilo de código
Infelizmente, o JavaScript não possui nenhum estilo oficial de codificação.

Por esse motivo, o AdonisJs usa o [StandardJS](https://standardjs.com/) para ajudar a manter uma base de código legível e consistente.

Por favor, assegure-se de limpar o seu código antes de enviar pedidos pull para qualquer repositório AdonisJs:
``` shell
npm run lint
```

## Documentação
Ao adicionar um novo recurso ao núcleo da estrutura, certifique-se de criar uma pull request paralelo no repositório de 
documentação e vinculá-lo.

Isso ajudará a equipe do AdonisJs a entender seu recurso e manter a documentação atualizada.

## Testando
Antes de fornecer uma solicitação pull, certifique-se de testar o recurso que você está adicionando ou crie um teste de 
regressão para mostrar como uma parte do código falha sob uma circunstância específica, enquanto fornece uma correção de bug.
