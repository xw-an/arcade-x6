export declare function diff<T extends {
    [key: string]: any;
}>(oldList: T[], newList: T[], key: string): {
    moves: {
        index: number;
        type: number;
        item: any;
    }[];
};
