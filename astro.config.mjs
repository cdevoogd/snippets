import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

function sidebarDir(name, path) {
  return {
    label: name,
    collapsed: true,
    autogenerate: {
      directory: path,
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://snippets.cdevoogd.com",
  integrations: [
    starlight({
      title: "Snippets",
      pagination: false,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/cdevoogd/snippets' },
      ],
      customCss: ["./src/styles/custom.css"],
      components: {
        ThemeProvider: "./src/components/ThemeProvider.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
      },
      expressiveCode: {
        themes: ["catppuccin-mocha", "catppuccin-latte"],
      },
      sidebar: [
        sidebarDir("Ansible", "ansible"),
        sidebarDir("Caddy", "caddy"),
        sidebarDir("C++", "cpp"),
        sidebarDir("Docker", "docker"),
        sidebarDir("Git", "git"),
        sidebarDir("Go", "go"),
        sidebarDir("Linux", "linux"),
        sidebarDir("Shell", "shell"),
        sidebarDir("Tools", "tools"),
      ],
    }),
  ],
});
