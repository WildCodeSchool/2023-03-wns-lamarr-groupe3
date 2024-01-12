import { BrowserRouter } from "react-router-dom";
import { UsersContext } from "../../contexts/UserContext";
import ModalePOI from "./modalePOI";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { User, Role, Poi, Category, City } from "../../utils/types";

describe("ModalePOI", () => {
  const mockedUser: User = {
    id: "1",
    username: "user test",
    email: "email test",
    image: "",
    role: Role.FREE_USER,
    city: null,
    bio: null,
    createdPoi: [],
    favouritePoi: [],
    favouriteCities: [],
  };

  const mockedCity: City = {
    id: "1",
    name: "ville test",
    image: "",
    coordinates: { type: "point", coordinates: [0, 5] },
    poi: null,
    users: null,
    userAdminCity: null,
  };

  const mockedCategory: Category = {
    image:
      "http://localhost:5000/api/cities/83985288-d7bb-4b51-a17b-dfc439c70662",
    name: "category test",
    id: "1",
    poi: null,
  };

  const mockedPoi: Poi = {
    id: "1234",
    name: "test",
    coordinates: { type: "point", coordinates: [0, 2] },
    description: "test",
    address: "test",
    image: "",
    phoneNumber: "0123456789",
    category: mockedCategory,
    city: mockedCity,
    user: mockedUser,
  };

  const onClose = jest.fn();
  const handleFavourite = jest.fn();
  const isLiked = jest.fn();
  const logout = jest.fn();
  const redirectToLogin = jest.fn();
  const checkUserSession = jest.fn();

  it("should render validation modal", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => false,
            profile: null,
            redirectToLogin,
            logout,
            loaded: false,
            checkUserSession,
          }}
        >
          <ModalePOI
            poi={mockedPoi}
            onClose={onClose}
            handleFavourite={handleFavourite}
            isLiked={isLiked}
          />
        </UsersContext.Provider>
      </BrowserRouter>
    );
  });

  it("should render map button", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => false,
            profile: null,
            redirectToLogin,
            logout,
            loaded: false,
            checkUserSession,
          }}
        >
          <ModalePOI
            poi={mockedPoi}
            onClose={onClose}
            handleFavourite={handleFavourite}
            isLiked={isLiked}
          />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    const mapButton = screen.getByText(/Voir sur la carte/i);
    expect(mapButton).toBeInTheDocument();
  });

  it("should render connexion button when profile null", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => false,
            profile: null,
            redirectToLogin,
            logout,
            loaded: false,
            checkUserSession,
          }}
        >
          <ModalePOI
            poi={mockedPoi}
            onClose={onClose}
            handleFavourite={handleFavourite}
            isLiked={isLiked}
          />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    const connexionButton = screen.getByText(/Connexion/i);
    expect(connexionButton).toBeInTheDocument();
  });

  it("should NOT render connexion button when profile null", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => true,
            profile: mockedUser,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <ModalePOI
            poi={mockedPoi}
            onClose={onClose}
            handleFavourite={handleFavourite}
            isLiked={isLiked}
          />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("button", { name: "Connexion" })
    ).not.toBeInTheDocument();
  });

  it("should display POI infos when user connected", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => true,
            profile: mockedUser,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <ModalePOI
            poi={mockedPoi}
            onClose={onClose}
            handleFavourite={handleFavourite}
            isLiked={isLiked}
          />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    const addressText = screen.getByText(/Adresse/i);
    const phoneNb = screen.getByText(/Numéro de téléphone/i);
    const gpsCoords = screen.getByText(/Coordonnées GPS/i);
    const descriptionText = screen.getByText(/Description/i);
    expect(addressText).toBeInTheDocument();
    expect(phoneNb).toBeInTheDocument();
    expect(gpsCoords).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
  });

  it("should display favorite button", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => true,
            profile: mockedUser,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <ModalePOI
            poi={mockedPoi}
            onClose={onClose}
            handleFavourite={handleFavourite}
            isLiked={isLiked}
          />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    const likeButton = screen.getByTestId("like-button");
    expect(likeButton).toBeInTheDocument();
    fireEvent.click(likeButton);
    expect(handleFavourite).toHaveBeenCalledTimes(1);
  });
});
