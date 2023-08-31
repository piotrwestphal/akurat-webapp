import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [react(), VitePWA({
        registerType: 'prompt',
        includeAssets: [],
        manifest: {
            name: 'Kolektiv App',
            short_name: 'Kolektiv',
            icons: [
                {
                    "src": "favicon.png",
                    "sizes": "196x196",
                    "type": "image/png"
                },
                {
                    "src": "manifest-icon-192.maskable.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "manifest-icon-192.maskable.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "maskable"
                },
                {
                    "src": "manifest-icon-512.maskable.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "manifest-icon-512.maskable.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "maskable"
                }
            ],
            theme_color: '#000000',
            background_color: '#ffffff',
            display: 'standalone',
            scope: '/',
            start_url: '.',
            orientation: 'portrait'
        }
    })],
})
