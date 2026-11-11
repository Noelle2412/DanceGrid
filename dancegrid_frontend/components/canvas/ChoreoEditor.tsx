"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChoreoSettings from "@/components/canvas/ChoreoSettings";
import usePictures from "@/stores/usePictures";
import { loadChoreo, resetChoreo } from "@/stores/choreoSession";
import PicturesOverview from "@/components/canvas/PicturesOverview";
import Picture from "@/components/canvas/Picture";
import ExportPdfButton from "../pdf/ExportPdfButton";

export default function ChoreoEditor() {
  const params = useParams();
  const choreoId = params?.id as string | undefined;
  const {
    pictures,
    choreoId: picturesChoreoId,
    isLoading,
    error,
  } = usePictures();
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(
    null,
  );

  // A single request fills settings, couples and pictures.
  // Skipped if the choreography is already loaded (e.g. right after it was created in this session).
  useEffect(() => {
    if (choreoId) {
      void loadChoreo(choreoId);
    } else {
      resetChoreo();
    }
  }, [choreoId]);

  // Clear the stores when leaving the editor.
  useEffect(() => resetChoreo, []);

  const activePictureId = pictures.some(
    (picture) => picture.id === selectedPictureId,
  )
    ? selectedPictureId
    : (pictures[0]?.id ?? null);

  const isPicturesLoading =
    Boolean(choreoId) && (picturesChoreoId !== choreoId || isLoading);

  return (
    <div className="flex flex-col gap-6">
      <ChoreoSettings />
      {isPicturesLoading ? (
        <p className="text-muted-foreground">Loading pictures...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <PicturesOverview
            selectedPictureId={activePictureId}
            onSelectPicture={setSelectedPictureId}
          />
          <ExportPdfButton />
          {activePictureId && <Picture pictureId={activePictureId} />}
        </>
      )}
    </div>
  );
}
