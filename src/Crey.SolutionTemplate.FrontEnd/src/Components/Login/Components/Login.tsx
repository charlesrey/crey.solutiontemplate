import { Button, Card, Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";
import { IGlobalState } from "Common/Models/IGlobalState";
import {
    connectWithTranslation,
    ICommonTranslations,
    ILoginTranslations,
    Part,
    PartType,
    Translation,
} from "Common/Translations";
import { GetUserInfo } from "Components/Main";
import * as React from "react";
import { MapDispatchToProps } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";

import * as Actions from "../Actions";
import { ILoginState } from "../Models";

interface ILoginDispatchProps {
    OnChangeUsername(newValue: string): void;
    OnChangePassword(newValue: string): void;
    OnLogin(credentials: ILoginState): void;
}

export class LoginComponent extends Translation<
    Part.Login,
    ILoginTranslations,
    ILoginState
    & ILoginDispatchProps
    & FormComponentProps
    & PartType<Part.Login, ILoginTranslations>
    & PartType<Part.Common, ICommonTranslations>> {
    public render() {
        const loginTranslations = this.props[Part.Login];
        const commonTranslations = this.props[Part.Common];
        return loginTranslations && commonTranslations
            ? <div style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                width: "100%",
            }}>
                <Card
                    title={loginTranslations.Connection}
                    style={{
                        maxWidth: 800,
                        minWidth: 400,
                    }}>
                    <Form layout="vertical" onSubmit={
                        (event) => {
                            this.props.OnLogin(this.props);
                            event.preventDefault();
                        }}>
                        <Form.Item label={commonTranslations.Mail}>
                            {this.props.form.getFieldDecorator(
                                "email",
                                {
                                    initialValue: this.props.Username,
                                    rules: [{ required: true, message: commonTranslations.MailRequired }],
                                })
                                (<Input
                                    onChange={(event) =>
                                        this.props.OnChangeUsername(event.target.value)} />)}
                        </Form.Item>
                        <Form.Item label={loginTranslations.Password}>
                            {this.props.form.getFieldDecorator(
                                "password",
                                {
                                    initialValue: this.props.Password,
                                })
                                (<Input
                                    type="password"
                                    onChange={(event) =>
                                        this.props.OnChangePassword(event.target.value)} />)}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                icon="login"
                                style={{
                                    width: "100%",
                                }}>
                                {loginTranslations.Connect}
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to="/AskResetPassword">{loginTranslations.ForgottenPassword}</Link>
                </Card>
            </div>
            : null;
    }
}

const mapDispatchToProps: MapDispatchToProps<ILoginDispatchProps, PartType<Part.Common, ICommonTranslations>> =
    (dispatch: Dispatch) => ({
        OnChangePassword: (newValue: string) => {
            dispatch(Actions.ChangePassword.Build(newValue));
        },
        OnChangeUsername: (newValue: string) => {
            dispatch(Actions.ChangeUsername.Build(newValue));
        },
        OnLogin: (credentials: ILoginState) => {
            dispatch(Actions.Login.Build(credentials, GetUserInfo.Build(undefined)));
        },
    });

export const Login = connectWithTranslation<
    Part.Login,
    ILoginTranslations,
    ILoginState,
    PartType<Part.Login, ILoginTranslations> & PartType<Part.Common, ICommonTranslations>,
    ILoginDispatchProps>(
        Part.Login,
        (state: IGlobalState) => state.Login,
        mapDispatchToProps)(Form.create()(LoginComponent));
