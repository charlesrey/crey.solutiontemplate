import { ActionCreator, ActionCreatorAsync } from "Common/Actions";

import * as ActionTypes from "./ActionTypes";
import { ILoginState } from "./Models";

export const ChangeUsername = new ActionCreator<string>(ActionTypes.ChangeUsername);
export const ChangePassword = new ActionCreator<string>(ActionTypes.ChangePassword);
export const ChangeConfirmPassword = new ActionCreator<string>(ActionTypes.ChangeConfirmPassword);
export const Login = new ActionCreatorAsync<ILoginState>(ActionTypes.Login);
export const AskResetPassword = new ActionCreatorAsync<string, void>(ActionTypes.AskResetPassword);
export const ResetPassword = new ActionCreatorAsync<{ Mail: string, Token: string }, void>(ActionTypes.ResetPassword);
