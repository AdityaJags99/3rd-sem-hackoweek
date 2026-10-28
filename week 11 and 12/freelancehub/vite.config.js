import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/' keeps asset paths absolute, so they also work on nested routes
// such as /freelancers/f1 when the page is refreshed.
export default defineConfig({
    plugins: [react()],
    base: '/'
});
