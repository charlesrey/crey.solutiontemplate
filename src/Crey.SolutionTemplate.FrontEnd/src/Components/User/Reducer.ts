import { IUser, Role, ToMap } from "Common/Models";
import { Map } from "immutable";
import { Action, Reducer } from "redux";

import * as Actions from "./Actions";
import { UserState } from "./Models";

const initialListState: UserState = {
    Users: Map<string, IUser>(),
};

export const UserReducer: Reducer<UserState> =
    (state: UserState = initialListState, action: Action) => {
        if (Actions.Fetch.IsType(action) && !action.IsInProgress && action.Result) {
            return {
                ...state,
                Users: ToMap(action.Result),
            };
        }
        else if (Actions.Save.IsType(action) && !action.IsInProgress && action.Result) {
            return {
                ...state,
                OpenedUser: action.Result,
                Users: state.Users.set(action.Result.Id ? action.Result.Id : "", action.Result),
            };
        }
        else if (Actions.Open.IsType(action)) {
            return {
                ...state,
                OpenedUser: action.value
                    ? action.value
                    : {
                        DisplayName: "",
                        Email: "",
                        FirstName: "",
                        Id: undefined,
                        LastName: "",
                        Role: Role.User,
                    },
            };
        }
        else if (Actions.Close.IsType(action)) {
            return { ...state, OpenedUser: undefined };
        }
        else if (Actions.Update.IsType(action)) {
            const firstNameError: "Required" | undefined = action.value.FirstName ? undefined : "Required";
            const lastNameError: "Required" | undefined = action.value.LastName ? undefined : "Required";
            const mailError: "Required" | "Exists" | undefined = action.value.Email
                ? state.Users.find((value, _key) => value.Id !== undefined && value.Email === action.value.Email)
                    ? "Exists"
                    : undefined
                : "Required";
            return {
                ...state,
                OpenedUser: action.value,
                UserFormValidation: firstNameError || lastNameError || mailError
                    ? {
                        EmailValidationError: mailError,
                        FirstNameValidationError: firstNameError,
                        LastNameValidationError: lastNameError,
                    }
                    : undefined,
            };
        }
        else if (Actions.Delete.IsType(action) && !action.IsInProgress && action.Error === undefined) {
            return {
                ...state,
                Users: state.Users.remove(action.value),
            };
        }
        else {
            return state;
        }
    };
