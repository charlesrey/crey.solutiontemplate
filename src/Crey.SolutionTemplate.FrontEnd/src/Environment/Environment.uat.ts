import { BaseEnvironment, IEnvironment } from "Environment/environment-common";

export const Environment: IEnvironment = {
    name: "UAT",
    isProduction: true,
    backEndUrl: "",
    //clientId: "b294ddb7-284c-4362-8b3b-90b679279ec0",
    ...BaseEnvironment,
};
