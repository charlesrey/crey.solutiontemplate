import { UserApiService } from "Common/ApiService";
import { EpicApiFactory } from "Common/Utils/EpicApiFactory";

import { Delete, Fetch, Save } from "./Actions";

export const GetEpic = EpicApiFactory(
    Fetch,
    (_param, deps, store) => deps.ApiProvider(store, UserApiService).Get());

export const SaveEpic = EpicApiFactory(
    Save,
    (param, deps, store) => deps.ApiProvider(store, UserApiService).Save(param));

export const DeleteEpic = EpicApiFactory(
    Delete,
    (param, deps, store) => deps.ApiProvider(store, UserApiService).Delete(param));
