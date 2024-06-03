import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: `assets/widgetJs.js`,
  //       assetFileNames: `assets/widgetCss.[ext]`,
  //     },
  //   },
  // },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, "src/main.jsx"),
//       name: "MyWidget",
//       formats: ["umd"],
//       fileName: (format) => `my-widget.${format}.js`,
//     },
//     rollupOptions: {
//       external: ["react", "react-dom"],
//       output: {
//         globals: {
//           react: "React",
//           "react-dom": "ReactDOM",
//         },
//       },
//     },
//   },
// });
