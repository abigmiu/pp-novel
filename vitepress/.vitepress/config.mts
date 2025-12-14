import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "开发记录",
  description: "西红柿小说开发记录",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开始', link: '/server' },
    ],

    sidebar: [
      {
        text: '后端',
        items: [
          { text: '邮件', link: '/server/mail' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
