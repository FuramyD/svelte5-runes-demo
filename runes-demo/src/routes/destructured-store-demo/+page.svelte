<script lang="ts">
	import TaskDemoFunction from '../../components/TaskDemoFunction.svelte';
	import TaskDemoFunctionDestructured from '../../components/TaskDemoFunctionDestructured.svelte';
	import { initTaskStoreFunction } from '../../stores/tasksFunction.svelte';

	initTaskStoreFunction();
</script>

<svelte:head>
	<title>Destructured Store Demo</title>
</svelte:head>

<div class="page">
	<div class="demos-container">
		<TaskDemoFunction />
		<TaskDemoFunctionDestructured />
	</div>
</div>

<style>
	.page {
		padding: 2rem;
		min-height: calc(100vh - 64px);
		background-color: #f0f2f5;
	}
	
	.demos-container {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
	}

	/* Делаем так, чтобы оба примера делили пространство поровну на широких экранах */
	:global(.demos-container > *) {
		flex: 1;
		min-width: 450px;
	}
</style>