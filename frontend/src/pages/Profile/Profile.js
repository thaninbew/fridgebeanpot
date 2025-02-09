import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import Achievement from "./Achievement";

export default function Profile() {
   return (
    <div className="min-h-screen pb-24 font-Satoshi-Variable">
        <div className={styles.profileHeader}> 
            <div className={styles.wrapper}>
                <img className={styles.profilePic} src=""/>
                <p className="font-bold text-[7vw]"> Name 
                    <p className={styles.level}>Lv. 123</p>
                </p>
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 p-10 pb-[4px]">Achievements</h2>
        
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

        
        <h2 className="text-2xl font-bold mb-4 p-10 pb-[4px]">Stats</h2>

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