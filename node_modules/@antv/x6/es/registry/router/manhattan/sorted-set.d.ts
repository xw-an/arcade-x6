export declare class SortedSet {
    items: string[];
    hash: {
        [key: string]: number;
    };
    values: {
        [key: string]: number;
    };
    constructor();
    add(item: string, value: number): void;
    pop(): string | undefined;
    isOpen(item: string): boolean;
    isClose(item: string): boolean;
    isEmpty(): boolean;
}
