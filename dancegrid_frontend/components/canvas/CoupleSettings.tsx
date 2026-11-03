import useDancers from "@/stores/useDancers";
import useChoreoSettings from "@/stores/useChoreoSettings";

const CoupleSettings = () => {
  const { settings } = useChoreoSettings();
  const { couples, addCouple, deleteCouple, updateDancer } = useDancers();

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
              <td className="m-4"></td>
              <td className="text-lg m-4">Leaders</td>
              <td className="text-lg m-4">Followers</td>
            </tr>
          </thead>
        )}
        <tbody>
          {couples.map((couple: any) => (
            <tr>
              <td>{couple.number}: </td>
              <td>
                {couple.leader.name}, {couple.leader.color},
                {couple.leader.shape}
              </td>
              {settings.soloMode ? (
                ""
              ) : (
                <td>
                  {couple.follower.name}, {couple.follower.color},
                  {couple.follower.shape}
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
          addCouple(couples.length + 1, leader, follower);
        }}>
        + Add Dancers
      </button>
    </div>
  );
};

export default CoupleSettings;
