import { useEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import type { Dancer, DancerShape } from "../types";

const SHAPES: { shape: DancerShape; label: string }[] = [
  { shape: "circle", label: "Circle" },
  { shape: "square", label: "Square" },
  { shape: "triangle", label: "Triangle" },
  { shape: "diamond", label: "Diamond" },
  { shape: "pentagon", label: "Pentagon" },
];

const VIEW = 24;
const C = VIEW / 2;
const R = 10;

function polygonPoints(sides: number): string {
  return Array.from({ length: sides }, (_, i) => {
    const angle = (2 * Math.PI * i) / sides;
    const x = C + R * Math.sin(angle);
    const y = C - R * Math.cos(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

export function ShapeIcon({
  shape,
  color,
  size = 24,
}: {
  shape: DancerShape;
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      aria-hidden="true">
      {shape === "circle" && <circle cx={C} cy={C} r={R} fill={color} />}
      {shape === "square" && (
        <rect x={C - R} y={C - R} width={R * 2} height={R * 2} fill={color} />
      )}
      {shape === "triangle" && (
        <polygon points={polygonPoints(3)} fill={color} />
      )}
      {shape === "diamond" && (
        <polygon points={polygonPoints(4)} fill={color} />
      )}
      {shape === "pentagon" && (
        <polygon points={polygonPoints(5)} fill={color} />
      )}
    </svg>
  );
}

export interface ItemAppearancePickerProps {
  shape: DancerShape;
  /** HEX value, e.g. "#ff8800" */
  color: string;
  onChange: (next: Pick<Dancer, "shape" | "color">) => void;
}

export function ItemAppearancePicker({
  shape,
  color,
  onChange,
}: ItemAppearancePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the color popover on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} style={styles.root}>
      {/* Shape selection */}
      <div role="radiogroup" aria-label="Shape" style={styles.row}>
        {SHAPES.map(({ shape: s, label }) => {
          const selected = s === shape;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              title={label}
              onClick={() => onChange({ shape: s, color })}
              style={{
                ...styles.shapeButton,
                ...(selected ? styles.shapeButtonSelected : null),
              }}>
              <ShapeIcon shape={s} color={color} />
            </button>
          );
        })}
      </div>

      {/* Color: swatch + hex input, picker in a popover */}
      <div style={styles.row}>
        <button
          type="button"
          aria-label="Open color picker"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{ ...styles.swatch, background: color }}
        />
        <HexColorInput
          color={color}
          onChange={(c) => onChange({ shape, color: c })}
          prefixed
          aria-label="Color (HEX)"
          style={styles.hexInput}
        />
      </div>

      {open && (
        <div style={styles.popover}>
          <HexColorPicker
            color={color}
            onChange={(c) => onChange({ shape, color: c })}
          />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: { display: "flex", alignItems: "center", gap: 6 },
  shapeButton: {
    display: "grid",
    placeItems: "center",
    width: 36,
    height: 36,
    padding: 0,
    border: "1px solid #d0d4da",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
  },
  shapeButtonSelected: {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.3)",
  },
  swatch: {
    width: 28,
    height: 28,
    padding: 0,
    border: "1px solid #8a919c",
    borderRadius: 6,
    cursor: "pointer",
  },
  hexInput: {
    width: 84,
    padding: "4px 8px",
    border: "1px solid #d0d4da",
    borderRadius: 6,
    font: "13px monospace",
    textTransform: "uppercase",
  },
  popover: {
    position: "absolute",
    top: "100%",
    left: 0,
    zIndex: 10,
    marginTop: 4,
    padding: 10,
    background: "#fff",
    border: "1px solid #d0d4da",
    borderRadius: 8,
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
};
