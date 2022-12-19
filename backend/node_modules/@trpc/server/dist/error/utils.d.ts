import { TRPCError } from './TRPCError';
export declare function getMessageFromUnknownError(err: unknown, fallback: string): string;
export declare function getErrorFromUnknown(cause: unknown): Error;
export declare function getTRPCErrorFromUnknown(cause: unknown): TRPCError;
export declare function getCauseFromUnknown(cause: unknown): Error | undefined;
//# sourceMappingURL=utils.d.ts.map