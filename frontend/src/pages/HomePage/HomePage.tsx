import InteractiveMap from "../../components/interactiveMap/InteractiveMap";
import { useEffect, useState } from "react";
import SearchPOI from "../SearchPOI/SearchPOI";
import styles from "./homePage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

  function updateDimension() {
    setWindowSize(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimension);
  }, [windowSize]);

  return (
    <>
      {windowSize > 768 ? (
        <>
          <section className={`${styles.backgroundWave}`}>
            <div className={`presentationText ${styles.presentationSection} `}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
                blanditiis aperiam ad, aspernatur incidunt voluptatem ea
                molestias nemo rem ratione nesciunt neque corporis nihil
                recusandae cum minima. Id, voluptatum tenetur?
              </p>
              <button
                className={`buttonHomePage textButton ${styles.presentationButton}`}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Explorez
              </button>
            </div>
          </section>
          <section>
            <div className={`${styles.mapSection}`}>
              <InteractiveMap />
            </div>
            <div className={`${styles.pictoPlane}`}>
              <img src="/picto_avion.png" alt="picto avion" />
            </div>
          </section>
          <section className={`${styles.searchSection}`}>
            <SearchPOI />
          </section>
        </>
      ) : (
        <section className={`${styles.mobileSection}`}>
          <h1>CITY GUIDE</h1>
          <img src="/wave_with_map_mobile.svg" alt="wave with map" />
          <button
            className={`buttonHomePage textButton ${styles.presentationButton}`}
          >
            Explorez
          </button>
          <SearchPOI />
        </section>
      )}
    </>
  );
};

export default HomePage;
