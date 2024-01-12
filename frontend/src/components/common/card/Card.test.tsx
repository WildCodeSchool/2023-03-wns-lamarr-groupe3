import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Card from "./Card";
import {
  CardType,
  Category,
  City,
  Poi,
  Role,
  User,
} from "../../../utils/types";
import { UsersContext } from "../../../contexts/UserContext";

const mockedCategory: Category = {
  image:
    "http://localhost:5000/api/cities/83985288-d7bb-4b51-a17b-dfc439c70662",
  name: "category test",
  id: "1",
  poi: null,
};

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

const mockedPoi: Poi = {
  id: "1234",
  name: "test",
  coordinates: { type: "point", coordinates: [0, 2] },
  description: "description test",
  address: "adresse test",
  image: "",
  category: mockedCategory,
  city: mockedCity,
  user: mockedUser,
};

describe("Card", () => {
  const onClick = jest.fn();
  const handleFavourite = jest.fn();
  const logout = jest.fn();
  const redirectToLogin = jest.fn();
  const checkUserSession = jest.fn();
  it("renders a card", () => {
    render(
      <Card
        data={mockedPoi}
        onClick={onClick}
        cardType={CardType.POI}
        handleFavourite={handleFavourite}
        isLiked={() => false}
      />
    );
  });

  it("calls a fonction when user clicks on card image", () => {
    render(
      <Card
        data={mockedPoi}
        onClick={onClick}
        cardType={CardType.POI}
        handleFavourite={handleFavourite}
        isLiked={() => false}
      />
    );
    fireEvent.click(screen.getByTestId("image-container"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe("when user is not logged in", () => {
    it("does not render a like button for city card", () => {
      render(
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
          <Card
            data={mockedCity}
            onClick={onClick}
            cardType={CardType.CITY}
            handleFavourite={handleFavourite}
            isLiked={() => false}
          />
        </UsersContext.Provider>
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("does not render a like button for poi card", () => {
      render(
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
          <Card
            data={mockedPoi}
            onClick={onClick}
            cardType={CardType.POI}
            handleFavourite={handleFavourite}
            isLiked={() => false}
          />
        </UsersContext.Provider>
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("does not render a like button for category card", () => {
      render(
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
          <Card
            data={mockedCategory}
            onClick={onClick}
            cardType={CardType.CATEGORY}
            handleFavourite={handleFavourite}
            isLiked={() => false}
          />
        </UsersContext.Provider>
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("when user is logged in", () => {
    it("renders a like button for city card", () => {
      render(
        <UsersContext.Provider
          value={{
            isAuthenticated: () => true,
            profile: null,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <Card
            data={mockedCity}
            onClick={onClick}
            cardType={CardType.CITY}
            handleFavourite={handleFavourite}
            isLiked={() => false}
          />
        </UsersContext.Provider>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders a like button with for poi card", () => {
      render(
        <UsersContext.Provider
          value={{
            isAuthenticated: () => true,
            profile: null,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <Card
            data={mockedPoi}
            onClick={onClick}
            cardType={CardType.POI}
            handleFavourite={handleFavourite}
            isLiked={() => false}
          />
        </UsersContext.Provider>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("does not render a like button for category card", () => {
      render(
        <UsersContext.Provider
          value={{
            isAuthenticated: () => true,
            profile: null,
            redirectToLogin,
            logout,
            loaded: false,
            checkUserSession,
          }}
        >
          <Card
            data={mockedCategory}
            onClick={onClick}
            cardType={CardType.CATEGORY}
            handleFavourite={handleFavourite}
            isLiked={() => false}
          />
        </UsersContext.Provider>
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    describe("when poi is liked", () => {
      it("should render a filled heart icon", () => {
        render(
          <UsersContext.Provider
            value={{
              isAuthenticated: () => true,
              profile: null,
              redirectToLogin,
              logout,
              loaded: false,
              checkUserSession,
            }}
          >
            <Card
              data={mockedPoi}
              onClick={onClick}
              cardType={CardType.POI}
              handleFavourite={handleFavourite}
              isLiked={() => true}
            />
          </UsersContext.Provider>
        );
        expect(screen.getByTestId("filled-heart")).toBeInTheDocument();
      });
    });

    describe("when poi is not liked", () => {
      it("should render an empty heart icon", () => {
        render(
          <UsersContext.Provider
            value={{
              isAuthenticated: () => true,
              profile: null,
              redirectToLogin,
              logout,
              loaded: false,
              checkUserSession,
            }}
          >
            <Card
              data={mockedPoi}
              onClick={onClick}
              cardType={CardType.POI}
              handleFavourite={handleFavourite}
              isLiked={() => false}
            />
          </UsersContext.Provider>
        );
        expect(screen.getByTestId("empty-heart")).toBeInTheDocument();
      });
    });

    describe("when user clicks on like button", () => {
      it("should call a function to handle favourites", () => {
        render(
          <UsersContext.Provider
            value={{
              isAuthenticated: () => true,
              profile: null,
              redirectToLogin,
              logout,
              loaded: false,
              checkUserSession,
            }}
          >
            <Card
              data={mockedPoi}
              onClick={onClick}
              cardType={CardType.POI}
              handleFavourite={handleFavourite}
              isLiked={() => false}
            />
          </UsersContext.Provider>
        );
        fireEvent.click(screen.getByRole("button"));
        expect(handleFavourite).toHaveBeenCalledTimes(1);
      });
    });
  });
});
