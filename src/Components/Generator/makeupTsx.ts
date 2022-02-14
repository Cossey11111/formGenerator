import { map, groupBy, get } from "lodash";
import { IGeneratorConf, IGeneratorConfTags } from "./config";

const isEmpty = (value: any) => {
  return ["", undefined, null].includes(value);
};

const makeupImport = (configList: IGeneratorConf[]) => {
  const tagList = map(configList, "tag");
  const tagGroups = groupBy(tagList, (item) => {
    return item.split(".")[0];
  });
  const uploadIcon = tagList.includes("Upload" as IGeneratorConfTags)
    ? `import { InboxOutlined } from "@ant-design/icons";`
    : "";
  return `
    import React from 'react';
    import {Form,Button,${Object.keys(tagGroups).join(",")}} from 'antd';
    ${uploadIcon}
  `;
};

// todo: optimize
const transformProps = (props: { [key: string]: any }): string => {
  return Object.keys(props)
    .filter((key) => !isEmpty(props[key]))
    .map((key) => {
      const value = props[key];
      let formatValue =
        typeof value === "string" ? `"${value}"` : `{${JSON.stringify(value)}}`;

      if (key === "prefix") {
        formatValue = props.prefix
          ? `{<${get(props.prefix, "type.render.displayName", props.prefix)}/>}`
          : "{null}";
      }
      if (key === "suffix") {
        formatValue = props.suffix
          ? `{<${get(props.suffix, "type.render.displayName", props.suffix)}/>}`
          : "{null}";
      }

      return `${key}=${formatValue}`;
    })
    .join("");
};

// generate formItem children element string
const getFormItemChildren = (tag: IGeneratorConfTags, props: any): string => {
  if (tag === "Upload") {
    return `
      <Upload.Dragger name="files" action="/">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
     </Upload.Dragger>
    `;
  }
  return `<${tag} ${transformProps(props)}></${tag}>`;
};

const getInitialValues = (configList: IGeneratorConf[]) => {
  const obj: { [key: string]: any } = {};
  configList.forEach((config) => {
    const { name, defaultValue } = config.__config__;
    if (defaultValue && name) {
      obj[name] = defaultValue;
    }
  });
  return JSON.stringify(obj);
};

export const makeupFunction = (configList: IGeneratorConf[]) => {
  const formItemList = configList.map((config) => {
    const { __config__, id, tag, ...rest } = config;
    const { defaultValue, ...restConfig } = __config__;
    return `<Form.Item ${transformProps(restConfig)}>
      ${getFormItemChildren(tag, rest)}
    </Form.Item>`;
  });
  return `
    const FormPage: React.FC = () => {
      const [form] = Form.useForm();
      const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      }
      const tailLayout = {
        wrapperCol: { span: 12, offset: 4 }
      }
      const handleFinish = (values: {[key: string]: any}) => {
        // TODO
      }
      const handleValuesChange = (fields: any, allFields: any) => {
        // TODO
      }
      return <Form form={form} {...layout} initialValues={${getInitialValues(
        configList
      )}} onFinish={handleFinish} onValuesChange={handleValuesChange}>
        ${formItemList.join("")}
        <Form.Item {...tailLayout}>
          <Button>Cancel</Button>
          <Button type="primary" htmlType="submit" style={{ margin: '0 8px' }}>Submit</Button>
        </Form.Item>
      </Form>
    }

    export default FormPage;
  `;
};

/**
 * generate copy code
 * @param data array of config json
 */
const makeupJs = (configList: IGeneratorConf[]) => {
  const importStr = makeupImport(configList);
  const functionStr = makeupFunction(configList);
  return `
    ${importStr}
    ${functionStr}
  `;
};

export default makeupJs;
