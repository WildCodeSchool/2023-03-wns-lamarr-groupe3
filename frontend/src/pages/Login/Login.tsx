import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faKey } from "@fortawesome/free-solid-svg-icons";
import styles from "../../style/form.module.scss";

export interface FormProps {
  email: string;
  password: string;
}

const Login = () => {
  // const {setIsAuthenticated} = useContext(UserContext);
  const [error, setError] = useState<string>("");
  const { handleSubmit, register } = useForm<FormProps>();
  const navigate = useNavigate();
  const onSubmit = async (userData: FormProps) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (response.status !== 200) {
        setError("Identifiants incorrects");
        return;
      }

      navigate("/");

      /* if(data.token) {
        localStorage.setItem("jwt_autorization", data.token)
        navigate("/")
        return
      } */
    } catch (error) {
      console.log(error);
    }
  };

  if (
    localStorage.getItem("jwt_autorization") &&
    localStorage.getItem("jwt_autorization") !== undefined
  ) {
    navigate("/");
  }
  // Ici, on ajoute la logique de connexion.
  // On se base sur `data` pour faire la requête à l'API.
  // Si la requête est un succès, on met à jour le contexte
  // avec la fonction `setIsAuthenticated` et on redirige vers la page d'accueil.

  return (
    <section className={styles.section_login}>
      <h2 className={styles.h2_login}>De retour ?</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h3>Connexion</h3>

        <div className="input-wrapper">
          <FontAwesomeIcon icon={faAt} className="icon" />
          <input
            type="text"
            placeholder="Adresse mail"
            {...register("email", {
              required: "Vous devez renseigner ce champ",
            })}
          />
        </div>
        {/* {errors.email && <p className="error">{errors.email.message}</p>} */}

        <div className="input-wrapper">
          <FontAwesomeIcon icon={faKey} className="icon" />
          <input
            type="password"
            placeholder="Mot de passe"
            {...register("password", {
              required: "Vous devez renseigner ce champ",
            })}
          />
        </div>
        {/* {errors.password && <p className="error">{errors.password.message}</p>} */}

        <input type="submit" value="Explorer" />
        <Link to="/register">
          Vous n’avez pas de compte ? Créez en un juste ici !
        </Link>
        <span>Téléchargez l’application ici !</span>
        <div id="logoStore-wrapper">
          <img src="/appleDownload.svg" alt="Apple Store" />
          <img src="/google-play-badge.png" alt="Google Store" />
        </div>
      </form>
    </section>
  );
};

export default Login;
