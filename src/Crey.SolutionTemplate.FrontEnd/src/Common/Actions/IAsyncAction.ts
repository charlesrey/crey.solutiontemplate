import { ActionCreatorAsync } from "Common/Actions/ActionCreatorAsync";
import { IAction } from "Common/Actions/IAction";
import { Action } from "redux";

export interface IAsyncAction<T, R = {}> extends IAction<T> {
    Result?: R;
    Error?: Error;
    IsInProgress: boolean;
    Creator: ActionCreatorAsync<T, R>;
}

export const IsAsyncAction: (action: Action) => action is IAsyncAction<any, any> =
    (action: Action): action is IAsyncAction<any, any> => {
        const actionAsync = action as IAsyncAction<any, any>;
        return actionAsync !== undefined
            && (actionAsync.IsInProgress === true || actionAsync.IsInProgress === false);
    };
