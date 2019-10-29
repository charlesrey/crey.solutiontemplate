import { combineEpics } from "redux-observable";

import { ChainEpic, GetTranslationEpic, GetUserInfoEpic, LogoutEpic, NotificationEpic } from "./Epics";

export { GetUserInfo, Navigate, OpenNotification } from "./Actions";
export { Main } from "./Components/Main";
export { ICommonState } from "./Models";
export { MainReducer } from "./Reducers";

export const MainEpics = combineEpics(NotificationEpic, ChainEpic, GetUserInfoEpic, GetTranslationEpic, LogoutEpic);
