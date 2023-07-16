export declare namespace Interp {
    type Definition<T> = (from: T, to: T) => (time: number) => T;
}
export declare namespace Interp {
    const number: Definition<number>;
    const object: Definition<{
        [key: string]: number;
    }>;
    const unit: Definition<string>;
    const color: Definition<string>;
}
