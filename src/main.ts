import app from './App.vue'
import './styles/main.css'
import mountSingleSpaVue from '@alegradev/modules'

const vueLifecycles = mountSingleSpaVue(app, {
  eager: false,
  sentrykey: import.meta.env.SENTRY_KEY
})

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
