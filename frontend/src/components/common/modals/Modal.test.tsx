import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../../../contexts/UserContext";
import Modal from "./Modal";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageModal from "./ImageModal";
import { User, Role } from "../../../utils/types";
import PasswordModal from "./PasswordModal";

describe("Modal", () => {
  const setDisplayModals = jest.fn();
  const displayModals = {
    validation: false,
    image: false,
    deleteUser: false,
    password: false,
    error: false,
  };

  it("should render validation modal", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Modal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            type="validation"
          />
        </UserProvider>
      </BrowserRouter>
    );
  });

  it("validation modal contains validation text and close button", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Modal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            type="validation"
          />
        </UserProvider>
      </BrowserRouter>
    );

    const validationText = screen.getByText(/Modifications enregistrées/i);
    const closeButton = screen.getByText(/fermer/i);
    expect(validationText).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it("should render delete user modal", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Modal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            type="deleteUser"
          />
        </UserProvider>
      </BrowserRouter>
    );
  });

  it("delete user modal contains text and buttons", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Modal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            type="deleteUser"
          />
        </UserProvider>
      </BrowserRouter>
    );

    const deleteText = screen.getByText(
      /Êtes-vous sûr de vouloir supprimer ce compte ?/i
    );
    const validationButton = screen.getByText(/valider/i);
    const closeButton = screen.getByText(/fermer/i);
    expect(deleteText).toBeInTheDocument();
    expect(validationButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it("should render error modal", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Modal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            type="error"
          />
        </UserProvider>
      </BrowserRouter>
    );
  });

  it("error modal contains text and buttons", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Modal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            type="error"
          />
        </UserProvider>
      </BrowserRouter>
    );

    const deleteText = screen.getByText(
      /Erreur lors du remplissage du formulaire/i
    );
    const closeButton = screen.getByText(/fermer/i);
    expect(deleteText).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });
});

describe("ImageModal", () => {
  const setDisplayModals = jest.fn();
  const displayModals = {
    validation: false,
    image: false,
    deleteUser: false,
    password: false,
    error: false,
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

  it("should render image modal", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <ImageModal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            userInfo={mockedUser}
          />
        </UserProvider>
      </BrowserRouter>
    );
  });

  it("image modal contains text and buttons", async () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <ImageModal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
            userInfo={mockedUser}
          />
        </UserProvider>
      </BrowserRouter>
    );

    const imageText = screen.getByText(/Changer d'avatar/i);
    const validationButton = screen.getByText(/valider/i);
    const closeButton = screen.getByText(/fermer/i);
    expect(imageText).toBeInTheDocument();
    expect(validationButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });
});

describe("PasswordModal", () => {
  const setDisplayModals = jest.fn();
  const displayModals = {
    validation: false,
    image: false,
    deleteUser: false,
    password: false,
    error: false,
  };

  it("should render password modal", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <PasswordModal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
          />
        </UserProvider>
      </BrowserRouter>
    );
  });

  it("password modal contains text and buttons", async () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <PasswordModal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
          />
        </UserProvider>
      </BrowserRouter>
    );

    const passwordText = screen.getByText(/Changer de mot de passe/i);
    const validationButton = screen.getByText(/valider/i);
    const closeButton = screen.getByText(/fermer/i);
    const originalPWInput = screen.getByLabelText(/Mot de passe actuel/i);
    const newPWInput = screen.getByLabelText(/Nouveau mot de passe/i);
    expect(passwordText).toBeInTheDocument();
    expect(validationButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(originalPWInput).toBeInTheDocument();
    expect(newPWInput).toBeInTheDocument();
  });

  it("should change original password value on change", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <PasswordModal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
          />
        </UserProvider>
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(
      "Mot de passe actuel"
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Test" } });
    expect(passwordInput).toHaveValue("Test");
  });

  it("should change new password value on change", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <PasswordModal
            setDisplayModals={setDisplayModals}
            displayModals={displayModals}
          />
        </UserProvider>
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(
      "Nouveau mot de passe"
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Test" } });
    expect(passwordInput).toHaveValue("Test");
  });
});
