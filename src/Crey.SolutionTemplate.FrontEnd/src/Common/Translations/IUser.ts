import { ITranslation, Part } from "./ITranslation";

export interface IUser extends ITranslation<Part.User> {
    Part: Part.User;
    Add: string;
    Modify: string;
    Role: string;
    AdministratorRole: string;
    UserRole: string;
}
