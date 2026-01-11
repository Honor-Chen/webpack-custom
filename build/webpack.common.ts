import { Configuration, DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// *提取 CSS 样式到单独文件中
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { join, resolve } from 'node:path'
import WebpackBar from 'webpackbar'
import * as dotenv from 'dotenv'

const isDev = process.env.NODE_ENV === 'development'

// *加载.env.xx 文件
const envConfig = dotenv.config({
  path: resolve(__dirname, `../env/.env.${process.env.BASE_ENV}`) // !注意：此处是.env.xx
})

const cssRegex = /\.css$/
const lessRegex = /\.less$/
const styleLoadersArray = [
  // *开发环境使用style-loader,打包模式抽离css
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[path][name]__[local]--[hash:5]'
      }
    }
  },
  // *添加 postcss-loader
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['postcss-preset-env']
      }
    }
  }
]

const commonConfig: Configuration = {
  // *入口文件
  entry: join(__dirname, '../src/index.tsx'),
  // *打包出口文件
  output: {
    // *每个输出js的名称
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    // *打包结果输出路径
    path: join(__dirname, '../dist'),
    // *webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    clean: true,
    // *打包后文件的公共前缀路径
    publicPath: '/',
    // *这里自定义输出文件名的方式是，将某些资源发送到指定目录
    assetModuleFilename: 'images/[hash:5][ext][query]'
  },
  cache: {
    // *使用文件缓存
    type: 'filesystem'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.less', '.css', '.json'],
    // *别名需要配置两个地方。地方一：此处 / 地方二：tsconfig.json
    alias: {
      '@': resolve(__dirname, '../src'),
      // *查找第三方模块，只在本项目的 node_modules 中查找
      modules: [resolve(__dirname, '../node_modules')]
    }
  },
  module: {
    rules: [
      {
        // *匹配 .ts | .tsx 文件规则
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['thread-loader', 'babel-loader'] // *推荐：项目过大时再使用 thread-loader 来开启多线程，thread-loader 不支持抽离css插件MiniCssExtractPlugin.loader，所以只能解析 .ts|.tsx 文件
      },
      {
        test: cssRegex,
        use: styleLoadersArray
      },
      {
        test: lessRegex,
        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                importLoaders: 2,
                // *可以加入modules: true，这样就不需要在less文件名加module了
                modules: true,
                // *如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        // *匹配图片文件
        test: /\.(png|jpe?g|gif|svg)$/i,
        // *type选择asset
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // *小于10kb转base64
            maxSize: 20 * 1024
          }
        },
        generator: {
          // *文件输出目录和命名
          filename: 'static/images/[name].[contenthash:8][ext][query]'
        }
      },
      {
        // *匹配JSON文件
        test: /\.json$/,
        // *导出 json 的源代码 ，以前是使用 raw-loader 实现
        type: 'asset/source',
        generator: {
          // *这里专门针对json文件的处理
          filename: 'static/json/[name].[hash][ext][query]'
        }
      },
      {
        // TODO - 匹配字体图标文件，未测试
        test: /.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext][query]'
        }
      },
      {
        // TODO - 匹配媒体文件，未测试
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // *打包后 html 的 title，需要使用:<%= htmlWebpackPlugin.options.title %> 注入
      title: 'W + R + T',
      // *复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: join(__dirname, '../public/index.html'),
      // *自动注入静态资源
      inject: true,
      // *压缩 html 资源
      minify: {
        // *去空格
        collapseWhitespace: true,
        // *去注释
        removeComments: true,
        // *在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyJS: true,
        // *缩小CSS样式元素和样式属性
        minifyCSS: true
      },
      nodeModules: resolve(__dirname, '../node_modules')
    }),
    // *将.env 中配置项注入到业务中
    new DefinePlugin({
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new WebpackBar({
      color: '#85d', // *默认green，进度条颜色支持HEX
      basic: false, // *默认true，启用一个简单的日志报告器
      profile: false // *默认false，启用探查器
      // reporters: {}
    })
  ].filter(Boolean), // *过滤空项
  stats: {
    // chunks: true,
    dependentModules: false, // 是否要展示该 chunk 依赖的其他模块的 chunk 模块
    runtimeModules: false, // 是否要添加运行时模块的信息
    preset: 'minimal' // 设置预设
  }
}

export default commonConfig
