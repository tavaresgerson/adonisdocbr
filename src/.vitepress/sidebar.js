export default [
  {
      text: 'Início',
      collapsed: false,
      items: [
        { text: 'Instalação', link: '/docs/guides/introduction.md' },
        { text: 'Introdução', link: '/docs/guides/installation.md' },
        { text: 'Processo de lançamento', link: '/docs/guides/release-process.md' },
      ]
  },
  {
      text: 'Fundamentos',
      collapsed: true,
      items: [
        { text: 'Aplicação', link: '/docs/guides/fundamentals/application.md' },
        { text: 'Arquivo AdonisRC', link: '/docs/guides/fundamentals/adonisrc-file.md' },
        { text: 'Config', link: '/docs/guides/fundamentals/config.md' },
        { text: 'Variáveis ​​de ambiente', link: '/docs/guides/fundamentals/environment-variables.md' },
        { text: 'Processo de construção do TypeScript', link: '/docs/guides/fundamentals/typescript-build-process.md' },
        { text: 'Implantação', link: '/docs/guides/fundamentals/deployment.md' },
        { text: 'Armazenamento local assíncrono', link: '/docs/guides/fundamentals/async-local-storage.md' },
      ]
  },
  {
    text: 'HTTP',
    collapsed: true,
    items: [
      {
        text: 'Contexto',
        link: '/docs/guides/http/context.md'
      },
      {
        text: 'Roteamento',
        link: '/docs/guides/http/routing.md'
      },
      {
        text: 'Controladores',
        link: '/docs/guides/http/controllers.md'
      },
      {
        text: 'Solicitação',
        link: '/docs/guides/http/request.md'
      },
      {
        text: 'Resposta',
        link: '/docs/guides/http/response.md'
      },
      {
        text: 'Uploads de arquivo',
        link: '/docs/guides/http/file-uploads.md'
      },
      {
        text: 'Uploads diretos de arquivo',
        link: '/docs/guides/http/direct-file-uploads.md'
      },
      {
        text: 'Middleware',
        link: '/docs/guides/http/middleware.md'
      },
      {
        text: 'Cookies',
        link: '/docs/guides/http/cookies.md'
      },
      {
        text: 'Sessão',
        link: '/docs/guides/http/session.md'
      },
      {
        text: 'Ativos estáticos',
        link: '/docs/guides/http/static-assets.md'
      },
      {
        text: 'Gerenciador de ativos',
        link: '/docs/guides/http/assets-manager.md'
      },
      {
        text: 'Tratamento de exceções',
        link: '/docs/guides/http/exception-handling.md'
      }
    ]
  },
  {
    text: 'Views & Templates',
    collapsed: true,
    items: [
      {
        text: 'Introdução',
        link: '/docs/guides/views/introduction.md'
      },
      {
        text: 'Renderização',
        link: '/docs/guides/views/rendering.md'
      },
      {
        text: 'Sintaxe do template',
        link: '/docs/guides/views/templating-syntax.md'
      },
      {
        text: 'Fluxo de dados',
        link: '/docs/guides/views/data-flow.md'
      },
      {
        text: 'Condicionais',
        link: '/docs/guides/views/conditionals.md'
      },
      {
        text: 'Loops',
        link: '/docs/guides/views/loops.md'
      },
      {
        text: 'Parciais',
        link: '/docs/guides/views/partials.md'
      },
      {
        text: 'Layouts',
        link: '/docs/guides/views/layouts.md'
      },
      {
        text: 'Componentes',
        link: '/docs/guides/views/components.md'
      },
      {
        text: 'Mutações',
        link: '/docs/guides/views/mutations.md'
      },
      {
        text: 'Depuração',
        link: '/docs/guides/views/debugging.md'
      }
    ]
  },
  {
    text: 'Validador',
    collapsed: true,
    items: [
      {
        text: 'Introdução',
        link: '/docs/guides/validator/introduction.md'
      },
      {
        text: 'Mensagens personalizadas',
        link: '/docs/guides/validator/custom-messages.md'
      },
      {
        text: 'Relatores de erros',
        link: '/docs/guides/validator/error-reporters.md'
      },
      {
        text: 'Cache de esquema',
        link: '/docs/guides/validator/schema-caching.md'
      },
      {
        text: 'Regras de validação personalizadas',
        link: '/docs/guides/validator/custom-rules.md'
      }
    ]
  },
  {
    text: 'Banco de Dados',
    collapsed: true,
    items: [
      {
        text: 'Introdução',
        link: '/docs/guides/database/introduction.md'
      },
      {
        text: 'Construtor de consultas',
        link: '/docs/guides/database/query-builder.md'
      },
      {
        text: 'Transações',
        link: '/docs/guides/database/transactions.md'
      },
      {
        text: 'Paginação',
        link: '/docs/guides/database/pagination.md'
      },
      {
        text: 'Migrações de esquema',
        link: '/docs/guides/database/migrations.md'
      },
      {
        text: 'Semeadores de banco de dados',
        link: '/docs/guides/database/seeders.md'
      },
      {
        text: 'Depuração',
        link: '/docs/guides/database/debugging.md'
      }
    ]
  },
  {
    text: 'ORM',
    collapsed: true,
    items: [
      {
        text: 'Introdução',
        link: '/docs/guides/models/introduction.md'
      },
      {
        text: 'Operações CRUD',
        link: '/docs/guides/models/crud.md'
      },
      {
        text: 'Ganchos',
        link: '/docs/guides/models/hooks.md'
      },
      {
        text: 'Escopos de consulta',
        link: '/docs/guides/models/query-scopes.md'
      },
      {
        text: 'Serializando modelos',
        link: '/docs/guides/models/serialization.md'
      },
      {
        text: 'Relacionamentos',
        link: '/docs/guides/models/relationships.md'
      },
      {
        text: 'Fábricas de modelos',
        link: '/docs/guides/models/factories.md'
      }
    ]
  },
  {
    text: 'Autenticação',
    collapsed: true,
    items: [
      {
        text: 'Introdução',
        link: '/docs/guides/auth/introduction.md'
      },
      {
        text: 'Web guard',
        link: '/docs/guides/auth/web-guard.md'
      },
      {
        text: 'Tokens de API',
        link: '/docs/guides/auth/api-tokens-guard.md'
      },
      {
        text: 'Autenticação básica',
        link: '/docs/guides/auth/basic-auth-guard.md'
      },
      {
        text: 'Middleware de autenticação',
        link: '/docs/guides/auth/middleware.md'
      },
      {
        text: 'Autenticação social',
        link: '/docs/guides/auth/social.md'
      },
      {
        text: 'Provedor de usuário personalizado',
        link: '/docs/guides/auth/custom-user-provider.md'
      }
    ]
  },
  {
    text: 'Segurança',
    collapsed: true,
    items: [
      {
        text: 'Segurança da Web',
        link: '/docs/guides/security/web-security.md'
      },
      {
        text: 'CORS',
        link: '/docs/guides/security/cors.md'
      },
      {
        text: 'Criptografia',
        link: '/docs/guides/security/encryption.md'
      },
      {
        text: 'Hashing',
        link: '/docs/guides/security/hashing.md'
      },
      {
        text: 'URLs assinadas',
        link: '/docs/guides/security/signed-urls.md'
      }
    ]
  },
  {
    text: 'Testando',
    collapsed: true,
    items: [
      {
        text: 'Introdução',
        link: '/docs/guides/testing/introduction.md'
      },
      {
        text: 'Testes HTTP',
        link: '/docs/guides/testing/http-tests.md'
      },
      {
        text: 'Mocking e Fakes',
        link: '/docs/guides/testing/fakes.md'
      }
    ]
  },
  {
    text: 'Cavando mais fundo',
    collapsed: true,
    items: [
      {
        text: 'Autorização',
        link: '/docs/guides/digging-deeper/authorization.md'
      },
      {
        text: 'Drive',
        link: '/docs/guides/digging-deeper/drive.md'
      },
      {
        text: 'Internacionalização',
        link: '/docs/guides/digging-deeper/i18n.md'
      },
      {
        text: 'Ace',
        link: '/docs/guides/digging-deeper/ace.md'
      },
      {
        text: 'AdonisJS REPL',
        link: '/docs/guides/digging-deeper/repl.md'
      },
      {
        text: 'Logger',
        link: '/docs/guides/digging-deeper/logger.md'
      },
      {
        text: 'Eventos',
        link: '/docs/guides/digging-deeper/events.md'
      },
      {
        text: 'Helpers',
        link: '/docs/guides/digging-deeper/helpers.md'
      },
      {
        text: 'Mailer',
        link: '/docs/guides/digging-deeper/mailer.md'
      },
      {
        text: 'Redis',
        link: '/docs/guides/digging-deeper/redis.md'
      },
      {
        text: 'Verificação de saúde',
        link: '/docs/guides/digging-deeper/health-check.md'
      },
      {
        text: 'Limitação de taxa',
        link: '/docs/guides/digging-deeper/rate-limiting.md'
      },
      {
        text: 'Route Model Binding',
        link: '/docs/guides/digging-deeper/route-model-binding.md'
      }
    ]
  },

  {
    text: 'Referência',
    collapsed: true,
    items: [
      {
        text: 'Banco de dados',
        collapsed: true,
        items: [
          {
            text: 'Conexão',
            link: '/docs/reference/database/connection.md'
          },
          {
            text: 'Gerenciador de conexões',
            link: '/docs/reference/database/connection-manager.md'
          },
          {
            text: 'Construtor de consultas',
            link: '/docs/reference/database/query-builder.md'
          },
          {
            text: 'Inserir construtor de consulta',
            link: '/docs/reference/database/insert-query-builder.md'
          },
          {
            text: 'Consultas cruas',
            link: '/docs/reference/database/raw-query-builder.md'
          },
          {
            text: 'Cliente de consulta',
            link: '/docs/reference/database/query-client.md'
          },
          {
            text: 'Cliente de transação',
            link: '/docs/reference/database/transaction-client.md'
          },
          {
            text: 'Banco de dados',
            link: '/docs/reference/database/database.md'
          },
          {
            text: 'Esquema',
            link: '/docs/reference/database/schema.md'
          },
          {
            text: 'Construtor de esquemas',
            link: '/docs/reference/database/schema-builder.md'
          },
          {
            text: 'Construtor de tabela',
            link: '/docs/reference/database/table-builder.md'
          },
          {
            text: 'ORM',
            items: [
              {
                text: 'Modelo Base',
                link: '/docs/reference/orm/base-model.md'
              },
              {
                text: 'Estratégia de nomenclatura',
                link: '/docs/reference/orm/naming-strategy.md'
              },
              {
                text: 'Construtor de consultas',
                link: '/docs/reference/orm/query-builder.md'
              },
              {
                text: 'Decoradores',
                link: '/docs/reference/orm/decorators.md'
              },
              {
                text: 'Adaptador',
                link: '/docs/reference/orm/adapter.md'
              }
            ]
          },
          {
            text: 'Relacionamentos',
            items: [
              {
                text: 'Has one',
                link: '/docs/reference/orm/relations/has-one.md'
              },
              {
                text: 'Has many',
                link: '/docs/reference/orm/relations/has-many.md'
              },
              {
                text: 'Belongs to',
                link: '/docs/reference/orm/relations/belongs-to.md'
              },
              {
                text: 'Many to many',
                link: '/docs/reference/orm/relations/many-to-many.md'
              },
              {
                text: 'Has many through',
                link: '/docs/reference/orm/relations/has-many-through.md'
              }
            ]
          }
        ]
      },
      {
        text: 'Validador',
        collapsed: true,
        items: [
          {
            text: 'Tipos de esquema',
            collapsed: true,
            items: [
              {
                text: 'string',
                link: '/docs/reference/validator/schema/string.md'
              },
              {
                text: 'boolean',
                link: '/docs/reference/validator/schema/boolean.md'
              },
              {
                text: 'number',
                link: '/docs/reference/validator/schema/number.md'
              },
              {
                text: 'date',
                link: '/docs/reference/validator/schema/date.md'
              },
              {
                text: 'enum/enumSet',
                link: '/docs/reference/validator/schema/enum.md'
              },
              {
                text: 'file',
                link: '/docs/reference/validator/schema/file.md'
              },
              {
                text: 'array',
                link: '/docs/reference/validator/schema/array.md'
              },
              {
                text: 'object',
                link: '/docs/reference/validator/schema/object.md'
              }
            ]
          },
          {
            text: 'Regras de validação',
            collapsed: true,
            items: [
              {
                text: 'alpha',
                link: '/docs/reference/validator/rules/alpha.md'
              },
              {
                text: 'alphaNum',
                link: '/docs/reference/validator/rules/alpha-num.md'
              },
              {
                text: 'confirmed',
                link: '/docs/reference/validator/rules/confirmed.md'
              },
              {
                text: 'distinct',
                link: '/docs/reference/validator/rules/distinct.md'
              },
              {
                text: 'email',
                link: '/docs/reference/validator/rules/email.md'
              },
              {
                text: 'exists',
                link: '/docs/reference/validator/rules/exists.md'
              },
              {
                text: 'unique',
                link: '/docs/reference/validator/rules/unique.md'
              },
              {
                text: 'ip',
                link: '/docs/reference/validator/rules/ip.md'
              },
              {
                text: 'maxLength',
                link: '/docs/reference/validator/rules/max-length.md'
              },
              {
                text: 'minLength',
                link: '/docs/reference/validator/rules/min-length.md'
              },
              {
                text: 'range',
                link: '/docs/reference/validator/rules/range.md'
              },
              {
                text: 'regex',
                link: '/docs/reference/validator/rules/regex.md'
              },
              {
                text: 'uuid',
                link: '/docs/reference/validator/rules/uuid.md'
              },
              {
                text: 'mobile',
                link: '/docs/reference/validator/rules/mobile.md'
              },
              {
                text: 'requiredIf',
                link: '/docs/reference/validator/rules/required-if-rules.md'
              },
              {
                text: 'after',
                link: '/docs/reference/validator/rules/after.md'
              },
              {
                text: 'before',
                link: '/docs/reference/validator/rules/before.md'
              },
              {
                text: 'afterField',
                link: '/docs/reference/validator/rules/after-field.md'
              },
              {
                text: 'beforeField',
                link: '/docs/reference/validator/rules/before-field.md'
              },
              {
                text: 'notIn',
                link: '/docs/reference/validator/rules/not-in.md'
              },
              {
                text: 'url',
                link: '/docs/reference/validator/rules/url.md'
              },
              {
                text: 'equalTo',
                link: '/docs/reference/validator/rules/equal-to.md'
              },
              {
                text: 'escape',
                link: '/docs/reference/validator/rules/escape.md'
              },
              {
                text: 'trim',
                link: '/docs/reference/validator/rules/trim.md'
              }
            ]
          }
        ]
      },

      {
        text: 'Visualizações e modelos',
        collapsed: true,
        items: [
          {
            text: 'Globais',
            collapsed: true,
            items: [
              {
                text: 'inspect',
                link: '/docs/reference/views/globals/inspect.md',
              },
              {
                text: 'truncate',
                link: '/docs/reference/views/globals/truncate.md'
              },
              {
                text: 'excerpt',
                link: '/docs/reference/views/globals/excerpt.md'
              },
              {
                text: 'safe',
                link: '/docs/reference/views/globals/safe.md'
              },
              {
                text: 'route/signedRoute',
                link: '/docs/reference/views/globals/route.md'
              },
              {
                text: 'flashMessages',
                link: '/docs/reference/views/globals/flash-messages.md'
              },
              {
                text: 'session',
                link: '/docs/reference/views/globals/session.md'
              },
              {
                text: 'stringify',
                link: '/docs/reference/views/globals/stringify.md'
              },
              {
                text: 'String helpers',
                link: '/docs/reference/views/globals/string-helpers.md'
              },
              {
                text: 'Todos os outros auxiliares',
                link: '/docs/reference/views/globals/all-helpers.md'
              }
            ]
            
          },
          {
            text: 'Tags',
            collapsed: true,
            items: [
              {
                text: 'component/slot/inject',
                link: '/docs/reference/views/tags/component.md'
              },
              {
                text: 'debugger',
                link: '/docs/reference/views/tags/debugger.md'
              },
              {
                text: 'each',
                link: '/docs/reference/views/tags/each.md'
              },
              {
                text: 'if/elseif/else',
                link: '/docs/reference/views/tags/conditionals.md'
              },
              {
                text: 'include/includeIf',
                link: '/docs/reference/views/tags/include.md'
              },
              {
                text: 'layout/section/super',
                link: '/docs/reference/views/tags/layout.md'
              },
              {
                text: 'set',
                link: '/docs/reference/views/tags/set.md'
              },
              {
                text: 'can/cannot',
                link: '/docs/reference/views/tags/can.md'
              },
              {
                text: 'entryPoints',
                link: '/docs/reference/views/tags/entry-points.md'
              }
            ]
          }
        ]
      },
      {
        text: 'Internacionalização',
        collapsed: true,
        items: [
          {
            text: 'I18n Manager',
            link: '/docs/reference/i18n/i18n-manager.md'
          },
          {
            text: 'I18n',
            link: '/docs/reference/i18n/i18n.md'
          },
          {
            text: 'Auxiliares para visualizações',
            link: '/docs/reference/i18n/view-helpers.md'
          }
        ]
      }
    ]
  }
]
