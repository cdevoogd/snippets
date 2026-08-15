import { defineHastPlugin, type HastContent } from "satteri";

export const customCodeBlocks = defineHastPlugin({
  name: "custom-code-blocks",
  element: {
    filter: ["pre"],
    visit(node, _) {
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
  },
});
