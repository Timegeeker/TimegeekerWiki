import { defineConfig } from "vitepress";

// 常量配置
const backEndSidebar = [
  {
    text: "Java",
    link: "/back-end/java/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [],
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
    text: "并发",
    link: "/back-end/concurrent/",
    collapsible: true, // 允许折叠
    collapsed: true, // 默认折叠
    items: [
      { text: "volatile", link: "/back-end/concurrent/volatile" },
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
];

const frontEndSidebar = [
  {
    text: "前端",
    collapsible: true,
    collapsed: true,
    items: [{ text: "VitePress", link: "/front-end/vitepress" }],
  },
];

export default defineConfig({
  title: "TimegeekerWiki",
  description: "持续进化的后端知识库",
  lastUpdated: true,
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    ["link", { rel: "icon", href: `/favicon.ico` }],
  ],
  themeConfig: {
    logo: "/favicon.ico",
    search: {
      provider: "local",
    },

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
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
