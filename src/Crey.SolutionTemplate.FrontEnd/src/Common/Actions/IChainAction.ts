import { IAction } from "Common/Actions/IAction";
import { Action } from "redux";

export interface IChainAction<T> extends Action {
    next: IAction<T>;
}

export const IsChainAction =
    (action: Action): action is IChainAction<any> => (action as IChainAction<any>).next !== undefined;
