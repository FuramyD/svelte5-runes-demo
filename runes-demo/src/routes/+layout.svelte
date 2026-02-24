<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	afterNavigate(() => {
		if (typeof window !== 'undefined' && (window as any).Prism) {
			(window as any).Prism.highlightAll();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
</svelte:head>

<nav>
    <a href="/runes-demo" class:active={page.url.pathname === '/runes-demo'}>Базовые руны</a>
    <a href="/deep-state" class:active={page.url.pathname === '/deep-state'}>Глубокая реактивность</a>
    <a href="/store-demo" class:active={page.url.pathname === '/store-demo'}>Стор на рунах</a>
    <a href="/destructured-store-demo" class:active={page.url.pathname === '/destructured-store-demo'}>Деструктуризация</a>
    <a href="/create-subscriber-demo" class:active={page.url.pathname === '/create-subscriber-demo'}>createSubscriber</a>
    <a href="/media-query-demo" class:active={page.url.pathname === '/media-query-demo'}>MediaQuery</a>
    <a href="/local-storage-demo" class:active={page.url.pathname === '/local-storage-demo'}>LocalStorage</a>
</nav>

<style>
    nav {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background-color: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }

    nav a {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: all 0.2s ease-in-out;
    }

    nav a:hover {
        background-color: #e9ecef;
        color: #007bff;
    }

    nav a.active {
        background-color: #007bff;
        color: white;
    }
</style>

{@render children()}
