<script lang="ts">
    let count: number = $state(0);
    let double: number = $derived(getDouble());

    function getDouble() {
        console.log('getDouble', { isTracking:  $effect.tracking() });
        return count * 2;
    }

    console.log({ isTracking2: $effect.tracking() });

    $effect(() => {
        console.log({
            count,
            double,
        });

        return () => {
            console.log('Очистка перед следующим эффектом...');
        };
    });

    function increment(): void {
        count += 1;
    }

    function reset(): void {
        count = 0;
    }
</script>

<div class="demo-container">
    <h2>Демонстрация Рун Svelte 5</h2>
    
    <div class="stats">
        <p>Счетчик: <strong>{count}</strong></p>
        <p>Удвоенное значение: <strong>{double}</strong></p>
    </div>

    <div class="actions">
        <button onclick={increment}>Увеличить (+1)</button>
        <button onclick={reset}>Сбросить (0)</button>
    </div>
</div>

<style>
    .demo-container {
        font-family: system-ui, -apple-system, sans-serif;
        width: 100%;
        max-width: 400px;
    }

    h2 {
        margin-top: 0;
        color: #212529;
    }

    .stats {
        margin: 1rem 0;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 4px;
    }

    .actions button {
        padding: 0.5rem 1rem;
        margin-right: 0.5rem;
        cursor: pointer;
        background: #0074d9;
        color: white;
        border: none;
        border-radius: 4px;
    }

    .actions button:hover {
        background: #0056b3;
    }
</style>