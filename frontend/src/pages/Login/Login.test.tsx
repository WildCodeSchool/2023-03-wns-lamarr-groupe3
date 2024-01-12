import Login from "./Login";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("ContactPage", () => {
  it("should render", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  it("should change email value on change", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(
      "Adresse mail"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "Test" } });
    expect(emailInput).toHaveValue("Test");
  });

  it("should change password value on change", () => {
    render(
      <BrowserRouter>
        <Login />
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
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByText("Explorer");
    expect(submitButton).toBeInTheDocument();
  });
});
