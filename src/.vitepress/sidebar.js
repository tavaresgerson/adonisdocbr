export default [
  {
      text: 'Préfacio',
      collapsed: false,
      items: [
        { text: 'Sobre o AdonisJs', link: '/docs/01-Preface/01-about.md' },
        { text: 'Atualizando da versão 4.0', link: '/docs/01-Preface/02-upgrade-guide.md' },
        { text: 'Guia de Contribuição', link: '/docs/01-Preface/03-Contribution-Guide.md' },
      ]
  },
  {
      text: 'Conceitos',
      collapsed: false,
      items: [
        { text: 'Ciclo de vida da solicitação', link: '/docs/02-Concept/01-Request-Lifecycle.md' },
        { text: 'Contêiner IoC', link: '/docs/02-Concept/02-ioc-container.md' },
        { text: 'Provedores de serviço', link: '/docs/02-Concept/03-service-providers.md' },
        { text: 'Ignitor', link: '/docs/02-Concept/05-ignitor.md' },
      ]
  },
  {
      text: 'Começando',
      collapsed: false,
      items: [
        { text: 'Instalação', link: '/docs/03-getting-started/01-installation.md' },
        { text: 'Configuração', link: '/docs/03-getting-started/02-Configuration.md' },
        { text: 'Estrutura de diretório', link: '/docs/03-getting-started/03-Directory-Structure.md' },
      ]
  },
  {
      text: 'Básico',
      collapsed: false,
      items: [
        { text: 'Roteamento', link: '/docs/04-Basics/01-Routing.md' },
        { text: 'Middleware', link: '/docs/04-Basics/02-Middleware.md' },
        { text: 'Controladores', link: '/docs/04-Basics/03-Controllers.md' },
        { text: 'Solicitação', link: '/docs/04-Basics/04-Request.md' },
        { text: 'Resposta', link: '/docs/04-Basics/05-Response.md' },
        { text: 'Visualizações', link: '/docs/04-Basics/06-Views.md' },
        { text: 'Sessões', link: '/docs/04-Basics/07-Sessions.md' },
        { text: 'Validador', link: '/docs/04-Basics/08-Validation.md' },
        { text: 'Lidando com exceções', link: '/docs/04-Basics/09-Error-Handling.md' },
        { text: 'Logger', link: '/docs/04-Basics/10-Logger.md' },
      ]
  },
  {
      text: 'Segurança',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/05-Security/01-Getting-Started.md' },
        { text: 'Autenticação', link: '/docs/05-Security/02-Authentication.md' },
        { text: 'CORS', link: '/docs/05-Security/04-CORS.md' },
        { text: 'Proteção CSRF', link: '/docs/05-Security/05-CSRF-Protection.md' },
        { text: 'Criptografia e Hashing', link: '/docs/05-Security/06-Encryption.md' },
        { text: 'Shield Middleware', link: '/docs/05-Security/08-Shield-Middleware.md' },
      ]
  },
  {
      text: 'Indo mais fundo',
      collapsed: false,
      items: [
        { text: 'Comandos Ace', link: '/docs/06-Digging-Deeper/01-Ace-Commands.md' },
        { text: 'Eventos', link: '/docs/06-Digging-Deeper/02-Events.md' },
        { text: 'Estendendo o Core', link: '/docs/06-Digging-Deeper/03-Extending-the-Core.md' },
        { text: 'Uploads de arquivo', link: '/docs/06-Digging-Deeper/03-File-Uploads.md' },
        { text: 'Armazenamento de arquivos', link: '/docs/06-Digging-Deeper/04-File-Storage.md' },
        { text: 'Helpers', link: '/docs/06-Digging-Deeper/05-Helpers.md' },
        { text: 'Internacionalização', link: '/docs/06-Digging-Deeper/06-Internationalization.md' },
        { text: 'Mail', link: '/docs/06-Digging-Deeper/07-Mails.md' },
        { text: 'Autenticação Social', link: '/docs/06-Digging-Deeper/08-Social-Authentication.md' },
      ]
  },
  {
      text: 'Banco de Dados',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/07-Database/01-Getting-Started.md' },
        { text: 'Query Builder', link: '/docs/07-Database/02-Query-Builder.md' },
        { text: 'Migrações', link: '/docs/07-Database/03-Migrations.md' },
        { text: 'Seeds & Factories', link: '/docs/07-Database/04-Seeding.md' },
        { text: 'Redis', link: '/docs/07-Database/05-Redis.md' },
      ]
  },
  {
      text: 'Lucid ORM',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/08-Lucid-ORM/01-Getting-Started.md' },
        { text: 'Hooks', link: '/docs/08-Lucid-ORM/02-Hooks.md' },
        { text: 'Traits', link: '/docs/08-Lucid-ORM/03-Traits.md' },
        { text: 'Mutadores', link: '/docs/08-Lucid-ORM/04-Mutators.md' },
        { text: 'Relacionamentos', link: '/docs/08-Lucid-ORM/05-Relationships.md' },
        { text: 'Serialização', link: '/docs/08-Lucid-ORM/06-Serialization.md' },
      ]
  },
  {
      text: 'Websocket',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/09-WebSockets/01-Getting-Started.md' },
        { text: 'Filosofia', link: '/docs/09-WebSockets/02-Philosophy.md' },
        { text: 'API do servidor', link: '/docs/09-WebSockets/03-Server-API.md' },
        { text: 'API do cliente', link: '/docs/09-WebSockets/04-Client-API.md' },
      ]
  },
  {
      text: 'Testando',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/10-testing/01-Getting-Started.md' },
        { text: 'Testes HTTP', link: '/docs/10-testing/02-HTTP-Tests.md' },
        { text: 'Testes de navegador', link: '/docs/10-testing/03-browser-tests.md' },
        { text: 'Fakes', link: '/docs/10-testing/05-Fakes.md' },
      ]
  },
  {
      text: 'Receitas',
      collapsed: false,
      items: [
        { text: 'Proxy Nginx', link: '/docs/recipes/01-nginx-proxy.md' },
        { text: 'Usando domínios .dev', link: '/docs/recipes/02-dev-domains.md' },
        { text: 'Por que instalar o Adonis?', link: '/docs/recipes/04-why-adonis-install.md' },
        { text: 'Usando Https', link: '/docs/recipes/05-https.md' },
        { text: 'Jogo de adivinhação de números', link: '/docs/recipes/06-number-guessing-game.md' },
      ]
  }
]
