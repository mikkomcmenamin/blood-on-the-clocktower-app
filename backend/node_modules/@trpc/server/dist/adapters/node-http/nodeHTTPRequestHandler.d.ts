import { AnyRouter } from '../../core';
import { NodeHTTPHandlerOptions, NodeHTTPRequest, NodeHTTPResponse } from './types';
declare type NodeHTTPRequestHandlerOptions<TRouter extends AnyRouter, TRequest extends NodeHTTPRequest, TResponse extends NodeHTTPResponse> = {
    req: TRequest;
    res: TResponse;
    path: string;
} & NodeHTTPHandlerOptions<TRouter, TRequest, TResponse>;
export declare function nodeHTTPRequestHandler<TRouter extends AnyRouter, TRequest extends NodeHTTPRequest, TResponse extends NodeHTTPResponse>(opts: NodeHTTPRequestHandlerOptions<TRouter, TRequest, TResponse>): Promise<void>;
export {};
//# sourceMappingURL=nodeHTTPRequestHandler.d.ts.map