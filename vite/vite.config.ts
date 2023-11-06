/**
 * 自用vite配置文件
 * "vite": "^4.4.9",
 * "vue": "^3.2.45",
 */
import { defineConfig } from "vite"; //vite
import vue from "@vitejs/plugin-vue"; //vue
import path from "path"; //path 路径
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"; //vite关于svg的处理插件
import AutoImport from "unplugin-auto-import/vite"; //vite自动导入插件
import Components from "unplugin-vue-components/vite"; //vite自动导入插件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; //ElementPlu自动按需导入
import viteCompression from "vite-plugin-compression"; //vite打包插件
import viteImagemin from "vite-plugin-imagemin"; //图片压缩
//国内用户安装需要在电脑host文件（C：\Windows\System32\drivers\etc）上加下以下配置：
//199.232.4.133 raw.githubusercontent.com

//项目打包名称
const timestampToTime = () => {
  const date = new Date();
  const M =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}_`;
  const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const h = date.getHours();
  const m =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `项目名称_${M}${D}_${h}·${m}`;
};

export default defineConfig({
  plugins: [
    vue(), //vue
    Components({
      resolvers: [ElementPlusResolver()], //ElementPlu自动按需导入
      dts: true, // 会在根目录生成auto-imports.d.ts，里面可以看到自动导入的api
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()], //ElementPlu自动按需导入
      imports: ["vue"], // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
    viteCompression({
      verbose: false, //是否在控制台输出压缩结果，默认为 true
      disable: false, //是否禁用压缩，默认为 false
      deleteOriginFile: true, //压缩后是否删除原文件，默认为 false
      threshold: 10240, //如果体积大于阈值，则进行压缩，单位为b
      algorithm: "gzip", //压缩算法，本配置选用gzip
      ext: ".gz", //生成的压缩包的后缀
    }),
    viteImagemin({
      gifsicle: {
        // gif图片压缩
        optimizationLevel: 7, // 选择0到7之间的优化级别
        interlaced: false, // 隔行扫描gif进行渐进式渲染
        // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间
      },
      optipng: {
        // png
        optimizationLevel: 7, // 选择0到7之间的优化级别
      },
      mozjpeg: {
        // jpeg
        quality: 20, // 压缩质量，范围从0(最差)到100(最佳)。
      },
      pngquant: {
        // png
        quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
        speed: 4, // 压缩速度，1(强力)到11(最快)
      },
      svgo: {
        // svg压缩
        plugins: [
          {
            name: "removeViewBox",
          },
          {
            name: "removeEmptyAttrs",
            active: false,
          },
        ],
      },
    }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // css全局变量
        additionalData:
          '@import "./src/assets/styles/mixin.scss";@import "./src/assets/styles/variables.scss";', // 引入css全局变量文件
      },
    },
  },
  build: {
    outDir: timestampToTime(), //打包后文件目录
    minify: "terser", //设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器
    terserOptions: {
      compress: {
        drop_console: true, //删除打包后脚本文件里的所有console
        drop_debugger: true, //删除打包后脚本文件里的所有debugger
      },
    },
    //打包文件按照类型分文件夹显示
    rollupOptions: {
      output: {
        manualChunks(id) {
          //大文件分割
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
        chunkFileNames: "js/[name]-[hash].js", //文件分类
        entryFileNames: "js/[name]-[hash].js", //文件分类
        assetFileNames: "[ext]/[name]-[hash].[ext]", //文件分类
      },
    },
  },
  server: {
    port: 5173, // 设置服务启动端口号
    open: true, //自动打开
    base: "./ ", //生产环境路径
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // 正则表达式写法
      "^/api": {
        target: "https://xxxxx", // 后端服务实际地址
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
