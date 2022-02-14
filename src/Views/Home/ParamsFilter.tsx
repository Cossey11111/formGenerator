import React from "react";
import { IGeneratorConfTags } from "@/Components/Generator/config";
interface IProps {
  type: IGeneratorConfTags;
}

/**
 * the filter which filtes formItem
 */
const ParamsFilter: React.FC<IProps> = (props) => {
  const commonKeys = ["style.width", "rules"];
  const statusKeys = ["disabled", "__config__.defaultValue"];
  const inputKeys = ["placeholder", "showCount", "allowClear"];
  const selectKeys = ["mode"];
  const filterMap = new Map<IGeneratorConfTags, string[]>([
    [
      IGeneratorConfTags["Input"],
      [
        ...commonKeys,
        "addonBefore",
        "addonAfter",
        "prefix_str",
        "suffix_str",
        ...inputKeys,
        ...statusKeys,
      ],
    ],
    [
      IGeneratorConfTags["Input.TextArea"],
      [...commonKeys, ...statusKeys, ...inputKeys],
    ],
    [
      IGeneratorConfTags["Select"],
      [...commonKeys, ...selectKeys, ...statusKeys, "options", "placeholder"],
    ],
    [IGeneratorConfTags["Cascader"], [...commonKeys, ...statusKeys]],
    [IGeneratorConfTags["DatePicker"], [...commonKeys, ...statusKeys]],
    [IGeneratorConfTags["Upload"], []],
    [
      IGeneratorConfTags["Radio.Group"],
      [...commonKeys, ...statusKeys, "options"],
    ],
    [
      IGeneratorConfTags["Checkbox.Group"],
      [...commonKeys, ...statusKeys, "options"],
    ],
    [
      IGeneratorConfTags["DatePicker.RangePicker"],
      [...commonKeys, "showTime", ...statusKeys],
    ],
  ]);
  let children: React.ReactElement[] = [];
  if (props.children) {
    children = (props.children as React.ReactElement[]).filter(
      (v: React.ReactElement) => {
        const name =
          typeof v.props.name === "string"
            ? v.props.name
            : v.props.name.join(".");
        return filterMap.get(props.type)!.includes(name);
      }
    );
  }
  return <div>{children}</div>;
};

export default ParamsFilter;
