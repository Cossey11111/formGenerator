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
      antd: "antd",
    },
    plugins: [
      new SimpleProgressWebpackPlugin(),
      new webpack.DefinePlugin({
        "process.env.ENV": JSON.stringify(process.argv[2]),
      }),
    ],

    configure: (webpackConfig, { env, paths }) => {
      paths.appBuild = path.join(path.dirname(paths.appBuild), "docs");
      webpackConfig.output = {
        ...webpackConfig.output,
        path: paths.appBuild,
        publicPath: env === "production" ? "./" : "/",
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
              "@menu-dark-item-hover-bg": "fade(#1890ff, 15%)",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
