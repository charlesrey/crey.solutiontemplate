import { UserApiService } from "Common/ApiService";
import { EpicApiFactory } from "Common/Utils/EpicApiFactory";

import * as Actions from "./Actions";

export const LoginEpic = EpicApiFactory(
    Actions.Login,
    (credentials, deps, store) => deps.ApiProvider(store, UserApiService).AuthenticateAsync(credentials));

export const AskResetPasswordEpic = EpicApiFactory(
    Actions.AskResetPassword,
    (mail, deps, store) => deps.ApiProvider(store, UserApiService).AskResetPassword(mail));

export const ResetPasswordEpic = EpicApiFactory(
    Actions.ResetPassword,
    (resetRequest, deps, store) => deps.ApiProvider(store, UserApiService).ResetPassword(resetRequest.Mail, resetRequest.Token));
