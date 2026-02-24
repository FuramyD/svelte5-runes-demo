<script lang="ts">
	import MediaQueryDemo from '../../components/MediaQueryDemo.svelte';
</script>

<div class="demo-container">
	<header class="header">
		<h1>Паттерны подписок: MediaQuery</h1>
		<p class="subtitle">Сравнение подходов к созданию реактивных оберток над API браузера</p>
	</header>

	<section class="playground">
		<h2>Playground (Попробуй сам)</h2>
		<p class="desc">Изменяй размер окна или переключай системную тему, чтобы увидеть, как оба стора реагируют на изменения.</p>
		
		<div class="demos-grid">
			<MediaQueryDemo 
				title="Адаптивность (Ширина)" 
				description="Реагирует на изменение ширины окна браузера." 
				query="(max-width: 768px)" 
			/>
			<MediaQueryDemo 
				title="Системная тема" 
				description="Реагирует на переключение светлой/темной темы в ОС." 
				query="(prefers-color-scheme: dark)" 
			/>
		</div>
	</section>

	<section class="content">
		<div class="card">
			<h2>Плохой подход (без createSubscriber)</h2>
			<p>
				Самый простой способ сделать реактивный медиа-запрос — использовать обычный класс со <code>$state</code> 
				и подписаться на событие прямо в конструкторе.
			</p>

			<div class="code-block bad-practice">
				<div class="code-header">
					<span class="badge red">Простой вариант</span>
					<span class="file">MediaQuery.svelte.ts</span>
				</div>
				<pre><code class="language-typescript">class MediaQuery &#123;
  #query;
  current = $state(false);

  constructor(query) &#123;
    this.#query = window.matchMedia(query);
    this.current = this.#getMatches();

    // Подписываемся на изменения навсегда
    this.#query.addEventListener('change', () =&gt; &#123;
      this.current = this.#getMatches();
    &#125;);
  &#125;

  #getMatches() &#123;
    return this.#query.matches;
  &#125;
&#125;</code></pre>
			</div>
			
			<div class="issue-list">
				<strong>Минусы этого подхода (почему так делать нельзя):</strong>
				<ul>
					<li><strong>Утечка памяти (Memory Leak):</strong> Подписка через <code>addEventListener</code> создается в конструкторе один раз и никогда не удаляется (нет вызова <code>removeEventListener</code>).</li>
					<li><strong>Сборщик мусора (Garbage Collection):</strong> Пока висит слушатель события на объекте <code>MediaQueryList</code> (полученном из <code>window.matchMedia</code>), экземпляр нашего класса <code>MediaQuery</code> не будет удален из памяти, даже если компонент, который его создал, уже давно размонтирован.</li>
					<li><strong>Лишние вычисления:</strong> Слушатель работает и обновляет <code>$state</code> всегда при ресайзе окна, даже если значение <code>current</code> в данный момент никому не нужно (например, вкладка с компонентом скрыта).</li>
				</ul>
			</div>
		</div>

		<div class="card">
			<h2>Как это решали раньше (с $effect.tracking)</h2>
			<p>
				Чтобы избежать утечек памяти и подписываться только тогда, когда значение реально кому-то нужно, 
				до появления <code>createSubscriber</code> разработчики писали свои обертки с использованием <code>$effect.tracking()</code>.
			</p>

			<div class="code-block bad-practice">
				<div class="code-header">
					<span class="badge red">Сложный подход</span>
					<span class="file">MediaQuery.svelte.ts</span>
				</div>
				<pre><code class="language-typescript">import &#123; untrack &#125; from 'svelte';

class MediaQuery &#123;
  #query;
  #matches = $state(false);
  #subscribers = 0;

  constructor(query) &#123;
    this.#query = window.matchMedia(query);
  &#125;

  get current() &#123;
    // Если геттер вызван внутри реактивного контекста (шаблона или эффекта)
    if ($effect.tracking()) &#123;
      $effect(() =&gt; &#123;
        if (this.#subscribers === 0) &#123;
          // Подписываемся только при появлении первого слушателя
          this.#matches = this.#query.matches;
          this.#query.addEventListener('change', this.#handleChange);
        &#125;
        this.#subscribers++;

        return () =&gt; &#123;
          this.#subscribers--;
          if (this.#subscribers === 0) &#123;
            // Отписываемся, когда исчез последний слушатель
            this.#query.removeEventListener('change', this.#handleChange);
          &#125;
        &#125;;
      &#125;);
    &#125;
    
    // При первом рендере читаем актуальное значение без трекинга, 
    // чтобы не получить state_unsafe_mutation
    return untrack(() =&gt; this.#subscribers &gt; 0 ? this.#matches : this.#query.matches);
  &#125;

  #handleChange = () =&gt; &#123;
    this.#matches = this.#query.matches;
  &#125;
&#125;</code></pre>
			</div>

			<div class="issue-list">
				<strong>Что делает <code>$effect.tracking()</code>?</strong>
				<p>
					Эта функция возвращает <code>true</code>, если код в данный момент выполняется внутри контекста, 
					который отслеживает зависимости (например, внутри шаблона Svelte, внутри <code>$derived</code> или внутри <code>$effect</code>).
				</p>
				<p>
					Если кто-то вызовет <code>media.current</code> в обычной функции (например, при клике на кнопку), 
					<code>$effect.tracking()</code> вернет <code>false</code>, эффект не создастся, подписка не добавится, 
					а геттер просто вернет текущее значение медиа-запроса. Это экономит ресурсы.
				</p>
				<p>
					<strong>Почему это плохо:</strong> Этот код чудовищно сложный. Разработчику нужно вручную считать подписчиков, 
					создавать эффекты внутри геттеров, следить за контекстами <code>untrack</code>, чтобы не словить ошибку мутации во время рендера. 
					Любая ошибка в этой логике ломает систему реактивности или вызывает утечки памяти.
				</p>
			</div>
		</div>

		<div class="card">
			<h2>Хороший вариант (с createSubscriber)</h2>
			<p>
				Правильный подход в Svelte 5 — использование <code>createSubscriber</code>. Это решает все проблемы плохой реализации: 
				подписка становится «ленивой» (устанавливается только когда нужно) и автоматически очищается.
			</p>

			<div class="code-block good-practice">
				<div class="code-header">
					<span class="badge green">Идеальный вариант</span>
					<span class="file">MediaQuery.svelte.ts</span>
				</div>
				<pre><code class="language-typescript">import &#123; createSubscriber &#125; from 'svelte/reactivity';
import &#123; on &#125; from 'svelte/events';

export class MediaQuery &#123;
	#query;
	#subscribe;

	constructor(query) &#123;
		this.#query = window.matchMedia(`($&#123;query&#125;)`);

		this.#subscribe = createSubscriber((update) =&gt; &#123;
			// когда происходит событие 'change', перезапускаем эффекты, 
			// которые читают `this.current`
			const off = on(this.#query, 'change', update);

			// прекращаем слушать, когда все эффекты уничтожены
			return () =&gt; off();
		&#125;);
	&#125;

	get current() &#123;
		// Делает геттер реактивным, если его читают внутри эффекта (или шаблона)
		this.#subscribe();

		// Возвращаем актуальное состояние запроса, независимо от того,
		// находимся ли мы в эффекте или нет
		return this.#query.matches;
	&#125;
&#125;</code></pre>
			</div>

			<div class="benefits-list">
				<strong>Плюсы идеального подхода:</strong>
				<ul>
					<li><strong>Автоматическая очистка памяти:</strong> Как только уничтожается последний <code>$effect</code> или компонент, читающий <code>current</code>, вызывается возвращенная функция <code>off()</code>. Утечек нет.</li>
					<li><strong>Ленивая инициализация:</strong> Подписка на <code>'change'</code> не создается до тех пор, пока кто-то явно не прочитает свойство <code>current</code> в реактивном контексте (например, в шаблоне <code>&#123;media.current&#125;</code>).</li>
					<li><strong>Отсутствие дублирования состояния:</strong> Значение не дублируется в лишнюю переменную <code>$state</code>. Геттер всегда возвращает свежее значение напрямую из API браузера (<code>this.#query.matches</code>). Функция <code>update()</code> просто сигнализирует движку Svelte о том, что геттер нужно прочитать заново.</li>
				</ul>
			</div>
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

	.desc {
		color: #6c757d;
		margin-bottom: 2rem;
	}

	.demos-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	@media (min-width: 768px) {
		.demos-grid {
			grid-template-columns: 1fr 1fr;
		}
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

	.issue-list, .benefits-list {
		margin-top: 1.5rem;
		padding: 1.5rem;
		border-radius: 8px;
	}

	.issue-list {
		background: #fff5f5;
		border: 1px solid #f5c2c7;
	}

	.benefits-list {
		background: #f8fff9;
		border: 1px solid #badbcc;
	}

	ul {
		padding-left: 1.5rem;
		line-height: 1.6;
		margin-bottom: 0;
	}

	li {
		margin-bottom: 0.5rem;
	}
</style>