import { ActionCreator, ActionCreatorAsync, IAsyncAction } from "Common/Actions";
import { Action } from "redux";

import * as ActionTypes from "./ActionTypes";
import { ITranslation, Part } from "./ITranslation";
import { ITranslationTransfer, Language } from "./ITranslationTransfer";

export const GetTranslation =
    new ActionCreatorAsync<Part, ITranslationTransfer<Part, ITranslation<any>>>(ActionTypes.GetTranslation);

export const IsTranslationAction = (action: Action):
    action is IAsyncAction<{ Name: Part, Lang: Language }, ITranslationTransfer<Part, ITranslation<any>>> =>
    (action.type as string).startsWith(ActionTypes.GetTranslation);

export const ChangeLanguage = new ActionCreator<Language>(ActionTypes.ChangeLanguage);
