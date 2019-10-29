import { ITranslationState } from "Common/Translations";
import { ILoginState } from "Components/Login";
import { ICommonState } from "Components/Main";
import { UserState } from "Components/User";

export interface IGlobalState {
    Common: ICommonState;
    Login: ILoginState;
    Translations: ITranslationState;
    Users: UserState;
}
