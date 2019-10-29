import { BaseEnvironment, IEnvironment } from "Environment/environment-common";

export const Environment: IEnvironment = {
    backEndUrl: "localhost:5001",
    isProduction: false,
    name: "Développement",
    //clientId: "0d5b13d1-b131-4544-8e1c-1622dcd9d7d9",
    ...BaseEnvironment,
};
