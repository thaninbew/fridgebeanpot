import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";

export default function Profile() {
   return (
    <div className="min-h-screen pb-24">
        <div className={styles.profileHeader}> 
            <div className={styles.wrapper}>
                <img className={styles.profilePic} src="" alt="Profile"/>
                <p className={styles.Name}> Name 
                    <p className={styles.level}>Lv. 123</p>
                </p>
            </div>
        </div>


        <div className="px-6">
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            {/** achievements container */}

            {/** stats container */}
        </div>

        <Navbar />
    </div>
   );
}