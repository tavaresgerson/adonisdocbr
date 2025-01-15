import{_ as a,c as i,a2 as n,o as e}from"./chunks/framework.Dz7_3PEu.js";const c=JSON.parse('{"title":"Criptografia","description":"","frontmatter":{"summary":"Criptografe e descriptografe valores em seu aplicativo usando o serviço de criptografia."},"headers":[],"relativePath":"docs/security/encryption.md","filePath":"docs/security/encryption.md"}'),p={name:"docs/security/encryption.md"};function r(l,s,t,h,o,d){return e(),i("div",null,s[0]||(s[0]=[n(`<h1 id="criptografia" tabindex="-1">Criptografia <a class="header-anchor" href="#criptografia" aria-label="Permalink to &quot;Criptografia&quot;">​</a></h1><p>Usando o serviço de criptografia, você pode criptografar e descriptografar valores em seu aplicativo. A criptografia é baseada no <a href="https://www.n-able.com/blog/aes-256-encryption-algorithm" target="_blank" rel="noreferrer">algoritmo aes-256-cbc</a>, e anexamos um hash de integridade (HMAC) à saída final para evitar adulteração de valor.</p><p>O serviço de <code>criptografia</code> usa a <code>appKey</code> armazenada dentro do arquivo <code>config/app.ts</code> como o segredo para criptografar os valores.</p><ul><li><p><a href="./../getting_started/environment_variables.html">Variáveis ​​de ambiente</a>. Qualquer pessoa com acesso a essa chave pode descriptografar valores.</p></li><li><p>A chave deve ter pelo menos 16 caracteres e ter um valor aleatório criptograficamente seguro. Você pode gerar a chave usando o comando <code>node ace generate:key</code>.</p></li><li><p>Se você decidir alterar a chave mais tarde, não poderá descriptografar os valores existentes. Isso resultará na invalidação de cookies e sessões de usuário existentes.</p></li></ul><h2 id="criptografando-valores" tabindex="-1">Criptografando valores <a class="header-anchor" href="#criptografando-valores" aria-label="Permalink to &quot;Criptografando valores&quot;">​</a></h2><p>Você pode criptografar valores usando o método <code>encryption.encrypt</code>. O método aceita o valor a ser criptografado e uma duração de tempo opcional após a qual considerar o valor expirado.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> encryption </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/services/encryption&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> encrypted</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>Defina uma duração de tempo após a qual o valor será considerado expirado e não poderá ser descriptografado.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> encrypted</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;hello world&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;2 hours&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="descriptografando-valores" tabindex="-1">Descriptografando valores <a class="header-anchor" href="#descriptografando-valores" aria-label="Permalink to &quot;Descriptografando valores&quot;">​</a></h2><p>Valores criptografados podem ser descriptografados usando o método <code>encryption.decrypt</code>. O método aceita o valor criptografado como o primeiro argumento.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> encryption </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/services/encryption&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">decrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(encryptedValue)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="tipos-de-dados-suportados" tabindex="-1">Tipos de dados suportados <a class="header-anchor" href="#tipos-de-dados-suportados" aria-label="Permalink to &quot;Tipos de dados suportados&quot;">​</a></h2><p>O valor dado ao método <code>encrypt</code> é serializado para uma string usando <code>JSON.stringify</code>. Portanto, você pode usar os seguintes tipos de dados JavaScript.</p><ul><li>string</li><li>number</li><li>bigInt</li><li>boolean</li><li>null</li><li>object</li><li>array</li></ul><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> encryption </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/services/encryption&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Object</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  id: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  fullName: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;virk&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Array</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Boolean</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Number</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// BigInt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BigInt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Objetos Date são convertidos em string ISO</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">encryption.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">encrypt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h2 id="usando-chaves-secretas-personalizadas" tabindex="-1">Usando chaves secretas personalizadas <a class="header-anchor" href="#usando-chaves-secretas-personalizadas" aria-label="Permalink to &quot;Usando chaves secretas personalizadas&quot;">​</a></h2><p>Você pode criar uma <a href="https://github.com/adonisjs/encryption/blob/main/src/encryption.ts" target="_blank" rel="noreferrer">instância da classe Encryption</a> diretamente para usar chaves secretas personalizadas.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Encryption } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@adonisjs/core/encryption&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> encryption</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Encryption</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  secret: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;alongrandomsecretkey&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,19)]))}const E=a(p,[["render",r]]);export{c as __pageData,E as default};
