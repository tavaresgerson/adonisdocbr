import{_ as a,c as i,a2 as n,o as e}from"./chunks/framework.BLTIpkzl.js";const E=JSON.parse('{"title":"URLs assinadas","description":"","frontmatter":{},"headers":[],"relativePath":"docs/guides/security/signed-urls.md","filePath":"docs/guides/security/signed-urls.md"}'),l={name:"docs/guides/security/signed-urls.md"};function p(t,s,r,h,d,k){return e(),i("div",null,s[0]||(s[0]=[n(`<h1 id="urls-assinadas" tabindex="-1">URLs assinadas <a class="header-anchor" href="#urls-assinadas" aria-label="Permalink to &quot;URLs assinadas&quot;">​</a></h1><p>URLs assinadas fornecem uma maneira bacana de gerar URLs com uma assinatura hash anexada a elas. O hash garante que a URL gerada não seja modificada ou adulterada.</p><div class="info custom-block"><p class="custom-block-title">NOTA</p><p>A função <code>makeSignedUrl</code> aceita o mesmo conjunto de argumentos aceitos pelo método <a href="./../http/routing.html#url-generation">Route.makeUrl</a>. Portanto, certifique-se de ler a documentação para <code>Route.makeUrl</code> também.</p></div><p>Por exemplo:</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">makeSignedUrl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;verifyEmail&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  email: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;foo@bar.com&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// /verify/foo@bar.com?signature=eyJtZXNzYWdlIjoiL3ZlcmlmeS9mb29AYmFyLmNvbSJ9.Xu-a0xu_E4O0sJxeAhyhUU5TVMPtxHGNz4bY9skxqRo</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>A assinatura anexada à URL é gerada a partir da sequência de caracteres URI completa. Alterar qualquer parte da URL resultará em uma assinatura inválida.</p><h2 id="verificando-assinatura" tabindex="-1">Verificando assinatura <a class="header-anchor" href="#verificando-assinatura" aria-label="Permalink to &quot;Verificando assinatura&quot;">​</a></h2><p>A rota para a qual você gerou a URL assinada pode verificar a assinatura usando o método <code>request.hasValidSignature()</code>.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/verify/:email&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">request</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (request.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hasValidSignature</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Marking email as verified&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Signature is missing or URL was tampered.&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;verifyEmail&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="urls-assinadas-expirando" tabindex="-1">URLs assinadas expirando <a class="header-anchor" href="#urls-assinadas-expirando" aria-label="Permalink to &quot;URLs assinadas expirando&quot;">​</a></h2><p>Por padrão, as URLs assinadas vivem para sempre. No entanto, você pode adicionar expiração a elas no momento da geração de uma.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">makeSignedUrl</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;verifyEmail&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    email: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;foo@bar.com&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    expiresIn: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;30m&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="usando-o-construtor-de-url" tabindex="-1">Usando o construtor de URL <a class="header-anchor" href="#usando-o-construtor-de-url" aria-label="Permalink to &quot;Usando o construtor de URL&quot;">​</a></h2><p>Você também pode usar o construtor de URL para gerar URLs assinadas.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Route.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">builder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">params</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ email: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;foo@bar.com&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">makeSigned</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;verifyEmail&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { expiresIn: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;30m&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>`,15)]))}const c=a(l,[["render",p]]);export{E as __pageData,c as default};
