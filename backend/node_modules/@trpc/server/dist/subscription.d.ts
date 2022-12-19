import { Observable, Observer } from './observable';
export declare function subscriptionPullFactory<TOutput>(opts: {
    /**
     * The interval of how often the function should run
     */
    intervalMs: number;
    pull(emit: Observer<TOutput, unknown>): void | Promise<void>;
}): Observable<TOutput, unknown>;
//# sourceMappingURL=subscription.d.ts.map