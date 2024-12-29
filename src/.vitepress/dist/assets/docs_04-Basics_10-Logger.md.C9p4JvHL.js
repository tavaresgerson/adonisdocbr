import{_ as i,c as a,a2 as e,o as t}from"./chunks/framework.YPpNXepj.js";const g=JSON.parse('{"title":"Logger","description":"","frontmatter":{},"headers":[],"relativePath":"docs/04-Basics/10-Logger.md","filePath":"docs/04-Basics/10-Logger.md"}'),n={name:"docs/04-Basics/10-Logger.md"};function l(p,s,r,o,h,d){return t(),a("div",null,s[0]||(s[0]=[e(`<h1 id="logger" tabindex="-1">Logger <a class="header-anchor" href="#logger" aria-label="Permalink to &quot;Logger&quot;">​</a></h1><p>O AdonisJs vem com um logger completo construído em cima do <a href="https://github.com/winstonjs/winston" target="_blank" rel="noreferrer">winston</a>, usando níveis de registro <a href="https://tools.ietf.org/html/rfc5424#page-11" target="_blank" rel="noreferrer">RFC5424</a>.</p><p>O Logger vem com os seguintes drivers:</p><ol><li>Console (<code>console</code>)</li><li>Arquivo (<code>file</code>)</li></ol><p>Você é livre para adicionar seus próprios drivers construídos em cima do <a href="https://github.com/winstonjs/winston#transports" target="_blank" rel="noreferrer">winston transports</a>.</p><h2 id="configuracao" tabindex="-1">Configuração <a class="header-anchor" href="#configuracao" aria-label="Permalink to &quot;Configuração&quot;">​</a></h2><p>A configuração do Logger é salva dentro do arquivo <code>config/app.js</code> sob o objeto <code>logger</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .config/app.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">logger</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  transport</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;console&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  console</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;console&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;file&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    filename</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;adonis.log&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>O driver <code>file</code> salva seu arquivo de log dentro do diretório raiz do aplicativo <code>tmp</code>.</p><div class="tip custom-block"><p class="custom-block-title">NOTA</p><p>Você pode definir um caminho absoluto <code>filename</code> para um local de arquivo de log diferente, se desejar.</p></div><h2 id="exemplo-basico" tabindex="-1">Exemplo básico <a class="header-anchor" href="#exemplo-basico" aria-label="Permalink to &quot;Exemplo básico&quot;">​</a></h2><p>Vamos começar com um exemplo básico de dados de log dentro do seu aplicativo:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Logger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Logger&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">info</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;request url is %s&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">info</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;request details %j&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  url: request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  user: auth.user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">username</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">DICA</p><p>Todos os métodos de log suportam a sintaxe <a href="http://www.diveintojavascript.com/projects/javascript-sprintf" target="_blank" rel="noreferrer">sprintf</a>.</p></div><p>O logger usa níveis de log <a href="https://tools.ietf.org/html/rfc5424#page-11" target="_blank" rel="noreferrer">RFC5424</a>, expondo métodos simples para cada nível:</p><table tabindex="0"><thead><tr><th>Nível</th><th>Método</th><th>Uso</th></tr></thead><tbody><tr><td>0</td><td>emerg</td><td><code>Logger.emerg(msg, ...data)</code></td></tr><tr><td>1</td><td>alert</td><td><code>Logger.alert(msg, ...data)</code></td></tr><tr><td>2</td><td>crit</td><td><code>Logger.crit(msg, ...data)</code></td></tr><tr><td>3</td><td>error</td><td><code>Logger.error(msg, ...data)</code></td></tr><tr><td>4</td><td>warning</td><td><code>Logger.warning(msg, ...data)</code></td></tr><tr><td>5</td><td>notice</td><td><code>Logger.notice(msg, ...data)</code></td></tr><tr><td>6</td><td>info</td><td><code>Logger.info(msg, ...data)</code></td></tr><tr><td>7</td><td>debug</td><td><code>Logger.debug(msg, ...data)</code></td></tr></tbody></table><h2 id="trocando-transportes" tabindex="-1">Trocando transportes <a class="header-anchor" href="#trocando-transportes" aria-label="Permalink to &quot;Trocando transportes&quot;">​</a></h2><p>Você pode trocar transportes rapidamente usando o método <code>transport</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">transport</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;file&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">info</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;request url is %s&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">url</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span></code></pre></div><h2 id="nivel-de-registro" tabindex="-1">Nível de registro <a class="header-anchor" href="#nivel-de-registro" aria-label="Permalink to &quot;Nível de registro&quot;">​</a></h2><p>O Logger tem um <code>nível</code> de registro de configuração padrão que pode ser atualizado em tempo de execução.</p><p>Quaisquer mensagens acima do nível de registro definido não são registradas. Por exemplo:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Logger</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Logger&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger.level </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;info&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// not logged</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">debug</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Some debugging info&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger.level </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;debug&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// now logged</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Logger.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">debug</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Some debugging info&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Essa abordagem pode facilitar a desativação de mensagens de depuração quando seu servidor estiver sob alta carga.</p>`,24)]))}const c=i(n,[["render",l]]);export{g as __pageData,c as default};
