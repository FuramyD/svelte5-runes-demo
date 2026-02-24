<script lang="ts">
	import { getTaskStoreFn } from '../stores/tasksFunction.svelte';

	const store = getTaskStoreFn();
	
	const { 
		stats, 
		filteredTasks, 
		filter, 
		setFilter, 
		clearCompleted, 
		addTask, 
		toggleTask, 
		deleteTask 
	} = store;

	let newTaskTitle = $state('');

	function handleAdd() {
		if (newTaskTitle.trim()) {
			addTask(newTaskTitle); 
			newTaskTitle = '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleAdd();
		}
	}
</script>

<div class="task-demo destructured">
	<h2>Деструктуризация (Сломанная реактивность)</h2>
	
	<p class="description warning">
		Методы работают, но <strong>геттеры прочитались на этапе деструктуризации и в переменых просто значения</strong>.<br>
		Реактивность UI сломана: данные обновляются внутри стора (см. пример слева), но этот компонент не перерисовывается.
	</p>

	<div class="stats">
		<div class="stat-box">
			<span class="label">Всего</span>
			<!-- stats - нереактивная копия -->
			<span class="value">{stats.total}</span>
		</div>
		<div class="stat-box">
			<span class="label">Активно</span>
			<span class="value">{stats.active}</span>
		</div>
		<div class="stat-box">
			<span class="label">Завершено</span>
			<span class="value">{stats.completed}</span>
		</div>
		<div class="stat-box">
			<span class="label">Прогресс</span>
			<span class="value">{stats.percentCompleted}%</span>
		</div>
	</div>

	<div class="add-task">
		<input 
			type="text" 
			bind:value={newTaskTitle} 
			onkeydown={handleKeydown}
			placeholder="Что нужно сделать?" 
		/>
		<button onclick={handleAdd}>Добавить</button>
	</div>

	<div class="filters">
		<!-- filter - нереактивная копия -->
		<button 
			class:active={filter === 'all'} 
			onclick={() => setFilter('all')}
		>
			Все
		</button>
		<button 
			class:active={filter === 'active'} 
			onclick={() => setFilter('active')}
		>
			Активные
		</button>
		<button 
			class:active={filter === 'completed'} 
			onclick={() => setFilter('completed')}
		>
			Завершенные
		</button>
		{#if stats.completed > 0}
			<button class="clear" onclick={() => clearCompleted()}>
				Очистить завершенные
			</button>
		{/if}
	</div>

	<ul class="task-list">
		<!-- filteredTasks - нереактивная копия -->
		{#each filteredTasks as task (task.id)}
			<li class="task-item" class:completed={task.completed}>
				<label>
					<input 
						type="checkbox" 
						checked={task.completed} 
						onchange={() => toggleTask(task.id)} 
					/>
					<span class="title">{task.title}</span>
				</label>
				<button class="delete-btn" onclick={() => deleteTask(task.id)}>×</button>
			</li>
		{:else}
			<li class="empty-state">Нет задач для отображения</li>
		{/each}
	</ul>
</div>

<style>
	.task-demo {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.task-demo.destructured {
		border: 2px solid #dc3545;
		background-color: #fffafb;
	}

	h2 {
		margin-top: 0;
		color: #333;
	}

	.description {
		color: #666;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.description.warning {
		color: #b02a37;
		background: #f8d7da;
		padding: 1rem;
		border-radius: 4px;
		border-left: 4px solid #dc3545;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-box {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 6px;
		text-align: center;
		border: 1px solid #e9ecef;
	}

	.stat-box .label {
		display: block;
		font-size: 0.875rem;
		color: #6c757d;
		margin-bottom: 0.5rem;
	}

	.stat-box .value {
		display: block;
		font-size: 1.5rem;
		font-weight: bold;
		color: #212529;
	}

	.add-task {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.add-task input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-size: 1rem;
	}

	.add-task button {
		padding: 0.75rem 1.5rem;
		background: #0d6efd;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.add-task button:hover {
		background: #0b5ed7;
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.filters button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid #dee2e6;
		border-radius: 20px;
		cursor: pointer;
		color: #495057;
		transition: all 0.2s;
	}

	.filters button:hover {
		background: #e9ecef;
	}

	.filters button.active {
		background: #0d6efd;
		color: white;
		border-color: #0d6efd;
	}

	.filters button.clear {
		margin-left: auto;
		color: #dc3545;
		border-color: #dc3545;
	}

	.task-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.task-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		margin-bottom: 0.5rem;
	}

	.task-item.completed {
		opacity: 0.7;
		background: #f1f3f5;
	}

	.task-item.completed .title {
		text-decoration: line-through;
		color: #6c757d;
	}

	.task-item label {
		display: flex;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
		flex: 1;
	}

	.task-item input[type="checkbox"] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.title {
		font-size: 1.1rem;
	}

	.delete-btn {
		background: none;
		border: none;
		color: #dc3545;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0 0.5rem;
		opacity: 0.5;
	}

	.delete-btn:hover {
		opacity: 1;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: #6c757d;
		font-style: italic;
		background: #f8f9fa;
		border-radius: 4px;
		border: 1px dashed #ced4da;
	}
</style>