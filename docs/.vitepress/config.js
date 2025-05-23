import { defineConfig } from "vitepress";
// 常量配置
const backEndSidebar = [
  {
    text: "Java",
    link: "/back-end/java/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      {
        text: "基础",
        collapsible: true, // 允许折叠
        collapsed: true, // 默认折叠
        items: [
          { text: "泛型", link: "/back-end/java/basic/Generics" },
          { text: "内部类", link: "/back-end/java/basic/InnerClass" },
          { text: "注解", link: "/back-end/java/basic/Annotations" },
          { text: "方法", link: "/back-end/java/basic/Method" },
        ]
      },
      {
        text: "集合",
        collapsible: true, // 允许折叠
        collapsed: true, // 默认折叠
        items: [
          { text: "集合框架概要", link: "/back-end/java/collection/index" },
        ]
      },
      {
        text: "IO",
        collapsible: true, // 允许折叠
        collapsed: true, // 默认折叠
        items: [
          { text: "NIO", link: "/back-end/java/io/NIO" },
        ]
      },
      {
        text: "Object",
        collapsible: true, // 允许折叠
        collapsed: true, // 默认折叠
        items: [
          { text: "hashCode 和 equals", link: "/back-end/java/object/hashCode 和 equals" },
        ]
      },
      {
        text: "多线程",
        collapsible: true, // 允许折叠
        collapsed: true, // 默认折叠
        items: [
          { text: "Java 中断机制", link: "/back-end/java/thread/中断机制" },
        ]
      },
      {
        text: "工具类",
        collapsible: true, // 允许折叠
        collapsed: true, // 默认折叠
        items: [
          { text: "Arrays 和 Collections", link: "/back-end/java/util/Arrays and Collections" },
        ],
      }
    ],
  },
  {
    text: "并发",
    link: "/back-end/concurrent/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "JMM 详解", link: "/back-end/concurrent/JMM" },
      { text: "指令重排和内存屏障", link: "/back-end/concurrent/指令重排和内存屏障" },
      { text: "volatile", link: "/back-end/concurrent/volatile" },
      
    ],
  },
/*   {
    text: "操作系统",
    link: "/back-end/os/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "基础概念", link: "/back-end/os/basic" },
      { text: "进程管理", link: "/back-end/os/process" },
      { text: "内存管理", link: "/back-end/os/memory" },
    ],
  }, */
 
/*   {
    text: "计算机网络",
    link: "/back-end/network/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [

    ],
  }, */
  {
    text: "Web 开发",
    link: "/back-end/web/",
    collapsible: false, // 允许折叠
    collapsed: false, // 默认折叠
    items: [
      { text: "Spring 事务", link: "/back-end/web/Spring 事务" },
      { text: "Knife4j", link: "/back-end/web/Knife4j" },
      { text: "Sentinel 实现限流", link: "/back-end/web/Sentinel 实现限流" },
      { text: "数据校验", link: "/back-end/web/数据校验" },
      { text: "Spring Resources", link: "/back-end/web/Spring Resources" },
      { text: "Spring IOC", link: "/back-end/web/Spring IOC" },
    ],
  },
  {
    text: "MySQL",
    link: "/back-end/mysql/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "SQL 语句执行流程", link: "/back-end/mysql/SQL 语句执行流程" },
    ],
  },
  {
    text: "Redis",
    link: "/back-end/redis/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "通用命令", link: "/back-end/redis/通用命令" },
    ],
  },
  {
    text: "开发工具",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "Git", link: "/back-end/devTools/git" },
      { text: "Maven", link: "/back-end/devTools/maven" },
    ],
  },
];

/* const frontEndSidebar = [
  {
    text: "前端",
    collapsible: true,
    collapsed: true,
    items: [{ text: "VitePress", link: "/front-end/vitepress" }],
  },
]; */
const base = "/TimegeekerWiki/";

export default defineConfig({
  base,
  title: "TimegeekerWiki",
  description: "持续进化的后端知识库",
  lastUpdated: true,
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ["link", { rel: "icon", href: `${base}favicon.ico` }],
  ],
  themeConfig: {
    logo: "/favicon.ico",
    search: {
      provider: "local",
    },
    outline: [1, 3], // 显示一级到三级标题
    // 顶部导航栏
    nav: [
      { text: "Home", link: "/" },
      { text: "后端", link: "/back-end/index" },
/*       { text: "前端", link: "/front-end/index" },
 */    ],

    // 侧边栏配置
    sidebar: {
      "/back-end/": backEndSidebar,
/*       "/front-end/": frontEndSidebar,
 */    },

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/Timegeeker/TimegeekerWiki" },
    ],
  },
});
