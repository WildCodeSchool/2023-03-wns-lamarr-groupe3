import { BrowserRouter } from "react-router-dom";
import { UsersContext } from "../../../contexts/UserContext";
import Header from "./Header";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { User, Role } from "../../../utils/types";

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

describe("Header", () => {
  const logout = jest.fn();
  const redirectToLogin = jest.fn();
  const checkUserSession = jest.fn();
  it("should render in desktop", () => {
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
          <Header size="desktop" />
        </UsersContext.Provider>
      </BrowserRouter>
    );
  });

  it("should render in mobile", () => {
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
          <Header size="mobile" />
        </UsersContext.Provider>
      </BrowserRouter>
    );
  });

  it("should display Connexion button if no profile in desktop", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => false,
            profile: null,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <Header size="desktop" />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    const connexionButton = screen.getByText(/Connexion/i);
    expect(connexionButton).toBeInTheDocument();
    fireEvent.click(connexionButton);
  });

  it("should display user menu if profile, in desktop", () => {
    render(
      <BrowserRouter>
        <UsersContext.Provider
          value={{
            isAuthenticated: () => false,
            profile: mockedUser,
            redirectToLogin,
            logout,
            loaded: true,
            checkUserSession,
          }}
        >
          <Header size="desktop" />
        </UsersContext.Provider>
      </BrowserRouter>
    );

    const userMenu = screen.getByRole("button");
    fireEvent.click(userMenu);
    const profileLink = screen.getByText(/mon profil/i);
    const logoutLink = screen.getByText(/se déconnecter/i);
    expect(profileLink).toBeInTheDocument();
    expect(logoutLink).toBeInTheDocument();
  });
});
