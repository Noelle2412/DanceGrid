import { Group, Text, Circle, Rect, RegularPolygon } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Dancer } from "../types";
import useChoreoSettings from "@/stores/useChoreoSettings";
import usePictures from "@/stores/usePictures";

/** Snap increment while dragging, in meters. */
const SNAP_METERS = 0.25;

const snap = (v: number) => Math.round(v / SNAP_METERS) * SNAP_METERS;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Returns "#000000" or "#ffffff", whichever is easier to read on the given HEX background.
 * Falls back to black if the color can't be parsed.
 */
export function getContrastTextColor(hex: string): "#000000" | "#ffffff" {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex?.trim() || "");
  if (!match) return "#000000";
  let h = match[1];
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.179 ? "#000000" : "#ffffff";
}

export interface DraggableItemProps {
  item: Dancer;
  pixelsPerMeter: number;
  /** Size of the item in meters (square side / circle diameter / polygon circumdiameter) */
  sizeMeters: number;
  /** Label shown in the middle of the item, e.g. the couple number */
  number?: number | string;
  /** Position in meters from the center origin */
  position?: { x: number; y: number };
  /** Called once when a drag ends, with the new position in meters (snapped). */
  onMove: (pos: { x: number; y: number }) => void;
}

export function DraggableItem({
  item,
  pixelsPerMeter,
  sizeMeters,
  number,
  position = { x: 0, y: 0 },
  onMove,
}: DraggableItemProps) {
  const { settings } = useChoreoSettings();
  const [widthMeters, heightMeters] = settings.gridSize;
  const { pictures } = usePictures();

  /** Takes the node's current pixel position, returns the snapped + clamped position in meters. */
  const toSnappedMeters = (node: Konva.Node) => ({
    x: clamp(
      snap(node.x() / pixelsPerMeter),
      -widthMeters / 2,
      widthMeters / 2,
    ),
    y: clamp(
      snap(node.y() / pixelsPerMeter),
      -heightMeters / 2,
      heightMeters / 2,
    ),
  });

  // Live snapping: while dragging, force the node onto the snapped position.
  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const { x, y } = toSnappedMeters(e.target);
    e.target.position({ x: x * pixelsPerMeter, y: y * pixelsPerMeter });
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onMove(toSnappedMeters(e.target));
  };

  const setCursor = (e: KonvaEventObject<MouseEvent>, cursor: string) => {
    const container = e.target.getStage()?.container();
    if (container) container.style.cursor = cursor;
  };

  const sizePx = sizeMeters * pixelsPerMeter;
  const radius = sizePx / 2;
  const shapeProps = { fill: item.color };

  const renderShape = () => {
    switch (item.shape) {
      case "circle":
        return <Circle {...shapeProps} radius={radius} />;
      case "square":
        return (
          <Rect
            {...shapeProps}
            width={sizePx}
            height={sizePx}
            offsetX={radius}
            offsetY={radius}
          />
        );
      case "triangle":
        return <RegularPolygon {...shapeProps} sides={3} radius={radius} />;
      case "diamond":
        return <RegularPolygon {...shapeProps} sides={4} radius={radius} />;
      case "pentagon":
        return <RegularPolygon {...shapeProps} sides={5} radius={radius} />;
      default:
        return <Circle {...shapeProps} radius={radius} />;
    }
  };

  const label = number === undefined ? "" : String(number);
  // Slightly smaller font for multi-digit numbers so they stay inside the shape.
  const fontSize = sizePx * (label.length > 1 ? 0.4 : 0.5);

  // The Group is what gets positioned and dragged: shape and label move together.
  // The rendered position is NOT snapped: whatever the store says is drawn exactly.
  return (
    <Group
      x={position.x * pixelsPerMeter}
      y={position.y * pixelsPerMeter}
      draggable
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onMouseEnter={(e) => setCursor(e, "grab")}
      onMouseLeave={(e) => setCursor(e, "default")}>
      {renderShape()}
      {label !== "" && (
        <Text
          text={label}
          width={sizePx}
          height={sizePx}
          offsetX={radius}
          offsetY={radius}
          align="center"
          verticalAlign="middle"
          fontSize={fontSize}
          fontStyle="bold"
          fill={getContrastTextColor(item.color)}
          // Let mouse events pass through to the group/shape underneath.
          listening={false}
        />
      )}
    </Group>
  );
}
