import WebpackDevServer, { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import { Configuration as WebpackConfiguration, webpack } from 'webpack'
import { merge } from 'webpack-merge'
import { join } from 'node:path'

import commonConfig from './webpack.common'
/*
	运行命令的时候重启一次打开一个tab 页很烦，所以呢优化一下
	参考：create-react-app 的启动方式
	https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openChrome.applescript
	记得关闭webpack-dev-server的配置中的自动打开 open: false 或者注释
*/
// const openBrowser = require('./utils/openBrowser')

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const host = '127.0.0.1'
const port = '8082'

// *合并公共配置,并添加开发环境配置
const devConfig: Configuration = merge(commonConfig, {
  // *开发模式,打包更加快速,省了代码优化步骤
  mode: 'development',

  /*
		开发环境推荐：eval-cheap-module-source-map
    - 本地开发首次打包慢点没关系,因为 eval 缓存的原因, 热更新会很快
    - 开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 cheap
    - 我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 module
	*/
  devtool: 'eval-cheap-module-source-map'
})

const devServer = new WebpackDevServer(
  {
    host,
    port,
    open: false, // 是否自动打开
    compress: false, // gzip压缩,开发环境不开启，提升热更新速度
    hot: true, // 开启热更新
    historyApiFallback: true, // 解决history路由404问题
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    static: {
      directory: join(__dirname, '../public') // 托管静态资源public文件夹
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    client: {
      progress: true, // 是否显示进度
      reconnect: 3 // 重连次数
    },
    proxy: {}
    /* setupMiddlewares: (middlewares, devServer) => {
		console.log("🌐 ~ file: webpack.dev.ts:56 ~ devServer:", devServer)
		console.log("🌐 ~ file: webpack.dev.ts:56 ~ middlewares:", middlewares)
		return middlewares
	} */
  },
  webpack(devConfig)
)

devServer.start().then(() => {
  // *启动界面
  // openBrowser(`http://${host}:${port}`)
  console.log('🌐 ~ file: webpack.dev.ts:57 ~ devServer.start')
})

export default devConfig
