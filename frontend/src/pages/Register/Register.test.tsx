import Register from "./Register";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("ContactPage", () => {
  it("should render", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  });

  it("should change email value on change", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(
      "Adresse mail"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "Test" } });
    expect(emailInput).toHaveValue("Test");
  });

  it("should change username value on change", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(
      "Nom d'utilisateur"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "Test" } });
    expect(emailInput).toHaveValue("Test");
  });

  it("should change password value on change", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Mot de passe"
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Test" } });
    expect(passwordInput).toHaveValue("Test");
  });

  it("should have an submit button", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const submitButton = screen.getByText("Explorer");
    expect(submitButton).toBeInTheDocument();
  });
});
