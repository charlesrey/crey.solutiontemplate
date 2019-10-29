import { IUser } from "Common/Models";

export interface ICommonState {
    ConnectedUser?: IUser;
    IsMenuCollapsed: boolean;
    IsLoading: boolean;
    Navigate?: string;
    Notification?: {
        Message: string;
        Type: "info" | "success" | "warning" | "error";
    };
    Language: string;
}
