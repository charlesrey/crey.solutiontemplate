import "antd/lib/locale-provider/style";

import { ConfigProvider } from "antd";
import frFR from "antd/lib/locale-provider/fr_FR";
import { IAction } from "Common/Actions";
import * as Apis from "Common/ApiService";
import { IGlobalState } from "Common/Models";
import { RootEpic, RootReducer } from "Common/Root";
import { IEpicDependencies } from "Common/Utils/IEpicDependencies";
import { Main } from "Components/Main";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";

const epicMiddleware = createEpicMiddleware<IAction<any>, IAction<any>, IGlobalState, IEpicDependencies>(
    {
        dependencies: {
            ApiProvider: <TApiService extends Apis.BaseApiService>(globalStore: IGlobalState, c: new(culture: string) => TApiService) =>
                new c(globalStore.Common.Language),
        },
    });

const store: Store<IGlobalState> = createStore(RootReducer, composeWithDevTools(applyMiddleware(epicMiddleware)));

epicMiddleware.run(RootEpic);

render(
    <Provider store={store}>
        <ConfigProvider locale={frFR}>
            <BrowserRouter>
                <Main />
            </BrowserRouter>
        </ConfigProvider>
    </Provider>,
    document.getElementById("root"),
);
