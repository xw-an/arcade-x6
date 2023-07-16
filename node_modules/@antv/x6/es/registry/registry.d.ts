import { KeyValue } from '../types';
export declare class Registry<Entity, Presets = KeyValue<Entity>, OptionalType = never> {
    readonly data: KeyValue<Entity>;
    readonly options: Registry.Options<Entity | OptionalType>;
    constructor(options: Registry.Options<Entity | OptionalType>);
    get names(): string[];
    register(entities: {
        [name: string]: Entity | OptionalType;
    }, force?: boolean): void;
    register<K extends keyof Presets>(name: K, entity: Presets[K], force?: boolean): Entity;
    register(name: string, entity: Entity | OptionalType, force?: boolean): Entity;
    unregister<K extends keyof Presets>(name: K): Entity | null;
    unregister(name: string): Entity | null;
    get<K extends keyof Presets>(name: K): Entity | null;
    get(name: string): Entity | null;
    exist<K extends keyof Presets>(name: K): boolean;
    exist(name: string): boolean;
    onDuplicated(name: string): void;
    onNotFound(name: string, prefix?: string): never;
    getSpellingSuggestion(name: string, prefix?: string): string;
    protected getSpellingSuggestionForName(name: string): string | undefined;
}
export declare namespace Registry {
    interface Options<Entity> {
        type: string;
        data?: KeyValue<Entity>;
        process?: <T, Context extends Registry<any>>(this: Context, name: string, entity: Entity) => T;
        onConflict?: <Context extends Registry<any>>(this: Context, name: string) => void;
    }
}
export declare namespace Registry {
    function create<Entity, Presets = KeyValue<Entity>, OptionalType = never>(options: Options<Entity | OptionalType>): Registry<Entity, Presets, OptionalType>;
}
