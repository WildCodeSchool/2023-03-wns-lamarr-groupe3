// import React, { useContext } from 'react'
import Header from "../../components/common/header/Header";
import { UserContext, UserProvider } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "../../components/interactiveMap/InteractiveMap";
import { useContext, useEffect, useState } from "react";
import Footer from "../../components/common/footer/Footer";

const HomePage = () => {
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);

  function updateDimension() {
    setWindowSize(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimension);
  }, [windowSize]);

  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, logout } =
    useContext(UserContext);
  // On vérifie si l'utilisateur est connecté.
  if (
    !localStorage.getItem("jwt_autorization") ||
    localStorage.getItem("jwt_autorization") === undefined
  ) {
    setIsAuthenticated(false);
    navigate("/login");
    console.error(isAuthenticated + "erreur de connexion");
  } else setIsAuthenticated(true);

  return (
    <>
      <UserProvider>
        <Header size={windowSize > 768 ? "desktop" : "mobile"} />
        <div>
          <InteractiveMap />
        </div>
        <Footer />
      </UserProvider>
    </>
  );
};

export default HomePage;
