import styles from "./Profile.module.css";

export default function Achievement(img, title, desc) {
    return (
        <div>
            <img src={img}></img>
            <h1>{title}</h1>
            <p>{desc}</p>
        </div>
    )
}