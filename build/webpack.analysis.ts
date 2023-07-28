// *引入webpack打包速度分析插件
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// *引入 webpack 打包后分析插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// *引入合并webpack配置方法
import { merge } from 'webpack-merge'

// *引入打包配置
import prodConfig from './webpack.prod'

// *实例化分析插件
const smp = new SpeedMeasurePlugin()

// *使用smp.wrap方法,把生产环境配置传进去,由于后面可能会加分析配置,所以先留出合并空位
module.exports = smp.wrap(
  merge(prodConfig, {
    plugins: [new BundleAnalyzerPlugin()]
  })
)
