// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',  
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxt/image', '@nuxtjs/supabase', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/post/*', '/category/*', '/search']
    }
  },
  ui: {
    fonts: true,
    colorMode: true
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: '생활정보 블로그',
      siteDescription: '금융, 연금, 보험 등 실용적인 생활정보를 제공합니다.'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '스마트 생활정보',
      meta: [
        { name: 'description', content: '금융, 연금, 보험 등 실용적인 생활정보를 제공합니다.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ko_KR' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icon.png'
        }
      ]
    }
  },

  nitro: {
    preset: 'vercel'
  }
})
