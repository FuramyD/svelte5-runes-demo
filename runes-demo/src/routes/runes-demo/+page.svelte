<script>
	import RunesDemo from "../../components/RunesDemo.svelte";
</script>

<div class="page-container">
	<header class="header">
		<h1>Базовые руны в Svelte 5</h1>
		<p class="subtitle">Знакомство с <code>$state</code>, <code>$derived</code> и <code>$effect</code></p>
	</header>

	<section class="explanation-card">
		<h2>Новая система реактивности</h2>
		<p>
			Svelte 5 отказывается от старой системы реактивности на базе обычного <code>let</code> и <code>$:</code> 
			в пользу явных «рун» — специальных макросов компилятора, которые делают поток данных предсказуемым.
		</p>
		<ul>
			<li><strong><code>$state</code></strong>: Объявляет реактивное состояние. Изменение этой переменной автоматически вызовет перерендер компонента.</li>
			<li><strong><code>$derived</code></strong>: Создает производное (вычисляемое) значение, которое кэшируется и автоматически пересчитывается при изменении зависимого стейта.</li>
			<li><strong><code>$effect</code></strong>: Выполняет сайд-эффекты (работу с DOM, API, подписками) после рендера, автоматически отслеживает зависимости и имеет удобный механизм очистки <code>return () => &#123; ... &#125;</code>.</li>
		</ul>
	</section>

	<div class="demo-wrapper">
		<RunesDemo />
	</div>
</div>

<style>
	.page-container {
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

	.explanation-card {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 3rem;
		box-shadow: 0 4px 6px rgba(0,0,0,0.02);
	}

	.explanation-card h2 {
		margin-top: 0;
		color: #0d6efd;
		margin-bottom: 1.5rem;
	}

	.explanation-card p {
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.explanation-card ul {
		line-height: 1.8;
		margin-bottom: 0;
		padding-left: 1.5rem;
	}

	.explanation-card li {
		margin-bottom: 0.5rem;
	}

	code {
		font-family: ui-monospace, monospace;
		background: rgba(0,0,0,0.05);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
		color: #d63384;
		font-weight: 500;
	}

	.demo-wrapper {
		display: flex;
		justify-content: center;
		padding: 3rem 2rem;
		background: #fff;
		border: 1px solid #e9ecef;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0,0,0,0.05);
	}
</style>