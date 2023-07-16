import { Background } from './index';
export interface WatermarkOptions extends Background.CommonOptions {
    angle?: number;
}
export declare const watermark: Background.Definition<WatermarkOptions>;
