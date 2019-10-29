export interface ILoginState {
    ConfirmPassword?: string;
    Password: string;
    Username: string;
    ValidationErrors?: {
        Password?: "length" | "required",
        ConfirmPassword?: "notmatch",
    };
}
