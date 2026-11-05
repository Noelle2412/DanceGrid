"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useChoreoSettings from "../../stores/useChoreoSettings";
import CoupleSettings from "./CoupleSettings";

const ChoreoSettings = () => {
  const { settings, updateName, updateX, updateY, updateMode } =
    useChoreoSettings();

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Choreography Settings</h2>{" "}
        <Input
          id="choreo_name"
          name="choreo_name"
          type="text"
          placeholder="Name of the Choreography"
          defaultValue={settings.name}
          onChange={(e) => updateName(e.target.value)}
        />
        <Label htmlFor="x" className="text-lg text-nowrap">
          Floor width: x
          <Input
            id="x"
            name="x"
            type="number"
            placeholder="Floor Width"
            defaultValue={settings.gridSize[0]}
            onChange={(e) => updateX(e.target.value)}
          />
        </Label>
        <Label htmlFor="y" className="text-lg text-nowrap">
          Floor length: y
          <Input
            id="y"
            name="y"
            type="number"
            placeholder="Floor Length"
            defaultValue={settings.gridSize[1]}
            onChange={(e) => updateY(e.target.value)}
          />
        </Label>
        <Label htmlFor="solo" className="text-lg text-nowrap">
          <span className={settings.soloMode ? "text-gray-400" : ""}>
            Couple
          </span>{" "}
          or{" "}
          <span className={settings.soloMode ? "" : "text-gray-400"}>Solo</span>{" "}
          Mode
          <div className="flex bg-accent cursor-pointer relative w-20 h-10 rounded-full">
            <Input
              id="solo"
              name="solo"
              type="checkbox"
              className="sr-only peer"
              defaultChecked={settings.soloMode}
              onChange={(e) => updateMode(e.target.checked)}
            />
            <span className="w-2/5 h-4/5 bg-secondary absolute rounded-full left-1 top-1 peer-checked:bg-bg peer-checked:left-11 transition-all duration-500" />
          </div>
        </Label>
      </div>
      <div>
        <CoupleSettings />
      </div>
      <div>
        <button
          className="w-16 bg-secondary text-white rounded-md p-2 cursor-pointer"
          onClick={() => {}}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ChoreoSettings;
