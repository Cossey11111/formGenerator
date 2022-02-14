import { Modal } from "antd";
import * as icons from "@ant-design/icons/lib/icons/index";
import React from "react";
import styled from "styled-components";
interface IProps {
  visible: boolean;
  onClose: (icon?: any) => void;
}

const IconModal: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose } = props;

  const handleCopy = (icon: any) => {
    onClose(icon);
  };
  return (
    <Modal
      visible={visible}
      footer={null}
      width="1000px"
      onCancel={() => {
        onClose();
      }}
    >
      {Object.keys(icons)
        .filter((v) => v.includes("Outlined"))
        .map((iconName) => {
          const temp = icons as any;
          return (
            <Container
              key={iconName}
              onClick={() => {
                handleCopy(temp[iconName]);
              }}
            >
              {React.createElement(temp[iconName], {
                style: {
                  fontSize: "26px",
                },
              })}
              <div>{iconName}</div>
            </Container>
          );
        })}
    </Modal>
  );
};

export default IconModal;

const Container = styled.div`
  display: inline-block;
  padding: 5px;
  text-align: center;
  width: 190px;
  height: 70px;
  overflow: hidden;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f6f7ff;
    cursor: pointer;
  }
  &:active {
    background-color: #1890ff;
    color: #fff;
  }
`;
