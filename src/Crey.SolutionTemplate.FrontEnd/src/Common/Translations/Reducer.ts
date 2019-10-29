import { Map } from "immutable";
import { Action, Reducer } from "redux";

import * as Actions from "./Actions";
import { Global } from "./Global";
import { Language } from "./ITranslationTransfer";

export interface ITranslationState {
    Translations: Map<Language, Global>;
    Current: Global;
    Language: Language;
}

const initialGlobal: Global = {};

const initialState: ITranslationState = {
    Current: initialGlobal,
    Language: "fr-CH",
    Translations: Map<Language, Global>([
        ["de-CH", initialGlobal],
        ["fr-CH", initialGlobal],
    ]),
};

export const TranslationReducer: Reducer<ITranslationState> =
    (state: ITranslationState | undefined = initialState, action: Action) => {
        if (Actions.GetTranslation.IsType(action) && !action.IsInProgress && action.Result) {
            const newTranslations = state.Translations.set(
                action.Result.Lang,
                { ...state.Translations.get(action.Result.Lang), [action.Result.Translation.Part]: action.Result.Translation });
            const newTranslation = newTranslations.get(state.Language);
            return {
                ...state,
                Current: (state.Language === action.Result.Lang && newTranslation ? newTranslation : state.Current),
                Translations: newTranslations,
            };
        }
        else if (Actions.ChangeLanguage.IsType(action) && action.value !== state.Language) {
            const newTranslation = state.Translations.get(action.value);
            return { ...state, Language: action.value, Current: newTranslation ? newTranslation : state.Current };
        }
        else {
            return state;
        }
    };
