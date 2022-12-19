import { AnyRouter, inferRouterContext } from '../core';
import { TRPCError } from '../error/TRPCError';
import { Maybe } from '../types';
import { HTTPBaseHandlerOptions, HTTPRequest, HTTPResponse } from './internals/types';
interface ResolveHTTPRequestOptions<TRouter extends AnyRouter, TRequest extends HTTPRequest> extends HTTPBaseHandlerOptions<TRouter, TRequest> {
    createContext: () => Promise<inferRouterContext<TRouter>>;
    req: TRequest;
    path: string;
    error?: Maybe<TRPCError>;
}
export declare function resolveHTTPResponse<TRouter extends AnyRouter, TRequest extends HTTPRequest>(opts: ResolveHTTPRequestOptions<TRouter, TRequest>): Promise<HTTPResponse>;
export {};
//# sourceMappingURL=resolveHTTPResponse.d.ts.map