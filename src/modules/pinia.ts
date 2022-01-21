import { createPinia } from 'pinia'

// Setup Pinia
// https://pinia.esm.dev/
export const install = (app) => {
  const pinia = createPinia()
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
}
