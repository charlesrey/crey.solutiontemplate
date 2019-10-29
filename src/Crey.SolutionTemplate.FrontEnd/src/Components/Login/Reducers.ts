import { Action, Reducer } from "redux";

import * as Actions from "./Actions";
import { ILoginState } from "./Models";

const initialState: ILoginState = {
    Password: "",
    Username: "",
};

export const LoginReducer: Reducer<ILoginState> =
    (state: ILoginState = initialState, action: Action) => {
        if (Actions.ChangeUsername.IsType(action)) {
            return { ...state, Username: action.value };
        } else if (Actions.ChangePassword.IsType(action)) {
            const passwordError: "required" | "length" | undefined = action.value
                ? action.value.length > 7
                    ? undefined
                    : "length"
                : "required";
            const confirmPasswordError: "notmatch" | undefined = action.value === state.ConfirmPassword
                ? undefined
                : "notmatch";
            return {
                ...state,
                Password: action.value,
                ValidationErrors: passwordError !== undefined || confirmPasswordError !== undefined
                    ? {
                        ConfirmPassword: confirmPasswordError,
                        Password: passwordError,
                    }
                    : undefined,
            };
        } else if (Actions.ChangeConfirmPassword.IsType(action)) {
            const confirmPasswordError: "notmatch" | undefined = action.value === state.Password
                ? undefined
                : "notmatch";
            return {
                ...state,
                ConfirmPassword: action.value,
                ValidationErrors: (state.ValidationErrors && state.ValidationErrors.Password) || confirmPasswordError
                    ? confirmPasswordError
                        ? { ...state.ValidationErrors, ConfirmPassword: confirmPasswordError}
                        : state.ValidationErrors
                    : undefined,
            };
        } else if (Actions.Login.IsType(action) && !action.IsInProgress) {
            return { ...state, Password: initialState.Password };
        } else {
            return state;
        }
    };
