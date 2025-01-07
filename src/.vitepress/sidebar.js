export default [
  {
    text: 'Preface',
    collapsed: false,
    items: [
        {
          text: 'Introduction',
          link: 'docs/preface/introduction.md',
        },
        {
          text: 'FAQs',
          link: 'docs/preface/faqs.md',
        },
        {
          text: 'Governance',
          link: 'docs/preface/governance.md',
        },
        {
          text: 'Releases',
          link: 'docs/preface/releases.md',
        },
        {
          text: 'Contribution Guide',
          link: 'docs/preface/contribution-guide.md',
        }
      ],
    },

    {
      text: 'Getting started',
      collapsed: true,
      items: [
          {
            text: 'Installation',
            link: 'docs/getting-started/installation.md',
          },
          {
            text: 'Configuration',
            link: 'docs/getting-started/configuration.md',
          },
          {
            text: 'Environment variables',
            link: 'docs/getting-started/environment-variables.md',
          },
          {
            text: 'Folder structure',
            link: 'docs/getting-started/folder-structure.md',
          },
          {
            text: 'Deployment',
            link: 'docs/getting-started/deployment.md',
          }
      ],
    },
    
    {
      text: 'Concepts',
      collapsed: true,
      items: [
          {
            text: 'AdonisRC file',
            link: 'docs/concepts/adonisrc-file.md',
          },
          {
            text: 'Async local storage',
            link: 'docs/concepts/async-local-storage.md',
          },
          {
            text: 'Assembler hooks',
            link: 'docs/concepts/assembler-hooks.md',
          },
          {
            text: 'Application',
            link: 'docs/concepts/application.md',
          },
          {
            text: 'Application lifecycle',
            link: 'docs/concepts/application-lifecycle.md',
          },
          {
            text: 'Config providers',
            link: 'docs/concepts/config-providers.md',
          },
          {
            text: 'Container services',
            link: 'docs/concepts/container-services.md',
          },
          {
            text: 'Dependency injection (DI)',
            link: 'docs/concepts/dependency-injection.md',
          },
          {
            text: 'Extending the framework',
            link: 'docs/concepts/extending-the-framework.md',
          },
          {
            text: 'Hot module replacement (HMR)',
            link: 'docs/concepts/hmr.md',
          },
          {
            text: 'HTTP overview',
            link: 'docs/concepts/http-overview.md',
          },
          {
            text: 'HTTP context',
            link: 'docs/concepts/http-context.md',
          },
          {
            text: 'Service providers',
            link: 'docs/concepts/service-providers.md',
          },
          {
            text: 'Scaffolding',
            link: 'docs/concepts/scaffolding.md',
          },
          {
            text: 'Tooling config',
            link: 'docs/concepts/tooling-config.md',
          },
          {
            text: 'TypeScript build process',
            link: 'docs/concepts/typescript-build-process.md',
          }
      ],
    },
    {
      text: 'Basics',
      collapsed: true,
      items: [
          {
            text: 'Routing',
            link: 'docs/basics/routing.md',
          },
          {
            text: 'Controllers',
            link: 'docs/basics/controllers.md',
          },
          {
            text: 'Middleware',
            link: 'docs/basics/middleware.md',
          },
          {
            text: 'Body parser',
            link: 'docs/basics/body-parser.md',
          },
          {
            text: 'Request',
            link: 'docs/basics/request.md',
          },
          {
            text: 'Response',
            link: 'docs/basics/response.md',
          },
          {
            text: 'Validation',
            link: 'docs/basics/validation.md',
          },
          {
            text: 'File uploads',
            link: 'docs/basics/file-uploads.md',
          },
          {
            text: 'Session',
            link: 'docs/basics/session.md',
          },
          {
            text: 'Cookies',
            link: 'docs/basics/cookies.md',
          },
          {
            text: 'Exception handling',
            link: 'docs/basics/exception-handling.md',
          },
          {
            text: 'Debugging',
            link: 'docs/basics/debugging.md',
          },
          {
            text: 'Vite',
            link: 'docs/basics/vite.md',
          },
          {
            text: 'Static file server',
            link: 'docs/basics/static-file-server.md',
          }
      ],
    },
    {
      text: 'Database',
      collapsed: true, 
      items: [
          {
            text: 'Introduction',
            link: 'docs/database/introduction.md',
          },
          {
            text: 'Lucid',
            link: 'docs/database/lucid.md',
          },
          {
            text: 'Redis',
            link: 'docs/database/redis.md',
          }
      ],
    },
    {
      text: 'Authentication',
      collapsed: true,
      items: [
        {
          text: 'Introduction',
          link: 'docs/authentication/introduction.md',
        },
        {
          text: 'Verifying user credentials',
          link: 'docs/authentication/verifying-user-credentials.md',
        },
        {
          text: 'Session guard',
          link: 'docs/authentication/session-guard.md',
        },
        {
          text: 'Access tokens guard',
          link: 'docs/authentication/access-tokens-guard.md',
        },
        {
          text: 'Basic auth guard',
          link: 'docs/authentication/basic-auth-guard.md',
        },
        {
          text: 'Custom auth guard',
          link: 'docs/authentication/custom-auth-guard.md',
        },
        {
          text: 'Social authentication',
          link: 'docs/authentication/social-authentication.md',
        }
      ],
    },
    {
      text: 'Security',
      collapsed: true,
      items: [
        {
          text: 'Authorization',
          link: 'docs/security/authorization.md',
        },
        {
          text: 'Encryption',
          link: 'docs/security/encryption.md',
        },
        {
          text: 'Hashing',
          link: 'docs/security/hashing.md',
        },
        {
          text: 'CORS',
          link: 'docs/security/cors.md',
        },
        {
          text: 'Securing SSR apps',
          link: 'docs/security/securing-ssr-applications.md',
        },
        {
          text: 'Rate limiting',
          link: 'docs/security/rate-limiting.md',
        }
      ],
    },
    {
      text: 'Views & Templates',
      collapsed: true,
      items: [
          {
            text: 'Introduction',
            link: 'docs/views-and-templates/introduction.md',
          },
          {
            text: 'EdgeJS',
            link: 'docs/views-and-templates/edgejs.md',
          },
          {
            text: 'Inertia',
            link: 'docs/views-and-templates/inertia.md',
          }
      ],
    },
    {
      text: 'Testing',
      collapsed: true,
      items: [
        {
          text: 'Introduction',
          link: 'docs/testing/introduction.md',
        },
        {
          text: 'HTTP tests',
          link: 'docs/testing/http-tests.md',
        },
        {
          text: 'Browser tests',
          link: 'docs/testing/browser-tests.md',
        },
        {
          text: 'Console tests',
          link: 'docs/testing/console-tests.md',
        },
        {
          text: 'Database',
          link: 'docs/testing/database.md',
        },
        {
          text: 'Mocks & Fakes',
          link: 'docs/testing/mocks-and-fakes.md',
        }
      ],
    },

    {
      text: 'Digging deeper',
      collapsed: true,
      items: [
        {
          text: 'Drive',
          link: 'docs/digging-deeper/drive.md',
        },
        {
          text: 'Emitter',
          link: 'docs/digging-deeper/emitter.md',
        },
        {
          text: 'Health checks',
          link: 'docs/digging-deeper/health-checks.md',
        },
        {
          text: 'I18n',
          link: 'docs/digging-deeper/i18n.md',
        },
        {
          text: 'Locks',
          link: 'docs/digging-deeper/locks.md',
        },
        {
          text: 'Logger',
          link: 'docs/digging-deeper/logger.md',
        },
        {
          text: 'Mail',
          link: 'docs/digging-deeper/mail.md',
        },
        {
          text: 'Transmit',
          link: 'docs/digging-deeper/transmit.md',
        },
        {
          text: 'Repl',
          link: 'docs/digging-deeper/repl.md',
        }
      ],
    },
    {    
      text: 'Ace commands',
      collapsed: true,
      items: [
          {
            text: 'Introduction',
            link: 'docs/ace/introduction.md',
          },
          {
            text: 'Creating commands',
            link: 'docs/ace/creating-commands.md',
          },
          {
            text: 'Command arguments',
            link: 'docs/ace/args.md',
          },
          {
            text: 'Command flags',
            link: 'docs/ace/flags.md',
          },
          {
            text: 'Prompts',
            link: 'docs/ace/prompts.md',
          },
          {
            text: 'Terminal UI',
            link: 'docs/ace/tui.md',
          }
      ],
    },

    {
      text: 'References',
      collapsed: true,
      items: [
        {
          text: 'Commands',
          link: 'docs/references/commands.md',
        },
        {
          text: 'Edge helpers and tags',
          link: 'docs/references/edge.md',
        },
        {
          text: 'Events',
          link: 'docs/references/events.md',
        },
        {
          text: 'Exceptions',
          link: 'docs/references/exceptions.md',
        },
        {
          text: 'Helpers',
          link: 'docs/references/helpers.md',
        }
      ]
    }
]
