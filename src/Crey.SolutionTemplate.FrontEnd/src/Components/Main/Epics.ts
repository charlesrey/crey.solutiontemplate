import { IAction, IAsyncAction, IChainAction, IsAsyncAction, IsChainAction } from "Common/Actions";
import { TranslationApiService, UserApiService } from "Common/ApiService";
import { IGlobalState } from "Common/Models/IGlobalState";
import { GetTranslation } from "Common/Translations";
import { EpicApiFactory } from "Common/Utils/EpicApiFactory";
import { IEpicDependencies } from "Common/Utils/IEpicDependencies";
import { Epic } from "redux-observable";
import { delay, filter, map, tap } from "rxjs/operators";

import { CloseNotification, GetUserInfo, Logout, OpenNotification } from "./Actions";

export const NotificationEpic: Epic<IAction<any>, IAction<{}>, IGlobalState> =
    (action$) => action$.pipe(
        filter((action) => IsAsyncAction(action) ? action.Error !== undefined : OpenNotification.IsType(action)),
        delay(3000),
        map((_action: any) => CloseNotification.Build({})));

export const GetUserInfoEpic = EpicApiFactory(
    GetUserInfo,
    (_param, deps, store) => deps.ApiProvider(store, UserApiService).UserInfo());

export const ChainEpic: Epic<IAction<any>, IAction<any>, IGlobalState> =
    (action$) => action$.pipe(
        filter<IAction<any>, IAction<any> & IChainAction<any>>(
            (action): action is IAction<any> & IChainAction<any> => IsChainAction(action)),
        filter((action) => !IsAsyncAction(action) || !action.IsInProgress),
        map((action) => action.next));

export const GetTranslationEpic = EpicApiFactory(
    GetTranslation,
    (param, deps, store) => deps.ApiProvider(store, TranslationApiService).GetTranslation(param, store.Translations.Language));

export const LogoutEpic: Epic<IAction<any>, IAction<any>, IGlobalState, IEpicDependencies> =
    (action$, state, deps) => action$.pipe(
        filter<IAction<any>, IAsyncAction<any, any>>(
            (action): action is IAsyncAction<any, any> => Logout.IsType(action)),
        filter((action) => action.IsInProgress),
        tap((_) => deps.ApiProvider(state.value, UserApiService).Logout()),
        map((action) => Logout.SetResult(action, undefined)));
