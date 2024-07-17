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
  integrations: [
    starlight({
      title: "Snippets",
      social: {
        github: "https://github.com/cdevoogd/snippets",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        sidebarDir("Ansible", "ansible"),
        sidebarDir("Caddy", "caddy"),
        sidebarDir("C++", "cpp"),
        sidebarDir("Docker", "docker"),
        sidebarDir("Go", "go"),
        sidebarDir("Linux", "linux"),
        sidebarDir("Shell", "shell"),
        sidebarDir("Tools", "tools"),
      ],
    }),
  ],
});
