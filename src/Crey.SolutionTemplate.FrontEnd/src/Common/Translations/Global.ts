import { ICommon } from "./ICommon";
import { ILogin } from "./ILogin";
import { IsTranslation, ITranslation, Part, PartType } from "./ITranslation";
import { IUser } from "./IUser";

export type Global =
    PartType<Part.User, IUser>
    & PartType<Part.Common, ICommon>
    & PartType<Part.Login, ILogin>;

export const GetFromPart = <P extends Part, T extends ITranslation<P>>(global: Global, part: P): T | undefined => {
    const tempPart = global[part];
    if (tempPart !== undefined && IsTranslation<P, T>(part, tempPart)) {
        return tempPart;
    }
    else {
        return undefined;
    }
};
