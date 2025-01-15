import{_ as a,c as i,a2 as e,o as n}from"./chunks/framework.Dz7_3PEu.js";const k=JSON.parse('{"title":"Implantação","description":"","frontmatter":{"summary":"Aprenda sobre diretrizes gerais para implantar um aplicativo AdonisJS em produção."},"headers":[],"relativePath":"docs/getting-started/deployment.md","filePath":"docs/getting-started/deployment.md"}'),r={name:"docs/getting-started/deployment.md"};function p(o,s,l,t,d,c){return n(),i("div",null,s[0]||(s[0]=[e(`<h1 id="implantacao" tabindex="-1">Implantação <a class="header-anchor" href="#implantacao" aria-label="Permalink to &quot;Implantação&quot;">​</a></h1><p>Implantar um aplicativo AdonisJS não é diferente de implantar um aplicativo Node.js padrão. Você precisa de um servidor executando <code>Node.js &gt;= 20.6</code> junto com <code>npm</code> para instalar dependências de produção.</p><p>Este guia cobrirá as diretrizes genéricas para implantar e executar um aplicativo AdonisJS em produção.</p><h2 id="criando-compilacao-de-producao" tabindex="-1">Criando compilação de produção <a class="header-anchor" href="#criando-compilacao-de-producao" aria-label="Permalink to &quot;Criando compilação de produção&quot;">​</a></h2><p>Como primeiro passo, você deve criar a compilação de produção do seu aplicativo AdonisJS executando o comando <code>build</code>.</p><p>Veja também: <a href="./../concepts/typescript_build_process.html">Processo de compilação TypeScript</a></p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ace</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>A saída compilada é escrita dentro do diretório <code>./build</code>. Se você usar o Vite, sua saída será escrita dentro do diretório <code>./build/public</code>.</p><p>Depois de criar a compilação de produção, você pode copiar a pasta <code>./build</code> para seu servidor de produção. <strong>De agora em diante, a pasta de compilação será a raiz do seu aplicativo</strong>.</p><h3 id="criando-uma-imagem-docker" tabindex="-1">Criando uma imagem Docker <a class="header-anchor" href="#criando-uma-imagem-docker" aria-label="Permalink to &quot;Criando uma imagem Docker&quot;">​</a></h3><p>Se você estiver usando o Docker para implantar seu aplicativo, você pode criar uma imagem Docker usando o seguinte <code>Dockerfile</code>.</p><div class="language-dockerfile vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">dockerfile</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> node:20.12.2-alpine3.18 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Todos os estágios de deps</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> deps</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WORKDIR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ADD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> package.json package-lock.json ./</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> npm ci</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Produção somente estágio de deps</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> production-deps</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WORKDIR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ADD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> package.json package-lock.json ./</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> npm ci --omit=dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Estágio de construção</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> build</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WORKDIR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> --from=deps /app/node_modules /app/node_modules</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ADD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> . .</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> node ace build</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Estágio de produção</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> NODE_ENV=production</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WORKDIR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> --from=production-deps /app/node_modules /app/node_modules</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> --from=build /app/build /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">EXPOSE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 8080</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CMD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;node&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./bin/server.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>Sinta-se à vontade para modificar o Dockerfile para atender às suas necessidades.</p><h2 id="configurando-um-proxy-reverso" tabindex="-1">Configurando um proxy reverso <a class="header-anchor" href="#configurando-um-proxy-reverso" aria-label="Permalink to &quot;Configurando um proxy reverso&quot;">​</a></h2><p>Aplicativos Node.js são geralmente <a href="https://medium.com/intrinsic-blog/why-should-i-use-a-reverse-proxy-if-node-js-is-production-ready-5a079408b2ca" target="_blank" rel="noreferrer">implantados atrás de um proxy reverso</a> servidor como o Nginx. Portanto, o tráfego de entrada nas portas <code>80</code> e <code>443</code> será manipulado pelo Nginx primeiro e depois encaminhado para seu aplicativo Node.js.</p><p>A seguir, um exemplo de arquivo de configuração do Nginx que você pode usar como ponto de partida.</p><div class="warning custom-block"><p class="custom-block-title">ATENÇÃO</p><p>Certifique-se de substituir os valores dentro dos colchetes angulares <code>&lt;&gt;</code>.</p></div><div class="language-nginx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  listen </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[::]:80;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;APP_DOMAIN.COM&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> / </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://localhost:&lt;ADONIS_PORT&gt;;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_http_version </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Upgrade $http_upgrade;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Connection </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;upgrade&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Host $host;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_cache_bypass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$http_upgrade;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h2 id="definindo-variaveis-​​de-ambiente" tabindex="-1">Definindo variáveis ​​de ambiente <a class="header-anchor" href="#definindo-variaveis-​​de-ambiente" aria-label="Permalink to &quot;Definindo variáveis ​​de ambiente&quot;">​</a></h2><p>Se você estiver implantando seu aplicativo em um servidor bare-bone, como um Droplet DigitalOcean ou uma instância EC2, você pode usar um arquivo <code>.env</code> para definir as variáveis ​​de ambiente. Certifique-se de que o arquivo esteja armazenado com segurança e que somente usuários autorizados possam acessá-lo.</p><div class="info custom-block"><p class="custom-block-title">NOTA</p><p>Se você estiver usando uma plataforma de implantação como Heroku ou Cleavr, você pode usar o painel de controle deles para definir as variáveis ​​de ambiente.</p></div><p>Supondo que você tenha criado o arquivo <code>.env</code> em um diretório <code>/etc/secrets</code>, você deve iniciar seu servidor de produção da seguinte forma.</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ENV_PATH</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/secrets</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build/bin/server.js</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>A variável de ambiente <code>ENV_PATH</code> instrui o AdonisJS a procurar o arquivo <code>.env</code> dentro do diretório mencionado.</p><h2 id="iniciando-o-servidor-de-producao" tabindex="-1">Iniciando o servidor de produção <a class="header-anchor" href="#iniciando-o-servidor-de-producao" aria-label="Permalink to &quot;Iniciando o servidor de produção&quot;">​</a></h2><p>Você pode iniciar o servidor de produção executando o arquivo <code>node server.js</code>. No entanto, é recomendável usar um gerenciador de processos como <a href="https://pm2.keymetrics.io/docs/usage/quick-start" target="_blank" rel="noreferrer">pm2</a>.</p><ul><li>O PM2 executará seu aplicativo em segundo plano sem bloquear a sessão de terminal atual.</li><li>Ele reiniciará o aplicativo, se seu aplicativo travar ao atender solicitações. <a href="https://nodejs.org/api/cluster.html#cluster" target="_blank" rel="noreferrer">modo cluster</a></li></ul><p>A seguir está um exemplo de <a href="https://pm2.keymetrics.io/docs/usage/application-declaration" target="_blank" rel="noreferrer">arquivo de ecossistema pm2</a> que você pode usar como ponto de partida.</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ecosystem.config.js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  apps: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;web-app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      script: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./server.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      instances: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;max&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      exec_mode: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;cluster&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      autorestart: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Iniciar servidor</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pm2</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ecosystem.config.js</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="migrando-banco-de-dados" tabindex="-1">Migrando banco de dados <a class="header-anchor" href="#migrando-banco-de-dados" aria-label="Permalink to &quot;Migrando banco de dados&quot;">​</a></h2><p>Se estiver usando um banco de dados SQL, você deve executar as migrações do banco de dados no servidor de produção para criar as tabelas necessárias.</p><p>Se estiver usando o Lucid, você pode executar o seguinte comando.</p><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ace</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> migration:run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --force</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>O sinalizador <code>--force</code> é necessário ao executar migrações no ambiente de produção.</p><h3 id="quando-executar-migracoes" tabindex="-1">Quando executar migrações <a class="header-anchor" href="#quando-executar-migracoes" aria-label="Permalink to &quot;Quando executar migrações&quot;">​</a></h3><p>Além disso, seria melhor se você sempre executasse as migrações antes de reiniciar o servidor. Então, se a migração falhar, não reinicie o servidor.</p><p>Usando um serviço gerenciado como Cleavr ou Heroku, eles podem lidar automaticamente com esse caso de uso. Caso contrário, você terá que executar o script de migração dentro de um pipeline de CI/CD ou executá-lo manualmente por meio de SSH.</p><h3 id="nao-faca-rollback-na-producao" tabindex="-1">Não faça rollback na produção <a class="header-anchor" href="#nao-faca-rollback-na-producao" aria-label="Permalink to &quot;Não faça rollback na produção&quot;">​</a></h3><p>Reverter migrações na produção é uma operação arriscada. O método <code>down</code> em seus arquivos de migração geralmente contém ações destrutivas como <strong>descartar a tabela</strong> ou <strong>remover uma coluna</strong> e assim por diante.</p><p>É recomendável desativar os rollbacks na produção dentro do arquivo config/database.ts e, em vez disso, criar uma nova migração para corrigir o problema e executá-la no servidor de produção.</p><p>Desabilitar os rollbacks na produção garantirá que o comando <code>node ace migration:rollback</code> resulte em um erro.</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  pg</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    client</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;pg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    migrations</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      disableRollbacksInProduction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="migracoes-simultaneas" tabindex="-1">Migrações simultâneas <a class="header-anchor" href="#migracoes-simultaneas" aria-label="Permalink to &quot;Migrações simultâneas&quot;">​</a></h3><p>Se você estiver executando migrações em um servidor com várias instâncias, você deve garantir que apenas uma instância execute as migrações.</p><p>Para MySQL e PostgreSQL, o Lucid obterá bloqueios consultivos para garantir que a migração simultânea não seja permitida. No entanto, é melhor evitar executar migrações de vários servidores em primeiro lugar.</p><h2 id="armazenamento-persistente-para-uploads-de-arquivos" tabindex="-1">Armazenamento persistente para uploads de arquivos <a class="header-anchor" href="#armazenamento-persistente-para-uploads-de-arquivos" aria-label="Permalink to &quot;Armazenamento persistente para uploads de arquivos&quot;">​</a></h2><p>Ambientes como Amazon EKS, Google Kubernetes, Heroku, DigitalOcean Apps e assim por diante, executam o código do seu aplicativo dentro de <a href="https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem" target="_blank" rel="noreferrer">um sistema de arquivos efêmero</a>, o que significa que cada implantação, por padrão, destruirá o sistema de arquivos existente e criará um novo.</p><p>Se o seu aplicativo permitir que os usuários carreguem arquivos, você deve usar um serviço de armazenamento persistente como Amazon S3, Google Cloud Storage ou DigitalOcean Spaces em vez de depender do sistema de arquivos local.</p><h2 id="escrevendo-logs" tabindex="-1">Escrevendo logs <a class="header-anchor" href="#escrevendo-logs" aria-label="Permalink to &quot;Escrevendo logs&quot;">​</a></h2><p>O AdonisJS usa o <a href="./../digging_deeper/logger.html"><code>pino</code> logger</a> por padrão, que grava logs no console no formato JSON. Você pode configurar um serviço de log externo para ler os logs de stdout/stderr ou encaminhá-los para um arquivo local no mesmo servidor.</p><h2 id="servindo-ativos-estaticos" tabindex="-1">Servindo ativos estáticos <a class="header-anchor" href="#servindo-ativos-estaticos" aria-label="Permalink to &quot;Servindo ativos estáticos&quot;">​</a></h2><p>Servir ativos estáticos de forma eficaz é essencial para o desempenho do seu aplicativo. Independentemente da rapidez dos seus aplicativos AdonisJS, a entrega de ativos estáticos desempenha um papel importante para uma melhor experiência do usuário.</p><h3 id="usando-um-cdn" tabindex="-1">Usando um CDN <a class="header-anchor" href="#usando-um-cdn" aria-label="Permalink to &quot;Usando um CDN&quot;">​</a></h3><p>A melhor abordagem é usar um CDN (Content Delivery Network) para entregar os ativos estáticos do seu aplicativo AdonisJS.</p><p>Os ativos de frontend compilados usando <a href="./../basics/vite.html">Vite</a> são marcados por impressão digital por padrão, o que significa que os nomes dos arquivos são hash com base em seu conteúdo. Isso permite que você armazene os ativos em cache para sempre e os sirva de um CDN.</p><p>Dependendo do serviço CDN que você está usando e da sua técnica de implantação, pode ser necessário adicionar uma etapa ao seu processo de implantação para mover os arquivos estáticos para o servidor CDN. É assim que deve funcionar em poucas palavras.</p><ol><li><p>Atualize a configuração <code>vite.config.js</code> e <code>config/vite.ts</code> para <a href="./../basics/vite.html#deploying-assets-to-a-cdn">usar a URL do CDN</a>.</p></li><li><p>Execute o comando <code>build</code> para compilar o aplicativo e os ativos.</p></li><li><p>Copie a saída de <code>public/assets</code> para o seu servidor CDN. Por exemplo, <a href="https://github.com/adonisjs-community/polls-app/blob/main/commands/PublishAssets.ts" target="_blank" rel="noreferrer">aqui está um comando</a> que usamos para publicar os ativos em um bucket do Amazon S3.</p></li></ol><h3 id="usando-o-nginx-para-entregar-ativos-estaticos" tabindex="-1">Usando o Nginx para entregar ativos estáticos <a class="header-anchor" href="#usando-o-nginx-para-entregar-ativos-estaticos" aria-label="Permalink to &quot;Usando o Nginx para entregar ativos estáticos&quot;">​</a></h3><p>Outra opção é descarregar a tarefa de servir ativos para o Nginx. Se você usar o Vite para compilar os ativos front-end, você deve armazenar em cache agressivamente todos os arquivos estáticos, pois eles são marcados com fingerprint.</p><p>Adicione o seguinte bloco ao seu arquivo de configuração do Nginx. <strong>Certifique-se de substituir os valores dentro dos colchetes angulares <code>&lt;&gt;</code></strong>.</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>location ~ \\.(jpg|png|css|js|gif|ico|woff|woff2) {</span></span>
<span class="line"><span>  root &lt;PATH_TO_ADONISJS_APP_PUBLIC_DIRECTORY&gt;;</span></span>
<span class="line"><span>  sendfile on;</span></span>
<span class="line"><span>  sendfile_max_chunk 2m;</span></span>
<span class="line"><span>  add_header Cache-Control &quot;public&quot;;</span></span>
<span class="line"><span>  expires 365d;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="usando-o-servidor-de-arquivo-estatico-adonisjs" tabindex="-1">Usando o servidor de arquivo estático AdonisJS <a class="header-anchor" href="#usando-o-servidor-de-arquivo-estatico-adonisjs" aria-label="Permalink to &quot;Usando o servidor de arquivo estático AdonisJS&quot;">​</a></h3><p>Você também pode contar com o <a href="./../basics/static_file_server.html">servidor de arquivo estático embutido do AdonisJS</a> para servir os ativos estáticos do diretório <code>public</code> para manter as coisas simples.</p><p>Nenhuma configuração adicional é necessária. Basta implantar seu aplicativo AdonisJS como de costume, e a solicitação de ativos estáticos será atendida automaticamente.</p><div class="danger custom-block"><p class="custom-block-title">ATENÇÃO</p><p>O servidor de arquivo estático não é recomendado para uso em produção. É melhor usar um CDN ou Nginx para servir ativos estáticos.</p></div>`,66)]))}const u=a(r,[["render",p]]);export{k as __pageData,u as default};
