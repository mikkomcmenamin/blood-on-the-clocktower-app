import { mergeRoutersGeneric } from './internals/__generated__/mergeRoutersGeneric';
import { DefaultErrorShape, ErrorFormatter, ErrorFormatterShape } from '../error/formatter';
import { CombinedDataTransformer, DataTransformerOptions, DefaultDataTransformer } from '../transformer';
import { FlatOverwrite } from '../types';
import { CreateRootConfigTypes, RootConfig, RootConfigTypes, RuntimeConfig } from './internals/config';
import { PickFirstDefined, ValidateShape } from './internals/utils';
declare type PartialRootConfigTypes = Partial<RootConfigTypes>;
declare type CreateRootConfigTypesFromPartial<TTypes extends PartialRootConfigTypes> = CreateRootConfigTypes<{
    ctx: TTypes['ctx'] extends RootConfigTypes['ctx'] ? TTypes['ctx'] : {};
    meta: TTypes['meta'] extends RootConfigTypes['meta'] ? TTypes['meta'] : {};
    errorShape: TTypes['errorShape'];
    transformer: DataTransformerOptions;
}>;
/**
 * TODO: This can be improved:
 * - We should be able to chain `.meta()`/`.context()` only once
 * - Simplify typings
 * - Doesn't need to be a class but it doesn't really hurt either
 */
declare class TRPCBuilder<TParams extends PartialRootConfigTypes = {}> {
    context<TNewContext extends RootConfigTypes['ctx']>(): TRPCBuilder<FlatOverwrite<TParams, {
        ctx: TNewContext;
    }>>;
    meta<TNewMeta extends RootConfigTypes['meta']>(): TRPCBuilder<FlatOverwrite<TParams, {
        meta: TNewMeta;
    }>>;
    create<TOptions extends Partial<RuntimeConfig<CreateRootConfigTypesFromPartial<TParams>>>>(options?: ValidateShape<TOptions, Partial<RuntimeConfig<CreateRootConfigTypesFromPartial<TParams>>>> | undefined): {
        /**
         * These are just types, they can't be used
         * @internal
         */
        _config: RootConfig<{
            ctx: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
            meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {}, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] extends DataTransformerOptions ? CombinedDataTransformer : DefaultDataTransformer : DefaultDataTransformer;
        }>;
        /**
         * Builder object for creating procedures
         */
        procedure: import("./internals/procedureBuilder").ProcedureBuilder<{
            _config: RootConfig<{
                ctx: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
                meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
                errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {}, DefaultErrorShape>>>;
                transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] extends DataTransformerOptions ? CombinedDataTransformer : DefaultDataTransformer : DefaultDataTransformer;
            }>;
            _ctx_out: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
            _input_in: typeof import("./internals/utils").unsetMarker;
            _input_out: typeof import("./internals/utils").unsetMarker;
            _output_in: typeof import("./internals/utils").unsetMarker;
            _output_out: typeof import("./internals/utils").unsetMarker;
            _meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
        }>;
        /**
         * Create reusable middlewares
         */
        middleware: <TNewParams extends import("./procedure").ProcedureParams<import("./internals/config").AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: import("./middleware").MiddlewareFunction<{
            _config: RootConfig<{
                ctx: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
                meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
                errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {}, DefaultErrorShape>>>;
                transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] extends DataTransformerOptions ? CombinedDataTransformer : DefaultDataTransformer : DefaultDataTransformer;
            }>;
            _ctx_out: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
            _input_out: unknown;
            _input_in: unknown;
            _output_in: unknown;
            _output_out: unknown;
            _meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
        }, TNewParams>) => import("./middleware").MiddlewareFunction<{
            _config: RootConfig<{
                ctx: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
                meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
                errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {}, DefaultErrorShape>>>;
                transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] extends DataTransformerOptions ? CombinedDataTransformer : DefaultDataTransformer : DefaultDataTransformer;
            }>;
            _ctx_out: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
            _input_out: unknown;
            _input_in: unknown;
            _output_in: unknown;
            _output_out: unknown;
            _meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
        }, TNewParams>;
        /**
         * Create a router
         */
        router: <TProcRouterRecord extends import("./router").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("./router").CreateRouterInner<RootConfig<{
            ctx: TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {};
            meta: TParams["meta"] extends Record<string, unknown> ? TParams["meta"] : {};
            errorShape: ErrorFormatterShape<PickFirstDefined<TOptions["errorFormatter"], ErrorFormatter<TParams["ctx"] extends Record<string, unknown> ? TParams["ctx"] : {}, DefaultErrorShape>>>;
            transformer: TOptions["transformer"] extends DataTransformerOptions ? TOptions["transformer"] extends DataTransformerOptions ? CombinedDataTransformer : DefaultDataTransformer : DefaultDataTransformer;
        }>, TProcRouterRecord>;
        /**
         * Merge Routers
         */
        mergeRouters: typeof mergeRoutersGeneric;
    };
}
/**
 * Initialize tRPC - be done exactly once per backend
 */
export declare const initTRPC: TRPCBuilder<{}>;
export {};
//# sourceMappingURL=initTRPC.d.ts.map