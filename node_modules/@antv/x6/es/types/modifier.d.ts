/// <reference types="jquery" />
export declare type ModifierKey = 'alt' | 'ctrl' | 'meta' | 'shift';
export declare namespace ModifierKey {
    function parse(modifiers: string | ModifierKey[]): {
        or: ModifierKey[];
        and: ModifierKey[];
    };
    function equals(modifiers1?: string | ModifierKey[] | null, modifiers2?: string | ModifierKey[] | null): boolean;
    function isMatch(e: JQuery.TriggeredEvent | WheelEvent, modifiers?: string | ModifierKey[] | null, strict?: boolean): boolean;
}
