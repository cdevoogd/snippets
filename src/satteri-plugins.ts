import { defineHastPlugin, type HastContent } from "satteri";

/*
 * Because I'm just trying to target <pre> elements (code blocks), I would expect this plugin to
 * work using a normal, non-raw HAST plugin with an element filter of ["pre"]. That does work when
 * using satteri directly, but not when Astro is handling the HTML conversion. In Astro's
 * markdown-satteri package, they place their plugin for highlighting code blocks before the user
 * plugins. That highlight plugin matches <pre> elements and replaces them all with a highlighted
 * raw node. This means that any plugin afterwards won't have <pre> elements to match against.
 * Because of that, this plugin has to match against raw chunks instead (which sucks).
 *
 * Note: If the Astro project is using MDX, their plugin seems to insert fragments instead of raw
 * nodes. I don't catch those right now, but if MDX is ever used that will need to be handled.
 */
export const customCodeBlocks = defineHastPlugin({
  name: "custom-code-blocks",
  raw(node, _) {
    if (typeof node.value !== "string") return;
    if (!node.value.trimStart().startsWith("<pre")) return;

    const button: HastContent = {
      type: "element",
      tagName: "button",
      properties: { class: "copy-code-btn", type: "button" },
      children: [{ type: "text", value: "copy" }],
    };

    const header: HastContent = {
      type: "element",
      tagName: "div",
      properties: { class: "code-header" },
      children: [button],
    };

    const wrapper: HastContent = {
      type: "element",
      tagName: "div",
      properties: { class: "code-wrapper" },
      children: [header, node],
    };

    return wrapper;
  },
});
