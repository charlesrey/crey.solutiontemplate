import { Button, Popover } from "antd";
import { IUser } from "Common/Models";
import { ICommonTranslations } from "Common/Translations";
import React from "react";

export interface IProfileMenuState {
    User: IUser;
}

export interface IProfileMenuDispatchProps {
    onLogout(): void;
}

export class ProfileMenu extends React.Component<
    IProfileMenuState
    & IProfileMenuDispatchProps
    & { Common: ICommonTranslations }> {
    public render() {
        const content =
            <div>
                <p><b>{this.props.User.DisplayName}</b></p>
                <p>{this.props.User.Email}</p>
                <p>
                    <Button onClick={this.props.onLogout}>
                        {this.props.Common.Logout}
                    </Button>
                </p>
            </div>;

        const popover =
            <span>
                <label style={{ marginRight: 5 }}>
                    {this.props.Common.Hello} {this.props.User.DisplayName}
                </label>
                <Popover
                    placement="bottomRight"
                    title={this.props.Common.MyProfile}
                    content={content}
                    trigger="click">
                        <Button type="primary" shape="circle" icon="user" />
                </Popover>
            </span>;
        return popover;
    }
}
