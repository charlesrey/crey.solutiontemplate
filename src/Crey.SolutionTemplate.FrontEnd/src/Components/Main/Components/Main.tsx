import { Alert, Layout, Menu, Spin } from "antd";
import { IGlobalState, Role } from "Common/Models";
import { connectWithTranslation, ICommonTranslations, Part, PartType, Translation } from "Common/Translations";
import { AskResetPassword, Login, ResetPassword } from "Components/Login";
import { UserMain } from "Components/User";
import * as React from "react";
import { Helmet } from "react-helmet";
import { MapDispatchToProps } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { Dispatch } from "redux";

import * as Actions from "../Actions";
import { ICommonState } from "../Models";
import { MenuItem } from "./MenuItem";
import { ProfileMenu } from "./ProfileMenu";

const { Header, Sider, Content } = Layout;

interface IMainComponentDispatchProps {
    OnMount(): void;
    OnToggleMenuCollapsed(): void;
    OnCloseAlert(): void;
    OnLogout(): void;
    OnNavigate(path: string | undefined): void;
}

class MainComponent extends Translation<
    Part.Common,
    ICommonTranslations,
    ICommonState
    & IMainComponentDispatchProps
    & RouteComponentProps<any>
    & PartType<Part.Common, ICommonTranslations>>
{
    public componentDidMount() {
        super.componentDidMount();
        this.props.OnMount();
    }

    public render() {
        const translations = this.props[Part.Common];
        if (translations) {
            if (this.props.Navigate && this.props.location.pathname === this.props.Navigate) {
                this.props.OnNavigate(undefined);
            } else if (this.props.Navigate) {
                this.props.history.push(this.props.Navigate);
            }
            const notificationContent = this.props.Notification
                ? <Alert
                    style={{
                        position: "fixed",
                        right: 10,
                        top: 10,
                        width: "20%",
                        zIndex: 2000,
                    }}
                    type={this.props.Notification.Type}
                    description={this.props.Notification.Message}
                    message={this.props.Notification.Type === "error" ? translations.Error : null}
                    closable
                    onClose={(_event) => this.props.OnCloseAlert()} />
                : null;
            const mainContent = this.props.ConnectedUser
                ? (<Layout
                    style={{ height: "100%" }}>
                    <Header style={{ boxShadow: "0px -1px 1px rgba(0, 0, 0, 0.3) inset" }}>
                        <div
                            style={{
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}>
                            <span style={{ fontSize: 20 }}>{translations.MainTitle}</span>
                            <ProfileMenu
                                Common={translations}
                                User={this.props.ConnectedUser}
                                onLogout={this.props.OnLogout} />
                        </div>
                    </Header>
                    <Layout>
                        <Content>
                            <Switch>
                                {this.props.ConnectedUser.Role === Role.Admin
                                    ? [
                                        <Route
                                            key="/users"
                                            path="/users"
                                            exact={true}
                                            render={(_props) => <UserMain Common={translations} />} />,
                                    ]
                                    : []}
                                <Redirect to="/users" />
                            </Switch>
                        </Content>
                        <Sider
                            collapsible={true}
                            reverseArrow={true}
                            collapsed={this.props.IsMenuCollapsed}
                            onCollapse={this.props.OnToggleMenuCollapsed}
                            style={{ boxShadow: "-1px 0px 1px rgba(0, 0, 0, 0.3)" }}>
                            <Menu
                                style={{ width: "100%", fontSize: "16px", height: "100%" }}
                                selectedKeys={[this.props.location.pathname]}>
                                {this.props.ConnectedUser.Role === Role.Admin
                                    ? [
                                        <Menu.Item
                                            key="/users">
                                            <MenuItem
                                                Icon="user"
                                                IsMenuCollapsed={this.props.IsMenuCollapsed}
                                                Label={translations.Users}
                                                Url="/users" />
                                        </Menu.Item>,
                                    ]
                                    : []}
                                <Menu.Item
                                    key="/about">
                                    <MenuItem
                                        Icon="info-circle"
                                        IsMenuCollapsed={this.props.IsMenuCollapsed}
                                        Label={translations.About}
                                        Url="/about" />
                                </Menu.Item>
                            </Menu>
                        </Sider>
                    </Layout>
                </Layout>)
                : <Switch>
                    <Route key="/" exact={true} path="/" render={(_props) => <Login Common={translations} />} />
                    <Route
                        key="/ResetPassword"
                        path="/ResetPassword"
                        render={(props1) =>
                            <Route
                                path={`${props1.match.path}/:token`}
                                render={(props) =>
                                <ResetPassword
                                    Common={translations}
                                    Token={props.match.params.token as string} />} />
                        } />
                    <Route
                        key="/AskResetPassword"
                        path="/AskResetPassword"
                        render={(_props) => <AskResetPassword Common={translations} />} />
                    <Redirect to="/" />
                </Switch>;
            return (<div style={{ height: "100%", width: "100%" }}>
                <Helmet>
                    <title>{translations.Title}</title>
                </Helmet>
                {this.props.IsLoading
                    ? <Spin tip={translations.Loading} className="progress" />
                    : null}
                {notificationContent}
                {mainContent}
            </div>);
        }
        else {
            return <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "center",
                    width: "100%",
                }}>
                <Alert
                    message="Oops"
                    description="Server is down"
                    type="error"
                    showIcon={true}
                    style={{
                        height: 75,
                        width: 200,
                    }} />
            </div>;
        }
    }
}

const mapDispatchProps:
    MapDispatchToProps<IMainComponentDispatchProps, RouteComponentProps<any>> =
    (dispatch: Dispatch) => ({
        OnCloseAlert: () => {
            dispatch(Actions.CloseNotification.Build({}));
        },
        OnLogout: () => {
            dispatch(Actions.Logout.Build(undefined));
        },
        OnMount: () => {
            dispatch(Actions.GetUserInfo.Build(undefined));
        },
        OnNavigate: (path: string | undefined) => {
            dispatch(Actions.Navigate.Build(path));
        },
        OnToggleMenuCollapsed: () => {
            dispatch(Actions.ToggleMenuCollapsed.Build({}));
        },
    });

export const Main = withRouter(
    connectWithTranslation<
        Part.Common,
        ICommonTranslations,
        ICommonState,
        RouteComponentProps<any> & PartType<Part.Common, ICommonTranslations>,
        IMainComponentDispatchProps>(
            Part.Common,
            (state: IGlobalState) => state.Common,
            mapDispatchProps)(MainComponent));
