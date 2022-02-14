import styled from "styled-components";
import { Draggable, Droppable, DroppableProvided } from "react-beautiful-dnd";
import React, { ComponentType, useImperativeHandle } from "react";
import { Form, Button } from "antd";
import { IGeneratorConf, formConf } from "../../Components/Generator/config";
import { Render } from "../../Components/Render";
import { DeleteOutlined } from "@ant-design/icons";

interface IProps {
  data: IGeneratorConf[];
  activeIndex: string;
  onDelete: (index: string) => void;
  onSelect: (index: string) => void;
}

interface IItemListProps {
  ref: (instance: HTMLDivElement | null) => void;
  isDraggingOver: boolean;
}

interface IItemProps {
  ref: (instance: HTMLDivElement | null) => void;
  isDragging: boolean;
  isActive: boolean;
}

export interface IContentRefHandle {
  setFieldsValue: (key: string, value: any) => void;
}

const ContentPanel = (
  props: IProps,
  ref: React.Ref<IContentRefHandle | undefined>
) => {
  const { data, activeIndex, onDelete, onSelect } = props;

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  const handleDoubleClick = () => {
    onSelect("");
  };

  const setFieldsValue = (key: string, value: any) => {
    form.setFieldsValue({
      [key]: value,
    });
  };

  useImperativeHandle(ref, () => ({
    setFieldsValue: setFieldsValue,
  }));
  const [form] = Form.useForm();

  return (
    <StyledContent {...formConf} form={form} colon={false}>
      <Droppable droppableId="content-panel">
        {(provided: DroppableProvided, snapshot) => {
          return (
            <>
              <ItemList<ComponentType<IItemListProps>>
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {(data || []).map((v, index) => {
                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(v.id);
                      }}
                      onDoubleClick={handleDoubleClick}
                      key={v.id}
                    >
                      <Draggable draggableId={v.id} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <Item<ComponentType<IItemProps>>
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              isDragging={snapshot.isDragging}
                              isActive={activeIndex === v.id}
                            >
                              {Render(v)}
                              <Delete
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                className="delete-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(v.id);
                                }}
                              />
                            </Item>
                          );
                        }}
                      </Draggable>
                    </div>
                  );
                })}
              </ItemList>
              {provided.placeholder}
            </>
          );
        }}
      </Droppable>
    </StyledContent>
  );
};

export default React.forwardRef(ContentPanel);

const StyledContent = styled(Form)`
  margin-left: 300px;
  margin-right: 300px;
  height: 100%;
`;

const ItemList = styled.div`
  height: 100%;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  background-color: ${(props: IItemListProps) =>
    props.isDraggingOver ? "#f6f7ff" : "inherit"};
`;
const Item = styled.div`
  position: relative;
  padding: 8px;
  border-radius: 4px;
  border: 1px dashed transparent;
  background-color: ${(props: IItemProps) =>
    props.isActive ? "#c7ccec" : props.isDragging ? "#dbdff7" : "inherit"};
  transition: background-color 0.3s;
  .delete-icon {
    display: none;
  }
  &:hover {
    cursor: move;
    border: 1px dashed #c7ccec;
    .delete-icon {
      display: inherit;
    }
  }
`;

const Delete = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #fff;
`;
