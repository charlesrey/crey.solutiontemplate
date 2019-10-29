import { BaseEnvironment, IEnvironment } from "Environment/environment-common";

export const Environment: IEnvironment = {
    name: "Intégration",
    isProduction: true,
    backEndUrl: "",
    //clientId: "9e8a85a8-285f-453c-af98-aeb230addca9",
    ...BaseEnvironment,
};
