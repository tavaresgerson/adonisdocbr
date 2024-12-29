import{_ as i,c as a,a2 as e,o as t}from"./chunks/framework.YPpNXepj.js";const c=JSON.parse('{"title":"Ignitor","description":"","frontmatter":{},"headers":[],"relativePath":"docs/02-Concept/05-ignitor.md","filePath":"docs/02-Concept/05-ignitor.md"}'),n={name:"docs/02-Concept/05-ignitor.md"};function o(p,s,h,l,r,d){return t(),a("div",null,s[0]||(s[0]=[e(`<h1 id="ignitor" tabindex="-1">Ignitor <a class="header-anchor" href="#ignitor" aria-label="Permalink to &quot;Ignitor&quot;">​</a></h1><p>O <a href="https://github.com/adonisjs/adonis-ignitor" target="_blank" rel="noreferrer">Ignitor</a> alimenta o bootstrapping de um aplicativo AdonisJs.</p><p>Neste guia, aprendemos sobre alguns dos recursos e funcionalidades oferecidos pelo pacote Ignitor para gerenciar nosso código.</p><h2 id="ganchos" tabindex="-1">Ganchos <a class="header-anchor" href="#ganchos" aria-label="Permalink to &quot;Ganchos&quot;">​</a></h2><p>O Ignitor expõe vários ganchos para personalizar o comportamento do seu aplicativo.</p><p>Esses ganchos são registrados dentro do arquivo <code>start/hooks.js</code>. Sinta-se à vontade para criar este arquivo se ele ainda não existir.</p><p>Aqui está um exemplo de como usar <code>hooks.after</code> para registrar uma visualização global <em>depois</em> que todos os provedores forem inicializados:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .start/hooks.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">hooks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@adonisjs/ignitor&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">hooks.after.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">providersBooted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> View</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;View&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  View.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">global</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;time&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getTime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>Semelhante a <code>hooks.after</code>, você também pode usar <code>hooks.before</code> para registrar a lógica do aplicativo <em>antes</em> que um gancho ocorra.</p><p>Abaixo está a lista de ganchos disponíveis:</p><table tabindex="0"><thead><tr><th>Evento de gancho</th><th>Descrição</th></tr></thead><tbody><tr><td>providersRegistered</td><td>Antes/depois de todos os provedores terem se registrado</td></tr><tr><td>providersBooted</td><td>Antes/depois de todos os provedores terem inicializado</td></tr><tr><td>preloading</td><td>Antes/depois de pré-carregar arquivos registrados</td></tr><tr><td>httpServer</td><td>Antes/depois de o servidor HTTP ter iniciado</td></tr><tr><td>aceCommand</td><td>Antes/depois de o comando ace ser executado</td></tr></tbody></table><h2 id="pre-carregamento-de-arquivos" tabindex="-1">Pré-carregamento de arquivos <a class="header-anchor" href="#pre-carregamento-de-arquivos" aria-label="Permalink to &quot;Pré-carregamento de arquivos&quot;">​</a></h2><p>O Ignitor facilita o pré-carregamento de arquivos depois que o servidor HTTP foi iniciado.</p><p>Para fazer isso, modifique o arquivo <code>server.js</code> e adicione o método <code>preLoad</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Ignitor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@adonisjs/fold&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appRoot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(__dirname)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">preLoad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;start/fire-zombies&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fireHttpServer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">catch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(console.error)</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>O método <code>preLoad</code> aceita um caminho raiz de aplicativo relativo ou um caminho absoluto para qualquer arquivo JavaScript.</p></div><p>Para carregar vários arquivos, chame o método <code>preLoad</code> várias vezes:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Ignitor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;@adonisjs/fold&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">preLoad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">preLoad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // etc</span></span></code></pre></div><h2 id="metodos-do-ignitor" tabindex="-1">Métodos do Ignitor <a class="header-anchor" href="#metodos-do-ignitor" aria-label="Permalink to &quot;Métodos do Ignitor&quot;">​</a></h2><p>Abaixo está a lista de métodos disponíveis na instância <code>ignitor</code>.</p><h4 id="approot-location" tabindex="-1"><code>appRoot(location)</code> <a class="header-anchor" href="#approot-location" aria-label="Permalink to &quot;\`appRoot(location)\`&quot;">​</a></h4><p>Defina o caminho absoluto para a raiz do aplicativo:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ignitor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appRoot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(__dirname)</span></span></code></pre></div><h4 id="modulesroot-location" tabindex="-1"><code>modulesRoot(location)</code> <a class="header-anchor" href="#modulesroot-location" aria-label="Permalink to &quot;\`modulesRoot(location)\`&quot;">​</a></h4><p>Defina o caminho absoluto para o diretório pai <code>node_modules</code> do aplicativo.</p><p>Por padrão, o caminho definido em <code>appRoot()</code> é usado:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ignitor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">modulesRoot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;..&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><h4 id="appfile-location" tabindex="-1"><code>appFile(location)</code> <a class="header-anchor" href="#appfile-location" aria-label="Permalink to &quot;\`appFile(location)\`&quot;">​</a></h4><p>Defina o caminho relativo para o arquivo do aplicativo.</p><p>Por padrão, o arquivo <code>start/app.js</code> é usado:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ignitor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appFile</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;start/app.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><h4 id="loadcommands" tabindex="-1"><code>loadCommands()</code> <a class="header-anchor" href="#loadcommands" aria-label="Permalink to &quot;\`loadCommands()\`&quot;">​</a></h4><p>Instrua o Ignitor a carregar provedores e comandos ace.</p><p>Isso é feito ao executar um comando ace, no entanto, você também pode carregar comandos ao iniciar o servidor HTTP:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ignitor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">loadCommands</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div>`,35)]))}const E=i(n,[["render",o]]);export{c as __pageData,E as default};
