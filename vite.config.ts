import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import fs from "node:fs";
import path from "node:path";

const virtualMenuId = "virtual:menu-config";
const resolvedVirtualMenuId = `\0${virtualMenuId}`;

const menuConfigPlugin = () => ({
  name: "menu-config",
  resolveId(id: string) {
    return id === virtualMenuId ? resolvedVirtualMenuId : null;
  },
  load(id: string) {
    if (id !== resolvedVirtualMenuId) return null;

    const menuPath = path.resolve(process.cwd(), "menu.json");

    try {
      const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));
      return `export default ${JSON.stringify(Array.isArray(menu) ? menu : [])}`;
    } catch {
      return "export default []";
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    menuConfigPlugin(),
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
