import useDancer from "@/stores/useDancers";
import useChoreoSettings from "@/stores/useChoreoSettings";
import usePictures from "@/stores/usePictures";
import { Input } from "../ui/input";
import { Couple } from "../types";

const CoordinateEntry = () => {
  const { couples } = useDancer();
  const { settings } = useChoreoSettings();
  const { pictures, updatePicture } = usePictures();
  return (
    <ul className="flex flex-col gap-2">
      <li className="flex justify-between items-center gap-2">
        {settings.soloMode ? null : (
          <>
            <span> </span>
            <span>Leaders</span> <span>Followers</span>
          </>
        )}
      </li>
      {couples.map((couple: Couple, index: Number) => (
        <li className="flex flex-row gap-2">
          <span>{String(couple.number)}:</span>

          <span>
            (
            <Input
              className="w-16 text-center"
              name="leader_x"
              inputMode="numeric"
              min={-settings.gridSize[0]}
              max={settings.gridSize[0]}
              placeholder="x"
              key={`${couple.number}-x`}
              defaultValue={4}
              onBlur={(e) => {
                const rawVal = e.target.value.trim();
                const newNum = Number(rawVal);
                try {
                  //    updatePicture();
                } catch (error: any) {
                  alert(error.message || error);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />{" "}
            /{" "}
            <Input
              className="w-16 text-center"
              name="leader_y"
              inputMode="numeric"
              min={-settings.gridSize[0]}
              max={settings.gridSize[0]}
              placeholder="y"
              key={`${couple.number}-y`}
              defaultValue={4}
              onBlur={(e) => {
                const rawVal = e.target.value.trim();
                const newNum = Number(rawVal);
                try {
                  //     updatePicture();
                } catch (error: any) {
                  alert(error.message || error);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />
            )
          </span>
        </li>
      ))}
    </ul>
  );
};

export default CoordinateEntry;
