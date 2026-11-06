"use client";
import React from "react";
import usePictures from "@/stores/usePictures";
import { Picture } from "../types";

interface PicturesOverviewProps {
  selectedPictureId: string | null;
  onSelectPicture: (id: string) => void;
}

const PicturesOverview = ({
  selectedPictureId,
  onSelectPicture,
}: PicturesOverviewProps) => {
  const { pictures, addPicture } = usePictures();

  // Sort pictures by their order field
  const sortedPictures = [...pictures].sort((a, b) => a.order - b.order);

  const handleAddPicture = () => {
    // Generate default coordinates from the last picture if available, or empty
    const lastPicture = sortedPictures[sortedPictures.length - 1];
    const newCoords = lastPicture
      ? lastPicture.coordinates.map((c) => ({ ...c }))
      : [];

    addPicture(newCoords);
  };

  return (
    <div className="flex flex-col gap-2 my-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Pictures</h3>
        <button
          className="bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 cursor-pointer text-sm font-medium transition-colors"
          onClick={handleAddPicture}>
          + Add Picture
        </button>
      </div>

      {/* Horizontal scrollable row */}
      <div className="flex flex-row items-center gap-4 overflow-x-auto pb-4 pt-1 w-full border border-border/40 rounded-lg p-3 bg-muted/20">
        {sortedPictures.length === 0 ? (
          <p className="text-sm text-muted-foreground p-2">
            No pictures added yet. Click &quot;+ Add Picture&quot; to begin.
          </p>
        ) : (
          sortedPictures.map((picture: Picture, index: number) => {
            const isSelected = picture.id === selectedPictureId;
            const displayTitle = picture.title || `Picture ${index + 1}`;

            return (
              <div
                key={picture.id}
                onClick={() => onSelectPicture(picture.id)}
                className={`flex flex-col justify-between items-center shrink-0 w-28 h-28 p-2 rounded-lg cursor-pointer transition-all border-2 select-none ${
                  isSelected
                    ? "border-accent bg-accent/15 shadow-md scale-105"
                    : "border-border bg-card hover:border-accent/60 hover:bg-accent/5"
                }`}>
                <span className="text-xs font-semibold text-muted-foreground self-start">
                  #{index + 1}
                </span>
                <p className="text-sm font-medium text-center line-clamp-2 px-1 wrap-break-words">
                  {displayTitle}
                </p>
                <div className="w-2 h-2 rounded-full bg-accent/40" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PicturesOverview;
