import { Layer, Stage } from "react-konva";
import { DraggableItem } from "./DraggableItem";
import { Grid } from "./Grid";
import usePicture from "../../stores/usePictures";
import useChoreoSettings from "@/stores/useChoreoSettings";
import useDancers from "@/stores/useDancers";
import CoordinateEntry from "./CoordinateEntry";

function Picture() {
  const pixelsPerMeter = 50; //Value to test around with.
  const { settings } = useChoreoSettings();
  const stageWidth = settings.gridSize[0] * pixelsPerMeter;
  const stageHeight = settings.gridSize[1] * pixelsPerMeter;
  // Both layers are shifted so that (0, 0) lies in the center of the stage.
  const origin = { x: stageWidth / 2, y: stageHeight / 2 };
  const { pictures, addPicture, updatePicture, deletePicture, reorderPicture } =
    usePicture();
  const { couples } = useDancers();

  return (
    <div className="flex flex-col md:flex-row justify-around">
      <Stage width={stageWidth} height={stageHeight}>
        <Layer {...origin} listening={false}>
          <Grid pixelsPerMeter={pixelsPerMeter} />
        </Layer>

        <Layer {...origin}>
          {couples.map((couple: any, index: any) => (
            <>
              <DraggableItem
                key={`leader-${index}`}
                item={couple.leader}
                number={couple.number}
                pixelsPerMeter={pixelsPerMeter}
                sizeMeters={0.5}
                onMove={(pos) => {}}
              />
              {settings.soloMode ? null : (
                <DraggableItem
                  key={`follower-${index}`}
                  item={couple.follower}
                  number={couple.number}
                  pixelsPerMeter={pixelsPerMeter}
                  sizeMeters={0.5}
                  onMove={(pos) => {}}
                />
              )}
            </>
          ))}
        </Layer>
      </Stage>
      <CoordinateEntry />
    </div>
  );
}

export default Picture;
