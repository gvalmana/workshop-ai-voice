import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

export const install = (app) => {

    generatedRoutes.forEach((e, i) => {
        generatedRoutes[i].path = import.meta.env.BASE_URL.slice(0, -1) + e.path
    });

    const routes = setupLayouts(generatedRoutes)

    const router = createRouter({
        history: createWebHistory(),
        routes
    });

    app.use(router)
}  

