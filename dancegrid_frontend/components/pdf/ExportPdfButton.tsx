"use client";

import { useState } from "react";
import useChoreoSettings from "@/stores/useChoreoSettings";
import useCouples from "@/stores/useCouples";
import usePictures from "@/stores/usePictures";

export default function ExportPdfButton() {
  const [busy, setBusy] = useState(false);
  const settings = useChoreoSettings((s) => s.settings);
  const couples = useCouples((s) => s.couples);
  const pictures = usePictures((s) => s.pictures);

  async function handleExport() {
    setBusy(true);
    try {
      // lazy-load so the PDF library isn't in the initial bundle
      const [{ pdf }, { ChoreoPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ChoreoPdf"),
      ]);

      const blob = await pdf(
        <ChoreoPdf
          name={settings.name}
          gridSize={settings.gridSize}
          soloMode={settings.soloMode}
          couples={couples}
          pictures={pictures}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${settings.name || "choreography"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF Export failed");
      console.error("PDF export failed:", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className="bg-accent p-2 rounded-md text-white cursor-pointer"
      onClick={handleExport}
      disabled={busy}>
      {busy ? "Exporting…" : "Export PDF"}
    </button>
  );
}
