import { combineEpics } from "redux-observable";

import { DeleteEpic, GetEpic, SaveEpic } from "./Epics";

export { Main as UserMain } from "./Components/Main";
export { UserState } from "./Models";
export { UserReducer } from "./Reducer";

export const UserEpics = combineEpics(DeleteEpic, GetEpic, SaveEpic);
