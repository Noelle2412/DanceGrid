"use client";
import React, { useState } from "react";
import { Layer, Stage } from "react-konva";
import { DraggableItem } from "./DraggableItem";
import { Grid } from "./Grid";
import { useCookies } from "react-cookie";
import usePictures from "@/stores/usePictures";
import useChoreoSettings from "@/stores/useChoreoSettings";
import useDancers from "@/stores/useCouples";
import CoordinateEntry from "./CoordinateEntry";
import { Role } from "../types";
import { updatePictures } from "@/api/choreos";
import { useParams } from "next/navigation";

interface PictureProps {
  pictureId: string;
}

function Picture({ pictureId }: PictureProps) {
  const pixelsPerMeter = 50; // Value to test around with.
  const { settings } = useChoreoSettings();
  const stageWidth = settings.gridSize[0] * pixelsPerMeter;
  const stageHeight = settings.gridSize[1] * pixelsPerMeter;
  // Both layers are shifted so that (0, 0) lies in the center of the stage.
  const origin = { x: stageWidth / 2, y: stageHeight / 2 };

  const { pictures, updateCoordinate, addPicture, deletePicture } =
    usePictures();
  const { couples } = useDancers();

  const params = useParams();
  const choreoId = params?.id as string | undefined;

  const currentPicture = pictures.find((p) => p.id === pictureId);

  const getPosition = (coupleNumber: number, role: Role) => {
    const found = currentPicture?.coordinates.find(
      (c) => c.coupleNumber === coupleNumber && c.role === role,
    );
    return found ? { x: found.x, y: found.y } : { x: 0, y: 0 };
  };

  const handleMove = (
    coupleNumber: number,
    role: Role,
    pos: { x: number; y: number },
  ) => {
    updateCoordinate(pictureId, {
      coupleNumber,
      role,
      x: pos.x,
      y: pos.y,
    });
  };

  const [cookies] = useCookies(["user"]);
  const user = cookies.user;
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      alert("Please log in to save a choreography.");
      return;
    }
    if (!choreoId) {
      alert("Unable to determine which choreography to save.");
      return;
    }
    try {
      setIsSaving(true);
      await updatePictures(choreoId, { pictures });
      alert("Pictures saved successfully!");
    } catch (error: unknown) {
      console.error("Failed to save pictures:", error);
      alert(error instanceof Error ? error.message : "Failed to save picture");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePicture(pictureId);
    } catch (error: any) {
      console.error("Failed to delete picture: ", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete picture",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-start">
      <Stage width={stageWidth} height={stageHeight}>
        <Layer {...origin} listening={false}>
          <Grid pixelsPerMeter={pixelsPerMeter} />
        </Layer>

        <Layer {...origin}>
          {couples.map((couple: any, index: number) => {
            const leaderPos = getPosition(couple.number, "leader");
            const followerPos = getPosition(couple.number, "follower");

            return (
              <React.Fragment
                key={`couple-${couple.id || couple.number}-${index}`}>
                <DraggableItem
                  key={`leader-${couple.id || couple.number}`}
                  item={couple.leader}
                  number={couple.number}
                  pixelsPerMeter={pixelsPerMeter}
                  sizeMeters={0.5}
                  position={leaderPos}
                  onMove={(pos) => handleMove(couple.number, "leader", pos)}
                />
                {settings.soloMode ? null : (
                  <DraggableItem
                    key={`follower-${couple.id || couple.number}`}
                    item={couple.follower}
                    number={couple.number}
                    pixelsPerMeter={pixelsPerMeter}
                    sizeMeters={0.5}
                    position={followerPos}
                    onMove={(pos) => handleMove(couple.number, "follower", pos)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
      <CoordinateEntry pictureId={pictureId} />
      <div className="flex flex-col gap-4">
        {Boolean(user) ? (
          <button
            className="bg-secondary text-white rounded-md p-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
            disabled={isSaving}
            onClick={handleSave}>
            {isSaving ? "Saving..." : "Save Pictures"}
          </button>
        ) : null}
        <button
          className="bg-red-500 text-white rounded-md p-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
          disabled={isSaving}
          onClick={handleDelete}>
          {isSaving ? "Saving..." : "Delete this Picture"}
        </button>
      </div>
    </div>
  );
}

export default Picture;
