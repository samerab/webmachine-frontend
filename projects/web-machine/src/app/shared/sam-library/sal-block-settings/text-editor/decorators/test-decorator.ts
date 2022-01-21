export function emoji(emj: string) {
    return (target, key) => {
        let value: string;
        Object.defineProperty(target,key, {
            get: () => {
                return value;
            },
            set: (_value) => {
                value = _value + ' ' + emj
            },
            enumerable: true,
            configurable: true
        })
    }
}