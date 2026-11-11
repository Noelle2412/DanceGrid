"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useChoreoSettings from "../../stores/useChoreoSettings";
import useCouples from "../../stores/useCouples";
import { saveSettingsAndCouples } from "../../stores/choreoSession";
import CoupleSettings from "./CoupleSettings";

const ChoreoSettings = () => {
  const router = useRouter();
  const params = useParams();
  const choreoId = params?.id as string | undefined;

  const [cookies] = useCookies(["user"]);
  const user = cookies.user;

  const {
    settings,
    isLoading,
    isSaving: settingsSaving,
    isDirty: settingsDirty,
    saveError: settingsSaveError,
    sharedWith,
    isSharing,
    shareError,
    fetchSharedUsers,
    shareWith,
    unshare,
    updateName,
    updateX,
    updateY,
    updateMode,
  } = useChoreoSettings();

  const {
    isSaving: couplesSaving,
    isDirty: couplesDirty,
    saveError: couplesSaveError,
  } = useCouples();

  const [shareEmail, setShareEmail] = useState("");

  const isSaving = settingsSaving || couplesSaving;
  const isDirty = settingsDirty || couplesDirty;
  const saveError = settingsSaveError || couplesSaveError;

  useEffect(() => {
    if (user && choreoId) {
      void fetchSharedUsers(choreoId);
    }
  }, [user, choreoId, fetchSharedUsers]);

  const handleSave = async () => {
    const result = await saveSettingsAndCouples({ userId: user?.id });
    // A new choreography now has an id: move to its URL.
    if (!choreoId && result.status === "saved" && result.id) {
      router.push(`/choreos/${result.id}`);
    }
  };

  const handleShare = async () => {
    const ok = await shareWith(shareEmail);
    if (ok) setShareEmail("");
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
      {Boolean(user) ? (
        <div className="flex flex-col gap-4">
          <button
            className="w-20 bg-secondary text-white rounded-md p-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
            disabled={isSaving}
            onClick={handleSave}>
            {isSaving ? "Saving..." : "Save"}
          </button>
          {isDirty && !isSaving && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
          {saveError && (
            <span className="text-sm text-red-500">{saveError}</span>
          )}
          <button
            className="w-20 bg-secondary text-white rounded-md p-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-opacity"
            disabled={isSharing || !choreoId || !shareEmail.trim()}
            onClick={handleShare}>
            {isSharing ? "Sharing..." : "Share"}
          </button>
          <Input
            className="w-32"
            name="share_email"
            type="text"
            placeholder="Email or Username"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleShare();
              }
            }}
          />{" "}
          <div>
            <span className="font-semibold">Shared with:</span>
            <ul>
              {sharedWith.map((entry: string) => (
                <li key={entry} className="flex items-center gap-2">
                  <span>{entry}</span>
                  <button
                    type="button"
                    className="text-red-600 cursor-pointer"
                    aria-label={`Stop sharing with ${entry}`}
                    disabled={isSharing}
                    onClick={() => void unshare(entry)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {shareError && <p className="text-sm text-red-500">{shareError}</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChoreoSettings;
