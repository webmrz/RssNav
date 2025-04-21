import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import path from "path";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isExtension = mode === 'extension';
  
  const plugins = [
    vue(),
    viteCompression(),
  ];

  // 如果不是构建扩展，则添加 PWA 插件
  if (!isExtension) {
    plugins.push(VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(woff2|woff|ttf)/,
            handler: "CacheFirst",
            options: {
              cacheName: "file-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
        ],
      },
      manifest: {
        name: "RssNav",
        short_name: "RssNav",
        description: "一个极致简约的导航页",
        display: "standalone",
        start_url: "/",
        theme_color: "#fff",
        background_color: "#efefef",
        icons: [
          {
            src: "/icon/logo-144.png",
            sizes: "144x144",
            type: "image/png",
          },
        ],
      },
    }));
  }

  return {
    base: isExtension ? './' : '/',
    plugins,
    server: {
      port: 5588,
      open: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
      target: "es2015",
      rollupOptions: {
        input: {
          newtab: path.resolve(__dirname, "index.html"),
        },
        output: {
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].[chunkhash].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && /\.css$/.test(assetInfo.name)) {
              return 'assets/style.css';
            }
            return 'assets/[name].[hash][ext]';
          },
          manualChunks: undefined,
        },
      },
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      cssCodeSplit: false,
      sourcemap: false,
      css: {
        devSourcemap: false,
        modules: {
          localsConvention: 'camelCase'
        }
      },
      assetsInlineLimit: 0
    },
  };
}); 