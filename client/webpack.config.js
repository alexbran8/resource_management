const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const enableBundleAnalyzer = process.env.ENABLE_ANALYZER === "true";
const regeneratorRuntime = require("regenerator-runtime");

const watch = process.env.NODE_ENV !== 'production'
console.log('ENV',process.env.NODE_ENV)

process.env.NODE_ENV == "development" ? location = "/" : location = "/nptbeta"

// const location = process.env.NODE_ENV !== 'production'

module.exports = {
  context: __dirname,
  entry: path.resolve(__dirname, "src/index.tsx"),
  // devtool: "inline-source-map",
  output: {
    path: path.join(__dirname, '/public/dist/'),
    filename: 'main.js',
    publicPath: location,
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    hot: true,
  },
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      { test: /\.(t|j)sx?$/, use: { loader: "babel-loader" } },
      {
        test: /.(js|jsx)$/,
        exclude:  path.resolve(__dirname, "node_modules"),
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-runtime",
              ],
            },
          },
        ],
      },
      {
        test: /.*\.(gif|png|jp(e*)g|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 21000,
              name: "images/[name]_[hash:7].[ext]",
            },
          },
        ],
      },
      // Vendor CSS loader
      // This is necessary to pack third party libraries like antd
      {
        test: /\.css$/,
        // include: path.resolve(__dirname, "../node_modules"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    // new ManifestPlugin(),
    new CleanWebpackPlugin(),
    // new OptimizeCssAssetsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
      chunkFilename: "[id].[hash:8].css",
    }),
    // new ManifestPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: enableBundleAnalyzer === true ? "static" : "disabled",
      openAnalyzer: true,
    }),
  ],
  watch
}