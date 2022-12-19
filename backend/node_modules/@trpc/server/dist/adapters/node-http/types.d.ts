/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { AnyRouter, inferRouterContext } from '../../core';
import { HTTPBaseHandlerOptions } from '../../http/internals/types';
import { MaybePromise } from '../../types';
interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}
export declare type NodeHTTPRequest = IncomingMessage & {
    query?: ParsedQs;
    body?: unknown;
};
export declare type NodeHTTPResponse = ServerResponse;
export declare type NodeHTTPCreateContextOption<TRouter extends AnyRouter, TRequest, TResponse> = {} extends inferRouterContext<TRouter> ? {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext?: NodeHTTPCreateContextFn<TRouter, TRequest, TResponse>;
} : {
    /**
     * @link https://trpc.io/docs/context
     **/
    createContext: NodeHTTPCreateContextFn<TRouter, TRequest, TResponse>;
};
export declare type NodeHTTPHandlerOptions<TRouter extends AnyRouter, TRequest extends NodeHTTPRequest, TResponse extends NodeHTTPResponse> = HTTPBaseHandlerOptions<TRouter, TRequest> & {
    maxBodySize?: number;
} & NodeHTTPCreateContextOption<TRouter, TRequest, TResponse>;
export declare type NodeHTTPCreateContextFnOptions<TRequest, TResponse> = {
    req: TRequest;
    res: TResponse;
};
export declare type NodeHTTPCreateContextFn<TRouter extends AnyRouter, TRequest, TResponse> = (opts: NodeHTTPCreateContextFnOptions<TRequest, TResponse>) => MaybePromise<inferRouterContext<TRouter>>;
export {};
//# sourceMappingURL=types.d.ts.map