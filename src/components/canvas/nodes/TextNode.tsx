"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { type NodeProps, type Node, NodeResizer } from "@xyflow/react";

export interface TextNodeData {
  text: string;
  fontSize?: "sm" | "base" | "lg";
  [key: string]: unknown;
}

type TextNodeType = Node<TextNodeData, "text">;

const FONT_SIZE_CLASS: Record<string, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const PLACEHOLDER = "Double-click to edit";

function TextNodeInner({ data, selected, id }: NodeProps<TextNodeType>) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(data.text || PLACEHOLDER);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fontClass = FONT_SIZE_CLASS[data.fontSize ?? "sm"] ?? "text-sm";

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const displayText = editing ? text : (data.text || PLACEHOLDER);
  const isPlaceholder = displayText === PLACEHOLDER;

  const commitEdit = useCallback(() => {
    setEditing(false);
    const next = text.trim() === "" ? PLACEHOLDER : text;
    if (text.trim() === "") setText(PLACEHOLDER);
    const event = new CustomEvent("textnode:update", {
      detail: { id, text: next },
    });
    window.dispatchEvent(event);
  }, [text, id]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setText(data.text || "");
      setEditing(true);
    },
    [data.text],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        commitEdit();
      }
    },
    [commitEdit],
  );

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={48}
        lineClassName="!border-cyan-500/40"
        handleClassName="!h-2 !w-2 !rounded-sm !border !border-cyan-500 !bg-cyan-500/80"
      />
      <div
        className={`
          flex h-full w-full min-h-[48px] min-w-[140px] flex-col overflow-hidden rounded-md transition-colors duration-150
          ${selected ? "border border-dashed border-border bg-card/90 dark:bg-zinc-900/60" : "border border-transparent"}
          ${!selected && !editing ? "hover:bg-muted/60 dark:hover:bg-zinc-900/50" : ""}
          ${editing ? "border border-dashed border-cyan-600/50 bg-muted/80 dark:border-zinc-500 dark:bg-zinc-900/70" : ""}
        `}
        onDoubleClick={handleDoubleClick}
      >
        {editing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            wrap="soft"
            className={`nodrag nowheel h-full w-full flex-1 resize-none whitespace-pre-wrap break-words bg-transparent px-3 py-2 font-mono text-foreground outline-none placeholder:text-muted-foreground ${fontClass}`}
            style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
          />
        ) : (
          <div className="nowheel h-full w-full flex-1 overflow-auto px-3 py-2">
            <pre
              className={`m-0 whitespace-pre-wrap break-words font-mono text-foreground ${fontClass} ${
                isPlaceholder ? "italic text-muted-foreground" : ""
              }`}
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {displayText}
            </pre>
          </div>
        )}
      </div>
    </>
  );
}

function areTextNodePropsEqual(
  prev: NodeProps<TextNodeType>,
  next: NodeProps<TextNodeType>,
): boolean {
  return (
    prev.selected === next.selected &&
    prev.data.text === next.data.text &&
    prev.data.fontSize === next.data.fontSize
  );
}

export const TextNode = memo(TextNodeInner, areTextNodePropsEqual);
