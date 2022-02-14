import { Rule } from "antd/lib/form";

export enum IGeneratorConfTags {
  "Input" = "Input",
  "Input.TextArea" = "Input.TextArea",
  "Select" = "Select",
  "Cascader" = "Cascader",
  "Checkbox.Group" = "Checkbox.Group",
  "Radio.Group" = "Radio.Group",
  "DatePicker" = "DatePicker",
  "DatePicker.RangePicker" = "DatePicker.RangePicker",
  "Upload" = "Upload",
}

export interface IGeneratorConfConfig {
  label: string;
  name: string;
  rules?: Rule[];
  wrapperCol?: { span: number };
  defaultValue?: any;
}

export interface IGeneratorConf {
  __config__: IGeneratorConfConfig; // formItem props config
  tag: IGeneratorConfTags;
  [key: string]: any; // component props config
}

export const formConf = {
  name: "auto-form",
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
  initialValues: {},
};
export const inputConf: IGeneratorConf = {
  __config__: {
    label: "Input",
    name: "input",
  },
  tag: IGeneratorConfTags.Input,
  allowClear: true,
  placeholder: "please input",
  id: "",
  style: {
    width: "100%",
  },
};

export const textareaConf: IGeneratorConf = {
  __config__: {
    label: "Textarea",
    name: "textarea",
  },
  tag: IGeneratorConfTags["Input.TextArea"],
  allowClear: true,
  placeholder: "please input",
  id: "",
};

export const selectConf: IGeneratorConf = {
  __config__: {
    label: "Select",
    name: "select",
  },
  tag: IGeneratorConfTags.Select,

  allowClear: true,
  placeholder: "please select",
  mode: "",
  showSearch: true,
  options: [
    {
      label: "label1",
      value: "value1",
    },
  ],
  id: "",
  style: {
    width: "100%",
  },
};
export const cascaderConf: IGeneratorConf = {
  __config__: {
    label: "Cascader",
    name: "cascader",
  },
  tag: IGeneratorConfTags.Cascader,

  allowClear: true,
  placeholder: "please select",
  options: [
    {
      label: "zh",
      value: "zh",
      children: [
        {
          label: "sh",
          value: "sh",
        },
      ],
    },
  ],
  showSearch: true,
  id: "",
  style: {
    width: "100%",
  },
};
export const checkboxConf: IGeneratorConf = {
  __config__: {
    label: "Checkbox",
    name: "checkbox",
  },
  tag: IGeneratorConfTags["Checkbox.Group"],

  options: [
    {
      label: "A",
      value: "a",
    },
    {
      label: "B",
      value: "b",
    },
    {
      label: "C",
      value: "c",
    },
  ],
  id: "",
};
export const radioConf: IGeneratorConf = {
  __config__: {
    label: "Radio",
    name: "radio",
  },
  tag: IGeneratorConfTags["Radio.Group"],

  options: [
    {
      label: "A",
      value: "a",
    },
    {
      label: "B",
      value: "b",
    },
    {
      label: "C",
      value: "c",
    },
  ],
  id: "",
};
export const datePickerConf: IGeneratorConf = {
  __config__: {
    label: "DatePicker",
    name: "datePicker",
  },
  tag: IGeneratorConfTags["DatePicker"],

  allowClear: true,
  id: "",
  style: {
    width: "100%",
  },
};
export const rangePickerConf: IGeneratorConf = {
  __config__: {
    label: "RangePicker",
    name: "rangePicker",
  },
  tag: IGeneratorConfTags["DatePicker.RangePicker"],

  allowClear: true,
  id: "",
  style: {
    width: "100%",
  },
};
export const uploadConf: IGeneratorConf = {
  __config__: {
    label: "Upload",
    name: "upload",
  },
  tag: IGeneratorConfTags["Upload"],
  id: "",
};

/**
 * config json for generation code
 */
export const generateConfs: { [key: string]: IGeneratorConf } = {
  input: inputConf,
  textarea: textareaConf,
  select: selectConf,
  cascader: cascaderConf,
  checkbox: checkboxConf,
  radio: radioConf,
  datePicker: datePickerConf,
  rangePicker: rangePickerConf,
  upload: uploadConf,
};
