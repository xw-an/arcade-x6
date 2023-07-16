import { Attributes } from '../dom/attr';
export interface Annotation {
    start: number;
    end: number;
    attrs: Attributes;
}
export interface AnnotatedItem {
    t: string;
    attrs: Attributes;
    annotations?: number[];
}
export declare function annotate(t: string, annotations: Annotation[], opt?: {
    offset?: number;
    includeAnnotationIndices?: boolean;
}): (string | AnnotatedItem)[];
export declare function findAnnotationsAtIndex(annotations: Annotation[], index: number): Annotation[];
export declare function findAnnotationsBetweenIndexes(annotations: Annotation[], start: number, end: number): Annotation[];
export declare function shiftAnnotations(annotations: Annotation[], index: number, offset: number): Annotation[];
