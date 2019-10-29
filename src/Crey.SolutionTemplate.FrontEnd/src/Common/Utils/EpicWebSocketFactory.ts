import { ActionCreatorAsync, IAction, IAsyncAction } from "Common/Actions";
import { IGlobalState } from "Common/Models";
import { GetUserInfo } from "Components/Main/Actions";
import { Epic } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";

import { IEpicDependencies } from "./IEpicDependencies";

export const EpicWebSocketFactory: <A, R>(
    actionCreator: ActionCreatorAsync<A, R>,
    webSocketCall: (param: A, deps: IEpicDependencies, store: IGlobalState) => Observable<R>)
    => Epic<IAsyncAction<A, R>, IAsyncAction<A, R>, IGlobalState, IEpicDependencies> =
    (actionCreator, webSocketCall) => (action$, _store, deps) => action$
        .pipe(
            filter<IAction<any>, IAsyncAction<any, any>>(
                (action): action is IAsyncAction<any, any> => actionCreator.IsType(action)),
            filter((action) => action.IsInProgress),
            mergeMap((action) => from(webSocketCall(action.value, deps, _store.value)).pipe(
                map((r) => actionCreator.SetResult(action, r)),
                catchError((error) => {
                    const next = error.name === "401"
                        ? GetUserInfo.SetResult(GetUserInfo.Build(undefined), error)
                        : undefined;
                    return of(actionCreator.SetResult(action, error, next));
                }))));
