import { IUser, NewEntityWithId } from "Common/Models";
import { Map } from "immutable";

export type UserState = IUserListState & IUserDetailState;

export interface IUserListState {
    Users: Map<string, IUser>;
}

export interface IUserDetailState {
    OpenedUser?: IUser | NewEntityWithId<IUser>;
    UserFormValidation?: {
        FirstNameValidationError?: "Required";
        LastNameValidationError?: "Required";
        EmailValidationError?: "Required" | "Exists";
    }
}
