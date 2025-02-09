import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import Achievement from "./Achievement";
import { IoPersonAdd } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

export default function Profile() {
  return (
    <div className="min-h-screen">
      <div
        className={`${styles.profileHeader} flex flex-row items-center justify-between`}
      >
        <div className={`${styles.wrapper} flex items-center`}>
          <img className={styles.profilePic} src="" />
          <div>
            <p className="font-bold text-[9vw]">Name</p>
            <p className={styles.level}>Lv. 123</p>
          </div>
        </div>
        <div className="flex flex-row mb-[9vh]">
          <button className="w-[15vw] h-[15vw] bg-[#84A59D] rounded-[50px] border-2 border-black flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <IoPersonAdd className="text-3xl" />
          </button>
          <button className="w-[15vw] h-[15vw] p-2 bg-[#84A59D] rounded-[50px] border-2 border-black flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <FiLogOut className="text-3xl" />
          </button>
        </div>
      </div>

      <h2 className="text-[27px] font-bold mb-3 p-8 pb-[2px]">Achievements</h2>

      {/** achievements container */}
      <div className={styles.container}>
        <Achievement
          img=""
          title="Culture Connoisseur"
          sub="Try 10 different cuisines"
        />

        <Achievement
          img=""
          title="Culture Connoisseur"
          sub="Try 10 different cuisines"
        />

        <Achievement
          img=""
          title="Culture Connoisseur"
          sub="Try 10 different cuisines"
        />

        <Achievement
          img=""
          title="Culture Connoisseur"
          sub="Try 10 different cuisines"
        />

        <Achievement
          img=""
          title="Culture Connoisseur"
          sub="Try 10 different cuisines"
        />
      </div>

      <h2 className="text-[27px] font-bold mb-3 p-8 pb-[2px]">Stats</h2>

      {/** stats container */}
      <div className={styles.container}>
        <div>
          <p>
            {" "}
            <span className="font-bold pr-2">Total Restaurants Visited:</span>
            100
          </p>
          <p>
            {" "}
            <span className="font-bold pr-2"> Most Frequently Visited:</span>
            Mamacita's
          </p>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
