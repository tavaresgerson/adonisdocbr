import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.nQaBHiNx.js";const g=JSON.parse('{"title":"Rotas e Controladores","description":"","frontmatter":{},"headers":[],"relativePath":"docs/08-tutorial/02-routes-and-controllers.md","filePath":"docs/08-tutorial/02-routes-and-controllers.md"}'),t={name:"docs/08-tutorial/02-routes-and-controllers.md"},e=n(`<h1 id="rotas-e-controladores" tabindex="-1">Rotas e Controladores <a class="header-anchor" href="#rotas-e-controladores" aria-label="Permalink to &quot;Rotas e Controladores&quot;">​</a></h1><p>No <a href="/tutorial/getting-started.html">último tutorial</a> criamos um novo aplicativo e registramos rotas para renderizar visualizações sem usar controladores.</p><p>Renderizar as visualizações simples está bem sem controladores. Para criar aplicativos reais, você precisa lidar com a lógica de domínio e criar visualizações com dados dinâmicos. Neste tutorial, aprenderemos como criar controladores e vinculá-los a rotas.</p><h2 id="criando-controladores" tabindex="-1">Criando Controladores <a class="header-anchor" href="#criando-controladores" aria-label="Permalink to &quot;Criando Controladores&quot;">​</a></h2><p>Os controladores são classes <em>ES2015</em> armazenadas na pasta <code>app/Http/Controllers</code>. Cada arquivo define um único controlador e você é livre para criar quantos métodos quiser em um único controlador.</p><p>Vamos mergulhar rapidamente e criar um novo controlador. Como vamos transformar este aplicativo em um blog, vamos nomear o controlador como <em>PostController</em>. Como sempre faremos uso do Ace para criar o controlador para nós.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./ace</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> make:controller</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Posts</span></span></code></pre></div><p>Saída:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>create: app/Http/Controllers/PostsController.js</span></span></code></pre></div><p>Criamos o nosso primeiro controlador. Vamos vincular este controlador à rota e renderizar uma visão do controlador em vez disso. Precisamos substituir &#39;Route.on(&#39;/&#39;).render(&#39;home&#39;)&#39; pela seguinte linha de código.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/Http/routes.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;PostsController.index&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Final Routes File</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Route</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Route&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;PostsController.index&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;about&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">render</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;about&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;contact&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">render</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;contact&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Há um guia completo sobre [Rotas] ( / getting-started / routing ) que você pode consultar. Por enquanto, escreveremos algum código dentro do PostsController para renderizar uma visão.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/Http/Controllers/PostsController.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;use strict&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> PostsController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">response</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sendView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;home&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PostsController</span></span></code></pre></div><ol><li>Criamos um método de controlador chamado &quot;index&quot; que é um método gerador ES2015, tornando simples escrever código assíncrono.</li><li>Em seguida, utilizamos o método <code>sendView</code> para renderizar a <em>home</em>.</li></ol>`,15),l=[e];function o(p,r,h,k,d,c){return a(),i("div",null,l)}const u=s(t,[["render",o]]);export{g as __pageData,u as default};
