# vue3-pinia-browser-run-app
一个不需要打包，直接运行在浏览器环境的 vue3 + pinia + router + element-plus + virtual-scroller 项目模板，直接运行在 http|https 服务上，无需安装任何依赖，无需配置环境，无需安装任何插件，无需安装任何包，只需要在浏览器中打开 index.html 即可。

### 项目引入的技术栈
* 外部技术栈
  * vue3【必须】
  * vue3-sfc-loader【必须】
  * sass.sync.min.js【使用 sass 时必须，用于 helpers/vue3-sfc-loader-helper.js 辅助解析 scss 文件】
  * pinia【必须先引入： vue-demi】
  * vue-router
  * element-plus
  * vue-virtual-scroller
* 内部技术栈
  * helpers/vue3-sfc-loader-helper.js 【必须，非常重要，用于辅助 vue3-sfc-loader 解析 vue、js、scss 等文件，支持别名映射】
  * jsconfig.json 进行别名配置，方便 vscode 进行快捷跳转【别名还需要在 helpers/vue3-sfc-loader-helper.js 中进行配置】


### 项目源码
* 自建 gitlab 地址: https://gitlab.qiushaocloud.top/qiushaocloud/project-eslint-template-apps
* github 地址: https://github.com/qiushaocloud/project-eslint-template-apps



### 项目结构
```markdown
vue3-pinia-browser-run-app
├── assets # 静态资源  
├── helpers # 辅助函数
│   ├── element-plus-helper.mjs # element-plus 辅助函数
│   └── vue3-sfc-loader-helper.js # 辅助 vue3-sfc-loader 解析 vue、js、scss 等文件
├── libs 
│   ├── element-plus@2.8.0 # element-plus 组件库
│   │   ├── icons-vue
│   │   ├── index.css
│   │   └── index.full.js
│   ├── sass.sync.min.js # sass 解析器，用于 helpers/vue3-sfc-loader-helper.js 辅助解析 scss 文件
│   ├── vconsole.min.js # 移动端调试工具
│   ├── vue-router@4 # vue-router 路由库
│   ├── vue-virtual-scroller@2.0.0-beta.8 # vue-virtual-scroller 虚拟滚动库
│   │   ├── vue-virtual-scroller.css
│   │   └── vue-virtual-scroller.min.js
│   ├── vue3-sfc-loader.js # vue3 单文件组件加载器
│   ├── vue@latest # vue3 核心库
│   └── pinia@2.2.2 # pinia 状态管理库
│   │   ├── vue-demi-0.14.10-iife.js # 必须先于 pinia.iife.js 前引入，否则会报错
│   │   └── pinia.iife.js
├── pages # vue 页面
├── scss # sass 样式文件
├── services # 封装的服务层
├── store # pinia 状态管理
└── views # 视图层
├── main.js # 入口文件
├── App.vue # 根组件
├── index.html # 入口 html 文件
├── jsconfig.json # vscode 别名配置
```


#### 开源不易，如果对您有帮助，请您动一动您的小手，给作者点 Star，也请您多多关注分享者「[邱少羽梦](https://www.qiushaocloud.top)」
* 分享者邮箱: [qiushaocloud@126.com](mailto:qiushaocloud@126.com)
* [分享者博客](https://www.qiushaocloud.top)
* [分享者自己搭建的 gitlab](https://gitlab.qiushaocloud.top/qiushaocloud) 
* [分享者 gitee](https://gitee.com/qiushaocloud/dashboard/projects) 
* [分享者 github](https://github.com/qiushaocloud?tab=repositories) 
