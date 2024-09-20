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
      { text: "JMM", link: "/back-end/concurrent/JMM" },
      { text: "volatile", link: "/back-end/concurrent/volatile" },
    ],
  },
  {
    text: "操作系统",
    link: "/back-end/os/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "基础概念", link: "/back-end/os/basic" },
      { text: "进程管理", link: "/back-end/os/process" },
      { text: "内存管理", link: "/back-end/os/memory" },
    ],
  },
 
  {
    text: "计算机网络",
    link: "/back-end/network/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [

    ],
  },
  {
    text: "MySQL",
    link: "/back-end/mysql/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [

    ],
  },
  {
    text: "Redis",
    link: "/back-end/redis/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      
    ],
  },
  {
    text: "开发工具",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "Git", link: "/back-end/devTools/git" },
    ],
  },
];

const frontEndSidebar = [
  {
    text: "前端",
    collapsible: true,
    collapsed: true,
    items: [{ text: "VitePress", link: "/front-end/vitepress" }],
  },
];
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
      { text: "前端", link: "/front-end/index" },
    ],

    // 侧边栏配置
    sidebar: {
      "/back-end/": backEndSidebar,
      "/front-end/": frontEndSidebar,
    },

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/Timegeeker/TimegeekerWiki" },
    ],
  },
});
