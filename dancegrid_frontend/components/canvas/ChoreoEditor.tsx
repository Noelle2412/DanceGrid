"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChoreoSettings from "@/components/canvas/ChoreoSettings";
import usePictures from "@/stores/usePictures";
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
    fetchPictures,
    resetPictures,
  } = usePictures();
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (choreoId) {
      void fetchPictures(choreoId);
    } else {
      resetPictures();
    }
  }, [choreoId, fetchPictures, resetPictures]);

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
