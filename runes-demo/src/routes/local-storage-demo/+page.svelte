<script lang="ts">
	import LocalStorageDemo from '../../components/LocalStorageDemo.svelte';
</script>

<svelte:head>
	<title>LocalStorage Demo</title>
</svelte:head>

<div class="page">
	<LocalStorageDemo />
</div>

<style>
	.page {
		padding: 2rem;
		min-height: calc(100vh - 64px);
		background-color: #f0f2f5;
	}
</style>