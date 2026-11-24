import { defineHastPlugin, type HastContent } from "satteri";

/** HAST nodes that are valid as children of an element (i.e. everything but `root`). */
type HastElementChild = Extract<HastContent, { type: "element" }>;

const SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "18",
  height: "18",
  viewBox: "0 0 18 18",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
};

function icon(class_name: string, strokeWidth: string, paths: string[]): HastElementChild {
  return {
    type: "element",
    tagName: "svg",
    properties: { ...SVG_PROPS, class: class_name, "stroke-width": strokeWidth },
    children: paths.map((d) => ({
      type: "element",
      tagName: "path",
      properties: { d },
      children: [],
    })),
  };
}

export const customCodeBlocks = defineHastPlugin({
  name: "custom-code-blocks",
  element: {
    filter: ["pre"],
    visit(node, _) {
      const copyIcon = icon("icon-copy", "1.5", [
        "M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z",
        "M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097",
      ]);
      const checkIcon = icon("icon-check", "2", ["M2.75 9.5L6.5 13.25L15.25 4.5"]);

      const button: HastElementChild = {
        type: "element",
        tagName: "button",
        properties: { class: "copy-code-btn", type: "button", "aria-label": "Copy code" },
        children: [copyIcon, checkIcon],
      };

      const wrapper: HastContent = {
        type: "element",
        tagName: "div",
        properties: { class: "code-wrapper" },
        children: [node, button],
      };

      return wrapper;
    },
  },
});
