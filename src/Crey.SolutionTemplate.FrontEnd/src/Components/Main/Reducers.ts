import { IsAsyncAction } from "Common/Actions";
import { Action, Reducer } from "redux";

import * as Actions from "./Actions";
import { ICommonState } from "./Models";

const initialState: ICommonState = {
    ConnectedUser: undefined,
    IsLoading: false,
    IsMenuCollapsed: false,
    Language: navigator.language,
};

export const MainReducer: Reducer<ICommonState> = (state: ICommonState = initialState, action: Action) => {

    if (Actions.ToggleMenuCollapsed.IsType(action)) {
        return { ...state, IsMenuCollapsed: !state.IsMenuCollapsed };
    }
    else if (Actions.CloseNotification.IsType(action)) {
        return { ...state, Notification: undefined };
    }
    else if (Actions.OpenNotification.IsType(action)) {
        return { ...state, Notification: action.value };
    }
    else if (Actions.GetUserInfo.IsType(action) && !action.IsInProgress) {
        return {
            ...state,
            ConnectedUser: action.Result,
            IsLoading: false,
        };
    }
    else if (Actions.Logout.IsType(action) && !action.IsInProgress) {
        return {
            ...state,
            ConnectedUser: undefined,
            IsLoading: false,
        };
    }
    else if (Actions.Navigate.IsType(action))
    {
        return {
            ...state,
            Navigate: action.value,
        };
    }
    else if (IsAsyncAction(action)) {
        if (action.Error) {
            return {
                ...state,
                IsLoading: action.IsInProgress,
                Notification: {
                    Message: action.Error.message,
                    Type: "error" as ("info" | "success" | "warning" | "error"),
                },
            };
        }
        else if (action.IsInProgress !== state.IsLoading) {
            return { ...state, IsLoading: action.IsInProgress };
        }
        else {
            return state;
        }
    }
    else {
        return state;
    }
};
