import { Button, message, PageHeader } from "antd";
import styled from "styled-components";
import { EyeOutlined, CopyOutlined } from "@ant-design/icons";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import React, { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { useClipboard } from "use-clipboard-copy";
import {
  IGeneratorConf,
  inputConf,
  generateConfs,
} from "@/Components/Generator/config";
import OptionPanel from "./ResourcePanel";
import ParamsPanel from "./ConfigPanel";
import Run from "./RunCode";
import Content, { IContentRefHandle } from "./ContentPanel";
import { clone, cloneDeep } from "lodash";
import makeupTsx from "@/Components/Generator/makeupTsx";
import JsonModal from "./JsonModal";

/**
 * home page
 */
const Home: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const activeInitialIndex = uuid();

  const [data, setData] = useState<IGeneratorConf[]>([
    {
      ...cloneDeep(inputConf),
      id: activeInitialIndex,
    },
  ]);
  const [activeIndex, setActiveIndex] = useState<string>(activeInitialIndex); // uniq key of an config item
  const [jsonVisible, setJsonVisible] = useState<boolean>(false);
  const clipboard = useClipboard({
    copiedTimeout: 3000,
    onSuccess() {
      message.success("Code was copied successfully!");
    },
    onError() {
      message.error("Failed to copy code!");
    },
  });

  const handleSelect = (id: string) => {
    setActiveIndex(id);
  };

  const dragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    const exchangeItems = () => {
      const dIndex = destination.index;
      const sIndex = source.index;
      const temp = data[sIndex];
      data.splice(sIndex, 1);
      data.splice(dIndex, 0, temp);
    };
    const addItem = () => {
      const temp = cloneDeep(
        generateConfs[draggableId] || generateConfs["input"]
      );
      temp.__config__.name = `${temp.__config__.name}_${uuid()}`;
      data.splice(destination.index, 0, {
        ...temp,
        id: uuid(),
      });
    };
    source.droppableId === "content-panel" ? exchangeItems() : addItem();

    setActiveIndex(data[destination.index].id);
    setData(data);
  };

  const handleDelete = (id: string) => {
    const temp = data.filter((v) => id !== v.id);
    if (id === activeIndex) {
      setActiveIndex(temp[0] ? data[0].id : "");
    }
    setData(temp);
  };

  const contentRef = useRef<IContentRefHandle>();

  const changeData = (changeValues: { [key: string]: any }) => {
    const curItem = data.find((v) => v.id === activeIndex);
    if (!curItem) {
      return;
    }
    Object.keys(changeValues).forEach((key) => {
      if (key === "__config__") {
        const name = curItem.__config__.name;
        contentRef.current?.setFieldsValue(
          name,
          changeValues.__config__.defaultValue
        );
      }
      curItem[key] = changeValues[key] || undefined;
    });
  };

  const handleValueChange = (params: { [key: string]: any }) => {
    changeData(params);
    setData(clone(data));
  };

  const generate = () => {
    const tsx = makeupTsx(data);
    const str = prettier.format(tsx, {
      parser: "babel",
      plugins: [parserBabel],
    });
    console.log(str);
    return str;
  };

  const handleCopyCode = () => {
    if (clipboard.copied) {
      return;
    }
    const code = generate();
    clipboard.copy(code);
  };

  const handleViewJson = () => {
    setJsonVisible(true);
  };

  return (
    <StyledHome>
      <PageHeader
        title="Generators"
        extra={[
          <Run data={data} key="run"></Run>,
          <Button
            key="json"
            type="link"
            icon={<EyeOutlined />}
            onClick={handleViewJson}
          >
            View Json
          </Button>,

          <Button
            type="link"
            key="copy"
            icon={<CopyOutlined />}
            onClick={handleCopyCode}
          >
            Copy Code
          </Button>,
        ]}
      />
      <Container>
        <DragDropContext onDragEnd={dragEnd}>
          <OptionPanel />
          <ParamsPanel
            data={data.find((v) => v.id === activeIndex)}
            onValueChange={handleValueChange}
          />
          <Container ref={ref}>
            <Content
              data={data}
              activeIndex={activeIndex}
              onDelete={handleDelete}
              onSelect={handleSelect}
              ref={contentRef}
            />
          </Container>
        </DragDropContext>
      </Container>

      <JsonModal
        json={data}
        visible={jsonVisible}
        onClose={() => setJsonVisible(false)}
        onEdit={(data: string) => {
          const temp = JSON.parse(data);
          if (temp) {
            setData(temp);
          }
        }}
      />
    </StyledHome>
  );
};

export default Home;

const StyledHome = styled.div`
  height: 100%;
`;

const Container = styled.div`
  height: calc(100vh - 73px);
  background-color: #fff;
`;
