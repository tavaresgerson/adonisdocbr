import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.nQaBHiNx.js";const c=JSON.parse('{"title":"Arquivos","description":"","frontmatter":{},"headers":[],"relativePath":"docs/03-getting-started/10-files.md","filePath":"docs/03-getting-started/10-files.md"}'),e={name:"docs/03-getting-started/10-files.md"},t=n(`<h1 id="arquivos" tabindex="-1">Arquivos <a class="header-anchor" href="#arquivos" aria-label="Permalink to &quot;Arquivos&quot;">​</a></h1><p>AdonisJS possui suporte integrado para lidar com o upload de arquivos. Você pode gerenciar facilmente <em>uploads em massa</em>, <em>validação de tamanho/extensão de arquivo</em> e adicionar verificações globais para negar solicitações contendo mais do que a carga útil esperada.</p><h2 id="exemplo-basico" tabindex="-1">Exemplo básico <a class="header-anchor" href="#exemplo-basico" aria-label="Permalink to &quot;Exemplo básico&quot;">​</a></h2><p>Vamos considerar um exemplo de upload do avatar do usuário. Vamos considerar isso como uma solicitação <strong>PUT</strong> para fazer o upload do avatar do perfil do usuário e executar as validações necessárias para garantir que o usuário esteja fazendo o upload do arquivo correto.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .app/Http/routes.js</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">put</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/users/:id/avatar&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;UsersController.updateAvatar&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>Em seguida, você precisa criar o método <code>updateAvatar</code> no controlador <code>UsersController</code>.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .app/Http/Controllers/UsersController.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;use strict&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Helpers</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Helpers&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> User</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;App/Model/User&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  *</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> updateAvatar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">response</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> avatar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;avatar&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      maxSize: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2mb&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      allowedExtensions: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;jpeg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> userId</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">param</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;id&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> user</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> User.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">findOrFail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userId)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> fileName</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`\${</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Date</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getTime</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">()</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}.\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extension</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">()</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">move</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), fileName) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">moved</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">badRequest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">errors</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    user.avatar </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uploadPath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> user.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">save</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ok</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Avatar updated successfully&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UsersController</span></span></code></pre></div><ol><li>Primeiro, obtemos um objeto de arquivo do objeto &quot;request&quot;. Além disso, podemos definir o &quot;maxSize&quot; e o &quot;allowedExtensions&quot; para validar o arquivo.</li><li>É importante renomear o arquivo, mesmo é feito por pegar a data e hora atuais e anexar a extensão do arquivo a ele.</li><li>Em seguida, chamamos a operação de movimento no arquivo instância. Quaisquer erros de validação serão retornados usando o método &quot;errors ()&quot;.</li><li>Se tudo corresse bem, definimos o caminho do avatar ao lado do objeto modelo de usuário e o persistimos no banco de dados.</li></ol><h2 id="configuracao" tabindex="-1">Configuração <a class="header-anchor" href="#configuracao" aria-label="Permalink to &quot;Configuração&quot;">​</a></h2><p>A configuração para o upload de arquivos é armazenada dentro do arquivo <code>config/bodyParser.js</code>.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// .config/bodyParser.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uploads</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  multiple</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  hash</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  maxSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2mb&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ol><li>O &#39;maxSize&#39; é calculado em todos os arquivos carregados, o que significa que carregar dois arquivos de &#39;1.5mb&#39; cada excederá esse limite.</li><li>O <code>maxSize</code> é verificado logo no início. Isso garante que os atacantes não engasguem seus servidores enviando <strong>gigabytes</strong> de dados.</li></ol><h2 id="arquivo-instancia" tabindex="-1">Arquivo Instância <a class="header-anchor" href="#arquivo-instancia" aria-label="Permalink to &quot;Arquivo Instância&quot;">​</a></h2><p>O método <code>request.file</code> retorna uma instância da classe <code>File</code>, que possui diversos métodos para obter informações sobre o arquivo enviado e movê-lo para um determinado caminho.</p><p>Carregando vários arquivos retorna uma matriz de instâncias da classe <code>File</code>. Por exemplo:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> profilePics</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;profile[]&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// profilePics will be an array</span></span></code></pre></div><h2 id="validacao" tabindex="-1">Validação <a class="header-anchor" href="#validacao" aria-label="Permalink to &quot;Validação&quot;">​</a></h2><p><strong>Arquivo instância</strong> pode gerenciar a validação no tamanho e extensão do arquivo para você. Você só precisa passar as opções ao acessar a instância.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> avatar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;avatar&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  maxSize: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2mb&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  allowedExtensions: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>Agora quando você chamar o método &quot;move&quot;, as validações serão acionadas com base na configuração definida. Caso as validações acima não sejam suficientes para você, você pode implementar seu próprio método &quot;validate&quot;.</p><h3 id="validacao-manual" tabindex="-1">Validação manual <a class="header-anchor" href="#validacao-manual" aria-label="Permalink to &quot;Validação manual&quot;">​</a></h3><p>Retornar <em>true</em> ou <em>false</em> do método <code>validate</code> irá definir se a validação foi aprovada ou não. Além disso, você será responsável por definir manualmente a mensagem de erro no objeto da instância.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">----</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> avatar</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;avatar&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">validate</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extension</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!==</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;foo&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">_setError</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;We support foo files only&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="metodos-de-instancia-do-arquivo" tabindex="-1">Métodos de Instância do Arquivo <a class="header-anchor" href="#metodos-de-instancia-do-arquivo" aria-label="Permalink to &quot;Métodos de Instância do Arquivo&quot;">​</a></h2><p>Abaixo está a lista de métodos disponíveis na instância do arquivo.</p><h4 id="clientname" tabindex="-1">clientName <a class="header-anchor" href="#clientname" aria-label="Permalink to &quot;clientName&quot;">​</a></h4><p>Retorna o nome do arquivo enviado.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clientName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="tamanho-do-cliente" tabindex="-1">tamanho do cliente <a class="header-anchor" href="#tamanho-do-cliente" aria-label="Permalink to &quot;tamanho do cliente&quot;">​</a></h4><p>Retorna o tamanho do arquivo (em bytes).</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clientSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="mimetype" tabindex="-1">mimeType <a class="header-anchor" href="#mimetype" aria-label="Permalink to &quot;mimeType&quot;">​</a></h4><p>Retorna o tipo MIME do arquivo.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mimeType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="extensao" tabindex="-1">extensão <a class="header-anchor" href="#extensao" aria-label="Permalink to &quot;extensão&quot;">​</a></h4><p>Retorna a extensão do arquivo.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extension</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="tmppath" tabindex="-1">tmpPath <a class="header-anchor" href="#tmppath" aria-label="Permalink to &quot;tmpPath&quot;">​</a></h4><p>O caminho para a pasta temporária, onde o arquivo foi carregado.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tmpPath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="existe" tabindex="-1">existe <a class="header-anchor" href="#existe" aria-label="Permalink to &quot;existe&quot;">​</a></h4><p>Indica se o arquivo existe ou não dentro da pasta temporária.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">exists</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="move-paracaminho-novonome" tabindex="-1">move(paraCaminho, [novoNome]) <a class="header-anchor" href="#move-paracaminho-novonome" aria-label="Permalink to &quot;move(paraCaminho, [novoNome])&quot;">​</a></h4><p>Mova o arquivo para um local especificado com um nome opcional. Se <code>newName</code> não for definido, ele fará uso de <code>clientName()</code></p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">move</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span></code></pre></div><h4 id="delete" tabindex="-1">delete() <a class="header-anchor" href="#delete" aria-label="Permalink to &quot;delete()&quot;">​</a></h4><p>Deletar o arquivo da pasta <code>tmp</code> após o arquivo ter sido movido.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="movido" tabindex="-1">movido <a class="header-anchor" href="#movido" aria-label="Permalink to &quot;movido&quot;">​</a></h4><p>Indica se a operação de movimento foi bem sucedida ou não.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">move</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">moved</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // moved successfully</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="erros" tabindex="-1">erros <a class="header-anchor" href="#erros" aria-label="Permalink to &quot;erros&quot;">​</a></h4><p>Retorna erros ocorridos durante o processo de &quot;move&quot;.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">move</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">moved</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">send</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">errors</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="uploadpath" tabindex="-1">uploadPath <a class="header-anchor" href="#uploadpath" aria-label="Permalink to &quot;uploadPath&quot;">​</a></h4><p>O caminho completo para o diretório de upload com o nome do arquivo.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">move</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uploadPath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h4 id="nome-do-arquivo" tabindex="-1">nome_do_arquivo <a class="header-anchor" href="#nome-do-arquivo" aria-label="Permalink to &quot;nome_do_arquivo&quot;">​</a></h4><p>Nome do arquivo enviado.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">move</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;selfie.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uploadName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><blockquote><p>NOTE <code>uploadPath</code> e <code>uploadName</code> só estarão disponíveis após a operação de movimento.</p></blockquote><h4 id="tojson" tabindex="-1">toJSON <a class="header-anchor" href="#tojson" aria-label="Permalink to &quot;toJSON&quot;">​</a></h4><p>Retorna a representação <strong>JSON</strong> das propriedades do arquivo.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">avatar.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toJSON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div>`,65),l=[t];function h(p,k,o,r,d,E){return a(),i("div",null,l)}const y=s(e,[["render",h]]);export{c as __pageData,y as default};