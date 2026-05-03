import { toPng, toSvg } from "html-to-image";
import type { Node, Edge } from "@xyflow/react";
import type { Stroke } from "@/store/penStore";

function getTimestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getReactFlowWrapper(): HTMLElement {
  const el = document.querySelector<HTMLElement>(".react-flow");
  if (!el) throw new Error("Could not find ReactFlow element");
  return el;
}

export async function exportAsPng(problemName: string): Promise<void> {
  const wrapper = getReactFlowWrapper();
  const filename = `${slugify(problemName)}-hld-${getTimestamp()}.png`;

  const dataUrl = await toPng(wrapper, {
    backgroundColor: "#18181b", // zinc-900
    quality: 1,
    pixelRatio: 2,
    filter: (node) => {
      // Exclude minimap, controls, and attribution from export
      if (node instanceof HTMLElement) {
        const cls = node.classList;
        if (
          cls?.contains("react-flow__minimap") ||
          cls?.contains("react-flow__controls") ||
          cls?.contains("react-flow__attribution") ||
          cls?.contains("react-flow__panel")
        ) {
          return false;
        }
      }
      return true;
    },
  });

  triggerDownload(dataUrl, filename);
}

export async function exportAsSvg(problemName: string): Promise<void> {
  const wrapper = getReactFlowWrapper();
  const filename = `${slugify(problemName)}-hld-${getTimestamp()}.svg`;

  const dataUrl = await toSvg(wrapper, {
    backgroundColor: "#18181b",
    filter: (node) => {
      if (node instanceof HTMLElement) {
        const cls = node.classList;
        if (
          cls?.contains("react-flow__minimap") ||
          cls?.contains("react-flow__controls") ||
          cls?.contains("react-flow__attribution") ||
          cls?.contains("react-flow__panel")
        ) {
          return false;
        }
      }
      return true;
    },
  });

  triggerDownload(dataUrl, filename);
}

export function exportAsJSON(
  nodes: Node[],
  edges: Edge[],
  problemName: string,
  strokes: Stroke[] = []
): void {
  const filename = `${slugify(problemName)}-hld-${getTimestamp()}.json`;
  const payload = JSON.stringify(
    { name: problemName, nodes, edges, strokes },
    null,
    2
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
