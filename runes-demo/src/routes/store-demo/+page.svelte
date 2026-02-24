<script lang="ts">
	import TaskDemo from '../../components/TaskDemo.svelte';
</script>

<svelte:head>
	<title>Store Demo</title>
</svelte:head>

<div class="page">
	<TaskDemo />
</div>

<style>
	.page {
		padding: 2rem;
		min-height: calc(100vh - 64px);
		background-color: #f0f2f5;
	}
</style>