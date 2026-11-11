import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Rect,
  Circle,
  Polygon,
  Line,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Couple, Dancer, DancerShape, Picture, Role } from "../types";

export interface ChoreoPdfProps {
  name: string;
  gridSize: [number, number]; // [width x, length y]
  soloMode: boolean;
  couples: Couple[];
  pictures: Picture[];
}

const s = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  h1: { fontSize: 24, marginBottom: 16 },
  h2: { fontSize: 14, marginTop: 18, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  num: { width: 26 },
  name: { marginLeft: 8 },
  cols: { flexDirection: "row" },
  col: { flex: 1 },
  comment: { marginTop: 16, fontSize: 10, color: "#444" },
});

/* ---------------- helpers ---------------- */

const polygonPoints = (sides: number, cx: number, cy: number, r: number) =>
  Array.from({ length: sides }, (_, i) => {
    const a = ((-90 + (360 / sides) * i) * Math.PI) / 180;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

// white or black text depending on background brightness
const textColorFor = (hex: string) => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#000" : "#fff";
};

const sortedCouples = (couples: Couple[]) =>
  [...couples].sort((a, b) => a.number - b.number);

const sortedPictures = (pictures: Picture[]) =>
  [...pictures].sort((a, b) => a.order - b.order);

const findPos = (pic: Picture, coupleNumber: number, role: Role) =>
  pic.coordinates.find(
    (c) => c.coupleNumber === coupleNumber && c.role === role,
  );

/* ---------------- shapes ---------------- */

function Marker({
  dancer,
  cx,
  cy,
  size,
  label,
}: {
  dancer: Dancer;
  cx: number;
  cy: number;
  size: number;
  label?: number;
}) {
  const r = size / 2;
  const { shape, color } = dancer;
  return (
    <>
      {shape === "circle" && <Circle cx={cx} cy={cy} r={r} fill={color} />}
      {shape === "square" && (
        <Rect x={cx - r} y={cy - r} width={size} height={size} fill={color} />
      )}
      {shape === "triangle" && (
        <Polygon points={polygonPoints(3, cx, cy, r * 1.15)} fill={color} />
      )}
      {shape === "diamond" && (
        <Polygon points={polygonPoints(4, cx, cy, r * 1.25)} fill={color} />
      )}
      {shape === "pentagon" && (
        <Polygon points={polygonPoints(5, cx, cy, r * 1.1)} fill={color} />
      )}
      {label !== undefined && (
        <Text
          x={cx}
          y={cy + size * 0.18}
          style={{ fontSize: size * 0.5 }}
          fill={textColorFor(color)}
          textAnchor="middle">
          {String(label)}
        </Text>
      )}
    </>
  );
}

function LegendIcon({ dancer }: { dancer: Dancer }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Marker dancer={dancer} cx={8} cy={8} size={13} />
    </Svg>
  );
}

/* ---------------- floor ---------------- */

function Floor({
  picture,
  couples,
  gridSize,
  soloMode,
  widthPt,
}: {
  picture: Picture;
  couples: Couple[];
  gridSize: [number, number];
  soloMode: boolean;
  widthPt: number;
}) {
  const [gx, gy] = gridSize;
  const cell = widthPt / gx;
  const heightPt = cell * gy;
  const ox = widthPt / 2;
  const oy = heightPt / 2;
  const roles: Role[] = soloMode ? ["leader"] : ["leader", "follower"];

  return (
    <Svg
      width={widthPt}
      height={heightPt}
      viewBox={`0 0 ${widthPt} ${heightPt}`}>
      <Rect
        x={0}
        y={0}
        width={widthPt}
        height={heightPt}
        fill="#fff"
        stroke="#889"
        strokeWidth={1}
      />
      {Array.from({ length: gx + 1 }, (_, i) => (
        <Line
          key={`v${i}`}
          x1={i * cell}
          y1={0}
          x2={i * cell}
          y2={heightPt}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: gy + 1 }, (_, i) => (
        <Line
          key={`h${i}`}
          x1={0}
          y1={i * cell}
          x2={widthPt}
          y2={i * cell}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      ))}
      <Line
        x1={ox}
        y1={0}
        x2={ox}
        y2={heightPt}
        stroke="#889"
        strokeWidth={1}
      />
      <Line x1={0} y1={oy} x2={widthPt} y2={oy} stroke="#889" strokeWidth={1} />

      {couples.flatMap((c) =>
        roles.map((role) => {
          const pos = findPos(picture, c.number, role);
          if (!pos) return null;
          return (
            <Marker
              key={`${c.number}-${role}`}
              dancer={c[role]}
              cx={ox + pos.x * cell}
              cy={oy + pos.y * cell}
              size={cell * 0.7}
              label={c.number}
            />
          );
        }),
      )}
    </Svg>
  );
}

/* ---------------- document ---------------- */

export function ChoreoPdf({
  name,
  gridSize,
  soloMode,
  couples,
  pictures,
}: ChoreoPdfProps) {
  const cs = sortedCouples(couples);
  const pics = sortedPictures(pictures);
  const fmt = (n?: number) => (n === undefined ? "–" : String(n));

  return (
    <Document title={name || "Choreography"}>
      {/* ---------- title page ---------- */}
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>{name || "Untitled Choreography"}</Text>
        <Text>Floor width (x): {gridSize[0]}</Text>
        <Text>Floor length (y): {gridSize[1]}</Text>
        <Text>Mode: {soloMode ? "Solo" : "Couple"}</Text>

        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.h2}>{soloMode ? "Dancers" : "Leaders"}</Text>
            {cs.map((c) => (
              <View key={c.number} style={s.row} wrap={false}>
                <Text style={s.num}>{c.number}</Text>
                <LegendIcon dancer={c.leader} />
                <Text style={s.name}>{c.leader.name}</Text>
              </View>
            ))}
          </View>
          {!soloMode && (
            <View style={s.col}>
              <Text style={s.h2}>Followers</Text>
              {cs.map((c) => (
                <View key={c.number} style={s.row} wrap={false}>
                  <Text style={s.num}>{c.number}</Text>
                  <LegendIcon dancer={c.follower} />
                  <Text style={s.name}>{c.follower.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>

      {/* ---------- one page per picture ---------- */}
      {pics.map((pic, i) => (
        <Page key={pic.id} size="A4" orientation="landscape" style={s.page}>
          <Text style={s.h1}>
            {i + 1}. {pic.title || `Picture ${i + 1}`}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Floor
              picture={pic}
              couples={cs}
              gridSize={gridSize}
              soloMode={soloMode}
              widthPt={460}
            />
            <View style={{ marginLeft: 32 }}>
              <View style={s.row}>
                <Text style={s.num} />
                <Text style={{ width: 80, fontFamily: "Helvetica-Bold" }}>
                  {soloMode ? "Dancer" : "Leader"}
                </Text>
                {!soloMode && (
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Follower</Text>
                )}
              </View>
              {cs.map((c) => {
                const l = findPos(pic, c.number, "leader");
                const f = findPos(pic, c.number, "follower");
                return (
                  <View key={c.number} style={s.row} wrap={false}>
                    <Text style={s.num}>{c.number}:</Text>
                    <Text style={{ width: 80 }}>
                      ({fmt(l?.x)} / {fmt(l?.y)})
                    </Text>
                    {!soloMode && (
                      <Text>
                        ({fmt(f?.x)} / {fmt(f?.y)})
                      </Text>
                    )}
                  </View>
                );
              })}
              {!!pic.comment && <Text style={s.comment}>{pic.comment}</Text>}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
