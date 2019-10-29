import { Button, Modal } from "antd";
import { IGlobalState, IsEntityWithId, IUser, NewEntityWithId } from "Common/Models";
import {
    connectWithTranslation,
    ICommonTranslations,
    IUserTranslations,
    Part,
    PartType,
    Translation,
} from "Common/Translations";
import * as React from "react";
import { MapDispatchToProps } from "react-redux";
import { Dispatch } from "redux";

import * as Actions from "../Actions";
import { UserState } from "../Models";
import { Detail, IDetailDispatchProps } from "./Detail";
import { IListDispatchProps, List } from "./List";

interface IMainDispatchProps extends IListDispatchProps, IDetailDispatchProps {
    OnAdd(): void;
    OnClose(): void;
    OnMount(): void;
    OnSave(advisor: IUser | NewEntityWithId<IUser> | undefined, close: boolean): void;
}

class MainComponent extends Translation<
    Part.User,
    IUserTranslations,
    UserState
    & IMainDispatchProps
    & PartType<Part.User, IUserTranslations>
    & PartType<Part.Common, ICommonTranslations>> {

    public componentDidMount() {
        super.componentDidMount();
        this.props.OnMount();
    }

    public render() {
        const userTranslations = this.props[Part.User];
        const commonTranslations = this.props[Part.Common];
        return userTranslations && commonTranslations
            ? <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    width: "100%",
                }}>
                <div
                    style={{
                        alignItems: "center",
                        boxShadow: "0px -1px 1px rgba(0, 0, 0, 0.3) inset",
                        display: "flex",
                        flexDirection: "row",
                        fontSize: "12px",
                        height: "50px",
                        paddingLeft: 10,
                        width: "100%",
                    }}>
                    <Button
                        type="primary"
                        icon="plus"
                        size="large"
                        onClick={(_event: React.MouseEvent<HTMLButtonElement>) => this.props.OnAdd()}
                        style={{
                            fontSize: "14px",
                        }}>
                        {userTranslations.Add}
                    </Button>
                </div>
                <List
                    {... this.props}
                    Common={commonTranslations}
                    User={userTranslations} />
                {
                    this.props.OpenedUser
                        ? <Modal
                            footer={[
                                <Button
                                    key="saveAndClose"
                                    type="primary"
                                    onClick={(_event: React.MouseEvent<HTMLButtonElement>) =>
                                        this.props.OnSave(this.props.OpenedUser, true)}>
                                    {commonTranslations.SaveAndClose}
                                </Button>,
                                <Button
                                    key="save"
                                    onClick={(_event: React.MouseEvent<HTMLButtonElement>) =>
                                        this.props.OnSave(this.props.OpenedUser, false)}>
                                    {commonTranslations.Save}
                                </Button>,
                                <Button
                                    key="close"
                                    onClick={(_event: React.MouseEvent<HTMLButtonElement>) => this.props.OnClose()}>
                                    {commonTranslations.Close}
                                </Button>,
                            ]}
                            onCancel={(_event) => this.props.OnClose()}
                            visible={true}
                            title={IsEntityWithId(this.props.OpenedUser)
                                ? `${userTranslations.Modify} ${
                                this.props.OpenedUser.FirstName} ${this.props.OpenedUser.LastName}`
                                : userTranslations.Add}>
                            <Detail
                                Common={commonTranslations}
                                User={userTranslations}
                                {... this.props} />
                        </Modal>
                        : null
                }
            </div>
            : null;
    }
}

const mapDispatchProps: MapDispatchToProps<IMainDispatchProps, PartType<Part.Common, ICommonTranslations>> =
    (dispatch: Dispatch) => ({
        OnAdd: () => {
            dispatch(Actions.Open.Build(undefined));
        },
        OnChange: (user: IUser) => {
            dispatch(Actions.Update.Build(user));
        },
        OnClose: () => {
            dispatch(Actions.Close.Build({}));
        },
        OnDelete: (userId: string) => {
            dispatch(Actions.Delete.Build(userId));
        },
        OnMount: () => {
            dispatch(Actions.Fetch.Build(undefined));
        },
        OnOpen: (user: IUser) => {
            dispatch(Actions.Open.Build(user));
        },
        OnSave: (user: IUser, close: boolean) => {
            dispatch(Actions.Save.Build(user, close ? Actions.Close.Build({}) : undefined));
        },
    });

export const Main = connectWithTranslation<
    Part.User,
    IUserTranslations,
    UserState,
    PartType<Part.User, IUserTranslations> & PartType<Part.Common, ICommonTranslations>,
    IMainDispatchProps>(
        Part.User,
        (state: IGlobalState) => state.Users,
        mapDispatchProps)(MainComponent);
