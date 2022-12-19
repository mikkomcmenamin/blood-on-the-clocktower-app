import { TRPCError } from '../error/TRPCError';
import { AnyRootConfig } from './internals/config';
import { ParseFn } from './internals/getParseFn';
import { ProcedureBuilderMiddleware } from './internals/procedureBuilder';
import { MiddlewareMarker } from './internals/utils';
import { ProcedureParams } from './procedure';
import { ProcedureType } from './types';
/**
 * @internal
 */
interface MiddlewareResultBase {
    /**
     * All middlewares should pass through their `next()`'s output.
     * Requiring this marker makes sure that can't be forgotten at compile-time.
     */
    readonly marker: MiddlewareMarker;
}
/**
 * @internal
 */
interface MiddlewareOKResult<_TParams extends ProcedureParams> extends MiddlewareResultBase {
    ok: true;
    data: unknown;
}
/**
 * @internal
 */
interface MiddlewareErrorResult<_TParams extends ProcedureParams> extends MiddlewareResultBase {
    ok: false;
    error: TRPCError;
}
/**
 * @internal
 */
export declare type MiddlewareResult<TParams extends ProcedureParams> = MiddlewareOKResult<TParams> | MiddlewareErrorResult<TParams>;
/**
 * @internal
 */
export declare type MiddlewareFunction<TParams extends ProcedureParams, TParamsAfter extends ProcedureParams> = {
    (opts: {
        ctx: TParams['_ctx_out'];
        type: ProcedureType;
        path: string;
        input: TParams['_input_out'];
        rawInput: unknown;
        meta: TParams['_meta'] | undefined;
        next: {
            (): Promise<MiddlewareResult<TParams>>;
            <$Context>(opts: {
                ctx: $Context;
            }): Promise<MiddlewareResult<{
                _config: TParams['_config'];
                _ctx_out: $Context;
                _input_in: TParams['_input_in'];
                _input_out: TParams['_input_out'];
                _output_in: TParams['_output_in'];
                _output_out: TParams['_output_out'];
                _meta: TParams['_meta'];
            }>>;
        };
    }): Promise<MiddlewareResult<TParamsAfter>>;
    _type?: string | undefined;
};
/**
 * @internal
 */
export declare function createMiddlewareFactory<TConfig extends AnyRootConfig>(): <TNewParams extends ProcedureParams<AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: MiddlewareFunction<{
    _config: TConfig;
    _ctx_out: TConfig['$types']['ctx'];
    _input_out: unknown;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: TConfig['$types']['meta'];
}, TNewParams>) => MiddlewareFunction<{
    _config: TConfig;
    _ctx_out: TConfig['$types']['ctx'];
    _input_out: unknown;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: TConfig['$types']['meta'];
}, TNewParams>;
/**
 * @internal
 * Please note, `trpc-openapi` uses this function.
 */
export declare function createInputMiddleware<TInput>(parse: ParseFn<TInput>): ProcedureBuilderMiddleware;
/**
 * @internal
 */
export declare function createOutputMiddleware<TOutput>(parse: ParseFn<TOutput>): ProcedureBuilderMiddleware;
export {};
//# sourceMappingURL=middleware.d.ts.map