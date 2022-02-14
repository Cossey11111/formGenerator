import { BlockOutlined, HolderOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import React from "react";

interface ILabelValue {
  label: string;
  value: string;
}
interface IFormItemProps {
  data: ILabelValue[];
  droppableId: string;
}

const FormItem: React.FC<IFormItemProps> = (props: IFormItemProps) => {
  const { data, droppableId } = props;
  return (
    <Droppable droppableId={droppableId} isDropDisabled>
      {(provided) => {
        return (
          <>
            <ItemList ref={provided.innerRef} {...provided.droppableProps}>
              {data.map((v, index) => {
                return (
                  <Draggable draggableId={v.value} index={index} key={v.value}>
                    {(provided, snapshot) => {
                      return (
                        <>
                          <Item
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging
                                ? provided.draggableProps.style?.transform
                                : "translate(0px, 0px)",
                              border: snapshot.isDragging
                                ? "1px dashed #1890ff"
                                : "",
                              color: snapshot.isDragging ? "#1890ff" : "",
                            }}
                          >
                            <HolderOutlined style={{ marginRight: "10px" }} />
                            {v.label}
                          </Item>
                          {snapshot.isDragging && (
                            <Clone style={{ transform: "none !important" }}>
                              <HolderOutlined style={{ marginRight: "10px" }} />
                              {v.label}
                            </Clone>
                          )}
                        </>
                      );
                    }}
                  </Draggable>
                );
              })}
            </ItemList>
            <div style={{ display: "none" }}>{provided.placeholder}</div>
          </>
        );
      }}
    </Droppable>
  );
};

const ResourcePanel: React.FC = () => {
  const entryList = [
    {
      label: "Input",
      value: "input",
    },
    {
      label: "TextArea",
      value: "textarea",
    },
  ];
  const selectList = [
    {
      label: "Select",
      value: "select",
    },
    {
      label: "Cascader",
      value: "cascader",
    },
    {
      label: "Checkbox",
      value: "checkbox",
    },
    {
      label: "Radio",
      value: "radio",
    },
    {
      label: "DatePicker",
      value: "datePicker",
    },
    {
      label: "RangePicker",
      value: "rangePicker",
    },
    {
      label: "Upload",
      value: "upload",
    },
  ];
  return (
    <StyledFormPanel>
      <div className="title">
        <BlockOutlined />
        Data Entry
      </div>
      <Container>
        <FormItem data={entryList} droppableId="entry-zone"></FormItem>
      </Container>
      <div className="title">
        <BlockOutlined />
        Data Select
      </div>
      <Container>
        <FormItem data={selectList} droppableId="select-zone"></FormItem>
      </Container>
      <div className="title">
        <BlockOutlined />
        Auto
      </div>
    </StyledFormPanel>
  );
};

export default ResourcePanel;

const StyledFormPanel = styled.div`
  float: left;
  width: 300px;
  height: 100%;
  border-right: 1px solid #e9e9e9;
  padding: 10px;
  .title {
    margin: 10px;
  }
`;

const Container = styled.div`
  margin-bottom: 20px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const BaseItem = styled.div`
  background-color: #f6f7ff;
  padding: 4px;
  margin: 5px;
  width: 250px;
  border-radius: 4px;
  border: 1px dashed #f6f7ff;
`;

const Item = styled(BaseItem)`
  &:hover {
    color: #1890ff;
    border: 1px dashed #1890ff;
    cursor: move;
  }
`;

const Clone = styled(BaseItem)`
  color: #1890ff;
  border: 1px dashed #1890ff;
`;
