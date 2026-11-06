"use client";
import React, { useState, useEffect } from "react";
import useDancers from "@/stores/useDancers";
import useChoreoSettings from "@/stores/useChoreoSettings";
import usePictures from "@/stores/usePictures";
import { Input } from "../ui/input";
import { Couple, Role } from "../types";

interface CoordInputProps {
  value: number;
  min: number;
  max: number;
  placeholder: string;
  onCommit: (val: number) => void;
}

function CoordInput({ value, min, max, placeholder, onCommit }: CoordInputProps) {
  const [text, setText] = useState<string>(String(value ?? 0));

  // Sync internal text when the value in the store changes externally (e.g., dragged on canvas)
  useEffect(() => {
    setText(String(value ?? 0));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);

    // Normalize comma to dot for parsing
    const normalized = raw.replace(",", ".");
    const parsed = parseFloat(normalized);

    // Only update store if it's a valid complete number and not ending in a dangling dot/minus
    if (!isNaN(parsed) && !normalized.endsWith(".") && !normalized.endsWith("-")) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onCommit(clamped);
    }
  };

  const handleBlur = () => {
    const normalized = text.replace(",", ".").trim();
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) {
      setText(String(value ?? 0));
    } else {
      const clamped = Math.min(max, Math.max(min, parsed));
      setText(String(clamped));
      onCommit(clamped);
    }
  };

  return (
    <Input
      className="w-16 text-center"
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}

interface CoordinateEntryProps {
  pictureId: string;
}

const CoordinateEntry = ({ pictureId }: CoordinateEntryProps) => {
  const { couples } = useDancers();
  const { settings } = useChoreoSettings();
  const { pictures, updateX, updateY } = usePictures();

  const currentPicture = pictures.find((p) => p.id === pictureId);

  const getCoord = (coupleNumber: number, role: Role, axis: "x" | "y"): number => {
    const found = currentPicture?.coordinates.find(
      (c) => c.coupleNumber === coupleNumber && c.role === role
    );
    return found ? found[axis] : 0;
  };

  const halfWidth = settings.gridSize[0] / 2;
  const halfHeight = settings.gridSize[1] / 2;

  return (
    <ul className="flex flex-col gap-2">
      <li className="flex justify-between items-center gap-2 font-semibold">
        {settings.soloMode ? (
          <span>Dancers</span>
        ) : (
          <div className="flex gap-16 pl-8">
            <span>Leaders</span>
            <span>Followers</span>
          </div>
        )}
      </li>
      {couples.map((couple: Couple) => {
        const leaderX = getCoord(couple.number, "leader", "x");
        const leaderY = getCoord(couple.number, "leader", "y");
        const followerX = getCoord(couple.number, "follower", "x");
        const followerY = getCoord(couple.number, "follower", "y");

        return (
          <li
            key={`entry-${couple.number}`}
            className="flex flex-row items-center gap-2">
            <span className="w-6 font-medium">{String(couple.number)}:</span>

            <span className="flex items-center gap-1">
              (
              <CoordInput
                value={leaderX}
                min={-halfWidth}
                max={halfWidth}
                placeholder="x"
                onCommit={(val) => updateX(pictureId, couple.number, "leader", val)}
              />
              /
              <CoordInput
                value={leaderY}
                min={-halfHeight}
                max={halfHeight}
                placeholder="y"
                onCommit={(val) => updateY(pictureId, couple.number, "leader", val)}
              />
              )
            </span>

            {settings.soloMode ? null : (
              <span className="flex items-center gap-1">
                (
                <CoordInput
                  value={followerX}
                  min={-halfWidth}
                  max={halfWidth}
                  placeholder="x"
                  onCommit={(val) => updateX(pictureId, couple.number, "follower", val)}
                />
                /
                <CoordInput
                  value={followerY}
                  min={-halfHeight}
                  max={halfHeight}
                  placeholder="y"
                  onCommit={(val) => updateY(pictureId, couple.number, "follower", val)}
                />
                )
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CoordinateEntry;
