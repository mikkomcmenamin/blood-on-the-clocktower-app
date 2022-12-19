import { TRPC_ERROR_CODE_KEY } from '../rpc/codes';
export declare class TRPCError extends Error {
    readonly cause?: Error | undefined;
    readonly code: "INTERNAL_SERVER_ERROR" | "PARSE_ERROR" | "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
    constructor(opts: {
        message?: string;
        code: TRPC_ERROR_CODE_KEY;
        cause?: unknown;
    });
}
//# sourceMappingURL=TRPCError.d.ts.map