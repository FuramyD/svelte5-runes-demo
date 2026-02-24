import { createContext } from 'svelte';

export interface Task {
	id: string;
	title: string;
	completed: boolean;
	createdAt: Date;
}

export class TaskStore {
	tasks = $state<Task[]>([]);
	filter = $state<'all' | 'active' | 'completed'>('all');

	filteredTasks = $derived.by<Task[]>(() => {
		switch (this.filter) {
			case 'active':
				return this.tasks.filter((t) => !t.completed);
			case 'completed':
				return this.tasks.filter((t) => t.completed);
			default:
				return this.tasks;
		}
	});

	stats = $derived.by(() => {
		const total = this.tasks.length;
		const completed = this.tasks.filter((t) => t.completed).length;
		return {
			total,
			completed,
			active: total - completed,
			percentCompleted: total === 0 ? 0 : Math.round((completed / total) * 100)
		};
	});

	addTask(title: string): void {
		if (!title.trim()) return;
		this.tasks.push({
			id: crypto.randomUUID(),
			title: title.trim(),
			completed: false,
			createdAt: new Date()
		});
	}

	toggleTask(id: string): void {
		const task = this.tasks.find((t) => t.id === id);
		if (task) {
			task.completed = !task.completed;
		}
	}

	deleteTask(id: string): void {
		const index = this.tasks.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.tasks.splice(index, 1);
		}
	}

	clearCompleted(): void {
		this.tasks = this.tasks.filter((t) => !t.completed);
	}

	setFilter(newFilter: 'all' | 'active' | 'completed'): void {
		this.filter = newFilter;
	}
}

const [getTaskStore, setTaskStore] = createContext<TaskStore>();

function initTaskStore(): TaskStore {
	return setTaskStore(new TaskStore());
}

export { getTaskStore, initTaskStore };
