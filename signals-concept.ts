// Disclaimer:
// В реализациях Vue, Angular и Svelte сигналы все таки чуть сложнее реализованы со своими оптимизациями и методами синхронизации
// В данной реализации я просто накидал самый простой пример, все еще с определенными проблемами, но позволяет продемонстрировать на базовом примере
// как работают сигналы в целом, и что нужно держать в голове при работе с сигналами

type EffectFn = () => void;

type Signal<T> = {
    subscribe: (fn: EffectFn) => void;
    value: T;
    set: (newValue: T) => void;
    update: (fn: (currentValue: T) => T) => void;
};
type ReadableSignal<T> = Omit<Signal<T>, 'set' | 'update'>;

let currentFn: EffectFn | null = null;

function get<T>(signal: ReadableSignal<T>): T {
    if (currentFn) {
        signal.subscribe(currentFn);
    }
    return signal.value;
}

function effect(fn: EffectFn): void {
    let isQueued = false;

    const execute = () => {
        if (isQueued) return;
        isQueued = true;

        queueMicrotask(() => {
            isQueued = false;
            fn();
        });
    };

    currentFn = execute;
    fn();
    currentFn = null;
}

function derived<T>(fn: () => T): ReadableSignal<T> {
    const s = signal(fn());

    effect(() => {
        s.set(fn());
    });

    return s;
}

function signal<T>(value: T): Signal<T> {
    const listeners: EffectFn[] = [];

    function notify() {
        listeners.forEach(fn => fn());
    }

    function subscribe(fn: EffectFn) {
        listeners.push(fn);
    }

    return {
        value,
        subscribe,
        set(value: T) {
            this.value = value;
            notify();
        },
        update(fn: (currentValue: T) => T) {
            this.value = fn(this.value);
            notify();
        }
    }
}

export { signal, effect, derived, get };
