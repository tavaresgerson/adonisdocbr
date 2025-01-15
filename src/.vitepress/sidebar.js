export default [
  {
    text: 'Prefácio',
    collapsed: false,
    items: [
        {
          text: 'Introdução',
          link: '/docs/preface/introduction.md',
        },
        {
          text: 'FAQs',
          link: '/docs/preface/faqs.md',
        },
        {
          text: 'Governança',
          link: '/docs/preface/governance.md',
        },
        {
          text: 'Contribuindo',
          link: '/docs/preface/contribution-guide.md',
        }
      ],
    },
    {
      text: 'Começando',
      collapsed: true,
      items: [
          {
            text: 'Instalação',
            link: '/docs/getting-started/installation.md',
          },
          {
            text: 'Configuração',
            link: '/docs/getting-started/configuration.md',
          },
          {
            text: 'Variáveis de ambiente',
            link: '/docs/getting-started/environment-variables.md',
          },
          {
            text: 'Estrutura de pastas',
            link: '/docs/getting-started/folder-structure.md',
          },
          {
            text: 'Implantação',
            link: '/docs/getting-started/deployment.md',
          }
      ],
    },
    {
      text: 'Conceitos',
      collapsed: true,
      items: [
          {
            text: 'Arquivo AdonisRC',
            link: '/docs/concepts/adonisrc-file.md',
          },
          {
            text: 'Armazenamento local assíncrono',
            link: '/docs/concepts/async-local-storage.md',
          },
          {
            text: 'Ganchos do Assembler',
            link: '/docs/concepts/assembler-hooks.md',
          },
          {
            text: 'Aplicativo',
            link: '/docs/concepts/application.md',
          },
          {
            text: 'Ciclo de vida do aplicativo',
            link: '/docs/concepts/application-lifecycle.md',
          },
          {
            text: 'Provedores de configuração',
            link: '/docs/concepts/config-providers.md',
          },
          {
            text: 'Serviços de contêiner',
            link: '/docs/concepts/container-services.md',
          },
          {
            text: 'Injeção de dependência (DI)',
            link: '/docs/concepts/dependency-injection.md',
          },
          {
            text: 'Estendendo o framework',
            link: '/docs/concepts/extending-the-framework.md',
          },
          {
            text: 'Hot module replacement (HMR)',
            link: '/docs/concepts/hmr.md',
          },
          {
            text: 'Visão geral do HTTP',
            link: '/docs/concepts/http-overview.md',
          },
          {
            text: 'Contexto HTTP',
            link: '/docs/concepts/http-context.md',
          },
          {
            text: 'Provedores de serviços',
            link: '/docs/concepts/service-providers.md',
          },
          {
            text: 'Scaffolding',
            link: '/docs/concepts/scaffolding.md',
          },
          {
            text: 'Configuração de ferramentas',
            link: '/docs/concepts/tooling-config.md',
          },
          {
            text: 'Processo de construção do TypeScript',
            link: '/docs/concepts/typescript-build-process.md',
          }
      ],
    },
    {
      text: 'Básico',
      collapsed: true,
      items: [
          {
            text: 'Roteamento',
            link: '/docs/basics/routing.md',
          },
          {
            text: 'Controladores',
            link: '/docs/basics/controllers.md',
          },
          {
            text: 'Middleware',
            link: '/docs/basics/middleware.md',
          },
          {
            text: 'Body parser',
            link: '/docs/basics/body-parser.md',
          },
          {
            text: 'Request',
            link: '/docs/basics/request.md',
          },
          {
            text: 'Response',
            link: '/docs/basics/response.md',
          },
          {
            text: 'Validação',
            link: '/docs/basics/validation.md',
          },
          {
            text: 'Uploads de arquivo',
            link: '/docs/basics/file-uploads.md',
          },
          {
            text: 'Sessão',
            link: '/docs/basics/session.md',
          },
          {
            text: 'Cookies',
            link: '/docs/basics/cookies.md',
          },
          {
            text: 'Tratamento de exceções',
            link: '/docs/basics/exception-handling.md',
          },
          {
            text: 'Depuração',
            link: '/docs/basics/debugging.md',
          },
          {
            text: 'Vite',
            link: '/docs/basics/vite.md',
          },
          {
            text: 'Servidor de arquivos estáticos',
            link: '/docs/basics/static-file-server.md',
          }
      ],
    },
    {
      text: 'Banco de dados',
      collapsed: true, 
      items: [
          {
            text: 'Introdução',
            link: '/docs/database/introduction.md',
          },
          {
            text: 'Lucid',
            link: '/docs/database/lucid.md',
          },
          {
            text: 'Redis',
            link: '/docs/database/redis.md',
          }
      ],
    },
    {
      text: 'Autenticação',
      collapsed: true,
      items: [
        {
          text: 'Introdução',
          link: '/docs/authentication/introduction.md',
        },
        {
          text: 'Verificando as credênciais do usuário',
          link: '/docs/authentication/verifying-user-credentials.md',
        },
        {
          text: 'Guarda de sessão',
          link: '/docs/authentication/session-guard.md',
        },
        {
          text: 'Guarda de tokens de acesso',
          link: '/docs/authentication/access-tokens-guard.md',
        },
        {
          text: 'Proteção de autenticação básica',
          link: '/docs/authentication/basic-auth-guard.md',
        },
        {
          text: 'Guarda de autenticação personalizado',
          link: '/docs/authentication/custom-auth-guard.md',
        },
        {
          text: 'Autenticação social',
          link: '/docs/authentication/social-authentication.md',
        }
      ],
    },
    {
      text: 'Security',
      collapsed: true,
      items: [
        {
          text: 'Autorização',
          link: '/docs/security/authorization.md',
        },
        {
          text: 'Criptografia',
          link: '/docs/security/encryption.md',
        },
        {
          text: 'Hashing',
          link: '/docs/security/hashing.md',
        },
        {
          text: 'CORS',
          link: '/docs/security/cors.md',
        },
        {
          text: 'Protegendo aplicativos SSR pelo servidor',
          link: '/docs/security/securing-ssr-applications.md',
        },
        {
          text: 'Limitação de taxa',
          link: '/docs/security/rate-limiting.md',
        }
      ],
    },
    {
      text: 'Views & Templates',
      collapsed: true,
      items: [
          {
            text: 'Introdução',
            link: '/docs/views-and-templates/introduction.md',
          },
          {
            text: 'EdgeJS',
            link: '/docs/views-and-templates/edgejs.md',
          },
          {
            text: 'Inertia',
            link: '/docs/views-and-templates/inertia.md',
          }
      ],
    },
    {
      text: 'Testando',
      collapsed: true,
      items: [
        {
          text: 'Introdução',
          link: '/docs/testing/introduction.md',
        },
        {
          text: 'Testes HTTP',
          link: '/docs/testing/http-tests.md',
        },
        {
          text: 'Testes de navegador',
          link: '/docs/testing/browser-tests.md',
        },
        {
          text: 'Testes de console',
          link: '/docs/testing/console-tests.md',
        },
        {
          text: 'Testes de banco de dados',
          link: '/docs/testing/database.md',
        },
        {
          text: 'Mocks & Fakes',
          link: '/docs/testing/mocks-and-fakes.md',
        }
      ],
    },
    {
      text: 'Cavando mais fundo',
      collapsed: true,
      items: [
        {
          text: 'Drive',
          link: '/docs/digging-deeper/drive.md',
        },
        {
          text: 'Emitter',
          link: '/docs/digging-deeper/emitter.md',
        },
        {
          text: 'Health checks',
          link: '/docs/digging-deeper/health-checks.md',
        },
        {
          text: 'I18n',
          link: '/docs/digging-deeper/i18n.md',
        },
        {
          text: 'Locks',
          link: '/docs/digging-deeper/locks.md',
        },
        {
          text: 'Logger',
          link: '/docs/digging-deeper/logger.md',
        },
        {
          text: 'Mail',
          link: '/docs/digging-deeper/mail.md',
        },
        {
          text: 'Transmit',
          link: '/docs/digging-deeper/transmit.md',
        },
        {
          text: 'Repl',
          link: '/docs/digging-deeper/repl.md',
        }
      ],
    },
    {    
      text: 'Ace commands',
      collapsed: true,
      items: [
          {
            text: 'Introdução',
            link: '/docs/ace/introduction.md',
          },
          {
            text: 'Criando comandos',
            link: '/docs/ace/creating-commands.md',
          },
          {
            text: 'Argumentos de comando',
            link: '/docs/ace/args.md',
          },
          {
            text: 'Sinalizadores de comando',
            link: '/docs/ace/flags.md',
          },
          {
            text: 'Prompts',
            link: '/docs/ace/prompts.md',
          },
          {
            text: 'Terminal UI',
            link: '/docs/ace/tui.md',
          }
      ],
    },
    {
      text: 'Referências',
      collapsed: true,
      items: [
        {
          text: 'Comandos',
          link: '/docs/references/commands.md',
        },
        {
          text: 'Auxiliares e tags do Edge',
          link: '/docs/references/edge.md',
        },
        {
          text: 'Eventos',
          link: '/docs/references/events.md',
        },
        {
          text: 'Exceções',
          link: '/docs/references/exceptions.md',
        },
        {
          text: 'Helpers',
          link: '/docs/references/helpers.md',
        }
      ]
    },
    {
      text: 'Lucid',
      collapsed: true,
      items: [
        {
          text: 'Guias',
          collapsed: false,
          items: [
            {
              text: 'Introdução',
              link: '/docs/lucid/guides/introduction.md',
            },
            {
              text: 'Instalação e uso',
              link: '/docs/lucid/guides/installation.md',
            },
            {
              text: 'Depuração',
              link: '/docs/lucid/guides/debugging.md',
            },
            {
              text: 'Transações',
              link: '/docs/lucid/guides/transactions.md',
            },
            {
              text: 'Paginação',
              link: '/docs/lucid/guides/pagination.md',
            },
            {
              text: 'Seeders de banco de dados',
              link: '/docs/lucid/guides/seeders.md',
            },
            {
              text: 'Regras de validação',
              link: '/docs/lucid/guides/validation.md',
            },
          ]
        },
        {
          text: 'Construtores de consultas',
          collapsed: false,
          items: [
            {
              text: 'Select query builder',
              link: '/docs/lucid/query_builders/select.md',
            },
            {
              text: 'Insert query builder',
              link: '/docs/lucid/query_builders/insert.md',
            },
            {
              text: 'Raw query builder',
              link: '/docs/lucid/query_builders/raw.md',
            },    
          ]
        },
        {
          text: 'Migrações',
          collapsed: false,
          items: [
            {
              text: 'Introdução',
              link: '/docs/lucid/migrations/introduction.md',
            },
            {
              text: 'Schema builder',
              link: '/docs/lucid/migrations/schema_builder.md',
            },
            {
              text: 'Construtor de tabelas',
              link: '/docs/lucid/migrations/table_builder.md',
            },
          ]
        },
        {
          text: 'Modelos',
          collapsed: false,
          items: [
            {
              text: 'Introdução',
              link: '/docs/lucid/models/introduction.md',
            },
            {
              text: 'Operações CRUD',
              link: '/docs/lucid/models/crud_operations.md',
            },
            {
              text: 'Hooks',
              link: '/docs/lucid/models/hooks.md',
            },
            {
              text: 'Construtor de consultas de modelo',
              link: '/docs/lucid/models/query_builder.md',
            },
            {
              text: 'Estratégia de nomenclatura',
              link: '/docs/lucid/models/naming_strategy.md',
            },
            {
              text: 'Escopos de consulta',
              link: '/docs/lucid/models/query_scopes.md',
            },
            {
              text: 'Serializando modelos',
              link: '/docs/lucid/models/serializing_models.md',
            },
            {
              text: 'Relacionamentos',
              link: '/docs/lucid/models/relationships.md',
            },
            {
              text: 'Fábricas de modelos',
              link: '/docs/lucid/models/model_factories.md',
            }
          ]
        }
      ]
    },
]
