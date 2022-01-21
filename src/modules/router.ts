import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

export const install = (app) => {

    const routes = setupLayouts(generatedRoutes)

    console.log(import.meta.env.BASE_URL)
    // TODO: update to use te path given by single-spa main app
    routes.forEach((e, i) => {
        routes[i].path = import.meta.env.BASE_URL + e.path
    });

    const router = createRouter({
        history: createWebHistory(),
        routes
    });

    app.use(router)
}  

