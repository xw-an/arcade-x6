import { RequiredKeys, OptionalKeys, PickByValue, OmitByValue } from 'utility-types';
import { FunctionExt } from '../util';
export declare class Events<EventArgs extends Events.EventArgs = any> {
    private listeners;
    on<Name extends Events.EventNames<EventArgs>>(name: Name, handler: Events.Handler<EventArgs[Name]>, context?: any): this;
    on<Name extends Events.UnknownNames<EventArgs>>(name: Name, handler: Events.Handler<any>, context?: any): this;
    once<Name extends Events.EventNames<EventArgs>>(name: Name, handler: Events.Handler<EventArgs[Name]>, context?: any): this;
    once<Name extends Events.UnknownNames<EventArgs>>(name: Name, handler: Events.Handler<any>, context?: any): this;
    off(): this;
    off(name: null, handler: Events.Handler<any>): this;
    off(name: null, handler: null, context: any): this;
    off<Name extends Events.EventNames<EventArgs>>(name: Name, handler?: Events.Handler<EventArgs[Name]>, context?: any): this;
    off<Name extends Events.UnknownNames<EventArgs>>(name: Name, handler?: Events.Handler<any>, context?: any): this;
    trigger<Name extends Events.OptionalNormalNames<EventArgs>>(name: Name): FunctionExt.AsyncBoolean;
    trigger<Name extends Events.RequiredNormalNames<EventArgs>>(name: Name, args: EventArgs[Name]): FunctionExt.AsyncBoolean;
    trigger<Name extends Events.NamesWithArrayArgs<EventArgs>>(name: Name, ...args: EventArgs[Name]): FunctionExt.AsyncBoolean;
    trigger<Name extends Events.OtherNames<EventArgs>>(name: Name, args?: EventArgs[Name]): FunctionExt.AsyncBoolean;
    trigger<Name extends Events.OtherNames<EventArgs>>(name: Name, ...args: EventArgs[Name]): FunctionExt.AsyncBoolean;
    trigger<Name extends Events.UnknownNames<EventArgs>>(name: Name, ...args: any[]): FunctionExt.AsyncBoolean;
    /**
     * Triggers event with specified event name. Unknown names
     * will cause a typescript type error.
     */
    protected emit<Name extends Events.OptionalNormalNames<EventArgs>>(name: Name): FunctionExt.AsyncBoolean;
    protected emit<Name extends Events.RequiredNormalNames<EventArgs>>(name: Name, args: EventArgs[Name]): FunctionExt.AsyncBoolean;
    protected emit<Name extends Events.NamesWithArrayArgs<EventArgs>>(name: Name, ...args: EventArgs[Name]): FunctionExt.AsyncBoolean;
    protected emit<Name extends Events.OtherNames<EventArgs>>(name: Name, args?: EventArgs[Name]): FunctionExt.AsyncBoolean;
    protected emit<Name extends Events.OtherNames<EventArgs>>(name: Name, ...args: EventArgs[Name]): FunctionExt.AsyncBoolean;
}
export declare namespace Events {
    type Handler<Args> = Args extends null | undefined ? () => any : Args extends any[] ? (...args: Args) => any : (args: Args) => any;
    type EventArgs = {
        [key: string]: any;
    };
    type EventNames<M extends EventArgs> = Extract<keyof M, string>;
    /**
     * Get union type of keys from `M` that value matching `any[]`.
     */
    type NamesWithArrayArgs<M extends EventArgs> = RequiredKeys<PickByValue<M, any[]>>;
    type NotArrayValueMap<M extends EventArgs> = OmitByValue<M, any[]>;
    type OptionalNormalNames<M extends EventArgs> = OptionalKeys<NotArrayValueMap<M>>;
    type RequiredNormalNames<M extends EventArgs> = RequiredKeys<NotArrayValueMap<M>>;
    type OtherNames<M extends EventArgs> = EventNames<PickByValue<M, undefined>>;
    type UnknownNames<M extends EventArgs> = Exclude<string, EventNames<M>>;
}
