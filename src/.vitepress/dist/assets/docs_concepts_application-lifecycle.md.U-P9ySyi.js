import{_ as a,c as i,a2 as e,o as n}from"./chunks/framework.Dz7_3PEu.js";const o="/assets/boot_phase_flow_chart.B273v6r-.png",t="/assets/start_phase_flow_chart.D6YLHKh5.png",l="/assets/termination_phase_flow_chart.CwOnLUnf.png",u=JSON.parse('{"title":"Ciclo de vida do aplicativo","description":"","frontmatter":{"summary":"Aprenda como o AdonisJS inicializa seu aplicativo e quais ganchos de ciclo de vida você pode usar para alterar o estado do aplicativo antes que ele seja considerado pronto."},"headers":[],"relativePath":"docs/concepts/application-lifecycle.md","filePath":"docs/concepts/application-lifecycle.md"}'),p={name:"docs/concepts/application-lifecycle.md"};function r(d,s,h,c,k,E){return n(),i("div",null,s[0]||(s[0]=[e('<h1 id="ciclo-de-vida-do-aplicativo" tabindex="-1">Ciclo de vida do aplicativo <a class="header-anchor" href="#ciclo-de-vida-do-aplicativo" aria-label="Permalink to &quot;Ciclo de vida do aplicativo&quot;">​</a></h1><p>Neste guia, aprenderemos como o AdonisJS inicializa seu aplicativo e quais ganchos de ciclo de vida você pode usar para alterar o estado do aplicativo antes que ele seja considerado pronto.</p><p>O ciclo de vida de um aplicativo depende do ambiente em que ele está sendo executado. Por exemplo, um processo de longa duração iniciado para atender a solicitações HTTP é gerenciado de forma diferente de um comando ace de curta duração.</p><p>Então, vamos entender o ciclo de vida do aplicativo para cada ambiente suportado.</p><h2 id="como-um-aplicativo-adonisjs-e-iniciado" tabindex="-1">Como um aplicativo AdonisJS é iniciado <a class="header-anchor" href="#como-um-aplicativo-adonisjs-e-iniciado" aria-label="Permalink to &quot;Como um aplicativo AdonisJS é iniciado&quot;">​</a></h2><p>Um aplicativo AdonisJS tem vários pontos de entrada, e cada ponto de entrada inicializa o aplicativo em um ambiente específico. Os seguintes arquivos de ponto de entrada são armazenados dentro do diretório <code>bin</code>.</p><ul><li>O ponto de entrada <code>bin/server.ts</code> inicializa o aplicativo AdonisJS para manipular solicitações HTTP. Quando você executa o comando <code>node ace serve</code>, nos bastidores, executamos esse arquivo como um processo filho.</li><li><a href="./../ace/introduction.html">Ace</a> nos bastidores.</li><li>O ponto de entrada <code>bin/test.ts</code> inicializa o aplicativo AdonisJS para executar testes usando Japa.</li></ul><p>Se você abrir qualquer um desses arquivos, nos verá usando o módulo <a href="https://github.com/adonisjs/core/blob/main/src/ignitor/main.ts#L23" target="_blank" rel="noreferrer">Ignitor</a> para conectar as coisas e, em seguida, iniciar o aplicativo.</p><p>O módulo Ignitor encapsula a lógica de iniciar um aplicativo AdonisJS. Nos bastidores, ele executa as seguintes ações.</p><ul><li>Classe <a href="https://github.com/adonisjs/application/blob/main/src/application.ts" target="_blank" rel="noreferrer">Application</a>.</li><li>Iniciar/inicializar o aplicativo.</li><li>Executar a ação principal para iniciar o aplicativo. Por exemplo, no caso de um servidor HTTP, a ação <code>main</code> envolve iniciar o servidor HTTP. Enquanto isso, no caso de testes, a ação <code>main</code> envolve executar os testes.</li></ul><p>A <a href="https://github.com/adonisjs/core/tree/main/src/ignitor" target="_blank" rel="noreferrer">base de código do Ignitor</a> é relativamente simples, então navegue pelo código-fonte para entendê-lo melhor.</p><h2 id="a-fase-de-inicializacao" tabindex="-1">A fase de inicialização <a class="header-anchor" href="#a-fase-de-inicializacao" aria-label="Permalink to &quot;A fase de inicialização&quot;">​</a></h2><p>A fase de inicialização permanece a mesma para todos os ambientes, exceto o ambiente <code>console</code>. No ambiente <code>console</code>, o comando executado decide se deve inicializar o aplicativo.</p><p>Você só pode usar as ligações e serviços do contêiner depois que o aplicativo for inicializado.</p><p><img src="'+o+'" alt=""></p><h2 id="a-fase-de-inicializacao-1" tabindex="-1">A fase de inicialização <a class="header-anchor" href="#a-fase-de-inicializacao-1" aria-label="Permalink to &quot;A fase de inicialização&quot;">​</a></h2><p>A fase de inicialização varia entre todos os ambientes. Além disso, o fluxo de execução é dividido nas seguintes subfases</p><ul><li><p>A fase <code>pré-inicialização</code> se refere às ações realizadas antes de iniciar o aplicativo.</p></li><li><p>A fase <code>post-start</code> se refere às ações realizadas após iniciar o aplicativo. No caso de um servidor HTTP, as ações serão executadas após o servidor HTTP estar pronto para aceitar novas conexões.</p></li></ul><p><img src="'+t+`" alt=""></p><h3 id="durante-o-ambiente-da-web" tabindex="-1">Durante o ambiente da web <a class="header-anchor" href="#durante-o-ambiente-da-web" aria-label="Permalink to &quot;Durante o ambiente da web&quot;">​</a></h3><p>No ambiente da web, uma conexão HTTP de longa duração é criada para escutar solicitações de entrada, e o aplicativo permanece no estado <code>ready</code> até que o servidor falhe ou o processo receba um sinal para desligar.</p><h3 id="durante-o-ambiente-de-teste" tabindex="-1">Durante o ambiente de teste <a class="header-anchor" href="#durante-o-ambiente-de-teste" aria-label="Permalink to &quot;Durante o ambiente de teste&quot;">​</a></h3><p>As ações <strong>pre-start</strong> e <strong>post-start</strong> são executadas no ambiente de teste. Depois disso, importamos os arquivos de teste e executamos os testes.</p><h3 id="durante-o-ambiente-do-console" tabindex="-1">Durante o ambiente do console <a class="header-anchor" href="#durante-o-ambiente-do-console" aria-label="Permalink to &quot;Durante o ambiente do console&quot;">​</a></h3><p>No ambiente <code>console</code>, o comando executado decide se deve iniciar o aplicativo.</p><p>Um comando pode iniciar o aplicativo habilitando o sinalizador <code>options.startApp</code>. Como resultado, as ações <strong>pré-início</strong> e <strong>pós-início</strong> serão executadas antes do método <code>run</code> do comando.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { BaseCommand } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/ace&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> GreetCommand</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BaseCommand</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  static</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> options</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    startApp: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.app.isReady) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="a-fase-de-encerramento" tabindex="-1">A fase de encerramento <a class="header-anchor" href="#a-fase-de-encerramento" aria-label="Permalink to &quot;A fase de encerramento&quot;">​</a></h2><p>O encerramento do aplicativo varia muito entre processos de curta e longa duração.</p><p>Um comando de curta duração ou o processo de teste inicia o encerramento após o término da operação principal.</p><p>Um processo de servidor HTTP de longa duração aguarda sinais de saída como <code>SIGTERM</code> para iniciar o processo de encerramento.</p><p><img src="`+l+`" alt=""></p><h3 id="respondendo-a-sinais-de-processo" tabindex="-1">Respondendo a sinais de processo <a class="header-anchor" href="#respondendo-a-sinais-de-processo" aria-label="Permalink to &quot;Respondendo a sinais de processo&quot;">​</a></h3><p>Em todos os ambientes, iniciamos um processo de encerramento normal quando o aplicativo recebe um sinal <code>SIGTERM</code>. Se você iniciou seu aplicativo usando <a href="https://pm2.keymetrics.io/docs/usage/signals-clean-restart/" target="_blank" rel="noreferrer">pm2</a>, o encerramento normal ocorrerá após receber o evento <code>SIGINT</code>.</p><h3 id="durante-o-ambiente-da-web-1" tabindex="-1">Durante o ambiente da web <a class="header-anchor" href="#durante-o-ambiente-da-web-1" aria-label="Permalink to &quot;Durante o ambiente da web&quot;">​</a></h3><p>No ambiente da web, o aplicativo continua em execução até que o servidor HTTP subjacente trave com um erro. Nesse caso, iniciamos o encerramento do aplicativo.</p><h3 id="durante-o-ambiente-de-teste-1" tabindex="-1">Durante o ambiente de teste <a class="header-anchor" href="#durante-o-ambiente-de-teste-1" aria-label="Permalink to &quot;Durante o ambiente de teste&quot;">​</a></h3><p>O encerramento normal começa depois que todos os testes foram executados.</p><h3 id="durante-o-ambiente-de-console" tabindex="-1">Durante o ambiente de console <a class="header-anchor" href="#durante-o-ambiente-de-console" aria-label="Permalink to &quot;Durante o ambiente de console&quot;">​</a></h3><p>No ambiente <code>console</code>, o encerramento do aplicativo depende do comando executado.</p><p>O aplicativo será encerrado assim que o comando for executado, a menos que o sinalizador <code>options.staysAlive</code> esteja habilitado e, neste caso, o comando deve encerrar explicitamente o aplicativo.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { BaseCommand } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/ace&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> GreetCommand</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> BaseCommand</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  static</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> options</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    startApp: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    staysAlive: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> runSomeProcess</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Termina o processo</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    await</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">terminate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="ganchos-do-ciclo-de-vida" tabindex="-1">Ganchos do ciclo de vida <a class="header-anchor" href="#ganchos-do-ciclo-de-vida" aria-label="Permalink to &quot;Ganchos do ciclo de vida&quot;">​</a></h2><p>Os ganchos do ciclo de vida permitem que você se conecte ao processo de bootstrap do aplicativo e execute ações conforme o aplicativo passa por diferentes estados.</p><p>Você pode ouvir ganchos usando as classes do provedor de serviços ou defini-los em linha na classe do aplicativo.</p><h3 id="retornos-de-chamada-em-linha" tabindex="-1">Retornos de chamada em linha <a class="header-anchor" href="#retornos-de-chamada-em-linha" aria-label="Permalink to &quot;Retornos de chamada em linha&quot;">​</a></h3><p>Você deve registrar ganchos do ciclo de vida assim que uma instância do aplicativo for criada.</p><p>Os arquivos de ponto de entrada <code>bin/server.ts</code>, <code>bin/console.ts</code> e <code>bin/test.ts</code> criam uma nova instância de aplicativo para diferentes ambientes, e você pode registrar retornos de chamada em linha nesses arquivos.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Application</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> URL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;../&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">meta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.url))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Ignitor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">APP_ROOT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { importer: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">IMPORTER</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tap</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">app</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">booted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;invoked after the app is booted&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ready</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;invoked after the app is ready&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">terminating</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;invoked before the termination starts&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line highlighted"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><ul><li><p><code>initiating</code>: As ações de hook são chamadas antes que o aplicativo passe para o estado iniciado. O arquivo <code>adonisrc.ts</code> é analisado após a execução dos hooks <code>initiating</code>.</p></li><li><p><code>booting</code>: As ações de hook são chamadas antes da inicialização do aplicativo. Os arquivos de configuração são importados após a execução dos hooks <code>booting</code>.</p></li><li><p><code>booted</code>: As ações de hook são invocadas após todos os provedores de serviço terem sido registrados e inicializados.</p></li><li><p><code>starting</code>: As ações de hook são invocadas antes da importação dos arquivos de pré-carregamento.</p></li><li><p><code>ready</code>: As ações de hook são invocadas após o aplicativo estar pronto.</p></li><li><p><code>terminating</code>: As ações de hook são invocadas quando o processo de saída normal começa. Por exemplo, este hook pode fechar conexões de banco de dados ou encerrar fluxos abertos.</p></li></ul><h3 id="usando-provedores-de-servico" tabindex="-1">Usando provedores de serviço <a class="header-anchor" href="#usando-provedores-de-servico" aria-label="Permalink to &quot;Usando provedores de serviço&quot;">​</a></h3><p>Os provedores de serviço definem os hooks do ciclo de vida como métodos na classe do provedor. Recomendamos usar provedores de serviço em vez de retornos de chamada em linha, pois eles mantêm tudo bem organizado.</p><p>A seguir está a lista de métodos de ciclo de vida disponíveis.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { ApplicationService } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/types&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AppProvider</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  constructor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">protected</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ApplicationService</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  register</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> boot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ready</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shutdown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><ul><li><p><code>register</code>: O método register registra ligações dentro do contêiner. Este método é síncrono por design.</p></li><li><p><code>boot</code>: O método boot é usado para inicializar ou inicializar as ligações que você registrou dentro do contêiner.</p></li><li><p><code>start</code>: O método start é executado logo antes do método <code>ready</code>. Ele permite que você execute ações que as ações do hook <code>ready</code> podem precisar.</p></li><li><p><code>ready</code>: O método ready é executado após o aplicativo ser considerado pronto.</p></li><li><p><code>shutdown</code>: O método shutdown é invocado quando o aplicativo inicia o desligamento normal. Você pode usar esse método para fechar conexões de banco de dados ou encerrar fluxos abertos.</p></li></ul>`,55)]))}const g=a(p,[["render",r]]);export{u as __pageData,g as default};
