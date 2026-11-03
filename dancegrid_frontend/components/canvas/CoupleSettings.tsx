import useDancers from "@/stores/useDancers";
import useChoreoSettings from "@/stores/useChoreoSettings";
import { Input } from "../ui/input";

const CoupleSettings = () => {
  const { settings } = useChoreoSettings();
  const {
    couples,
    addCouple,
    deleteCouple,
    updateDancer,
    generateNumber,
    validateNumbers,
    updateCouple,
  } = useDancers();

  return (
    <div>
      {" "}
      <h3 className="text-xl mb-2">Dancers</h3>
      <table>
        {settings.soloMode ? (
          ""
        ) : (
          <thead>
            <tr>
              <td className="px-4 py-2"> </td>
              <td className="text-lg px-4 py-2">Leaders</td>
              <td className="text-lg px-4 py-2">Followers</td>
            </tr>
          </thead>
        )}
        <tbody>
          {couples.map((couple: any) => (
            <tr>
              <td className="px-4 py-2">
                {" "}
                <Input
                  className="w-12"
                  name="couple_number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  placeholder="#"
                  defaultValue={couple.number}
                  onChange={(e) => {
                    try {
                      updateCouple(couple.number, Number(e.target.value));
                    } catch (error) {
                      alert(error);
                      e.target.value = couple.number;
                    }
                  }}
                />{" "}
              </td>
              <td className="px-4 py-2">
                <Input
                  className="w-32"
                  name="leader_name"
                  type="text"
                  placeholder="Leader Name"
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
                {couple.leader.color},{couple.leader.shape}
              </td>
              {settings.soloMode ? (
                ""
              ) : (
                <td className="px-4 py-2">
                  <Input
                    className="w-32"
                    name="follower_name"
                    type="text"
                    placeholder="Follower Name"
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
                  {couple.follower.color},{couple.follower.shape}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-accent text-white rounded-md p-4 my-2"
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
