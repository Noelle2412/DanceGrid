import useDancers from "@/stores/useDancers";
import useChoreoSettings from "@/stores/useChoreoSettings";
import { Input } from "../ui/input";
import { ItemAppearancePicker } from "./Itemappearancepicker";

const CoupleSettings = () => {
  const { settings } = useChoreoSettings();
  const {
    couples,
    addCouple,
    deleteCouple,
    updateDancer,
    generateNumber,
    updateCouple,
  } = useDancers();

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
          {couples.map((couple: any) => (
            <tr key={couple.number}>
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
                  onBlur={(e) => {
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
                      updateCouple(couple.number, newNum);
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
                  key={`leader-${couple.number}`}
                  defaultValue={couple.leader.name}
                  onChange={(e) => {
                    updateDancer(
                      couple.number,
                      "leader",
                      e.target.value,
                      couple.leader.color,
                      couple.leader.shape,
                    );
                  }}
                />{" "}
              </td>
              <td className="px-4 py-2">
                <ItemAppearancePicker
                  shape={couple.leader.shape}
                  color={couple.leader.color}
                  onChange={(next) =>
                    updateDancer(
                      couple.number,
                      "leader",
                      null,
                      next.color,
                      next.shape,
                    )
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
                    key={`follower-${couple.number}`}
                    defaultValue={couple.follower.name}
                    onChange={(e) => {
                      updateDancer(
                        couple.number,
                        "follower",
                        e.target.value,
                        couple.follower.color,
                        couple.follower.shape,
                      );
                    }}
                  />{" "}
                </td>
              )}
              {settings.soloMode ? null : (
                <td className="px-4 py-2">
                  <ItemAppearancePicker
                    shape={couple.follower.shape}
                    color={couple.follower.color}
                    onChange={(next) =>
                      updateDancer(
                        couple.number,
                        "follower",
                        null,
                        next.color,
                        next.shape,
                      )
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
          ))}
        </tbody>
      </table>
      <button
        className="bg-accent text-white rounded-md p-2 my-2 cursor-pointer"
        onClick={() => {
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
        }}>
        + Add Dancers
      </button>
    </div>
  );
};

export default CoupleSettings;
