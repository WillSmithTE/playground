import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { useMemo } from "react";

import { RelationTuple as Relationship } from "@/spicedb-common/protodefs/core/v1/core_pb";

export type RelationshipNodeType = Node<{
  label: string;
  backgroundColor: string;
  namespace: string;
  objectId: string;
  relationships: Relationship[];
}>;

/**
 * Determines whether text on the given background color should be light or dark
 * by computing the relative luminance (per WCAG 2.0).
 */
function getContrastTextColor(backgroundColor: string): string {
  // Parse hex or rgb(...) color to get r, g, b
  let r = 0,
    g = 0,
    b = 0;

  if (backgroundColor.startsWith("#")) {
    const hex = backgroundColor.slice(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (backgroundColor.startsWith("rgb")) {
    const match = backgroundColor.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0]);
      g = parseInt(match[1]);
      b = parseInt(match[2]);
    }
  }

  // Compute relative luminance per WCAG 2.0
  const sRGB = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  const luminance = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];

  // Use white text on dark backgrounds, dark text on light backgrounds
  return luminance > 0.4 ? "#1a1a1a" : "#ffffff";
}

export function RelationshipNode({ data, selected }: NodeProps<RelationshipNodeType>) {
  const textColor = useMemo(
    () => getContrastTextColor(data.backgroundColor || "#ffffff"),
    [data.backgroundColor],
  );

  return (
    <div
      // TODO: use twmerge/clsx for this.
      className={`
        px-4 py-3 rounded-lg border-2 shadow-md transition-shadow
        ${selected ? "border-blue-500 shadow-lg" : "border-gray-300"}
        hover:shadow-lg
      `}
      // TODO: use tailwind for this.
      style={{
        backgroundColor: data.backgroundColor || "#ffffff",
        color: textColor,
        minWidth: "200px",
        minHeight: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Handle type="source" position={Position.Top} />
      <div className="text-center font-medium text-sm break-all">{data.label}</div>
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
