import { resolve } from "path";
import vue from '@vitejs/plugin-vue';
function pathResolve(dir:any) {
    return resolve(__dirname, ".", dir);
}

export default ({
    base: "",
    plugins:[vue()],
    resolve: {
        alias: {
            "/@": pathResolve("src"),
        }
    },
    optimizeDeps: {
        include: ['axios'],
    },
    build: {
        target: 'modules',
        outDir: 'dist',
        assetsDir: 'assets',
        minify: 'terser' // 混淆器
    },
    server: {
        cors: true,
        open: true,
   /*     proxy: {
            '/api': {
                target: 'http://192.168.99.223:3000',   //代理接口
                changeOrigin: true,
                rewrite: (path:any) => path.replace(/^\/api/, '')
            }
        }*/
    }
});
