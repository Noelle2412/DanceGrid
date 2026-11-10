"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useChoreoSettings from "../../stores/useChoreoSettings";
import useCouples from "../../stores/useCouples";
import CoupleSettings from "./CoupleSettings";

const ChoreoSettings = () => {
  const router = useRouter();
  const params = useParams();
  const choreoId = params?.id as string | undefined;

  const [cookies] = useCookies(["user"]);

  const {
    settings,
    isLoading,
    isSaving,
    fetchChoreoSettings,
    resetSettings,
    saveChoreoSettings,
    updateName,
    updateX,
    updateY,
    updateMode,
  } = useChoreoSettings();

  const { couples } = useCouples();

  useEffect(() => {
    if (choreoId) {
      fetchChoreoSettings(choreoId);
    } else {
      resetSettings();
    }
  }, [choreoId, fetchChoreoSettings, resetSettings]);

  const handleSave = async () => {
    const user = cookies.user;
    const userId = user?._id;

    try {
      const result = await saveChoreoSettings({ userId });
      if (result.created && result.id) {
        alert("Choreography created successfully!");
        router.push(`/choreos/${result.id}`);
      } else {
        alert("Choreography settings updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to save choreography:", error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Failed to save choreography",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground">
        Loading choreography settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Choreography Settings</h2>{" "}
        <Input
          id="choreo_name"
          name="choreo_name"
          type="text"
          placeholder="Name of the Choreography"
          value={settings.name}
          onChange={(e) => updateName(e.target.value)}
        />
        <Label htmlFor="x" className="text-lg text-nowrap">
          Floor width: x
          <Input
            id="x"
            name="x"
            type="number"
            placeholder="Floor Width"
            value={settings.gridSize[0]}
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
            value={settings.gridSize[1]}
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
              checked={settings.soloMode}
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
          className="w-20 bg-secondary text-white rounded-md p-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
          disabled={isSaving}
          onClick={handleSave}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ChoreoSettings;
