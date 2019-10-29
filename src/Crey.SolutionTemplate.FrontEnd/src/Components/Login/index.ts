import { combineEpics } from "redux-observable";

import { AskResetPasswordEpic, LoginEpic, ResetPasswordEpic } from "./Epics";

export { Login } from "./Components/Login";
export { AskResetPassword } from "./Components/AskResetPassword";
export { ResetPassword } from "./Components/ResetPassword";
export { ILoginState } from "./Models";
export { LoginReducer } from "./Reducers";

export const LoginEpics = combineEpics(AskResetPasswordEpic, LoginEpic, ResetPasswordEpic);
