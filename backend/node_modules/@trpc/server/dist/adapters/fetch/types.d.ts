import { AnyRouter, inferRouterContext } from '../../core';
import { HTTPBaseHandlerOptions } from '../../http/internals/types';
export declare type FetchCreateContextFnOptions = {
    req: Request;
};
export declare type FetchCreateContextFn<TRouter extends AnyRouter> = (opts: {
    req: Request;
}) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;
export declare type FetchCreateContextOption<TRouter extends AnyRouter> = unknown extends inferRouterContext<TRouter> ? {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext?: FetchCreateContextFn<TRouter>;
} : {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext: FetchCreateContextFn<TRouter>;
};
export declare type FetchHandlerOptions<TRouter extends AnyRouter> = HTTPBaseHandlerOptions<TRouter, Request> & FetchCreateContextOption<TRouter>;
//# sourceMappingURL=types.d.ts.map