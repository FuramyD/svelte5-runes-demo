<script lang="ts">
	import { MediaQueryNaive, MediaQueryGood } from '../stores/mediaQuery.svelte';

	let { title, description, query } = $props<{
		title: string;
		description: string;
		query: string;
	}>();

	// Инстанцируем оба стора с одним и тем же медиа-запросом
	const mqNaive = new MediaQueryNaive(query);
	const mqGood = new MediaQueryGood(query);
</script>

<div class="demo-card">
	<h3>{title}</h3>
	<p class="desc">{@html description}</p>

	<div class="query-info">
		<strong>Запрос:</strong> <code>{query}</code>
	</div>

	<div class="comparisons">
		<div class="mq-result naive" class:active={mqNaive.current}>
			<div class="mq-header">
				<span class="badge red">Плохой</span>
				<span class="value">{mqNaive.current ? 'TRUE' : 'FALSE'}</span>
			</div>
			<div class="status-indicator"></div>
		</div>

		<div class="mq-result ideal" class:active={mqGood.current}>
			<div class="mq-header">
				<span class="badge green">Хороший</span>
				<span class="value">{mqGood.current ? 'TRUE' : 'FALSE'}</span>
			</div>
			<div class="status-indicator"></div>
		</div>
	</div>
</div>

<style>
	.demo-card {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	h3 {
		margin-top: 0;
		color: #212529;
		margin-bottom: 0.5rem;
	}

	.desc {
		color: #6c757d;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.query-info {
		margin-bottom: 1.5rem;
		padding: 0.75rem;
		background: #e9ecef;
		border-radius: 6px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	code {
		font-family: ui-monospace, monospace;
		background: #fff;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		color: #d63384;
		font-weight: bold;
	}

	.comparisons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.mq-result {
		background: #fff;
		border: 1px solid #dee2e6;
		border-radius: 6px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		transition: all 0.3s ease;
	}

	.mq-result.active {
		border-color: #0d6efd;
		box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
	}

	.mq-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.badge.red { background: #dc3545; color: white; }
	.badge.green { background: #198754; color: white; }

	.value {
		font-family: monospace;
		font-size: 1.25rem;
		font-weight: bold;
		color: #495057;
	}

	.active .value {
		color: #0d6efd;
	}

	.status-indicator {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #dc3545;
		transition: background-color 0.3s ease;
	}

	.active .status-indicator {
		background: #198754;
	}
</style>