export default [
  {
      text: 'Início',
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/docs/guides/introduction.md' },
        { text: 'Installation', link: '/docs/guides/installation.md' },
        { text: 'Release process', link: '/docs/guides/release-process.md' },
      ]
  },
  {
      text: 'Fundamentals',
      collapsed: true,
      items: [
        { text: 'Application', link: '/docs/guides/fundamentals/application.md' },
        { text: 'AdonisRC file', link: '/docs/guides/fundamentals/adonisrc-file.md' },
        { text: 'Config', link: '/docs/guides/fundamentals/config.md' },
        { text: 'Environment variables', link: '/docs/guides/fundamentals/environment-variables.md' },
        { text: 'TypeScript build process', link: '/docs/guides/fundamentals/typescript-build-process.md' },
        { text: 'Deployment', link: '/docs/guides/fundamentals/deployment.md' },
        { text: 'Async local storage', link: '/docs/guides/fundamentals/async-local-storage.md' },
      ]
  },
  {
    text: 'HTTP',
    collapsed: true,
    items: [
      {
        text: 'Context',
        link: '/docs/guides/http/context.md'
      },
      {
        text: 'Routing',
        link: '/docs/guides/http/routing.md'
      },
      {
        text: 'Controllers',
        link: '/docs/guides/http/controllers.md'
      },
      {
        text: 'Request',
        link: '/docs/guides/http/request.md'
      },
      {
        text: 'Response',
        link: '/docs/guides/http/response.md'
      },
      {
        text: 'File uploads',
        link: '/docs/guides/http/file-uploads.md'
      },
      {
        text: 'Direct file uploads',
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
        text: 'Session',
        link: '/docs/guides/http/session.md'
      },
      {
        text: 'Static assets',
        link: '/docs/guides/http/static-assets.md'
      },
      {
        text: 'Assets manager',
        link: '/docs/guides/http/assets-manager.md'
      },
      {
        text: 'Exception handling',
        link: '/docs/guides/http/exception-handling.md'
      }
    ]
  },
  {
    text: 'Views & Templates',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/docs/guides/views/introduction.md'
      },
      {
        text: 'Rendering',
        link: '/docs/guides/views/rendering.md'
      },
      {
        text: 'Templating syntax',
        link: '/docs/guides/views/templating-syntax.md'
      },
      {
        text: 'Data flow',
        link: '/docs/guides/views/data-flow.md'
      },
      {
        text: 'Conditionals',
        link: '/docs/guides/views/conditionals.md'
      },
      {
        text: 'Loops',
        link: '/docs/guides/views/loops.md'
      },
      {
        text: 'Partials',
        link: '/docs/guides/views/partials.md'
      },
      {
        text: 'Layouts',
        link: '/docs/guides/views/layouts.md'
      },
      {
        text: 'Components',
        link: '/docs/guides/views/components.md'
      },
      {
        text: 'Mutations',
        link: '/docs/guides/views/mutations.md'
      },
      {
        text: 'Debugging',
        link: '/docs/guides/views/debugging.md'
      }
    ]
  },
  {
    text: 'Validator',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/docs/guides/validator/introduction.md'
      },
      {
        text: 'Custom messages',
        link: '/docs/guides/validator/custom-messages.md'
      },
      {
        text: 'Error reporters',
        link: '/docs/guides/validator/error-reporters.md'
      },
      {
        text: 'Schema caching',
        link: '/docs/guides/validator/schema-caching.md'
      },
      {
        text: 'Custom validation rules',
        link: '/docs/guides/validator/custom-rules.md'
      }
    ]
  },
  {
    text: 'Database',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/docs/guides/database/introduction.md'
      },
      {
        text: 'Query builder',
        link: '/docs/guides/database/query-builder.md'
      },
      {
        text: 'Transactions',
        link: '/docs/guides/database/transactions.md'
      },
      {
        text: 'Pagination',
        link: '/docs/guides/database/pagination.md'
      },
      {
        text: 'Schema migrations',
        link: '/docs/guides/database/migrations.md'
      },
      {
        text: 'Database seeders',
        link: '/docs/guides/database/seeders.md'
      },
      {
        text: 'Debugging',
        link: '/docs/guides/database/debugging.md'
      }
    ]
  },
  {
    text: 'ORM',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/docs/guides/models/introduction.md'
      },
      {
        text: 'CRUD operations',
        link: '/docs/guides/models/crud.md'
      },
      {
        text: 'Hooks',
        link: '/docs/guides/models/hooks.md'
      },
      {
        text: 'Query scopes',
        link: '/docs/guides/models/query-scopes.md'
      },
      {
        text: 'Serializing models',
        link: '/docs/guides/models/serialization.md'
      },
      {
        text: 'Relationships',
        link: '/docs/guides/models/relationships.md'
      },
      {
        text: 'Model factories',
        link: '/docs/guides/models/factories.md'
      }
    ]
  },
  {
    text: 'Authentication',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/docs/guides/auth/introduction.md'
      },
      {
        text: 'Web guard',
        link: '/docs/guides/auth/web-guard.md'
      },
      {
        text: 'API tokens',
        link: '/docs/guides/auth/api-tokens-guard.md'
      },
      {
        text: 'Basic auth',
        link: '/docs/guides/auth/basic-auth-guard.md'
      },
      {
        text: 'Auth middleware',
        link: '/docs/guides/auth/middleware.md'
      },
      {
        text: 'Social authentication',
        link: '/docs/guides/auth/social.md'
      },
      {
        text: 'Custom user provider',
        link: '/docs/guides/auth/custom-user-provider.md'
      }
    ]
  },
  {
    text: 'Security',
    collapsed: true,
    items: [
      {
        text: 'Web security',
        link: '/docs/guides/security/web-security.md'
      },
      {
        text: 'CORS',
        link: '/docs/guides/security/cors.md'
      },
      {
        text: 'Encryption',
        link: '/docs/guides/security/encryption.md'
      },
      {
        text: 'Hashing',
        link: '/docs/guides/security/hashing.md'
      },
      {
        text: 'Signed URLs',
        link: '/docs/guides/security/signed-urls.md'
      }
    ]
  },
  {
    text: 'Testing',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/docs/guides/testing/introduction.md'
      },
      {
        text: 'HTTP tests',
        link: '/docs/guides/testing/http-tests.md'
      },
      {
        text: 'Mocking and Fakes',
        link: '/docs/guides/testing/fakes.md'
      }
    ]
  },
  {
    text: 'Digging deeper',
    collapsed: true,
    items: [
      {
        text: 'Authorization',
        link: '/docs/guides/digging-deeper/authorization.md'
      },
      {
        text: 'Drive',
        link: '/docs/guides/digging-deeper/drive.md'
      },
      {
        text: 'Internationalization',
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
        text: 'Events',
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
        text: 'Health check',
        link: '/docs/guides/digging-deeper/health-check.md'
      },
      {
        text: 'Rate limiting',
        link: '/docs/guides/digging-deeper/rate-limiting.md'
      },
      {
        text: 'Route Model Binding',
        link: '/docs/guides/digging-deeper/route-model-binding.md'
      }
    ]
  },

  {
    text: 'Reference',
    collapsed: true,
    items: [
      {
        text: 'Database',
        collapsed: true,
        items: [
          {
            text: 'Connection',
            link: '/docs/reference/database/connection.md'
          },
          {
            text: 'Connection manager',
            link: '/docs/reference/database/connection-manager.md'
          },
          {
            text: 'Query builder',
            link: '/docs/reference/database/query-builder.md'
          },
          {
            text: 'Insert query builder',
            link: '/docs/reference/database/insert-query-builder.md'
          },
          {
            text: 'Raw query builder',
            link: '/docs/reference/database/raw-query-builder.md'
          },
          {
            text: 'Query client',
            link: '/docs/reference/database/query-client.md'
          },
          {
            text: 'Transaction client',
            link: '/docs/reference/database/transaction-client.md'
          },
          {
            text: 'Database',
            link: '/docs/reference/database/database.md'
          },
          {
            text: 'Schema',
            link: '/docs/reference/database/schema.md'
          },
          {
            text: 'Schema builder',
            link: '/docs/reference/database/schema-builder.md'
          },
          {
            text: 'Table builder',
            link: '/docs/reference/database/table-builder.md'
          },
          {
            text: 'ORM',
            items: [
              {
                text: 'Base Model',
                link: '/docs/reference/orm/base-model.md'
              },
              {
                text: 'Naming strategy',
                link: '/docs/reference/orm/naming-strategy.md'
              },
              {
                text: 'Query builder',
                link: '/docs/reference/orm/query-builder.md'
              },
              {
                text: 'Decorators',
                link: '/docs/reference/orm/decorators.md'
              },
              {
                text: 'Adapter',
                link: '/docs/reference/orm/adapter.md'
              }
            ]
          },
          {
            text: 'Relationships',
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
        text: 'Validator',
        collapsed: true,
        items: [
          {
            text: 'Schema types',
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
            text: 'Validation rules',
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
        text: 'Views & Templates',
        collapsed: true,
        items: [
          {
            text: 'Globals',
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
                text: 'All other helpers',
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
        text: 'Internationalization',
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
            text: 'View helpers',
            link: '/docs/reference/i18n/view-helpers.md'
          }
        ]
      }
    ]
  }
]
