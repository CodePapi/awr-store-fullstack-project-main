import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: true,
		}),
	],
	server: {
		host: true, 
		port: 5173, 
		watch: {
		  usePolling: true 
		}
	  },
});
