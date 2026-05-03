import type { NodeTypes } from "@xyflow/react";
import { ComponentNode } from "./ComponentNode";
import { TextNode } from "./TextNode";

/** Custom nodes for `<ReactFlow nodeTypes={nodeTypes} />` (@xyflow/react v12). */
export const nodeTypes = {
  component: ComponentNode,
  text: TextNode,
} satisfies NodeTypes;
