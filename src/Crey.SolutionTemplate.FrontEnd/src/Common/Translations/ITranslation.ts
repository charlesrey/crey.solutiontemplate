export enum Part {
    User = "User",
    Common = "Common",
    Login = "Login",
}

/* tslint:disable:no-empty-interface */
export interface ITranslation<P extends Part> {
    Part: P;
}
/* tslint:enable:no-empty-interface */

export type PartType<P extends Part, T extends ITranslation<P>> = { [k in P]?: T };

export const IsTranslation =
    <P extends Part, T extends ITranslation<P>>(part: P, translation: ITranslation<any> | undefined): translation is T | undefined => {
        return translation === undefined || translation.Part === part;
    };
