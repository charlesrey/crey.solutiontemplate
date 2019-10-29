import { BaseEnvironment, IEnvironment } from "Environment/environment-common";

export const Environment: IEnvironment = {
    name: "Production",
    isProduction: true,
    backEndUrl: "",
    //clientId: "b6200057-60ca-4cfb-904d-f04ae4054f77",
    ...BaseEnvironment,
};
