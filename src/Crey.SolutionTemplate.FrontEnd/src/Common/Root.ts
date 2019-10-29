import { LoginEpics, LoginReducer } from "Components/Login";
import { MainEpics, MainReducer } from "Components/Main";
import { UserEpics, UserReducer } from "Components/User";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

import { IGlobalState } from "./Models";
import { TranslationReducer } from "./Translations";

export const RootReducer = combineReducers<IGlobalState>({
    Common: MainReducer,
    Login: LoginReducer,
    Translations: TranslationReducer,
    Users: UserReducer,
});

export const RootEpic = combineEpics(
    LoginEpics,
    MainEpics,
    UserEpics,
);
