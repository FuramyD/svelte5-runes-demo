<script lang="ts">
    type Todo = {
        id: number;
        text: string;
        done: boolean;
    };

    // Используем $state.raw для отключения глубокой реактивности (Proxy)
    let todos = $state.raw<Todo[]>([
        { id: 1, text: 'Изучить $state.raw', done: true },
        { id: 2, text: 'Понять поверхностную реактивность', done: false }
    ]);

    let newTodoText = $state('');

    function addTodo() {
        if (!newTodoText.trim()) return;
        
        // ⚠️ Это НЕ сработает: мы мутируем массив без переназначения.
        // Svelte не увидит изменений, так как нет глубокого Proxy.
        todos.push({
            id: Date.now(),
            text: newTodoText,
            done: false
        });
        
        // Переменная newTodoText объявлена через обычный $state, 
        // поэтому инпут очистится, но новая задача в списке не появится.
        newTodoText = '';
    }

    function toggleTodo(todo: Todo) {
        // ⚠️ Это НЕ сработает: мы мутируем свойство глубокого объекта.
        todo.done = !todo.done;
    }

    function removeTodo(id: number) {
        // ⚠️ Мы специально используем мутацию splice вместо reassignment,
        // чтобы показать, что это тоже не сработает с $state.raw.
        const index = todos.findIndex(t => t.id === id);
        if (index !== -1) {
            todos.splice(index, 1);
        }
        
        // (Если бы мы написали todos = todos.filter(...), то это бы сработало, 
        // так как это переназначение самой переменной todos)
    }
</script>

<div class="demo-container">
    <h2>Поверхностная реактивность $state.raw</h2>
    
    <div class="add-form">
        <input 
            type="text" 
            bind:value={newTodoText} 
            placeholder="Новая задача..."
            onkeydown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onclick={addTodo}>Добавить</button>
    </div>

    Всего задач: {todos.length}

    <ul class="todo-list">
        {#each todos as todo (todo.id)}
            <li class:done={todo.done}>
                <label>
                    <input 
                        type="checkbox" 
                        checked={todo.done}
                        onchange={() => toggleTodo(todo)}
                    />
                    <span>{todo.text}</span>
                </label>
                <button class="remove" onclick={() => removeTodo(todo.id)}>✕</button>
            </li>
        {/each}
    </ul>

    <div class="raw-state">
        <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
</div>

<style>
    .demo-container {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        max-width: 500px;
    }

    .add-form {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .add-form input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .add-form button {
        padding: 0.5rem 1rem;
        background: #0074d9;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .todo-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem 0;
    }

    .todo-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
    }

    .todo-list li label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    .todo-list li.done span {
        text-decoration: line-through;
        color: #888;
    }

    .remove {
        background: none;
        border: none;
        color: #ff4136;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0 0.5rem;
    }

    .raw-state {
        background: #f4f4f4;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 0.85rem;
    }
</style>