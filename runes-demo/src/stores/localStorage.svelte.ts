import { browser } from "$app/environment";
import { on } from "svelte/events";
import { untrack } from "svelte";
import { createSubscriber } from "svelte/reactivity";

const fakeStorage: Storage = {
	key: () => '',
	getItem: (_) => '',
	setItem: () => {},
	removeItem: (_) => {},
	clear: () => {},
	length: 0,
}

// V1: Все эффекты инициализируются в конструкторе и работают всегда
export class LocalStorageStore<T> {
	#storage: Storage;
	#initialValue: T;
	#key: string;

	value = $state<T>() as T;

	#read() {
		try {
			const value = this.#storage.getItem(this.#key);
			return value != null 
				? JSON.parse(value) 
				: this.#initialValue;
		} catch {
			return this.#initialValue;
		}
	}

	constructor(key: string, initialValue: T) {
		this.#key = key;
		this.#initialValue = initialValue;
		this.#storage = browser ? window.localStorage : fakeStorage;

		this.value = this.#read();

		$effect(() => {
			this.#storage.setItem(this.#key, JSON.stringify(this.value));
		});

		$effect(() => {
			const handleStorage = (event: StorageEvent) => {
				if (event.key === this.#key && event.storageArea === localStorage) {
					this.value = this.#read();
				}
			};
			
			window.addEventListener('storage', handleStorage);
			
			return () => {
				window.removeEventListener('storage', handleStorage);
			};
		});
	}
}

export class LocalStorageStoreV2<T> {
	#storage: Storage;
	#initialValue: T;
	#key: string;

	#value = $state<T>() as T;
	
	#subscribe: () => void;
	#notify: () => void = () => {};
	#cleanUp: () => void;

	constructor(key: string, initialValue: T) {
		this.#key = key;
		this.#initialValue = initialValue;
		this.#storage = browser ? window.localStorage : fakeStorage;
		
		if (!this.#storage.getItem(key)) {
			this.#set(initialValue);
		}

		this.#subscribe = createSubscriber((update) => {
			this.#notify = update;
			
			untrack(() => {
				this.#value = this.#read();
			});

			const off = on(window, 'storage', (event: StorageEvent) => {
				if (event.key === this.#key && event.storageArea === localStorage) {
					this.#value = this.#read();
				}
			});
	
			return () => off();
		});

		this.#value = this.#read();

		this.#cleanUp = $effect.root(() => {
			$effect(() => {
				this.#set(this.#value);
			});
		});
	}

	#read(): T {
		try {
			const value = this.#storage.getItem(this.#key);
			return value != null ? JSON.parse(value) : this.#initialValue;
		} catch {
			return this.#initialValue;
		}
	}

	#set(value: T) {
		try {
			this.#storage.setItem(this.#key, JSON.stringify(value));
			this.#notify();
		} catch {}
	}

	get value() {
		this.#subscribe();
		return this.#value;
	}

	set value(newValue: T) {
		this.#value = newValue;
	}

	destroy() {
		this.#cleanUp();
	}
}

// @see https://github.com/friendofsvelte/state/blob/main/src/lib/storage.svelte.ts
export class LocalStorageStoreV3<T> {
	#key: string;
	#version = $state(0);
	#value: T | undefined;
	#storage: Storage | undefined;
	
	#subscribe: () => void;

	constructor(key: string, initial?: T) {
		if (!key) {
			throw new Error('PersistentState: key must be a non-empty string');
		}

		this.#key = key;
		this.#value = initial;

		if (typeof localStorage !== 'undefined') {
			this.#storage = localStorage;
		}

		this.#init(initial);

		this.#subscribe = createSubscriber(() => {
			const off = on(window, 'storage', (e: StorageEvent) => {
				if (e.storageArea === this.#storage && e.key === this.#key) {
					this.#version += 1;
				}
			});

			return off;
		});
	}

	#init(value: T | undefined) {
		if (typeof localStorage === 'undefined' || localStorage.getItem(this.#key) !== null) {
			return;
		}

		this.#set(value);
	}

	#set(value: T | undefined) {
		if (!this.#storage) {
			return;
		}

		try {
			this.#storage.setItem(this.#key, JSON.stringify(value));
		} catch {
			// Storage full or unavailable
		}
	}

	#read() {
		if (!this.#storage) {
			return this.#value;
		}

		try {
			return JSON.parse(this.#storage.getItem(this.#key) as string);
		} catch {
			return this.#value;
		}
	}

	get value(): T {
		this.#version;

		const root: T | undefined = this.#read();
		const proxies = new WeakMap();

		const proxy = (value: unknown) => {
			if (typeof value !== 'object' || value === null) {
				return value;
			}

			let p = proxies.get(value);
			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
						this.#version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
						this.#version += 1;
						Reflect.set(target, property, value);
						this.#set(root);

						return true;
					}
				});
				proxies.set(value, p);
			}

			return p;
		};

		this.#subscribe();
		return proxy(root) as T;
	}

	set value(value: T) {
		if (typeof this.#storage !== 'undefined') {
			try {
				this.#storage.setItem(this.#key, JSON.stringify(value));
			} catch {
				// Storage full or unavailable
			}
		}

		this.#version += 1;
	}
}
