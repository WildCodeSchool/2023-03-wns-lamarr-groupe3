import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../style/form.module.scss";
import {
  faCity,
  faMapLocation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export interface FormProps {
  username: string;
  city: string;
  place: Array<string>;
}

const onSubmit = async (userData: FormProps) => {
  try {
  } catch (error: any) {
    // Handle other cases here
    console.log("error", error.message);
  }
};

const Contribution = () => {
  return (
    <section className={styles.section_register}>
      <h2 className={styles.h2_register}>Une idée ?</h2>
      {/* <form className={styles.form} onSubmit={handleSubmit(onSubmit)}> */}
      <form className={styles.form}>
        <h3>Contribution</h3>

        <div className="input-wrapper">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            // {...register("email", {
            //   required: "Vous devez renseigner ce champ",
            // })}
          />
        </div>
        {/* {errors.email && <p className="error">{errors.email.message}</p>} */}

        <div className="input-wrapper">
          <FontAwesomeIcon icon={faCity} className="icon" />
          <input
            type="text"
            placeholder="Ville"
            // {...register("username", {
            //   required: "Vous devez renseigner ce champ",
            // })}
          />
        </div>
        {/* {errors.username && <p className="error">{errors.username.message}</p>} */}

        <div className="input-wrapper">
          <FontAwesomeIcon icon={faMapLocation} className="icon" />
          <select>
            <option>Lieu</option>
            <option value="male">male</option>
            <option value="other">other</option>
          </select>
        </div>

        <input type="submit" value="Contribuer" />
      </form>
    </section>
  );
};

export default Contribution;
