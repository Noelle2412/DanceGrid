import { Shape } from "react-konva";
import useChoreoSettings from "@/stores/useChoreoSettings";

export interface GridProps {
  /** How many screen pixels one meter takes */
  pixelsPerMeter: number;
  lineColor?: string;
  axisColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}

/**
 * Draws a grid with one line per meter, centered on the origin (0, 0).
 * The grid spans -width/2 .. width/2 and -height/2 .. height/2 (in meters).
 *
 * Must be placed in a Layer whose origin is at the center of the stage.
 * Lines fall on whole meters relative to the origin, so the x=0 and y=0
 * lines always exist (they are drawn slightly darker as axes).
 */
export function Grid({
  pixelsPerMeter,
  lineColor = "#d0d4da",
  axisColor = "#a3a9b3",
  borderColor = "#8a919c",
  backgroundColor = "#ffffff",
}: GridProps) {
  const { settings } = useChoreoSettings();
  const widthMeters = settings.gridSize[0];
  const heightMeters = settings.gridSize[1];
  const halfW = (widthMeters / 2) * pixelsPerMeter;
  const halfH = (heightMeters / 2) * pixelsPerMeter;

  return (
    <Shape
      listening={false}
      sceneFunc={(ctx) => {
        // Background
        ctx.beginPath();
        ctx.rect(-halfW, -halfH, halfW * 2, halfH * 2);
        ctx.fillStyle = backgroundColor;
        ctx.fill();

        // Whole-meter lines (excluding the axes and the border)
        const minX = Math.ceil(-widthMeters / 2);
        const maxX = Math.floor(widthMeters / 2);
        const minY = Math.ceil(-heightMeters / 2);
        const maxY = Math.floor(heightMeters / 2);

        ctx.beginPath();
        for (let x = minX; x <= maxX; x++) {
          const px = x * pixelsPerMeter;
          if (x === 0 || Math.abs(px) === halfW) continue;
          ctx.moveTo(px, -halfH);
          ctx.lineTo(px, halfH);
        }
        for (let y = minY; y <= maxY; y++) {
          const py = y * pixelsPerMeter;
          if (y === 0 || Math.abs(py) === halfH) continue;
          ctx.moveTo(-halfW, py);
          ctx.lineTo(halfW, py);
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Axes through the origin
        ctx.beginPath();
        ctx.moveTo(0, -halfH);
        ctx.lineTo(0, halfH);
        ctx.moveTo(-halfW, 0);
        ctx.lineTo(halfW, 0);
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Border
        ctx.beginPath();
        ctx.rect(-halfW, -halfH, halfW * 2, halfH * 2);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }}
    />
  );
}
