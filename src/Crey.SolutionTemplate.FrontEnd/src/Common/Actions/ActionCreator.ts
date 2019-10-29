import { IAction } from "Common/Actions/IAction";
import { IChainAction } from "Common/Actions/IChainAction";
import { Action } from "redux";

export class ActionCreator<T = {}> {
    constructor(protected type: string) {

    }

    public Build<N>(value: T, next?: IAction<N>): IAction<T> | (IChainAction<N> & IAction<T>) {
        return { type: this.type, value, next };
    }

    public IsType(action: Action): action is IAction<T> {
        return action.type === this.type;
    }
}
