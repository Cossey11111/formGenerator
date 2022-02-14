import styled from "styled-components";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
} from "antd";
import {
  AppstoreAddOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import IconModal from "./IconModal";
import { IGeneratorConf } from "../../Components/Generator/config";
import ParamsFilter from "./ParamsFilter";
import { cloneDeep } from "lodash";

interface IAnyObject {
  [key: string]: any;
}

interface IProps {
  data?: IGeneratorConf;
  onValueChange: (value: IAnyObject) => void;
}

const ConfigPanel: React.FC<IProps> = (props: IProps) => {
  const { data, onValueChange } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [iconType, setIconType] = useState<string>("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      const { __config__, id, tag, ...rest } = data;
      const configCopy: IAnyObject = cloneDeep(__config__);
      // transform rules schema
      configCopy.rules = configCopy.rules?.map(
        (rule: { [x: string]: any; message: string }) => {
          const { message = "", ...item } = rule;
          const type = Object.keys(item)[0];
          return {
            type,
            value: item[type],
            message,
          };
        }
      );
      form.resetFields();
      form.setFieldsValue({
        __config__: configCopy,
        ...rest,
      });
    }
  }, [data]);

  const formItemCols = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleOpenModal = (type: "suffix" | "prefix") => {
    setIconType(type);
    setVisible(true);
  };
  const handleCloseIconModal = (icon?: any) => {
    if (icon) {
      form.setFieldsValue({
        [`${iconType}_str`]: icon.render.name,
      });
      onValueChange({
        [iconType]: React.createElement(icon),
      });
    }
    setVisible(false);
  };

  const handleValuesChange = (
    changeValues: IAnyObject,
    allValues: IAnyObject
  ) => {
    const key = Object.keys(changeValues)[0];
    let result = changeValues;
    if (key === "__config__") {
      result.__config__ = allValues.__config__;
      result.__config__.rules = (allValues.__config__.rules || [])
        .filter(
          (rule: { type: string; value: string }) => rule.type && rule.value
        )
        .map((rule: { type: string; value: string; message: string }) => {
          const { type, value, message } = rule;
          let transformValue: boolean | number | string = value;
          switch (type) {
            case "required":
            case "whitespace":
            case "warningOnly":
              transformValue = value === "true";
              break;
            case "max":
            case "min":
              transformValue = Number(value);
              break;
            default:
          }
          return {
            [type]: transformValue,
            message,
          };
        });
      if (
        (result.__config__.defaultValue && data?.tag === "Checkbox.Group") ||
        allValues.mode
      ) {
        result.__config__.defaultValue =
          result.__config__.defaultValue.split(",");
      }
    }
    if (result.mode || data?.tag === "Cascader") {
      result.__config__ = allValues.__config__;
      result.__config__.defaultValue = (
        result.__config__.defaultValue || ""
      ).split(",");
    }

    if (key === "options") {
      result.options = allValues[key].filter(
        (v: { label: string; value: string }) => v.label && v.value
      );
    }
    if (["prefix_str", "suffix_str"].includes(key)) {
      const tempKey = key.split("_")[0];
      result[tempKey] = changeValues[key];
      delete result[key];
    }
    onValueChange(result);
  };

  if (!data) {
    return <StyledConfigPanel>No Data</StyledConfigPanel>;
  }

  return (
    <StyledConfigPanel>
      <Form
        {...formItemCols}
        name="params-panel"
        form={form}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name={["__config__", "label"]} label="Label">
          <Input placeholder="please input" />
        </Form.Item>
        <Form.Item name={["__config__", "name"]} label="FieldName">
          <Input placeholder="please input" />
        </Form.Item>
        <ParamsFilter type={data.tag}>
          <Form.Item name={["__config__", "defaultValue"]} label="DefaultValue">
            {data.tag === "DatePicker" ? (
              <DatePicker />
            ) : data.tag === "DatePicker.RangePicker" ? (
              <DatePicker.RangePicker showTime={data.showTime} />
            ) : (
              <Input placeholder="please input" />
            )}
          </Form.Item>
          <Form.Item name="placeholder" label="Placeholder">
            <Input placeholder="please input" />
          </Form.Item>
          <Form.Item name={["style", "width"]} label="Width">
            <Input placeholder="please input" />
          </Form.Item>
          <Form.Item name="addonBefore" label="AddonBefore">
            <Input placeholder="please input" />
          </Form.Item>
          <Form.Item name="addonAfter" label="AddonAfter">
            <Input placeholder="please input" />
          </Form.Item>
          <Form.Item name="prefix_str" label="Prefix">
            <Input
              placeholder="please input"
              allowClear
              addonAfter={
                <AppstoreAddOutlined
                  onClick={() => {
                    handleOpenModal("prefix");
                  }}
                />
              }
            />
          </Form.Item>
          <Form.Item name="suffix_str" label="Suffix">
            <Input
              placeholder="please input"
              allowClear
              addonAfter={
                <AppstoreAddOutlined
                  onClick={() => {
                    handleOpenModal("suffix");
                  }}
                />
              }
            />
          </Form.Item>
          <Form.Item name="mode" label="Mode">
            <Select allowClear placeholder="please select">
              <Select.Option value="multiple">multiple</Select.Option>
              <Select.Option value="tags">tags</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="allowClear"
            label="AllowClear"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="maxLength" label="MaxLength">
            <InputNumber />
          </Form.Item>
          <Form.Item name="showCount" label="ShowCount" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="showTime" label="ShowTime" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="disabled" label="Disabled" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <div>
                <Divider>Options</Divider>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "label"]}
                      rules={[{ required: true, message: "Missing label" }]}
                      wrapperCol={{ span: 24 }}
                    >
                      <Input placeholder="label" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Missing value" }]}
                      wrapperCol={{ span: 24 }}
                    >
                      <Input placeholder="value" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        label: `label${fields.length + 1}`,
                        value: `value${fields.length + 1}`,
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Options
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </ParamsFilter>
        <Form.List name={["__config__", "rules"]}>
          {(fields, { add, remove }) => (
            <div>
              <Divider>Rules</Divider>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex" }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    rules={[{ required: true, message: "Missing type" }]}
                    wrapperCol={{ span: 24 }}
                  >
                    <Select placeholder="type">
                      {[
                        "required",
                        "max",
                        "min",
                        "pattern",
                        "whitespace",
                        "warningOnly",
                      ].map((v) => (
                        <Select.Option value={v} key={v}>
                          {v}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true, message: "Missing value" }]}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input placeholder="value" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "message"]}
                    rules={[{ required: true, message: "Missing message" }]}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input placeholder="message" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      type: undefined,
                      value: "",
                      message: "",
                    })
                  }
                  block
                  icon={<PlusOutlined />}
                >
                  Add rule
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
      <IconModal visible={visible} onClose={handleCloseIconModal} />
    </StyledConfigPanel>
  );
};

export default ConfigPanel;

const StyledConfigPanel = styled.div`
  float: right;
  width: 350px;
  height: 100%;
  padding: 20px 10px;
  border-left: 1px solid #e9e9e9;
`;
