## 重要概念
::: info
项目根目录 (project root) 和源目录 (source directory)
:::

1. 项目根目录：`.vitepress`。`.vitepress`目录是 VitePress 配置文件、开发服务器缓存、构建输出和可选主题自定义代码的预留位置。可以理解为**配置目录**。
2. 源目录：Markdown 源文件存在的目录。

## 目录结构
```plaintext
my-vitepress-site
│
├── docs                   # 主文档文件夹
│   ├── index.md           # 主页的 Markdown 文件
│   └── .vitepress         # VitePress 的配置文件夹
│       ├── config.js      # 主配置文件
│       ├── theme          # 自定义主题文件夹 (可选)
│       │   └── index.js   # 主题的入口文件 (可选)
│       └── public         # 静态资源文件夹 (可选，如图片等)
└── package.json           # 项目配置文件
```


