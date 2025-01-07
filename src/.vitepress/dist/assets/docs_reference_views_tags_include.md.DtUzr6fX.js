import{_ as i,c as a,a2 as s,o as n}from"./chunks/framework.BLTIpkzl.js";const u=JSON.parse('{"title":"include/includeIf","description":"","frontmatter":{},"headers":[],"relativePath":"docs/reference/views/tags/include.md","filePath":"docs/reference/views/tags/include.md"}'),l={name:"docs/reference/views/tags/include.md"};function t(d,e,r,p,c,o){return n(),a("div",null,e[0]||(e[0]=[s('<h1 id="include-includeif" tabindex="-1">include/includeIf <a class="header-anchor" href="#include-includeif" aria-label="Permalink to &quot;include/includeIf&quot;">​</a></h1><p>A tag <code>@include</code> permite que você inclua um parcial em um determinado modelo.</p><ul><li>É uma tag inline.</li><li>Ela aceita apenas um único argumento, que é o caminho parcial relativo do diretório de visualizações.</li><li>O parcial tem acesso ao estado do modelo pai.</li></ul><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@include</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;partials/header&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Você também pode usar variáveis ​​para definir o caminho parcial.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@include</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(headerPartial)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Você também pode usar a tag <code>@includeIf</code> para incluir um parcial condicionalmente. O primeiro argumento é a condição a ser avaliada antes de incluir o parcial.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@includeIf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(post.comments.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;partials/comments&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>',8)]))}const m=i(l,[["render",t]]);export{u as __pageData,m as default};
