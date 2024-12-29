import{_ as i,c as a,a2 as e,o as n}from"./chunks/framework.YPpNXepj.js";const c=JSON.parse('{"title":"Autenticação Social","description":"","frontmatter":{},"headers":[],"relativePath":"docs/06-Digging-Deeper/08-Social-Authentication.md","filePath":"docs/06-Digging-Deeper/08-Social-Authentication.md"}'),t={name:"docs/06-Digging-Deeper/08-Social-Authentication.md"};function l(p,s,h,k,o,r){return n(),a("div",null,s[0]||(s[0]=[e(`<h1 id="autenticacao-social" tabindex="-1">Autenticação Social <a class="header-anchor" href="#autenticacao-social" aria-label="Permalink to &quot;Autenticação Social&quot;">​</a></h1><p><em>Ally</em> é um provedor de autenticação social de primeira parte para AdonisJs.</p><p>Usar <em>Ally</em> torna trivial autenticar usuários por meio de sites de terceiros como <em>Google</em>, <em>Twitter</em> e <em>Facebook</em>.</p><p>O <em>Ally Provider</em> suporta os seguintes drivers:</p><ul><li>Facebook (<code>facebook</code>)</li><li>Github (<code>github</code>)</li><li>Google (<code>google</code>)</li><li>Instagram (<code>instagram</code>)</li><li>Linkedin (<code>linkedin</code>)</li><li>Twitter (<code>twitter</code>)</li><li>Foursquare (<code>foursquare</code>)</li></ul><h2 id="configuracao" tabindex="-1">Configuração <a class="header-anchor" href="#configuracao" aria-label="Permalink to &quot;Configuração&quot;">​</a></h2><p>Como o <em>Ally Provider</em> não é instalado por padrão, precisamos obtê-lo do npm:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">adonis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @adonisjs/ally</span></span></code></pre></div><p>Em seguida, registre o provedor dentro do arquivo <code>start/app.js</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .start/app.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> providers</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;@adonisjs/ally/providers/AllyProvider&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">NOTA</p><p>A configuração de autenticação social é salva dentro do arquivo <code>config/services.js</code>, que é criado pelo comando <code>adonis install</code> ao instalar o <em>Ally Provider</em>.</p></div><h2 id="config" tabindex="-1">Config <a class="header-anchor" href="#config" aria-label="Permalink to &quot;Config&quot;">​</a></h2><p>Sua configuração deve ser armazenada dentro do objeto <code>ally</code> do arquivo <code>config/services.js</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .config/services.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ally: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    facebook: {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">DICA</p><p>Você sempre pode acessar o arquivo de origem da configuração mais recente no <a href="https://github.com/adonisjs/adonis-ally/blob/master/templates/config.js" target="_blank" rel="noreferrer">Github</a>.</p></div><h2 id="exemplo-basico" tabindex="-1">Exemplo básico <a class="header-anchor" href="#exemplo-basico" aria-label="Permalink to &quot;Exemplo básico&quot;">​</a></h2><p>Vamos começar com um exemplo básico de login usando o <em>Facebook</em>.</p><p>Primeiro, precisamos registrar rotas para redirecionar o usuário para o Facebook e, em seguida, manipular a resposta quando o usuário for redirecionado de volta do Facebook:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .start/routes.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;login/facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;LoginController.redirect&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook/callback&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;LoginController.callback&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>Certifique-se de que o <em>Auth Provider</em> e o middleware relacionado à autenticação estejam <a href="/docs/05-Security/02-Authentication.html#setup">configurados corretamente</a>.</p></div><p>Em seguida, precisamos criar o controlador para implementar nossos métodos de rota:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">adonis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> make:controller</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Login</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .app/Controllers/Http/LoginController.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> User</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;App/Models/User&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LoginController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> redirect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ally</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">redirect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> callback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ally</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">auth</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    try</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> fbUser</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getUser</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // user details to be saved</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> userDetails</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        email: fbUser.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getEmail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        token: fbUser.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAccessToken</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        login_source: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // search for existing user</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> whereClause</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        email: fbUser.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getEmail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> user</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> User.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">findOrCreate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(whereClause, userDetails)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> auth.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">login</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(user)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Logged in&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">catch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (error) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Unable to authenticate. Try again later&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Agora temos um sistema de login totalmente funcional em algumas linhas de código!</p><p><em>A API do Ally</em> é consistente em todos os drivers, então é fácil trocar <code>facebook</code> por <code>google</code> ou qualquer outro driver necessário para seu aplicativo.</p><h2 id="api-do-ally" tabindex="-1">API do Ally <a class="header-anchor" href="#api-do-ally" aria-label="Permalink to &quot;API do Ally&quot;">​</a></h2><p>Abaixo está a lista de funções disponíveis.</p><h4 id="redirect" tabindex="-1"><code>redirect</code> <a class="header-anchor" href="#redirect" aria-label="Permalink to &quot;\`redirect\`&quot;">​</a></h4><p>Redirecionar usuário para o site de terceiros:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">redirect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getredirecturl" tabindex="-1"><code>getRedirectUrl</code> <a class="header-anchor" href="#getredirecturl" aria-label="Permalink to &quot;\`getRedirectUrl\`&quot;">​</a></h4><p>Obter URL de redirecionamento de volta como uma string:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> url</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getRedirectUrl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">render</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;login&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { url })</span></span></code></pre></div><h4 id="scope-scopesarray" tabindex="-1"><code>scope(scopesArray)</code> <a class="header-anchor" href="#scope-scopesarray" aria-label="Permalink to &quot;\`scope(scopesArray)\`&quot;">​</a></h4><p>Definir escopos de tempo de execução antes de redirecionar o usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">scope</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;email&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;birthday&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">redirect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>Verifique a documentação oficial do OAuth do provedor relevante para obter uma lista de seus escopos disponíveis.</p></div><h4 id="fields-fieldsarray" tabindex="-1"><code>fields(fieldsArray)</code> <a class="header-anchor" href="#fields-fieldsarray" aria-label="Permalink to &quot;\`fields(fieldsArray)\`&quot;">​</a></h4><p>Campos a serem buscados ao obter o perfil de usuário autenticado:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fields</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;username&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;email&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;profile_pic&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getUser</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getuser" tabindex="-1"><code>getUser</code> <a class="header-anchor" href="#getuser" aria-label="Permalink to &quot;\`getUser\`&quot;">​</a></h4><p>Obtenha o perfil de usuário de um usuário autenticado (retorna uma instância <a href="https://github.com/adonisjs/adonis-ally/blob/develop/src/AllyUser.js" target="_blank" rel="noreferrer">AllyUser</a>):</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fields</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;email&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getUser</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getuserbytoken-accesstoken-accesssecret" tabindex="-1"><code>getUserByToken(accessToken, [accessSecret])</code> <a class="header-anchor" href="#getuserbytoken-accesstoken-accesssecret" aria-label="Permalink to &quot;\`getUserByToken(accessToken, [accessSecret])\`&quot;">​</a></h4><p>Retorna os detalhes do usuário usando o <code>accessToken</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getUserByToken</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(accessToken)</span></span></code></pre></div><p>Isso é útil ao usar o código do lado do cliente para executar a ação OAuth e você tem acesso ao <code>accessToken</code>.</p><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>O parâmetro <code>accessSecret</code> é necessário quando o protocolo <em>OAuth 1</em> é usado (por exemplo, o Twitter depende do OAuth 1).</p></div><h2 id="api-do-usuario" tabindex="-1">API do usuário <a class="header-anchor" href="#api-do-usuario" aria-label="Permalink to &quot;API do usuário&quot;">​</a></h2><p>Abaixo está a lista de métodos disponíveis em uma instância <a href="https://github.com/adonisjs/adonis-ally/blob/develop/src/AllyUser.js" target="_blank" rel="noreferrer">AllyUser</a>.</p><h4 id="getid" tabindex="-1"><code>getId</code> <a class="header-anchor" href="#getid" aria-label="Permalink to &quot;\`getId\`&quot;">​</a></h4><p>Retorna o ID do usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> user</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ally.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;facebook&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getUser</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getname" tabindex="-1"><code>getName</code> <a class="header-anchor" href="#getname" aria-label="Permalink to &quot;\`getName\`&quot;">​</a></h4><p>Retorna o nome do usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getemail" tabindex="-1"><code>getEmail</code> <a class="header-anchor" href="#getemail" aria-label="Permalink to &quot;\`getEmail\`&quot;">​</a></h4><p>Retorna o e-mail do usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getEmail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>Alguns provedores de terceiros não compartilham e-mail, nesse caso esse método retorna <code>null</code>.</p></div><h4 id="getnickname" tabindex="-1"><code>getNickname</code> <a class="header-anchor" href="#getnickname" aria-label="Permalink to &quot;\`getNickname\`&quot;">​</a></h4><p>Retorna o apelido/nome de exibição do usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getNickname</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getavatar" tabindex="-1"><code>getAvatar</code> <a class="header-anchor" href="#getavatar" aria-label="Permalink to &quot;\`getAvatar\`&quot;">​</a></h4><p>Retorna a URL pública para a foto do perfil do usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAvatar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getaccesstoken" tabindex="-1"><code>getAccessToken</code> <a class="header-anchor" href="#getaccesstoken" aria-label="Permalink to &quot;\`getAccessToken\`&quot;">​</a></h4><p>Retorna o token de acesso que pode ser usado posteriormente para atualizar o perfil do usuário:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAccessToken</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="getrefreshtoken" tabindex="-1"><code>getRefreshToken</code> <a class="header-anchor" href="#getrefreshtoken" aria-label="Permalink to &quot;\`getRefreshToken\`&quot;">​</a></h4><p>Token de atualização a ser usado quando o token de acesso expirar:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getRefreshToken</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>Disponível somente quando o provedor terceirizado implementa <em>OAuth 2</em>.</p></div><h4 id="getexpires" tabindex="-1"><code>getExpires</code> <a class="header-anchor" href="#getexpires" aria-label="Permalink to &quot;\`getExpires\`&quot;">​</a></h4><p>Dados de expiração do token de acesso:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getExpires</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>Disponível somente quando o provedor terceirizado implementa <em>OAuth 2</em>.</p></div><h4 id="gettokensecret" tabindex="-1"><code>getTokenSecret</code> <a class="header-anchor" href="#gettokensecret" aria-label="Permalink to &quot;\`getTokenSecret\`&quot;">​</a></h4><p>Retorna o segredo do token:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getTokenSecret</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">OBSERVAÇÃO</p><p>Disponível somente quando o provedor terceirizado implementa <em>OAuth 1</em>.</p></div><h4 id="getoriginal" tabindex="-1"><code>getOriginal</code> <a class="header-anchor" href="#getoriginal" aria-label="Permalink to &quot;\`getOriginal\`&quot;">​</a></h4><p>Payload original retornado pelo provedor terceirizado:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getOriginal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div>`,84)]))}const g=i(t,[["render",l]]);export{c as __pageData,g as default};
