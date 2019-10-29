import { Icon } from "antd";
import * as React from "react";
import { Link } from "react-router-dom";

export interface IMenuItemState {
    Icon: string;
    IsMenuCollapsed: boolean;
    Label: string;
    Url: string;
}

export class MenuItem extends React.Component<IMenuItemState> {
    public render() {
        return <Link
            style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                height: "100%",
                justifyContent: "flex-start",
                whiteSpace: "normal",
            }}
            to={this.props.Url}>
            <Icon type={this.props.Icon} />
            {this.props.IsMenuCollapsed
                ? null
                : <span style={{ lineHeight: "25px" }}>{this.props.Label}</span>}
        </Link>;
    }
}
