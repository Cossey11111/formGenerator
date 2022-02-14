import { IGeneratorConf } from "@/Components/Generator/config";
import { message, Modal } from "antd";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json as language } from "@codemirror/lang-json";

interface IProps {
  json: IGeneratorConf[];
  visible: boolean;
  onClose: () => void;
  onEdit: (code: string) => void;
}
const JsonModal: React.FC<IProps> = (props: IProps) => {
  const { json, visible, onClose, onEdit } = props;
  const [code, setCode] = useState<string>("");

  const handleOk = () => {
    if (code) {
      try {
        onEdit(code);
      } catch (e) {
        console.error(e);
        message.error("can not parse to json, please check!");
      }
    }
    onClose();
  };
  return (
    <Modal
      visible={visible}
      width={1200}
      title="Json"
      forceRender={true}
      okText="Edit"
      onCancel={onClose}
      onOk={handleOk}
    >
      <CodeMirror
        value={JSON.stringify(json, null, 2)}
        extensions={[language()]}
        height="600px"
        onChange={(value: string) => {
          setCode(value);
        }}
      ></CodeMirror>
    </Modal>
  );
};

export default JsonModal;
