import { IEntityWithId } from "./IEntityWithId";
import { Role } from "./Role";

export interface IUser extends IEntityWithId {
    DisplayName: string;
    Email: string;
    FirstName: string;
    LastName: string;
    Role: Role;
}
