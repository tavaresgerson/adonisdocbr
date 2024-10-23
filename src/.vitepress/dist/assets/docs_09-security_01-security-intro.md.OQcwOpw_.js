import{_ as s,c as a,o as i,a4 as e}from"./chunks/framework.nQaBHiNx.js";const E=JSON.parse('{"title":"Introdução","description":"","frontmatter":{},"headers":[],"relativePath":"docs/09-security/01-security-intro.md","filePath":"docs/09-security/01-security-intro.md"}'),n={name:"docs/09-security/01-security-intro.md"},o=e(`<h1 id="introducao" tabindex="-1">Introdução <a class="header-anchor" href="#introducao" aria-label="Permalink to &quot;Introdução&quot;">​</a></h1><p>Manter aplicativos web seguros é uma das coisas mais importantes. O AdonisJS vem com camadas de segurança e sanitização de dados para manter seus aplicativos web longe dos ataques comuns.</p><blockquote><p>NOTE Se você encontrar algum bug de segurança, certifique-se de compartilhá-lo em <a href="mailto:virk@adonisjs.com" target="_blank" rel="noreferrer">virk@adonisjs.com</a>. Por favor, não crie um problema no GitHub, pois isso pode afetar os aplicativos em execução na produção. Nós revelaremos o problema após enviar a correção para o bug.</p></blockquote><h2 id="injecao-de-sql" tabindex="-1">Injeção de SQL <a class="header-anchor" href="#injecao-de-sql" aria-label="Permalink to &quot;Injeção de SQL&quot;">​</a></h2><p>A injeção de SQL é um dos ataques mais comuns na web, onde o usuário final fará uso das entradas e passará a consulta SQL em vez do <em>nome de usuário</em>, <em>e-mail</em>, etc.</p><p>Lucid modelos e construtor de consulta de banco de dados garantirão que você execute consultas preparadas, o que por sua vez o protege contra injeção SQL. Embora seu aplicativo possa ter a necessidade de executar &quot;SQL&quot; cru, em vez de usar o método do construtor de consultas, é recomendado aproveitar o método &quot;raw&quot; e passar os vinculações como parâmetros.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Not Recommended</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> username</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">param</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;username&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> users</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Database</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">table</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;users&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Database.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">raw</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`username = \${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">username</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Correct Way</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> username</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">param</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;username&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> users</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Database</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">table</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;users&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Database.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">raw</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;username = ?&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, [username]))</span></span></code></pre></div><h4 id="lista-de-verificacao" tabindex="-1">Lista de verificação <a class="header-anchor" href="#lista-de-verificacao" aria-label="Permalink to &quot;Lista de verificação&quot;">​</a></h4><p><a href="/database/query-builder.html">provedor de banco de dados</a> ou <a href="/common-web-tools/validator.html">sanitizer</a> para manter seu banco de dados seguro.</p><ul><li>Sempre execute <em>consultas preparadas</em> passando os valores da consulta como um array para o método <code>raw</code>.</li></ul><h2 id="seguranca-de-sessao" tabindex="-1">Segurança de Sessão <a class="header-anchor" href="#seguranca-de-sessao" aria-label="Permalink to &quot;Segurança de Sessão&quot;">​</a></h2><p>As sessões podem vazar informações importantes se não forem tratadas com cuidado. O AdonisJS irá criptografar e assinar todos os cookies usando a <code>CHAVE_APP</code> definida no arquivo <code>.env</code>. Tenha certeza de manter a <code>CHAVE_APP</code> secreta e nunca compartilhe com ninguém e nunca envie para sistemas de controle de versão como o Github.</p><h3 id="configuracao-da-sessao" tabindex="-1">Configuração da Sessão <a class="header-anchor" href="#configuracao-da-sessao" aria-label="Permalink to &quot;Configuração da Sessão&quot;">​</a></h3><p>A configuração da sessão é salva dentro do arquivo <code>config/session.js</code>, você pode configurar opções de acordo com suas necessidades e certifique-se de dar atenção para os seguintes pares chave/valor.</p><h4 id="configuracoes-importantes" tabindex="-1">Configurações Importantes <a class="header-anchor" href="#configuracoes-importantes" aria-label="Permalink to &quot;Configurações Importantes&quot;">​</a></h4><ul><li>Certifique-se de que o <code>httpOnly</code> esteja definido como <em>true</em>. Manter isso como <em>false</em> tornará acessível através do JavaScript usando <code>document.cookie</code>.</li><li>A propriedade &#39;sameSite&#39; garante que seu cookie de sessão não seja visível ou acessível em diferentes domínios.</li></ul><h2 id="formularios-visualizacoes" tabindex="-1">Formulários &amp; Visualizações <a class="header-anchor" href="#formularios-visualizacoes" aria-label="Permalink to &quot;Formulários &amp; Visualizações&quot;">​</a></h2><p>Para manter o ciclo de desenvolvimento simples e produtivo, o AdonisJS vem com alguns recursos que você pode querer considerar antes de lançar seu site para o público.</p><h3 id="form-method-spoofing" tabindex="-1">Form Method Spoofing <a class="header-anchor" href="#form-method-spoofing" aria-label="Permalink to &quot;Form Method Spoofing&quot;">​</a></h3><p>As formas HTML são capazes apenas de fazer solicitações GET e POST, o que significa que você não pode usar todos os verbos HTTP para realizar operações RESTful. Para facilitar isso AdonisJs permite definir o método HTTP como uma string de consulta dentro da URL, o que é conhecido como <em>spoofing do método de formulário</em>.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Route</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">put</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/users/:id&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;UserController.update&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- View --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">form</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> action</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/users/1?_method=PUT&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> method</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;POST&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">form</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>Definir <code>_method=PUT</code> irá converter o método HTTP para PUT em vez de POST. Isso torna mais fácil usar qualquer verbo HTTP simplesmente falsificando-o. Aqui estão algumas coisas que você deve estar ciente.</p><h4 id="lista-de-verificacao-1" tabindex="-1">Lista de verificação <a class="header-anchor" href="#lista-de-verificacao-1" aria-label="Permalink to &quot;Lista de verificação&quot;">​</a></h4><p>AdonisJS irá apenas falsificar métodos quando o método HTTP real for POST, ou seja, fazer uma requisição GET com * _method* não terá efeito algum.</p><ul><li>Você pode desativar o spoofing de formulário definindo <code>allowMethodSpoofing=false</code> dentro de <code>config/app.js</code>.</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  allowMethodSpoofing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="injetando-injecao-de-dependencia-em-vistas" tabindex="-1">Injetando Injeção de Dependência em Vistas <a class="header-anchor" href="#injetando-injecao-de-dependencia-em-vistas" aria-label="Permalink to &quot;Injetando Injeção de Dependência em Vistas&quot;">​</a></h3><p>AdonisJS torna simples para você usar as injeções de dependências dentro de suas visualizações, o que significa que você pode acessar os modelos Lucid a partir de suas visualizações para buscar dados do banco de dados. Saiba mais sobre <a href="/visualizações/visualizações.html">injetando provedores</a></p><p>Esta funcionalidade pode abrir alguns buracos de segurança sérios se suas visualizações forem editáveis pelo mundo exterior. Por exemplo, você está criando um CMS usando AdonisJS e deseja que seus usuários criem partes parciais reutilizáveis de visualização. O usuário final pode buscar o <em>Modelo de Usuário</em> dentro sua parcial e pode excluir todos os usuários.</p><h4 id="lista-de-verificacao-2" tabindex="-1">Lista de verificação <a class="header-anchor" href="#lista-de-verificacao-2" aria-label="Permalink to &quot;Lista de verificação&quot;">​</a></h4><ul><li>Tenha certeza de definir <code>injectServices=false</code> dentro do arquivo <code>config/app.js</code>.</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">views</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  injectServices</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ul><li>Se estiver usando injeção de serviço, certifique-se de que suas visualizações não sejam editáveis pelo mundo exterior.</li></ul><h2 id="upload-de-arquivos" tabindex="-1">Upload de arquivos <a class="header-anchor" href="#upload-de-arquivos" aria-label="Permalink to &quot;Upload de arquivos&quot;">​</a></h2><p>Os atacantes geralmente tentam fazer o upload de arquivos maliciosos para o servidor e depois executar esses arquivos carregados para obter acesso ao servidor ou realizar alguma ação destrutiva.</p><p>Não são apenas arquivos que são carregados para obter acesso ao servidor, muitas vezes você encontrará pessoas tentando carregar arquivos enormes para deixar seu servidor ocupado em fazer o upload de arquivos e começar a lançar erros de <em>TIMEOUT</em> para outras solicitações.</p><p>Para lidar com esse pedaço, o AdonisJS permite que você defina o <em>tamanho máximo de upload</em> para ser processado pelo servidor, o que significa que qualquer arquivo maior do que o tamanho especificado será negado sem processamento e mantém seu servidor em um estado saudável.</p><h4 id="lista-de-verificacao-3" tabindex="-1">Lista de verificação <a class="header-anchor" href="#lista-de-verificacao-3" aria-label="Permalink to &quot;Lista de verificação&quot;">​</a></h4><ul><li>Tenha certeza de definir o <code>maxSize</code> dentro do arquivo <code>config/bodyParser.js</code>.</li></ul><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uploads</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  maxSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2mb&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ul><li>Nunca armazene arquivos carregados dentro do diretório &quot;public&quot;, já que os arquivos no diretório &quot;public&quot; podem ser acessados diretamente.</li><li>Renomeie sempre os arquivos antes de carregá-los.</li><li>Nunca compartilhe o local real do arquivo com os usuários finais. Em vez disso, tente salvar a referência do arquivo dentro do banco de dados com um <em>ID exclusivo</em> e configure uma rota para servir o arquivo usando o <code>ID</code>.</li></ul><ul><li></li></ul><p>Example:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Helpers</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Helpers&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/download/:fileId&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">response</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> fileId</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">param</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;fileId&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> file</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> yield</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Files.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">findorFail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fileId)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">download</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Helpers.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">storagePath</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;uploads/\${file.path}&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div>`,46),t=[o];function l(r,p,d,h,k,c){return i(),a("div",null,t)}const g=s(n,[["render",l]]);export{E as __pageData,g as default};