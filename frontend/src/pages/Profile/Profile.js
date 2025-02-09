import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import Achievement from "./Achievement";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export default function Profile() {
  return (
    <div className="min-h-screen">

    <div className=" absolute pl-[63vw] pt-[40px] m-0">
            <div className="flex flex-row gap-[10px]">
          <button className="w-[15vw] h-auto bg-[#84A59D] rounded-[50%] border-2 border-black flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <MdOutlinePersonAddAlt className="text-4xl " />
          </button>
          <button className="w-[15vw] h-[15vw] bg-[#84A59D] rounded-[50%] border-2 border-black flex items-center justify-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <FiLogOut className="text-4xl" />
          </button>
          </div>
        </div>

      <div
        className={`${styles.profileHeader}`}
      >
        <div className={`${styles.wrapper} `}>
          <img className={styles.profilePic} src="/freaky-bean.svg"/>
          <div>
            <p className="font-bold text-[9vw]"> Name </p>
            <p className={styles.level}>Lv. 123</p>
          </div>
        </div>
        


      </div>


      <h2 className="text-[27px] font-bold mb-3 p-5 pb-[2px]">Achievements</h2>

      {/** achievements container */}
      <div className={styles.container}>
        <Achievement
          img=""
          title="Culture Connoisseur"
          sub="Try 10 different cuisines"
        />

        <Achievement
          img=""
          title="C'est la vie"
          sub="Visit a French restaurant"
        />

        <Achievement
          img=""
          title="Lady Luck"
          sub="Obtain 5 rare items"
        />      

        <Achievement
          img=""
          title="The Regular"
          sub="Revist a restaurant 50 times"
        />      

      </div>

      <h2 className="text-[27px] font-bold mb-3 p-5 pb-[2px]">Stats</h2>

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
