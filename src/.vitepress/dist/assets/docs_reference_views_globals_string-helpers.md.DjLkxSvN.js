import{_ as a,c as i,a2 as e,o as n}from"./chunks/framework.BLTIpkzl.js";const c=JSON.parse('{"title":"String helpers","description":"","frontmatter":{},"headers":[],"relativePath":"docs/reference/views/globals/string-helpers.md","filePath":"docs/reference/views/globals/string-helpers.md"}'),l={name:"docs/reference/views/globals/string-helpers.md"};function t(p,s,r,h,d,k){return n(),i("div",null,s[0]||(s[0]=[e(`<h1 id="string-helpers" tabindex="-1">String helpers <a class="header-anchor" href="#string-helpers" aria-label="Permalink to &quot;String helpers&quot;">​</a></h1><p>A seguir está a lista de auxiliares de string disponíveis que você pode usar em seus modelos do Edge. O núcleo do framework e os pacotes oficiais do AdonisJS já estão usando esses auxiliares, só que também os injetamos como auxiliares de visualização.</p><h3 id="camelcase" tabindex="-1"><code>camelCase</code> <a class="header-anchor" href="#camelcase" aria-label="Permalink to &quot;\`camelCase\`&quot;">​</a></h3><p>Converte uma string para sua versão <code>camelCase</code>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">camelCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello-world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: helloWorld --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="snakecase" tabindex="-1"><code>snakeCase</code> <a class="header-anchor" href="#snakecase" aria-label="Permalink to &quot;\`snakeCase\`&quot;">​</a></h3><p>Converte uma string para sua versão <code>snake_case</code>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">snakeCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;helloWorld&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: hello_world --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="dashcase" tabindex="-1"><code>dashCase</code> <a class="header-anchor" href="#dashcase" aria-label="Permalink to &quot;\`dashCase\`&quot;">​</a></h3><p>Converte uma string para sua versão <code>dash-case</code>. Opcionalmente, você também pode colocar a primeira letra de cada segmento em maiúscula.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ string.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dashCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;helloWorld&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- hello-world --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  string.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dashCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;helloWorld&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { capitalize: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Hello-World --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="pascalcase" tabindex="-1"><code>pascalCase</code> <a class="header-anchor" href="#pascalcase" aria-label="Permalink to &quot;\`pascalCase\`&quot;">​</a></h3><p>Converte uma string para sua versão <code>PascalCase</code>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pascalCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;helloWorld&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: HelloWorld --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="capitalcase" tabindex="-1"><code>capitalCase</code> <a class="header-anchor" href="#capitalcase" aria-label="Permalink to &quot;\`capitalCase\`&quot;">​</a></h3><p>Coloca um valor de string em maiúsculas.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">capitalCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;helloWorld&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: Hello World --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="sentencecase" tabindex="-1"><code>sentenceCase</code> <a class="header-anchor" href="#sentencecase" aria-label="Permalink to &quot;\`sentenceCase\`&quot;">​</a></h3><p>Converte string para maiúsculas e minúsculas.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sentenceCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello-world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: Hello world --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="dotcase" tabindex="-1"><code>dotCase</code> <a class="header-anchor" href="#dotcase" aria-label="Permalink to &quot;\`dotCase\`&quot;">​</a></h3><p>Converte string para sua versão <code>dot.case</code>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dotCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello-world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: hello.world --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="nocase" tabindex="-1"><code>noCase</code> <a class="header-anchor" href="#nocase" aria-label="Permalink to &quot;\`noCase\`&quot;">​</a></h3><p>Remove todos os tipos de maiúsculas e minúsculas de uma string.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">noCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello-world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- hello world --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">noCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello_world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- hello world --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">noCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;helloWorld&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- hello world --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="titlecase" tabindex="-1"><code>titleCase</code> <a class="header-anchor" href="#titlecase" aria-label="Permalink to &quot;\`titleCase\`&quot;">​</a></h3><p>Converte uma frase para maiúsculas e minúsculas.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">titleCase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Here is a fox&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- Output: Here Is a fox --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="pluralize" tabindex="-1"><code>pluralize</code> <a class="header-anchor" href="#pluralize" aria-label="Permalink to &quot;\`pluralize\`&quot;">​</a></h3><p>Pluraliza uma palavra.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pluralize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;box&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- boxes --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pluralize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;i&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- we --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="tosentence" tabindex="-1"><code>toSentence</code> <a class="header-anchor" href="#tosentence" aria-label="Permalink to &quot;\`toSentence\`&quot;">​</a></h3><p>Junte uma matriz de palavras com um separador para formar uma frase.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  toSentence</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;route&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;middleware&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;controller&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- route, middleware, and controller --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>Você também pode definir as seguintes opções para personalizar os separadores.</p><ul><li><code>separator</code>: O valor entre duas palavras, exceto a última.</li><li><code>pairSeparator</code>: O valor entre a primeira e a última palavra. Usado somente quando há duas palavras.</li><li><code>lastSeparator</code>: O valor entre a segunda última e a última palavra. Usado somente quando há mais de duas palavras.</li></ul><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  toSentence</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;route&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;middleware&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;controller&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ], {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    separator: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/ &#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lastSeparator: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/or &#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- route/ middleware/or controller --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="prettybytes" tabindex="-1"><code>prettyBytes</code> <a class="header-anchor" href="#prettybytes" aria-label="Permalink to &quot;\`prettyBytes\`&quot;">​</a></h3><p>Converte o valor de bytes em uma string legível por humanos. Aceita e encaminha todas as opções para o pacote <a href="https://www.npmjs.com/package/bytes" target="_blank" rel="noreferrer">bytes</a>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">prettyBytes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1024</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 1KB --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  prettyBytes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1024</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { unitSeparator: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39; &#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 1 KB --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h3 id="tobytes" tabindex="-1"><code>toBytes</code> <a class="header-anchor" href="#tobytes" aria-label="Permalink to &quot;\`toBytes\`&quot;">​</a></h3><p>Converte uma string legível para humanos em bytes. Este método é o oposto do método <code>prettyBytes</code>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toBytes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;1KB&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 1024 --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="prettyms" tabindex="-1"><code>prettyMs</code> <a class="header-anchor" href="#prettyms" aria-label="Permalink to &quot;\`prettyMs\`&quot;">​</a></h3><p>Converte o tempo representado em milissegundos para uma string legível para humanos.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">prettyMs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 1min --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">prettyMs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { long: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 1 minute --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="toms" tabindex="-1"><code>toMs</code> <a class="header-anchor" href="#toms" aria-label="Permalink to &quot;\`toMs\`&quot;">​</a></h3><p>Converte uma string legível para humanos em milissegundos. Este método é o oposto do método <code>prettyMs</code>.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toMs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;1min&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 60000 --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="ordinalize" tabindex="-1"><code>ordinalize</code> <a class="header-anchor" href="#ordinalize" aria-label="Permalink to &quot;\`ordinalize\`&quot;">​</a></h3><p>Ordinalize uma string ou um valor numérico.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ordinalize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 1st --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ordinalize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">99</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) }} </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 99th --&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="nl2br" tabindex="-1"><code>nl2br</code> <a class="header-anchor" href="#nl2br" aria-label="Permalink to &quot;\`nl2br\`&quot;">​</a></h3><p>Converte os caracteres de nova linha com uma tag <code>&lt;br&gt;</code>.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nl2br</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post.content) }}}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Ao usar o auxiliar <code>nl2br</code>, você terá que usar três chaves para renderizar a tag <code>&lt;br&gt;</code> como HTML em vez de escapá-la.</p><p>No entanto, isso também renderizará as tags HTML da variável <code>post.content</code>. Para superar essa situação, recomendamos que você escape separadamente a entrada do usuário antes de passá-la para o método <code>nl2br</code>.</p><p>:::note A seguir está a maneira correta de usar o método <code>nl2br</code>. Isso garante que a entrada do usuário seja sempre escapada. :::</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nl2br</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post.content)) }}}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="e" tabindex="-1"><code>e</code> <a class="header-anchor" href="#e" aria-label="Permalink to &quot;\`e\`&quot;">​</a></h3><p>Escape HTML dentro de um valor de string. As chaves duplas já escapam o valor, então use este método somente quando não estiver usando as chaves duplas.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post.content) }}}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,63)]))}const E=a(l,[["render",t]]);export{c as __pageData,E as default};
