import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import ProfileNavBar from "./ProfileNavBar";


export default function Profile() {
   return (
    <div>
        <Navbar/>
        
        <div>
            <div className={styles.profileHeader}> 

                    <div className={styles.wrapper}>
                    <img className={styles.profilePic} src=""/>
                    <p className={styles.Name}> Name 
                    <p className={styles.level}>Lv. 123</p></p>
                    </div>

            </div>

            {/** add selector*/}
            <ProfileNavBar/>

            <h2>Achievements</h2>
            {/** achievements container */}

            {/** stats container */}


        </div>
    </div>

   );
}