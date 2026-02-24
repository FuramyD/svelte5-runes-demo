import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';
import { browser } from '$app/environment';

export class MediaQueryNaive {
	#query: MediaQueryList | null = null;
	current = $state(false);

	constructor(query: string) {
		if (browser) {
			this.#query = window.matchMedia(query);
			this.current = this.#query.matches;

			// Подписываемся на изменения навсегда
			this.#query.addEventListener('change', () => {
				if (this.#query) {
					this.current = this.#query.matches;
				}
			});
		}
	}
}

export class MediaQueryGood {
	#query: MediaQueryList | null = null;
	#subscribe: () => void;

	constructor(query: string) {
		if (browser) {
			this.#query = window.matchMedia(query);
		}

		this.#subscribe = createSubscriber((update) => {
			if (!this.#query) return;

			// когда происходит событие 'change', перезапускаем эффекты
			const off = on(this.#query, 'change', update);

			// прекращаем слушать, когда все эффекты уничтожены
			return () => off();
		});
	}

	get current() {
		// Делает геттер реактивным
		this.#subscribe();

		// Возвращаем актуальное состояние
		return this.#query?.matches ?? false;
	}
}