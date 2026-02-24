import { signal, effect, derived, get } from './signals-concept.ts';

const value = signal(5);
const double = derived(() => get(value) * 2);

effect(() => {
    console.log({
        value: get(value),
        double: get(double)
    })
});

const intervalId = setInterval(() => {
    value.set(get(value) + 1);
}, 1_000);

setTimeout(() => {
    clearInterval(intervalId);
    value.update((x) => x ** 2);
}, 10_500);

setTimeout(() => {
    console.log('Где то посередине просто читаем значения', {
        value: get(value),
        double: get(double),
    });
}, 3_500)
