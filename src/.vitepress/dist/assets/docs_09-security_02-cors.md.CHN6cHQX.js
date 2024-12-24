import{_ as a,c as s,o as i,a4 as e}from"./chunks/framework.nQaBHiNx.js";const g=JSON.parse('{"title":"CORS","description":"","frontmatter":{},"headers":[],"relativePath":"docs/09-security/02-cors.md","filePath":"docs/09-security/02-cors.md"}'),o={name:"docs/09-security/02-cors.md"},n=e(`<h1 id="cors" tabindex="-1">CORS <a class="header-anchor" href="#cors" aria-label="Permalink to &quot;CORS&quot;">​</a></h1><p>Cross-Origin Resource Sharing (CORS) é uma maneira de permitir solicitações HTTP de entrada de diferentes domínios. É muito comum em aplicativos AJAX, onde o navegador bloqueará todas as solicitações entre domínios se o servidor não as autorizar. Leia mais sobre CORS <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank" rel="noreferrer">aqui</a>.</p><h2 id="como-funciona" tabindex="-1">Como funciona? <a class="header-anchor" href="#como-funciona" aria-label="Permalink to &quot;Como funciona?&quot;">​</a></h2><p>Solicitações AJAX de diferentes domínios precisam ser autorizadas antes de executarem as ações desejadas. Os navegadores primeiro fazem uma solicitação <em>preflight</em> com <em>OPTIONS</em> como o método HTTP para o servidor, concedendo permissão. O servidor pode permitir a solicitação retornando <em>200 OK</em> e especificando os domínios a serem permitidos por meio do cabeçalho <em>Access-Control-Allow-Origin</em>.</p><p>O AdonisJs vem com um middleware <em>CORS</em> para lidar com esse fluxo para você por meio de um arquivo de configuração.</p><h2 id="configuracao" tabindex="-1">Configuração <a class="header-anchor" href="#configuracao" aria-label="Permalink to &quot;Configuração&quot;">​</a></h2><p>Para que as regras CORS funcionem corretamente, certifique-se de que <code>Adonis/Middleware/Cors</code> esteja registrado como um middleware global dentro do arquivo <code>app/Http/kernel.js</code>.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/Http/kernel.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> globalMiddleware</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // ...</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;Adonis/Middleware/Cors&#39;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><h2 id="configuracao-1" tabindex="-1">Configuração <a class="header-anchor" href="#configuracao-1" aria-label="Permalink to &quot;Configuração&quot;">​</a></h2><p>Você pode gerenciar as regras CORS editando o arquivo de configuração <code>config/cors.js</code>.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// config/cors.js</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  origin: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  methods: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;GET, PUT, POST&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  headers: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  exposeHeaders: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  credentials: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  maxAge: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">90</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="origin" tabindex="-1"><code>origin</code> <a class="header-anchor" href="#origin" aria-label="Permalink to &quot;\`origin\`&quot;">​</a></h4><p>A origem aceita vários valores.</p><ol><li>Para proibir todas as solicitações CORS, defina-a como <code>false</code></li><li>Para permitir as mesmas solicitações de origem, defina-a como <code>true</code>.</li><li>Você pode definir origens separadas por vírgula(,).</li><li>Definir o valor como um curinga * permitirá todas as origens.</li><li>Finalmente, você pode anexar um retorno de chamada e retornar um dos valores acima<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">origin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">requestOrigin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> requestOrigin </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;foo&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><h4 id="methods" tabindex="-1"><code>methods</code> <a class="header-anchor" href="#methods" aria-label="Permalink to &quot;\`methods\`&quot;">​</a></h4><p>Métodos/verbos HTTP para permitir. Certifique-se de que seja um valor separado por vírgula de um dos vários métodos.</p><h4 id="headers" tabindex="-1"><code>headers</code> <a class="header-anchor" href="#headers" aria-label="Permalink to &quot;\`headers\`&quot;">​</a></h4><p>Como origem, <em>cabeçalhos</em> também aceitam vários valores</p><ol><li>Para desabilitar todos os cabeçalhos, defina como falso.</li><li>Para permitir todos os cabeçalhos definidos dentro de Access-Control-Request-Headers, defina como verdadeiro.</li><li>Permita uma sequência de cabeçalhos personalizados separados por vírgula(,). Por exemplo, Content-Type, Accepts.</li><li>Finalmente, uma função de retorno de chamada.<div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">headers</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">requestedHeaders</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><h4 id="exhibitheaders-opcional" tabindex="-1"><code>exhibitHeaders(opcional)</code> <a class="header-anchor" href="#exhibitheaders-opcional" aria-label="Permalink to &quot;\`exhibitHeaders(opcional)\`&quot;">​</a></h4><p>Cabeçalhos separados por vírgula para expor via cabeçalho <em>Access-Control-Expose-Headers</em>.</p><h4 id="credentials-opcional" tabindex="-1"><code>credentials(opcional)</code> <a class="header-anchor" href="#credentials-opcional" aria-label="Permalink to &quot;\`credentials(opcional)\`&quot;">​</a></h4><p>Permite ou não a troca de credenciais definindo o cabeçalho <em>Access-Control-Allow-Credentials</em> para um valor booleano.</p><h4 id="maxage-opcional" tabindex="-1"><code>maxAge(opcional)</code> <a class="header-anchor" href="#maxage-opcional" aria-label="Permalink to &quot;\`maxAge(opcional)\`&quot;">​</a></h4><p>Define o cabeçalho <em>Access-Control-Allow-Max-Age</em> para um valor definido.</p>`,25),r=[n];function l(t,p,d,h,c,k){return i(),s("div",null,r)}const u=a(o,[["render",l]]);export{g as __pageData,u as default};
