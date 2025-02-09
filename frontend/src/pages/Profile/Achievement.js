import styles from "./Profile.module.css";

export default function Achievement({img, title, sub}) {
    return (
        <div className={styles.achievement}>
            <img className={styles.achievementpic} src={img}/>

            <div className={styles.text}>

            <p className="font-bold text-lg p-1">{title}</p>
            <p>{sub}</p>
            
            </div>
        </div>
    );
}