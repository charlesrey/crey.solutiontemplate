import { Button } from "antd";
import * as React from "react";

interface IUploadStateProps {
    AcceptedExtensions?: string;
    Label: string;
    IsDisabled?: boolean;
    IsUploading: boolean;
    LabelUploading: string;
    Styles?: React.CSSProperties;
    OnFileUpload(file: File): void;
}

export class Upload extends React.Component<IUploadStateProps> {

    private uploadInput?: HTMLInputElement;

    public render() {
        return <Button
            style={this.props.Styles}
            type="primary"
            disabled={this.props.IsUploading || this.props.IsDisabled}
            onClick={(_event: React.MouseEvent<HTMLButtonElement>) => {
                if (this.uploadInput) {
                    this.uploadInput.click();
                }
            }}
            icon={this.props.IsUploading ? "loading" : "upload"}>
            {this.props.IsUploading ? this.props.LabelUploading : this.props.Label}
            <input
                accept={this.props.AcceptedExtensions}
                ref={(input) => {
                    if (input) {
                        this.uploadInput = input;
                    }
                }}
                style={{
                    display: "none",
                }}
                type="file"
                onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                        this.props.OnFileUpload(event.target.files[0]);
                    }
                }} />
        </Button>;
    }
}
