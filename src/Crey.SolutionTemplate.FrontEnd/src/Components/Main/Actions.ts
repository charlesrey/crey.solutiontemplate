import { ActionCreator, ActionCreatorAsync } from "Common/Actions";
import { IUser } from "Common/Models";

import * as ActionTypes from "./ActionTypes";

export const ToggleMenuCollapsed = new ActionCreator(ActionTypes.ToggleMenuCollapsed);

export const OpenNotification =
    new ActionCreator<{ Message: string; Type: "info" | "success" | "warning" | "error"; }>(ActionTypes.OpenNotification);

export const CloseNotification = new ActionCreator(ActionTypes.CloseNotification);

export const GetUserInfo = new ActionCreatorAsync<void, IUser>(ActionTypes.GetUserInfo);

export const Logout = new ActionCreatorAsync<void, void>(ActionTypes.Logout);

export const Navigate = new ActionCreator<string | undefined>(ActionTypes.Navigate);
