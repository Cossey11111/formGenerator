const CracoLessPlugin = require("craco-less");
const SimpleProgressWebpackPlugin = require("simple-progress-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    externals: {
      react: "react",
      "react-dom": "react-dom",
      "react-router": "react-router",
      antd: "antd",
    },
    plugins: [
      new SimpleProgressWebpackPlugin(),
      new webpack.DefinePlugin({
        "process.env.ENV": JSON.stringify(process.argv[2]),
      }),
    ],
    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = "docs";
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, "docs"),
        publicPath: "./",
      };
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@tabs-bar-margin": "0px",
              // "@menu-dark-color": "#fff",
              "@menu-dark-item-hover-bg": "fade(#1890ff, 15%)",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
