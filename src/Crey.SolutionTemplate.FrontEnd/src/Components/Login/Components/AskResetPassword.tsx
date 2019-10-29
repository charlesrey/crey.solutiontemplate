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
import { Navigate, OpenNotification } from "Components/Main";
import * as React from "react";
import { MapDispatchToProps } from "react-redux";
import { Dispatch } from "redux";

import * as Actions from "../Actions";
import { ILoginState } from "../Models";

interface IAskResetPasswordDispatchProps {
    OnChangeUsername(newValue: string): void;
    OnResetPassword(email: string, confirmationMessage: string): void;
}

export class AskResetPasswordComponent extends Translation<
    Part.Login,
    ILoginTranslations,
    ILoginState
    & IAskResetPasswordDispatchProps
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
                    title={loginTranslations.ResetPassword}
                    style={{
                        maxWidth: 800,
                        minWidth: 400,
                    }}>
                    <Form layout="vertical" onSubmit={
                        (event) => {
                            this.props.OnResetPassword(this.props.Username, loginTranslations.AskResetPasswordConfirmation);
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
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                icon="login"
                                style={{
                                    width: "100%",
                                }}>
                                {loginTranslations.AskResetPassword}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            : null;
    }
}

const mapDispatchToProps: MapDispatchToProps<IAskResetPasswordDispatchProps, PartType<Part.Common, ICommonTranslations>> =
    (dispatch: Dispatch) => ({
        OnChangeUsername: (newValue: string) => {
            dispatch(Actions.ChangeUsername.Build(newValue));
        },
        OnResetPassword: (email: string, confirmationMessage: string) => {
            dispatch(Actions.AskResetPassword.Build(
                email,
                Navigate.Build("/", OpenNotification.Build({ Message: confirmationMessage, Type: "success" }))));
        },
    });

export const AskResetPassword = connectWithTranslation<
    Part.Login,
    ILoginTranslations,
    ILoginState,
    PartType<Part.Login, ILoginTranslations> & PartType<Part.Common, ICommonTranslations>,
    IAskResetPasswordDispatchProps>(
        Part.Login,
        (state: IGlobalState) => state.Login,
        mapDispatchToProps)(Form.create()(AskResetPasswordComponent));
