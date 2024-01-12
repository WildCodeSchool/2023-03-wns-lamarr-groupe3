import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faKey } from "@fortawesome/free-solid-svg-icons";
import styles from "../../style/form.module.scss";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";
import { useContext } from "react";
import { UsersContext } from "../../contexts/UserContext";

export interface FormProps {
  email: string;
  password: string;
}

const Login = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<FormProps>();
  const navigate = useNavigate();
  const windowSize = useWindowDimensions();
  const { checkUserSession } = useContext(UsersContext);
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

      const data = await response.json();

      if (data.error) {
        setError("password", {
          type: "custom",
          message: data.error,
        });
      }

      if (response.status !== 201) {
        Object.keys(data.errors).forEach((error) => {
          setError(error as keyof FormProps, {
            message: data.errors[error],
          });
        });
        return;
      } else {
        checkUserSession();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Ici, on ajoute la logique de connexion.
  // On se base sur `data` pour faire la requête à l'API.
  // Si la requête est un succès, on met à jour le contexte
  // avec la fonction `setIsAuthenticated` et on redirige vers la page d'accueil.

  return (
    <section className={styles.section_login}>
      {windowSize > 768 ? (
        <h2 className={styles.h2_login}>De retour ?</h2>
      ) : null}
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
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input type="submit" value="Explorer" />
        <Link to="/auth/register">
          Vous n’avez pas de compte ? Créez en un juste ici !
        </Link>
        {windowSize > 768 ? (
          <>
            <span>Téléchargez l’application ici !</span>
            <div id="logoStore-wrapper">
              <img src="/appleDownload.svg" alt="Apple Store" />
              <img src="/google-play-badge.png" alt="Google Store" />
            </div>
          </>
        ) : null}
      </form>
    </section>
  );
};

export default Login;
