import{_ as a,c as e,a2 as i,o as n}from"./chunks/framework.BLTIpkzl.js";const c=JSON.parse('{"title":"range","description":"","frontmatter":{},"headers":[],"relativePath":"docs/reference/validator/rules/range.md","filePath":"docs/reference/validator/rules/range.md"}'),l={name:"docs/reference/validator/rules/range.md"};function p(r,s,t,d,h,o){return n(),e("div",null,s[0]||(s[0]=[i(`<h1 id="range" tabindex="-1">range <a class="header-anchor" href="#range" aria-label="Permalink to &quot;range&quot;">​</a></h1><p>Valida o valor para estar dentro de um intervalo fornecido. A regra só pode ser usada com o tipo de esquema <code>number</code>.</p><p>No exemplo a seguir, o valor de <code>age &lt; 18</code> e <code>&gt; 40</code> falhará na validação.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { schema, rules } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@ioc:Adonis/Core/Validator&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  age</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: schema.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    rules.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">range</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">18</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">40</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="opcoes-de-mensagens-personalizadas" tabindex="-1">Opções de mensagens personalizadas <a class="header-anchor" href="#opcoes-de-mensagens-personalizadas" aria-label="Permalink to &quot;Opções de mensagens personalizadas&quot;">​</a></h2><p>A regra de validação <code>range</code> passa as opções <code>start</code> e <code>stop</code> para mensagens personalizadas.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;age.range&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Candidate age must be between {{ options.start }} and {{ options.stop }} years&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>`,7)]))}const g=a(l,[["render",p]]);export{c as __pageData,g as default};
