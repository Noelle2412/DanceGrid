"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import useCouples from "@/stores/useCouples";
import useChoreoSettings from "@/stores/useChoreoSettings";
import { Input } from "../ui/input";
import { ItemAppearancePicker } from "./Itemappearancepicker";

const CoupleSettings = () => {
  const params = useParams();
  const choreoId = params?.id as string | undefined;
  const { settings } = useChoreoSettings();

  const {
    couples,
    fetchCouples,
    resetCouples,
    addCouple,
    deleteCouple,
    updateDancer,
    generateNumber,
    updateCouple,
    syncWithBackend,
  } = useCouples();

  // Fetch dancers on load or reset for new choreo
  useEffect(() => {
    if (choreoId) {
      fetchCouples(choreoId);
    } else {
      resetCouples();
    }
  }, [choreoId, fetchCouples, resetCouples]);

  const handleAddCouple = () => {
    const leader = {
      shape: "circle",
      color: "#000000",
      name: "Name",
    };
    const follower = {
      shape: "circle",
      color: "#000000",
      name: "Name",
    };
    addCouple(generateNumber(couples), leader, follower);
  };

  const handleAppearanceChange = async (
    coupleNumber: number,
    role: "leader" | "follower",
    next: { color: string; shape: string },
  ) => {
    updateDancer(coupleNumber, role, null, next.color, next.shape);
    await syncWithBackend();
  };

  return (
    <div>
      <table border={1}>
        {settings.soloMode ? (
          <thead>
            <tr>
              <td className="px-4 py-2"> </td>
              <td className="text-lg px-4 py-2">Dancers</td>
            </tr>
          </thead>
        ) : (
          <thead>
            <tr>
              <td className="px-4 py-2"> </td>
              <td className="text-lg px-4 py-2">Leaders</td>
              <td></td>
              <td className="text-lg px-4 py-2">Followers</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
        )}
        <tbody>
          {couples.map((couple: any) => {
            const leaderName = couple.leader?.name ?? "";
            const leaderColor = couple.leader?.color ?? "#000000";
            const leaderShape = couple.leader?.shape ?? "circle";

            const followerName = couple.follower?.name ?? "";
            const followerColor = couple.follower?.color ?? "#000000";
            const followerShape = couple.follower?.shape ?? "circle";

            return (
              <tr key={`couple-${couple.number}`}>
                <td className="px-4 py-2">
                  <Input
                    className="w-16"
                    name="couple_number"
                    inputMode="numeric"
                    min={0}
                    max={100}
                    placeholder="#"
                    key={`num-${couple.number}`}
                    defaultValue={couple.number}
                    onBlur={async (e) => {
                      const rawVal = e.target.value.trim();
                      if (rawVal === "") {
                        e.target.value = couple.number;
                        return;
                      }
                      const newNum = Number(rawVal);
                      if (newNum === couple.number) {
                        return;
                      }
                      try {
                        await updateCouple(couple.number, newNum);
                      } catch (error: any) {
                        alert(error.message || error);
                        e.target.value = couple.number;
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    className="w-32"
                    name="leader_name"
                    type="text"
                    placeholder="Leader Name"
                    value={leaderName}
                    onChange={(e) => {
                      updateDancer(
                        couple.number,
                        "leader",
                        e.target.value,
                        leaderColor,
                        leaderShape,
                      );
                    }}
                    onBlur={() => syncWithBackend()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />{" "}
                </td>
                <td className="px-4 py-2">
                  <ItemAppearancePicker
                    shape={leaderShape}
                    color={leaderColor}
                    onChange={(next) =>
                      handleAppearanceChange(couple.number, "leader", next)
                    }
                  />
                </td>
                {settings.soloMode ? null : (
                  <td className="px-4 py-2">
                    <Input
                      className="w-32"
                      name="follower_name"
                      type="text"
                      placeholder="Follower Name"
                      value={followerName}
                      onChange={(e) => {
                        updateDancer(
                          couple.number,
                          "follower",
                          e.target.value,
                          followerColor,
                          followerShape,
                        );
                      }}
                      onBlur={() => syncWithBackend()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                    />{" "}
                  </td>
                )}
                {settings.soloMode ? null : (
                  <td className="px-4 py-2">
                    <ItemAppearancePicker
                      shape={followerShape}
                      color={followerColor}
                      onChange={(next) =>
                        handleAppearanceChange(couple.number, "follower", next)
                      }
                    />
                  </td>
                )}
                <td className="px-4 py-2">
                  <button
                    className="bg-red-600 text-white rounded-md p-2 hover:bg-red-700 cursor-pointer"
                    onClick={() => deleteCouple(couple.number)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="bg-accent text-white rounded-md p-2 my-2 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleAddCouple}>
        + Add Dancers
      </button>
    </div>
  );
};

export default CoupleSettings;
