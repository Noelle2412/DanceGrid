"use client";
import React, { useState, useEffect } from "react";
import ChoreoSettings from "@/components/canvas/ChoreoSettings";
import usePictures from "@/stores/usePictures";
import PicturesOverview from "@/components/canvas/PicturesOverview";
import Picture from "../../components/canvas/Picture";

const NewChoreoPage = () => {
  const { pictures } = usePictures();
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(
    pictures.length > 0 ? pictures[0].id : null,
  );

  // If a picture is added and none is selected, or if current selection was deleted
  useEffect(() => {
    if (pictures.length > 0) {
      const exists = pictures.some((p) => p.id === selectedPictureId);
      if (!exists) {
        setSelectedPictureId(pictures[0].id);
      }
    } else {
      setSelectedPictureId(null);
    }
  }, [pictures, selectedPictureId]);

  return (
    <div className="flex flex-col gap-6">
      <ChoreoSettings />
      <PicturesOverview
        selectedPictureId={selectedPictureId}
        onSelectPicture={setSelectedPictureId}
      />
      {selectedPictureId && <Picture pictureId={selectedPictureId} />}
    </div>
  );
};

export default NewChoreoPage;
