import{_ as s,c as i,a2 as e,o}from"./chunks/framework.YPpNXepj.js";const u=JSON.parse('{"title":"Instalação","description":"","frontmatter":{},"headers":[],"relativePath":"docs/03-getting-started/01-installation.md","filePath":"docs/03-getting-started/01-installation.md"}'),t={name:"docs/03-getting-started/01-installation.md"};function n(d,a,l,p,r,c){return o(),i("div",null,a[0]||(a[0]=[e(`<h1 id="instalacao" tabindex="-1">Instalação <a class="header-anchor" href="#instalacao" aria-label="Permalink to &quot;Instalação&quot;">​</a></h1><p>A instalação do AdonisJs é um processo simples e levará apenas alguns minutos.</p><h2 id="requisitos-do-sistema" tabindex="-1">Requisitos do sistema <a class="header-anchor" href="#requisitos-do-sistema" aria-label="Permalink to &quot;Requisitos do sistema&quot;">​</a></h2><p>As únicas dependências do framework são <code>Node.js</code> e <code>npm</code>.</p><p>Certifique-se de que suas versões dessas ferramentas correspondem aos seguintes critérios:</p><ul><li>Node.js &gt;= 8.0.0</li><li>npm &gt;= 3.0.0</li><li>git</li></ul><div class="tip custom-block"><p class="custom-block-title">DICA</p><p>Você pode usar ferramentas como <a href="https://github.com/creationix/nvm" target="_blank" rel="noreferrer">nvm</a> para ajudar a gerenciar várias versões do Node.js e npm ao mesmo tempo.</p></div><h2 id="instalando-o-adonisjs" tabindex="-1">Instalando o AdonisJs <a class="header-anchor" href="#instalando-o-adonisjs" aria-label="Permalink to &quot;Instalando o AdonisJs&quot;">​</a></h2><h3 id="via-adonisjs-cli" tabindex="-1">Via AdonisJs CLI <a class="header-anchor" href="#via-adonisjs-cli" aria-label="Permalink to &quot;Via AdonisJs CLI&quot;">​</a></h3><p>AdonisJs CLI é uma ferramenta de linha de comando para ajudar você a instalar o AdonisJs.</p><p>Instale-o globalmente via <code>npm</code> assim:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @adonisjs/cli</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">DICA</p><p>Você também pode usar <code>npx</code> para evitar instalar a CLI globalmente.</p></div><p>Certifique-se de adicionar o diretório <code>node_modules/.bin</code> de todo o sistema <code>npm</code> ao seu <code>$PATH</code> para poder acessar o binário instalado.</p><p>Depois de instalado, você pode usar o comando <code>adonis new</code> para criar novas instalações do AdonisJs.</p><p>Por exemplo, para criar um novo aplicativo chamado <code>yardstick</code>, simplesmente:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">adonis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> new</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yardstick</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">NOTA</p><p>Por padrão, o <a href="https://github.com/adonisjs/adonis-fullstack-app" target="_blank" rel="noreferrer">fullstack blueprint</a> é clonado do Github. Você pode personalizar isso usando as opções <code>--api-only</code> ou <code>--slim</code>.</p><p>Você também pode especificar seu próprio blueprint usando a opção <code>--blueprint=&lt;github-org/repo&gt;</code>.</p></div><h3 id="via-git" tabindex="-1">Via Git <a class="header-anchor" href="#via-git" aria-label="Permalink to &quot;Via Git&quot;">​</a></h3><p>Alternativamente, você pode usar <code>git</code> diretamente para buscar nossos boilerplates:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Fullstack</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> git clone --dissociate https://github.com/adonisjs/adonis-fullstack-app</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># API</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> git clone --dissociate https://github.com/adonisjs/adonis-api-app</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Slim</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> git clone --dissociate https://github.com/adonisjs/adonis-slim-app</span></span></code></pre></div><p>Após clonar um boilerplate, instale todas as dependências executando <code>npm install</code>.</p><h2 id="servindo-o-aplicativo" tabindex="-1">Servindo o aplicativo <a class="header-anchor" href="#servindo-o-aplicativo" aria-label="Permalink to &quot;Servindo o aplicativo&quot;">​</a></h2><p>Depois que o processo de instalação for concluído, você pode <code>cd</code> no seu novo diretório de aplicativo e executar o seguinte comando para iniciar o servidor HTTP:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">adonis</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> serve</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --dev</span></span></code></pre></div><p>Este comando inicia o servidor na porta definida dentro do arquivo raiz <code>.env</code>.</p>`,26)]))}const k=s(t,[["render",n]]);export{u as __pageData,k as default};
