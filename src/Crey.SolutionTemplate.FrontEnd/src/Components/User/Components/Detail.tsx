import { Form, Input, Select } from "antd";
import { IUser, NewEntityWithId, Role } from "Common/Models";
import { ICommonTranslations, IUserTranslations } from "Common/Translations";
import * as React from "react";

import { IUserDetailState } from "../Models";

export interface IDetailDispatchProps {
    OnChange(advisor: IUser | NewEntityWithId<IUser>): void;
}

/* tslint:disable:max-classes-per-file */
class RoleSelect extends Select<Role> { }
const Option = RoleSelect.Option;

export class Detail extends React.Component<
    IUserDetailState
    & IDetailDispatchProps
    & { User: IUserTranslations }
    & { Common: ICommonTranslations }>
{
    public render() {
        const user = this.props.OpenedUser;
        if (user) {
            return <Form layout="vertical">
                <Form.Item
                    help={this.props.UserFormValidation && this.props.UserFormValidation.LastNameValidationError !== undefined
                        ? this.props.Common.LastNameRequired
                        : undefined}
                    label={this.props.Common.LastName}
                    required={true}
                    validateStatus={this.props.UserFormValidation && this.props.UserFormValidation.LastNameValidationError !== undefined
                        ? "error"
                        : "success"}>
                    <Input
                        onChange={(event) => this.props.OnChange({ ...user, LastName: event.target.value })}
                        value={user.LastName} />
                </Form.Item>
                <Form.Item
                    help={this.props.UserFormValidation && this.props.UserFormValidation.FirstNameValidationError !== undefined
                        ? this.props.Common.FirstNameRequired
                        : undefined}
                    label={this.props.Common.FirstName}
                    required={true}
                    validateStatus={this.props.UserFormValidation && this.props.UserFormValidation.FirstNameValidationError !== undefined
                        ? "error"
                        : "success"}>
                    <Input
                        onChange={(event) =>
                            this.props.OnChange({ ...user, FirstName: event.target.value })}
                        value={user.FirstName} />
                </Form.Item>
                <Form.Item
                    help={this.props.UserFormValidation && this.props.UserFormValidation.EmailValidationError !== undefined
                        ? this.props.UserFormValidation.EmailValidationError === "Required"
                            ? this.props.Common.MailRequired
                            : this.props.Common.MailAlreadyExists
                        : undefined}
                    label={this.props.Common.Mail}
                    required={true}
                    validateStatus={this.props.UserFormValidation && this.props.UserFormValidation.EmailValidationError !== undefined
                        ? "error"
                        : "success"}>
                    <Input
                        onChange={(event) =>
                            this.props.OnChange({ ...user, Email: event.target.value })}
                        value={user.Email} />
                </Form.Item>
                <Form.Item
                    label={this.props.User.Role}
                    required={true}>
                    <RoleSelect
                        onChange={(value) => this.props.OnChange({ ...user, Role: value })}
                        value={user.Role} >
                            <Option value={Role.Admin}>{this.props.User.AdministratorRole}</Option>
                            <Option value={Role.User}>{this.props.User.UserRole}</Option>
                        </RoleSelect>
                </Form.Item>
            </Form>;
        }
        else {
            return null;
        }
    }
}
/* tslint:enable:max-classes-per-file */
