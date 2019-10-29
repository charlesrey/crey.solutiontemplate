import { ITranslation, Part } from "./ITranslation";

export interface ILogin extends ITranslation<Part.Login> {
    Part: Part.Login;
    Password: string;
    PasswordRequired: string;
    Connect: string;
    Connection: string;
    ResetPassword: string;
    ForgottenPassword: string;
    AskResetPassword: string;
    AskResetPasswordConfirmation: string;
    ConfirmPassword: string;
    PasswordTooShort: string;
    PasswordsDoesNotMatch: string;
    ResetPasswordConfirmation: string;
}
