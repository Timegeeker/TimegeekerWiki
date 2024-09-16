---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "TimegeekerWiki"
  text: "持续进化的后端知识库"
  tagline: 知行合一，行胜于言
  image:
    src: /growth.png
  actions:
    - theme: brand
      text: 后端
      link: /back-end
    - theme: brand
      text: Java
      link: /back-end/java/
    - theme: brand
      text: 操作系统
      link: /back-end/os/
    - theme: brand
      text: 并发
      link: /back-end/concurrent/
    - theme: brand
      text: 计算机网络
      link: /back-end/network/
    - theme: brand
      text: MySQL
      link: /back-end/mysql/
    - theme: brand
      text: Redis
      link: /back-end/redis/

features:
  - icon: 📝
    title: 个人博客
    details: 写给自己的博客，记录自己的技术成长历程
  - icon: 👏
    title: 技术分享
    details: 通过分享知识和经验，努力成为一个对他人有价值的人
  - icon: 🔭
    title: 自我提升
    details: 持续学习新技能，探索更多可能性，保持进步
  - icon: 📸
    title: 关注时间
    details: 让时间陪着自己慢慢成长，进一寸有一寸的欢喜

---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  /* 新增的变量用于图片尺寸控制 */
  --vp-home-hero-image-width: 500px; 
  --vp-home-hero-image-height: 300px; 
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

/* 使用更高优先级的选择器并加上 !important */
.vp-home .vp-home-hero img,
.image-src {
  width: var(--vp-home-hero-image-width) !important;
  height: var(--vp-home-hero-image-height) !important;
  max-width: unset !important; /* 取消原有的 max-width 限制 */
  max-height: unset !important; /* 取消原有的 max-height 限制 */
}
</style>

