import style from "./profile.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../utils/types";
import { IDisableInputs, IDisplayModals, IError } from "./Profile";
import { useContext } from "react";
import { UsersContext } from "../../contexts/UserContext";
import { handleFormErrors } from "../../utils/handleFormError";

interface Props {
  disableInputs: IDisableInputs;
  setDisableInputs: (arg0: IDisableInputs) => void;
  userInfo: User | null;
  setUserInfo: (arg0: User) => void;
  type: string;
  name: keyof User | keyof IDisableInputs;
  title: string;
  setDisplayModals: (arg0: IDisplayModals) => void;
  displayModals: IDisplayModals;
  errors: { [key: string]: IError };
  setErrors: (arg0: { [key: string]: IError }) => void;
}

const InputFormProfile = ({
  disableInputs,
  setDisableInputs,
  userInfo,
  setUserInfo,
  type,
  name,
  title,
  setDisplayModals,
  displayModals,
  errors,
  setErrors,
}: Props) => {
  // resolve conflict between keyof User types and value attribute types
  let value: string | number | undefined | string[];
  if (typeof userInfo?.[name as keyof User] === "string") {
    value = userInfo?.[name as keyof User]?.toString();
  }
  const { profile } = useContext(UsersContext);

  return (
    userInfo && (
      <div>
        <label htmlFor={name}>{title.toUpperCase()}</label>
        <input
          type={type}
          name={name}
          id={name}
          value={value || ""}
          onChange={(event) => {
            if (userInfo !== null)
              setUserInfo({
                ...userInfo,
                [name]: event.target.value,
              });
          }}
          disabled={disableInputs[name as keyof IDisableInputs]}
        />
        {disableInputs[name as keyof IDisableInputs] ? (
          <FontAwesomeIcon
            icon={faPen}
            className={style.icon}
            onClick={() =>
              setDisableInputs({ ...disableInputs, [name]: false })
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
          {errors[name].status ? <p>{errors[name].message}</p> : null}
        </div>
      </div>
    )
  );
};

export default InputFormProfile;
