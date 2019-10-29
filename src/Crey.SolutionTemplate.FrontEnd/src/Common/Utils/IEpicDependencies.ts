import * as Apis from "Common/ApiService";

import { IGlobalState } from "../Models";

export interface IEpicDependencies {
    ApiProvider: <TApiService extends Apis.BaseApiService>(store: IGlobalState, c: new(culture: string) => TApiService) => TApiService;
}
