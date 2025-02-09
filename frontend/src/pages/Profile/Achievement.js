import styles from "./Profile.module.css";

export default function Achievement({img, title, sub}) {
    return (
        <div className={styles.achievement}>
            <img className={styles.achievementpic} src={img}/>

            <div className={styles.text}>

            <p className="font-bold text-lgs">{title}</p>
            <p>{sub}</p>
            
            </div>
        </div>
    );
}