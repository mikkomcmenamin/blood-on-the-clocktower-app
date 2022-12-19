/**
 * @public
 */
export declare type DataTransformer = {
    serialize(object: any): any;
    deserialize(object: any): any;
};
/**
 * @public
 */
export declare type CombinedDataTransformer = {
    input: DataTransformer;
    output: DataTransformer;
};
/**
 * @public
 */
export declare type CombinedDataTransformerClient = {
    input: Pick<DataTransformer, 'serialize'>;
    output: Pick<DataTransformer, 'deserialize'>;
};
/**
 * @public
 */
export declare type DataTransformerOptions = DataTransformer | CombinedDataTransformer;
/**
 * @public
 */
export declare type ClientDataTransformerOptions = DataTransformer | CombinedDataTransformerClient;
/**
 * @internal
 */
export declare function getDataTransformer(transformer: DataTransformerOptions): CombinedDataTransformer;
/**
 * @internal
 */
export declare type DefaultDataTransformer = CombinedDataTransformer & {
    _default: true;
};
/**
 * @internal
 */
export declare const defaultTransformer: DefaultDataTransformer;
//# sourceMappingURL=transformer.d.ts.map