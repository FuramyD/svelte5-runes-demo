<script>
	import DeepStateDemo from "../../components/DeepStateDemo.svelte";
	import RawStateDemo from "../../components/RawStateDemo.svelte";
</script>

<div class="page-container">
	<header class="header">
		<h1>Глубокая vs Поверхностная Реактивность</h1>
		<p class="subtitle">Сравнение работы <code>$state</code> и <code>$state.raw</code></p>
	</header>

	<section class="explanation-card">
		<h2>Как работает $state под капотом?</h2>
		<p>
			Когда мы используем руну <code>$state</code> для объектов или массивов, Svelte по умолчанию создает 
			<strong>глубоко реактивный Proxy</strong>. Это значит, что любые мутации свойств объекта (например, 
			<code>todo.done = true</code>) или вызовы мутирующих методов массива (например, <code>todos.push(...)</code>) 
			будут автоматически отслежены и вызовут обновление UI.
		</p>
		<p>
			Однако создание и отслеживание <strong>Proxy</strong> на каждом уровне вложенности объектов может негативно повлиять 
			на <strong>производительность</strong>, особенно если вы работаете с очень большими объемами данных (например, 
			тысячи строк из базы данных или сложные деревья конфигурации), и вам не нужно отслеживать изменение 
			глубоких свойств.
		</p>
		<p>
			В таких случаях для максимизации производительности используется руна <strong><code>$state.raw</code></strong>. 
			Она отказывается от Proxy и отслеживает только переназначения (reassignments) самой переменной.
		</p>
	</section>

	<div class="demos">
		<div class="demo-wrapper">
			<div class="demo-header">
				<h3>Обычный <code>$state</code> (с Proxy)</h3>
				<p>Можно использовать мутации: <code>todos.push()</code> и <code>todo.done = !todo.done</code></p>
			</div>
			<DeepStateDemo />
		</div>

		<div class="demo-wrapper">
			<div class="demo-header">
				<h3>Поверхностный <code>$state.raw</code> (без Proxy)</h3>
				<p>Требуется иммутабельность: <code>todos = [...todos]</code> и <code>.map()</code></p>
			</div>
			<RawStateDemo />
		</div>
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
		color: #333;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
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
		margin-bottom: 1rem;
	}

	.explanation-card p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.explanation-card p:last-child {
		margin-bottom: 0;
	}

	code {
		font-family: ui-monospace, monospace;
		background: rgba(0,0,0,0.05);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	.demos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
		gap: 2rem;
	}

	.demo-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 1.5rem;
		height: 80px;
	}

	.demo-header h3 {
		margin: 0 0 0.5rem 0;
		color: #212529;
	}

	.demo-header p {
		margin: 0;
		font-size: 0.9rem;
		color: #6c757d;
	}
</style>