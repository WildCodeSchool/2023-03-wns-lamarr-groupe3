import { useContext, useEffect, useState } from "react";
import { UsersContext } from "../../contexts/UserContext";
import style from "./profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { User, CardType } from "../../utils/types";
import InputFormProfile from "./InputFormProfile";
import Modal from "../../components/common/modals/Modal";
import ImageModal from "../../components/common/modals/ImageModal";
import PasswordModal from "../../components/common/modals/PasswordModal";
import Caroussel from "../../components/common/Caroussel/Caroussel";
import { handleFormErrors } from "../../utils/handleFormError";
import useWindowDimensions from "../../utils/hooks/useWindowDimensions";
import { Navigate, useNavigate, Link } from "react-router-dom";
export interface IDisableInputs {
  city: boolean;
  email: boolean;
  password: boolean;
  username: boolean;
  bio: boolean;
}

export interface IDisplayModals {
  validation: boolean;
  image?: boolean;
  deleteUser?: boolean;
  password?: boolean;
  error: boolean;
}
export interface IError {
  message: string;
  status: boolean;
}

const Profile = () => {
  const windowSize = useWindowDimensions();
  const navigate = useNavigate();

  // get profile
  const { profile, isAuthenticated } = useContext(UsersContext);
  const [displayEditImg, setDisplayEditImg] = useState<boolean>(false);
  const [displayModals, setDisplayModals] = useState<IDisplayModals>({
    validation: false,
    image: false,
    deleteUser: false,
    password: false,
    error: false,
  });
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [disableInputs, setDisableInputs] = useState<IDisableInputs>({
    city: true,
    email: true,
    password: true,
    username: true,
    bio: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: IError }>({
    city: { message: "", status: false },
    email: { message: "", status: false },
    username: { message: "", status: false },
    bio: { message: "", status: false },
  });

  const imageURL: string | undefined = profile?.image
    ? profile?.image?.slice(1)
    : undefined;

  useEffect(() => {
    if (profile !== null) setUserInfo(profile);
    if (!isAuthenticated) navigate("/");
  }, [profile, isAuthenticated]);

  return (
    <div className={style.profilePage}>
      {displayModals.validation ? (
        <Modal
          setDisplayModals={setDisplayModals}
          displayModals={displayModals}
          type="validation"
        />
      ) : null}
      {displayModals.error ? (
        <Modal
          setDisplayModals={setDisplayModals}
          displayModals={displayModals}
          type="error"
        />
      ) : null}
      {displayModals.image ? (
        <ImageModal
          setDisplayModals={setDisplayModals}
          displayModals={displayModals}
          userInfo={userInfo}
        />
      ) : null}
      {displayModals.password ? (
        <PasswordModal
          setDisplayModals={setDisplayModals}
          displayModals={displayModals}
        />
      ) : null}
      {displayModals.deleteUser ? (
        <Modal
          setDisplayModals={setDisplayModals}
          displayModals={displayModals}
          type="deleteUser"
        />
      ) : null}
      <section className={style.formSection}>
        <div className={style.profileAvatarAndName}>
          <div className={style.avatarImg}>
            {imageURL !== undefined ? (
              <>
                <img
                  src={`http://localhost:5000${imageURL}`}
                  alt="avatar"
                  className={displayEditImg ? style.imageOpacity : undefined}
                  onMouseOver={() => setDisplayEditImg(true)}
                  onMouseOut={() => setDisplayEditImg(false)}
                />
                {displayEditImg && (
                  <FontAwesomeIcon
                    icon={faPen}
                    className={style.iconEditImg}
                    onMouseOver={() => setDisplayEditImg(true)}
                    onClick={() =>
                      setDisplayModals({ ...displayModals, image: true })
                    }
                  />
                )}
              </>
            ) : (
              <>
                <div
                  onMouseOver={() => setDisplayEditImg(true)}
                  onMouseOut={() => setDisplayEditImg(false)}
                >
                  {profile?.username.substring(0, 1).toUpperCase()}
                </div>
                {displayEditImg && (
                  <FontAwesomeIcon
                    icon={faPen}
                    className={style.iconEditImg}
                    onMouseOver={() => setDisplayEditImg(true)}
                    onClick={() =>
                      setDisplayModals({ ...displayModals, image: true })
                    }
                  />
                )}
              </>
            )}
          </div>
          <p>{profile?.username.toUpperCase()}</p>
        </div>
        <form>
          <div className={style.formColumns}>
            <InputFormProfile
              disableInputs={disableInputs}
              setDisableInputs={setDisableInputs}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              type="text"
              name="city"
              title="ville"
              setDisplayModals={setDisplayModals}
              displayModals={displayModals}
              errors={errors}
              setErrors={setErrors}
            />
            <InputFormProfile
              disableInputs={disableInputs}
              setDisableInputs={setDisableInputs}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              type="text"
              name="email"
              title="adresse email"
              setDisplayModals={setDisplayModals}
              displayModals={displayModals}
              errors={errors}
              setErrors={setErrors}
            />
            <div>
              <label htmlFor="password">MOT DE PASSE</label>
              <input
                type="password"
                name="password"
                id="password"
                value="⚈⚈⚈⚈⚈⚈⚈⚈⚈⚈⚈⚈⚈⚈⚈"
                disabled={disableInputs.password}
              />
              <FontAwesomeIcon
                icon={faPen}
                className={style.icon}
                onClick={() =>
                  setDisplayModals({ ...displayModals, password: true })
                }
              />
            </div>
          </div>
          <div className={style.formColumns}>
            <InputFormProfile
              disableInputs={disableInputs}
              setDisableInputs={setDisableInputs}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              type="text"
              name="username"
              title="pseudo"
              setDisplayModals={setDisplayModals}
              displayModals={displayModals}
              errors={errors}
              setErrors={setErrors}
            />
            <div>
              <label htmlFor="bio">BIOGRAPHIE</label>
              <textarea
                name="bio"
                id="bio"
                value={userInfo?.bio || ""}
                onChange={(event) => {
                  if (userInfo !== undefined && userInfo !== null)
                    setUserInfo({ ...userInfo, bio: event.target.value });
                }}
                disabled={disableInputs.bio}
              />
              {disableInputs.bio ? (
                <FontAwesomeIcon
                  icon={faPen}
                  className={style.icon}
                  onClick={() =>
                    setDisableInputs({ ...disableInputs, bio: false })
                  }
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  className={style.icon}
                  onClick={() =>
                    handleFormErrors({
                      userInfo,
                      setUserInfo,
                      disableInputs,
                      setDisableInputs,
                      displayModals,
                      setDisplayModals,
                      profile,
                      errors,
                      setErrors,
                    })
                  }
                />
              )}
              <div className={style.error}>
                {errors.bio.status ? <p>{errors.bio.message}</p> : null}
              </div>
            </div>
          </div>
        </form>
        <div className={style.buttonSection}>
          <Link to="/contribution">
            <button type="button">Suggérer un point d'intérêt</button>
          </Link>
          <button
            type="button"
            onClick={() =>
              setDisplayModals({ ...displayModals, deleteUser: true })
            }
          >
            Supprimer le compte
          </button>
        </div>
      </section>
      {windowSize > 768 ? (
        <>
          <section className={style.favoritesSection}>
            <h3 className="titleResearchDark">Mes favoris</h3>
            <div>
              <h4 className="profilNameDark">Points d'intérêts favoris</h4>
              {profile?.favouritePoi.length ? (
                <Caroussel
                  title=""
                  data={profile?.favouritePoi}
                  cardType={CardType.POI}
                />
              ) : (
                <p>Pas de favori pour l'instant !</p>
              )}
            </div>
            <div>
              <h4 className="profilNameDark">Villes favorites</h4>
              {profile?.favouriteCities.length ? (
                <Caroussel
                  title=""
                  data={profile?.favouriteCities}
                  cardType={CardType.CITY}
                />
              ) : (
                <p>Pas de favori pour l'instant !</p>
              )}
            </div>
          </section>
          <img src="/fond_vague_creme.svg" alt="wave" width="100%" />
        </>
      ) : null}
    </div>
  );
};

export default Profile;
