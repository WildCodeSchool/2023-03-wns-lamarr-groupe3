import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardType, Category, City, Poi } from "../../utils/types";
import Caroussel from "../../components/common/Caroussel/Caroussel";
import styles from "./poiListView.module.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { HashLink } from "react-router-hash-link";

const PoiListView = () => {
  const { cityId } = useParams();
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [searchedPoi, setSearchedPoi] = useState<Poi[] | null>(null);

  const getCity = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cities/${cityId}`
      );
      const data = await response.json();

      setCurrentCity(data);
      const filteredPoi = data.poi.filter(
        (poi: Poi) => poi.isAccepted === true
      );
      setSearchedPoi(filteredPoi ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  let categories: Category[] = [];
  const poiCategories =
    currentCity
      ?.poi!.filter((poi) => poi.isAccepted === true)
      .map((poi) => poi.category) ?? [];

  // Filter categories to avoid duplicates
  const filterCategories = () => {
    poiCategories.forEach((cat) => {
      if (!categories.find((category) => category.id === cat.id)) {
        categories.push(cat);
      }
    });
  };

  filterCategories();

  const getPoiByCityAndCategory = async (
    categoryName?: string,
    cityName?: string
  ): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/poi?city=${cityName}&category=${categoryName}`
      );
      const data = await response.json();
      console.log({ data });

      if (!data.error) {
        setSearchedPoi(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  return (
    <section className={styles.container}>
      <div>
        <div className={styles.header}>
          <HashLink smooth to="/#cities">
            <button className={styles.previousButton} aria-label="return">
              <FaArrowLeftLong className={styles.arrow} /> Retour
            </button>
          </HashLink>

          <h1>{currentCity?.name}</h1>
        </div>

        {categories && (
          <div className={styles.categories}>
            <Caroussel
              title="Catégories"
              data={categories}
              cardType={CardType.CATEGORY}
              onClickCategory={getPoiByCityAndCategory}
              currentCity={currentCity}
            />
          </div>
        )}
        {searchedPoi && currentCity && (
          <div className={styles.poiList}>
            <Caroussel
              title={`${searchedPoi.length} ${
                searchedPoi.length > 1
                  ? "points d'intérêt trouvés"
                  : "point d'intérêt trouvé"
              } `}
              data={searchedPoi}
              cardType={CardType.POI}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default PoiListView;
