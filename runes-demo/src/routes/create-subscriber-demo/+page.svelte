<script lang="ts">
	let showCode = $state(false);
</script>

<div class="demo-container">
	<header class="header">
		<h1>Введение в <code>createSubscriber</code></h1>
		<p class="subtitle">Изящное управление ленивыми подписками в Svelte 5</p>
	</header>

	<section class="content">
		<div class="card">
			<h2>Проблема старого подхода</h2>
			<p>
				Часто нам нужно слушать внешние события (например, из <code>window</code> или <code>localStorage</code>)
				и обновлять реактивное состояние. Но если мы просто подпишемся в конструкторе класса, подписка
				будет висеть в памяти всегда, даже когда данные никому не нужны.
			</p>
			
			<p>
				Мы можем разрулить это следующим образом
			</p>

			<div class="code-block bad-practice">
				<div class="code-header">
					<span class="badge red">Старый подход</span>
					<span class="file">Store.ts</span>
				</div>
				<pre><code class="language-typescript">let subscribers = 0;

get value() &#123;
  if ($effect.tracking()) &#123;
    $effect(() =&gt; &#123;
      if (subscribers === 0) &#123;
         // Устанавливаем подписку при первом слушателе
         target.addEventListener('event', handler);
      &#125;
      subscribers++;

      return () =&gt; &#123;
        subscribers--;
        if (subscribers === 0) &#123;
          // Удаляем подписку, когда слушателей не осталось
          target.removeEventListener('event', handler);
        &#125;
      &#125;
    &#125;);
  &#125;
  return value;
&#125;</code></pre>
			</div>
			
			<div class="issue-list">
				<strong>Минусы этого подхода:</strong>
				<ul>
					<li>Много шаблонного кода (счетчики, ручное добавление/удаление).</li>
					<li>Легко ошибиться.</li>
				</ul>
			</div>
		</div>

		<div class="card">
			<h2>Решение: <code>createSubscriber</code></h2>
			<p>
				В Svelte 5.9.0 появилась функция <code>createSubscriber</code> из модуля <code>svelte/reactivity</code>. 
				Она инкапсулирует в себе всю эту логику и делает код декларативным.
			</p>

			<div class="code-block good-practice">
				<div class="code-header">
					<span class="badge green">Новый подход</span>
					<span class="file">Store.ts</span>
				</div>
				<pre><code class="language-typescript">import &#123; createSubscriber &#125; from 'svelte/reactivity';
import &#123; on &#125; from 'svelte/events';

const subscribe = createSubscriber((update) =&gt; &#123;
  // Этот код сработает ТОЛЬКО при появлении ПЕРВОГО подписчика
  const off = on(target, 'event', () =&gt; &#123;
    // ... обновляем стейт ...
    update(); // Сообщаем Svelte о том, что нужно перерендерить зависимые компоненты
  &#125;);

  // Возвращаем функцию очистки, которая сработает, когда исчезнет ПОСЛЕДНИЙ подписчик
  return () =&gt; off();
&#125;);

get value() &#123;
  subscribe(); // Просто вызываем созданную функцию
  return value;
&#125;</code></pre>
			</div>

			<p>
				<strong>Как это работает:</strong>
			</p>
			<ol class="steps-list">
				<li><code>createSubscriber</code> возвращает функцию (<code>subscribe</code>).</li>
				<li>Когда мы вызываем <code>subscribe()</code> в геттере, Svelte регистрирует, что текущий эффект (например, рендер шаблона) зависит от этого стора.</li>
				<li>Если это первый подписчик, синхронно выполняется переданный коллбэк, где мы устанавливаем слушатели событий.</li>
				<li>Коллбэк получает функцию <code>update()</code>, которую мы вызываем каждый раз, когда данные меняются снаружи (чтобы обновить UI).</li>
				<li>Когда все компоненты, использующие этот стор, размонтируются, Svelte автоматически вызовет функцию очистки (возвращаемую из коллбэка).</li>
			</ol>
		</div>
	</section>
</div>

<style>
	.demo-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
		color: #333;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		color: #212529;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.2rem;
		color: #6c757d;
		margin: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.card {
		background: #fff;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);
		border: 1px solid #e9ecef;
	}

	h2 {
		margin-top: 0;
		color: #0d6efd;
		font-size: 1.5rem;
		border-bottom: 2px solid #e9ecef;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
	}

	p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		background: rgba(0,0,0,0.05);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.code-block {
		background: #282c34;
		border-radius: 8px;
		overflow: hidden;
		margin: 1.5rem 0;
	}

	.code-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #21252b;
		border-bottom: 1px solid #181a1f;
	}

	.badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.badge.red {
		background: #dc3545;
		color: white;
	}

	.badge.green {
		background: #198754;
		color: white;
	}

	.file {
		color: #abb2bf;
		font-size: 0.85rem;
		font-family: monospace;
	}

	pre {
		margin: 0;
		padding: 1.5rem;
		overflow-x: auto;
	}

	pre code {
		background: none;
		padding: 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.bad-practice {
		border-left: 4px solid #dc3545;
	}

	.good-practice {
		border-left: 4px solid #198754;
	}

	.issue-list {
		margin-top: 1.5rem;
	}

	ul, ol {
		padding-left: 1.5rem;
		line-height: 1.6;
	}

	li {
		margin-bottom: 0.5rem;
	}

	.steps-list {
		background: #f8f9fa;
		padding: 1.5rem 1.5rem 1.5rem 2.5rem;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}
</style>