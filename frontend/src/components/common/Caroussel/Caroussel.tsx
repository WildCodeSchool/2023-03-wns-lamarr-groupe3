import React, { useContext, useRef, useState } from "react";
import { CardType, City, DataType, Poi } from "../../../utils/types";
import styles from "./caroussel.module.scss";
import Card from "../card/Card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";

import { useNavigate } from "react-router-dom";
import PoiView from "../../poiView/PoiView";
import { UsersContext } from "../../../contexts/UserContext";
import {
  removeFavouriteCityToUser,
  addFavouriteCityToUser,
  removeFavouritePoiToUser,
  addFavouritePoiToUser,
} from "../../../utils/api";
import useWindowDimensions from "../../../utils/hooks/useWindowDimensions";

interface Props {
  title: string;
  data: DataType;
  cardType: CardType;
  onClickCategory?: (categoryName: string, cityName: string) => void;
  currentCity?: City | null;
}

const Caroussel = ({
  title,
  data,
  cardType,
  onClickCategory,
  currentCity,
}: Props) => {
  const navigate = useNavigate();
  const { profile } = useContext(UsersContext);
  const userId = profile?.id ?? "";

  const [categorySelected, setCategorySelected] = useState<string | null>(null);
  const [poiModaleOpen, setPoiModaleOpen] = useState<string | null>(null);

  // On stocke la taille de la fenêtre pour gérer le responsive
  const windowSize = useWindowDimensions();

  // On récupère les ids des villes et poi préférés de l'utilisateur et on les stocke dans un state

  let favouriteCitiesId: string[] = [];
  let favouritePoiId: string[] = [];

  if (profile != null) {
    favouriteCitiesId = profile.favouriteCities?.map((city) => city.id!);
    favouritePoiId = profile.favouritePoi.map((poi) => poi.id!);
  }

  const [favouriteCities, setFavouriteCities] =
    useState<string[]>(favouriteCitiesId);

  const [favouritePoi, setFavouritePoi] = useState<string[]>(favouritePoiId);

  // On gère l'ajout/retrait de villes et poi favoris selon le type de card
  const handleUserFavouriteCities = (
    cityId: string,
    userId: string,
    favouriteCities: string[]
  ) => {
    if (favouriteCities != null) {
      if (favouriteCities.find((city) => city === cityId)) {
        removeFavouriteCityToUser(cityId, userId);
        setFavouriteCities((state) => state!.filter((city) => city !== cityId));
      } else {
        addFavouriteCityToUser(cityId, userId);
        setFavouriteCities((state) => [...state, cityId]);
      }
    }
  };

  const handleUserFavouritePoi = (
    poiId: string,
    userId: string,
    favouritePoi: string[]
  ) => {
    if (favouritePoi != null) {
      if (favouritePoi.find((poi) => poi === poiId)) {
        removeFavouritePoiToUser(poiId, userId);
        setFavouritePoi((state) => state.filter((poi) => poi !== poiId));
      } else {
        addFavouritePoiToUser(poiId, userId);
        setFavouritePoi((state) => [...state, poiId]);
      }
    }
  };

  const handleFavourite = (id: string | null, cardType: CardType) => {
    console.log(id);
    if (cardType === CardType.CITY && id != null) {
      handleUserFavouriteCities(id, userId, favouriteCities);
    }
    if (cardType === CardType.POI && id != null) {
      handleUserFavouritePoi(id, userId, favouritePoi);
    }
  };

  const isLiked = (id: string | null): boolean => {
    if (id != null) {
      if (cardType === CardType.CITY) {
        return favouriteCities.includes(id);
      }
      if (cardType === CardType.POI) {
        return favouritePoi.includes(id);
      }
    }

    return false;
  };

  // Actions modale POI
  const openModalePoi = (id: string) => {
    setPoiModaleOpen(id);
  };

  const closeModalePoi = () => {
    setPoiModaleOpen(null);
  };

  const selectActionOnCardClick = (id: string, name: string) => {
    switch (cardType) {
      case CardType.CITY:
        navigate(`/poi/${id}`);
        break;
      case CardType.CATEGORY:
        if (currentCity != null) {
          onClickCategory!(name, currentCity?.name);
        }
        setCategorySelected(id);
        break;
    }
  };

  // CONFIG SLIDER

  const slider = useRef<any>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: windowSize > 768 ? 4 : 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const cards = data.map((item) => {
    console.log(item);
    return (
      <Card
        data={item}
        key={item.id}
        cardType={cardType}
        onClick={() => selectActionOnCardClick(item.id!, item.name)}
        categorySelected={categorySelected}
        currentCity={currentCity}
        handleFavourite={handleFavourite}
        isLiked={isLiked}
      />
    );
  });

  const renderCards = () => {
    switch (cardType) {
      case CardType.CATEGORY:
        if (data.length > 4 || windowSize < 768) {
          return (
            <div className={styles.slider}>
              <button
                className={`${styles.arrow} ${styles.prevArrow}`}
                onClick={() => slider?.current?.slickPrev()}
              >
                <IoIosArrowDropleftCircle />
              </button>
              <Slider ref={slider} {...settings}>
                {cards as any}
              </Slider>
              <button
                className={`${styles.arrow} ${styles.nextArrow}`}
                onClick={() => slider?.current?.slickNext()}
              >
                <IoIosArrowDroprightCircle />
              </button>
            </div>
          );
        } else {
          return (
            <div className={styles.cardsContainer}>
              {data.map((item) => {
                return (
                  <>
                    <Card
                      data={item}
                      key={item.id}
                      cardType={cardType}
                      onClick={() =>
                        selectActionOnCardClick(item.id!, item.name)
                      }
                      categorySelected={categorySelected}
                      currentCity={currentCity}
                      handleFavourite={handleFavourite}
                      isLiked={isLiked}
                    />
                  </>
                );
              })}
            </div>
          );
        }
      case CardType.POI:
        return (
          <div className={styles.cardsContainer}>
            {data.map((item) => {
              return (
                <PoiView
                  key={item.id}
                  poi={item as Poi}
                  modaleOpen={poiModaleOpen}
                  openOnClick={openModalePoi}
                  onClose={closeModalePoi}
                  handleFavourite={handleFavourite}
                  isLiked={isLiked}
                />
              );
            })}
          </div>
        );
      case CardType.CITY:
        return (
          <div className={styles.cardsContainer}>
            {data.map((item) => {
              return (
                <Card
                  data={item}
                  key={item.id}
                  cardType={cardType}
                  onClick={() => selectActionOnCardClick(item.id!, item.name)}
                  categorySelected={categorySelected}
                  currentCity={currentCity}
                  handleFavourite={handleFavourite}
                  isLiked={isLiked}
                />
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {renderCards()}
    </div>
  );
};

export default Caroussel;
