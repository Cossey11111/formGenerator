import { IGeneratorConf } from "../Generator/config";
import { get } from "lodash";
import * as antd from "antd";
import React from "react";
import { InboxOutlined } from "@ant-design/icons";

const { Upload } = antd;

const UploadItem = () => {
  return (
    <Upload.Dragger name="files" action="/upload.do">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Upload.Dragger>
  );
};

/**
 * render specific fromItem
 */
export const Render: React.FC<IGeneratorConf> = (props: IGeneratorConf) => {
  const { __config__, defaultValue, id, tag, ...rest } = props;
  if (tag === "Upload") {
    return (
      <antd.Form.Item {...__config__}>
        {React.createElement(UploadItem)}
      </antd.Form.Item>
    );
  }
  const component = get(antd, tag);
  return (
    <antd.Form.Item {...__config__}>
      {component ? React.createElement(component, rest) : ""}
    </antd.Form.Item>
  );
};
