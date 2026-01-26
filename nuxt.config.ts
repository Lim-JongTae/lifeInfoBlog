// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',  
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/mdc', '@nuxt/image', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/post/*', '/category/*', '/search']
    }
  },
  
  sitemap: {    
    sources: ['/api/__sitemap__/urls']
  },
  ui: {
    fonts: true,
    colorMode: true
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: '생활정보 블로그',
      siteDescription: '금융, 연금, 보험 등 실용적인 생활정보를 제공합니다.',
      adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT || '' 
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
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          langs: [
            'json',
            'javascript',
            'typescript',
            'python',
            'html',
            'css',
            'md',
            'vue'
          ]
        }
      }
    }
  },

  nitro: {
    preset: 'vercel'
  },
  //@ts-ignore
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/admin']
  }
})
