import { ActionCreator, ActionCreatorAsync } from "Common/Actions";
import { IUser, NewEntityWithId } from "Common/Models";

import * as ActionsTypes from "./ActionTypes";

export const Open = new ActionCreator<IUser | undefined>(ActionsTypes.Open);
export const Close = new ActionCreator(ActionsTypes.Close);
export const Update = new ActionCreator<IUser>(ActionsTypes.Update);
export const Fetch = new ActionCreatorAsync<void, IUser[]>(ActionsTypes.Fetch);
export const Save = new ActionCreatorAsync<IUser | NewEntityWithId<IUser>, IUser>(ActionsTypes.Save);
export const Delete = new ActionCreatorAsync<string, void>(ActionsTypes.Delete);
