export function timeout(time: number = 0) {
    return (
        target: Object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            setTimeout(() => {
                originalMethod.apply(this, args)
            }, time)
            return descriptor;
        };
    }
}