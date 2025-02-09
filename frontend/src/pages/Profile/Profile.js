import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import Achievement from "./Achievement";

export default function Profile() {
   return (
    <div className="min-h-screen">
        <div className={styles.profileHeader}> 
            <div className={styles.wrapper}>
                <img className={styles.profilePic} src=""/>
                <p className="font-bold text-[9vw]"> Name 
                    <p className={styles.level}>Lv. 123</p>
                </p>
            </div>
        </div>

        <h2 className="text-[27px] font-bold mb-3 p-8 pb-[2px]">Achievements</h2>
        
        {/** achievements container */}
        <div className={styles.container}>
            
            <Achievement
                img= ""
                title="Culture Connoisseur"
                sub="Try 10 different cuisines"/>

            <Achievement
                img= ""
                title="Culture Connoisseur"
                sub="Try 10 different cuisines"/>

            <Achievement
                img= ""
                title="Culture Connoisseur"
                sub="Try 10 different cuisines"/>

            <Achievement
                img= ""
                title="Culture Connoisseur"
                sub="Try 10 different cuisines"/>

            <Achievement
                img= ""
                title="Culture Connoisseur"
                sub="Try 10 different cuisines"/>
        </div>

        
        <h2 className="text-[27px] font-bold mb-3 p-8 pb-[2px]">Stats</h2>

        {/** stats container */}
        <div className={styles.container}>
            <div>
            <p> <span className="font-bold pr-2">Total Restaurants Visited:</span>100</p>
            <p> <span className="font-bold pr-2"> Most Frequently Visited:</span>Mamacita's</p>
            </div>
        </div>

        <Navbar />
    </div>
   );
}