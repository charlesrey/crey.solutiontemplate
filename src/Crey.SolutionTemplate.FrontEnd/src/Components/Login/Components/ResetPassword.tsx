import { Button, Card, Form, Input } from "antd";
import { IGlobalState } from "Common/Models/IGlobalState";
import {
    connectWithTranslation,
    ICommonTranslations,
    ILoginTranslations,
    Part,
    PartType,
    Translation,
} from "Common/Translations";
import { Navigate, OpenNotification } from "Components/Main";
import * as React from "react";
import { MapDispatchToProps } from "react-redux";
import { Dispatch } from "redux";

import * as Actions from "../Actions";
import { ILoginState } from "../Models";

interface IResetPasswordDispatchProps {
    OnChangePassword(newValue: string): void;
    OnChangeConfirmPassword(newValue: string): void;
    OnResetPassword(password: string, token: string, confirmationMessage: string): void;
}

export interface IResetPasswordOwnProps {
    Token: string;
}

export class ResetPasswordComponent extends Translation<
    Part.Login,
    ILoginTranslations,
    ILoginState
    & IResetPasswordDispatchProps
    & IResetPasswordOwnProps
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
                    title={loginTranslations.ResetPassword}
                    style={{
                        maxWidth: 800,
                        minWidth: 400,
                    }}>
                    <Form
                        layout="vertical"
                        onSubmit={
                            (event) => {
                                this.props.OnResetPassword(
                                    this.props.Password,
                                    this.props.Token,
                                    loginTranslations.ResetPasswordConfirmation);
                                event.preventDefault();
                            }}>
                        <Form.Item
                            label={loginTranslations.Password}
                            required={true}
                            help={this.props.ValidationErrors && this.props.ValidationErrors.Password
                                ? this.props.ValidationErrors.Password === "required"
                                    ? loginTranslations.PasswordRequired
                                    : loginTranslations.PasswordTooShort
                                : undefined}
                            validateStatus={this.props.ValidationErrors && this.props.ValidationErrors.Password
                                ? "error"
                                : "success"}>
                            <Input
                                type="password"
                                value={this.props.Password}
                                onChange={(event) => this.props.OnChangePassword(event.target.value)} />
                        </Form.Item>
                        <Form.Item
                            label={loginTranslations.ConfirmPassword}
                            required={true}
                            help={this.props.ValidationErrors && this.props.ValidationErrors.ConfirmPassword
                                ? loginTranslations.PasswordsDoesNotMatch
                                : undefined}
                            validateStatus={this.props.ValidationErrors && this.props.ValidationErrors.ConfirmPassword
                                ? "error"
                                : "success"}>
                            <Input
                                type="password"
                                value={this.props.ConfirmPassword}
                                onChange={(event) => this.props.OnChangeConfirmPassword(event.target.value)} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                disabled={this.props.ValidationErrors !== undefined}
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                icon="login"
                                style={{
                                    width: "100%",
                                }}>
                                {loginTranslations.ResetPassword}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            : null;
    }
}

const mapDispatchToProps:
    MapDispatchToProps<IResetPasswordDispatchProps, PartType<Part.Common, ICommonTranslations> & IResetPasswordOwnProps> =
    (dispatch: Dispatch) => ({
        OnChangeConfirmPassword: (newValue: string) => {
            dispatch(Actions.ChangeConfirmPassword.Build(newValue));
        },
        OnChangePassword: (newValue: string) => {
            dispatch(Actions.ChangePassword.Build(newValue));
        },
        OnResetPassword: (email: string, token: string, confirmationMessage: string) => {
            dispatch(Actions.ResetPassword.Build(
                { Mail: email, Token: token },
                Navigate.Build(
                    "/",
                    OpenNotification.Build({ Message: confirmationMessage, Type: "success" }))));
        },
    });

export const ResetPassword = connectWithTranslation<
    Part.Login,
    ILoginTranslations,
    ILoginState,
    PartType<Part.Login, ILoginTranslations> & PartType<Part.Common, ICommonTranslations> & IResetPasswordOwnProps,
    IResetPasswordDispatchProps>(
        Part.Login,
        (state: IGlobalState) => state.Login,
        mapDispatchToProps)(ResetPasswordComponent);
