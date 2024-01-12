import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Profile from "./Profile";
import { Category, City, Poi, Role, User } from "../../utils/types";
import { UserProvider } from "../../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";

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

describe("Profile", () => {
  it("renders the profile", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Profile />
        </UserProvider>
      </BrowserRouter>
    );
  });
});
