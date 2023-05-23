import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-video-player-extended"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
