import{_ as i,c as a,a2 as e,o as n}from"./chunks/framework.BLTIpkzl.js";const c=JSON.parse('{"title":"stringify","description":"","frontmatter":{},"headers":[],"relativePath":"docs/reference/views/globals/stringify.md","filePath":"docs/reference/views/globals/stringify.md"}'),t={name:"docs/reference/views/globals/stringify.md"};function r(l,s,p,o,h,d){return n(),a("div",null,s[0]||(s[0]=[e(`<h1 id="stringify" tabindex="-1"><code>stringify</code> <a class="header-anchor" href="#stringify" aria-label="Permalink to &quot;\`stringify\`&quot;">​</a></h1><p>O método <code>stringify</code> é muito semelhante ao <code>JSON.stringify</code>, mas escapou certos caracteres HTML para evitar ataques XSS ao passar dados do backend para o script frontend.</p><p>Considere o exemplo a seguir.</p><div class="language-edge vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">edge</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">@set</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;userInput&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&lt;/script&gt;&lt;script&gt;alert(&#39;bad actor&#39;)&lt;/script&gt;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({{{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">JSON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userInput) }}})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({{{ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userInput) }}})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>O uso de <code>JSON.stringify</code> executará o código como HTML, enquanto o método <code>stringify</code> não. Portanto, é recomendável converter suas estruturas de dados de backend em uma string JSON usando o auxiliar <code>stringify</code>.</p>`,5)]))}const g=i(t,[["render",r]]);export{c as __pageData,g as default};
