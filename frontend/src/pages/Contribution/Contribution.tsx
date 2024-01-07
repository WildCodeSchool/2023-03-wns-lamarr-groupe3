import styles from "./Contribution.module.scss";
import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import { Category, City } from "../../utils/types";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  city: string;
  coordinates: [longitude: string, latitude: string];
  category: string;
  file: string;
};

const Contribution = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const getCities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cities");
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCities();
    getCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (poiData: Inputs) => {
    console.log(poiData);
  };

  return (
    <Layout>
      <section className={styles.section_register}>
        <h2 className={styles.h2_register}>Une idée ?</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* <form className={styles.form}> */}
          <h3>Contribution</h3>

          <div className="input-wrapper">
            {
              // MAX 100 CHARACTERS
            }
            <input
              type="text"
              placeholder="Nom du point d'intérêt"
              {...register("name", {
                required: "Vous devez renseigner ce champ",
                maxLength: {
                  value: 100,
                  message: "Le nom doit faire 100 caractères maximum",
                },
              })}
            />
          </div>
          {errors.name && <p className="error">{errors.name.message}</p>}
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Description"
              {...register("description", {
                required: "Vous devez renseigner ce champ",
              })}
            />
          </div>
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Adresse"
              {...register("address", {
                required: "Vous devez renseigner ce champ",
              })}
            />
          </div>
          {errors.address && <p className="error">{errors.address.message}</p>}

          <div className="input-wrapper">
            <input
              type="tel"
              placeholder="Téléphone"
              {...register("phoneNumber", {
                required: "Vous devez renseigner ce champ",
                pattern: {
                  value:
                    /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}(?:\d{2}\1?){3}\d{2}$/,
                  message:
                    "Le numéro de téléphone n'est pas valide. Format : 0612345678",
                },
              })}
            />
          </div>
          {errors.phoneNumber && (
            <p className="error">{errors.phoneNumber.message}</p>
          )}

          <div className="input-wrapper">
            <select
              {...register("city", {
                required: "Vous devez renseigner ce champ",
              })}
            >
              <option>Choisir une ville</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id as string}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          {errors.city && <p className="error">{errors.city.message}</p>}

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Longitude"
              {...register("coordinates.0", {
                required: "Vous devez renseigner ce champ",
                pattern: {
                  value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/,
                  message: "La coordonnée n'est pas valide. Format : 43.123456",
                },
              })}
            />
          </div>
          {errors.coordinates?.[0] && (
            <p className="error">{errors.coordinates[0].message}</p>
          )}

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Latitude"
              {...register("coordinates.1", {
                required: "Vous devez renseigner ce champ",
                pattern: {
                  value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/,
                  message: "La coordonnée n'est pas valide. Format : 43.123456",
                },
              })}
            />
          </div>
          {errors.coordinates?.[1] && (
            <p className="error">{errors.coordinates[1].message}</p>
          )}

          <div className="input-wrapper">
            <select
              {...register("category", {
                required: "Vous devez renseigner ce champ",
              })}
            >
              <option>Choisir une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id as string}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="error">{errors.category.message}</p>
          )}

          <div className="input-wrapper">
            <input
              type="file"
              // {...register("username", {
              //   required: "Vous devez renseigner ce champ",
              // })}
            />
          </div>
          {/* {errors.username && <p className="error">{errors.username.message}</p>} */}
          <input type="submit" value="Contribuer" />
        </form>
      </section>
    </Layout>
  );
};

export default Contribution;
