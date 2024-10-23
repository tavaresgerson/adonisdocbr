export default [
  {
      text: 'Prólogo',
      collapsed: false,
      items: [
        { text: 'AdonisJs em resumo', link: '/docs/01-prologue/01-adonisjs-at-a-glance.md' },
        { text: 'Guia de contribuição', link: '/docs/01-prologue/02-contribution-guide.md' },
        { text: 'Notas de lançamento', link: '/docs/01-prologue/03-release-notes.md' },
      ]
  },
  {
      text: 'Conceitos principais',
      collapsed: false,
      items: [
        { text: 'Padrão MVC', link: '/docs/02-core-concepts/01-mvc-pattern.md' },
        { text: 'IoC Container & Provedores de Serviço', link: '/docs/02-core-concepts/02-ioc-container.md' },
        { text: 'Ciclo de Vida da Aplicação', link: '/docs/02-core-concepts/04-application-lifecycle.md' },
      ]
  },
  {
      text: 'Começando',
      collapsed: false,
      items: [
        { text: 'Instalação', link: '/docs/03-getting-started/01-installation.md' },
        { text: 'Estrutura de diretórios', link: '/docs/03-getting-started/02-directory-structure.md' },
        { text: 'Configuração', link: '/docs/03-getting-started/03-configuration.md' },
        { text: 'Variáveis de Ambiente', link: '/docs/03-getting-started/04-env.md' },
        { text: 'Roteamento', link: '/docs/03-getting-started/05-routing.md' },
        { text: 'Requisição', link: '/docs/03-getting-started/06-request.md' },
        { text: 'Resposta', link: '/docs/03-getting-started/07-response.md' },
        { text: 'Middleware', link: '/docs/03-getting-started/08-middleware.md' },
        { text: 'Controladores', link: '/docs/03-getting-started/09-controllers.md' },
        { text: 'Arquivos', link: '/docs/03-getting-started/10-files.md' },
      ]
  },
  {
      text: 'Views',
      collapsed: false,
      items: [
        { text: 'Views', link: '/docs/04-views/01-views.md' },
        { text: 'Modelos Nunjucks', link: '/docs/04-views/02-templating.md' },
        { text: 'Construção de Formulário', link: '/docs/04-views/03-form-builder.md' },
      ]
  },
  {
      text: 'Banco de dados',
      collapsed: false,
      items: [
        { text: 'Configuração do Banco de Dados', link: '/docs/05-database/01-database-setup.md' },
        { text: 'Construtor de Consultas', link: '/docs/05-database/02-query-builder.md' },
        { text: 'Migrações', link: '/docs/05-database/03-migrations.md' },
        { text: 'Sementes e Fábricas', link: '/docs/05-database/04-seeds-and-factories.md' },
      ]
  },
  {
      text: 'Lucid',
      collapsed: false,
      items: [
        { text: 'Lucid', link: '/docs/06-lucid/01-lucid.md' },
        { text: 'Relações', link: '/docs/06-lucid/02-relationships.md' },
        { text: 'Hooks de Banco de Dados', link: '/docs/06-lucid/03-hooks.md' },
        { text: 'Getters & Setters', link: '/docs/06-lucid/04-getters-setters.md' },
      ]
  },
  {
      text: 'Ferramentas de Desenvolvimento Web',
      collapsed: false,
      items: [
        { text: 'Interativo Shell a.k.a. Ace', link: '/docs/07-common-web-tools/01-interactive-shell.md' },
        { text: 'Autenticação', link: '/docs/07-common-web-tools/02-authentication.md' },
        { text: 'Cookies', link: '/docs/07-common-web-tools/03-cookies.md' },
        { text: 'E-mail', link: '/docs/07-common-web-tools/04-mail.md' },
        { text: 'Tratamento de erros e exceções', link: '/docs/07-common-web-tools/07-exceptions.md' },
        { text: 'Eventos', link: '/docs/07-common-web-tools/08-events.md' },
        { text: 'Auxiliares', link: '/docs/07-common-web-tools/09-helpers.md' },
        { text: 'Sessões', link: '/docs/07-common-web-tools/10-sessions.md' },
        { text: 'Validação', link: '/docs/07-common-web-tools/11-validator.md' },
        { text: 'Redis', link: '/docs/07-common-web-tools/12-redis.md' },
        { text: 'Internacionalização', link: '/docs/07-common-web-tools/13-internationalization.md' },
        { text: 'Autenticação Social via Ally', link: '/docs/07-common-web-tools/14-social-auth.md' },
        { text: 'WebSocket', link: '/docs/07-common-web-tools/15-ws.md' },
      ]
  },
  {
      text: 'Tutorial',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/08-tutorial/01-getting-started.md' },
        { text: 'Rotas e Controladores', link: '/docs/08-tutorial/02-routes-and-controllers.md' },
        { text: 'Modelos de Banco de Dados', link: '/docs/08-tutorial/03-database-models.md' },
        { text: 'Lista de Postagens do Blog', link: '/docs/08-tutorial/04-list-blog-posts.md' },
        { text: 'Criando Artigos de Blog', link: '/docs/08-tutorial/05-creating-blog-posts.md' },
        { text: 'Finalizando', link: '/docs/08-tutorial/06-finishing-up.md' },
      ]
  },
  {
      text: 'Segurança',
      collapsed: false,
      items: [
        { text: 'Introdução', link: '/docs/09-security/01-security-intro.md' },
        { text: 'CORS', link: '/docs/09-security/02-cors.md' },
        { text: 'Proteção CSRF', link: '/docs/09-security/03-csrf-protection.md' },
        { text: 'Criptografia & Hashing', link: '/docs/09-security/04-encryption-and-hashing.md' },
        { text: 'Shield Middleware', link: '/docs/09-security/05-shield.md' },
        { text: 'Sanitização de dados', link: '/docs/09-security/06-data-sanitization.md' },
      ]
  }
]
