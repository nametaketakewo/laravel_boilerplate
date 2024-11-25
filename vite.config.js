import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: true,
        strictPort: true,
        hmr: {
            clientPort: parseInt((process.env.PORT_PREFIX ?? '0') + '5173'),
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
