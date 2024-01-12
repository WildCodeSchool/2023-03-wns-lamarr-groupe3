import ContactPage from "./ContactPage";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("ContactPage", () => {
  it("should render", () => {
    render(<ContactPage />);
  });

  it("should change email value on change", () => {
    render(<ContactPage />);

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "Test" } });
    expect(emailInput).toHaveValue("Test");
  });

  it("should change title value on change", () => {
    render(<ContactPage />);

    const titleInput = screen.getByLabelText("Titre") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "Test" } });
    expect(titleInput).toHaveValue("Test");
  });

  it("should change Message value on change", () => {
    render(<ContactPage />);

    const messageInput = screen.getByLabelText("Message") as HTMLInputElement;
    fireEvent.change(messageInput, { target: { value: "Test" } });
    expect(messageInput).toHaveValue("Test");
  });
});
