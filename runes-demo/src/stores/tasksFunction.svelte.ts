import { createContext } from 'svelte';
import type { Task } from './tasks.svelte';

export type TaskStoreFunction = ReturnType<typeof createTaskStore>;

export function createTaskStore() {
	let tasks = $state<Task[]>([]);
	let filter = $state<'all' | 'active' | 'completed'>('all');

	const filteredTasks = $derived.by<Task[]>(() => {
		switch (filter) {
			case 'active':
				return tasks.filter((t) => !t.completed);
			case 'completed':
				return tasks.filter((t) => t.completed);
			default:
				return tasks;
		}
	});

	const stats = $derived.by(() => {
		const total = tasks.length;
		const completed = tasks.filter((t) => t.completed).length;
		return {
			total,
			completed,
			active: total - completed,
			percentCompleted: total === 0 ? 0 : Math.round((completed / total) * 100)
		};
	});

	function addTask(title: string): void {
		if (!title.trim()) return;
		tasks.push({
			id: crypto.randomUUID(),
			title: title.trim(),
			completed: false,
			createdAt: new Date()
		});
	}

	function toggleTask(id: string): void {
		const task = tasks.find((t) => t.id === id);
		if (task) {
			task.completed = !task.completed;
		}
	}

	function deleteTask(id: string): void {
		const index = tasks.findIndex((t) => t.id === id);
		if (index !== -1) {
			tasks.splice(index, 1);
		}
	}

	function clearCompleted(): void {
		tasks = tasks.filter((t) => !t.completed);
	}

	function setFilter(newFilter: 'all' | 'active' | 'completed'): void {
		filter = newFilter;
	}

	return {
		get tasks() { return tasks; },
		get filter() { return filter; },
		get filteredTasks() { return filteredTasks; },
		get stats() { return stats; },
		addTask,
		toggleTask,
		deleteTask,
		clearCompleted,
		setFilter
	};
}

const [getTaskStoreFn, setTaskStoreFn] = createContext<TaskStoreFunction>();

function initTaskStoreFunction(): TaskStoreFunction {
	return setTaskStoreFn(createTaskStore());
}

export { getTaskStoreFn, initTaskStoreFunction };