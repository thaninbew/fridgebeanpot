import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";


export default function Profile() {
   return (
    <div>
        <Navbar/>
        
        <div className="profile">
            <div className={styles.profileHeader}> 

                <div class="flex-row">
                <img className={styles.profilePic} src=""/>
                <h1> Name </h1>
                </div>

            </div>
        </div>

        

    </div>

   );
}