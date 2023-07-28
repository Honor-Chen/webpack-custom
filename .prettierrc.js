module.exports = {
  // 在语句末尾添加分号，默认是 true
  semi: false,

  // 换行符
  endOfLine: 'lf',

  // 字符串是否使用单引号，默认是 false
  singleQuote: true,

  // 一个tab代表几个空格数，默认就是2
  tabWidth: 2,

  // 是否启用tab取代空格符缩进，.editorconfig设置空格缩进，所以设置为false
  useTabs: false,

  // *一行的字符数，如果超过会进行换行
  printWidth: 280,

  // *对象或数组末尾是否添加逗号 none| es5| all
  trailingComma: 'none',

  // *对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  bracketSpacing: true,

  // *箭头函数如果只有一个参数则省略括号
  arrowParens: 'avoid',

  // 在jsx里是否使用单引号，你看着办
  jsxSingleQuote: true
}
