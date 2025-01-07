import{_ as a,c as i,a2 as n,o as e}from"./chunks/framework.BLTIpkzl.js";const c=JSON.parse('{"title":"Fábricas de Modelos","description":"","frontmatter":{},"headers":[],"relativePath":"docs/reference/orm/relations/model-factories.md","filePath":"docs/reference/orm/relations/model-factories.md"}'),l={name:"docs/reference/orm/relations/model-factories.md"};function r(p,s,t,o,h,d){return e(),i("div",null,s[0]||(s[0]=[n(`<h1 id="fabricas-de-modelos" tabindex="-1">Fábricas de Modelos <a class="header-anchor" href="#fabricas-de-modelos" aria-label="Permalink to &quot;Fábricas de Modelos&quot;">​</a></h1><p>Você pode definir uma fábrica de modelos para um determinado modelo usando o método <code>Factory.define</code>. O método aceita a referência do modelo como o primeiro argumento e um retorno de chamada para configurar os valores padrão como o segundo argumento.</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Factory </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@ioc:Adonis/Lucid/Factory&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> User </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;App/Models/User&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Factory</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">define</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(User, ({ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">faker</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      fullName: faker.name.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">findName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      email: faker.internet.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">email</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onMerge</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>O método <code>define</code> retorna uma instância do <a href="https://github.com/adonisjs/lucid/blob/develop/src/Factory/FactoryModel.ts" target="_blank" rel="noreferrer">FactoryModel</a></p>`,4)]))}const E=a(l,[["render",r]]);export{c as __pageData,E as default};
