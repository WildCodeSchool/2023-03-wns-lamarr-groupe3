import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "../../../contexts/UserContext";
import Footer from "./Footer";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Footer", () => {
  it("should render", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Footer />
        </UserProvider>
      </BrowserRouter>
    );
  });

  it("should navigate to contact page", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Footer />
        </UserProvider>
      </BrowserRouter>
    );
    const contactButton = screen.getByText(/Nous contacter/i);
    expect(contactButton).toBeInTheDocument();
    fireEvent.click(contactButton);
  });

  it("should navigate to faq page", () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Footer />
        </UserProvider>
      </BrowserRouter>
    );
    const faqButton = screen.getByText(/FAQ/i);
    expect(faqButton).toBeInTheDocument();
    fireEvent.click(faqButton);
  });
});
