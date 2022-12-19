import { Observable } from '../../observable';
import { AnyRouter, ProcedureType } from '../router';
/**
 * @deprecated
 */
export declare function callProcedure<TRouter extends AnyRouter<TContext>, TContext extends Record<string, any>>(opts: {
    path: string;
    input: unknown;
    router: TRouter;
    ctx: TContext;
    type: ProcedureType;
}): Promise<unknown | Observable<TRouter, any>>;
//# sourceMappingURL=callProcedure.d.ts.map