import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import Toast from 'vue-toastification'
import App from './App.vue'
import type { UserModule } from './types'

// import { routes as customRoutes } from '~/router/index'
import generatedRoutes from '~pages'
import 'vue-toastification/dist/index.css'
import '@unocss/reset/tailwind.css'
import '~/assets/styles/main.scss'
import 'uno.css'

// Combination of automatic routing and custom routing
// const routes = [...autoRoutes, ...customRoutes]

// const routes = setupLayouts(customRoutes)
const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))

    // Add global properties to app.config
    // const app = ctx.app

    ctx.app.use(Toast, { timeout: 2000, pauseOnFocusLoss: false })
    // ctx.app.use(Previewer)
  },
)
