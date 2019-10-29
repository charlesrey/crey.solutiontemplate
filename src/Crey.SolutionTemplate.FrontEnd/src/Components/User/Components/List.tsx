import { Button, Table } from "antd";
import { IUser, Role } from "Common/Models";
import { ICommonTranslations, IUserTranslations } from "Common/Translations";
import * as React from "react";

import { IUserListState } from "../Models";

/* tslint:disable:max-classes-per-file */
class UserTable extends Table<IUser> { }

class UserColumn extends Table.Column<IUser> { }

export interface IListDispatchProps {
    OnOpen(user: IUser): void;
    OnDelete(userId: string): void;
}

export class List extends React.Component<
    IUserListState
    & IListDispatchProps
    & { Common: ICommonTranslations }
    & { User: IUserTranslations }> {
    public render() {
        return <UserTable
            style={{ width: "100%" }}
            rowKey={(record: IUser, _index: number) => record.Id ? record.Id : ""}
            dataSource={this.props.Users.toList().toArray()}>
            <UserColumn
                width={5}
                key="edit"
                title=""
                render={(_text: any, record: IUser, _index: number) =>
                    <Button.Group>
                        <Button
                            icon="edit"
                            type="primary"
                            onClick={(_event: React.MouseEvent<HTMLButtonElement>) => this.props.OnOpen(record)} />
                        <Button
                            icon="delete"
                            type="primary"
                            onClick={(_event: React.MouseEvent<HTMLButtonElement>) => this.props.OnDelete(record.Id ? record.Id : "")} />
                    </Button.Group>
                } />
            <UserColumn
                width={30}
                key="name"
                title={this.props.Common.Name}
                render={(_text: any, record: IUser, _index: number) => record.DisplayName} />
            <UserColumn
                width={30}
                key="email"
                title={this.props.Common.Mail}
                render={(_text: any, record: IUser, _index: number) => record.Email} />
            <UserColumn
                width={30}
                key="role"
                title={this.props.User.Role}
                render={(_text: any, record: IUser, _index: number) =>
                    record.Role === Role.Admin ? this.props.User.AdministratorRole : this.props.User.UserRole} />
        </UserTable>;
    }
}
/* tslint:enable:max-classes-per-file */
