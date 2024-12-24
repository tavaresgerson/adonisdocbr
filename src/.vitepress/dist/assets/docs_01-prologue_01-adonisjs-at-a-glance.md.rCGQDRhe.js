import{_ as s,c as e,o as a,a4 as i}from"./chunks/framework.nQaBHiNx.js";const u=JSON.parse('{"title":"AdonisJs em resumo","description":"","frontmatter":{},"headers":[],"relativePath":"docs/01-prologue/01-adonisjs-at-a-glance.md","filePath":"docs/01-prologue/01-adonisjs-at-a-glance.md"}'),o={name:"docs/01-prologue/01-adonisjs-at-a-glance.md"},n=i(`<h1 id="adonisjs-em-resumo" tabindex="-1">AdonisJs em resumo <a class="header-anchor" href="#adonisjs-em-resumo" aria-label="Permalink to &quot;AdonisJs em resumo&quot;">​</a></h1><p>AdonisJs é um framework MVC <a href="https://nodejs.org" target="_blank" rel="noreferrer">Node.js</a> para escrever aplicativos da web com menos código. Nosso foco é escrever código elegante e ser um dos frameworks mais estáveis ​​da comunidade Node. Ao contrário de outros frameworks, o AdonisJs vem com vários módulos testados em batalha para tornar sua experiência de desenvolvimento agradável.</p><p>Abaixo está a lista dos principais recursos:</p><ol><li><a href="https://en.wikipedia.org/wiki/Object-relational_mapping" target="_blank" rel="noreferrer">ORM</a> poderoso para fazer consultas SQL seguras.</li><li>Sistema de autenticação baseado em API e sessão.</li><li>Maneira fácil de enviar e-mails via SMTP ou serviço da Web (Mailgun, Mandrill, etc.)</li><li>Valide e higienize as entradas de cada usuário.</li><li>Forte ênfase na segurança.</li><li>Layout de aplicativo extensível.</li></ol><h2 id="convencoes-sobre-configuracao" tabindex="-1">Convenções sobre configuração <a class="header-anchor" href="#convencoes-sobre-configuracao" aria-label="Permalink to &quot;Convenções sobre configuração&quot;">​</a></h2><p>Este paradigma de software é o núcleo do AdonisJs. Tentamos <em>diminuir o tempo que você perde</em> ao tomar decisões, seguindo convenções bem conhecidas de frameworks populares como Rails, Django ou Laravel sem perder nenhuma flexibilidade. Por exemplo, se você tem um modelo User, a tabela correspondente no banco de dados deve ser chamada de <code>users</code> por padrão (claro que você pode alterar isso substituindo uma propriedade no seu modelo).</p><p>Você pode aprender mais sobre esse paradigma na <a href="https://en.wikipedia.org/wiki/Convention_over_configuration" target="_blank" rel="noreferrer">página da Wikipedia</a>.</p><h2 id="exemplo-mais-simples" tabindex="-1">Exemplo mais simples <a class="header-anchor" href="#exemplo-mais-simples" aria-label="Permalink to &quot;Exemplo mais simples&quot;">​</a></h2><p>Como dissemos, o AdonisJs tenta remover os grandes pedaços de código incontroláveis ​​com <em>API simples e legível</em>.</p><ol><li>O AdonisJs remove os retornos de chamada desnecessários do seu código e introduz o <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators" target="_blank" rel="noreferrer">ES2015 Generators</a>.</li><li>Ele organiza tudo em diretórios diferentes para que você saiba rapidamente onde seus arquivos estão.</li><li>Ele não adiciona nada aos globais, exceto as funções <code>use</code> e ​​<code>make</code> que você aprenderá em breve.</li></ol><p>Se disséssemos que em seis linhas de código você pode buscar todos os usuários do banco de dados e enviá-los de volta como resposta <code>JSON</code>, você acreditaria?</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Route</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Route&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> User</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;App/Model/User&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">response</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> users</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> User.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">all</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(users)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>Espero que esta rápida visão geral tenha intrigado você e não se preocupe se você não entender completamente o código acima -- o capítulo Introdução é para você!</p><h2 id="por-onde-comecar" tabindex="-1">Por onde começar <a class="header-anchor" href="#por-onde-comecar" aria-label="Permalink to &quot;Por onde começar&quot;">​</a></h2><p>Aprender uma nova estrutura pode ser assustador no começo. Como o AdonisJs vem com vários módulos/addons pré-configurados, você sempre se sentirá em casa sem perder tempo procurando os melhores módulos.</p><p>Para começar sua jornada de desenvolvimento, recomendamos que você comece lendo os seguintes tópicos:</p><ul><li><a href="/docs/03-getting-started/05-routing.html">Roteamento</a></li><li><a href="/docs/03-getting-started/06-request.html">Solicitação</a></li><li><a href="/docs/03-getting-started/07-response.html">Resposta</a></li><li><a href="/docs/04-views/01-views.html">Visualizações</a> e</li></ul><p>Certifique-se também de seguir o guia <a href="/src/docs/03-getting-started/01-installation.html">Instalação</a> para configurar os itens essenciais.</p>`,18),r=[n];function t(l,d,p,h,c,k){return a(),e("div",null,r)}const g=s(o,[["render",t]]);export{u as __pageData,g as default};
