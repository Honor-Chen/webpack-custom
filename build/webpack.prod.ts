// *提取 CSS 样式到单独文件中
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// *压缩 CSS 样式
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import { join, resolve } from 'path'

import commonConfig from './webpack.common'

const prodConfig: Configuration = merge(commonConfig, {
  // *生产模式,会开启tree-shaking和压缩代码,以及其他优化
  mode: 'production',
  // *优化配置
  optimization: {
    // *合并含有相同模块的chunks
    mergeDuplicateChunks: true,
    sideEffects: true,
    // chunkIds: 'named', // chunk 文件名称，默认使用算法自动生成的 ID
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          // 提取node_modules代码
          test: /[\\/]node_modules[\\/]/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          // chunks: 'initial', // initial: 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1 // 提取优先级为1
        },
        commons: {
          // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          // chunks: 'initial', // initial: 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 2 // 提取优先级为2
        },
        lodash: {
          name: 'lodash',
          test: /[\\/]node_modules[\\/]lodash/,
          minChunks: 1,
          minSize: 0,
          priority: 3
        }
      }
    },
    runtimeChunk: {
      name: (entrypoint: any) => `runtime-${entrypoint.name}`
    },
    minimize: true,
    minimizer: [
      // *压缩样式插件
      new CssMinimizerWebpackPlugin(),
      // *压缩 JS | CSS 文件
      new TerserWebpackPlugin({
        // *开启多线程压缩
        parallel: true,
        terserOptions: {
          compress: {
            // 移除 console.log
            pure_funcs: ['console.log']
          }
        }
      })
    ]
  },
  // TODO：？？？
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '../public'),
          to: resolve(__dirname, '../dist'),
          // *忽略 index.html 文件
          filter: source => !source.includes('index.html')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      // *抽离css的输出目录和名称
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    // *打包时生成gzip文件
    new CompressionWebpackPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
      // deleteOriginalAssets: true, // 删除源文件
    })

    // *清理无用的CSS，需安装插件：purgecss-webpack-plugin glob-all
    // 清理无用css，检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
    // 只打包这些文件中用到的样式
    // new PurgeCSSPlugin({
    //   paths: globAll.sync(
    //     [`${join(__dirname, '../src')}/**/*`, join(__dirname, '../public/index.html')],
    //     {
    //       nodir: true
    //     }
    //   ),
    //   // 用 only 来指定 purgecss-webpack-plugin 的入口
    //   // https://github.com/FullHuman/purgecss/tree/main/packages/purgecss-webpack-plugin
    //   only: ["dist"],
    //   safelist: {
    //     standard: [/^ant-/] // 过滤以ant-开头的类名，哪怕没用到也不删除
    //   }
    // }),
  ]
})

export default prodConfig
