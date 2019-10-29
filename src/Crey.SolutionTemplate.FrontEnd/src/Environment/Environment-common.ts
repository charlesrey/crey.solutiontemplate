export interface IBaseEnvironment {
    //tenantId: string;
    //redirectUri: string;
    //postLogoutRedirectUri: string;
}

export interface IEnvironment extends IBaseEnvironment {
    name: string;
    isProduction: boolean;
    //clientId: string;
    backEndUrl: string;
}

export const BaseEnvironment: IBaseEnvironment = {
    //postLogoutRedirectUri: window.location.origin,
    //redirectUri: window.location.origin,
    //tenantId: "38d9b3f4-6481-4de8-9988-9e284f15e845",
};
