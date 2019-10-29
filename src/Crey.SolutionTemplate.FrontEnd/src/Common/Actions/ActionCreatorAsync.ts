import { ActionCreator } from "Common/Actions/ActionCreator";
import { IAction } from "Common/Actions/IAction";
import { IAsyncAction, IsAsyncAction } from "Common/Actions/IAsyncAction";
import { IChainAction } from "Common/Actions/IChainAction";
import { Action } from "redux";
import { isError } from "util";

export class ActionCreatorAsync<T = {}, R = {}> extends ActionCreator<T> {
    constructor(type: string) {
        super(type);
    }

    public Build<N>(value: T, next?: IAction<N>): IAsyncAction<T, R> | (IChainAction<N> & IAsyncAction<T, R>) {
        return { ...super.Build(value, next), IsInProgress: true, Creator: this };
    }

    public IsType(action: Action): action is IAsyncAction<T, R> {
        return super.IsType(action) && IsAsyncAction(action);
    }

    public SetResult(action: IAsyncAction<T, R>, value: Error | R, next?: IAction<any>)
        : IAsyncAction<T, R> | (IChainAction<any> & IAsyncAction<T, R>) {
        if (isError(value)) {
            return { ...action, Error: value, IsInProgress: false, next };
        }
        else {
            return { ...action, Result: value, IsInProgress: false };
        }
    }
}
