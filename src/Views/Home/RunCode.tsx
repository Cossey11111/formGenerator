import { PlayCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import LZString from "lz-string";
import makeupJs from "@/Components/Generator/makeupTsx";
import { IGeneratorConf } from "../../Components/Generator/config";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
interface IProps {
  data: IGeneratorConf[];
}

function compress(str: string) {
  return LZString.compressToBase64(str)
    .replace(/\+/g, "-") // Convert '+' to '-'
    .replace(/\//g, "_") // Convert '/' to '_'
    .replace(/=+$/, ""); // Remove ending '='
}

const CodeEditor: React.FC<IProps> = (props) => {
  const { data } = props;

  const run = () => {
    let jsCode = makeupJs(data);
    jsCode =
      `import ReactDOM from 'react-dom'` +
      jsCode +
      `ReactDOM.render(
      <FormPage />,
      document.getElementById('root')
    );`;

    const formatCode = prettier.format(jsCode, {
      parser: "babel",
      plugins: [parserBabel],
    });

    const code = formatCode.replace("export default FormPage;", "");

    const form = document.createElement("form");
    form.action = "https://codesandbox.io/api/v1/sandboxes/define";
    form.method = "POST";
    form.target = "_blank";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "parameters";
    input.value = compress(
      JSON.stringify({
        files: {
          "package.json": {
            content: {
              dependencies: {
                react: "17.0.2",
                "react-dom": "17.0.2",
                antd: "4.18.2",
                "@types/react": "17.0.38",
                "@types/react-beautiful-dnd": "13.1.2",
                "@types/react-dom": "17.0.11",
                "@types/react-syntax-highlighter": "13.5.2",
                "@ant-design/icons": "4.7.0",
              },
            },
          },
          "index.tsx": {
            content: code,
          },
          "index.html": {
            content: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.18.3/antd.min.css" crossorigin="anonymous"
            referrerpolicy="no-referrer" /> <style>#root {padding: 20px}</style><div id="root"></div>`,
          },
        },
      })
    );
    console.log(code);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <Button key="run" type="link" icon={<PlayCircleOutlined />} onClick={run}>
      Run
    </Button>
  );
};

export default CodeEditor;
