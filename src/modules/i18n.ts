import { createI18n } from 'vue-i18n'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
const messages = Object.fromEntries(
  Object.entries(
    import.meta.globEager('../../locales/*.y(a)?ml'))
    .map(([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(14, yaml ? -5 : -4), value.default]
    }),
)

export const install = (app) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'es',
    messages,
    // INFO: las applicaciones que no usen el vue-router deben activar esta linea, por defecto vue-i18n
    // agrega la carga de traducciones al componente de la ruta actual para optimizar la velocidad
    // de carga de las traducciones
    // globalInjection: true
  })

  app.use(i18n)
}
